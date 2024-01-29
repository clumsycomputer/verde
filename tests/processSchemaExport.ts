import { loadSchemaModule } from '../source/loadSchemaModule.ts';
import { processSchemaExport } from '../source/processSchemaExport.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from './imports/Assert.ts';

Deno.test({ name: 'non-tuple export type' }, () => {
  Assert.assertThrows(
    () => {
      processSchemaExport(loadSchemaModule({
        schemaModulePath: resolveCasePath({
          someCaseName: 'NonTupleExportType',
        }),
      }));
    },
    Error,
    `NonTupleExportType: unknown is not a tuple`,
  );
});

Deno.test({ name: 'invalid top-level model' }, () => {
  Assert.assertThrows(
    () => {
      processSchemaExport(loadSchemaModule({
        schemaModulePath: resolveCasePath({
          someCaseName: 'InvalidTopLevelModel',
        }),
      }));
    },
    Error,
    `invalid top-level model: FooModel<unknown>`,
  );
});

Deno.test({ name: 'invalid model property' }, () => {
  Assert.assertThrows(
    () => {
      processSchemaExport(loadSchemaModule({
        schemaModulePath: resolveCasePath({
          someCaseName: 'InvalidModelProperty',
        }),
      }));
    },
    Error,
    `invalid model property: FooDataModel["invalidProperty"]`,
  );
});

Deno.test({ name: 'invalid model extension' }, () => {
  Assert.assertThrows(
    () => {
      processSchemaExport(loadSchemaModule({
        schemaModulePath: resolveCasePath({
          someCaseName: 'InvalidModelExtension',
        }),
      }));
    },
    Error,
    'invalid model extension: BazTemplateModel<unknown> on FooDataModel',
  );
});

Deno.test({ name: 'valid schema' }, () => {
  const validSchemaMap = processSchemaExport(loadSchemaModule({
    schemaModulePath: resolveCasePath({
      someCaseName: 'ValidSchema',
    }),
  }));
  Assert.assertEquals(validSchemaMap, {
    schemaSymbol: 'ValidSchema',
    schemaModels: {
      BasicDataModel: {
        modelKind: 'data',
        modelId: 'BasicDataModel',
        modelSymbol: 'BasicDataModel',
        modelExtensions: [],
        modelProperties: {
          stringProperty: {
            propertyKey: 'stringProperty',
            propertyKind: 'primitive',
            primitiveKind: 'string',
          },
          numberProperty: {
            propertyKey: 'numberProperty',
            propertyKind: 'primitive',
            primitiveKind: 'number',
          },
          booleanProperty: {
            propertyKey: 'booleanProperty',
            propertyKind: 'primitive',
            primitiveKind: 'boolean',
          },
          interfaceProperty: {
            propertyKey: 'interfaceProperty',
            propertyKind: 'dataModel',
            dataModelId: 'PropertyDataModel',
          },
        },
      },
      PropertyDataModel: {
        modelKind: 'data',
        modelId: 'PropertyDataModel',
        modelSymbol: 'PropertyDataModel',
        modelExtensions: [],
        modelProperties: {
          fooProperty: {
            propertyKey: 'fooProperty',
            propertyKind: 'primitive',
            primitiveKind: 'string',
          },
        },
      },
      CompositeDataModel: {
        modelKind: 'data',
        modelId: 'CompositeDataModel',
        modelSymbol: 'CompositeDataModel',
        modelExtensions: [{
          extensionKind: 'concrete',
          extensionModelId: 'MetaConcreteTemplateModel',
        }],
        modelProperties: {
          bazProperty: {
            propertyKey: 'bazProperty',
            propertyKind: 'primitive',
            primitiveKind: 'number',
          },
        },
      },
      MetaConcreteTemplateModel: {
        modelKind: 'template',
        templateKind: 'concrete',
        modelId: 'MetaConcreteTemplateModel',
        modelSymbol: 'MetaConcreteTemplateModel',
        modelExtensions: [],
        modelProperties: {
          tazProperty: {
            propertyKey: 'tazProperty',
            propertyKind: 'primitive',
            primitiveKind: 'string'
          }
        }
      }
    },
  });
});
