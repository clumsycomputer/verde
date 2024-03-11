import { RecordModel, RecordSchema } from '../../source/library/module.ts';
import {
  EncodedRecord,
  getEncodedRecord,
} from '../../source/library/data/getEncodedRecord.ts';
import {
  throwInvalidPathError,
  throwUserError,
} from '../../source/helpers/throwError.ts';
import {
  createSagaMiddleware,
  getStoreEffects,
} from '../../source/imports/ReduxSaga.ts';
import { applyMiddleware, createStore } from '../../source/imports/Redux.ts';
// import { SagaReturnType } from 'npm:redux-saga/effects';
// import { SagaIterator } from 'npm:redux-saga';

const { storeEffects } = getStoreEffects();
const call = storeEffects.call;

Deno.test('createRecord', async (testContext) => {
  const populationSchema: RecordSchema = {
    schemaSymbol: 'PopulationSchema',
    schemaMap: {
      Person: {
        modelSymbol: 'Person',
        modelProperties: {
          personName: {
            propertyKey: 'personName',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
          personBirthYear: {
            propertyKey: 'personBirthYear',
            propertyElement: {
              elementKind: 'numberPrimitive',
            },
          },
          personAddress: {
            propertyKey: 'personAddress',
            propertyElement: {
              elementKind: 'dataModel',
              dataModelSymbolKey: 'PersonAddress',
            },
          },
        },
        modelEncoding: [
          { encodingMetadataKey: '__uuid' },
          { encodingPropertyKey: 'personAddress' },
          { encodingPropertyKey: 'personBirthYear' },
          { encodingPropertyKey: 'personName' },
        ],
      },
      PersonAddress: {
        modelSymbol: 'PersonAddress',
        modelProperties: {
          addressCountry: {
            propertyKey: 'addressCountry',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
          addressCity: {
            propertyKey: 'addressCity',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
        },
        modelEncoding: [
          { encodingMetadataKey: '__uuid' },
          { encodingPropertyKey: 'addressCity' },
          { encodingPropertyKey: 'addressCountry' },
        ],
      },
    },
  };
  const sagaMiddleware = createSagaMiddleware();
  const sagaStore = createStore(() => null, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(writeRecord, {
    recordSchema: populationSchema,
    recordData: {
      __uuid: createRecordUuid(),
      __modelSymbol: 'Person',
      __pageIndex: null,
      personName: 'barry bonds barry bonds',
      personBirthYear: 1964,
      personAddress: {
        __uuid: createRecordUuid(),
        __modelSymbol: 'PersonAddress',
        __pageIndex: null,
        addressCountry: 'United States of America',
        addressCity: 'Riverside',
      },
    },
  });
});

interface WriteRecordApi {
  recordSchema: RecordSchema;
  recordData: Record<string, unknown>;
}

function* writeRecord(api: WriteRecordApi) {
  const { recordSchema, recordData } = api;
  const [recordEntries] = getReducedRecordEntries({
    recordSchema,
    recordData,
  });
  // yield* call(writeRecordRow, {
  //   recordEntries,
  // });  
  console.log(recordData);
  console.log(recordEntries);
  yield
}

interface GetReducedRecordEntriesApi {
  recordSchema: RecordSchema;
  recordData: Record<string, unknown>;
  entriesResult?: Record<number, Record<number, RecordEntry>>;
}

interface RecordEntry {
  entryPageIndex: number | null;
  entryModelSymbol: RecordModel['modelSymbol'];
  entryEncodedProperties: EncodedProperties;
}

interface EncodedProperties {
  __uuid: Uint8Array;
  [encodedPropertyKey: string]: Uint8Array;
}

function getReducedRecordEntries(
  api: GetReducedRecordEntriesApi,
): [Record<number, Record<number, RecordEntry>>, RecordEntry] {
  const { recordSchema, recordData, entriesResult = {} } = api;
  const recordModelSymbol = typeof recordData['__modelSymbol'] === 'string'
    ? recordData['__modelSymbol']
    : throwUserError('recordModelSymbol');
  const recordModel = recordSchema.schemaMap[recordModelSymbol] ??
    throwUserError('recordModel');
  const [recordIdentifierEncoding, ...recordPropertyEncodings] =
    recordModel.modelEncoding;
  const recordUuid = recordData['__uuid'] instanceof Float64Array
    ? recordData['__uuid']
    : throwUserError('recordUuid');
  const recordUuidFirst = recordUuid[0] ??
    throwUserError('recordUuidFirst');
  const recordUuidSecond = recordUuid[1] ??
    throwUserError('recordUuidSecond');
  const recordEntry: RecordEntry = {
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
            const castedRecordProperty = recordProperty as any as Record<
              string,
              unknown
            >;
            const [propertyRecordEntries, propertyRecordEntry] =
              getReducedRecordEntries({
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
    }
  };
  const firstEntriesResult = entriesResult[recordUuidFirst] ?? {};
  entriesResult[recordUuidFirst] = firstEntriesResult;
  firstEntriesResult[recordUuidSecond] = recordEntry;
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

// interface WriteRecordRowApi {
//   recordEntrie: EncodedRecord;
// }

// function* writeRecordRow(api: WriteRecordRowApi) {
//   return 2;
// }

function createRecordUuid(): Float64Array {
  const newUuidString = crypto.randomUUID();
  const hyphenlessUuidString = newUuidString.replaceAll('-', '');
  const uuidBytes = new Uint8Array(16);
  for (let byteIndex = 0; byteIndex < uuidBytes.byteLength; byteIndex++) {
    const hexIndex = byteIndex * 2;
    uuidBytes[byteIndex] = parseInt(
      hyphenlessUuidString.substring(hexIndex, hexIndex + 2),
      16,
    );
  }
  const uuidBytesView = new DataView(uuidBytes.buffer);
  const recordUuidResult = new Float64Array(2);
  recordUuidResult[0] = uuidBytesView.getFloat64(0);
  recordUuidResult[1] = uuidBytesView.getFloat64(8);
  return recordUuidResult;
}

interface GetUuidStringApi {
  someRecordUuid: Float64Array;
}

function getUuidString(api: GetUuidStringApi) {
  const { someRecordUuid } = api;
  const uuidBytes = new Uint8Array(16);
  const uuidBytesView = new DataView(uuidBytes.buffer);
  uuidBytesView.setFloat64(
    0,
    someRecordUuid[0] ?? throwInvalidPathError('someRecordUuid[0]'),
  );
  uuidBytesView.setFloat64(
    8,
    someRecordUuid[1] ?? throwInvalidPathError('someRecordUuid[1]'),
  );
  const hyphenlessUuidString = Array.from(uuidBytes).map((someUuidByte) =>
    someUuidByte.toString(16).padStart(2, '0')
  ).join('');
  return `${hyphenlessUuidString.substring(0, 8)}-${
    hyphenlessUuidString.substring(8, 12)
  }-${hyphenlessUuidString.substring(12, 16)}-${
    hyphenlessUuidString.substring(16, 20)
  }-${hyphenlessUuidString.substring(20, 32)}`;
}
