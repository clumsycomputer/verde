import {
  getInitialDataSchema,
  getNextDataSchema,
  SolidifiedSchema,
} from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test({ name: 'getInitialDataSchema' }, async (testContext) => {
  const solidifiedSchemaAaa = getSolidifiedSchemaAaa();
  const recordSchemaAaa = getInitialDataSchema({
    solidifiedSchema: solidifiedSchemaAaa,
  });
  const recordModelAaa = recordSchemaAaa.schemaMap['BasicDataModel']!;
  const solidifiedModelAaa = solidifiedSchemaAaa
    .schemaMap['BasicDataModel']!;
  await testContext.step('input model data copied', () => {
    Assert.assertEquals(
      solidifiedModelAaa.modelSymbol,
      recordModelAaa.modelSymbol,
    );
    Assert.assertEquals(
      solidifiedModelAaa.modelProperties,
      recordModelAaa.modelProperties,
    );
  });
  await testContext.step('model encoding', async (subTestContext) => {
    await subTestContext.step('metadata prepended', () => {
      Assert.assertEquals(
        recordModelAaa.modelEncoding.slice(0,1),
        [
          { encodingMetadataKey: '__uuid' },
        ],
      );
    });
    await subTestContext.step('non-literal properties appended in sorted order', () => {
      Assert.assertEquals(
        recordModelAaa.modelEncoding.slice(1,3),
        [
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

Deno.test({ name: 'getNextDataSchema' }, async (testContext) => {
  const recordSchemaBbb = getNextDataSchema({
    staleDataSchema: getInitialDataSchema({
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
          recordModelBbb.modelEncoding.slice(0, 2),
          [
            { encodingMetadataKey: '__uuid' },
            {
              encodingPropertyKey: 'cccProperty__EXAMPLE',
            },
          ],
        );
      },
    );
    await subTestContext.step(
      'renamed / retyped / new non-literal properties appended in sorted order',
      () => {
        Assert.assertEquals(
          recordModelBbb.modelEncoding.slice(2, 5),
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
    const recordSchemaCcc = getNextDataSchema({
      staleDataSchema: recordSchemaBbb,
      solidifiedSchema: getSolidifiedSchemaCcc(),
    });
    const recordModelCcc = recordSchemaCcc.schemaMap['RenamedBasicDataModel']!;
    await subTestContext.step("metadata prepended and non-literal properties appended in sorted order", () => {
      Assert.assertEquals(
        recordModelCcc.modelEncoding,
        [
          { encodingMetadataKey: '__uuid' },
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
        modelSymbol: 'BasicDataModel',
        modelProperties: {
          aaaProperty__EXAMPLE: {
            propertyKey: 'aaaProperty__EXAMPLE',
            propertyElement: {
              elementKind: 'booleanLiteral',
              literalSymbol: 'true'
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
        modelSymbol: 'BasicDataModel',
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
        modelSymbol: 'RenamedBasicDataModel',
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
              elementKind: 'booleanLiteral',
              literalSymbol: 'true'
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
