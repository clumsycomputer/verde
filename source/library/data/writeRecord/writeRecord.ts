import {
  throwInvalidPathError,
  throwUserError,
} from '../../../helpers/throwError.ts';
import { FileSystem } from '../../../imports/FileSystem.ts';
import { Path } from '../../../imports/Path.ts';
import { DataModel, DataSchema } from '../../schema/types/DataSchema.ts';
import { getEncodedBoolean, getEncodedNumber, getEncodedString, getEncodedUint32 } from '../helpers/getEncodedData.ts';
import {
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

export async function writeRecord(api: WriteRecordApi) {
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
  const filedRecordResult: Record<string, unknown> = {};
  const transactionState: TransactionState = {
    tableHeadIndexCache: {},
    rowOperationsQueue: [{
      operationSourceRecord: dataRecord,
      operationFiledRecordResult: filedRecordResult,
    }],
  };
  for (const someTableRowOperation of transactionState.rowOperationsQueue) {
    await writeTableRow({
      dataDirectoryPath,
      dataSchema,
      tableFileResultBufferSize,
      tableFileFinishlineSize,
      transactionDirectoryPath,
      transactionState,
      operationSourceRecord: someTableRowOperation.operationSourceRecord,
      operationFiledRecordResult:
        someTableRowOperation.operationFiledRecordResult,
    });
  }
  await commitRecordTransaction({});
  return filedRecordResult;
}

interface TableRowOperation {
  operationSourceRecord: ShallowWellFormedRecord;
  operationFiledRecordResult: Record<string, unknown>;
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
  dataRecord: ShallowWellFormedRecord;
}

interface TransactionState {
  rowOperationsQueue: Array<TableRowOperation>;
  tableHeadIndexCache: Record<string, number>;
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
    dataRecord,
    operationFiledRecordResult,
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
      tableFileFinishlineSize,
      transactionDirectoryPath,
      transactionState,
      dataRecord,
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
    tableFileBytesResult.subarray(currentTableFileByteOffset.value),
    { create: true },
  );
  Object.assign(operationFiledRecordResult, {
    __status: 'filed',
    __fileIndex: tableFileIndex,
  });
}

interface CreateTableRowApi extends
  Pick<
    WriteTableRowApi,
    | 'transactionState'
    | 'transactionDirectoryPath'
    | 'tableFileFinishlineSize'
  > {
  dataRecord: NewShallowWellFormedRecord;
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
    dataRecord,
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
  await backfillUnresolvedNewRecordFileIndexByteWindows({});
  updateTableHeadBytes({
    sourceTableHeadBytes,
    transactionState,
    recordModel,
    dataRecord,
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
        lastTableHeadIndex: await readTableFileCount({
          tableDirectoryPath,
        }),
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

interface BackfillUnresolvedNewRecordFileIndexByteWindowsApi {}

async function backfillUnresolvedNewRecordFileIndexByteWindows(
  api: BackfillUnresolvedNewRecordFileIndexByteWindowsApi,
) {}

interface UpdateTableHeadBytesApi extends
  Pick<
    CreateTableRowApi,
    | 'tableFileBytesResult'
    | 'currentTableFileByteOffset'
    | 'recordModel'
    | 'transactionState'
    | 'dataRecord'
  >,
  Pick<RetrieveSourceTableHeadResult, 'sourceTableHeadBytes'> {}

function updateTableHeadBytes(api: UpdateTableHeadBytesApi) {
  const {
    currentTableFileByteOffset,
    tableFileBytesResult,
    sourceTableHeadBytes,
    transactionState,
    recordModel,
    dataRecord,
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
    dataRecord,
  });
}

async function updateTableRow() {
  return {
    tableFileIndex: operationSourceRecord.__fileIndex,
  };
}

interface CommitRecordTransactionApi {}

async function commitRecordTransaction(api: CommitRecordTransactionApi) {
  const {} = api;
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

interface ApplyTableRowBytesApi
  extends Pick<WriteTableRowApi, 'transactionState'> {
  currentTableFileByteOffset: { value: number };
  tableFileBytesResult: Uint8Array;
  dataRecord: ShallowWellFormedRecord;
  recordModel: DataModel;
}

function applyTableRowBytes(api: ApplyTableRowBytesApi) {
  const {
    currentTableFileByteOffset,
    dataRecord,
    tableFileBytesResult,
    recordModel,
    transactionState,
  } = api;
  const rowByteSizeOffset = currentTableFileByteOffset.value;
  currentTableFileByteOffset.value += 4;
  let currentRowByteSize = { value: 0 };
  applyRowPropertyBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: dataRecord.__uuid[0],
    }),
  });
  applyRowPropertyBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    bytePatch: getEncodedNumber({
      someNumber: dataRecord.__uuid[1],
    }),
  });
  const [identifierEncoding, ...propertyEncodings] = recordModel.modelEncoding;
  for (const somePropertyEncoding of propertyEncodings) {
    const modelProperty =
      recordModel.modelProperties[somePropertyEncoding.encodingPropertyKey] ??
        throwUserError('modelProperty');
    const recordProperty =
      dataRecord[somePropertyEncoding.encodingPropertyKey] ??
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
      const newSubLeafResolvedRecords =
        transactionState.resolvedRecords.new[recordProperty.__uuid[0]] ??
          throwInvalidPathError('newSubLeafResolvedRecords');
      const resolvedPropertyPageIndex: unknown =
        newSubLeafResolvedRecords[recordProperty.__uuid[1]] ??
          throwInvalidPathError('resolvedPropertyPageIndex');
      applyPropertyDataModelBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        recordProperty,
        dataModelFileIndex: resolvedPropertyPageIndex,
      });
    } else if (
      modelProperty.propertyElement.elementKind === 'dataModel' &&
      isStringKeyRecord(recordProperty) &&
      isShallowWellFormedRecord(recordProperty) &&
      recordProperty.__status === 'new'
      // && false === isNewResolvedRecord(transactionState, recordProperty)
    ) {
      registerUnresolvedPageIndexByteWindow({
        currentTableFileByteOffset,
        transactionState,
        currentRowByteSize,
        recordProperty,
      });
      applyDataModelIdentifierBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        recordProperty,
      });
      pendingOperationsQueue.push(recordProperty);
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
      pendingOperationsQueue.push(recordProperty);
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

function isNewResolvedRecord(
  transactionState: WriteTableRowApi['transactionState'],
  recordProperty: NewShallowWellFormedRecord,
): boolean {
  return false;
}

function isFiledResolvedRecord(
  transactionState: WriteTableRowApi['transactionState'],
  recordProperty: FiledShallowWellFormedRecord,
): boolean {
  return false;
}

function isStringKeyRecord(
  someObject: object,
): someObject is Record<string, unknown> {
  return true;
}
