import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { deriveIntermediateSchema__assertions } from './assertions/deriveIntermediateSchema.ts';
import { setupValidSchema } from '../ValidSchema/setupValidSchema.ts';
import { initialSchemaOutline } from './initialSchemaOutline.ts';

Deno.test(
  'verde: valid schema',
  { sanitizeResources: false, sanitizeOps: false, sanitizeExit: false },
  async (testContext) => {
    const { validSchemaModulePath, sourceSchemaOutline } =
      await setupValidSchema({ initialSchemaOutline });
    const validIntermediateSchema = deriveIntermediateSchema({
      schemaModulePath: validSchemaModulePath,
    });
    await Promise.all([
      deriveIntermediateSchema__assertions({
        testContext,
        sourceSchemaOutline,
        validIntermediateSchema,
      }),
    ]);
  },
);
