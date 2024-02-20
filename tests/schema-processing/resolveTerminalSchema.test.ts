import {
  deriveIntermediateSchema,
  resolveTerminalSchema,
} from '../../source/library/module.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test({ name: 'valid schema' }, () => {
  const validTerminalSchema = resolveTerminalSchema({
    intermediateSchema: deriveIntermediateSchema({
      schemaModulePath: resolveCasePath({
        someCaseName: 'ValidSchema',
      }),
    }),
  });
  Assert.assertEquals(validTerminalSchema, {
    schemaSymbol: 'ValidSchema',
    schemaMap: {
      PropertyDataModel_EXAMPLE: {
        modelSymbolKey: 'PropertyDataModel_EXAMPLE',
        modelProperties: {
          fooProperty: {
            propertyKey: 'fooProperty',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
        },
      },
      BasicDataModel_EXAMPLE: {
        modelSymbolKey: 'BasicDataModel_EXAMPLE',
        modelProperties: {
          stringProperty_EXAMPLE: {
            propertyKey: 'stringProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
          numberProperty_EXAMPLE: {
            propertyKey: 'numberProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'numberPrimitive',
            },
          },
          booleanProperty_EXAMPLE: {
            propertyKey: 'booleanProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          interfaceProperty_EXAMPLE: {
            propertyKey: 'interfaceProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'dataModel',
              dataModelSymbolKey: 'PropertyDataModel_EXAMPLE',
            },
          },
        },
      },
      CompositeDataModel_EXAMPLE: {
        modelSymbolKey: 'CompositeDataModel_EXAMPLE',
        modelProperties: {
          bazProperty: {
            propertyKey: 'bazProperty',
            propertyElement: {
              elementKind: 'numberPrimitive',
            },
          },
          tazProperty: {
            propertyKey: 'tazProperty',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
          basicParameterProperty_EXAMPLE: {
            propertyKey: 'basicParameterProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'dataModel',
              dataModelSymbolKey: 'PropertyDataModel_EXAMPLE',
            },
          },
          constrainedParameterProperty_EXAMPLE: {
            propertyKey: 'constrainedParameterProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'numberLiteral',
              literalSymbol: '7',
            },
          },
          defaultParameterProperty_EXAMPLE: {
            propertyKey: 'defaultParameterProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
          genericParameterProperty_EXAMPLE: {
            propertyKey: 'genericParameterProperty_EXAMPLE',
            propertyElement: {
              elementKind: 'dataModel',
              dataModelSymbolKey: 'PropertyDataModel_EXAMPLE',
            },
          },
        },
      },
    },
  });
});
