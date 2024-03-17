import {
  getDataRowOperations,
  getEncodedBoolean,
  getEncodedNumber,
  getEncodedString,
  getEncodedUint32,
} from '../../source/library/data/writeRecord/getDataRowOperations.ts';
import { Assert } from '../imports/Assert.ts';
import { testSchema} from './testSchema.ts';

Deno.test('getDataRowOperations', async (testContext) => {
  const testRecord = {
    __status: 'new',
    __modelSymbol: 'TopLevelModel__EXAMPLE',
    __uuid: [1, 2],
    booleanProperty__EXAMPLE: true,
    numberProperty__EXAMPLE: 1,
    stringProperty__EXAMPLE: 'hello record',
    dataModelProperty__EXAMPLE: {
      __status: 'new',
      __modelSymbol: 'DataModelPropertyModel__EXAMPLE',
      __uuid: [3, 4],
    },
  };
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
          someNumber: 54
        }),
      );
    });
    await subTestContext.step('endOfRow', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(57, 58),
        getEncodedString({
          someString: '\n'
        }),
      );
    });
  });
  await testContext.step('metadata encodings', async (subTestContext) => {
    await subTestContext.step('__uuid', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(4, 20),
        new Uint8Array([
          ...getEncodedNumber({ someNumber: 1 }),
          ...getEncodedNumber({ someNumber: 2 })
        ]),
      );
    });
  });
  await testContext.step('property encodings', async (subTestContext) => {
    await subTestContext.step('boolean', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(20, 21),
        getEncodedBoolean({
          someBoolean: true
        }),
      );
    });
    await subTestContext.step('number', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(21, 29),
        getEncodedNumber({
          someNumber: 1
        }),
      );
    });
    await subTestContext.step('string', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(29, 41),
        getEncodedString({
          someString: 'hello record'
        }),
      );
    });
    await subTestContext.step('data model', () => {
      Assert.assertEquals(
        createTopLevelOperation.operationRowBytes.slice(41, 57),
        new Uint8Array([
          ...getEncodedNumber({ someNumber: 3 }),
          ...getEncodedNumber({ someNumber: 4 }),
        ]),
      );
    });
  });
});
