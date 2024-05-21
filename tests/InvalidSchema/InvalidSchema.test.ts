import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { assertAndLogExpectations } from '../helpers/assertAndLogExpectations.ts';
import { getPathFromThisDirectory } from '../helpers/getPathFromThisDirectory.ts';
import { readSchemaSources } from '../helpers/readSchemaSources.ts';
import { Path } from '../imports/Path.ts';
import { getExpectationCases__DeriveIntermediateSchema__Errors } from './cases/getExpectationCases__DeriveIntermediateSchema__Errors.ts';
import { expectedDeriveIntermediateSchemaErrors } from './expectations/deriveIntermediateSchema.expected.ts';

Deno.test(invalidSchemaTest);

async function invalidSchemaTest() {
  const schemaDirectoryPath = getPathFromThisDirectory({
    thisImportMetaUrl: import.meta.url,
    directoryPosfixPath: './schemas',
  });
  const { schemaSources } = await readSchemaSources({
    schemaDirectoryPath,
  });
  const actualLoadSchemaModuleErrors: Record<string, string> = {};
  await Promise.all(
    Object.keys(schemaSources).filter((someSourceFileName) =>
      someSourceFileName.startsWith('Schema__')
    ).map((someSchemaFileName) => {
      const schemaModulePath = Path.join(
        schemaDirectoryPath,
        someSchemaFileName,
      );
      try {
        deriveIntermediateSchema({
          schemaModulePath,
        });
      } catch (someSchemaModuleError: unknown) {
        if (someSchemaModuleError instanceof Error) {
          actualLoadSchemaModuleErrors[someSchemaFileName] =
            someSchemaModuleError.message;
        }
      }
    }),
  );
  assertAndLogExpectations({
    expectedData: expectedDeriveIntermediateSchemaErrors,
    actualData: actualLoadSchemaModuleErrors,
    expectationCases: getExpectationCases__DeriveIntermediateSchema__Errors({
      schemaSources,
    }),
  });
}
