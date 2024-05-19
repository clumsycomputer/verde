import { ExpectationCase } from '../../helpers/assertAndLogExpectations.ts';
import {
  branchJsonNode,
  leafJsonNode,
  styledJson,
} from '../../helpers/getStyledJson.ts';
import { styledText } from '../../helpers/getStyledText.ts';
import { expectedDeriveIntermediateSchemaErrors } from '../expectations/deriveIntermediateSchema.expected.ts';

export interface getExpectationCasesApi__DeriveIntermediateSchema__Errors {
  schemaSources: Record<string, string>;
}

export function getExpectationCases__DeriveIntermediateSchema__Errors(
  api: getExpectationCasesApi__DeriveIntermediateSchema__Errors,
): Array<ExpectationCase> {
  const { schemaSources } = api;
  return [
    {
      caseKey: 'noExports__schemaModule',
      caseNotes: [
        styledText({
          textSource: 'no exports (schema module)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__NoExports.ts']!.trim(),
          textPatterns: [{
            patternStyle: [],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            expectedDeriveIntermediateSchemaErrors['Schema__NoExports.ts']!,
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /no exports/,
          }],
        }),
      ],
    },
    {
      caseKey: 'multipleExports__schemaModule',
      caseNotes: [
        styledText({
          textSource: 'multiple exports (schema module)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__MultipleExports.ts']!.trim(),
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /export/,
          }],
        }),
        styledText({
          textSource: expectedDeriveIntermediateSchemaErrors[
            'Schema__MultipleExports.ts'
          ]!,
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /multiple exports/,
          }],
        }),
      ],
    },
    {
      caseKey: 'codeExport__schemaModule',
      caseNotes: [
        styledText({
          textSource: 'code export (schema module)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__CodeExport.ts']!.trim(),
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            expectedDeriveIntermediateSchemaErrors['Schema__CodeExport.ts']!,
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /code export/,
          }],
        }),
      ],
    },
    {
      caseKey: 'defaultCodeExport__schemaModule',
      caseNotes: [
        styledText({
          textSource: 'default code export (schema module)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__DefaultCodeExport.ts']!.trim(),
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            expectedDeriveIntermediateSchemaErrors['Schema__CodeExport.ts']!,
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /code export/,
          }],
        }),
      ],
    },
    {
      caseKey: 'nonTypeAliasExport__schemaModule',
      caseNotes: [
        styledText({
          textSource: 'non type-alias export (schema module)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__NonTypeAliasExport.ts']!.trim(),
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /export interface/,
          }],
        }),
        styledText({
          textSource: expectedDeriveIntermediateSchemaErrors[
            'Schema__NonTypeAliasExport.ts'
          ]!,
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /non type-alias export/,
          }],
        }),
      ],
    },
    {
      caseKey: 'genericTypeAliasExport__schemaModule',
      caseNotes: [
        styledText({
          textSource: 'generic type-alias export (schema module)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__GenericTypeAliasExport.ts']!
            .trim(),
          textPatterns: [
            {
              patternStyle: [3, 1, 41],
              patternRegex: /export/,
            },
            {
              patternStyle: [3, 1, 41],
              patternRegex: /<T>/,
            },
          ],
        }),
        styledText({
          textSource: expectedDeriveIntermediateSchemaErrors[
            'Schema__GenericTypeAliasExport.ts'
          ]!,
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /generic type-alias export/,
          }],
        }),
      ],
    },
    {
      caseKey: 'undefinedTemplateArgument',
      caseNotes: [
        styledText({
          textSource:
            'undefined template argument (template parameter with default argument)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            '<ThisGenericTemplate extends GenericModelTemplate, ThisGenericModel extends GenericTemplateIntermediateModel, ThisGenericParameter extends GenericTemplateParameter, ThisDataModel extends DataIntermediateModel>: ThisGenericModel["modelParameters"][number] => ThisGenericParameter && ThisDataModel["modelTemplates"][number] => ThisGenericTemplate && ThisGenericTemplate["templateModelNameKey"] == ThisGenericModel["modelName"] && ThisGenericTemplate["templateArguments"][ThisGenericParameter["parameterName"]] => undefined',
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /undefined/,
          }],
        }),
        styledText({
          textSource: schemaSources['Schema__UndefinedTemplateArgument.ts']!
            .trim(),
          textPatterns: [
            {
              patternStyle: [3, 1, 41],
              patternRegex: /Model__BB/,
              getFilteredPattern: ({ patternMatches }) =>
                patternMatches.slice(0, 1),
            },
            {
              patternStyle: [3, 1, 41],
              patternRegex: /BbParameter__AA = string/,
            },
          ],
        }),
        styledText({
          textSource: expectedDeriveIntermediateSchemaErrors[
            'Schema__UndefinedTemplateArgument.ts'
          ]!,
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /default parameter arguments not supported/,
          }],
        }),
      ],
    },
    {
      caseKey: 'customGenericTypeAliasElement__dataModelProperty',
      caseNotes: [
        styledText({
          textSource: 'custom generic type-alias element (data model property)',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource:
            'DataIntermediateModel["modelProperties"][string]["propertyElement"] => CustomGenericTypeAliasElement',
          textPatterns: [
            {
              patternStyle: [3, 1, 41],
              patternRegex: /CustomGenericTypeAliasElement/,
            },
          ],
        }),
        styledText({
          textSource: schemaSources['Schema__CustomGenericTypeAliasElement.ts']!
            .trim(),
          textPatterns: [{
            patternStyle: [3, 1, 41],
            patternRegex: /Alias__AA<never>/,
          }],
        }),
        styledText({
          textSource: expectedDeriveIntermediateSchemaErrors[
            'Schema__CustomGenericTypeAliasElement.ts'
          ]!,
          textPatterns: [
            {
            patternStyle: [3, 1, 41],
            patternRegex: /invalid schema element/,
          },
          {
            patternStyle: [3, 1, 41],
            patternRegex: /Alias__AA<never>/,
          }
        ],
        }),
      ],
    },
  ];
}

// alias reference element with contextually invalid value
