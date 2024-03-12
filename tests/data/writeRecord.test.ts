import { applyMiddleware, createStore } from '../../source/imports/Redux.ts';
import {
  createSagaMiddleware,
  getStoreEffects,
} from '../../source/imports/ReduxSaga.ts';
import { createRecordUuid } from '../../source/library/data/createRecordUuid.ts';
import { getRecordRowEntries } from '../../source/library/data/getRecordRowEntries.ts';
import { RecordSchema } from '../../source/library/module.ts';

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
  const recordRowEntries = getRecordRowEntries({
    recordSchema,
    recordData,
  });
  // yield* call(writeRecordRow, {
  //   recordEntries,
  // });  
  console.log(recordData);
  console.log(recordRowEntries);
  yield
}
