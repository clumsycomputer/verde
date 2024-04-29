import { throwInvalidPathError } from '../../source/helpers/throwError.ts';
import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { CaseAssertion, TestCase } from '../helpers/TestCase.ts';
import { Assert } from '../imports/Assert.ts';
import { Path } from '../imports/Path.ts';
import { getDeriveIntermediateSchemaTestCases } from './cases/deriveIntermediateSchema.ts';
import { expectedIntermediateSchema } from './expectations/deriveIntermediateSchema.expected.ts';
import { readSchemaSources } from './readSchemaSourceFiles.ts';

runValidSchemaTest();

async function runValidSchemaTest() {
  const thisFilePath = Path.fromFileUrl(import.meta.url);
  const testsDirectoryPath = Path.dirname(thisFilePath);
  const schemaDirectoryPath = Path.join(testsDirectoryPath, './schema');
  const schemaModulePath = Path.join(schemaDirectoryPath, './ValidSchema.ts');
  const { schemaSources } = await readSchemaSources({
    schemaDirectoryPath,
  });
  const actualIntermediateSchema = deriveIntermediateSchema({
    schemaModulePath,
  });
  assertExpectationsAndLogTestCases({
    testCases: getDeriveIntermediateSchemaTestCases({ schemaSources }),
    expectedData: expectedIntermediateSchema,
    actualData: actualIntermediateSchema,
  });
}

interface AssertExpectationsAndLogTestCasesApi<ThisData> {
  testCases: Array<TestCase>;
  expectedData: ThisData;
  actualData: ThisData;
}

function assertExpectationsAndLogTestCases<ThisData>(
  api: AssertExpectationsAndLogTestCasesApi<ThisData>,
) {
  const { expectedData, actualData, testCases } = api;
  Assert.assertEquals(expectedData, actualData);
  testCases.forEach((someTestCase) => {
    console.log();
    console.log(`\x1b[1m\x1b[4m${someTestCase.caseLabel}\x1b[0m`, '\n');
    console.log(`${someTestCase.caseTechnicalLabel}`, '\n');
    someTestCase.caseAssertions.forEach((someCaseAssertion) => {
      if (someCaseAssertion.assertionKind === 'direct') {
        someCaseAssertion.assertionHighlights.forEach(
          ({ highlightScopes, highlightSource }) => {
            highlightScopes.forEach(
              ({ scopeRange, scopeHighlights }) => {
                const scopeSource = highlightSource.substring(
                  scopeRange[0],
                  scopeRange[1],
                );
                const sortedScopeHighlights = scopeHighlights.sort((
                  scopeHighlightA,
                  scopeHighlightB,
                ) =>
                  scopeHighlightA.highlightRange[0] -
                  scopeHighlightB.highlightRange[0]
                );
                const highlightSources = sortedScopeHighlights.reduce(
                  (
                    highlightSourcesResult,
                    someScopeHighlight,
                    scopeHighlightIndex,
                  ) => {
                    highlightSourcesResult.push(
                      `\x1b[1m\x1b[44m${
                        scopeSource.substring(
                          someScopeHighlight.highlightRange[0],
                          someScopeHighlight.highlightRange[1],
                        )
                      }\x1b[0m`,
                    );
                    const nextScopeHighlightRange: [number, number] =
                      sortedScopeHighlights[scopeHighlightIndex + 1]
                        ?.highlightRange ??
                        [scopeSource.length, NaN];
                    highlightSourcesResult.push(
                      scopeSource.substring(
                        someScopeHighlight.highlightRange[1],
                        nextScopeHighlightRange[0],
                      ),
                    );
                    return highlightSourcesResult;
                  },
                  [scopeSource.substring(
                    0,
                    sortedScopeHighlights[0]?.highlightRange[0] ??
                      throwInvalidPathError('highlightSources[0]'),
                  )],
                );
                console.log(highlightSources.join(''), '\n');
              },
            );
          },
        );
      }
      const expectedAssertionData = getExpectedAssertionData({
        expectedInput: expectedData,
        assertionPath: someCaseAssertion.assertionPath,
      });
      const expectedAssertionJson = JSON.stringify(
        expectedAssertionData,
        null,
        1,
      );
      console.log(
        `\x1b[1m\x1b[44m${
          expectedAssertionJson.replace(
            expectedAssertionJson.charAt(0),
            expectedAssertionJson.charAt(0).padEnd(Deno.consoleSize().columns),
          )
        }\x1b[0m`,
      );
    });
    console.log();
  });
}

interface GetExpectedAssertionDataApi
  extends Pick<CaseAssertion, 'assertionPath'> {
  expectedInput: any;
}

function getExpectedAssertionData(api: GetExpectedAssertionDataApi): any {
  const { assertionPath, expectedInput } = api;
  const [currentPathKey, ...remainingAssertionPath] = assertionPath;
  return currentPathKey !== undefined
    ? getExpectedAssertionData({
      assertionPath: remainingAssertionPath,
      expectedInput: expectedInput[currentPathKey] ??
        throwInvalidPathError('expectedInput[currentPathKey]'),
    })
    : expectedInput;
}
