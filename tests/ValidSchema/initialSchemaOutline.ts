import { InitialSchemaOutline } from './setupValidSchema.ts';

export const initialSchemaOutline: InitialSchemaOutline = {
  schemaImports: [
    "import { VerdeTable } from '../../../source/library/module.ts';",
  ],
  schemaSymbol: 'ValidSchema',
  schemaExports: ['BasicDataModel', 'DataModelUnion'],
  schemaModels: {
    BasicDataModel: {
      modelSymbol: 'BasicDataModel',
      modelProperties: {
        booleanLiteralProperty: {
          propertyKey: 'booleanLiteralProperty',
          propertyElementSymbol: 'true',
        },
        numberLiteralProperty: {
          propertyKey: 'numberLiteralProperty',
          propertyElementSymbol: '123',
        },
        stringLiteralProperty: {
          propertyKey: 'stringLiteralProperty',
          propertyElementSymbol: '"hello"',
        },       
        booleanProperty: {
          propertyKey: 'booleanProperty',
          propertyElementSymbol: 'boolean',
        },
        numberProperty: {
          propertyKey: 'numberProperty',
          propertyElementSymbol: 'number',
        },
         stringProperty: {
          propertyKey: 'stringProperty',
          propertyElementSymbol: 'string',
        },
        dataModelReferenceProperty: {
          propertyKey: 'dataModelReferenceProperty',
          propertyElementSymbol: 'BasicDataModel',
        },
        aliasReferenceProperty: {
          propertyKey: 'aliasReferenceProperty',
          propertyElementSymbol: 'DataModelUnion',
        },
        verdeTableProperty: {
          propertyKey: 'verdeTableProperty',
          propertyElementSymbol: 'VerdeTable<DataModelUnion>'
        }
      },
    },
  },
  schemaAliases: {
    DataModelUnion: {
      aliasSymbol: 'DataModelUnion',
      aliasElementSymbol: 'BasicDataModel',
    },
  },
};
