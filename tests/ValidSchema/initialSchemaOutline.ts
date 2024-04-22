import { InitialSchemaOutline } from './setupValidSchema.ts';

export const initialSchemaOutline: InitialSchemaOutline = {
  schemaSymbol: 'ValidSchema',
  schemaExports: ['BasicDataModel'],
  schemaModels: {
    BasicDataModel: {
      modelSymbol: 'BasicDataModel',
      modelProperties: {
        stringProperty: {
          propertyKey: 'stringProperty',
          propertyElementSymbol: 'string',
        },
        numberProperty: {
          propertyKey: 'numberProperty',
          propertyElementSymbol: 'number',
        },
        booleanProperty: {
          propertyKey: 'booleanProperty',
          propertyElementSymbol: 'boolean',
        },
        stringLiteralProperty: {
          propertyKey: 'stringLiteralProperty',
          propertyElementSymbol: '"hello"',
        },
        numberLiteralProperty: {
          propertyKey: 'numberLiteralProperty',
          propertyElementSymbol: '123',
        },
        booleanLiteralProperty: {
          propertyKey: 'booleanLiteralProperty',
          propertyElementSymbol: 'true',
        },
        dataModelReferenceProperty: {
          propertyKey: 'dataModelReferenceProperty',
          propertyElementSymbol: 'BasicDataModel'
        },
        aliasReferenceProperty: {
          propertyKey: 'aliasReferenceProperty',
          propertyElementSymbol: 'DataModelUnion'
        }
      },
    },
  },
  schemaAliases: {
    DataModelUnion: {
      aliasSymbol: 'DataModelUnion',
      aliasElementSymbol: 'BasicDataModel'
    }
  }
};