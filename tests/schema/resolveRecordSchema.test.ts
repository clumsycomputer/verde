import {
  resolveInitialRecordSchema,
  resolveNextRecordSchema,
  SolidifiedSchema,
} from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test({ name: 'resolveInitialRecordSchema' }, async (testContext) => {
  const inputSolidifiedSchema = getInitialSolidifiedSchema();
  const resolveRecordSchema = resolveInitialRecordSchema({
    solidifiedSchema: inputSolidifiedSchema,
  });
  const resolvedRecordModel = resolveRecordSchema.schemaMap['BasicDataModel']!;
  const inputSolidifiedModel = inputSolidifiedSchema
    .schemaMap['BasicDataModel']!;
  await testContext.step('input model data applied', () => {
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
        resolvedRecordModel.modelEncoding,
        [
          {
            entryPropertyKey: 'aaaProperty_EXAMPLE',
          },
          {
            entryPropertyKey: 'bbbProperty_EXAMPLE',
          },
          {
            entryPropertyKey: 'cccProperty_EXAMPLE',
          },
        ],
      );
    });
  });
});

Deno.test({ name: 'resolveNextRecordSchema' }, async (testContext) => {
  const updatedRecordSchema = resolveNextRecordSchema({
    staleRecordSchema: resolveInitialRecordSchema({
      solidifiedSchema: getInitialSolidifiedSchema(),
    }),
    solidifiedSchema: getUpdatedSolidifiedSchema(),
  });
  const updatedRecordModel = updatedRecordSchema.schemaMap['BasicDataModel']!;
  await testContext.step('model encoding', async (subTestContext) => {
    await subTestContext.step(
      'remaining pre-existing properties prepended',
      () => {
        Assert.assertEquals(updatedRecordModel.modelEncoding.slice(0, 2), [
          {
            entryPropertyKey: 'bbbProperty_EXAMPLE',
          },
          {
            entryPropertyKey: 'cccProperty_EXAMPLE',
          },
        ]);
      },
    );
    await subTestContext.step(
      'new properties sorted and appended',
      () => {
        Assert.assertEquals(updatedRecordModel.modelEncoding.slice(2, 4), [
          {
            entryPropertyKey: 'aaaUpdatedProperty_EXAMPLE',
          },
          {
            entryPropertyKey: 'dddProperty_EXAMPLE',
          },
        ]);
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
