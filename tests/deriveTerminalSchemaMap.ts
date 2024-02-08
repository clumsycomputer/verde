import {
  deriveIntermediateSchemaMap,
  deriveTerminalSchemaMap,
} from '../source/library/module.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from './imports/Assert.ts';

Deno.test({ name: 'valid schema' }, () => {
  deriveTerminalSchemaMap({
    someIntermediateSchemaMap: deriveIntermediateSchemaMap({
      schemaModulePath: resolveCasePath({
        someCaseName: 'ValidSchema',
      }),
    }),
  });
});
