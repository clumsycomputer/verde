import { TestCase } from '../../helpers/TestCase.ts';
import { getStyledText } from '../../helpers/getStyledText.ts';
import { expectedIntermediateSchema } from '../expectations/deriveIntermediateSchema.expected.ts';

export interface GetDeriveIntermediateSchemaTestCasesApi {
  schemaSources: Record<string, string>;
}

export function getDeriveIntermediateSchemaTestCases(
  api: GetDeriveIntermediateSchemaTestCasesApi,
): Array<TestCase> {
  const { schemaSources } = api;
  return [
    {
      caseKey: 'concreteModelTemplate',
      caseNotes: [
        getStyledText({
          textSource: 'concrete model template',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelTemplates"][number] => ConcreteModelTemplate',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [49, 70],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(7, 109),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [39, 60],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['CompositeDataModel']
              ?.modelTemplates[0],
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'genericModelTemplate',
      caseNotes: [
        getStyledText({
          textSource: 'generic model template',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelTemplates"][number] => GenericModelTemplate',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [49, 70],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(7, 109),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [62, 99],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['CompositeDataModel']
              ?.modelTemplates[1],
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'booleanLiteralElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'boolean literal element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanLiteralElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 90],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [53, 57],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['booleanLiteralProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'numberLiteralElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'number literal element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberLiteralElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 89],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [84, 87],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['numberLiteralProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'stringLiteralElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'string literal element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringLiteralElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 89],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [114, 121],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['stringLiteralProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'booleanElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'boolean element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 89],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [142, 149],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['booleanProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'numberElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'number element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 82],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [169, 175],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['numberProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'stringElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'string element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 82],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [195, 201],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['stringProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'dataModelReferenceElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'data model reference element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 94],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [224, 238],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['dataModelProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'directRecursiveDataModelReferenceElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource:
            'direct recursive data model reference element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel>: ThisDataModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement["dataModelNameKey"] === ThisDataModel["modelName"]',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [110, 186],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [10, 24],
          }, {
            decorationRange: [224, 238],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['dataModelProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [61, 77],
          }],
        }),
      ],
    },
    {
      caseKey: 'aliasReferenceElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'alias reference element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => AliasReferenceElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 90],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [257, 271],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['aliasProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'verdeTableElement-aliasReferenceElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource:
            'verde table element => alias reference element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<AliasReferenceElement>',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 109],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [295, 321],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['verdeTableProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'verdeTableElement-stringElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'verde table element => string element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<StringElement>',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 101],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [345, 363],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['verdeArrayProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'objectStructureElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'object structure element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => ObjectStructureElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 91],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [383, 416],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['objectProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'tupleStructureElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'tuple structure element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => TupleStructureElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 90],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [435, 464],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['tupleProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'unionCompositionElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'union composition element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => UnionCompositionElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [69, 92],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [483, 496],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['unionProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'nullElement__unionCompositionElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'null element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => UnionCompositionElement => NullElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [96, 107],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [492, 496],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels.data['BasicDataModel']!
              .modelProperties['unionProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [104, 134],
          }],
        }),
      ],
    },
    {
      caseKey: 'genericParameter',
      caseNotes: [
        getStyledText({
          textSource: 'generic parameter',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            'GenericTemplateIntermediateModel["genericParameters"][number] => GenericParameter',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [65, 81],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            239,
            513,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [34, 48],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels
              .genericTemplate['GenericTemplateModel']!.genericParameters[0],
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            239,
            513,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [52, 87],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels
              .genericTemplate['GenericTemplateModel']!.genericParameters[1],
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            239,
            513,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [91, 116],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels
              .genericTemplate['GenericTemplateModel']!.genericParameters[2],
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'basicParameterElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'basic parameter element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => BasicParameterElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [82, 103],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            239,
            513,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [34, 48],
          }, {
            decorationRange: [203, 217],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels
              .genericTemplate['GenericTemplateModel']!
              .modelProperties['basicParameterProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'genericParameterElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'constrained parameter element (model property)',
          textStyleCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => ConstrainedParameterElement',
          textStyleCodes: [3, 1, 44],
          textDecorations: [{
            decorationRange: [82, 109],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            239,
            513,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [
            { decorationRange: [52, 87] },
            { decorationRange: [251, 271] },
          ],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels
              .genericTemplate['GenericTemplateModel']!
              .modelProperties['constrainedParameterProperty']!.propertyElement,
            null,
            1,
          ),
          textStyleCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    // parameter element as generic argument
    // indirect recursive data model reference element (model property)
    // direct recursive data model reference element (generic argument)    
    // indirect recursive data model reference element (generic argument)
  ];
}
