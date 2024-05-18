import { ExpectationCase } from '../../helpers/assertAndLogExpectations.ts';
import {
  branchJsonNode,
  leafJsonNode,
  styledJson,
} from '../../helpers/getStyledJson.ts';
import { styledText } from '../../helpers/getStyledText.ts';
import { expectedLoadSchemaModuleErrors } from '../expectations/loadSchemaModule.expected.ts';

export interface GetExpectationCases__LoadSchemaModuleApi {
  schemaSources: Record<string, string>;
}

export function getExpectationCases__LoadSchemaModule(
  api: GetExpectationCases__LoadSchemaModuleApi,
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
          textSource: expectedLoadSchemaModuleErrors['Schema__NoExports.ts']!,
          textPatterns: [{
            patternStyle: [3, 1, 44],
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
            patternStyle: [3, 1, 44],
            patternRegex: /export/,
          }],
        }),
        styledText({
          textSource: expectedLoadSchemaModuleErrors['Schema__MultipleExports.ts']!,
          textPatterns: [{
            patternStyle: [3, 1, 44],
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
            patternStyle: [3, 1, 44],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource: expectedLoadSchemaModuleErrors['Schema__CodeExport.ts']!,
          textPatterns: [{
            patternStyle: [3, 1, 44],
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
            patternStyle: [3, 1, 44],
            patternRegex: /^.*$/,
          }],
        }),
        styledText({
          textSource: expectedLoadSchemaModuleErrors['Schema__CodeExport.ts']!,
          textPatterns: [{
            patternStyle: [3, 1, 44],
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
            patternStyle: [3, 1, 44],
            patternRegex: /export interface/,
          }],
        }),
        styledText({
          textSource: expectedLoadSchemaModuleErrors['Schema__NonTypeAliasExport.ts']!,
          textPatterns: [{
            patternStyle: [3, 1, 44],
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
          textSource: schemaSources['Schema__GenericTypeAliasExport.ts']!.trim(),
          textPatterns: [
            {
              patternStyle: [3, 1, 44],
              patternRegex: /export/,
            },
            {
              patternStyle: [3, 1, 44],
              patternRegex: /<T>/,
            },
          ],
        }),
        styledText({
          textSource: expectedLoadSchemaModuleErrors['Schema__GenericTypeAliasExport.ts']!,
          textPatterns: [{
            patternStyle: [3, 1, 44],
            patternRegex: /generic type-alias export/,
          }],
        }),
      ],
    },
  ];
}

// alias reference element with contextually invalid value
