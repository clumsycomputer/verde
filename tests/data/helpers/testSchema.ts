import { createRecordUuid } from '../../../source/library/data/createRecordUuid.ts';
import { DataSchema, RecordUuid } from '../../../source/library/module.ts';

export const testSchema: DataSchema = {
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
      modelProperties: {
        otherStringProperty__EXAMPLE: {
          propertyKey: 'otherStringProperty__EXAMPLE',
          propertyElement: {
            elementKind: 'stringPrimitive'
          }
        }
      },
      modelEncoding: [
        { encodingMetadataKey: '__uuid' },
        { encodingPropertyKey: 'otherStringProperty__EXAMPLE' }
      ],
    },
  },
};

export interface CreateTopLevelRecordApi {
  __status?: string;
  __uuid?: RecordUuid;
  booleanProperty__EXAMPLE?: boolean;
  numberProperty__EXAMPLE?: number;
  stringProperty__EXAMPLE?: string;
  dataModelProperty__EXAMPLE?: ReturnType<typeof createDataModelPropertyRecord>;
}

export function createTopLevelRecord(api: CreateTopLevelRecordApi) {
  const {
    booleanProperty__EXAMPLE = true,
    numberProperty__EXAMPLE = 1,
    stringProperty__EXAMPLE = 'howdy',
    dataModelProperty__EXAMPLE = createDataModelPropertyRecord({}),
  } = api;
  return {
    __status: 'new',
    __modelSymbol: 'TopLevelModel__EXAMPLE',
    __uuid: createRecordUuid(),
    booleanProperty__EXAMPLE,
    numberProperty__EXAMPLE,
    stringProperty__EXAMPLE,
    dataModelProperty__EXAMPLE,
  };
}

interface CreateDataModelPropertyRecordApi {
  otherStringProperty__EXAMPLE?: string
}

export function createDataModelPropertyRecord(
  api: CreateDataModelPropertyRecordApi,
) {
  const { otherStringProperty__EXAMPLE = 'hello' } = api;
  return {
    __status: 'new',
    __modelSymbol: 'DataModelPropertyModel__EXAMPLE',
    __uuid: createRecordUuid(),
    otherStringProperty__EXAMPLE
  };
}
