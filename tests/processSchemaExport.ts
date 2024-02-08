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
    'invalid extension argument: unknown in BazTemplateModel<unknown> on FooDataModel',
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
      BasicDataModel_EXAMPLE: {
        modelKind: 'data',
        modelId: 'BasicDataModel_EXAMPLE',
        modelSymbol: 'BasicDataModel_EXAMPLE',
        modelExtensions: [],
        modelProperties: {
          stringProperty_EXAMPLE: {
            propertyKey: 'stringProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'primitive',
              primitiveKind: 'string',
            },
          },
          numberProperty_EXAMPLE: {
            propertyKey: 'numberProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'primitive',
              primitiveKind: 'number',
            },
          },
          booleanProperty_EXAMPLE: {
            propertyKey: 'booleanProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'primitive',
              primitiveKind: 'boolean',
            },
          },
          interfaceProperty_EXAMPLE: {
            propertyKey: 'interfaceProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'dataModel',
              dataModelId: 'PropertyDataModel_EXAMPLE',
            },
          },
        },
      },
      PropertyDataModel_EXAMPLE: {
        modelKind: 'data',
        modelId: 'PropertyDataModel_EXAMPLE',
        modelSymbol: 'PropertyDataModel_EXAMPLE',
        modelExtensions: [],
        modelProperties: {
          fooProperty: {
            propertyKey: 'fooProperty',
            propertyElement: {
              elementKind: 'primitive',
              primitiveKind: 'string',
            },
          },
        },
      },
      CompositeDataModel_EXAMPLE: {
        modelKind: 'data',
        modelId: 'CompositeDataModel_EXAMPLE',
        modelSymbol: 'CompositeDataModel_EXAMPLE',
        modelExtensions: [{
          extensionKind: 'concrete',
          extensionModelId: 'ConcreteTemplateModel_EXAMPLE',
        }, {
          extensionKind: 'generic',
          extensionModelId: 'GenericTemplateModel_EXAMPLE',
          extensionArguments: [
            {
              argumentElement: {
                elementKind: 'dataModel',
                dataModelId: 'PropertyDataModel_EXAMPLE',
              },
            },
            {
              argumentElement: {
                elementKind: 'literal',
                literalKind: 'number',
                literalSymbol: '7',
              },
            },
            {
              argumentElement: {
                elementKind: 'primitive',
                primitiveKind: 'string',
              },
            },
          ],
        }],
        modelProperties: {
          bazProperty: {
            propertyKey: 'bazProperty',
            propertyElement: {
              elementKind: 'primitive',
              primitiveKind: 'number',
            },
          },
        },
      },
      ConcreteTemplateModel_EXAMPLE: {
        modelKind: 'template',
        templateKind: 'concrete',
        modelId: 'ConcreteTemplateModel_EXAMPLE',
        modelSymbol: 'ConcreteTemplateModel_EXAMPLE',
        modelExtensions: [],
        modelProperties: {
          tazProperty: {
            propertyKey: 'tazProperty',
            propertyElement: {
              elementKind: 'primitive',
              primitiveKind: 'string',
            },
          },
        },
      },
      GenericTemplateModel_EXAMPLE: {
        modelKind: 'template',
        templateKind: 'generic',
        modelId: 'GenericTemplateModel_EXAMPLE',
        modelSymbol: 'GenericTemplateModel_EXAMPLE',
        modelExtensions: [],
        templateParameters: [
          { parameterSymbol: 'BasicParameter_EXAMPLE' },
          { parameterSymbol: 'ConstrainedParameter_EXAMPLE' },
          { parameterSymbol: 'DefaultParameter_EXAMPLE' },
        ],
        modelProperties: {
          basicParameterProperty_EXAMPLE: {
            propertyKey: 'basicParameterProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'parameter',
              parameterKind: 'basic',
              // parameterSymbol: 'BasicParameter_EXAMPLE',
            },
          },
          constrainedParameterProperty_EXAMPLE: {
            propertyKey: 'constrainedParameterProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'parameter',
              parameterKind: 'constrained',
              // parameterSymbol: 'ConstrainedParameter_EXAMPLE',
            },
          },
          defaultParameterProperty_EXAMPLE: {
            propertyKey: 'defaultParameterProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'parameter',
              parameterKind: 'basic',
              // parameterSymbol: 'DefaultParameter_EXAMPLE',
            },
          },
        },
      },
    },
  });
});
