import {
  deriveIntermediateSchema,
  getInitialDataSchema,
  getSolidifiedSchema,
} from '../../source/library/module.ts';
import { Path } from './imports/Path.ts';

Deno.test('music', async () => {
  const musicTestPath = Path.fromFileUrl(import.meta.url);
  const musicDirectoryPath = Path.dirname(musicTestPath);  
  const musicSchemaModulePath = Path.join(musicDirectoryPath, `./MusicSchema.ts`);
  const musicIntermediateSchema = deriveIntermediateSchema({
    schemaModulePath: musicSchemaModulePath,
  })
  const musicSolidifiedSchema = getSolidifiedSchema({
    intermediateSchema: musicIntermediateSchema
  })
  const musicDataSchema = getInitialDataSchema({
    solidifiedSchema: musicSolidifiedSchema
  });
});

// schema features
// // top-level
// // // unions
// // // // type-alias
// // model elements
// // // unions
// // // // type-alias
// // // // inline
// // // tuples
// // // // type-alias
// // // // inline
// // // generic type-alias (type functions)
// // // // native
// // // // // Array
// // // // provided
// // // // // VerdeSet
// // // // // VerdeInt
// // // // // VerdeInt16
// // // // // VerdeInt8
