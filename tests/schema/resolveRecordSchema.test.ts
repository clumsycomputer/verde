import {
  resolveInitialRecordSchema,
  resolveNextRecordSchema,
} from '../../source/library/module.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test({ name: 'resolveInitialRecordSchema' }, () => {
  const basicInitialRecordSchema = resolveInitialRecordSchema({
    solidifiedSchema: {
      schemaSymbol: 'BasicSchema__EXAMPLE',
      schemaMap: {
        BasicDataModel: {
          modelSymbolKey: 'BasicDataModel',
          modelProperties: {
            aaaProperty_EXAMPLE: {
              propertyKey: 'aaaProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            bbbProperty_EXAMPLE: {
              propertyKey: 'bbbProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            cccProperty_EXAMPLE: {
              propertyKey: 'cccProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
          },
        },
      },
    },
  });
  Assert.assertEquals(basicInitialRecordSchema, {
    schemaSymbol: 'BasicSchema__EXAMPLE',
    schemaMap: {
      BasicDataModel: {
        modelSymbolKey: 'BasicDataModel',
        modelProperties: {
          aaaProperty_EXAMPLE: {
            propertyKey: 'aaaProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          bbbProperty_EXAMPLE: {
            propertyKey: 'bbbProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          cccProperty_EXAMPLE: {
            propertyKey: 'cccProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
        },
        modelEncoding: [
          {
            entryPropertyKey: 'aaaProperty_EXAMPLE',
          },
          {
            entryPropertyKey: 'bbbProperty_EXAMPLE',
          },
          {
            entryPropertyKey: 'cccProperty_EXAMPLE',
          },
        ],
      },
    },
  });
});

Deno.test({ name: 'resolveNextRecordSchema' }, () => {
  const basicNextRecordSchema = resolveNextRecordSchema({
    staleRecordSchema: {
      schemaSymbol: 'BasicSchema__EXAMPLE',
      schemaMap: {
        BasicDataModel: {
          modelSymbolKey: 'BasicDataModel',
          modelProperties: {
            aaaProperty_EXAMPLE: {
              propertyKey: 'aaaProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            bbbProperty_EXAMPLE: {
              propertyKey: 'bbbProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            cccProperty_EXAMPLE: {
              propertyKey: 'cccProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
          },
          modelEncoding: [
            {
              entryPropertyKey: 'aaaProperty_EXAMPLE',
            },
            {
              entryPropertyKey: 'bbbProperty_EXAMPLE',
            },
            {
              entryPropertyKey: 'cccProperty_EXAMPLE',
            },
          ],
        },
      },
    },
    solidifiedSchema: {
      schemaSymbol: 'BasicSchema__EXAMPLE',
      schemaMap: {
        BasicDataModel: {
          modelSymbolKey: 'BasicDataModel',
          modelProperties: {
            bbbProperty_EXAMPLE: {
              propertyKey: 'bbbProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            cccProperty_EXAMPLE: {
              propertyKey: 'cccProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
            aaaUpdatedProperty_EXAMPLE: {
              propertyKey: 'aaaUpdatedProperty_EXAMPLE',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
          },
        },
      },
    },
  });
  Assert.assertEquals(basicNextRecordSchema, {
    schemaSymbol: 'BasicSchema__EXAMPLE',
    schemaMap: {
      BasicDataModel: {
        modelSymbolKey: 'BasicDataModel',
        modelProperties: {
          bbbProperty_EXAMPLE: {
            propertyKey: 'bbbProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          cccProperty_EXAMPLE: {
            propertyKey: 'cccProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          aaaUpdatedProperty_EXAMPLE: {
            propertyKey: 'aaaUpdatedProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
        },
        modelEncoding: [
          {
            entryPropertyKey: 'bbbProperty_EXAMPLE',
          },
          {
            entryPropertyKey: 'cccProperty_EXAMPLE',
          },
          {
            entryPropertyKey: 'aaaUpdatedProperty_EXAMPLE',
          },
        ],
      },
    },
  });
});
