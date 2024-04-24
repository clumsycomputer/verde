import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { deriveIntermediateSchema__assertions } from './assertions/deriveIntermediateSchema.ts';
import { setupValidSchema } from '../ValidSchema/setupValidSchema.ts';
import {
  basicDataModelSource,
  secondarySchemaModuleSource,
  validSchemaModuleSource,
} from './validSchemaModuleSource.ts';

Deno.test(
  'verde: valid schema',
  { sanitizeResources: false, sanitizeOps: false, sanitizeExit: false },
  async (testContext) => {
    const { validSchemaModulePath } = await setupValidSchema({
      validSchemaModuleSource,
      secondarySchemaModuleSource,
    });
    const validIntermediateSchema = deriveIntermediateSchema({
      schemaModulePath: validSchemaModulePath,
    });
    await Promise.all([
      deriveIntermediateSchema__assertions({
        basicDataModelSource,
        testContext,
        validIntermediateSchema,
      }),
    ]);
  },
);
