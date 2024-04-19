import { deriveIntermediateSchema } from '../source/library/module.ts';
import { Path } from './imports/Path.ts';

Deno.test('ValidSchema', async () => {
  const thisFilePath = Path.fromFileUrl(import.meta.url);
  const testsDirectoryPath = Path.dirname(thisFilePath);  
  const validSchemaModulePath = Path.join(testsDirectoryPath, `./schemas/ValidSchema.ts`);
  const validIntermediateSchema = deriveIntermediateSchema({
    schemaModulePath: validSchemaModulePath,
  })
  console.log(validIntermediateSchema)
})