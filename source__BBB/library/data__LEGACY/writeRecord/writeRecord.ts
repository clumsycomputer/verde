import {
  throwInvalidPathError,
  throwUserError,
} from '../../../helpers/throwError.ts';
import { ValueRef } from '../../../helpers/types.ts';
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
    throwUserError('invalid record: dataRecord');
  }
  const transactionDirectoryPath = Path.join(
    dataDirectoryPath,
    './__transaction',
  );
  await FileSystem.emptyDir(transactionDirectoryPath);
  const transactionState: TransactionState = {
    unresolvedNewRecordFileIndexByteWindows: {},
    tableHeadIndexCache: {},
    tableFilePathMap: {},
    completedRowOperations: {},
    rowOperationsQueue: [],
  };
  const filedRecordResult = pushTableRowOperation({
    transactionState,
    operationSourceRecord: dataRecord,
  });
  for (const someTableRowOperation of transactionState.rowOperationsQueue) {
    const { operationSourceRecord, operationFiledRecordResult } =
      someTableRowOperation;
    await writeTableRow({
      dataSchema,
      dataDirectoryPath,
      transactionDirectoryPath,
      tableFileFinishlineSize,
      tableFileResultBufferSize,
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
  await Promise.all(
    Object.entries(transactionState.tableFilePathMap).map((
      [transactionTableFilePath, dataTableFilePath],
    ) => Deno.rename(transactionTableFilePath, dataTableFilePath)),
  );
  return filedRecordResult;
}

interface TableRowOperation {
  operationSourceRecord: ShallowWellFormedRecord;
  operationFiledRecordResult: FiledShallowWellFormedRecord;
}

interface WriteTableRowApi extends
  Pick<
    WriteRecordApi,
    | 'dataSchema'
    | 'dataDirectoryPath'
    | 'tableFileResultBufferSize'
    | 'tableFileFinishlineSize'
  >,
  Pick<
    TableRowOperation,
    'operationSourceRecord' | 'operationFiledRecordResult'
  > {
  transactionDirectoryPath: string;
  transactionState: TransactionState;
}

interface TransactionState {
  rowOperationsQueue: Array<TableRowOperation>;
  completedRowOperations: Record<number, Record<number, TableRowOperation>>;
  tableHeadIndexCache: Record<string, number>;
  tableFilePathMap: Record<string, string>;
  unresolvedNewRecordFileIndexByteWindows: Record<
    number,
    Record<
      number,
      Array<{
        windowTableFilePath: string;
        windowRowUuid: RecordUuid;
        windowRowByteOffset: number;
      }>
    >
  >;
}

async function writeTableRow(api: WriteTableRowApi) {
  const {
    dataSchema,
    operationSourceRecord,
    dataDirectoryPath,
    tableFileResultBufferSize,
    tableFileFinishlineSize,
    transactionDirectoryPath,
    transactionState,
    operationFiledRecordResult,
  } = api;
  const operationRecordModel =
    dataSchema.schemaMap[operationSourceRecord.__modelSymbol] ??
      throwUserError(`model symbol does not exist: dataRecord[**].__modelSymbol = "${operationSourceRecord.__modelSymbol}"`);
  const tableDirectoryPath = Path.join(
    dataDirectoryPath,
    `./${operationRecordModel.modelSymbol}`,
  );
  const tableFileBytesResult = new Uint8Array(tableFileResultBufferSize);
  const currentFileByteOffset: ValueRef<number> = { value: 0 };
  const { transactionTableFilePath, tableFileIndex, dataTableFilePath } =
    operationSourceRecord.__status === 'new'
      ? await createTableRow({
        tableFileFinishlineSize,
        tableDirectoryPath,
        transactionDirectoryPath,
        transactionState,
        operationRecordModel,
        operationSourceRecord,
        operationFiledRecordResult,
        tableFileBytesResult,
        currentFileByteOffset,
      })
      : await updateTableRow({
        dataDirectoryPath,
        transactionDirectoryPath,
        transactionState,
        operationRecordModel,
        operationSourceRecord,
        operationFiledRecordResult,
        tableFileBytesResult,
        currentFileByteOffset,
      });
  await Deno.writeFile(
    transactionTableFilePath,
    tableFileBytesResult.subarray(0, currentFileByteOffset.value),
    { create: true },
  );
  operationFiledRecordResult.__fileIndex = tableFileIndex;
  transactionState.tableFilePathMap[transactionTableFilePath] =
    dataTableFilePath;
}

interface CreateTableRowApi
  extends
    __ApplyTableRowApi<NewShallowWellFormedRecord>,
    Pick<
      WriteTableRowApi,
      'tableFileFinishlineSize'
    > {
  tableDirectoryPath: string;
}

async function createTableRow(api: CreateTableRowApi) {
  const {
    tableFileFinishlineSize,
    tableDirectoryPath,
    transactionDirectoryPath,
    transactionState,
    operationRecordModel,
    operationSourceRecord,
    operationFiledRecordResult,
    tableFileBytesResult,
    currentFileByteOffset,
  } = api;
  const { tableHeadIndex, sourceTableHeadBytes } =
    await retrieveSourceTableHead({
      tableFileFinishlineSize,
      tableDirectoryPath,
      transactionDirectoryPath,
      transactionState,
      operationRecordModel,
    });
  await backfillUnresolvedNewRecordFileIndexByteWindows({
    transactionState,
    operationSourceRecord,
    tableHeadIndex,
  });
  const transactionTableFilePath = Path.join(
    transactionDirectoryPath,
    `./${operationRecordModel.modelSymbol}__${tableHeadIndex}.data`,
  );
  updateTableHeadBytes({
    transactionState,
    operationSourceRecord,
    operationFiledRecordResult,
    operationRecordModel,
    sourceTableHeadBytes,
    tableFileBytesResult,
    currentFileByteOffset,
    transactionTableFilePath,
  });
  transactionState.tableHeadIndexCache[operationRecordModel.modelSymbol] =
    tableHeadIndex;
  return {
    transactionTableFilePath,
    tableFileIndex: tableHeadIndex,
    dataTableFilePath: Path.join(
      tableDirectoryPath,
      `./${tableHeadIndex}.data`,
    ),
  };
}

interface RetrieveSourceTableHeadApi extends
  Pick<
    CreateTableRowApi,
    | 'tableFileFinishlineSize'
    | 'tableDirectoryPath'
    | 'transactionDirectoryPath'
    | 'transactionState'
    | 'operationRecordModel'
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
    operationRecordModel,
    transactionDirectoryPath,
    tableDirectoryPath,
    tableFileFinishlineSize,
  } = api;
  const cachedTableHeadIndex =
    transactionState.tableHeadIndexCache[operationRecordModel.modelSymbol];
  const { lastTableHeadInfo, lastTableHeadIndex, lastTableHeadPath } =
    typeof cachedTableHeadIndex === 'number'
      ? await retrieveCachedLastTableHead({
        transactionDirectoryPath,
        operationRecordModel,
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
    'transactionDirectoryPath' | 'operationRecordModel'
  >,
  Pick<__RetrieveLastTableHeadApi, 'lastTableHeadIndex'> {
}

function retrieveCachedLastTableHead(api: RetrieveCachedLastTableHeadApi) {
  const { lastTableHeadIndex, transactionDirectoryPath, operationRecordModel } =
    api;
  return __retrieveLastTableHead({
    lastTableHeadIndex,
    lastTableHeadPath: Path.join(
      transactionDirectoryPath,
      `${operationRecordModel.modelSymbol}__${lastTableHeadIndex}.data`,
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
    'transactionState' | 'operationSourceRecord'
  >,
  Pick<RetrieveSourceTableHeadResult, 'tableHeadIndex'> {
}

async function backfillUnresolvedNewRecordFileIndexByteWindows(
  api: BackfillUnresolvedNewRecordFileIndexByteWindowsApi,
) {
  const {
    transactionState,
    operationSourceRecord,
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
      windowTableFilePath,
      windowRowUuid,
      windowRowByteOffset,
    } of recordUnresolvedByteWindows
  ) {
    const byteWindowFileBytes = await Deno.readFile(
      windowTableFilePath,
    );
    const windowTableFileView = new DataView(byteWindowFileBytes.buffer);
    let currentFileByteOffset = 0;
    let backfillingUnresolvedByteWindow = true;
    while (backfillingUnresolvedByteWindow) {
      const rowByteSize = windowTableFileView.getInt32(currentFileByteOffset);
      currentFileByteOffset += 4;
      const rowRecordUuidLow = windowTableFileView.getFloat64(
        currentFileByteOffset,
      );
      const rowRecordUuidHigh = windowTableFileView.getFloat64(
        currentFileByteOffset + 8,
      );
      if (
        rowRecordUuidLow === windowRowUuid[0] &&
        rowRecordUuidHigh === windowRowUuid[1]
      ) {
        windowTableFileView.setUint32(
          currentFileByteOffset + windowRowByteOffset,
          tableHeadIndex,
        );
        backfillingUnresolvedByteWindow = false;
      }
      currentFileByteOffset += rowByteSize;
    }
    Deno.writeFile(windowTableFilePath, byteWindowFileBytes);
  }
}

interface UpdateTableHeadBytesApi extends
  Pick<
    CreateTableRowApi,
    | 'transactionState'
    | 'operationSourceRecord'
    | 'operationFiledRecordResult'
    | 'operationRecordModel'
    | 'tableFileBytesResult'
    | 'currentFileByteOffset'
  >,
  Pick<
    RetrieveSourceTableHeadResult,
    'sourceTableHeadBytes'
  > {
  transactionTableFilePath: string;
}

function updateTableHeadBytes(api: UpdateTableHeadBytesApi) {
  const {
    tableFileBytesResult,
    currentFileByteOffset,
    sourceTableHeadBytes,
    transactionState,
    operationRecordModel,
    operationSourceRecord,
    operationFiledRecordResult,
    transactionTableFilePath,
  } = api;
  applyTableFileBytes({
    tableFileBytesResult,
    currentFileByteOffset,
    bytePatch: sourceTableHeadBytes,
  });
  applyTableRowBytes({
    transactionState,
    operationSourceRecord,
    operationFiledRecordResult,
    operationRecordModel,
    tableFileBytesResult,
    currentFileByteOffset,
    transactionTableFilePath,
  });
}

interface UpdateTableRowApi
  extends
    __ApplyTableRowApi<FiledShallowWellFormedRecord>,
    Pick<
      WriteTableRowApi,
      'dataDirectoryPath'
    > {
}

async function updateTableRow(api: UpdateTableRowApi) {
  const {
    dataDirectoryPath,
    transactionDirectoryPath,
    transactionState,
    operationSourceRecord,
    operationFiledRecordResult,
    operationRecordModel,
    tableFileBytesResult,
    currentFileByteOffset,
  } = api;
  const {
    sourceTableFileBytes,
    transactionTableFilePath,
    dataTableFilePath,
  } = await readSourceTableFile({
    dataDirectoryPath,
    transactionDirectoryPath,
    transactionState,
    operationSourceRecord,
  });  
  const sourceTableFileView = new DataView(sourceTableFileBytes.buffer);
  let currentSourceTableByteOffset = 0;
  while (currentSourceTableByteOffset < sourceTableFileBytes.length) {
    const rowByteSize = sourceTableFileView.getUint32(
      currentSourceTableByteOffset,
    );
    currentSourceTableByteOffset += 4;
    const rowRecordUuidLow = sourceTableFileView.getFloat64(
      currentSourceTableByteOffset,
    );
    const rowRecordUuidHigh = sourceTableFileView.getFloat64(
      currentSourceTableByteOffset + 8,
    );
    if (
      rowRecordUuidLow === operationSourceRecord.__uuid[0] &&
      rowRecordUuidHigh === operationSourceRecord.__uuid[1]
    ) {
      applyTableRowBytes({
        transactionState,
        operationSourceRecord,
        operationFiledRecordResult,
        operationRecordModel,
        tableFileBytesResult,
        currentFileByteOffset,
        transactionTableFilePath,
      });
    } else {           
      tableFileBytesResult.set(
        sourceTableFileBytes.subarray(
          currentSourceTableByteOffset - 4,
          currentSourceTableByteOffset + rowByteSize,
        ),
        currentFileByteOffset.value
      );
      currentFileByteOffset.value += 4 + rowByteSize;
    }
    currentSourceTableByteOffset += rowByteSize;
  }
  return {
    transactionTableFilePath,
    dataTableFilePath,
    tableFileIndex: operationSourceRecord.__fileIndex,
  };
}

interface ReadSourceTableFileApi extends
  Pick<
    UpdateTableRowApi,
    | 'dataDirectoryPath'
    | 'transactionDirectoryPath'
    | 'transactionState'
    | 'operationSourceRecord'
  > {}

async function readSourceTableFile(api: ReadSourceTableFileApi) {
  const {
    transactionState,
    operationSourceRecord,
    transactionDirectoryPath,
    dataDirectoryPath,
  } = api;
  const transactionTableFilePath = Path.join(
    transactionDirectoryPath,
    `${operationSourceRecord.__modelSymbol}__${operationSourceRecord.__fileIndex}.data`,
  );
  const dataTableFilePath = Path.join(
    dataDirectoryPath,
    `./${operationSourceRecord.__modelSymbol}/${operationSourceRecord.__fileIndex}.data`,
  );
  const sourceTableFilePath =
    transactionState.tableFilePathMap[transactionTableFilePath]
      ? transactionTableFilePath
      : dataTableFilePath;
  return {
    transactionTableFilePath,
    dataTableFilePath,
    sourceTableFileBytes: await Deno.readFile(sourceTableFilePath),
  };
}

interface __ApplyTableRowApi<
  ThisOperationSourceRecord = ShallowWellFormedRecord,
> extends
  Pick<
    WriteTableRowApi,
    | 'transactionState'
    | 'transactionDirectoryPath'
    | 'operationFiledRecordResult'
  > {
  operationSourceRecord: ThisOperationSourceRecord;
  operationRecordModel: DataModel;
  tableFileBytesResult: Uint8Array;
  currentFileByteOffset: ValueRef<number>;
}

interface ApplyTableRowBytesApi extends
  Pick<
    __ApplyTableRowApi,
    | 'transactionState'
    | 'operationSourceRecord'
    | 'operationFiledRecordResult'
    | 'operationRecordModel'
    | 'tableFileBytesResult'
    | 'currentFileByteOffset'
  > {
  transactionTableFilePath: string;
}

function applyTableRowBytes(api: ApplyTableRowBytesApi) {
  const {
    currentFileByteOffset,
    tableFileBytesResult,
    operationSourceRecord,
    operationRecordModel,
    transactionState,
    operationFiledRecordResult,
    transactionTableFilePath,
  } = api;
  const currentRowByteSize: ValueRef<number> = { value: 0 };
  const rowByteSizeOffset = currentFileByteOffset.value;
  currentFileByteOffset.value += 4;
  applyRowPropertyBytes({
    tableFileBytesResult,
    currentFileByteOffset,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: operationSourceRecord.__uuid[0],
    }),
  });
  applyRowPropertyBytes({
    tableFileBytesResult,
    currentFileByteOffset,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: operationSourceRecord.__uuid[1],
    }),
  });
  const [identifierEncoding, ...propertyEncodings] =
    operationRecordModel.modelEncoding;
  for (const { encodingPropertyKey } of propertyEncodings) {
    const modelProperty =
      operationRecordModel.modelProperties[encodingPropertyKey] ??
        throwInvalidPathError('modelProperty');
    const recordProperty = operationSourceRecord[encodingPropertyKey] ??
      throwUserError(
        `undefined property: dataRecord[**]["${encodingPropertyKey}"]`,
      );
    const modelPropertyIsDataModelAndPropertyIsShallowWellFormedRecord =
      modelProperty.propertyElement.elementKind === 'dataModel' &&
      isStringKeyRecord(recordProperty) &&
      isShallowWellFormedRecord(recordProperty);
    if (
      modelProperty.propertyElement.elementKind === 'booleanPrimitive' &&
      typeof recordProperty === 'boolean'
    ) {
      applyRowPropertyBytes({
        tableFileBytesResult,
        currentFileByteOffset,
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
        tableFileBytesResult,
        currentFileByteOffset,
        currentRowByteSize,
        bytePatch: getEncodedNumber({
          someNumber: recordProperty,
        }),
      });
    } else if (
      modelProperty.propertyElement.elementKind === 'stringPrimitive' &&
      typeof recordProperty === 'string'
    ) {
      const propertyBytes = getEncodedString({
        someString: recordProperty,
      });
      applyRowPropertyBytes({
        tableFileBytesResult,
        currentFileByteOffset,
        currentRowByteSize,
        bytePatch: getEncodedUint32({
          someNumber: propertyBytes.length,
        }),
      });
      applyRowPropertyBytes({
        tableFileBytesResult,
        currentFileByteOffset,
        currentRowByteSize,
        bytePatch: propertyBytes,
      });
    } else if (
      modelPropertyIsDataModelAndPropertyIsShallowWellFormedRecord &&
      recordProperty.__status === 'new' &&
      isNewResolvedRecord(transactionState, recordProperty)
    ) {
      const linkedNewRowOperation = getCompletedRowOperation({
        transactionState,
        recordProperty,
      }) ?? throwInvalidPathError('linkedNewRowOperation');
      applyPropertyDataModelBytes({
        tableFileBytesResult,
        currentFileByteOffset,
        currentRowByteSize,
        recordProperty,
        propertyFileIndex:
          linkedNewRowOperation.operationFiledRecordResult.__fileIndex,
      });
      linkPropertyFiledRecordResult({
        operationFiledRecordResult,
        modelProperty,
        linkedRowOperation: linkedNewRowOperation,
      });
    } else if (
      modelPropertyIsDataModelAndPropertyIsShallowWellFormedRecord &&
      recordProperty.__status === 'new'
    ) {
      registerUnresolvedPageIndexByteWindow({
        transactionState,
        operationSourceRecord,
        transactionTableFilePath,
        currentFileByteOffset,
        currentRowByteSize,
        recordProperty,
      });
      applyDataModelIdentifierBytes({
        currentFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        recordProperty,
      });
      pushPropertyTableRowOperation({
        transactionState,
        operationFiledRecordResult,
        modelProperty,
        recordProperty,
      });
    } else if (
      modelPropertyIsDataModelAndPropertyIsShallowWellFormedRecord &&
      recordProperty.__status === 'filed' &&
      isFiledResolvedRecord(transactionState, recordProperty)
    ) {
      applyPropertyDataModelBytes({
        currentFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        recordProperty,
        propertyFileIndex: recordProperty.__fileIndex,
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
      modelPropertyIsDataModelAndPropertyIsShallowWellFormedRecord &&
      recordProperty.__status === 'filed'
    ) {
      applyPropertyDataModelBytes({
        tableFileBytesResult,
        currentFileByteOffset,
        currentRowByteSize,
        recordProperty,
        propertyFileIndex: recordProperty.__fileIndex,
      });
      pushPropertyTableRowOperation({
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
      throwUserError(
        `invalid property: dataRecord[**]["${encodingPropertyKey}"]`,
      );
    }
  }
  tableFileBytesResult[currentFileByteOffset.value] = 10;
  currentFileByteOffset.value += 1;
  currentRowByteSize.value += 1;
  tableFileBytesResult.set(
    getEncodedUint32({
      someNumber: currentRowByteSize.value,
    }),
    rowByteSizeOffset,
  );
}

interface ApplyPropertyDataModelBytesApi extends
  Pick<
    ApplyDataModelIdentifierBytesApi,
    | 'tableFileBytesResult'
    | 'currentFileByteOffset'
    | 'currentRowByteSize'
    | 'recordProperty'
  > {
  propertyFileIndex: number;
}

function applyPropertyDataModelBytes(api: ApplyPropertyDataModelBytesApi) {
  const {
    tableFileBytesResult,
    currentFileByteOffset,
    currentRowByteSize,
    propertyFileIndex,
    recordProperty,
  } = api;
  applyRowPropertyBytes({
    tableFileBytesResult,
    currentFileByteOffset,
    currentRowByteSize,
    bytePatch: getEncodedUint32({
      someNumber: propertyFileIndex,
    }),
  });
  applyDataModelIdentifierBytes({
    tableFileBytesResult,
    currentFileByteOffset,
    currentRowByteSize,
    recordProperty,
  });
}

interface ApplyDataModelIdentifierBytesApi extends
  Pick<
    ApplyTableRowBytesApi,
    | 'tableFileBytesResult'
    | 'currentFileByteOffset'
  > {
  currentRowByteSize: ValueRef<number>;
  recordProperty: ShallowWellFormedRecord;
}

function applyDataModelIdentifierBytes(
  api: ApplyDataModelIdentifierBytesApi,
) {
  const {
    tableFileBytesResult,
    currentFileByteOffset,
    currentRowByteSize,
    recordProperty,
  } = api;
  applyRowPropertyBytes({
    tableFileBytesResult,
    currentFileByteOffset,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: recordProperty.__uuid[0],
    }),
  });
  applyRowPropertyBytes({
    tableFileBytesResult,
    currentFileByteOffset,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: recordProperty.__uuid[1],
    }),
  });
}

interface ApplyRowPropertyBytesApi extends
  Pick<
    ApplyTableFileBytesApi,
    'tableFileBytesResult' | 'currentFileByteOffset' | 'bytePatch'
  > {
  currentRowByteSize: ValueRef<number>;
}

function applyRowPropertyBytes(
  api: ApplyRowPropertyBytesApi,
) {
  const {
    tableFileBytesResult,
    currentFileByteOffset,
    bytePatch,
    currentRowByteSize,
  } = api;
  applyTableFileBytes({
    tableFileBytesResult,
    currentFileByteOffset,
    bytePatch,
  });
  currentRowByteSize.value += bytePatch.length;
}

interface ApplyTableFileBytesApi
  extends
    Pick<__ApplyTableRowApi, 'tableFileBytesResult' | 'currentFileByteOffset'> {
  bytePatch: Uint8Array;
}

function applyTableFileBytes(
  api: ApplyTableFileBytesApi,
) {
  const { tableFileBytesResult, bytePatch, currentFileByteOffset } = api;
  tableFileBytesResult.set(bytePatch, currentFileByteOffset.value);
  currentFileByteOffset.value += bytePatch.length;
}

interface RegisterUnresolvedPageIndexByteWindowApi extends
  Pick<
    ApplyTableRowBytesApi,
    | 'transactionState'
    | 'operationSourceRecord'
    | 'transactionTableFilePath'
    | 'currentFileByteOffset'
  > {
  currentRowByteSize: ValueRef<number>;
  recordProperty: ShallowWellFormedRecord;
}

function registerUnresolvedPageIndexByteWindow(
  api: RegisterUnresolvedPageIndexByteWindowApi,
) {
  const {
    transactionState,
    recordProperty,
    transactionTableFilePath,
    operationSourceRecord,
    currentRowByteSize,
    currentFileByteOffset,
  } = api;
  const subLeafUnresolvedByteWindows = transactionState
    .unresolvedNewRecordFileIndexByteWindows[recordProperty.__uuid[0]] ?? {};
  const recordUnresolvedByteWindows =
    subLeafUnresolvedByteWindows[recordProperty.__uuid[1]] ?? [];
  recordUnresolvedByteWindows.push({
    windowTableFilePath: transactionTableFilePath,
    windowRowUuid: operationSourceRecord.__uuid,
    windowRowByteOffset: currentRowByteSize.value,
  });
  subLeafUnresolvedByteWindows[recordProperty.__uuid[1]] =
    recordUnresolvedByteWindows;
  transactionState
    .unresolvedNewRecordFileIndexByteWindows[recordProperty.__uuid[0]] =
      subLeafUnresolvedByteWindows;
  currentRowByteSize.value += 4;
  currentFileByteOffset.value += 4;
}

interface PushPropertyTableRowOperationApi extends
  Pick<
    ApplyTableRowBytesApi,
    'transactionState' | 'operationFiledRecordResult'
  > {
  recordProperty: ShallowWellFormedRecord;
  modelProperty: DataModel['modelProperties'][string];
}

function pushPropertyTableRowOperation(api: PushPropertyTableRowOperationApi) {
  const {
    transactionState,
    recordProperty,
    operationFiledRecordResult,
    modelProperty,
  } = api;
  const propertyFiledRecordResult = pushTableRowOperation({
    transactionState,
    operationSourceRecord: recordProperty,
  });
  operationFiledRecordResult[modelProperty.propertyKey] =
    propertyFiledRecordResult;
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
) {
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
) {
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

interface PushTableRowOperationApi {
  transactionState: TransactionState;
  operationSourceRecord: ShallowWellFormedRecord;
}

function pushTableRowOperation(api: PushTableRowOperationApi) {
  const { transactionState, operationSourceRecord } = api;
  const operationFiledRecordResult: FiledShallowWellFormedRecord = {
    ...operationSourceRecord,
    __status: 'filed',
    __fileIndex: NaN,
  };
  transactionState.rowOperationsQueue.push({
    operationSourceRecord,
    operationFiledRecordResult,
  });
  return operationFiledRecordResult;
}
