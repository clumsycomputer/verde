import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { loadSchemaModule } from '../../source/library/schema/loadSchemaModule/loadSchemaModule.ts';
import { assertAndLogExpectations } from '../helpers/assertAndLogExpectations.ts';
import { getPathFromThisDirectory } from '../helpers/getPathFromThisDirectory.ts';
import { readSchemaSources } from '../helpers/readSchemaSources.ts';
import { Path } from '../imports/Path.ts';
import { expectedDeriveIntermediateSchemaErrors } from './deriveIntermediateSchema.expected.ts';
import { getExpectationCases__deriveIntermediateSchema__Errors } from './getExpectationCases__DeriveIntermediateSchema__Errors.ts';

Deno.test(invalidSchemaTest);

async function invalidSchemaTest() {
  const schemaDirectoryPath = getPathFromThisDirectory({
    thisImportMetaUrl: import.meta.url,
    directoryPosfixPath: './schemas',
  });
  const { schemaSources } = await readSchemaSources({
    schemaDirectoryPath,
  });
  const actualIntermediateSchemaErrors: Record<string, string> = {};
  await Promise.all(
    Object.keys(schemaSources)
      .filter((someSourceFileName) => someSourceFileName.startsWith('Schema__'))
      .map((someSchemaFileName) => {
        try {
          const { schemaTypeChecker, schemaExportNode } = loadSchemaModule({
            schemaModulePath: Path.join(
              schemaDirectoryPath,
              someSchemaFileName,
            ),
          });
          deriveIntermediateSchema({
            schemaTypeChecker,
            schemaExportNode,
          });
        } catch (someIntermediateSchemaError: unknown) {
          if (someIntermediateSchemaError instanceof Error) {
            actualIntermediateSchemaErrors[someSchemaFileName] =
              someIntermediateSchemaError.message;
          }
        }
      }),
  );
  assertAndLogExpectations({
    expectedData: expectedDeriveIntermediateSchemaErrors,
    actualData: actualIntermediateSchemaErrors,
    expectationCases: getExpectationCases__deriveIntermediateSchema__Errors({
      schemaSources,
    }),
  });
}
