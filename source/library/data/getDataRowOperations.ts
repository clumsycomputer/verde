import {
  throwInvalidPathError,
  throwUserError,
} from '../../helpers/throwError.ts';
import { DataModel, DataSchema, PropertyEncoding } from '../schema/types/DataSchema.ts';
import { RecordUuid } from './createRecordUuid.ts';

export interface GetDataRowOperationsApi
  extends Pick<__GetDataRowOperationsApi, 'dataSchema' | 'recordData'> {}

export function getDataRowOperations(api: GetDataRowOperationsApi) {
  const { dataSchema, recordData } = api;
  return {
    dataRowOperations: __getDataRowOperations({
      dataSchema,
      recordData,
      operationsResult: [],
    })[0],
  };
}

interface __GetDataRowOperationsApi {
  dataSchema: DataSchema;
  recordData: Record<string, unknown>;
  operationsResult: __GetDataRowOperationsResult[0];
}

type __GetDataRowOperationsResult = [
  dataRowOperations: Array<WriteDataRowOperation>,
  thisDataRowOperation: WriteDataRowOperation,
];

export type WriteDataRowOperation =
  | CreateDataRowOperation
  | UpdateDataRowOperation;

export interface CreateDataRowOperation
  extends __WriteDataRowOperation<'create'> {}

export interface UpdateDataRowOperation
  extends __WriteDataRowOperation<'update'> {
  operationPageIndex: number;
}

interface __WriteDataRowOperation<OperationKind> {
  operationKind: OperationKind;
  operationRecordUuid: RecordUuid;
  operationModelSymbol: DataModel['modelSymbol'];
  operationRowBytes: Uint8Array;
}

function __getDataRowOperations(
  api: __GetDataRowOperationsApi,
): __GetDataRowOperationsResult {
  const { dataSchema, recordData, operationsResult = [] } = api;
  const recordModelSymbol = typeof recordData['__modelSymbol'] === 'string'
    ? recordData['__modelSymbol']
    : throwUserError('recordModelSymbol');
  const recordModel = dataSchema.schemaMap[recordModelSymbol] ??
    throwUserError('recordModel');
  const recordUuid = recordData['__uuid'] instanceof Array
    ? recordData['__uuid']
    : throwUserError('recordUuid');
  const recordUuidFirst = typeof recordUuid[0] === 'number'
    ? recordUuid[0]
    : throwUserError('recordUuidFirst');
  const recordUuidSecond = typeof recordUuid[1] === 'number'
    ? recordUuid[1]
    : throwUserError('recordUuidSecond');
  const recordPageIndex = typeof recordData['__pageIndex'] === 'number' ||
      recordData['__pageIndex'] === null
    ? recordData['__pageIndex']
    : throwInvalidPathError('recordPageIndex');
  const recordDataRowOperation: WriteDataRowOperation = {
    operationRecordUuid: [recordUuidFirst, recordUuidSecond],
    operationModelSymbol: recordModel.modelSymbol,
    operationRowBytes: getOperationRowBytes({
      dataSchema,
      recordData,
      operationsResult,
      recordModel,
      recordUuidFirst,
      recordUuidSecond
    }),
    ...(recordPageIndex === null
      ? {
        operationKind: 'create',
      }
      : {
        operationKind: 'update',
        operationPageIndex: recordPageIndex,
      }),
  };
  const recordNotEntered =
    operationsResult.findIndex((someDataRowOperation) =>
      someDataRowOperation.operationRecordUuid[0] ===
        recordDataRowOperation.operationRecordUuid[0] &&
      someDataRowOperation.operationRecordUuid[1] ===
        recordDataRowOperation.operationRecordUuid[1]
    ) === -1;
  if (recordNotEntered) {
    operationsResult.push(recordDataRowOperation);
  }
  return [operationsResult, recordDataRowOperation];
}

interface GetOperationRowBytesApi
  extends
    Pick<
      __GetDataRowOperationsApi,
      'dataSchema' | 'recordData' | 'operationsResult'
    > {
  recordModel: DataModel;
  recordUuidFirst: number;
  recordUuidSecond: number;
}

function getOperationRowBytes(api: GetOperationRowBytesApi): Uint8Array {
  const { recordModel, recordData, dataSchema, operationsResult, recordUuidFirst, recordUuidSecond } = api;
  const [metadataIdentifierEncoding, ...propertiesEncoding] =
    recordModel.modelEncoding;
  const [rowBytesSize, encodedRowProperties] = propertiesEncoding.reduce<
    [number, Array<Uint8Array>]
  >(
    ([rowBytesSizeResult, recordRowBytesResult], somePropertyEncoding) => {
      const rowPropertyBytes = getRowPropertyBytes({
        recordModel,
        recordData,
        dataSchema,
        operationsResult,
        propertyEncoding: somePropertyEncoding,
      });
      recordRowBytesResult.push(rowPropertyBytes);
      return [
        rowBytesSizeResult + rowPropertyBytes.length,
        recordRowBytesResult,
      ];
    },
    [16, [
      getEncodedNumber({
        someNumber: recordUuidFirst,
      }),
      getEncodedNumber({
        someNumber: recordUuidSecond,
      }),
    ]],
  );
  const rowBytesResult = new Uint8Array(4 + rowBytesSize + 1);
  let rowByteOffset = 0;
  rowBytesResult.set(
    getEncodedUint32({
      someNumber: rowBytesSize + 1,
    }),
    rowByteOffset,
  );
  rowByteOffset += 4;
  for (const someEncodedRowProperty of encodedRowProperties) {
    rowBytesResult.set(
      someEncodedRowProperty,
      rowByteOffset,
    );
    rowByteOffset += someEncodedRowProperty.length;
  }
  rowBytesResult.set(
    new TextEncoder().encode('\n'),
    rowByteOffset
  )
  return rowBytesResult;
}

interface GetRowPropertyBytesApi extends
  Pick<
    GetOperationRowBytesApi,
    | 'recordModel'
    | 'recordData'
    | 'dataSchema'
    | 'operationsResult'
  > {
  propertyEncoding: PropertyEncoding;
}

function getRowPropertyBytes(api: GetRowPropertyBytesApi) {
  const {
    recordModel,
    propertyEncoding,
    recordData,
    dataSchema,
    operationsResult,
  } = api;
  const modelProperty = recordModel
    .modelProperties[propertyEncoding.encodingPropertyKey] ??
    throwInvalidPathError('modelProperty');
  const recordProperty = recordData[propertyEncoding.encodingPropertyKey] ??
    throwUserError('recordProperty');
  if (
    modelProperty.propertyElement.elementKind === 'booleanPrimitive' &&
    typeof recordProperty === 'boolean'
  ) {
    return getEncodedBoolean({
      someBoolean: recordProperty,
    });
  } else if (
    modelProperty.propertyElement.elementKind === 'numberPrimitive' &&
    typeof recordProperty === 'number'
  ) {
    return getEncodedNumber(
      {
        someNumber: recordProperty,
      },
    );
  } else if (
    modelProperty.propertyElement.elementKind === 'stringPrimitive' &&
    typeof recordProperty === 'string'
  ) {
    return getEncodedString(
      {
        someString: recordProperty,
      },
    );
  } else if (
    modelProperty.propertyElement.elementKind === 'dataModel' &&
    typeof recordProperty === 'object'
  ) {
    const castedRecordProperty = recordProperty as Record<
      string,
      unknown
    >;
    const [propertyRecordEntries, propertyRecordEntry] = __getDataRowOperations(
      {
        dataSchema,
        operationsResult,
        recordData: castedRecordProperty,
      },
    );
    return propertyRecordEntry.operationRowBytes.slice(4, 20);
  } else if (
    modelProperty.propertyElement.elementKind === 'booleanLiteral' ||
    modelProperty.propertyElement.elementKind === 'numberLiteral' ||
    modelProperty.propertyElement.elementKind === 'stringLiteral'
  ) {
    throwInvalidPathError(
      'modelProperty.propertyElement.elementKind',
    );
  } else {
    throwUserError('typeof recordProperty');
  }
}

interface GetEncodedBooleanApi {
  someBoolean: boolean;
}

function getEncodedBoolean(api: GetEncodedBooleanApi) {
  const { someBoolean } = api;
  const encodedBooleanResult = new Uint8Array(1);
  encodedBooleanResult[0] = someBoolean === true ? 0x01 : 0x00;
  return encodedBooleanResult;
}

interface GetEncodedNumberApi {
  someNumber: number;
}

function getEncodedNumber(api: GetEncodedNumberApi) {
  const { someNumber } = api;
  const encodedNumberResult = new Uint8Array(8);
  new DataView(encodedNumberResult.buffer).setFloat64(0, someNumber);
  return encodedNumberResult;
}

interface GetEncodedUint32Api {
  someNumber: number;
}

function getEncodedUint32(api: GetEncodedUint32Api) {
  const { someNumber } = api;
  const encodedNumberResult = new Uint8Array(4);
  new DataView(encodedNumberResult.buffer).setUint32(0, someNumber);
  return encodedNumberResult;
}

interface GetEncodedStringApi {
  someString: string;
}

function getEncodedString(api: GetEncodedStringApi) {
  const { someString } = api;
  return new TextEncoder().encode(someString);
}
