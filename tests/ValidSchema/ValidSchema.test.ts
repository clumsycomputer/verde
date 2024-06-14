import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { assertAndLogExpectations } from '../helpers/assertAndLogExpectations.ts';
import { Path } from '../imports/Path.ts';
import { getExpectationCases__DeriveIntermediateSchema } from './cases/getExpectationCases__DeriveIntermediateSchema.ts';
import { expectedIntermediateSchema } from './expectations/deriveIntermediateSchema.expected.ts';
import { readSchemaSources } from '../helpers/readSchemaSources.ts';
import { getPathFromThisDirectory } from '../helpers/getPathFromThisDirectory.ts';
import { loadSchemaModule } from '../../source/library/schema/loadSchemaModule/loadSchemaModule.ts';

Deno.test(validSchemaTest);

async function validSchemaTest() {
  const schemaDirectoryPath = getPathFromThisDirectory({
    thisImportMetaUrl: import.meta.url,
    directoryPosfixPath: './schema',
  });
  const { schemaSources } = await readSchemaSources({
    schemaDirectoryPath,
  });
  const { schemaTypeChecker, schemaExportNode } = loadSchemaModule({
    schemaModulePath: Path.join(schemaDirectoryPath, './Schema__AA.ts'),
  });
  const actualIntermediateSchema = deriveIntermediateSchema({
    schemaTypeChecker,
    schemaExportNode,
  });
  assertAndLogExpectations({
    expectedData: expectedIntermediateSchema,
    actualData: actualIntermediateSchema,
    expectationCases: getExpectationCases__DeriveIntermediateSchema({
      schemaSources,
    }),
  });
}
