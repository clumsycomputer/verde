import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { ExpectationCase } from '../helpers/ExpectationCase.ts';
import { Assert } from '../imports/Assert.ts';
import { Path } from '../imports/Path.ts';
import { getExpectationCases__DeriveIntermediateSchema } from './cases/getExpectationCases__DeriveIntermediateSchema.ts';
import { expectedIntermediateSchema } from './expectations/deriveIntermediateSchema.expected.ts';
import { readSchemaSources } from './readSchemaSource.ts';

Deno.test(validSchemaTest);

async function validSchemaTest() {
  const thisFilePath = Path.fromFileUrl(import.meta.url);
  const testsDirectoryPath = Path.dirname(thisFilePath);
  const schemaDirectoryPath = Path.join(testsDirectoryPath, './schema');
  const schemaModulePath = Path.join(schemaDirectoryPath, './Schema__AA.ts');
  const { schemaSources } = await readSchemaSources({
    schemaDirectoryPath,
  });
  const actualIntermediateSchema = deriveIntermediateSchema({
    schemaModulePath,
  });
  assertAndLogExpectations({
    expectedData: expectedIntermediateSchema,
    actualData: actualIntermediateSchema,
    expectationCases: getExpectationCases__DeriveIntermediateSchema({
      schemaSources,
    }),
  });
}

interface AssertAndLogExpectationsApi<ThisData> {
  expectationCases: Array<ExpectationCase>;
  expectedData: ThisData;
  actualData: ThisData;
}

function assertAndLogExpectations<ThisData>(
  api: AssertAndLogExpectationsApi<ThisData>,
) {
  const { expectedData, actualData, expectationCases } = api;
  Assert.assertEquals(expectedData, actualData);
  expectationCases.forEach((someExpectationCase) => {
    console.log();
    someExpectationCase.caseNotes.forEach(
      (someCaseNote) => {
        console.log(someCaseNote);
        console.log();
      },
    );
  });
}
