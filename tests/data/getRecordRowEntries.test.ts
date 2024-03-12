import { getRecordRowEntries } from '../../source/library/data/getRecordRowEntries.ts';
import { RecordSchema } from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test('getRecordRowEntries', async (testContext) => {
  const exampleSchema: RecordSchema = {
    schemaSymbol: 'ExampleSchema',
    schemaMap: {
      TopLevelModel__EXAMPLE: {
        modelSymbol: 'TopLevelModel__EXAMPLE',
        modelProperties: {
          booleanProperty__EXAMPLE: {
            propertyKey: 'booleanProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          numberProperty__EXAMPLE: {
            propertyKey: 'numberProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'numberPrimitive',
            },
          },
          stringProperty__EXAMPLE: {
            propertyKey: 'stringProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
          dataModelProperty__EXAMPLE: {
            propertyKey: 'dataModelProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'dataModel',
              dataModelSymbolKey: 'DataModelPropertyModel__EXAMPLE',
            },
          },
        },
        modelEncoding: [
          { encodingMetadataKey: '__uuid' },
          { encodingPropertyKey: 'booleanProperty__EXAMPLE' },
          { encodingPropertyKey: 'numberProperty__EXAMPLE' },
          { encodingPropertyKey: 'stringProperty__EXAMPLE' },
          { encodingPropertyKey: 'dataModelProperty__EXAMPLE' },
        ],
      },
      DataModelPropertyModel__EXAMPLE: {
        modelSymbol: 'DataModelPropertyModel__EXAMPLE',
        modelProperties: {},
        modelEncoding: [
          { encodingMetadataKey: '__uuid' },
        ],
      },
    },
  };
  const exampleTopLevelRecord = {
    __uuid: [1, 2] as [number, number],
    __modelSymbol: 'TopLevelModel__EXAMPLE',
    __pageIndex: null,
    booleanProperty__EXAMPLE: true,
    numberProperty__EXAMPLE: 255,
    stringProperty__EXAMPLE: 'hello, string',
    dataModelProperty__EXAMPLE: {
      __uuid: [3, 4] as [number, number],
      __modelSymbol: 'DataModelPropertyModel__EXAMPLE',
      __pageIndex: null,
    },
  };
  const exampleRowEntries = getRecordRowEntries({
    recordSchema: exampleSchema,
    recordData: exampleTopLevelRecord,
  });
  const topLevelEntry = exampleRowEntries[1]!
  const dataModelPropertyEntry = exampleRowEntries[0]!
  await testContext.step('each unique data model record has an entry', () => {
    Assert.assertExists(topLevelEntry);
    Assert.assertExists(dataModelPropertyEntry);
  });
  await testContext.step('metadata encodings', async (subTestContext) => {
    await subTestContext.step('__uuid', () => {
      Assert.assertEquals(
        Array.from(topLevelEntry.entryEncodedProperties['__uuid']), 
        [63, 240, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0]
      );
    });
  });
  await testContext.step('property encodings', async (subTestContext) => {
    await subTestContext.step('boolean', () => {
      Assert.assertEquals(
        Array.from(topLevelEntry.entryEncodedProperties['booleanProperty__EXAMPLE']!), 
        [1]
      );
    });
    await subTestContext.step('number', () => {
      Assert.assertEquals(
        Array.from(topLevelEntry.entryEncodedProperties['numberProperty__EXAMPLE']!), 
        [64, 111, 224, 0, 0, 0, 0, 0]
      );
    });
    await subTestContext.step('string', () => {
      Assert.assertEquals(
        Array.from(topLevelEntry.entryEncodedProperties['stringProperty__EXAMPLE']!), 
        [104, 101, 108, 108, 111, 44, 32, 115, 116, 114, 105, 110, 103]
      );
    });
    await subTestContext.step('data model', () => {
      Assert.assertEquals(
        Array.from(topLevelEntry.entryEncodedProperties['dataModelProperty__EXAMPLE']!), 
        [64, 8, 0, 0, 0, 0, 0, 0, 64, 16, 0, 0, 0, 0, 0, 0]
      );
    });
  });
});
