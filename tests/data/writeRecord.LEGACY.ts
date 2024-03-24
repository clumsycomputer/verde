import { applyMiddleware, createStore } from '../../source/imports/Redux.ts';
import { createSagaMiddleware } from '../../source/imports/ReduxSaga.ts';
import { getDataRowOperations } from '../../source/library/data/writeRecord__LEGACY/getDataRowOperations.ts';
import { writeRecord } from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';
import { Path } from '../imports/Path.ts';
import { setupTestDatabase } from './helpers/setupTestDatabase.ts';
import {
  createDataModelPropertyRecord,
  createTopLevelRecord,
  testSchema,
} from './helpers/testSchema.ts';

Deno.test('writeRecord', async (testContext) => {
  const sagaMiddleware = createSagaMiddleware();
  const sagaStore = createStore(() => null, applyMiddleware(sagaMiddleware));
  const testDataPageFinishlineSize = 128;
  const testDataDirectoryPath = Path.join(
    Path.fromFileUrl(import.meta.url),
    '../__writeRecordData',
  );
  await setupTestDatabase({
    testDataDirectoryPath,
    recordSchema: testSchema,
  });
  const newRecords = [
    createTopLevelRecord({
      stringProperty__EXAMPLE: 'hooty hoo and the blowfish 🥸',
    }),
    createTopLevelRecord({
      stringProperty__EXAMPLE: 'one of these days',
      dataModelProperty__EXAMPLE: createDataModelPropertyRecord({
        otherStringProperty__EXAMPLE: 'yippity'
      }),
    }),
    createTopLevelRecord({
      stringProperty__EXAMPLE: 'tupac amaru',
      dataModelProperty__EXAMPLE: createDataModelPropertyRecord({
        otherStringProperty__EXAMPLE: 'doo dah'
      }),
    }),
    createDataModelPropertyRecord({
      otherStringProperty__EXAMPLE: 'the notorius f.i.g'
    }),
  ];
  const pagedRecords: Array<Record<string, unknown>> = [];
  for (const someNewRecord of newRecords) {
    const writeNewRecordTask = await sagaMiddleware.run(writeRecord, {
      dataPageFinishlineSize: testDataPageFinishlineSize,
      dataDirectoryPath: testDataDirectoryPath,
      dataSchema: testSchema,
      dataRecord: someNewRecord,
    });
    const pagedRecord = await writeNewRecordTask.toPromise();
    pagedRecords.push(pagedRecord);
  }
  await testContext.step('client assumptions', async (testContext111) => {
    await testContext111.step(
      'record uuid are not double entered',
      () => {},
    );
    await testContext111.step(
      'paged records have correct page index',
      () => {},
    );
    await testContext111.step(
      'extra properties are not provided',
      () => {},
    );
  });
  await testContext.step('head page management', async (testContext111) => {
    await testContext111.step(
      'filled until over finishline size',
      () => {
        const topLevelModelPageStats000 = Deno.statSync(
          Path.join(testDataDirectoryPath, './TopLevelModel__EXAMPLE/0.data'),
        );
        Assert.assertEquals(
          topLevelModelPageStats000.size >= testDataPageFinishlineSize,
          true,
        );
        Assert.assertEquals(pagedRecords[0]!.__pageIndex, 0);
        Assert.assertEquals(pagedRecords[1]!.__pageIndex, 0);
      },
    );
    await testContext111.step(
      'created if most recent head page is over finishline size',
      () => {
        const topLevelModelPageStats111 = Deno.statSync(
          Path.join(testDataDirectoryPath, './TopLevelModel__EXAMPLE/1.data'),
        );
        Assert.assertEquals(topLevelModelPageStats111.isFile, true);
        Assert.assertEquals(pagedRecords[2]!.__pageIndex, 1);
      },
    );
  });
  await testContext.step('create record', async (testContext111) => {
    const { dataRowOperations } = getDataRowOperations({
      dataSchema: testSchema,
      dataRecord: newRecords[0]!,
    });
    const topLevelModelPage000 = await Deno.readFile(
      Path.join(testDataDirectoryPath, './TopLevelModel__EXAMPLE/0.data'),
    );
    const dataModelPropertyModelPage000 = await Deno.readFile(
      Path.join(
        testDataDirectoryPath,
        './DataModelPropertyModel__EXAMPLE/0.data',
      ),
    );
    await testContext111.step('bytes persisted', async (testContext222) => {
      await testContext222.step('top level row', () => {
        Assert.assertEquals(
          topLevelModelPage000.slice(
            0,
            dataRowOperations[1]!.operationRowBytes.length,
          ),
          dataRowOperations[1]!.operationRowBytes,
        );
      });
      await testContext222.step('data model property row', () => {
        Assert.assertEquals(
          dataModelPropertyModelPage000.slice(
            0,
            dataRowOperations[0]!.operationRowBytes.length,
          ),
          dataRowOperations[0]!.operationRowBytes,
        );
      });
    });
  });
  const updatedPagedRecord = {
    ...pagedRecords[0]!['dataModelProperty__EXAMPLE'] as any as Record<
      string,
      unknown
    >,
    otherStringProperty__EXAMPLE: 'hey hey hey'
  };
  const writePagedRecordTask = await sagaMiddleware.run(writeRecord, {
    dataPageFinishlineSize: testDataPageFinishlineSize,
    dataDirectoryPath: testDataDirectoryPath,
    dataSchema: testSchema,
    dataRecord: updatedPagedRecord,
  });
  await writePagedRecordTask.toPromise();
  await testContext.step('update record', async (testContext111) => {
    await testContext111.step(
      'data model property row bytes persisted',
      async () => {
        const { dataRowOperations } = getDataRowOperations({
          dataSchema: testSchema,
          dataRecord: updatedPagedRecord,
        });
        const dataModelPropertyModelHeadPage = await Deno.readFile(
          Path.join(
            testDataDirectoryPath,
            './DataModelPropertyModel__EXAMPLE/0.data',
          ),
        );
        Assert.assertEquals(
          dataModelPropertyModelHeadPage.slice(
            0,
            dataRowOperations[0]!.operationRowBytes.length,
          ),
          dataRowOperations[0]!.operationRowBytes,
        );
      },
    );
  });
});

