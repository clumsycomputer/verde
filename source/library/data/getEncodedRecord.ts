import {
  throwInvalidPathError,
  throwUserError,
} from '../../helpers/throwError.ts';
import { RecordSchema } from '../schema/types/RecordSchema.ts';

export interface EncodedRecord {
  [propertyKey: string]: Uint8Array | EncodedRecord;
}

export interface GetEncodedRecordApi {
  recordSchema: RecordSchema;
  recordData: Record<string, unknown>;
}

export function getEncodedRecord(
  api: GetEncodedRecordApi,
): EncodedRecord {
  const { recordData, recordSchema } = api;
  const [recordUuidFirst, recordUuidSecond] =
    recordData['__uuid'] instanceof Float64Array
      ? recordData['__uuid']
      : throwUserError('getEncodedRecord.recordUuid');
  const recordModel =
    recordSchema.schemaMap[recordData['__modelSymbol'] as any as string] ??
      throwUserError('getEncodedRecord.recordModel');
  return Object.values(recordModel.modelProperties).reduce<EncodedRecord>(
    (encodedRecordResult, someModelProperty) => {
      encodedRecordResult[someModelProperty.propertyKey] = getEncodedProperty({
        recordData,
        recordSchema,
        modelProperty: someModelProperty,
      });
      return encodedRecordResult;
    },
    {
      __modelSymbol: new Uint8Array(0),
      __uuid: new Uint8Array([
        ...getEncodedNumber({
          numberData: recordUuidFirst as any as number,
        }),
        ...getEncodedNumber({
          numberData: recordUuidSecond as any as number,
        }),
      ]),
    },
  );
}

interface GetEncodedPropertyApi
  extends Pick<GetEncodedRecordApi, 'recordData' | 'recordSchema'> {
  modelProperty:
    this['recordSchema']['schemaMap'][string]['modelProperties'][string];
}

function getEncodedProperty(
  api: GetEncodedPropertyApi,
): EncodedRecord[string] {
  const { modelProperty, recordData, recordSchema } = api;
  const propertyData = recordData[modelProperty.propertyKey];
  if (
    modelProperty.propertyElement.elementKind === 'booleanLiteral' ||
    modelProperty.propertyElement.elementKind === 'numberLiteral' ||
    modelProperty.propertyElement.elementKind === 'stringLiteral'
  ) {
    return new Uint8Array(0);
  } else if (
    modelProperty.propertyElement.elementKind === 'booleanPrimitive' &&
    typeof propertyData === 'boolean'
  ) {
    return getEncodedBoolean({
      booleanData: propertyData,
    });
  } else if (
    modelProperty.propertyElement.elementKind === 'numberPrimitive' &&
    typeof propertyData === 'number'
  ) {
    return getEncodedNumber({
      numberData: propertyData,
    });
  } else if (
    modelProperty.propertyElement.elementKind === 'stringPrimitive' &&
    typeof propertyData === 'string'
  ) {
    return getEncodedString({
      stringData: propertyData,
    });
  } else if (
    modelProperty.propertyElement.elementKind === 'dataModel' &&
    typeof propertyData === 'object'
  ) {
    return getEncodedRecord({
      recordSchema,
      recordData: propertyData as any as Record<string, unknown>,
    });
  } else {
    throwInvalidPathError('modelProperty.elementKind');
  }
}

interface GetEncodedBooleanApi {
  booleanData: boolean;
}

function getEncodedBoolean(api: GetEncodedBooleanApi) {
  const { booleanData } = api;
  const encodedBooleanResult = new Uint8Array(1);
  encodedBooleanResult[0] = booleanData === true ? 0x01 : 0x00;
  return encodedBooleanResult;
}

interface GetEncodedNumberApi {
  numberData: number;
}

function getEncodedNumber(api: GetEncodedNumberApi) {
  const { numberData } = api;
  const encodedNumberResult = new Uint8Array(8);
  new DataView(encodedNumberResult.buffer).setFloat64(0, numberData);
  return encodedNumberResult;
}

interface GetEncodedStringApi {
  stringData: string;
}

function getEncodedString(api: GetEncodedStringApi) {
  const { stringData } = api;
  return new TextEncoder().encode(stringData);
}
