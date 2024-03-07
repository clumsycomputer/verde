import {
  getInitialRecordSchema,
  getNextRecordSchema,
  SolidifiedSchema,
} from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test({ name: 'getInitialRecordSchema' }, async (testContext) => {
  const inputSolidifiedSchema = getInitialSolidifiedSchema();
  const resolveRecordSchema = getInitialRecordSchema({
    solidifiedSchema: inputSolidifiedSchema,
  });
  const resolvedRecordModel = resolveRecordSchema.schemaMap['BasicDataModel']!;
  const inputSolidifiedModel = inputSolidifiedSchema
    .schemaMap['BasicDataModel']!;
  await testContext.step('input model data copied', () => {
    Assert.assertEquals(
      resolvedRecordModel.modelSymbolKey,
      inputSolidifiedModel.modelSymbolKey,
    );
    Assert.assertEquals(
      resolvedRecordModel.modelProperties,
      inputSolidifiedModel.modelProperties,
    );
  });
  await testContext.step('model encoding', async (subTestContext) => {
    await subTestContext.step('all properties sorted and entered', () => {
      Assert.assertEquals(
        resolvedRecordModel.modelRecordEncoding,
        [
          { encodingMetadataKey: '__id' },
          { encodingMetadataKey: '__modelSymbolKey' },
          {
            encodingPropertyKey: 'aaaProperty_EXAMPLE',
          },
          {
            encodingPropertyKey: 'bbbProperty_EXAMPLE',
          },
          {
            encodingPropertyKey: 'cccProperty_EXAMPLE',
          },
        ],
      );
    });
  });
});

Deno.test({ name: 'getNextRecordSchema' }, async (testContext) => {
  const updatedRecordSchema = getNextRecordSchema({
    staleRecordSchema: getInitialRecordSchema({
      solidifiedSchema: getInitialSolidifiedSchema(),
    }),
    solidifiedSchema: getUpdatedSolidifiedSchema(),
  });
  const updatedRecordModel = updatedRecordSchema.schemaMap['BasicDataModel']!;
  await testContext.step('model encoding', async (subTestContext) => {
    await subTestContext.step(
      'remaining pre-existing properties prepended',
      () => {
        Assert.assertEquals(
          updatedRecordModel.modelRecordEncoding.slice(0, 4),
          [
            { encodingMetadataKey: '__id' },
            { encodingMetadataKey: '__modelSymbolKey' },
            {
              encodingPropertyKey: 'bbbProperty_EXAMPLE',
            },
            {
              encodingPropertyKey: 'cccProperty_EXAMPLE',
            },
          ],
        );
      },
    );
    await subTestContext.step(
      'new properties sorted and appended',
      () => {
        Assert.assertEquals(
          updatedRecordModel.modelRecordEncoding.slice(4, 6),
          [
            {
              encodingPropertyKey: 'aaaUpdatedProperty_EXAMPLE',
            },
            {
              encodingPropertyKey: 'dddProperty_EXAMPLE',
            },
          ],
        );
      },
    );
  });
});

function getInitialSolidifiedSchema(): SolidifiedSchema {
  return {
    schemaSymbol: 'BasicSchema__EXAMPLE',
    schemaMap: {
      BasicDataModel: {
        modelSymbolKey: 'BasicDataModel',
        modelProperties: {
          aaaProperty_EXAMPLE: {
            propertyKey: 'aaaProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          bbbProperty_EXAMPLE: {
            propertyKey: 'bbbProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          cccProperty_EXAMPLE: {
            propertyKey: 'cccProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
        },
      },
    },
  };
}

function getUpdatedSolidifiedSchema(): SolidifiedSchema {
  return {
    schemaSymbol: 'BasicSchema__EXAMPLE',
    schemaMap: {
      BasicDataModel: {
        modelSymbolKey: 'BasicDataModel',
        modelProperties: {
          bbbProperty_EXAMPLE: {
            propertyKey: 'bbbProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          cccProperty_EXAMPLE: {
            propertyKey: 'cccProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          aaaUpdatedProperty_EXAMPLE: {
            propertyKey: 'aaaUpdatedProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          dddProperty_EXAMPLE: {
            propertyKey: 'dddProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
        },
      },
    },
  };
}
