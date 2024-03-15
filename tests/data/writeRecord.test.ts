import { FileSystem } from '../../source/imports/FileSystem.ts';
import { applyMiddleware, createStore } from '../../source/imports/Redux.ts';
import { createSagaMiddleware } from '../../source/imports/ReduxSaga.ts';
import { DataSchema, writeRecord } from '../../source/library/module.ts';
import { Path } from '../imports/Path.ts';
import { exampleRecordAaa, exampleRecordBbb, exampleSchema } from './mocks.ts';

Deno.test('writeRecord', async (testContext) => {
  const sagaMiddleware = createSagaMiddleware();
  const sagaStore = createStore(() => null, applyMiddleware(sagaMiddleware));
    const testDataDirectoryPath = Path.join(
    Path.fromFileUrl(import.meta.url),
    '../__data',
  );
  ;
  await setupTestDatabase({
    testDataDirectoryPath,
    recordSchema: exampleSchema,
  });
  const createRecordTask = await sagaMiddleware.run(writeRecord, {
    dataDirectoryPath: testDataDirectoryPath,
    dataSchema: exampleSchema,
    dataRecord: exampleRecordAaa,    
  })
  await createRecordTask.toPromise()
  await testContext.step('create record', async () => {});
  const updateRecordTask = await sagaMiddleware.run(writeRecord, {
    dataDirectoryPath: testDataDirectoryPath,
    dataSchema: exampleSchema,
    dataRecord: exampleRecordBbb,    
  })
  await updateRecordTask.toPromise()
  await testContext.step('update record', async () => {});
});

interface SetupTestDatabaseApi {
  testDataDirectoryPath: string;
  recordSchema: DataSchema;
}

async function setupTestDatabase(api: SetupTestDatabaseApi) {
  const { testDataDirectoryPath, recordSchema } = api;
  await FileSystem.emptyDir(testDataDirectoryPath);
  await Promise.all(
    Object.values(recordSchema.schemaMap).map((someSchemaModel) =>
      FileSystem.emptyDir(
        Path.join(
          testDataDirectoryPath,
          `./${someSchemaModel.modelSymbol}`,
        ),
      )
    ),
  );
}
