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
    someTestCase.caseNotes.forEach(
      (someCaseNote) => {
        console.log(someCaseNote)
        console.log()},
    );
  });
}