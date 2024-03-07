import {
  throwInvalidPathError,
  throwUserError,
} from '../../helpers/throwError.ts';
import {
  IdentifierEncoding,
  PropertyEncoding,
  RecordModel,
  RecordSchema,
} from '../schema/types/RecordSchema.ts';
import { SchemaRecord } from '../schema/types/StructuredSchema.ts';

export interface GetEncodedRecordApi {
  recordModel: RecordModel;
  recordData: SchemaRecord<Record<string, unknown>>;
}

export function getEncodedRecord(api: GetEncodedRecordApi) {
  const { recordModel, recordData } = api;
  const [identifierEncoding, modelSymbolKeyEncoding, ...propertiesEncoding] =
    recordModel.modelRecordEncoding;
  return propertiesEncoding.reduce<Array<number>>(
    (encodedRecordResult, somePropertyEncoding) => [
      ...encodedRecordResult,
      ...getEncodedProperty({
        recordModel,
        recordData,
        somePropertyEncoding,
      }),
    ],
    [
      ...getEncodedIdentifier({
        recordData,
        identifierEncoding,
      }),
    ],
  );
}

interface GetEncodedPropertyApi
  extends Pick<GetEncodedRecordApi, 'recordModel' | 'recordData'> {
  somePropertyEncoding: PropertyEncoding;
}

function getEncodedProperty(api: GetEncodedPropertyApi): Array<number> {
  const { recordModel, somePropertyEncoding, recordData } = api;
  const modelProperty =
    recordModel.modelProperties[somePropertyEncoding.encodingPropertyKey] ??
      throwInvalidPathError('modelProperty');
  const recordProperty = recordData[somePropertyEncoding.encodingPropertyKey];
  if (undefined === recordProperty) {
    throwUserError(
      `invalid record data: recordData["${somePropertyEncoding.encodingPropertyKey}"] is undefined`,
    );
  }
  return [todo];
}

interface GetEncodedIdentifierApi extends Pick<GetEncodedRecordApi, 'recordData'> {
  identifierEncoding: IdentifierEncoding;
}

function getEncodedIdentifier(api: GetEncodedIdentifierApi) {
  const { recordData, identifierEncoding } = api;
  const encodedIdentifierResult = new Uint8Array(8);
  new DataView(encodedIdentifierResult.buffer).setFloat64(
    0,
    recordData[identifierEncoding.encodingMetadataKey],
  );
  return encodedIdentifierResult;
}

// interface CreateRecordIdApi {}

// function createRecordId(api: CreateRecordIdApi) {
//   return crypto.getRandomValues(new Uint8Array(8));
// }
