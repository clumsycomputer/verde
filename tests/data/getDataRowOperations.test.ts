import {
  getDataRowOperations,
  getEncodedBoolean,
  getEncodedNumber,
  getEncodedString,
  getEncodedUint32,
} from '../../source/library/data/writeRecord/getDataRowOperations.ts';
import { Assert } from '../imports/Assert.ts';
import { createTopLevelRecord, testSchema } from './testSchema.ts';

Deno.test('getDataRowOperations', async (testContext) => {
  const testRecord = createTopLevelRecord({});
  const { dataRowOperations } = getDataRowOperations({
    dataSchema: testSchema,
    dataRecord: testRecord,
  });
  const createTopLevelOperation = dataRowOperations[1]!;
  const createDataModelPropertyOperation = dataRowOperations[0]!;
  await testContext.step(
    'each unique data model record has an operation',
    () => {
      Assert.assertExists(createTopLevelOperation);
      Assert.assertExists(createDataModelPropertyOperation);
    },
  );
  await testContext.step('internal encodings', async (subTestContext) => {
    await subTestContext.step('rowByteSize', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(0, 4),
        getEncodedUint32({
          someNumber: 47,
        }),
      );
    });
    await subTestContext.step('endOfRow', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(createTopLevelOperation.operationRowBytes.length - 1),
        getEncodedString({
          someString: '\n',
        }),
      );
    });
  });
  await testContext.step('metadata encodings', async (subTestContext) => {
    await subTestContext.step('__uuid', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(4, 20),
        new Uint8Array([
          ...getEncodedNumber({ someNumber: testRecord.__uuid[0] }),
          ...getEncodedNumber({ someNumber: testRecord.__uuid[1] }),
        ]),
      );
    });
  });
  await testContext.step('property encodings', async (subTestContext) => {
    await subTestContext.step('boolean', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(20, 21),
        getEncodedBoolean({
          someBoolean: testRecord.booleanProperty__EXAMPLE,
        }),
      );
    });
    await subTestContext.step('number', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(21, 29),
        getEncodedNumber({
          someNumber: testRecord.numberProperty__EXAMPLE,
        }),
      );
    });
    await subTestContext.step('string', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(29, 34),
        getEncodedString({
          someString: testRecord.stringProperty__EXAMPLE,
        }),
      );
    });
    await subTestContext.step('data model', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(34, 50),
        new Uint8Array([
          ...getEncodedNumber({
            someNumber: testRecord.dataModelProperty__EXAMPLE.__uuid[0],
          }),
          ...getEncodedNumber({
            someNumber: testRecord.dataModelProperty__EXAMPLE.__uuid[1],
          }),
        ]),
      );
    });
  });
});
