import { loadSchemaModule } from '../../source/library/schema/loadSchemaModule/loadSchemaModule.ts';
import { assertAndLogExpectations } from '../helpers/assertAndLogExpectations.ts';
import { getPathFromThisDirectory } from '../helpers/getPathFromThisDirectory.ts';
import { readSchemaSources } from '../helpers/readSchemaSources.ts';
import { Path } from '../imports/Path.ts';
import { getExpectationCases__loadSchemaModule__Errors } from './getExpectationCases__loadSchemaModule.ts';
import { expectedLoadSchemaModuleErrors } from './loadSchemaModule.expected.ts';

Deno.test(invalidSchemaModuleTest);

async function invalidSchemaModuleTest() {
  const schemaDirectoryPath = getPathFromThisDirectory({
    thisImportMetaUrl: import.meta.url,
    directoryPosfixPath: './schemas',
  });
  const { schemaSources } = await readSchemaSources({
    schemaDirectoryPath,
  });
  const actualLoadSchemaModuleErrors: Record<string, string> = {};
  await Promise.all(
    Object.keys({
      ...schemaSources,
      'Schema__Undefined.ts': 'undefined',
    })
      .map((someSchemaFileName) => {
        try {
          loadSchemaModule({
            schemaModulePath: Path.join(
              schemaDirectoryPath,
              someSchemaFileName,
            ),
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
    expectationCases: getExpectationCases__loadSchemaModule__Errors({
      schemaSources,
    }),
  });
}
