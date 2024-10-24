import { ExpectationCase } from '../helpers/assertAndLogExpectations.ts';
import { styledText } from '../helpers/getStyledText.ts';
import { expectedLoadSchemaModuleErrors } from './loadSchemaModule.expected.ts';

export interface getExpectationCasesApi__loadSchemaModule__Errors {
  schemaSources: Record<string, string>;
}

export function getExpectationCases__loadSchemaModule__Errors(
  api: getExpectationCasesApi__loadSchemaModule__Errors,
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
          expectedLoadSchemaModuleErrors['Schema__NoExports.ts']!,
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
          textSource: expectedLoadSchemaModuleErrors[
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
          expectedLoadSchemaModuleErrors['Schema__CodeExport.ts']!,
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
          expectedLoadSchemaModuleErrors['Schema__CodeExport.ts']!,
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
          textSource: expectedLoadSchemaModuleErrors[
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
          textSource: expectedLoadSchemaModuleErrors[
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
      caseKey: 'schemaModulePathDoesNotExist',
      caseNotes: [
        styledText({
          textSource: 'schema module path does not exist',
          textPatterns: [{
            patternStyle: [1, 4],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource: expectedLoadSchemaModuleErrors[
            'Schema__Undefined.ts'
          ]!,
          textPatterns: [
            {
              patternStyle: [3, 1, 41],
              patternRegex: /invalid schema module/,
            },
            {
              patternStyle: [3, 1, 41],
              patternRegex: /does not exist/,
            },
          ],
        }),
      ],
    },
  ];
}