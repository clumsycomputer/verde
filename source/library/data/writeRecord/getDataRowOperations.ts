import {
  throwInvalidPathError,
  throwUserError,
} from '../../../helpers/throwError.ts';
import {
  DataModel,
  PropertyEncoding,
  RecordUuid,
} from '../../schema/types/DataSchema.ts';
import {
  isShallowWellFormedRecord,
  ShallowWellFormedRecord,
} from './isShallowWellFormedRecord.ts';
import { WriteRecordApi } from './writeRecord.ts';

export interface GetDataRowOperationsApi
  extends Pick<WriteRecordApi, 'dataSchema' | 'dataRecord'> {
}

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

export function getDataRowOperations(api: GetDataRowOperationsApi) {
  const { dataSchema, dataRecord } = api;
  return {
    dataRowOperations: __getDataRowOperations({
      dataSchema,
      dataRecord,
      operationsResult: [],
    })[0],
  };
}

interface __GetDataRowOperationsApi
  extends Pick<GetDataRowOperationsApi, 'dataSchema' | 'dataRecord'> {
  operationsResult: __GetDataRowOperationsResult[0];
}

type __GetDataRowOperationsResult = [
  dataRowOperations: Array<WriteDataRowOperation>,
  thisDataRowOperation: WriteDataRowOperation,
];

function __getDataRowOperations(
  api: __GetDataRowOperationsApi,
): __GetDataRowOperationsResult {
  const { dataSchema, dataRecord, operationsResult } = api;
  if (false === isShallowWellFormedRecord(dataRecord)) {
    throwUserError('__getDataRowOperations["dataRecord"]');
  }
  const recordDataRowOperation: WriteDataRowOperation = {
    operationRecordUuid: dataRecord.__uuid,
    operationModelSymbol: dataRecord.__modelSymbol,
    operationRowBytes: getOperationRowBytes({
      dataSchema,
      dataRecord,
      operationsResult,
    }),
    ...(dataRecord.__status === 'new'
      ? {
        operationKind: 'create',
      }
      : {
        operationKind: 'update',
        operationPageIndex: dataRecord.__pageIndex,
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

interface GetOperationRowBytesApi extends
  Pick<
    __GetDataRowOperationsApi,
    'dataSchema' | 'operationsResult'
  > {
  dataRecord: ShallowWellFormedRecord;
}

function getOperationRowBytes(api: GetOperationRowBytesApi): Uint8Array {
  const {
    dataRecord,
    dataSchema,
    operationsResult,
  } = api;
  const recordModel = dataSchema.schemaMap[dataRecord.__modelSymbol] ??
    throwInvalidPathError('recordModel');
  const [metadataIdentifierEncoding, ...propertiesEncoding] =
    recordModel.modelEncoding;
  const [rowBytesSize, encodedRowProperties] = propertiesEncoding.reduce<
    [number, Array<Uint8Array>]
  >(
    ([rowBytesSizeResult, recordRowBytesResult], somePropertyEncoding) => {
      const rowPropertyBytes = getRowPropertyBytes({
        dataRecord,
        dataSchema,
        operationsResult,
        recordModel,
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
        someNumber: dataRecord.__uuid[0],
      }),
      getEncodedNumber({
        someNumber: dataRecord.__uuid[1],
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
    rowByteOffset,
  );
  return rowBytesResult;
}

interface GetRowPropertyBytesApi extends
  Pick<
    GetOperationRowBytesApi,
    | 'dataSchema'
    | 'dataRecord'
    | 'operationsResult'
  > {
  recordModel: DataModel;
  propertyEncoding: PropertyEncoding;
}

function getRowPropertyBytes(api: GetRowPropertyBytesApi) {
  const {
    recordModel,
    propertyEncoding,
    dataRecord,
    dataSchema,
    operationsResult,
  } = api;
  const modelProperty =
    recordModel.modelProperties[propertyEncoding.encodingPropertyKey] ??
      throwUserError('modelProperty');
  const recordProperty = dataRecord[propertyEncoding.encodingPropertyKey] ??
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
    const [propertyRecordEntries, propertyRecordEntry] = __getDataRowOperations(
      {
        dataSchema,
        operationsResult,
        dataRecord: recordProperty as any as Record<string, unknown>,
      },
    );
    return propertyRecordEntry.operationRowBytes.slice(4, 20);
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

export interface GetEncodedBooleanApi {
  someBoolean: boolean;
}

export function getEncodedBoolean(api: GetEncodedBooleanApi) {
  const { someBoolean } = api;
  const encodedBooleanResult = new Uint8Array(1);
  encodedBooleanResult[0] = someBoolean === true ? 0x01 : 0x00;
  return encodedBooleanResult;
}

export interface GetEncodedNumberApi {
  someNumber: number;
}

export function getEncodedNumber(api: GetEncodedNumberApi) {
  const { someNumber } = api;
  const encodedNumberResult = new Uint8Array(8);
  new DataView(encodedNumberResult.buffer).setFloat64(0, someNumber);
  return encodedNumberResult;
}

export interface GetEncodedUint32Api {
  someNumber: number;
}

export function getEncodedUint32(api: GetEncodedUint32Api) {
  const { someNumber } = api;
  const encodedNumberResult = new Uint8Array(4);
  new DataView(encodedNumberResult.buffer).setUint32(0, someNumber);
  return encodedNumberResult;
}

export interface GetEncodedStringApi {
  someString: string;
}

export function getEncodedString(api: GetEncodedStringApi) {
  const { someString } = api;
  return new TextEncoder().encode(someString);
}
