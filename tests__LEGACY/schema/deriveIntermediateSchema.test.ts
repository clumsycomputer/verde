import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from '../imports/Assert.ts';
import { throwInvalidPathError } from '../../source/helpers/throwError.ts';

Deno.test('deriveIntermediateSchema', async (testContext) => {
  await testContext.step('schema errors', async (subTestContext) => {
    await subTestContext.step('invalid schema export', () => {
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
    await subTestContext.step('invalid top-level model', () => {
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
    await subTestContext.step('invalid model template', () => {
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
    await subTestContext.step('invalid model element', () => {
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
  });
  await testContext.step('valid schema', async (testContextBbb) => {
    const intermediateSchemaExample = deriveIntermediateSchema({
      schemaModulePath: resolveCasePath({
        someCaseName: 'ValidSchema',
      }),
    });
    const compositeDataModelExample = intermediateSchemaExample.schemaMap
      .data['CompositeDataModel__EXAMPLE']!;
    const genericTemplateModelExample = intermediateSchemaExample.schemaMap
      .genericTemplate['GenericTemplateModel__EXAMPLE']!;
    await testContextBbb.step('model parameters', async (testContextCcc) => {
      const genericTemplateExample =
        compositeDataModelExample.modelTemplates[1] &&
          compositeDataModelExample.modelTemplates[1].templateKind ===
            'genericTemplate'
          ? compositeDataModelExample.modelTemplates[1]
          : throwInvalidPathError('genericTemplate');
      await testContextCcc.step('basic parameter', () => {
        Assert.assertEquals(genericTemplateModelExample.genericParameters[0], {
          parameterSymbol: 'BasicParameter__EXAMPLE',
        });
        Assert.assertEquals(
          genericTemplateExample.genericArguments['BasicParameter__EXAMPLE'],
          {
            argumentIndex: 0,
            argumentParameterSymbolKey: 'BasicParameter__EXAMPLE',
            argumentElement: {
              elementKind: 'booleanPrimitive',
            },
          },
        );
      });
      await testContextCcc.step('constrained parameter', () => {
        Assert.assertEquals(genericTemplateModelExample.genericParameters[1], {
          parameterSymbol: 'ConstrainedParameter__EXAMPLE',
        });
        Assert.assertEquals(
          genericTemplateExample
            .genericArguments['ConstrainedParameter__EXAMPLE'],
          {
            argumentIndex: 1,
            argumentParameterSymbolKey: 'ConstrainedParameter__EXAMPLE',
            argumentElement: {
              elementKind: 'numberPrimitive',
            },
          },
        );
      });
      await testContextCcc.step('parameter with default', () => {
        Assert.assertEquals(genericTemplateModelExample.genericParameters[2], {
          parameterSymbol: 'DefaultParameter__EXAMPLE',
        });
        Assert.assertEquals(
          genericTemplateExample
            .genericArguments['DefaultParameter__EXAMPLE'],
          {
            argumentIndex: 2,
            argumentParameterSymbolKey: 'DefaultParameter__EXAMPLE',
            argumentElement: {
              elementKind: 'stringPrimitive',
            },
          },
        );
      });
    });
    await testContextBbb.step('model templates', async (testContextCcc) => {
      await testContextCcc.step('concrete template', () => {
        Assert.assertEquals(compositeDataModelExample.modelTemplates[0], {
          templateKind: 'concreteTemplate',
          templateModelSymbolKey: 'ConcreteTemplateModel__EXAMPLE',
        });
      });
      await testContextCcc.step('generic template', () => {
        Assert.assertEquals(compositeDataModelExample.modelTemplates[1], {
          templateKind: 'genericTemplate',
          templateModelSymbolKey: 'GenericTemplateModel__EXAMPLE',
          genericArguments: {
            BasicParameter__EXAMPLE: {
              argumentIndex: 0,
              argumentParameterSymbolKey: 'BasicParameter__EXAMPLE',
              argumentElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            ConstrainedParameter__EXAMPLE: {
              argumentIndex: 1,
              argumentParameterSymbolKey: 'ConstrainedParameter__EXAMPLE',
              argumentElement: {
                elementKind: 'numberPrimitive',
              },
            },
            DefaultParameter__EXAMPLE: {
              argumentIndex: 2,
              argumentParameterSymbolKey: 'DefaultParameter__EXAMPLE',
              argumentElement: {
                elementKind: 'stringPrimitive',
              },
            },
          },
        });
      });
    });
    await testContextBbb.step('model elements', async (testContextCcc) => {
      const basicDataModelExample = intermediateSchemaExample
        .schemaMap.data['BasicDataModel__EXAMPLE']!;
      await testContextCcc.step('string primitive', () => {
        Assert.assertEquals(
          basicDataModelExample.modelProperties['stringProperty__EXAMPLE']
            ?.propertyElement,
          {
            elementKind: 'stringPrimitive',
          },
        );
      });
      await testContextCcc.step('number primitive', () => {
        Assert.assertEquals(
          basicDataModelExample.modelProperties['numberProperty__EXAMPLE']
            ?.propertyElement,
          {
            elementKind: 'numberPrimitive',
          },
        );
      });
      await testContextCcc.step('boolean primitive', () => {
        Assert.assertEquals(
          basicDataModelExample.modelProperties['booleanProperty__EXAMPLE']
            ?.propertyElement,
          {
            elementKind: 'booleanPrimitive',
          },
        );
      });
      await testContextCcc.step('string literal', () => {
        Assert.assertEquals(
          basicDataModelExample
            .modelProperties['stringLiteralProperty__EXAMPLE']
            ?.propertyElement,
          {
            elementKind: 'stringLiteral',
            literalSymbol: '"foo"',
          },
        );
      });
      await testContextCcc.step('number literal', () => {
        Assert.assertEquals(
          basicDataModelExample
            .modelProperties['numberLiteralProperty__EXAMPLE']
            ?.propertyElement,
          {
            elementKind: 'numberLiteral',
            literalSymbol: '7',
          },
        );
      });
      await testContextCcc.step('boolean literal', () => {
        Assert.assertEquals(
          basicDataModelExample
            .modelProperties['booleanLiteralProperty__EXAMPLE']
            ?.propertyElement,
          {
            elementKind: 'booleanLiteral',
            literalSymbol: 'true',
          },
        );
      });
      await testContextCcc.step('data model', () => {
        Assert.assertEquals(
          basicDataModelExample.modelProperties['dataModelProperty__EXAMPLE']
            ?.propertyElement,
          {
            elementKind: 'dataModel',
            dataModelSymbolKey: 'CompositeDataModel__EXAMPLE',
          },
        );
      });
      await testContextCcc.step('basic parameter', () => {
        Assert.assertEquals(
          genericTemplateModelExample
            .modelProperties['basicParameterProperty__EXAMPLE']
            ?.propertyElement,
          {
            elementKind: 'basicParameter',
            parameterSymbol: 'BasicParameter__EXAMPLE',
          },
        );
      });
      await testContextCcc.step('constrained parameter', () => {
        Assert.assertEquals(
          genericTemplateModelExample
            .modelProperties['constrainedParameterProperty__EXAMPLE']
            ?.propertyElement,
          {
            elementKind: 'constrainedParameter',
            parameterSymbol: 'ConstrainedParameter__EXAMPLE',
          },
        );
      });
    });
  });
});
