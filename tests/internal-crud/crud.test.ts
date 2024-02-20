import {
createSchemaRecord,
  deriveIntermediateSchema,
  resolveTerminalSchema,
} from '../../source/library/module.ts';
import { Path } from '../imports/Path.ts';

Deno.test({ name: 'internal data operations' }, async (testContext) => {
  const exampleTerminalSchema = resolveTerminalSchema({
    intermediateSchema: deriveIntermediateSchema({
      schemaModulePath: Path.join(
        Path.fromFileUrl(import.meta.url),
        '../example-project/ExampleSchema.ts',
      ),
    }),
  });
  console.log(exampleTerminalSchema);
  await testContext.step('create record', () => {
    createSchemaRecord({
      terminalSchema: exampleTerminalSchema,
      modelSymbolKey: 'ExamplePerson',
      modelData: {
        personName: 'John Deere',
        personBirthYear: 1837,
        personVerified: true,
        // personLocation: {}
      }
    })
  })
  // await testContext.step('read record', () => {})
  // await testContext.step('update record', () => {})
  // await testContext.step('delete record', () => {})
});
