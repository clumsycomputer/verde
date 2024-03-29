import {
  throwInvalidPathError,
  throwUserError,
} from '../../../helpers/throwError.ts';
import { FileSystem } from '../../../imports/FileSystem.ts';
import { Path } from '../../../imports/Path.ts';
import { DataModel, DataSchema } from '../../schema/types/DataSchema.ts';
import { RecordUuid } from '../helpers/createRecordUuid.ts';
import {
  getEncodedBoolean,
  getEncodedNumber,
  getEncodedString,
  getEncodedUint32,
} from '../helpers/getEncodedData.ts';
import {
  FiledShallowWellFormedRecord,
  isShallowWellFormedRecord,
  NewShallowWellFormedRecord,
  ShallowWellFormedRecord,
} from '../helpers/isShallowWellFormedRecord.ts';

export interface WriteRecordApi {
  tableFileResultBufferSize: number;
  tableFileFinishlineSize: number;
  dataDirectoryPath: string;
  dataSchema: DataSchema;
  dataRecord: Record<string, unknown>;
}

export async function writeRecord(
  api: WriteRecordApi,
): Promise<FiledShallowWellFormedRecord> {
  const {
    dataRecord,
    dataDirectoryPath,
    dataSchema,
    tableFileResultBufferSize,
    tableFileFinishlineSize,
  } = api;
  if (false === isShallowWellFormedRecord(dataRecord)) {
    throwUserError('writeRecord.dataRecord');
  }
  const transactionDirectoryPath = Path.join(
    dataDirectoryPath,
    './__transaction',
  );
  await FileSystem.emptyDir(transactionDirectoryPath);
  const filedRecordResult: FiledShallowWellFormedRecord = {
    ...dataRecord,
    __status: 'filed',
    __fileIndex: NaN,
  };
  const transactionState: TransactionState = {
    unresolvedNewRecordFileIndexByteWindows: {},
    tableHeadIndexCache: {},
    completedRowOperations: {},
    rowOperationsQueue: [{
      operationSourceRecord: dataRecord,
      operationFiledRecordResult: filedRecordResult,
    }],
    tableFileEntriesMap: {},
  };
  for (const someTableRowOperation of transactionState.rowOperationsQueue) {
    const { operationSourceRecord, operationFiledRecordResult } =
      someTableRowOperation;
    await writeTableRow({
      dataDirectoryPath,
      dataSchema,
      tableFileResultBufferSize,
      tableFileFinishlineSize,
      transactionDirectoryPath,
      transactionState,
      operationSourceRecord,
      operationFiledRecordResult,
    });
    const subLeafCompletedRowOperations = transactionState
      .completedRowOperations[operationSourceRecord.__uuid[0]] ?? {};
    subLeafCompletedRowOperations[operationSourceRecord.__uuid[1]] =
      someTableRowOperation;
    transactionState.completedRowOperations[operationSourceRecord.__uuid[0]] =
      subLeafCompletedRowOperations;
  }
  await commitRecordTransaction({
    dataDirectoryPath,
    transactionDirectoryPath,
    transactionState,
  });
  return filedRecordResult;
}

interface TableRowOperation {
  operationSourceRecord: ShallowWellFormedRecord;
  operationFiledRecordResult: FiledShallowWellFormedRecord;
}

interface WriteTableRowApi extends
  Pick<
    WriteRecordApi,
    | 'tableFileResultBufferSize'
    | 'tableFileFinishlineSize'
    | 'dataSchema'
    | 'dataDirectoryPath'
  >,
  Pick<
    TableRowOperation,
    'operationSourceRecord' | 'operationFiledRecordResult'
  > {
  transactionDirectoryPath: string;
  transactionState: TransactionState;
}

interface TransactionState {
  unresolvedNewRecordFileIndexByteWindows: Record<
    number,
    Record<
      number,
      Array<{
        windowModelSymbol: DataModel['modelSymbol'];
        windowFileIndex: number;
        windowRecordUuid: RecordUuid;
        windowRowByteOffset: number;
      }>
    >
  >;
  rowOperationsQueue: Array<TableRowOperation>;
  tableHeadIndexCache: Record<string, number>;
  completedRowOperations: Record<number, Record<number, TableRowOperation>>;
  tableFileEntriesMap: Record<string, {
    tableModelSymbol: string;
    tableFileIndex: number;
  }>;
}

async function writeTableRow(api: WriteTableRowApi) {
  const {
    dataSchema,
    operationSourceRecord,
    dataDirectoryPath,
    tableFileResultBufferSize,
    operationFiledRecordResult,
    tableFileFinishlineSize,
    transactionDirectoryPath,
    transactionState,
  } = api;
  const recordModel =
    dataSchema.schemaMap[operationSourceRecord.__modelSymbol] ??
      throwUserError('recordModel');
  const tableDirectoryPath = Path.join(
    dataDirectoryPath,
    `./${recordModel.modelSymbol}`,
  );
  const tableFileBytesResult = new Uint8Array(tableFileResultBufferSize);
  const currentTableFileByteOffset = { value: 0 };
  const { tableFileIndex } = operationSourceRecord.__status === 'new'
    ? await createTableRow({
      operationSourceRecord,
      operationFiledRecordResult,
      tableFileFinishlineSize,
      transactionDirectoryPath,
      transactionState,
      recordModel,
      tableDirectoryPath,
      tableFileBytesResult,
      currentTableFileByteOffset,
    })
    : await updateTableRow();
  const transactionTableFilePath = Path.join(
    transactionDirectoryPath,
    `./${recordModel.modelSymbol}__${tableFileIndex}.data`,
  );
  await Deno.writeFile(
    transactionTableFilePath,
    tableFileBytesResult.subarray(0, currentTableFileByteOffset.value),
    { create: true },
  );
  operationFiledRecordResult.__fileIndex = tableFileIndex;
  transactionState
    .tableFileEntriesMap[`${recordModel.modelSymbol}__${tableFileIndex}`] = {
      tableModelSymbol: recordModel.modelSymbol,
      tableFileIndex: tableFileIndex,
    };
}

interface CreateTableRowApi extends
  Pick<
    WriteTableRowApi,
    | 'transactionState'
    | 'transactionDirectoryPath'
    | 'tableFileFinishlineSize'
    | 'operationFiledRecordResult'
  > {
  operationSourceRecord: NewShallowWellFormedRecord;
  recordModel: DataModel;
  tableDirectoryPath: string;
  tableFileBytesResult: Uint8Array;
  currentTableFileByteOffset: { value: number };
}

async function createTableRow(api: CreateTableRowApi) {
  const {
    tableFileFinishlineSize,
    transactionDirectoryPath,
    tableDirectoryPath,
    transactionState,
    recordModel,
    operationSourceRecord,
    operationFiledRecordResult,
    tableFileBytesResult,
    currentTableFileByteOffset,
  } = api;
  const { tableHeadIndex, sourceTableHeadBytes } =
    await retrieveSourceTableHead({
      tableFileFinishlineSize,
      transactionDirectoryPath,
      tableDirectoryPath,
      transactionState,
      recordModel,
    });
  await backfillUnresolvedNewRecordFileIndexByteWindows({
    transactionState,
    transactionDirectoryPath,
    operationSourceRecord,
    tableHeadIndex,
  });
  updateTableHeadBytes({
    tableHeadIndex,
    sourceTableHeadBytes,
    transactionState,
    recordModel,
    operationSourceRecord,
    operationFiledRecordResult,
    tableFileBytesResult,
    currentTableFileByteOffset,
  });
  transactionState.tableHeadIndexCache[recordModel.modelSymbol] =
    tableHeadIndex;
  return {
    tableFileIndex: tableHeadIndex,
  };
}

interface RetrieveSourceTableHeadApi extends
  Pick<
    CreateTableRowApi,
    | 'transactionState'
    | 'recordModel'
    | 'tableDirectoryPath'
    | 'transactionDirectoryPath'
    | 'tableFileFinishlineSize'
  > {}

interface RetrieveSourceTableHeadResult {
  tableHeadIndex: number;
  sourceTableHeadBytes: Uint8Array;
}

async function retrieveSourceTableHead(
  api: RetrieveSourceTableHeadApi,
): Promise<RetrieveSourceTableHeadResult> {
  const {
    transactionState,
    recordModel,
    transactionDirectoryPath,
    tableDirectoryPath,
    tableFileFinishlineSize,
  } = api;
  const cachedTableHeadIndex =
    transactionState.tableHeadIndexCache[recordModel.modelSymbol];
  const { lastTableHeadInfo, lastTableHeadIndex, lastTableHeadPath } =
    typeof cachedTableHeadIndex === 'number'
      ? await retrieveCachedLastTableHead({
        recordModel,
        transactionDirectoryPath,
        lastTableHeadIndex: cachedTableHeadIndex,
      })
      : await retrieveDataLastTableHead({
        tableDirectoryPath,
        lastTableHeadIndex: (await readTableFileCount({
          tableDirectoryPath,
        })) - 1,
      });
  return lastTableHeadInfo.size < tableFileFinishlineSize
    ? {
      tableHeadIndex: lastTableHeadIndex,
      sourceTableHeadBytes: await Deno.readFile(lastTableHeadPath),
    }
    : {
      tableHeadIndex: lastTableHeadIndex + 1,
      sourceTableHeadBytes: new Uint8Array(),
    };
}

interface RetrieveCachedLastTableHeadApi extends
  Pick<
    RetrieveSourceTableHeadApi,
    'transactionDirectoryPath' | 'recordModel'
  >,
  Pick<__RetrieveLastTableHeadApi, 'lastTableHeadIndex'> {
}

function retrieveCachedLastTableHead(api: RetrieveCachedLastTableHeadApi) {
  const { lastTableHeadIndex, transactionDirectoryPath, recordModel } = api;
  return __retrieveLastTableHead({
    lastTableHeadIndex,
    lastTableHeadPath: Path.join(
      transactionDirectoryPath,
      `${recordModel.modelSymbol}__${lastTableHeadIndex}.data`,
    ),
  });
}

interface RetrieveDataLastTableHeadApi
  extends
    Pick<RetrieveSourceTableHeadApi, 'tableDirectoryPath'>,
    Pick<__RetrieveLastTableHeadApi, 'lastTableHeadIndex'> {}

function retrieveDataLastTableHead(api: RetrieveDataLastTableHeadApi) {
  const { lastTableHeadIndex, tableDirectoryPath } = api;
  return __retrieveLastTableHead({
    lastTableHeadIndex,
    lastTableHeadPath: Path.join(
      tableDirectoryPath,
      `${lastTableHeadIndex}.data`,
    ),
  });
}

interface __RetrieveLastTableHeadApi {
  lastTableHeadIndex: number;
  lastTableHeadPath: string;
}

async function __retrieveLastTableHead(api: __RetrieveLastTableHeadApi) {
  const { lastTableHeadIndex, lastTableHeadPath } = api;
  return {
    lastTableHeadIndex,
    lastTableHeadPath,
    lastTableHeadInfo: await Deno.stat(lastTableHeadPath),
  };
}

interface ReadTableFileCountApi
  extends Pick<RetrieveSourceTableHeadApi, 'tableDirectoryPath'> {}

async function readTableFileCount(api: ReadTableFileCountApi) {
  const { tableDirectoryPath } = api;
  let tableFileCountResult = 0;
  for await (const someTableEntry of Deno.readDir(tableDirectoryPath)) {
    tableFileCountResult += 1;
  }
  return tableFileCountResult;
}

interface BackfillUnresolvedNewRecordFileIndexByteWindowsApi extends
  Pick<
    CreateTableRowApi,
    'transactionState' | 'operationSourceRecord' | 'transactionDirectoryPath'
  >,
  Pick<RetrieveSourceTableHeadResult, 'tableHeadIndex'> {
}

async function backfillUnresolvedNewRecordFileIndexByteWindows(
  api: BackfillUnresolvedNewRecordFileIndexByteWindowsApi,
) {
  const {
    transactionState,
    operationSourceRecord,
    transactionDirectoryPath,
    tableHeadIndex,
  } = api;
  const subLeafUnresolvedByteWindows = transactionState
    .unresolvedNewRecordFileIndexByteWindows[
      operationSourceRecord.__uuid[0]
    ] ?? {};
  const recordUnresolvedByteWindows =
    subLeafUnresolvedByteWindows[operationSourceRecord.__uuid[1]] ?? [];
  for (
    const {
      windowModelSymbol,
      windowFileIndex,
      windowRecordUuid,
      windowRowByteOffset,
    } of recordUnresolvedByteWindows
  ) {
    const unresolvedWindowFilePath = Path.join(
      transactionDirectoryPath,
      `./${windowModelSymbol}__${windowFileIndex}.data`,
    );
    const unresolvedWindowFileBytes = await Deno.readFile(
      unresolvedWindowFilePath,
    );
    let resolvingUnresolvedWindow = true;
    let tableFileByteOffset = 0;
    const tableFileView = new DataView(unresolvedWindowFileBytes.buffer);
    while (resolvingUnresolvedWindow) {
      const rowByteSize = tableFileView.getInt32(tableFileByteOffset);
      tableFileByteOffset += 4;
      const rowRecordUuidFirst = tableFileView.getFloat64(tableFileByteOffset);
      tableFileByteOffset += 8;
      const rowRecordUuidSecond = tableFileView.getFloat64(tableFileByteOffset);
      tableFileByteOffset += 8;
      if (
        rowRecordUuidFirst === windowRecordUuid[0] &&
        rowRecordUuidSecond === windowRecordUuid[1]
      ) {
        tableFileView.setUint32(
          tableFileByteOffset - 16 + windowRowByteOffset ,
          tableHeadIndex,
        );
        resolvingUnresolvedWindow = false;
      }
      tableFileByteOffset += rowByteSize - 16;
    }
    Deno.writeFile(unresolvedWindowFilePath, unresolvedWindowFileBytes);
  }
}

interface UpdateTableHeadBytesApi extends
  Pick<
    CreateTableRowApi,
    | 'tableFileBytesResult'
    | 'currentTableFileByteOffset'
    | 'recordModel'
    | 'transactionState'
    | 'operationSourceRecord'
    | 'operationFiledRecordResult'
  >,
  Pick<
    RetrieveSourceTableHeadResult,
    'tableHeadIndex' | 'sourceTableHeadBytes'
  > {}

function updateTableHeadBytes(api: UpdateTableHeadBytesApi) {
  const {
    currentTableFileByteOffset,
    tableFileBytesResult,
    sourceTableHeadBytes,
    transactionState,
    recordModel,
    operationSourceRecord,
    operationFiledRecordResult,
    tableHeadIndex,
  } = api;
  applyTableFileBytes({
    tableFileBytesResult,
    currentTableFileByteOffset,
    bytePatch: sourceTableHeadBytes,
  });
  applyTableRowBytes({
    tableFileBytesResult,
    currentTableFileByteOffset,
    transactionState,
    recordModel,
    operationSourceRecord,
    operationFiledRecordResult,
    tableHeadIndex,
  });
}

async function updateTableRow() {
  return { tableFileIndex: -1 };
}

interface CommitRecordTransactionApi
  extends Pick<WriteRecordApi, 'dataDirectoryPath'> {
  transactionDirectoryPath: string;
  transactionState: TransactionState;
}

async function commitRecordTransaction(api: CommitRecordTransactionApi) {
  const { transactionState, transactionDirectoryPath, dataDirectoryPath } = api;
  const tableFileEntries = Object.values(transactionState.tableFileEntriesMap);
  for (const someTableFileEntry of tableFileEntries) {
    const transactionFilePath = Path.join(
      transactionDirectoryPath,
      `./${someTableFileEntry.tableModelSymbol}__${someTableFileEntry.tableFileIndex}.data`,
    );
    const tableFilePath = Path.join(
      dataDirectoryPath,
      `./${someTableFileEntry.tableModelSymbol}/${someTableFileEntry.tableFileIndex}.data`,
    );
    await Deno.rename(transactionFilePath, tableFilePath);
  }
}

interface ApplyTableFileBytesApi {
  bytePatch: Uint8Array;
  tableFileBytesResult: Uint8Array;
  currentTableFileByteOffset: { value: number };
}

function applyTableFileBytes(
  api: ApplyTableFileBytesApi,
) {
  const { tableFileBytesResult, bytePatch, currentTableFileByteOffset } = api;
  tableFileBytesResult.set(bytePatch, currentTableFileByteOffset.value);
  currentTableFileByteOffset.value += bytePatch.length;
}

interface ApplyTableRowBytesApi extends
  Pick<
    UpdateTableHeadBytesApi,
    | 'transactionState'
    | 'tableHeadIndex'
    | 'currentTableFileByteOffset'
    | 'tableFileBytesResult'
    | 'recordModel'
    | 'operationSourceRecord'
    | 'operationFiledRecordResult'
  > {
}

function applyTableRowBytes(api: ApplyTableRowBytesApi) {
  const {
    currentTableFileByteOffset,
    operationSourceRecord,
    tableFileBytesResult,
    recordModel,
    transactionState,
    operationFiledRecordResult,
    tableHeadIndex,
  } = api;
  const rowByteSizeOffset = currentTableFileByteOffset.value;
  currentTableFileByteOffset.value += 4;
  let currentRowByteSize = { value: 0 };
  applyRowPropertyBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: operationSourceRecord.__uuid[0],
    }),
  });
  applyRowPropertyBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: operationSourceRecord.__uuid[1],
    }),
  });
  const [identifierEncoding, ...propertyEncodings] = recordModel.modelEncoding;
  for (const somePropertyEncoding of propertyEncodings) {
    const modelProperty =
      recordModel.modelProperties[somePropertyEncoding.encodingPropertyKey] ??
        throwUserError('modelProperty');
    const recordProperty =
      operationSourceRecord[somePropertyEncoding.encodingPropertyKey] ??
        throwUserError('recordProperty');
    if (
      modelProperty.propertyElement.elementKind === 'booleanPrimitive' &&
      typeof recordProperty === 'boolean'
    ) {
      applyRowPropertyBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        bytePatch: getEncodedBoolean({
          someBoolean: recordProperty,
        }),
      });
    } else if (
      modelProperty.propertyElement.elementKind === 'numberPrimitive' &&
      typeof recordProperty === 'number'
    ) {
      applyRowPropertyBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        bytePatch: getEncodedNumber({
          someNumber: recordProperty,
        }),
      });
    } else if (
      modelProperty.propertyElement.elementKind === 'stringPrimitive' &&
      typeof recordProperty === 'string'
    ) {
      const stringBytes = getEncodedString({
        someString: recordProperty,
      });
      applyRowPropertyBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        bytePatch: getEncodedUint32({
          someNumber: stringBytes.length,
        }),
      });
      applyRowPropertyBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        bytePatch: stringBytes,
      });
    } else if (
      modelProperty.propertyElement.elementKind === 'dataModel' &&
      isStringKeyRecord(recordProperty) &&
      isShallowWellFormedRecord(recordProperty) &&
      recordProperty.__status === 'new' &&
      isNewResolvedRecord(transactionState, recordProperty)
    ) {
      const linkedNewRowOperation = getCompletedRowOperation({
        transactionState,
        recordProperty,
      }) ?? throwInvalidPathError('linkedNewRowOperation');
      applyPropertyDataModelBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        recordProperty,
        dataModelFileIndex:
          linkedNewRowOperation.operationFiledRecordResult.__fileIndex,
      });
      linkPropertyFiledRecordResult({
        operationFiledRecordResult,
        modelProperty,
        linkedRowOperation: linkedNewRowOperation,
      });
    } else if (
      modelProperty.propertyElement.elementKind === 'dataModel' &&
      isStringKeyRecord(recordProperty) &&
      isShallowWellFormedRecord(recordProperty) &&
      recordProperty.__status === 'new'
      // && false === isNewResolvedRecord(transactionState, recordProperty)
    ) {
      registerUnresolvedPageIndexByteWindow({
        transactionState,
        currentTableFileByteOffset,
        currentRowByteSize,
        recordProperty,
        tableHeadIndex,
        operationSourceRecord,
      });
      applyDataModelIdentifierBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        recordProperty,
      });
      registerTableRowOperation({
        transactionState,
        operationFiledRecordResult,
        modelProperty,
        recordProperty,
      });
    } else if (
      modelProperty.propertyElement.elementKind === 'dataModel' &&
      isStringKeyRecord(recordProperty) &&
      isShallowWellFormedRecord(recordProperty) &&
      recordProperty.__status === 'filed' &&
      isFiledResolvedRecord(transactionState, recordProperty)
    ) {
      applyPropertyDataModelBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        recordProperty,
        dataModelFileIndex: recordProperty.__fileIndex,
      });
      linkPropertyFiledRecordResult({
        operationFiledRecordResult,
        modelProperty,
        linkedRowOperation: getCompletedRowOperation({
          transactionState,
          recordProperty,
        }) ?? throwInvalidPathError('linkedFiledRowOperation'),
      });
    } else if (
      modelProperty.propertyElement.elementKind === 'dataModel' &&
      isStringKeyRecord(recordProperty) &&
      isShallowWellFormedRecord(recordProperty) &&
      recordProperty.__status === 'filed'
      // && false === isFiledResolvedRecord(transactionState, recordProperty)
    ) {
      applyPropertyDataModelBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        recordProperty,
        dataModelFileIndex: recordProperty.__fileIndex,
      });
      registerTableRowOperation({
        transactionState,
        operationFiledRecordResult,
        modelProperty,
        recordProperty,
      });
    } else if (
      modelProperty.propertyElement.elementKind === 'booleanLiteral' ||
      modelProperty.propertyElement.elementKind === 'numberLiteral' ||
      modelProperty.propertyElement.elementKind === 'stringLiteral'
    ) {
      throwInvalidPathError('modelProperty.propertyElement.elementKind');
    } else {
      throwUserError('typeof recordProperty');
    }
  }
  applyRowPropertyBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    bytePatch: getEncodedString({
      someString: '\n',
    }),
  });
  tableFileBytesResult.set(
    getEncodedUint32({
      someNumber: currentRowByteSize.value,
    }),
    rowByteSizeOffset,
  );
}

interface ApplyRowPropertyBytesApi extends
  Pick<
    ApplyTableFileBytesApi,
    'bytePatch' | 'tableFileBytesResult' | 'currentTableFileByteOffset'
  > {
  currentRowByteSize: { value: number };
}

function applyRowPropertyBytes(
  api: ApplyRowPropertyBytesApi,
) {
  const {
    bytePatch,
    tableFileBytesResult,
    currentTableFileByteOffset,
    currentRowByteSize,
  } = api;
  applyTableFileBytes({
    bytePatch,
    tableFileBytesResult,
    currentTableFileByteOffset,
  });
  currentRowByteSize.value += bytePatch.length;
}

interface ApplyPropertyDataModelBytesApi extends
  Pick<
    ApplyDataModelIdentifierBytesApi,
    | 'currentTableFileByteOffset'
    | 'tableFileBytesResult'
    | 'currentRowByteSize'
    | 'recordProperty'
  > {
  dataModelFileIndex: number;
}

function applyPropertyDataModelBytes(api: ApplyPropertyDataModelBytesApi) {
  const {
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    dataModelFileIndex,
    recordProperty,
  } = api;
  applyRowPropertyBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    bytePatch: getEncodedUint32({
      someNumber: dataModelFileIndex,
    }),
  });
  applyDataModelIdentifierBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    recordProperty,
  });
}

interface ApplyDataModelIdentifierBytesApi extends
  Pick<
    ApplyTableRowBytesApi,
    | 'currentTableFileByteOffset'
    | 'tableFileBytesResult'
  > {
  currentRowByteSize: { value: number };
  recordProperty: ShallowWellFormedRecord;
}

function applyDataModelIdentifierBytes(
  api: ApplyDataModelIdentifierBytesApi,
) {
  const {
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    recordProperty,
  } = api;
  applyRowPropertyBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: recordProperty.__uuid[0],
    }),
  });
  applyRowPropertyBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: recordProperty.__uuid[1],
    }),
  });
}

interface RegisterUnresolvedPageIndexByteWindowApi extends
  Pick<
    ApplyTableRowBytesApi,
    | 'transactionState'
    | 'currentTableFileByteOffset'
    | 'tableHeadIndex'
    | 'operationSourceRecord'
  > {
  currentRowByteSize: { value: number };
  recordProperty: ShallowWellFormedRecord;
}

function registerUnresolvedPageIndexByteWindow(
  api: RegisterUnresolvedPageIndexByteWindowApi,
) {
  const {
    transactionState,
    recordProperty,
    operationSourceRecord,
    tableHeadIndex,
    currentRowByteSize,
    currentTableFileByteOffset,
  } = api;
  const subLeafUnresolvedByteWindows = transactionState
    .unresolvedNewRecordFileIndexByteWindows[recordProperty.__uuid[0]] ?? {};
  transactionState
    .unresolvedNewRecordFileIndexByteWindows[recordProperty.__uuid[0]] =
      subLeafUnresolvedByteWindows;
  const recordUnresolveByteWindows =
    subLeafUnresolvedByteWindows[recordProperty.__uuid[1]] ?? [];
  subLeafUnresolvedByteWindows[recordProperty.__uuid[1]] =
    recordUnresolveByteWindows;
  recordUnresolveByteWindows.push({
    windowModelSymbol: operationSourceRecord.__modelSymbol,
    windowFileIndex: tableHeadIndex,
    windowRecordUuid: operationSourceRecord.__uuid,
    windowRowByteOffset: currentRowByteSize.value,
  });
  currentRowByteSize.value += 4;
  currentTableFileByteOffset.value += 4;
}

interface RegisterTableRowOperationApi extends
  Pick<
    ApplyTableRowBytesApi,
    'transactionState' | 'operationFiledRecordResult'
  > {
  recordProperty: ShallowWellFormedRecord;
  modelProperty: DataModel['modelProperties'][string];
}

function registerTableRowOperation(api: RegisterTableRowOperationApi) {
  const {
    recordProperty,
    transactionState,
    operationFiledRecordResult,
    modelProperty,
  } = api;
  const subOperationFiledRecordResult: FiledShallowWellFormedRecord = {
    ...recordProperty,
    __status: 'filed',
    __fileIndex: NaN,
  };
  transactionState.rowOperationsQueue.push({
    operationSourceRecord: recordProperty,
    operationFiledRecordResult: subOperationFiledRecordResult,
  });
  operationFiledRecordResult[modelProperty.propertyKey] =
    subOperationFiledRecordResult;
}

interface LinkPropertyFiledRecordResultApi
  extends Pick<ApplyTableRowBytesApi, 'operationFiledRecordResult'> {
  modelProperty: DataModel['modelProperties'][string];
  linkedRowOperation: TableRowOperation;
}

function linkPropertyFiledRecordResult(api: LinkPropertyFiledRecordResultApi) {
  const { operationFiledRecordResult, modelProperty, linkedRowOperation } = api;
  operationFiledRecordResult[modelProperty.propertyKey] =
    linkedRowOperation.operationFiledRecordResult;
}

function isNewResolvedRecord(
  transactionState: WriteTableRowApi['transactionState'],
  recordProperty: NewShallowWellFormedRecord,
): boolean {
  const targetRowOperation = getCompletedRowOperation({
    transactionState,
    recordProperty,
  });
  return targetRowOperation !== undefined &&
    targetRowOperation.operationSourceRecord.__status === 'new';
}

function isFiledResolvedRecord(
  transactionState: WriteTableRowApi['transactionState'],
  recordProperty: FiledShallowWellFormedRecord,
): boolean {
  const targetRowOperation = getCompletedRowOperation({
    transactionState,
    recordProperty,
  });
  return targetRowOperation !== undefined &&
    targetRowOperation.operationSourceRecord.__status === 'filed';
}

interface GetCompletedRowOperationApi
  extends Pick<ApplyTableRowBytesApi, 'transactionState'> {
  recordProperty: ShallowWellFormedRecord;
}

function getCompletedRowOperation(api: GetCompletedRowOperationApi) {
  const { transactionState, recordProperty } = api;
  const subLeafCompletedRowOperations =
    transactionState.completedRowOperations[recordProperty.__uuid[0]];
  return subLeafCompletedRowOperations &&
    subLeafCompletedRowOperations[recordProperty.__uuid[1]];
}

function isStringKeyRecord(
  someObject: object,
): someObject is Record<string, unknown> {
  return true;
}
