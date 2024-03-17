import { applyMiddleware, createStore } from '../../source/imports/Redux.ts';
import { createSagaMiddleware } from '../../source/imports/ReduxSaga.ts';
import { queryData } from '../../source/library/module.ts';
import { Path } from '../imports/Path.ts';
import { setupTestDatabase } from './helpers/setupTestDatabase.ts';
import { testSchema } from './helpers/testSchema.ts';

Deno.test('queryData', async (testContext) => {
  const sagaMiddleware = createSagaMiddleware();
  const sagaStore = createStore(() => null, applyMiddleware(sagaMiddleware));
  const testDataPageFinishlineSize = 128;
  const testDataDirectoryPath = Path.join(
    Path.fromFileUrl(import.meta.url),
    '../__queryDataData',
  );
  await setupTestDatabase({
    testDataDirectoryPath,
    recordSchema: testSchema,
  });
  const queryDataTask = sagaMiddleware.run(queryData, {})
  await queryDataTask.toPromise()
})