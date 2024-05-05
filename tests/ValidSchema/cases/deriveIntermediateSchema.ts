import { TestCase } from '../../helpers/TestCase.ts';
import {
  branchJsonNode,
  leafJsonNode,
  styledJson,
} from '../../helpers/getStyledJson.ts';
import { styledText } from '../../helpers/getStyledText.ts';
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
        styledText({
          textSource: 'concrete model template',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelTemplates"][number] => ConcreteModelTemplate',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /ConcreteModelTemplate/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(7, 79),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__CC/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .data['Model__BB']!,
          jsonNodes: [branchJsonNode({
            nodeKey: 'modelTemplates',
            nodeChildren: [leafJsonNode({
              nodeKey: 0,
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
      ],
    },
    {
      caseKey: 'genericModelTemplate',
      caseNotes: [
        styledText({
          textSource: 'generic model template',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelTemplates"][number] => GenericModelTemplate',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /GenericModelTemplate/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(7, 79),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__DD<Model__BB, number>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .data['Model__BB']!,
          jsonNodes: [branchJsonNode({
            nodeKey: 'modelTemplates',
            nodeChildren: [leafJsonNode({
              nodeKey: 1,
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
      ],
    },
    {
      caseKey: 'booleanLiteralElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'boolean literal element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanLiteralElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /BooleanLiteralElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /true/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__AA'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'numberLiteralElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'number literal element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberLiteralElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /NumberLiteralElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /123/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__BB'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'stringLiteralElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'string literal element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringLiteralElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /StringLiteralElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /'hello'/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__CC'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'booleanElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'boolean element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /BooleanElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /boolean/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__DD'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'numberElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'number element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /NumberElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /number/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__EE'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'stringElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'string element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /StringElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /string/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__FF'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'dataModelReferenceElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'data model reference element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DataModelReferenceElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__AA/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(1, 2),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__GG'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'directRecursiveDataModelReferenceElement__modelProperty',
      caseNotes: [
        styledText({
          textSource:
            'direct recursive data model reference element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel>: ThisDataModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement["dataModelNameKey"] === ThisDataModel["modelName"]',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ThisDataModel/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /DataModelReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__AA/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 2),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__CC'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'indirectRecursiveDataModelReferenceElement__modelProperty',
      caseNotes: [
        styledText({
          textSource:
            'indirect recursive data model reference element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel>, <ThisIndirectTemplateModel extends __TemplateIntermediateModel>: ThisDataModel["modelTemplates"][number]["templateModelNameKey"] === ThisIndirectTemplateModel["modelName"] && ThisIndirectTemplateModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement["dataModelNameKey"] === ThisDataModel["modelName"]',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ThisDataModel/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /DataModelReferenceElement/,
            },
            {
              patternStyle: [3, 1, 45],
              patternRegex: /ThisIndirectTemplateModel/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(7, 79),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Model__BB/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
            {
              patternStyle: [3, 1, 45],
              patternRegex: /Model__CC/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(88, 140),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Model__BB/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
            {
              patternStyle: [3, 1, 45],
              patternRegex: /Model__CC/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .data['Model__BB'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'modelName',
              nodeStyle: [3, 1, 44],
            }),
            branchJsonNode({
              nodeKey: 'modelTemplates',
              nodeChildren: [leafJsonNode({
                nodeKey: 0,
                nodeStyle: [3, 1, 45],
              })],
            }),
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .concreteTemplate['Model__CC'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'modelName',
              nodeStyle: [3, 1, 45],
            }),
            branchJsonNode({
              nodeKey: 'modelProperties',
              nodeChildren: [branchJsonNode({
                nodeKey: 'ccProperty__AA',
                nodeChildren: [leafJsonNode({
                  nodeKey: 'propertyElement',
                  nodeStyle: [3, 1, 44],
                })],
              })],
            }),
          ],
        }),
      ],
    },
    {
      caseKey: 'aliasReferenceElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'alias reference element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => AliasReferenceElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /AliasReferenceElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(653, 680),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Alias__AA/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Alias__AA/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__HH'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'verdeTableElement-aliasReferenceElement__modelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => alias reference element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<AliasReferenceElement>',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTableElement<AliasReferenceElement>/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<Alias__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__II'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'verdeTableElement-dataModelReferenceElement__modelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => data model reference element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<DataModelReferenceElement>',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTableElement<DataModelReferenceElement>/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 957),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<Model__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.genericTemplate['Model__GG']!
            .modelProperties['ggProperty__BB'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'verdeTableElement-basicParameterElement__modelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => basic parameter element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<BasicParameterElement>',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTableElement<BasicParameterElement>/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 957),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<GgParameter__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.genericTemplate['Model__GG']!
            .modelProperties['ggProperty__AA'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'verdeTableElement-unionCompositionElement__modelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => union composition element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<UnionCompositionElement>',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTableElement<UnionCompositionElement>/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 957),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<Model__AA \| Model__BB>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.genericTemplate['Model__GG']!
            .modelProperties['ggProperty__CC'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'verdeArrayElement-stringElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'verde array element => string element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement<StringElement>',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArrayElement<StringElement>/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<string>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__JJ'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'unionCompositionElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'union composition element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => UnionCompositionElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /UnionCompositionElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /string | null/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__KK'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'nullElement__unionMember',
      caseNotes: [
        styledText({
          textSource: 'null element (union member)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'UnionCompositionElement["unionMembers"][number] => NullElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /NullElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /null/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__KK']!.propertyElement,
          jsonNodes: [branchJsonNode({
            nodeKey: 'unionMembers',
            nodeChildren: [leafJsonNode({
              nodeKey: 1,
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
      ],
    },
    {
      caseKey: 'tupleStructureElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'tuple structure element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => TupleStructureElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /TupleStructureElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /\[__llProperty__AA: number\]/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__LL'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'objectStructureElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'object structure element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '__IntermediateModel["modelProperties"][string]["propertyElement"] => ObjectStructureElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /ObjectStructureElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 651),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /\{\s*__mmProperty__AA\s*:\s*string\s*;\s*\}/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__AA']!
            .modelProperties['aaProperty__MM'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'genericParameter',
      caseNotes: [
        styledText({
          textSource: 'generic parameter',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["genericParameters"][number] => GenericParameter',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /GenericParameter/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(149, 374),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DdParameter__AA/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__DD'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'genericParameters',
            nodeChildren: [leafJsonNode({
              nodeKey: 0,
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(149, 374),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DdParameter__BB extends number/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__DD'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'genericParameters',
            nodeChildren: [leafJsonNode({
              nodeKey: 1,
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(149, 374),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DdParameter__CC/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__DD'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'genericParameters',
            nodeChildren: [leafJsonNode({
              nodeKey: 2,
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
      ],
    },
    {
      caseKey: 'basicParameterElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'basic parameter element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => BasicParameterElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /BasicParameterElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(149, 374),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DdParameter__AA/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__DD']!.modelProperties['ddProperty__AA'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'constrainedParameterElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'constrained parameter element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => ConstrainedParameterElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /ConstrainedParameterElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(149, 374),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DdParameter__BB/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__DD']!.modelProperties['ddProperty__BB'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'templateParameterElement__genericArguments',
      caseNotes: [
        styledText({
          textSource: 'template parameter element (generic argument)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericModelTemplate["genericArguments"][string]["argumentElement"] => TemplateParameterElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /TemplateParameterElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(149, 374),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DdParameter__CC/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__DD']!.modelTemplates[0],
          jsonNodes: [branchJsonNode({
            nodeKey: 'genericArguments',
            nodeChildren: [leafJsonNode({
              nodeKey: 'EeParameter__AA',
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
      ],
    },
    {
      caseKey: 'directRecursiveDataModelReference__genericArguments',
      caseNotes: [
        styledText({
          textSource:
            'direct recursive data model reference element (generic argument)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel, ThisGenericModelTemplate extends GenericModelTemplate>: ThisDataModel["modelTemplates"][number] => ThisGenericModelTemplate["genericArguments"][string]["argumentElement"] => DataModelReferenceElement["dataModelNameKey"] === ThisDataModel["modelName"]',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ThisDataModel/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /DataModelReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(7, 79),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Model__BB/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Model__BB/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(1, 2),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__BB'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'modelName',
              nodeStyle: [3, 1, 44],
            }),
            branchJsonNode({
              nodeKey: 'modelTemplates',
              nodeChildren: [branchJsonNode({
                nodeKey: 1,
                nodeChildren: [branchJsonNode({
                  nodeKey: 'genericArguments',
                  nodeChildren: [branchJsonNode({
                    nodeKey: 'DdParameter__AA',
                    nodeChildren: [leafJsonNode({
                      nodeKey: 'argumentElement',
                      nodeStyle: [3, 1, 44],
                    })],
                  })],
                })],
              })],
            }),
          ],
        }),
      ],
    },
    {
      caseKey: 'indirectRecursiveDataModelReference__genericArguments',
      caseNotes: [
        styledText({
          textSource:
            'indirect recursive data model reference element (generic argument)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel, ThisIndirectGenericTemplateModel extends GenericTemplateIntermediateModel, ThisTerminalGenericModelTemplate extends GenericModelTemplate>: ThisDataModel["modelTemplates"][number]["templateModelNameKey"] === ThisIndirectGenericTemplateModel["modelName"], ThisIndirectGenericTemplateModel["modelTemplates"][number]["genericArgument][string]["argumentElement"] => DataModelReferenceElement["dataModelNameKey"] === ThisDataModel["modelName"]',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ThisDataModel/,
            },
            {
              patternStyle: [3, 1, 45],
              patternRegex: /ThisIndirectGenericTemplateModel/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /DataModelReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(7, 79),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Model__BB/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
            {
              patternStyle: [3, 1, 45],
              patternRegex: /Model__DD/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(149, 374),
          textPatterns: [
            {
              patternStyle: [3, 1, 45],
              patternRegex: /Model__DD/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Model__BB/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels.data['Model__BB'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'modelName',
              nodeStyle: [3, 1, 44],
            }),
            branchJsonNode({
              nodeKey: 'modelTemplates',
              nodeChildren: [branchJsonNode({
                nodeKey: 1,
                nodeChildren: [leafJsonNode({
                  nodeKey: 'templateModelNameKey',
                  nodeStyle: [3, 1, 45],
                })],
              })],
            }),
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__DD'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'modelName',
              nodeStyle: [3, 1, 45],
            }),
            branchJsonNode({
              nodeKey: 'modelTemplates',
              nodeChildren: [branchJsonNode({
                nodeKey: 0,
                nodeChildren: [branchJsonNode({
                  nodeKey: 'genericArguments',
                  nodeChildren: [branchJsonNode({
                    nodeKey: 'EeParameter__BB',
                    nodeChildren: [leafJsonNode({
                      nodeKey: 'argumentElement',
                      nodeStyle: [3, 1, 44],
                    })],
                  })],
                })],
              })],
            }),
          ],
        }),
      ],
    },
    {
      caseKey: 'importSpecifier__schemaDataModelExport',
      caseNotes: [
        styledText({
          textSource: 'import specifier (schema data model export)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'Typescript.Declaration (DataIntermediateModel) <= Typescript.ImportSpecifer => Typescript.TupleTypeNode.elements => Typescript.NodeArray<Typescript.TypeNode> (IntermediateSchema["schemaModels"]["data"][string])',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ImportSpecifer/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /TypeNode/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(1, 2),
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(0, 202),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__BB/,
            getFilteredPattern: ({ patternMatches }) => {
              patternMatches.splice(1, 1);
              return patternMatches;
            },
          }],
        }),
      ],
    },
    {
      caseKey: 'importSpecifier__modelTemplate',
      caseNotes: [
        styledText({
          textSource: 'import specifier (model template)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'Typescript.Declaration (ConcreteTemplateIntermediateModel) <= Typescript.ImportSpecifer => Typescript.HeritageClause.types => Typescript.NodeArray<Typescript.ExpressionWithTypeArguments> (DataIntermediateModel["modelTemplates"][number])',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ImportSpecifer/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ExpressionWithTypeArguments/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(0, 774),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__CC/,
          }],
        }),
      ],
    },
    {
      caseKey: 'importSpecifier__schemaElement',
      caseNotes: [
        styledText({
          textSource: 'import specifier (schema element)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'Typescript.Declaration (DataIntermediateModel) <= Typescript.ImportSpecifer => Typescript.Node (DataIntermediateModel["modelProperties"][string]["propertyElement"])',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ImportSpecifer/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Node/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(0, 774),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__BB/,
            getFilteredPattern: ({ patternMatches }) => {
              patternMatches.splice(1, 2);
              return patternMatches;
            },
          }],
        }),
      ],
    },
    {
      caseKey: 'defaultGenericArgument',
      caseNotes: [
        styledText({
          textSource: 'default generic argument',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'Typescript.InterfaceDeclaration.typeParameters[number] (GenericTemplateIntermediateModel["genericParameters"][number]) => Typescript.TypeParameterDeclaration.default => GenericArgument',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /GenericArgument/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(149, 374),
          textPatterns: [
            {
              patternStyle: [3, 1, 45],
              patternRegex: /Model__DD/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /string/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(7, 79),
          textPatterns: [{
            patternStyle: [3, 1, 45],
            patternRegex: /Model__DD/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .data['Model__BB'],
          jsonNodes: [
            branchJsonNode({
              nodeKey: 'modelTemplates',
              nodeChildren: [branchJsonNode({
                nodeKey: 1,
                nodeChildren: [
                  leafJsonNode({
                    nodeKey: 'templateModelNameKey',
                    nodeStyle: [3, 1, 45],
                  }),
                  branchJsonNode({
                    nodeKey: 'genericArguments',
                    nodeChildren: [leafJsonNode({
                      nodeKey: 'DdParameter__CC',
                      nodeStyle: [3, 1, 44],
                    })],
                  }),
                ],
              })],
            }),
          ],
        }),
      ],
    },
    // indirect recursive data model reference element (collection element)
    // data model schema export
    // alias data model union export
  ];
}
