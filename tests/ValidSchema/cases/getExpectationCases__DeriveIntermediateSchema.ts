import { ExpectationCase } from '../../helpers/assertAndLogExpectations.ts';
import {
  branchJsonNode,
  leafJsonNode,
  styledJson,
} from '../../helpers/getStyledJson.ts';
import { styledText } from '../../helpers/getStyledText.ts';
import { expectedIntermediateSchema } from '../expectations/deriveIntermediateSchema.expected.ts';

export interface getExpectationCases__DeriveIntermediateSchemaApi {
  schemaSources: Record<string, string>;
}

export function getExpectationCases__DeriveIntermediateSchema(
  api: getExpectationCases__DeriveIntermediateSchemaApi,
): Array<ExpectationCase> {
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
            'DataIntermediateModel["typeModelTemplates"][number] => ConcreteModelTemplate',
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
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__BB']!,
          jsonNodes: [branchJsonNode({
            nodeKey: 'typeModelTemplates',
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
            'DataIntermediateModel["typeModelTemplates"][number] => GenericModelTemplate',
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
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__BB']!,
          jsonNodes: [branchJsonNode({
            nodeKey: 'typeModelTemplates',
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => BooleanLiteralElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /BooleanLiteralElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /true/,
          }],
        }),
        styledJson({
          jsonSource:
            expectedIntermediateSchema.schemaTypes['Model__AA']!
              .typeModelProperties['aaProperty__AA'],
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => NumberLiteralElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /NumberLiteralElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /123/,
          }],
        }),
        styledJson({
          jsonSource:
            expectedIntermediateSchema.schemaTypes['Model__AA']
              .typeModelProperties['aaProperty__BB'],
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => StringLiteralElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /StringLiteralElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /'hello'/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__CC'],
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
          textSource: 'boolean primitive element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => BooleanPrimitiveElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /BooleanPrimitiveElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /boolean/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__DD'],
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
          textSource: 'number primitive element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => NumberPrimitiveElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /NumberPrimitiveElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /number/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__EE'],
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
          textSource: 'string primitive element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => StringPrimitiveElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /StringPrimitiveElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /string/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__FF'],
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
            '<ThisDataModel extends DataIntermediateModel>: ThisDataModel["typeModelProperties"][string]["propertyElement"] => DataModelReferenceElement["elementName"] === ThisDataModel["typeName"]',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__AA/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 2),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__GG'],
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
            '<ThisDataModel extends DataIntermediateModel>, <ThisIndirectTemplateModel extends __TemplateIntermediateModel>: ThisDataModel["typeModelTemplates"][number]["templateModelName"] === ThisIndirectTemplateModel["typeName"] && ThisIndirectTemplateModel["typeModelProperties"][string]["propertyElement"] => DataModelReferenceElement["elementName"] === ThisDataModel["typeName"]',
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
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__BB'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'typeName',
              nodeStyle: [3, 1, 44],
            }),
            branchJsonNode({
              nodeKey: 'typeModelTemplates',
              nodeChildren: [leafJsonNode({
                nodeKey: 0,
                nodeStyle: [3, 1, 45],
              })],
            }),
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__CC'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'typeName',
              nodeStyle: [3, 1, 45],
            }),
            branchJsonNode({
              nodeKey: 'typeModelProperties',
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => AliasReferenceElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /AliasReferenceElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(654, 681),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Alias__AA/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Alias__AA/,
            getFilteredPattern: ({ patternMatches }) =>
              patternMatches.slice(0, 1),
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__HH'],
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeTableElement<never>["elementArguments"][0] => AliasReferenceElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<Alias__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__II'],
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeTableElement<ParameterReferenceElement>["elementArguments"][0] => DataModelReferenceElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<Model__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__BB'],
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeTableElement<ParameterReferenceElement>["elementArguments"][0] => ParameterReferenceElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeTable<GgParameter__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__AA'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeTableElement-dataModelUnionElement-dataModelReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => data model union element => data model reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeTableElement<ParameterReferenceElement>["elementArguments"][0] => DataModelUnionElement<ParameterReferenceElement>["elementMembers"][number] => DataModelReferenceElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeTable/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(2, 3),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Model__AA/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(1, 2),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__CC'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'propertyElement',
            nodeChildren: [
              leafJsonNode({
                nodeKey: 'elementKind',
                nodeStyle: [3, 1, 44],
              }),
              branchJsonNode({
                nodeKey: 'elementArguments',
                nodeChildren: [branchJsonNode({
                  nodeKey: 0,
                  nodeChildren: [
                    leafJsonNode({
                      nodeKey: 'elementKind',
                      nodeStyle: [3, 1, 44],
                    }),
                    branchJsonNode({
                      nodeKey: 'elementMembers',
                      nodeChildren: [leafJsonNode({
                        nodeKey: 0,
                        nodeStyle: [3, 1, 44],
                      })],
                    }),
                  ],
                })],
              }),
            ],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeTableElement-dataModelUnionElement-aliasReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => data model union element => alias reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeTableElement<ParameterReferenceElement>["elementArguments"][0] => DataModelUnionElement<ParameterReferenceElement>["elementMembers"][number] => AliasReferenceElement',
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
              patternRegex: /AliasReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeTable/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(2, 3),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Alias__AA/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__CC'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'propertyElement',
            nodeChildren: [
              leafJsonNode({
                nodeKey: 'elementKind',
                nodeStyle: [3, 1, 44],
              }),
              branchJsonNode({
                nodeKey: 'elementArguments',
                nodeChildren: [branchJsonNode({
                  nodeKey: 0,
                  nodeChildren: [
                    leafJsonNode({
                      nodeKey: 'elementKind',
                      nodeStyle: [3, 1, 44],
                    }),
                    branchJsonNode({
                      nodeKey: 'elementMembers',
                      nodeChildren: [leafJsonNode({
                        nodeKey: 1,
                        nodeStyle: [3, 1, 44],
                      })],
                    }),
                  ],
                })],
              }),
            ],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeTableElement-dataModelUnionElement-parameterReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde table element => data model union element => parameter reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeTableElement<ParameterReferenceElement>["elementArguments"][0] => DataModelUnionElement<ParameterReferenceElement>["elementMembers"][number] => ParameterReferenceElement',
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
              patternRegex: /ParameterReferenceElement/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(2, 3),
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeTable/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(2, 3),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /GgParameter__AA/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(2, 3),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__CC'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'propertyElement',
            nodeChildren: [
              leafJsonNode({
                nodeKey: 'elementKind',
                nodeStyle: [3, 1, 44],
              }),
              branchJsonNode({
                nodeKey: 'elementArguments',
                nodeChildren: [branchJsonNode({
                  nodeKey: 0,
                  nodeChildren: [
                    leafJsonNode({
                      nodeKey: 'elementKind',
                      nodeStyle: [3, 1, 44],
                    }),
                    branchJsonNode({
                      nodeKey: 'elementMembers',
                      nodeChildren: [leafJsonNode({
                        nodeKey: 2,
                        nodeStyle: [3, 1, 44],
                      })],
                    }),
                  ],
                })],
              }),
            ],
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
            'verde array element => boolean primitive element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => BooleanPrimitiveElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<boolean>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__DD'],
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
            'verde array element => number primitive element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => NumberPrimitiveElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<number>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__EE'],
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
            'verde array element => string primitive element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<never>["elementArguments"][0] => StringPrimitiveElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<string>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__JJ'],
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
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => DataModelReferenceElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<Model__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__FF'],
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
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => AliasReferenceElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<Alias__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__GG'],
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
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => ParameterReferenceElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /VerdeArray<GgParameter__AA>/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__HH'],
          jsonNodes: [leafJsonNode({
            nodeKey: 'propertyElement',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-verdeArrayUnionElement-booleanPrimitiveElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => verde array union element => boolean primitive element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => VerdeArrayUnionElement<ParameterReferenceElement>["elementMembers"][number] => BooleanPrimitiveElement',
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
              patternRegex: /BooleanPrimitiveElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArray/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(5, 6),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /boolean/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(1, 2),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__II'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'propertyElement',
            nodeChildren: [
              leafJsonNode({
                nodeKey: 'elementKind',
                nodeStyle: [3, 1, 44],
              }),
              branchJsonNode({
                nodeKey: 'elementArguments',
                nodeChildren: [branchJsonNode({
                  nodeKey: 0,
                  nodeChildren: [
                    leafJsonNode({
                      nodeKey: 'elementKind',
                      nodeStyle: [3, 1, 44],
                    }),
                    branchJsonNode({
                      nodeKey: 'elementMembers',
                      nodeChildren: [leafJsonNode({
                        nodeKey: 0,
                        nodeStyle: [3, 1, 44],
                      })],
                    }),
                  ],
                })],
              }),
            ],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-verdeArrayUnionElement-numberPrimitiveElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => verde array union element => number primitive element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => VerdeArrayUnionElement<ParameterReferenceElement>["elementMembers"][number] => NumberPrimitiveElement',
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
              patternRegex: /NumberPrimitiveElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArray/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(5, 6),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /number/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(1, 2),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__II'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'propertyElement',
            nodeChildren: [
              leafJsonNode({
                nodeKey: 'elementKind',
                nodeStyle: [3, 1, 44],
              }),
              branchJsonNode({
                nodeKey: 'elementArguments',
                nodeChildren: [branchJsonNode({
                  nodeKey: 0,
                  nodeChildren: [
                    leafJsonNode({
                      nodeKey: 'elementKind',
                      nodeStyle: [3, 1, 44],
                    }),
                    branchJsonNode({
                      nodeKey: 'elementMembers',
                      nodeChildren: [leafJsonNode({
                        nodeKey: 1,
                        nodeStyle: [3, 1, 44],
                      })],
                    }),
                  ],
                })],
              }),
            ],
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
            'verde array element => verde array union element => string primitive element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => VerdeArrayUnionElement<ParameterReferenceElement>["elementMembers"][number] => StringPrimitiveElement',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArray/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(5, 6),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /string/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__II'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'propertyElement',
            nodeChildren: [
              leafJsonNode({
                nodeKey: 'elementKind',
                nodeStyle: [3, 1, 44],
              }),
              branchJsonNode({
                nodeKey: 'elementArguments',
                nodeChildren: [branchJsonNode({
                  nodeKey: 0,
                  nodeChildren: [
                    leafJsonNode({
                      nodeKey: 'elementKind',
                      nodeStyle: [3, 1, 44],
                    }),
                    branchJsonNode({
                      nodeKey: 'elementMembers',
                      nodeChildren: [leafJsonNode({
                        nodeKey: 2,
                        nodeStyle: [3, 1, 44],
                      })],
                    }),
                  ],
                })],
              }),
            ],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-verdeArrayUnionElement-dataModelReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => verde array union element => data model reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => VerdeArrayUnionElement<ParameterReferenceElement>["elementMembers"][number] => DataModelReferenceElement',
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
              patternRegex: /DataModelReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArray/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(5, 6),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Model__AA/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(3, 4),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__II'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'propertyElement',
            nodeChildren: [
              leafJsonNode({
                nodeKey: 'elementKind',
                nodeStyle: [3, 1, 44],
              }),
              branchJsonNode({
                nodeKey: 'elementArguments',
                nodeChildren: [branchJsonNode({
                  nodeKey: 0,
                  nodeChildren: [
                    leafJsonNode({
                      nodeKey: 'elementKind',
                      nodeStyle: [3, 1, 44],
                    }),
                    branchJsonNode({
                      nodeKey: 'elementMembers',
                      nodeChildren: [leafJsonNode({
                        nodeKey: 3,
                        nodeStyle: [3, 1, 44],
                      })],
                    }),
                  ],
                })],
              }),
            ],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-verdeArrayUnionElement-aliasReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => verde array union element => alias reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => VerdeArrayUnionElement<ParameterReferenceElement>["elementMembers"][number] => AliasReferenceElement',
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
              patternRegex: /AliasReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArray/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(5, 6),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Alias__AA/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(2, 3),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__II'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'propertyElement',
            nodeChildren: [
              leafJsonNode({
                nodeKey: 'elementKind',
                nodeStyle: [3, 1, 44],
              }),
              branchJsonNode({
                nodeKey: 'elementArguments',
                nodeChildren: [branchJsonNode({
                  nodeKey: 0,
                  nodeChildren: [
                    leafJsonNode({
                      nodeKey: 'elementKind',
                      nodeStyle: [3, 1, 44],
                    }),
                    branchJsonNode({
                      nodeKey: 'elementMembers',
                      nodeChildren: [leafJsonNode({
                        nodeKey: 4,
                        nodeStyle: [3, 1, 44],
                      })],
                    }),
                  ],
                })],
              }),
            ],
          })],
        }),
      ],
    },
    {
      caseKey:
        'verdeArrayElement-verdeArrayUnionElement-parameterReferenceElement__genericTemplateModelProperty',
      caseNotes: [
        styledText({
          textSource:
            'verde array element => verde array union element => parameter reference element (generic template model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => VerdeArrayElement<ParameterReferenceElement>["elementArguments"][0] => VerdeArrayUnionElement<ParameterReferenceElement>["elementMembers"][number] => ParameterReferenceElement',
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
              patternRegex: /ParameterReferenceElement/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(2, 3),
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(807, 1432),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /VerdeArray/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(5, 6),
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /GgParameter__AA/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(4, 5),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__GG']
            .typeModelProperties['ggProperty__II'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'propertyElement',
            nodeChildren: [
              leafJsonNode({
                nodeKey: 'elementKind',
                nodeStyle: [3, 1, 44],
              }),
              branchJsonNode({
                nodeKey: 'elementArguments',
                nodeChildren: [branchJsonNode({
                  nodeKey: 0,
                  nodeChildren: [
                    leafJsonNode({
                      nodeKey: 'elementKind',
                      nodeStyle: [3, 1, 44],
                    }),
                    branchJsonNode({
                      nodeKey: 'elementMembers',
                      nodeChildren: [leafJsonNode({
                        nodeKey: 5,
                        nodeStyle: [3, 1, 44],
                      })],
                    }),
                  ],
                })],
              }),
            ],
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => CoreUnionElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /CoreUnionElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /string | null/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__KK'],
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
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /null/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__KK'].propertyElement,
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => TupleElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /TupleElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /\[__llProperty__AA: number\]/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__LL'],
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
            'DataIntermediateModel["typeModelProperties"][string]["propertyElement"] => ObjectElement',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /ObjectElement/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /\{\s*__mmProperty__AA\s*:\s*string\s*;\s*\}/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA']
            .typeModelProperties['aaProperty__MM'],
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
            'GenericTemplateIntermediateModel["typeModelParameters"][number] => BasicTemplateParameter',
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
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__DD'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'typeModelParameters',
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
            'GenericTemplateIntermediateModel["typeModelParameters"][number] => ConstrainedTemplateParameter',
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
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__DD'],
          jsonNodes: [branchJsonNode({
            nodeKey: 'typeModelParameters',
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
            'GenericTemplateIntermediateModel["typeModelProperties"][string]["propertyElement"] => ParameterReferenceElement',
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
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__DD']
            .typeModelProperties['ddProperty__AA'],
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
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__DD']
            .typeModelTemplates[0],
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
            '<ThisDataModel extends DataIntermediateModel, ThisGenericModelTemplate extends GenericModelTemplate>: ThisDataModel["typeModelTemplates"][number] => ThisGenericModelTemplate["genericArguments"][string]["argumentElement"] => DataModelReferenceElement["elementName"] === ThisDataModel["typeName"]',
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
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__BB'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'typeName',
              nodeStyle: [3, 1, 44],
            }),
            branchJsonNode({
              nodeKey: 'typeModelTemplates',
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
      caseKey: 'indirectRecursiveDataModelReference__templateArgument',
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
            '<ThisDataModel extends DataIntermediateModel, ThisIndirectGenericTemplateModel extends GenericTemplateIntermediateModel, ThisTerminalGenericModelTemplate extends GenericModelTemplate>: ThisDataModel["typeModelTemplates"][number]["templateModelName"] === ThisIndirectGenericTemplateModel["typeName"], ThisIndirectGenericTemplateModel["typeModelTemplates"][number]["templateArguments"][string]["argumentElement"] => DataModelReferenceElement["elementName"] === ThisDataModel["typeName"]',
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
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__BB'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'typeName',
              nodeStyle: [3, 1, 44],
            }),
            branchJsonNode({
              nodeKey: 'typeModelTemplates',
              nodeChildren: [branchJsonNode({
                nodeKey: 1,
                nodeChildren: [leafJsonNode({
                  nodeKey: 'templateModelName',
                  nodeStyle: [3, 1, 45],
                })],
              })],
            }),
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__DD'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'typeName',
              nodeStyle: [3, 1, 45],
            }),
            branchJsonNode({
              nodeKey: 'typeModelTemplates',
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
            'Typescript.Declaration (ConcreteTemplateIntermediateModel) <= Typescript.ImportSpecifer => Typescript.HeritageClause.types => Typescript.NodeArray<Typescript.ExpressionWithTypeArguments> (DataIntermediateModel["typeModelTemplates"][number])',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(0, 1432),
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
            'Typescript.Declaration (DataIntermediateModel) <= Typescript.ImportSpecifer => Typescript.Node (DataIntermediateModel["typeModelProperties"][string]["propertyElement"])',
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
          textSource: schemaSources['Schema__AA.ts']!.substring(0, 1432),
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
      caseKey: 'exportName__schemaExport',
      caseNotes: [
        styledText({
          textSource: 'export name (schema export)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'IntermediateSchema => IntermediateSchemaExport["exportName"]',
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /"exportName"/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(132, 203),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Schema__AA/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaExport,
          jsonNodes: [leafJsonNode({
            nodeKey: 'exportName',
            nodeStyle: [3, 1, 44],
          })],
        }),
      ],
    },
    {
      caseKey: 'exportUnion-dataModelReferenceElement__schemaExport',
      caseNotes: [
        styledText({
          textSource:
            'export union => data model reference element (schema export)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'ExportUnionElement["elementMembers"][number] => DataModelReferenceElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ExportUnionElement/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /DataModelReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(132, 203),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Model__AA/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaExport.exportElement,
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'elementKind',
              nodeStyle: [3, 1, 44],
            }),
            branchJsonNode({
              nodeKey: 'elementMembers',
              nodeChildren: [leafJsonNode({
                nodeKey: 0,
                nodeStyle: [3, 1, 44],
              })],
            }),
          ],
        }),
      ],
    },
    {
      caseKey: 'exportUnion-aliasReferenceElement__schemaExport',
      caseNotes: [
        styledText({
          textSource: 'export union => alias reference element (schema export)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'ExportUnionElement["elementMembers"][number] => AliasReferenceElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ExportUnionElement/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /AliasReferenceElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(132, 203),
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /Alias__AA/,
          }],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaExport.exportElement,
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'elementKind',
              nodeStyle: [3, 1, 44],
            }),
            branchJsonNode({
              nodeKey: 'elementMembers',
              nodeChildren: [leafJsonNode({
                nodeKey: 1,
                nodeStyle: [3, 1, 44],
              })],
            }),
          ],
        }),
      ],
    },
    {
      caseKey: 'indirectRecursiveAliasReferenceElement__modelProperty',
      caseNotes: [
        styledText({
          textSource:
            'indirect recursive alias reference element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisAlias extends IntermediateSchemaAlias>, <ThisIndirectDataModel extends DataIntermediateModel>: ThisAlias["aliasElement"] => DataModelReferenceElement["elementName"] == ThisIndirectDataModel["typeName"] && ThisIndirectDataModel["typeModelProperties"][string]["propertyElement"] => AliasReferenceElement["elementName"] == ThisAlias["aliasName"]',
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /ThisAlias/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /AliasReferenceElement/,
            },
            {
              patternStyle: [3, 1, 45],
              patternRegex: /ThisIndirectDataModel/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(654, 681),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Alias__AA/,
            },
            {
              patternStyle: [3, 1, 45],
              patternRegex: /Model__AA/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__AA.ts']!.substring(204, 652),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /Alias__AA/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
            {
              patternStyle: [3, 1, 45],
              patternRegex: /Model__AA/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
          ],
        }),
        styledJson({
          jsonSource: expectedIntermediateSchema.schemaTypes['Model__AA'],
          jsonNodes: [
            leafJsonNode({
              nodeKey: 'typeName',
              nodeStyle: [3, 1, 45],
            }),
            branchJsonNode({
              nodeKey: 'typeModelProperties',
              nodeChildren: [branchJsonNode({
                nodeKey: 'aaProperty__HH',
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
  ];
}

// alias reference element with contextually invalid value
