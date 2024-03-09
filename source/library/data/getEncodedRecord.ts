import { throwInvalidPathError } from '../../helpers/throwError.ts';
import { RecordSchema } from '../schema/types/RecordSchema.ts';

interface EncodedRecord {
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
  const recordModel =
    recordSchema.schemaMap[recordData['__modelSymbolKey'] as any as string] ??
      throwInvalidPathError('recordModel');
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
      __modelSymbolKey: new Uint8Array(0),
      __id: getEncodedNumber({
        numberData: recordData['__id'] as any as number,
      }),
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
  } else if (modelProperty.propertyElement.elementKind === 'booleanPrimitive') {
    return getEncodedBoolean({
      booleanData: propertyData as any as boolean,
    });
  } else if (modelProperty.propertyElement.elementKind === 'numberPrimitive') {
    return getEncodedNumber({
      numberData: propertyData as any as number,
    });
  } else if (modelProperty.propertyElement.elementKind === 'stringPrimitive') {
    return getEncodedString({
      stringData: propertyData as any as string,
    });
  } else if (modelProperty.propertyElement.elementKind === 'dataModel') {
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
