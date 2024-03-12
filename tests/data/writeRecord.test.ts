import { FileSystem } from '../../source/imports/FileSystem.ts';
import { applyMiddleware, createStore } from '../../source/imports/Redux.ts';
import { createSagaMiddleware } from '../../source/imports/ReduxSaga.ts';
import { createRecordUuid } from '../../source/library/data/createRecordUuid.ts';
import { RecordSchema, writeRecord } from '../../source/library/module.ts';
import { Path } from '../imports/Path.ts';

Deno.test('writeRecord', async (testContext) => {
  const testDatabaseDirectoryPath = Path.join(
    Path.fromFileUrl(import.meta.url),
    '../__database',
  );
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
  await setupTestDatabase({
    testDatabaseDirectoryPath,
    recordSchema: populationSchema,
  });
  const sagaMiddleware = createSagaMiddleware();
  const sagaStore = createStore(() => null, applyMiddleware(sagaMiddleware));
  const writeRecordTask = sagaMiddleware.run(writeRecord, {
    databaseDirectoryPath: testDatabaseDirectoryPath,
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
  await writeRecordTask.toPromise()
});

interface SetupTestDatabaseApi {
  testDatabaseDirectoryPath: string;
  recordSchema: RecordSchema;
}

async function setupTestDatabase(api: SetupTestDatabaseApi) {
  const { testDatabaseDirectoryPath, recordSchema } = api;
  await FileSystem.emptyDir(testDatabaseDirectoryPath);
  await Promise.all(
    Object.values(recordSchema.schemaMap).map((someSchemaModel) =>
      FileSystem.emptyDir(
        Path.join(
          testDatabaseDirectoryPath,
          `./${someSchemaModel.modelSymbol}`,
        ),
      )
    ),
  );
}
