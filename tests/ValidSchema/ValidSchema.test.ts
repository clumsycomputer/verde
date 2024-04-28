import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { Path } from '../imports/Path.ts';
import { deriveIntermediateSchema__Assertions } from './assertions/deriveIntermediateSchema.ts';
import { expectedIntermediateSchema } from './expectedIntermediateSchema.ts';
import { readSchemaSources } from './readSchemaSourceFiles.ts';

Deno.test(
  'verde: valid schema',
  { sanitizeResources: false, sanitizeOps: false, sanitizeExit: false },
  async (testContext) => {
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
    await Promise.all([
      deriveIntermediateSchema__Assertions({
        testContext,
        expectedIntermediateSchema,
        actualIntermediateSchema,
        schemaSources,
      }),
    ]);
  },
);
