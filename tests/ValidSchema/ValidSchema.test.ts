import { deriveIntermediateSchema } from '../../source/library/module.ts';
import { deriveIntermediateSchema__Assertions } from './assertions/deriveIntermediateSchema.ts';
import { setupSchemaSource } from './setupSchemaSource.ts';
import { expectedIntermediateSchema } from './expectedIntermediateSchema.ts';
import { schemaSourceInputs } from './schemaSourceInputs.ts';

Deno.test(
  'verde: valid schema',
  { sanitizeResources: false, sanitizeOps: false, sanitizeExit: false },
  async (testContext) => {
    const actualSchemaModulePath = await setupSchemaSource({
      schemaSourceModules: [
        ['ValidSchema', schemaSourceInputs['ValidSchemaModule']!],
        ['SecondarySchemaModule', schemaSourceInputs['SecondarySchemaModule']!]
      ]
    });
    const actualIntermediateSchema = deriveIntermediateSchema({
      schemaModulePath: actualSchemaModulePath,
    });
    await Promise.all([
      deriveIntermediateSchema__Assertions({       
        testContext,
        schemaSourceInputs,
        expectedIntermediateSchema, 
        actualIntermediateSchema,
      }),
    ]);
  },
);

