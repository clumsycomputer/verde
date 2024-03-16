import { DataSchema } from '../../source/library/module.ts';

export const exampleSchema: DataSchema = {
  schemaSymbol: 'DataSchema__EXAMPLE',
  schemaMap: {
    TopLevelModel__EXAMPLE: {
      modelSymbol: 'TopLevelModel__EXAMPLE',
      modelProperties: {
        booleanProperty__EXAMPLE: {
          propertyKey: 'booleanProperty__EXAMPLE',
          propertyElement: {
            elementKind: 'booleanPrimitive',
          },
        },
        numberProperty__EXAMPLE: {
          propertyKey: 'numberProperty__EXAMPLE',
          propertyElement: {
            elementKind: 'numberPrimitive',
          },
        },
        stringProperty__EXAMPLE: {
          propertyKey: 'stringProperty__EXAMPLE',
          propertyElement: {
            elementKind: 'stringPrimitive',
          },
        },
        dataModelProperty__EXAMPLE: {
          propertyKey: 'dataModelProperty__EXAMPLE',
          propertyElement: {
            elementKind: 'dataModel',
            dataModelSymbolKey: 'DataModelPropertyModel__EXAMPLE',
          },
        },
      },
      modelEncoding: [
        { encodingMetadataKey: '__uuid' },
        { encodingPropertyKey: 'booleanProperty__EXAMPLE' },
        { encodingPropertyKey: 'numberProperty__EXAMPLE' },
        { encodingPropertyKey: 'stringProperty__EXAMPLE' },
        { encodingPropertyKey: 'dataModelProperty__EXAMPLE' },
      ],
    },
    DataModelPropertyModel__EXAMPLE: {
      modelSymbol: 'DataModelPropertyModel__EXAMPLE',
      modelProperties: {},
      modelEncoding: [
        { encodingMetadataKey: '__uuid' },
      ],
    },
  },
};

export const exampleRecordAaa = {
  __status: 'new',
  __modelSymbol: 'TopLevelModel__EXAMPLE',
  __uuid: [1, 2],
  booleanProperty__EXAMPLE: true,
  numberProperty__EXAMPLE: 1,
  stringProperty__EXAMPLE: 'hello record',
  dataModelProperty__EXAMPLE: {
    __status: 'new',
    __modelSymbol: 'DataModelPropertyModel__EXAMPLE',
    __uuid: [3, 4],
  },
};