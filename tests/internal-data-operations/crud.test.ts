import {
  deriveIntermediateSchema,
  resolveTerminalSchema,
} from '../../source/library/module.ts';
import { Path } from '../imports/Path.ts';

Deno.test({ name: 'internal data operations' }, async (testContext) => {
  const exampleTerminalSchema = resolveTerminalSchema({
    intermediateSchema: deriveIntermediateSchema({
      schemaModulePath: Path.join(
        Path.fromFileUrl(import.meta.url),
        '../',
        './example-project/ExampleSchema.ts',
      ),
    }),
  });
  console.log(exampleTerminalSchema);
  // await testContext.step('create record', () => {})
  // await testContext.step('read record', () => {})
  // await testContext.step('update record', () => {})
  // await testContext.step('delete record', () => {})
});
