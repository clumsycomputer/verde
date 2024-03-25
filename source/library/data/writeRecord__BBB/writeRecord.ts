import {
  throwInvalidPathError,
  throwUserError,
} from '../../../helpers/throwError.ts';
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
  tableFileFinishlineSize: number;
  tableFileResultBufferSize: number;
  dataDirectoryPath: string;
  dataSchema: DataSchema;
  dataRecord: Record<string, unknown>;
}

export async function writeRecord(api: WriteRecordApi) {
  const {
    dataDirectoryPath,
    tableFileFinishlineSize,
    tableFileResultBufferSize,
    dataRecord,
    dataSchema,
  } = api;
  if (false === isShallowWellFormedRecord(dataRecord)) {
    throwUserError('writeRecord.dataRecord');
  }
  await writeTableRow({
    dataDirectoryPath,
    tableFileFinishlineSize,
    tableFileResultBufferSize,
    dataRecord,
    dataSchema,
    pendingOperationsQueue: [],
    transactionState: {
      tableFileCache: {},
      tableHeadIndexCache: {},
      unresolvedNewRecordPageIndexByteWindows: {},
      resolvedRecords: {
        new: {},
        filed: {},
      },
    },
  });
}

interface WriteTableRowApi extends
  Pick<
    WriteRecordApi,
    | 'dataSchema'
    | 'dataDirectoryPath'
    | 'tableFileFinishlineSize'
    | 'tableFileResultBufferSize'
  > {
  dataRecord: ShallowWellFormedRecord;
  pendingOperationsQueue: Array<ShallowWellFormedRecord>;
  transactionState: {
    unresolvedNewRecordPageIndexByteWindows: Record<
      RecordUuid[0],
      Record<RecordUuid[1], Array<unknown>>
    >;
    resolvedRecords: {
      new: Record<
        RecordUuid[0],
        Record<RecordUuid[1], number>
      >;
      filed: Record<
        RecordUuid[0],
        Record<RecordUuid[1], true>
      >;
    };
    tableFileCache: Record<
      DataModel['modelSymbol'],
      Record<number, Uint8Array>
    >;
    tableHeadIndexCache: Record<DataModel['modelSymbol'], number>
  };
}

async function writeTableRow(api: WriteTableRowApi) {
  const {
    dataRecord,
    dataSchema,
    dataDirectoryPath,
    tableFileFinishlineSize,
    tableFileResultBufferSize,
    pendingOperationsQueue,
    transactionState,
  } = api;
  const tableDirectoryPath = Path.join(
    dataDirectoryPath,
    `./${dataRecord.__modelSymbol}`,
  );
  const recordModel = dataSchema.schemaMap[dataRecord.__modelSymbol] ??
    throwUserError('recordModel');
  dataRecord.__status === 'new'
    ? await createTableRow({
      dataRecord,
      tableFileFinishlineSize,
      tableFileResultBufferSize,
      pendingOperationsQueue,
      transactionState,
      tableDirectoryPath,
      recordModel,
    })
    : await updateTableRow({
      dataRecord,
      tableDirectoryPath,
    });
  cache table row result
  const nextTableRowDataRecord = pendingOperationsQueue.shift();
  if (nextTableRowDataRecord) {
    await writeTableRow({
      dataSchema,
      dataDirectoryPath,
      tableFileFinishlineSize,
      tableFileResultBufferSize,
      pendingOperationsQueue,
      transactionState,
      dataRecord: nextTableRowDataRecord,
    });
  }
}

interface CreateTableRowApi extends
  Pick<
    WriteTableRowApi,
    | 'tableFileFinishlineSize'
    | 'tableFileResultBufferSize'
    | 'transactionState'
    | 'pendingOperationsQueue'
  > {
  dataRecord: NewShallowWellFormedRecord;
  tableDirectoryPath: string;
  recordModel: DataSchema['schemaMap'][string];
}

async function createTableRow(api: CreateTableRowApi) {
  const {
    tableDirectoryPath,
    tableFileFinishlineSize,
    tableFileResultBufferSize,
    dataRecord,
    recordModel,
    transactionState,
    pendingOperationsQueue,
  } = api;
  const { tableHeadIndex, staleTableHeadBytes } = await readTableHeadFile({
    tableDirectoryPath,
    tableFileFinishlineSize,
  });
  const unresolvedPageIndexByteWindows = transactionState.unresolvedNewRecordPageIndexByteWindows[dataRecord.__uuid[0]] && transactionState.unresolvedNewRecordPageIndexByteWindows[dataRecord.__uuid[0]]![dataRecord.__uuid[1]] 
  if (unresolvedPageIndexByteWindows instanceof Array) {
    for (const someUnresolvedPageIndexByteWindow of unresolvedPageIndexByteWindows) {
      someUnresolvedPageIndexByteWindow
    }
  }
  try {
    const tableFileBytesResult = new Uint8Array(tableFileResultBufferSize);
    let currentTableFileByteOffset = { value: 0 };
    applyTableFileBytes({
      tableFileBytesResult,
      currentTableFileByteOffset,
      bytePatch: staleTableHeadBytes,
    });
    applyTableRowBytes({
      dataRecord,
      recordModel,
      transactionState,
      pendingOperationsQueue,
      tableFileBytesResult,
      currentTableFileByteOffset,
    });
  } catch (setBytesError) {
    throw setBytesError;
    // case 1: new row overflows tableFileResultBufferSize
  }
}

interface ReadTableHeadFileApi extends
  Pick<
    CreateTableRowApi,
    'tableDirectoryPath' | 'tableFileFinishlineSize'
  > {
}

async function readTableHeadFile(api: ReadTableHeadFileApi) {
  const { tableDirectoryPath, tableFileFinishlineSize } = api;
  rethink and consider how transactionTableFileCache changes thiis
  const { tableFileCount } = await readTableFileCount({ tableDirectoryPath });
  const lastTableHeadIndex = tableFileCount - 1;
  const lastTableHeadPath = Path.join(
    tableDirectoryPath,
    `${lastTableHeadIndex}.data`,
  );
  const lastModelHeadFileStats = await Deno.stat(lastTableHeadPath);
  return lastModelHeadFileStats.size < tableFileFinishlineSize
    ? {
      tableHeadIndex: lastTableHeadIndex,
      staleTableHeadBytes: await Deno.readFile(lastTableHeadPath),
    }
    : {
      tableHeadIndex: tableFileCount,
      staleTableHeadBytes: new Uint8Array(),
    };
}

interface ReadTableFileCountApi
  extends Pick<ReadTableHeadFileApi, 'tableDirectoryPath'> {}

async function readTableFileCount(api: ReadTableFileCountApi) {
  const { tableDirectoryPath } = api;
  let tableFileCountResult = 0;
  for await (const someTableEntry of Deno.readDir(tableDirectoryPath)) {
    tableFileCountResult += 1;
  }
  return {
    tableFileCount: tableFileCountResult,
  };
}

interface UpdateTableRowApi {}

async function updateTableRow(api: UpdateTableRowApi) {
  todo
}

interface ApplyTableRowBytesApi
  extends
    Pick<WriteTableRowApi, 'transactionState' | 'pendingOperationsQueue'> {
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
    pendingOperationsQueue,
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
      const resolvedPropertyPageIndex =
        newSubLeafResolvedRecords[recordProperty.__uuid[1]] ??
          throwInvalidPathError('resolvedPropertyPageIndex');
      applyPropertyDataModelBytes({
        currentTableFileByteOffset,
        tableFileBytesResult,
        currentRowByteSize,
        recordProperty,
        dataModelPageIndex: resolvedPropertyPageIndex,
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
        recordProperty
      })
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
        dataModelPageIndex: recordProperty.__pageIndex,
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
        dataModelPageIndex: recordProperty.__pageIndex,
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

interface RegisterUnresolvedPageIndexByteWindowApi extends Pick<ApplyTableRowBytesApi, "transactionState" | "currentTableFileByteOffset"> {
  recordProperty: NewShallowWellFormedRecord
  currentRowByteSize: { value: number }
}

function registerUnresolvedPageIndexByteWindow(api: RegisterUnresolvedPageIndexByteWindowApi) {
  const {  transactionState, recordProperty, currentTableFileByteOffset, currentRowByteSize} = api
  const subLeafUnresolvedByteWindows =
        transactionState
          .unresolvedNewRecordPageIndexByteWindows[recordProperty.__uuid[0]] ??
          {};
      const recordUnresolvedByteWindows =
        subLeafUnresolvedByteWindows[recordProperty.__uuid[1]] ?? [];
      recordUnresolvedByteWindows.push({
        pageIndexByteWindowOffset: currentTableFileByteOffset.value,
      });
      subLeafUnresolvedByteWindows[recordProperty.__uuid[1]] =
        recordUnresolvedByteWindows;
      transactionState
        .unresolvedNewRecordPageIndexByteWindows[recordProperty.__uuid[0]] =
          subLeafUnresolvedByteWindows;
      currentTableFileByteOffset.value += 4;
      currentRowByteSize.value += 4;
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
  dataModelPageIndex: number;
}

function applyPropertyDataModelBytes(api: ApplyPropertyDataModelBytesApi) {
  const {
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    dataModelPageIndex,
    recordProperty,
  } = api;
  applyRowPropertyBytes({
    currentTableFileByteOffset,
    tableFileBytesResult,
    currentRowByteSize,
    bytePatch: getEncodedUint32({
      someNumber: dataModelPageIndex,
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

function isStringKeyRecord(
  someObject: object,
): someObject is Record<string, unknown> {
  return true;
}
