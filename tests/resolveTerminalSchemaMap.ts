import {
  deriveIntermediateSchemaMap,
  resolveTerminalSchemaMap,
} from '../source/library/module.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from './imports/Assert.ts';

Deno.test({ name: 'valid schema' }, () => {
  const validTerminalSchemaMap = resolveTerminalSchemaMap({
    intermediateSchemaMap: deriveIntermediateSchemaMap({
      schemaModulePath: resolveCasePath({
        someCaseName: 'ValidSchema',
      }),
    }),
  });
  console.log(JSON.stringify(validTerminalSchemaMap, null, 2))
});
