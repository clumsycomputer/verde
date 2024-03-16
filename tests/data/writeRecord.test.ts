import { FileSystem } from '../../source/imports/FileSystem.ts';
import { applyMiddleware, createStore } from '../../source/imports/Redux.ts';
import { createSagaMiddleware } from '../../source/imports/ReduxSaga.ts';
import { getDataRowOperations } from '../../source/library/data/writeRecord/getDataRowOperations.ts';
import { DataSchema, writeRecord } from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';
import { Path } from '../imports/Path.ts';
import { exampleRecordAaa,  exampleSchema } from './mocks.ts';

Deno.test('writeRecord', async (testContext) => {
  const sagaMiddleware = createSagaMiddleware();
  const sagaStore = createStore(() => null, applyMiddleware(sagaMiddleware));
  const testDataPageFinishlineSize = 256;
  const testDataDirectoryPath = Path.join(
    Path.fromFileUrl(import.meta.url),
    '../__data',
  );
  await setupTestDatabase({
    testDataDirectoryPath,
    recordSchema: exampleSchema,
  });
  await testContext.step('assumptions', async (testContext111) => {
    await testContext111.step(
      'client doesnt double enter record uuid',
      () => {},
    );
    await testContext111.step(
      'client provides correct page index for paged record',
      () => {},
    );
  });
  await testContext.step('head page management', async (testContext111) => {
    await testContext111.step(
      'filled until over finishline size',
      () => {},
    );
    await testContext111.step(
      'created if most recent head page is over finishline size',
      () => {},
    );
  });
  const createRecordTask = await sagaMiddleware.run(writeRecord, {
    dataPageFinishlineSize: testDataPageFinishlineSize,
    dataDirectoryPath: testDataDirectoryPath,
    dataSchema: exampleSchema,
    dataRecord: exampleRecordAaa,
  });
  const pagedRecordAaa = await createRecordTask.toPromise();
  await testContext.step('create record', async (testContext111) => {
    const { dataRowOperations } = getDataRowOperations({
      dataSchema: exampleSchema,
      dataRecord: exampleRecordAaa,
    });
    const topLevelModelHeadPage = await Deno.readFile(
      Path.join(testDataDirectoryPath, './TopLevelModel__EXAMPLE/0.data'),
    );
    const dataModelPropertyModelHeadPage = await Deno.readFile(
      Path.join(
        testDataDirectoryPath,
        './DataModelPropertyModel__EXAMPLE/0.data',
      ),
    );
    await testContext111.step('bytes persisted', async (testContext222) => {
      await testContext222.step('top level row', () => {
        Assert.assertEquals(
          topLevelModelHeadPage,
          dataRowOperations[1]!.operationRowBytes,
        );
      });
      await testContext222.step('data model property row', () => {
        Assert.assertEquals(
          dataModelPropertyModelHeadPage,
          dataRowOperations[0]!.operationRowBytes,
        );
      });
    });
  });
  await testContext.step('update record', async (testContext111) => {
    const updateRecordTask = await sagaMiddleware.run(writeRecord, {
      dataPageFinishlineSize: testDataPageFinishlineSize,
      dataDirectoryPath: testDataDirectoryPath,
      dataSchema: exampleSchema,
      dataRecord: {
        ...pagedRecordAaa['dataModelProperty__EXAMPLE'],
        
      },
    });
    await updateRecordTask.toPromise();
    await testContext111.step(
      'data model property row bytes persisted',
      async () => {
        const { dataRowOperations } = getDataRowOperations({
          dataSchema: exampleSchema,
          dataRecord: exampleRecordAaa,
        });
        const dataModelPropertyModelHeadPage = await Deno.readFile(
          Path.join(
            testDataDirectoryPath,
            './DataModelPropertyModel__EXAMPLE/0.data',
          ),
        );
        Assert.assertEquals(
          dataModelPropertyModelHeadPage,
          dataRowOperations[0]!.operationRowBytes,
        );
      },
    );
  });
});

interface SetupTestDatabaseApi {
  testDataDirectoryPath: string;
  recordSchema: DataSchema;
}

async function setupTestDatabase(api: SetupTestDatabaseApi) {
  const { testDataDirectoryPath, recordSchema } = api;
  await FileSystem.emptyDir(testDataDirectoryPath);
  await Promise.all(
    Object.values(recordSchema.schemaMap).map(async (someSchemaModel) => {
      const modelDataDirectoryPath = Path.join(
        testDataDirectoryPath,
        `./${someSchemaModel.modelSymbol}`,
      );
      await FileSystem.emptyDir(modelDataDirectoryPath);
      const initialModelHeadPageFile = await Deno.create(Path.join(modelDataDirectoryPath, `./0.data`));
      initialModelHeadPageFile.close()
    }),
  );
}
