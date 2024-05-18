import { ExpectationCase } from '../../helpers/assertAndLogExpectations.ts';
import {
  branchJsonNode,
  leafJsonNode,
  styledJson,
} from '../../helpers/getStyledJson.ts';
import { styledText } from '../../helpers/getStyledText.ts';

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
        })
      ]
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
        })
      ]
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
        })
      ]
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
        })
      ]
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
        })
      ]
    }
  ];
}

// alias reference element with contextually invalid value
