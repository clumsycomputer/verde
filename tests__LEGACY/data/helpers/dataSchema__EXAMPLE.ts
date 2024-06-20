import {
  createRecordUuid,
  RecordUuid,
} from '../../../source/library/data__LEGACY/helpers/createRecordUuid.ts';
import { DataSchema } from '../../../source/library/module.ts';

export const dataSchema__EXAMPLE: DataSchema = {
  schemaSymbol: 'DataSchema__EXAMPLE',
  schemaMap: {
    TopLevelModel__EXAMPLE: {
      modelSymbol: 'TopLevelModel__EXAMPLE',
      modelProperties: {
        booleanLiteralProperty__EXAMPLE: {
          propertyKey: 'booleanLiteralProperty__EXAMPLE',
          propertyElement: {
            elementKind: 'booleanLiteral',
            literalSymbol: 'true',
          },
        },
        numberLiteralProperty__EXAMPLE: {
          propertyKey: 'numberLiteralProperty__EXAMPLE',
          propertyElement: {
            elementKind: 'numberLiteral',
            literalSymbol: '211',
          },
        },
        stringLiteralProperty__EXAMPLE: {
          propertyKey: 'stringLiteralProperty__EXAMPLE',
          propertyElement: {
            elementKind: 'stringLiteral',
            literalSymbol: '"hooty"',
          },
        },
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
        parentModelProperty__EXAMPLE: {
          propertyKey: 'parentModelProperty__EXAMPLE',
          propertyElement: {
            elementKind: 'dataModel',
            dataModelSymbolKey: 'TopLevelModel__EXAMPLE',
          },
        },
      },
      modelEncoding: [
        { encodingMetadataKey: '__uuid' },
        { encodingPropertyKey: 'parentModelProperty__EXAMPLE' },
      ],
    },
  },
};

export interface CreateTopLevelRecordApi
  extends
    Pick<
      TopLevelPropertyModelRecord,
      | 'booleanProperty__EXAMPLE'
      | 'numberProperty__EXAMPLE'
      | 'stringProperty__EXAMPLE'
      | 'dataModelProperty__EXAMPLE'
    > {
}

export function createTopLevelRecord(
  api: CreateTopLevelRecordApi,
): TopLevelPropertyModelRecord {
  const {
    booleanProperty__EXAMPLE,
    numberProperty__EXAMPLE,
    stringProperty__EXAMPLE,
    dataModelProperty__EXAMPLE,
  } = api;
  return {
    __status: 'new',
    __modelSymbol: 'TopLevelModel__EXAMPLE',
    __uuid: createRecordUuid(),
    booleanLiteralProperty__EXAMPLE: true,
    numberLiteralProperty__EXAMPLE: 211,
    stringLiteralProperty__EXAMPLE: 'hooty',
    booleanProperty__EXAMPLE,
    numberProperty__EXAMPLE,
    stringProperty__EXAMPLE,
    dataModelProperty__EXAMPLE,
  };
}

interface CreateDataModelPropertyRecordApi
  extends Pick<DataModelPropertyModelRecord, 'parentModelProperty__EXAMPLE'> {
}

export function createDataModelPropertyRecord(
  api: CreateDataModelPropertyRecordApi,
): DataModelPropertyModelRecord {
  const { parentModelProperty__EXAMPLE } = api;
  return {
    __status: 'new',
    __modelSymbol: 'DataModelPropertyModel__EXAMPLE',
    __uuid: createRecordUuid(),
    parentModelProperty__EXAMPLE,
  };
}

export type TopLevelPropertyModelRecord = ModelRecord<'TopLevelModel__EXAMPLE', {
  booleanLiteralProperty__EXAMPLE: true;
  numberLiteralProperty__EXAMPLE: 211;
  stringLiteralProperty__EXAMPLE: 'hooty';
  booleanProperty__EXAMPLE: boolean;
  numberProperty__EXAMPLE: number;
  stringProperty__EXAMPLE: string;
  dataModelProperty__EXAMPLE: DataModelPropertyModelRecord;
}>;

export type DataModelPropertyModelRecord = ModelRecord<
  'DataModelPropertyModel__EXAMPLE',
  {
    parentModelProperty__EXAMPLE: TopLevelPropertyModelRecord;
  }
>;

type ModelRecord<ModelSymbol, ModelProperties> =
  | __NewRecord<ModelSymbol, ModelProperties>
  | __FiledRecord<ModelSymbol, ModelProperties>;

type __NewRecord<ModelSymbol, ModelProperties> = __Record<
  'new',
  ModelSymbol,
  ModelProperties
>;

type __FiledRecord<ModelSymbol, ModelProperties> =
  & __Record<
    'filed',
    ModelSymbol,
    ModelProperties
  >
  & {
    __fileIndex: number;
  };

type __Record<
  RecordStatus,
  ModelSymbol,
  ModelProperties,
> = {
  __status: RecordStatus;
  __modelSymbol: ModelSymbol;
  __uuid: RecordUuid;
} & ModelProperties;
