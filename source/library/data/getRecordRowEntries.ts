import {
  throwInvalidPathError,
  throwUserError,
} from '../../helpers/throwError.ts';
import { RecordModel, RecordSchema } from '../schema/types/RecordSchema.ts';
import { RecordUuid } from './createRecordUuid.ts';

export interface GetRecordRowEntriesApi
  extends Pick<__GetRecordRowEntriesApi, 'recordSchema' | 'recordData'> {}

export function getRecordRowEntries(api: GetRecordRowEntriesApi) {
  const { recordSchema, recordData } = api;
  return __getRecordRowEntries({
    recordSchema,
    recordData,
    entriesResult: [],
  })[0];
}

interface __GetRecordRowEntriesApi {
  recordSchema: RecordSchema;
  recordData: Record<string, unknown>;
  entriesResult: __GetRecordedRowEntriesResult[0];
}

interface EncodedRowProperties {
  __uuid: Uint8Array;
  [encodedPropertyKey: string]: Uint8Array;
}

type __GetRecordedRowEntriesResult = [
  recordRowEntries: Array<RecordRowEntry>,
  thisRowEntry: RecordRowEntry,
];

export interface RecordRowEntry {
  entryRecordUuid: RecordUuid;
  entryPageIndex: number | null;
  entryModelSymbol: RecordModel['modelSymbol'];
  entryEncodedProperties: EncodedRowProperties;
}

function __getRecordRowEntries(
  api: __GetRecordRowEntriesApi,
): __GetRecordedRowEntriesResult {
  const { recordSchema, recordData, entriesResult = [] } = api;
  const recordModelSymbol = typeof recordData['__modelSymbol'] === 'string'
    ? recordData['__modelSymbol']
    : throwUserError('recordModelSymbol');
  const recordModel = recordSchema.schemaMap[recordModelSymbol] ??
    throwUserError('recordModel');
  const [recordIdentifierEncoding, ...recordPropertyEncodings] =
    recordModel.modelEncoding;
  const recordUuid = recordData['__uuid'] instanceof Array
    ? recordData['__uuid']
    : throwUserError('recordUuid');
  const recordUuidFirst = typeof recordUuid[0] === 'number'
    ? recordUuid[0]
    : throwUserError('recordUuidFirst');
  const recordUuidSecond = typeof recordUuid[1] === 'number'
    ? recordUuid[1]
    : throwUserError('recordUuidSecond');
  const recordEntry: RecordRowEntry = {
    entryRecordUuid: [recordUuidFirst, recordUuidSecond],
    entryModelSymbol: recordModel.modelSymbol,
    entryPageIndex: typeof recordData['__pageIndex'] === 'number' ||
        recordData['__pageIndex'] === null
      ? recordData['__pageIndex']
      : throwUserError('entryPageIndex'),
    entryEncodedProperties: {
      __uuid: new Uint8Array([
        ...getEncodedNumber({
          someNumber: recordUuidFirst,
        }),
        ...getEncodedNumber({
          someNumber: recordUuidSecond,
        }),
      ]),
      ...recordPropertyEncodings.reduce<Record<string, Uint8Array>>(
        (encodedPropertiesResult, somePropertyEncoding) => {
          const modelProperty = recordModel
            .modelProperties[somePropertyEncoding.encodingPropertyKey] ??
            throwInvalidPathError('modelProperty');
          const recordProperty =
            recordData[somePropertyEncoding.encodingPropertyKey] ??
              throwUserError('recordProperty');
          if (
            modelProperty.propertyElement.elementKind === 'booleanPrimitive' &&
            typeof recordProperty === 'boolean'
          ) {
            encodedPropertiesResult[modelProperty.propertyKey] =
              getEncodedBoolean({
                someBoolean: recordProperty,
              });
          } else if (
            modelProperty.propertyElement.elementKind === 'numberPrimitive' &&
            typeof recordProperty === 'number'
          ) {
            encodedPropertiesResult[modelProperty.propertyKey] =
              getEncodedNumber({
                someNumber: recordProperty,
              });
          } else if (
            modelProperty.propertyElement.elementKind === 'stringPrimitive' &&
            typeof recordProperty === 'string'
          ) {
            encodedPropertiesResult[modelProperty.propertyKey] =
              getEncodedString({
                someString: recordProperty,
              });
          } else if (
            modelProperty.propertyElement.elementKind === 'dataModel' &&
            typeof recordProperty === 'object'
          ) {
            const castedRecordProperty = recordProperty as Record<
              string,
              unknown
            >;
            const [propertyRecordEntries, propertyRecordEntry] =
              __getRecordRowEntries({
                recordSchema,
                entriesResult,
                recordData: castedRecordProperty,
              });
            encodedPropertiesResult[modelProperty.propertyKey] =
              propertyRecordEntry.entryEncodedProperties['__uuid'];
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
          return encodedPropertiesResult;
        },
        {},
      ),
    },
  };
  const recordNotEntered =
    entriesResult.findIndex((someRowEntry) =>
      someRowEntry.entryRecordUuid[0] === recordEntry.entryRecordUuid[0] &&
      someRowEntry.entryRecordUuid[1] === recordEntry.entryRecordUuid[1]
    ) === -1;
  if (recordNotEntered) {
    entriesResult.push(recordEntry);
  }
  return [entriesResult, recordEntry];
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

interface GetEncodedStringApi {
  someString: string;
}

function getEncodedString(api: GetEncodedStringApi) {
  const { someString } = api;
  return new TextEncoder().encode(someString);
}
