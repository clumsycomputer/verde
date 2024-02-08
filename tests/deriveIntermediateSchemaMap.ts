import { deriveIntermediateSchemaMap } from '../source/library/module.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from './imports/Assert.ts';

Deno.test({ name: 'non-tuple export type' }, () => {
  Assert.assertThrows(
    () => {
      deriveIntermediateSchemaMap({
        schemaModulePath: resolveCasePath({
          someCaseName: 'NonTupleExportType',
        }),
      });
    },
    Error,
    `NonTupleExportType: unknown is not a tuple`,
  );
});

Deno.test({ name: 'invalid top-level model' }, () => {
  Assert.assertThrows(
    () => {
      deriveIntermediateSchemaMap({
        schemaModulePath: resolveCasePath({
          someCaseName: 'InvalidTopLevelModel',
        }),
      });
    },
    Error,
    `invalid top-level model: FooModel<unknown>`,
  );
});

Deno.test({ name: 'invalid model property' }, () => {
  Assert.assertThrows(
    () => {
      deriveIntermediateSchemaMap({
        schemaModulePath: resolveCasePath({
          someCaseName: 'InvalidModelProperty',
        }),
      });
    },
    Error,
    `invalid model property: FooDataModel["invalidProperty"]`,
  );
});

Deno.test({ name: 'invalid model extension' }, () => {
  Assert.assertThrows(
    () => {
      deriveIntermediateSchemaMap({
        schemaModulePath: resolveCasePath({
          someCaseName: 'InvalidModelExtension',
        }),
      });
    },
    Error,
    'invalid extension argument: unknown in BazTemplateModel<unknown> on FooDataModel',
  );
});

Deno.test({ name: 'valid schema' }, () => {
  const validSchemaMap = deriveIntermediateSchemaMap({
    schemaModulePath: resolveCasePath({
      someCaseName: 'ValidSchema',
    }),
  });
  Assert.assertEquals(validSchemaMap, {
    schemaSymbol: 'ValidSchema',
    schemaModels: {
      BasicDataModel_EXAMPLE: {
        modelKind: 'data',
        modelKey: 'BasicDataModel_EXAMPLE',
        modelSymbol: 'BasicDataModel_EXAMPLE',
        modelTemplates: [],
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
              dataModelKey: 'PropertyDataModel_EXAMPLE',
            },
          },
        },
      },
      PropertyDataModel_EXAMPLE: {
        modelKind: 'data',
        modelKey: 'PropertyDataModel_EXAMPLE',
        modelSymbol: 'PropertyDataModel_EXAMPLE',
        modelTemplates: [],
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
        modelKey: 'CompositeDataModel_EXAMPLE',
        modelSymbol: 'CompositeDataModel_EXAMPLE',
        modelTemplates: [{
          templateKind: 'concrete',
          templateModelKey: 'ConcreteTemplateModel_EXAMPLE',
        }, {
          templateKind: 'generic',
          templateModelKey: 'GenericTemplateModel_EXAMPLE',
          genericArguments: [
            {
              argumentElement: {
                elementKind: 'dataModel',
                dataModelKey: 'PropertyDataModel_EXAMPLE',
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
        modelKey: 'ConcreteTemplateModel_EXAMPLE',
        modelSymbol: 'ConcreteTemplateModel_EXAMPLE',
        modelTemplates: [],
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
        modelKey: 'GenericTemplateModel_EXAMPLE',
        modelSymbol: 'GenericTemplateModel_EXAMPLE',
        modelTemplates: [],
        genericParameters: [
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
