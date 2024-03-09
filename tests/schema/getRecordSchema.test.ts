import {
  getInitialRecordSchema,
  getNextRecordSchema,
  SolidifiedSchema,
} from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test({ name: 'getInitialRecordSchema' }, async (testContext) => {
  const solidifiedSchemaAaa = getSolidifiedSchemaAaa();
  const recordSchemaAaa = getInitialRecordSchema({
    solidifiedSchema: solidifiedSchemaAaa,
  });
  const recordModelAaa = recordSchemaAaa.schemaMap['BasicDataModel']!;
  const solidifiedModelAaa = solidifiedSchemaAaa
    .schemaMap['BasicDataModel']!;
  await testContext.step('input model data copied', () => {
    Assert.assertEquals(
      solidifiedModelAaa.modelSymbolKey,
      recordModelAaa.modelSymbolKey,
    );
    Assert.assertEquals(
      solidifiedModelAaa.modelProperties,
      recordModelAaa.modelProperties,
    );
  });
  await testContext.step('model encoding', async (subTestContext) => {
    await subTestContext.step('metadata prepended and all model properties included in sorted order', () => {
      Assert.assertEquals(
        recordModelAaa.modelRecordEncoding,
        [
          { encodingMetadataKey: '__id' },
          { encodingMetadataKey: '__modelSymbolKey' },
          {
            encodingPropertyKey: 'aaaProperty__EXAMPLE',
          },
          {
            encodingPropertyKey: 'bbbProperty__EXAMPLE',
          },
          {
            encodingPropertyKey: 'cccProperty__EXAMPLE',
          },
        ],
      );
    });
  });
});

Deno.test({ name: 'getNextRecordSchema' }, async (testContext) => {
  const recordSchemaBbb = getNextRecordSchema({
    staleRecordSchema: getInitialRecordSchema({
      solidifiedSchema: getSolidifiedSchemaAaa(),
    }),
    solidifiedSchema: getSolidifiedSchemaBbb(),
  });
  const recordModelBbb = recordSchemaBbb.schemaMap['BasicDataModel']!;
  await testContext.step('updated model properties', async (subTestContext) => {
    await subTestContext.step(
      'remaining unchanged encodings prepended in same order',
      () => {
        Assert.assertEquals(
          recordModelBbb.modelRecordEncoding.slice(0, 3),
          [
            { encodingMetadataKey: '__id' },
            { encodingMetadataKey: '__modelSymbolKey' },
            {
              encodingPropertyKey: 'cccProperty__EXAMPLE',
            },
          ],
        );
      },
    );
    await subTestContext.step(
      'renamed / retyped / new properties sorted and appended',
      () => {
        Assert.assertEquals(
          recordModelBbb.modelRecordEncoding.slice(3, 6),
          [
            {
              encodingPropertyKey: 'aaaUpdatedProperty__EXAMPLE',
            },
            {
              encodingPropertyKey: 'bbbProperty__EXAMPLE'
            },
            {
              encodingPropertyKey: 'dddProperty__EXAMPLE',
            },
          ],
        );
      },
    );
  });
  await testContext.step('renamed model (deleted model + new model)', async (subTestContext) => {
    const recordSchemaCcc = getNextRecordSchema({
      staleRecordSchema: recordSchemaBbb,
      solidifiedSchema: getSolidifiedSchemaCcc(),
    });
    const recordModelCcc = recordSchemaCcc.schemaMap['RenamedBasicDataModel']!;
    await subTestContext.step("metadata prepended and all model properties included in sorted order", () => {
      Assert.assertEquals(
        recordModelCcc.modelRecordEncoding,
        [
          { encodingMetadataKey: '__id' },
          { encodingMetadataKey: '__modelSymbolKey' },
          {
            encodingPropertyKey: 'aaaUpdatedProperty__EXAMPLE',
          },
          {
            encodingPropertyKey: 'bbbProperty__EXAMPLE',
          },
          {
            encodingPropertyKey: 'cccProperty__EXAMPLE',
          },
          {
            encodingPropertyKey: 'dddProperty__EXAMPLE'
          }
        ],
      );
    })
  })
});

function getSolidifiedSchemaAaa(): SolidifiedSchema {
  return {
    schemaSymbol: 'BasicSchema__EXAMPLE',
    schemaMap: {
      BasicDataModel: {
        modelSymbolKey: 'BasicDataModel',
        modelProperties: {
          aaaProperty__EXAMPLE: {
            propertyKey: 'aaaProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          bbbProperty__EXAMPLE: {
            propertyKey: 'bbbProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          cccProperty__EXAMPLE: {
            propertyKey: 'cccProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
        },
      },
    },
  };
}

function getSolidifiedSchemaBbb(): SolidifiedSchema {
  return {
    schemaSymbol: 'BasicSchema__EXAMPLE',
    schemaMap: {
      BasicDataModel: {
        modelSymbolKey: 'BasicDataModel',
        modelProperties: {
          bbbProperty__EXAMPLE: {
            propertyKey: 'bbbProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
          cccProperty__EXAMPLE: {
            propertyKey: 'cccProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          aaaUpdatedProperty__EXAMPLE: {
            propertyKey: 'aaaUpdatedProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          dddProperty__EXAMPLE: {
            propertyKey: 'dddProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
        },
      },
    },
  };
}

function getSolidifiedSchemaCcc(): SolidifiedSchema {
  return {
    schemaSymbol: 'BasicSchema__EXAMPLE',
    schemaMap: {
      RenamedBasicDataModel: {
        modelSymbolKey: 'RenamedBasicDataModel',
        modelProperties: {
          bbbProperty__EXAMPLE: {
            propertyKey: 'bbbProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          cccProperty__EXAMPLE: {
            propertyKey: 'cccProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          aaaUpdatedProperty__EXAMPLE: {
            propertyKey: 'aaaUpdatedProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          dddProperty__EXAMPLE: {
            propertyKey: 'dddProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
        },
      },
    },
  };
}
