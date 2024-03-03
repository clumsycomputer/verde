import {
createSchemaRecord,
  deriveIntermediateSchema,
  resolveSolidifiedSchema,
} from '../../source/library/module.ts';
import { Path } from '../imports/Path.ts';

Deno.test({ name: 'internal crud' }, async (testContext) => {
  const projectDirectoryPath = Path.join(
    Path.fromFileUrl(import.meta.url),
    '../example-project',
  )
  const databaseDirectoryPath = Path.join(projectDirectoryPath, './database')
  const exampleTerminalSchema = resolveSolidifiedSchema({
    intermediateSchema: deriveIntermediateSchema({
      schemaModulePath: Path.join(
        projectDirectoryPath,
        './ExampleSchema.ts',
      ),
    }),
  });
  await testContext.step('create record', () => {
    createSchemaRecord({
      databaseDirectoryPath: databaseDirectoryPath,
      terminalSchema: exampleTerminalSchema,      
      recordModelSymbolKey: 'ExamplePerson',
      recordData: {
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
