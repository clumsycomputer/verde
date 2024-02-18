import { deriveIntermediateSchema } from '../source/library/module.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from './imports/Assert.ts';

Deno.test({ name: 'invalid schema export => not tuple' }, () => {
  Assert.assertThrows(
    () => {
      deriveIntermediateSchema({
        schemaModulePath: resolveCasePath({
          someCaseName: 'Error_InvalidSchemaExport_NotTuple',
        }),
      });
    },
    Error,
    `invalid schema export: "unknown" is not a tuple`,
  );
});

Deno.test({ name: 'invalid top-level model' }, () => {
  Assert.assertThrows(
    () => {
      deriveIntermediateSchema({
        schemaModulePath: resolveCasePath({
          someCaseName: 'Error_InvalidTopLevelModel',
        }),
      });
    },
    Error,
    `invalid top-level model: FooModel<unknown>`,
  );
});

Deno.test({ name: 'invalid model template' }, () => {
  Assert.assertThrows(
    () => {
      deriveIntermediateSchema({
        schemaModulePath: resolveCasePath({
          someCaseName: 'Error_InvalidModelTemplate',
        }),
      });
    },
    Error,
    `invalid model template: UnionTemplateModel on FooDataModel`,
  );
});

Deno.test({ name: 'invalid model element' }, () => {
  Assert.assertThrows(
    () => {
      deriveIntermediateSchema({
        schemaModulePath: resolveCasePath({
          someCaseName: 'Error_InvalidModelElement',
        }),
      });
    },
    Error,
    `invalid model element: TODO`,
  );
});

Deno.test({ name: 'valid schema' }, () => {
  const validSchemaMap = deriveIntermediateSchema({
    schemaModulePath: resolveCasePath({
      someCaseName: 'ValidSchema',
    }),
  });
  Assert.assertEquals(validSchemaMap, {
    schemaSymbol: 'ValidSchema',
    schemaMap: {
      data: {
        BasicDataModel_EXAMPLE: {
          modelKind: 'data',
          modelSymbolKey: 'BasicDataModel_EXAMPLE',
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
                dataModelSymbolKey: 'PropertyDataModel_EXAMPLE',
              },
            },
          },
        },
        PropertyDataModel_EXAMPLE: {
          modelKind: 'data',
          modelSymbolKey: 'PropertyDataModel_EXAMPLE',
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
          modelSymbolKey: 'CompositeDataModel_EXAMPLE',
          modelTemplates: [
            {
              templateKind: 'concreteTemplate',
              templateModelSymbolKey: 'ConcreteTemplateModel_EXAMPLE',
            },
            {
              templateKind: 'genericTemplate',
              templateModelSymbolKey: 'GenericTemplateModel_EXAMPLE',
              genericArguments: {
                'BasicParameter_EXAMPLE': {
                  argumentIndex: 0,
                  argumentSymbolKey: 'BasicParameter_EXAMPLE',
                  argumentElement: {
                    elementKind: 'dataModel',
                    dataModelSymbolKey: 'PropertyDataModel_EXAMPLE',
                  },
                },
                'ConstrainedParameter_EXAMPLE': {
                  argumentIndex: 1,
                  argumentSymbolKey: 'ConstrainedParameter_EXAMPLE',
                  argumentElement: {
                    elementKind: 'literal',
                    literalKind: 'number',
                    literalSymbol: '7',
                  },
                },
                'DefaultParameter_EXAMPLE': {
                  argumentIndex: 2,
                  argumentSymbolKey: 'DefaultParameter_EXAMPLE',
                  argumentElement: {
                    elementKind: 'primitive',
                    primitiveKind: 'string',
                  },
                },
              },
            },
          ],
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
      },
      concreteTemplate: {
        ConcreteTemplateModel_EXAMPLE: {
          modelKind: 'concreteTemplate',
          modelSymbolKey: 'ConcreteTemplateModel_EXAMPLE',
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
      },
      genericTemplate: {
        GenericTemplateModel_EXAMPLE: {
          modelKind: 'genericTemplate',
          modelSymbolKey: 'GenericTemplateModel_EXAMPLE',
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
                elementKind: 'basicParameter',
                parameterSymbol: 'BasicParameter_EXAMPLE',
              },
            },
            constrainedParameterProperty_EXAMPLE: {
              propertyKey: 'constrainedParameterProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'constrainedParameter',
                parameterSymbol: 'ConstrainedParameter_EXAMPLE',
              },
            },
            defaultParameterProperty_EXAMPLE: {
              propertyKey: 'defaultParameterProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'basicParameter',
                parameterSymbol: 'DefaultParameter_EXAMPLE',
              },
            },
          },
        },
      },
    },
  });
});
