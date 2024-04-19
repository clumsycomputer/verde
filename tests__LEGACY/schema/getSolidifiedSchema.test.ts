import { getSolidifiedSchema } from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test({ name: 'getSolidifiedSchema' }, async (testContext) => {
  const resolvedSolidifiedSchema = getSolidifiedSchema({
    intermediateSchema: {
      schemaSymbol: 'CompositeDataModelSchema__EXAMPLE',
      schemaMap: {
        data: {
          CompositeDataModel__EXAMPLE: {
            modelKind: 'data',
            modelSymbol: 'CompositeDataModel__EXAMPLE',
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
            modelSymbol: 'ConcreteTemplateModel__EXAMPLE',
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
            modelSymbol: 'TerminalGenericTemplateModel__EXAMPLE',
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
            modelSymbol: 'CompositeGenericTemplateModel__EXAMPLE',
            genericParameters: [
              {
                parameterSymbol: 'IndirectParameter__EXAMPLE',
              },
            ],
            modelTemplates: [
              {
                templateKind: 'genericTemplate',
                templateModelSymbolKey: 'TerminalGenericTemplateModel__EXAMPLE',
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
                    argumentParameterSymbolKey: 'ConstrainedParameter__EXAMPLE',
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
  const resolvedSoldifiedModel = resolvedSolidifiedSchema
    .schemaMap['CompositeDataModel__EXAMPLE']!;
  await testContext.step('property resolution', async (subTestContext) => {
    await subTestContext.step('top-level property', () => {
      Assert.assertEquals(
        resolvedSoldifiedModel
          .modelProperties['dataModelProperty__EXAMPLE']?.propertyElement,
        {
          elementKind: 'booleanPrimitive',
        },
      );
    });
    await subTestContext.step('concrete template property', () => {
      Assert.assertEquals(
        resolvedSoldifiedModel
          .modelProperties['concreteTemplateModelProperty__EXAMPLE']
          ?.propertyElement,
        {
          elementKind: 'booleanPrimitive',
        },
      );
    });
    await subTestContext.step('generic template property', () => {
      Assert.assertEquals(
        resolvedSoldifiedModel
          .modelProperties['compositeGenericTemplateModelProperty__EXAMPLE']
          ?.propertyElement,
        {
          elementKind: 'booleanPrimitive',
        },
      );
    });
    await subTestContext.step('deep template property', () => {
      Assert.assertEquals(
        resolvedSoldifiedModel
          .modelProperties['terminalGenericTemplateModelProperty__EXAMPLE']
          ?.propertyElement,
        {
          elementKind: 'booleanPrimitive',
        },
      );
    });
  });
  await testContext.step('parameter resolution', async (subTestContext) => {
    await subTestContext.step('parameter argument', () => {
      Assert.assertEquals(
        resolvedSoldifiedModel
          .modelProperties['basicParameterProperty__EXAMPLE']?.propertyElement,
        {
          elementKind: 'booleanPrimitive',
        },
      );
    });
    await subTestContext.step('basic parameter property', () => {
      Assert.assertEquals(
        resolvedSoldifiedModel
          .modelProperties['basicParameterProperty__EXAMPLE']?.propertyElement,
        {
          elementKind: 'booleanPrimitive',
        },
      );
    });
    await subTestContext.step('constrained parameter property', () => {
      Assert.assertEquals(
        resolvedSoldifiedModel
          .modelProperties['constrainedParameterProperty__EXAMPLE']
          ?.propertyElement,
        {
          elementKind: 'booleanPrimitive',
        },
      );
    });
  });
});
