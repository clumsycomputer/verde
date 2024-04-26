import { throwInvalidPathError } from '../../../source/helpers/throwError.ts';
import { IntermediateSchema } from '../../../source/library/schema/types/IntermediateSchema.ts';
import { Assert } from '../../imports/Assert.ts';

export interface deriveIntermediateSchema__AssertionsApi {
  testContext: Deno.TestContext;
  schemaSourceInputs: Record<string, string>;
  expectedIntermediateSchema: IntermediateSchema;
  actualIntermediateSchema: IntermediateSchema;
}

export function deriveIntermediateSchema__Assertions(
  api: deriveIntermediateSchema__AssertionsApi,
) {
  const {
    testContext,
    schemaSourceInputs,
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
      caseOutputPath: [
        'schemaModels',
        'data',
        'CompositeDataModel',
        'modelTemplates',
        0,
      ],
      caseHighlights: [{
        highlightExpected: 'ConcreteTemplateModel',
        highlightSource: schemaSourceInputs['CompositeDataModel']!,
        highlightRange: [39, 60],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelTemplates"][number] => GenericModelTemplate',
      caseOutputPath: [
        'schemaModels',
        'data',
        'CompositeDataModel',
        'modelTemplates',
        1,
      ],
      caseHighlights: [{
        highlightExpected: 'GenericTemplateModel<boolean, number>',
        highlightSource: schemaSourceInputs['CompositeDataModel']!,
        highlightRange: [62, 99],
      }],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanLiteralElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'booleanLiteralProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'booleanLiteralProperty: true;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [29, 58],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberLiteralElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'numberLiteralProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'numberLiteralProperty: 123;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [61, 88],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringLiteralElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'stringLiteralProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'stringLiteralProperty: "hello";',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [91, 122],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'booleanProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'booleanProperty: boolean;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [125, 150],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'numberProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'numberProperty: number;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [153, 176],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'stringProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'stringProperty: string;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [179, 202],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'dataModelProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'dataModelProperty: BasicDataModel;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [205, 239],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => AliasReferenceElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'aliasProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'aliasProperty: DataModelUnion;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [242, 272],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'verdeTableProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'verdeTableProperty: VerdeTable<DataModelUnion>;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [275, 322],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'verdeArrayProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'verdeArrayProperty: VerdeArray<string>;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [325, 364],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => ObjectStructureElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'objectProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'objectProperty: { objectStringProperty: string; };',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [367, 417],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => TupleStructureElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'tupleProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'tupleProperty: [tupleNumberProperty: number];',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [420, 465],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => UnionCompositionElement',
      caseOutputPath: [
        'schemaModels',
        'data',
        'BasicDataModel',
        'modelProperties',
        'unionProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'unionProperty: string | null;',
          highlightSource: schemaSourceInputs['BasicDataModel']!,
          highlightRange: [468, 497],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        'GenericTemplateIntermediateModel["genericParameters"][number] => GenericParameter',
      caseOutputPath: [
        'schemaModels',
        'genericTemplate',
        'GenericTemplateModel',
        'genericParameters',
        0,
      ],
      caseHighlights: [{
        highlightExpected: 'BasicParameter',
        highlightSource: schemaSourceInputs['GenericTemplateModel']!,
        highlightRange: [31, 45],
      }],
    }),   
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => BasicParameterElement',
      caseOutputPath: [
        'schemaModels',
        'genericTemplate',
        'GenericTemplateModel',
        'modelProperties',
        'basicParameterProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'BasicParameter',
          highlightSource: schemaSourceInputs['GenericTemplateModel']!,
          highlightRange: [31, 45],
        },
        {
          highlightExpected: 'basicParameterProperty: BasicParameter;',
          highlightSource: schemaSourceInputs['GenericTemplateModel']!,
          highlightRange: [115, 154],
        },
      ],
    }),
    schemaTestCase({
      testContext,
      expectedIntermediateSchema,
      actualIntermediateSchema,
      caseLabel:
        'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => ConstrainedParameterElement',
      caseOutputPath: [
        'schemaModels',
        'genericTemplate',
        'GenericTemplateModel',
        'modelProperties',
        'constrainedParameterProperty',
        'propertyElement',
      ],
      caseHighlights: [
        {
          highlightExpected: 'ConstrainedParameter',
          highlightSource: schemaSourceInputs['GenericTemplateModel']!,
          highlightRange: [47, 67],
        },
        {
          highlightExpected:
            'constrainedParameterProperty: ConstrainedParameter;',
          highlightSource: schemaSourceInputs['GenericTemplateModel']!,
          highlightRange: [157, 208],
        },
      ],
    }), 
  ]);
}

interface SchemaTestCaseApi extends
  Pick<
    deriveIntermediateSchema__AssertionsApi,
    'testContext' | 'expectedIntermediateSchema' | 'actualIntermediateSchema'
  > {
  caseLabel: string;
  caseOutputPath: Array<string | number>;
  caseHighlights: Array<{
    highlightSource: string;
    highlightRange: [number, number];
    highlightExpected: string;
  }>;
}

function schemaTestCase(api: SchemaTestCaseApi) {
  const {
    testContext,
    caseLabel,
    caseHighlights,
    caseOutputPath,
    expectedIntermediateSchema,
    actualIntermediateSchema,
  } = api;
  return testContext.step(caseLabel, () => {
    caseHighlights.forEach(
      ({ highlightExpected, highlightSource, highlightRange }) => {
        Assert.assertEquals(
          highlightExpected,
          highlightSource.substring(
            highlightRange[0],
            highlightRange[1],
          ),
        );
      },
    );
    const [expectedOutput, actualOutput] = retrieveCaseOutput({
      caseOutputPath,
      expectedInput: expectedIntermediateSchema,
      actualInput: actualIntermediateSchema,
    });
    Assert.assertEquals(
      expectedOutput,
      actualOutput,
    );
  });
}

interface RetrieveCaseOutputApi
  extends Pick<SchemaTestCaseApi, 'caseOutputPath'> {
  expectedInput: any;
  actualInput: any;
}

function retrieveCaseOutput(api: RetrieveCaseOutputApi): [unknown, unknown] {
  const { caseOutputPath, expectedInput, actualInput } = api;
  const [currentPathKey, ...remainingOutputPath] = caseOutputPath;
  return currentPathKey
    ? retrieveCaseOutput({
      caseOutputPath: remainingOutputPath,
      expectedInput: expectedInput[currentPathKey] ??
        throwInvalidPathError('expectedInput[currentPathKey]'),
      actualInput: actualInput[currentPathKey] ??
        throwInvalidPathError('actualInput[currentPathKey]'),
    })
    : [expectedInput, actualInput];
}
