import { DataModelReferenceElement } from '../../../source/library/schema/types/SchemaElement.ts';
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
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelTemplates"][number] => ConcreteModelTemplate',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [49, 70],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(7, 109),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'genericModelTemplate',
      caseNotes: [
        getStyledText({
          textSource: 'generic model template',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelTemplates"][number] => GenericModelTemplate',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [49, 70],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(7, 109),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'booleanLiteralElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'boolean literal element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanLiteralElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 90],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'numberLiteralElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'number literal element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberLiteralElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 89],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'stringLiteralElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'string literal element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringLiteralElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 89],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'booleanElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'boolean element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 89],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'numberElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'number element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 82],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'stringElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'string element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 82],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'dataModelReferenceElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'data model reference element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 94],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
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
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel>: ThisDataModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement["dataModelNameKey"] === ThisDataModel["modelName"]',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [110, 186],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [10, 24],
          }, {
            decorationCodes: [3, 1, 44],
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
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => AliasReferenceElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 90],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
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
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<AliasReferenceElement>',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 109],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'verdeTableElement-stringElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'verde table element => string element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<StringElement>',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 101],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'objectStructureElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'object structure element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => ObjectStructureElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 91],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'tupleStructureElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'tuple structure element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => TupleStructureElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 90],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'unionCompositionElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'union composition element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => UnionCompositionElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [69, 92],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'nullElement__unionCompositionElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'null element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => UnionCompositionElement => NullElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [96, 107],
          }],
        }),
        getStyledText({
          textSource: schemaSources['ValidSchema.ts']!.substring(219, 718),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            'GenericTemplateIntermediateModel["genericParameters"][number] => GenericParameter',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [65, 81],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            161,
            380,
          ),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            161,
            380,
          ),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            161,
            380,
          ),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'basicParameterElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'basic parameter element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => BasicParameterElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [82, 103],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            161,
            380,
          ),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [34, 48],
          }, {
            decorationCodes: [3, 1, 44],
            decorationRange: [148, 162],
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
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
    {
      caseKey: 'genericParameterElement__modelProperty',
      caseNotes: [
        getStyledText({
          textSource: 'constrained parameter element (model property)',
          textCodes: [1, 4],
          textDecorations: [],
        }),
        getStyledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => ConstrainedParameterElement',
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [82, 109],
          }],
        }),
        getStyledText({
          textSource: schemaSources['CompositeDataModel.ts']!.substring(
            161,
            380,
          ),
          textCodes: [],
          textDecorations: [{
            decorationCodes: [3, 1, 44],
            decorationRange: [52, 87],
          }, {
            decorationCodes: [3, 1, 44],
            decorationRange: [196, 216],
          }],
        }),
        getStyledText({
          textSource: JSON.stringify(
            expectedIntermediateSchema.schemaModels
              .genericTemplate['GenericTemplateModel']!
              .modelProperties['constrainedParameterProperty']!.propertyElement,
            null,
            1,
          ),
          textCodes: [3, 1, 44],
          textDecorations: [],
        }),
      ],
    },
  ];
}
