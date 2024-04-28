import { throwInvalidPathError } from '../../../source/helpers/throwError.ts';
import { IntermediateSchema } from '../../../source/library/schema/types/IntermediateSchema.ts';
import { Assert } from '../../imports/Assert.ts';

export interface deriveIntermediateSchema__AssertionsApi {
  testContext: Deno.TestContext;
  expectedIntermediateSchema: IntermediateSchema;
  actualIntermediateSchema: IntermediateSchema;
  schemaSources: Record<string, string>;
}

export function deriveIntermediateSchema__Assertions(
  api: deriveIntermediateSchema__AssertionsApi,
) {
  const {
    testContext,
    schemaSources,
    expectedIntermediateSchema,
    actualIntermediateSchema,
  } = api;
  return Promise.all([
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelTemplates"][number] => ConcreteModelTemplate',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'CompositeDataModel',
        'modelTemplates',
        0,
      ],
      caseInputContext: [{
        contextSource: schemaSources['CompositeDataModel.ts']!,
        contextScopes: [{
          scopeRange: [7, 109],
          scopeHighlights: [{
            highlightRange: [39, 60],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelTemplates"][number] => GenericModelTemplate',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'CompositeDataModel',
        'modelTemplates',
        1,
      ],
      caseInputContext: [{
        contextSource: schemaSources['CompositeDataModel.ts']!,
        contextScopes: [{
          scopeRange: [7, 109],
          scopeHighlights: [{
            highlightRange: [62, 99],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanLiteralElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'booleanLiteralProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [29, 58],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberLiteralElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'numberLiteralProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [61, 88],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringLiteralElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'stringLiteralProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [91, 122],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'booleanProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [125, 150],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'numberProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [153, 176],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'stringProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [179, 202],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'dataModelProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [205, 239],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => AliasReferenceElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'aliasProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [242, 272],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'verdeTableProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [275, 322],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'verdeArrayProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [325, 364],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => ObjectStructureElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'objectProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [367, 417],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => TupleStructureElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'tupleProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [420, 465],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => UnionCompositionElement',
      caseAssertionPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'unionProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['ValidSchema.ts']!,
        contextScopes: [{
          scopeRange: [219, 718],
          scopeHighlights: [{
            highlightRange: [468, 497],
          }],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        'GenericTemplateIntermediateModel["genericParameters"][number] => GenericParameter',
      caseAssertionPath: [
        'schemaModels',
        'genericTemplate',
        'GenericTemplateModel',
        'genericParameters',
        0,
      ],
      caseInputContext: [{
        contextSource: schemaSources['CompositeDataModel.ts']!,
        contextScopes: [{
          scopeRange: [161, 380],
          scopeHighlights: [
            { highlightRange: [34, 48] },
            { highlightRange: [52, 87] },
            { highlightRange: [91, 116] },
          ],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => BasicParameterElement',
      caseAssertionPath: [
        'schemaModels',
        'genericTemplate',
        'GenericTemplateModel',
        'modelProperties',
        'basicParameterProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['CompositeDataModel.ts']!,
        contextScopes: [{
          scopeRange: [161, 380],
          scopeHighlights: [
            { highlightRange: [34, 48] },
            { highlightRange: [124, 163] }
          ],
        }],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => ConstrainedParameterElement',
      caseAssertionPath: [
        'schemaModels',
        'genericTemplate',
        'GenericTemplateModel',
        'modelProperties',
        'constrainedParameterProperty',
        'propertyElement',
      ],
      caseInputContext: [{
        contextSource: schemaSources['CompositeDataModel.ts']!,
        contextScopes: [{
          scopeRange: [161, 380],
          scopeHighlights: [
            { highlightRange: [52, 87] },
            { highlightRange: [166, 217] },
          ],
        }],
      }],
    }),
  ]);
}

interface SchemaTestCaseApi extends
  Pick<
    deriveIntermediateSchema__AssertionsApi,
    'testContext' | 'expectedIntermediateSchema' | 'actualIntermediateSchema'
  > {
  caseLabel: string;
  caseAssertionPath: Array<string | number>;
  caseInputContext: Array<{
    contextSource: string;
    contextScopes: Array<{
      scopeRange: [number, number];
      scopeHighlights: Array<{
        highlightRange: [number, number];
      }>;
    }>;
  }>;
}

function schemaTestCase(api: SchemaTestCaseApi) {
  const {
    testContext,
    caseLabel,
    caseAssertionPath,
    expectedIntermediateSchema,
    actualIntermediateSchema,
    caseInputContext,
  } = api;
  return testContext.step(caseLabel, () => {
    const [expectedAssertionValue, actualAssertionValue] =
      retrieveCaseAssertionValues({
        caseAssertionPath,
        expectedInput: expectedIntermediateSchema,
        actualInput: actualIntermediateSchema,
      });
    Assert.assertEquals(
      expectedAssertionValue,
      actualAssertionValue,
    );
    caseInputContext.forEach(
      ({ contextSource, contextScopes }) => {
        contextScopes.forEach(({ scopeRange, scopeHighlights }) => {
          const sourceScope = contextSource.substring(
            scopeRange[0],
            scopeRange[1],
          );
          console.log(sourceScope);
          scopeHighlights.forEach(({ highlightRange }) => {
            const scopeHighlight = sourceScope.substring(
              highlightRange[0],
              highlightRange[1],
            );
            console.log(scopeHighlight);
          });
          console.log('')
        });
      },
    );
  });
}

interface RetrieveCaseOutputApi
  extends Pick<SchemaTestCaseApi, 'caseAssertionPath'> {
  expectedInput: any;
  actualInput: any;
}

function retrieveCaseAssertionValues(
  api: RetrieveCaseOutputApi,
): [unknown, unknown] {
  const { caseAssertionPath, expectedInput, actualInput } = api;
  const [currentPathKey, ...remainingAssertionPath] = caseAssertionPath;
  return currentPathKey
    ? retrieveCaseAssertionValues({
      caseAssertionPath: remainingAssertionPath,
      expectedInput: expectedInput[currentPathKey] ??
        throwInvalidPathError('expectedInput[currentPathKey]'),
      actualInput: actualInput[currentPathKey] ??
        throwInvalidPathError('actualInput[currentPathKey]'),
    })
    : [expectedInput, actualInput];
}
