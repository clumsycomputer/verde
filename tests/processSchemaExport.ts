import { loadSchemaModule } from '../source/loadSchemaModule.ts';
import { processSchemaExport } from '../source/processSchemaExport.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from './imports/Assert.ts';

Deno.test({ name: 'non-tuple export type' }, () => {
  Assert.assertThrows(
    () => {
      processSchemaExport(loadSchemaModule({
        schemaModulePath: resolveCasePath({
          someCaseName: 'NonTupleExportType',
        }),
      }));
    },
    Error,
    `NonTupleExportType: unknown is not a tuple`,
  );
});

Deno.test({ name: "non-interface schema item"}, () => {
  Assert.assertThrows(() => {
    processSchemaExport(loadSchemaModule({
      schemaModulePath: resolveCasePath({
        someCaseName: 'NonInterfaceSchemaItem',
      }),
    }));
  }, Error, `invalid schema item: unknown`)
})

Deno.test({ name: 'basic schema' }, () => {
  processSchemaExport(loadSchemaModule({
    schemaModulePath: resolveCasePath({
      someCaseName: 'BasicSchema',
    }),
  }));
});
