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

Deno.test({ name: 'non-interface schema item' }, () => {
  Assert.assertThrows(
    () => {
      processSchemaExport(loadSchemaModule({
        schemaModulePath: resolveCasePath({
          someCaseName: 'NonInterfaceSchemaItem',
        }),
      }));
    },
    Error,
    `invalid top-level item: TypeReferenceItem<unknown>`,
  );
});

Deno.test({ name: 'basic schema' }, () => {
  const basicSchemaMap = processSchemaExport(loadSchemaModule({
    schemaModulePath: resolveCasePath({
      someCaseName: 'BasicSchema',
    }),
  }));
  Assert.assertEquals(basicSchemaMap, {
    schemaName: 'BasicSchema',
    schemaItems: {
      BasicSchemaItem: {
        itemName: 'BasicSchemaItem',
        itemBaseItems: [],
        itemProperties: {
          basicProperty: {
            propertyName: 'basicProperty',
            propertyType: {
              typeKind: 'primitive',
              typeName: 'string',
            },
          }
        },
      },
    },
  });
});
