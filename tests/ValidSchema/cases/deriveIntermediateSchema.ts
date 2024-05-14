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
          textSource: 'concrete model template (data model)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelTemplates"][number] => ConcreteModelTemplate',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /ConcreteModelTemplate/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(7, 87),
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
          textSource: 'generic model template (data model)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelTemplates"][number] => GenericModelTemplate',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /GenericModelTemplate/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(7, 87),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__DD<Model__BB, number, string>/,
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
      caseKey: 'booleanLiteralElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'boolean literal element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => BooleanLiteralElement',
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
      caseKey: 'numberLiteralElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'number literal element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => NumberLiteralElement',
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
      caseKey: 'stringLiteralElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'string literal element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => StringLiteralElement',
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
      caseKey: 'booleanPrimitiveElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'boolean element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => BooleanPrimitiveElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /BooleanPrimitiveElement/,
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
      caseKey: 'numberPrimitiveElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'number element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => NumberPrimitiveElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /NumberPrimitiveElement/,
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
      caseKey: 'stringPrimitiveElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'string element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => StringPrimitiveElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /StringPrimitiveElement/,
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
      caseKey: 'directRecursiveDataModelReferenceElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'direct recursive data model reference element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel>: ThisDataModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement["elementName"] === ThisDataModel["modelName"]',
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
      caseKey:
        'indirectRecursiveDataModelReferenceElement__concreteTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'indirect recursive data model reference element (concrete template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel>, <ThisIndirectTemplateModel extends __TemplateIntermediateModel>: ThisDataModel["modelTemplates"][number]["templateModelNameKey"] === ThisIndirectTemplateModel["modelName"] && ThisIndirectTemplateModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement["elementName"] === ThisDataModel["modelName"]',
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
          textSource: schemaSources['Model__BB.ts']!.substring(7, 87),
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
          textSource: schemaSources['Model__BB.ts']!.substring(96, 148),
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
      caseKey: 'aliasReferenceElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'alias reference element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => AliasReferenceElement',
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
      caseKey: 'verdeTableElement-aliasReferenceElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => alias reference element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<never>["elementArguments"][0] => AliasReferenceElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeTableElement<never>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /AliasReferenceElement/,
            },
          ],
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
      caseKey:
        'verdeTableElement-dataModelReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => data model reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<ParameterReferenceElement>["elementArguments"][0] => DataModelReferenceElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeTableElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /DataModelReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 1213),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<Model__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__GG']!
            .modelProperties['ggProperty__BB'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeTableElement-parameterReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => parameter reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<ParameterReferenceElement>["elementArguments"][0] => ParameterReferenceElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeTableElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ParameterReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 1213),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<GgParameter__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__GG']!
            .modelProperties['ggProperty__AA'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeTableElement-dataModelUnionElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => data model union element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<ParameterReferenceElement>["elementArguments"][0] => DataModelUnionElement<ParameterReferenceElement>["elementMembers"][number] => DataModelReferenceElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeTableElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /DataModelUnionElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /DataModelReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 1213),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<Model__AA \| Model__BB>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__GG']!
            .modelProperties['ggProperty__CC'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-booleanPrimitiveElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => boolean element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => BooleanPrimitiveElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArrayElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /BooleanPrimitiveElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 1213),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<boolean>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__GG']!
            .modelProperties['ggProperty__DD'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-numberPrimitiveElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => number element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => NumberPrimitiveElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArrayElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /NumberPrimitiveElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 1213),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<number>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__GG']!
            .modelProperties['ggProperty__EE'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'verdeArrayElement-stringPrimitiveElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => string element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement<never>["elementArguments"][0] => StringPrimitiveElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArrayElement<never>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /StringPrimitiveElement/,
            },
          ],
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
      caseKey:
        'verdeArrayElement-dataModelReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => data model reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => DataModelReferenceElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArrayElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /DataModelReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 1213),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<Model__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__GG']!
            .modelProperties['ggProperty__FF'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-aliasReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => alias reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => AliasReferenceElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArrayElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /AliasReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 1213),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<Alias__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__GG']!
            .modelProperties['ggProperty__GG'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-parameterReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => parameter reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => ParameterReferenceElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArrayElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ParameterReferenceElement/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(1, 2),
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 1213),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<GgParameter__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__GG']!
            .modelProperties['ggProperty__HH'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-verdeArrayUnionElement-stringPrimitiveElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => verde array union element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => VerdeArrayUnionElement<ParameterReferenceElement>["elementMembers"][number] => StringPrimitiveElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArrayElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArrayUnionElement<ParameterReferenceElement>/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /StringPrimitiveElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(776, 1213),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<string \| Model__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__GG']!
            .modelProperties['ggProperty__II'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: '__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'core union element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => CoreUnionElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /CoreUnionElement/,
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
            'CoreUnionElement["elementMembers"][number] => NullElement',
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
            nodeKey: 'elementMembers',
            nodeChildren: [leafJsonNode({
              nodeKey: 1,
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
      ],
    },
    {
      caseKey: 'tupleStructureElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'tuple structure element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => TupleElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /TupleElement/,
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
      caseKey: 'objectStructureElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'object structure element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => ObjectElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /ObjectElement/,
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
      caseKey: 'basicTemplateParameter',
      caseNotes: [
        styledText({
          textSource: 'basic template parameter',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelParameters"][number] => BasicTemplateParameter',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /BasicTemplateParameter/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(157, 373),
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
            nodeKey: 'modelParameters',
            nodeChildren: [leafJsonNode({
              nodeKey: 0,
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
      ],
    },
    {
      caseKey: 'constrainedTemplateParameter',
      caseNotes: [
        styledText({
          textSource: 'constrained template parameter',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelParameters"][number] => ConstrainedTemplateParameter',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /ConstrainedTemplateParameter/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(157, 373),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DdParameter__BB extends number/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__DD'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'modelParameters',
            nodeChildren: [leafJsonNode({
              nodeKey: 1,
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
      ],
    },
    {
      caseKey: 'parameterReferenceElement__modelProperty',
      caseNotes: [
        styledText({
          textSource: 'parameter reference element (model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => ParameterReferenceElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /ParameterReferenceElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(157, 373),
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
      caseKey: 'parameterReferenceElement__templateArgument',
      caseNotes: [
        styledText({
          textSource: 'parameter reference element (template argument)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericModelTemplate["templateArguments"][string]["argumentElement"] => ParameterReferenceElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /ParameterReferenceElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Model__BB.ts']!.substring(157, 373),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DdParameter__CC/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaModels
            .genericTemplate['Model__DD']!.modelTemplates[0],
          jsonNodes: [branchJsonNode({
            nodeKey: 'templateArguments',
            nodeChildren: [leafJsonNode({
              nodeKey: 'EeParameter__AA',
              nodeStyle: [3, 1, 44],
            })],
          })],
        }),
      ],
    },
    {
      caseKey: 'directRecursiveDataModelReference__templatArgument',
      caseNotes: [
        styledText({
          textSource:
            'direct recursive data model reference element (template argument)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel, ThisGenericModelTemplate extends GenericModelTemplate>: ThisDataModel["modelTemplates"][number] => ThisGenericModelTemplate["genericArguments"][string]["argumentElement"] => DataModelReferenceElement["elementName"] === ThisDataModel["modelName"]',
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
          textSource: schemaSources['Model__BB.ts']!.substring(7, 87),
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
                  nodeKey: 'templateArguments',
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
      caseKey: 'indirectRecursiveDataModelReference__templateArguments',
      caseNotes: [
        styledText({
          textSource:
            'indirect recursive data model reference element (template argument)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisDataModel extends DataIntermediateModel, ThisIndirectGenericTemplateModel extends GenericTemplateIntermediateModel, ThisTerminalGenericModelTemplate extends GenericModelTemplate>: ThisDataModel["modelTemplates"][number]["templateModelNameKey"] === ThisIndirectGenericTemplateModel["modelName"], ThisIndirectGenericTemplateModel["modelTemplates"][number]["templateArguments"][string]["argumentElement"] => DataModelReferenceElement["elementName"] === ThisDataModel["modelName"]',
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
          textSource: schemaSources['Model__BB.ts']!.substring(7, 87),
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
          textSource: schemaSources['Model__BB.ts']!.substring(157, 373),
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
                  nodeKey: 'templateArguments',
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
      caseKey: 'dataModel__schemaExportItem',
      caseNotes: [
        styledText({
          textSource: 'data model (schema export item)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'Typescript.TupleTypeNode.elements[number] (module export) => DataIntermediateModel',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /DataIntermediateModel/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(132, 202),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__AA/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema,
          jsonNodes: [branchJsonNode({
            nodeKey: 'schemaModels',
            nodeChildren: [branchJsonNode({
              nodeKey: 'data',
              nodeChildren: [leafJsonNode({
                nodeStyle: [3, 1, 44],
                nodeKey: 'Model__AA',
              })],
            })],
          })],
        }),
      ],
    },
    // {
    //   caseKey: 'dataModelUnionAlias__schemaExportItem',
    //   caseNotes: [
    //     styledText({
    //       textSource: 'data model union alias (schema export item)',
    //       textPatterns: [{
    //         patternStyle: [1, 4],
    //         patternRegex: /^.*$/
    //       }]
    //     }),
    //     styledText({
    //       textSource: 'DataModelIntermediateAlias => Typescript.TupleTypeNode.elements[number] (module export)',
    //       textPatterns: [{
    //         patternStyle: [3, 1, 44],
    //         patternRegex: /DataModelIntermediateAlias/
    //       }]
    //     }),
    //     styledText({
    //       textSource: schemaSources['Schema__AA.ts']!.substring(132, 202),
    //       textPatterns: [{
    //         patternStyle: [3, 1, 44],
    //         patternRegex: /Alias__AA/,
    //       }],
    //     }),
    //     // styledJson({
    //     //   jsonSource: expectedIntermediateSchema,
    //     //   jsonNodes: [branchJsonNode({
    //     //     nodeKey: 'schemaAliases',
    //     //     nodeChildren: [branchJsonNode({
    //     //       nodeKey: 'data',
    //     //       nodeChildren: [leafJsonNode({
    //     //         nodeStyle: [3, 1, 44],
    //     //         nodeKey: 'Model__AA',
    //     //       })]
    //     //     })]
    //     //   })]
    //     // })
    //   ]
    // }
  ];
}
