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

Deno.test({ name: 'invalid property type' }, () => {
  Assert.assertThrows(
    () => {
      processSchemaExport(loadSchemaModule({
        schemaModulePath: resolveCasePath({
          someCaseName: 'InvalidPropertyType',
        }),
      }));
    },
    Error,
    `invalid property type: FooSchemaItem["invalidProperty"]`,
  );
});

Deno.test({ name: 'invalid base item'}, () => {
  Assert.assertThrows(() => {
    processSchemaExport(loadSchemaModule({
      schemaModulePath: resolveCasePath({
        someCaseName: 'InvalidBaseItem',
      }),
    }));
  }, Error, 'invalid base item: InvalidBaseItem<unknown> on InvalidExtensionItem')
})

Deno.test({ name: 'valid schema' }, () => {
  const validSchemaMap = processSchemaExport(loadSchemaModule({
    schemaModulePath: resolveCasePath({
      someCaseName: 'ValidSchema',
    }),
  }));
  Assert.assertEquals(validSchemaMap, {
    schemaId: 'ValidSchema',
    schemaItems: {
      BasicSchemaItem: {
        itemId: 'BasicSchemaItem',
        itemBaseIds: [],
        itemProperties: {
          stringProperty: {
            propertyId: 'stringProperty',
            propertyType: {
              typeKind: 'primitive',
              typeId: 'string',
            },
          },
          numberProperty: {
            propertyId: 'numberProperty',
            propertyType: {
              typeKind: 'primitive',
              typeId: 'number',
            },
          },
          booleanProperty: {
            propertyId: 'booleanProperty',
            propertyType: {
              typeKind: 'primitive',
              typeId: 'boolean',
            },
          },
          interfaceProperty: {
            propertyId: 'interfaceProperty',
            propertyType: {
              typeKind: 'interface',
              typeId: 'FooItem'
            }
          }
        },
      },
      FooItem: {
        itemId: 'FooItem',
        itemBaseIds: [],
        itemProperties: {
          fooProperty: {
            propertyId: 'fooProperty',
            propertyType: {
              typeKind: 'primitive',
              typeId: 'string'
            }
          }
        }
      },
      ExtensionSchemaItem: {
        itemId: "ExtensionSchemaItem",
        itemBaseIds: ["BasicSchemaItem"],
        itemProperties: {
          extensionStringProperty: {
            propertyId: "extensionStringProperty",
            propertyType: {
              typeKind: "primitive",
              typeId: "string"
            }
          }
        }
      }
    },
  });
});
