import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { assertAndLogExpectations } from '../helpers/assertAndLogExpectations.ts';
import { getPathFromThisDirectory } from '../helpers/getPathFromThisDirectory.ts';
import { readSchemaSources } from '../helpers/readSchemaSources.ts';
import { Path } from '../imports/Path.ts';
import { getExpectationCases__LoadSchemaModule } from './cases/getExpectationCases__LoadSchemaModule.ts';
import { expectedLoadSchemaModuleErrors } from './expectations/loadSchemaModule.expected.ts';

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
    Object.keys(schemaSources).map((someSchemaFileName) => {
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
    expectedData: expectedLoadSchemaModuleErrors,
    actualData: actualLoadSchemaModuleErrors,
    expectationCases: getExpectationCases__LoadSchemaModule({
      schemaSources,
    }),
  });
}
