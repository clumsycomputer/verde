import { resolveSolidifiedSchema } from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test({ name: 'resolveSolidifiedSchema' }, async (testContext) => {
    const compositeDataModelSolidifiedSchema = resolveSolidifiedSchema({
      intermediateSchema: {
        schemaSymbol: 'CompositeDataModelSchema__EXAMPLE',
        schemaMap: {
          data: {
            CompositeDataModel__EXAMPLE: {
              modelKind: 'data',
              modelSymbolKey: 'CompositeDataModel__EXAMPLE',
              modelTemplates: [
                {
                  templateKind: 'concreteTemplate',
                  templateModelSymbolKey: 'ConcreteTemplateModel__EXAMPLE',
                },
                {
                  templateKind: 'genericTemplate',
                  templateModelSymbolKey:
                    'CompositeGenericTemplateModel__EXAMPLE',
                  genericArguments: {
                    IndirectParameter__EXAMPLE: {
                      argumentIndex: 0,
                      argumentParameterSymbolKey: 'IndirectParameter__EXAMPLE',
                      argumentElement: {
                        elementKind: 'booleanPrimitive',
                      },
                    },
                  },
                },
              ],
              modelProperties: {
                dataModelProperty__EXAMPLE: {
                  propertyKey: 'dataModelProperty__EXAMPLE',
                  propertyElement: {
                    elementKind: 'booleanPrimitive',
                  },
                },
              },
            },
          },
          concreteTemplate: {
            ConcreteTemplateModel__EXAMPLE: {
              modelKind: 'concreteTemplate',
              modelSymbolKey: 'ConcreteTemplateModel__EXAMPLE',
              modelTemplates: [],
              modelProperties: {
                concreteTemplateModelProperty__EXAMPLE: {
                  propertyKey: 'concreteTemplateModelProperty__EXAMPLE',
                  propertyElement: {
                    elementKind: 'booleanPrimitive',
                  },
                },
              },
            },
          },
          genericTemplate: {
            TerminalGenericTemplateModel__EXAMPLE: {
              modelKind: 'genericTemplate',
              modelSymbolKey: 'TerminalGenericTemplateModel__EXAMPLE',
              genericParameters: [
                {
                  parameterSymbol: 'BasicParameter__EXAMPLE',
                },
                {
                  parameterSymbol: 'ConstrainedParameter__EXAMPLE',
                },
              ],
              modelTemplates: [],
              modelProperties: {
                terminalGenericTemplateModelProperty__EXAMPLE: {
                  propertyKey: 'terminalGenericTemplateModelProperty__EXAMPLE',
                  propertyElement: {
                    elementKind: 'booleanPrimitive',
                  },
                },
                basicParameterProperty__EXAMPLE: {
                  propertyKey: 'basicParameterProperty__EXAMPLE',
                  propertyElement: {
                    elementKind: 'basicParameter',
                    parameterSymbol: 'BasicParameter__EXAMPLE',
                  },
                },
                constrainedParameterProperty__EXAMPLE: {
                  propertyKey: 'constrainedParameterProperty__EXAMPLE',
                  propertyElement: {
                    elementKind: 'constrainedParameter',
                    parameterSymbol: 'ConstrainedParameter__EXAMPLE',
                  },
                },
              },
            },
            CompositeGenericTemplateModel__EXAMPLE: {
              modelKind: 'genericTemplate',
              modelSymbolKey: 'CompositeGenericTemplateModel__EXAMPLE',
              genericParameters: [
                {
                  parameterSymbol: 'IndirectParameter__EXAMPLE',
                },
              ],
              modelTemplates: [
                {
                  templateKind: 'genericTemplate',
                  templateModelSymbolKey:
                    'TerminalGenericTemplateModel__EXAMPLE',
                  genericArguments: {
                    BasicParameter__EXAMPLE: {
                      argumentIndex: 0,
                      argumentParameterSymbolKey: 'BasicParameter__EXAMPLE',
                      argumentElement: {
                        elementKind: 'basicParameter',
                        parameterSymbol: 'IndirectParameter__EXAMPLE',
                      },
                    },
                    ConstrainedParameter__EXAMPLE: {
                      argumentIndex: 1,
                      argumentParameterSymbolKey:
                        'ConstrainedParameter__EXAMPLE',
                      argumentElement: {
                        elementKind: 'booleanPrimitive',
                      },
                    },
                  },
                },
              ],
              modelProperties: {
                compositeGenericTemplateModelProperty__EXAMPLE: {
                  propertyKey: 'compositeGenericTemplateModelProperty__EXAMPLE',
                  propertyElement: {
                    elementKind: 'booleanPrimitive',
                  },
                },
              },
            },
          },
        },
      },
    });
    await testContext.step('generic parameter argument resolved', () => {
      Assert.assertEquals(
        compositeDataModelSolidifiedSchema
          .schemaMap['CompositeDataModel__EXAMPLE']
          ?.modelProperties['basicParameterProperty__EXAMPLE']?.propertyElement,
        {
          elementKind: 'booleanPrimitive',
        },
      );
    });
    Assert.assertEquals(compositeDataModelSolidifiedSchema, {
      schemaSymbol: 'CompositeDataModelSchema__EXAMPLE',
      schemaMap: {
        CompositeDataModel__EXAMPLE: {
          modelSymbolKey: 'CompositeDataModel__EXAMPLE',
          modelProperties: {
            dataModelProperty__EXAMPLE: {
              propertyKey: 'dataModelProperty__EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            concreteTemplateModelProperty__EXAMPLE: {
              propertyKey: 'concreteTemplateModelProperty__EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            compositeGenericTemplateModelProperty__EXAMPLE: {
              propertyKey: 'compositeGenericTemplateModelProperty__EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            terminalGenericTemplateModelProperty__EXAMPLE: {
              propertyKey: 'terminalGenericTemplateModelProperty__EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            basicParameterProperty__EXAMPLE: {
              propertyKey: 'basicParameterProperty__EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            constrainedParameterProperty__EXAMPLE: {
              propertyKey: 'constrainedParameterProperty__EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
          },
        },
      },
    });
});
