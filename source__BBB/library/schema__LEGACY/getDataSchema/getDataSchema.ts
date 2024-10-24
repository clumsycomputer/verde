import { throwInvalidPathError } from '../../../helpers/throwError.ts';
import { DataModel, DataSchema } from '../types/DataSchema.ts';
import { SolidifiedSchema } from '../types/SolidfiedSchema.ts';

export interface GetInitialDataSchemaApi
  extends Pick<__GetDataSchemaApi<unknown>, 'solidifiedSchema'> {
}

export function getInitialDataSchema(
  api: GetInitialDataSchemaApi,
): DataSchema {
  const { solidifiedSchema } = api;
  return __getDataSchema({
    solidifiedSchema,
    getModelEncoding: getInitialModelEncoding,
    additionalModelEncodingApi: {},
  });
}

export interface GetNextDataSchemaApi
  extends Pick<__GetDataSchemaApi<unknown>, 'solidifiedSchema'> {
  staleDataSchema: DataSchema;
}

export function getNextDataSchema(api: GetNextDataSchemaApi) {
  const { solidifiedSchema, staleDataSchema } = api;
  return __getDataSchema({
    getModelEncoding: getModelEncoding__resolveNextDataSchema,
    additionalModelEncodingApi: {
      staleDataSchema,
    },
    solidifiedSchema,
  });
}

interface GetModelEncodingApi__resolveNextDataSchema
  extends
    __GetModelEncodingApi,
    Pick<GetNextDataSchemaApi, 'staleDataSchema'> {
}

function getModelEncoding__resolveNextDataSchema(
  api: GetModelEncodingApi__resolveNextDataSchema,
) {
  const { staleDataSchema, someSolidifiedModel } = api;
  const staleDataModel =
    staleDataSchema.schemaMap[someSolidifiedModel.modelSymbol];
  return staleDataModel
    ? getNextModelEncoding({
      staleDataModel,
      someSolidifiedModel,
    })
    : getInitialModelEncoding({
      someSolidifiedModel,
    });
}

interface GetInitialModelEncodingApi extends __GetModelEncodingApi {}

function getInitialModelEncoding(
  api: GetInitialModelEncodingApi,
): DataModel['modelEncoding'] {
  const { someSolidifiedModel } = api;
  return [
    { encodingMetadataKey: '__uuid' },
    ...Object.values(someSolidifiedModel.modelProperties).filter((
      someModelProperty,
    ) =>
      (someModelProperty.propertyElement.elementKind === 'booleanLiteral' ||
        someModelProperty.propertyElement.elementKind === 'numberLiteral' ||
        someModelProperty.propertyElement.elementKind === 'stringLiteral') ===
        false
    )
      .map((someModelProperty) => ({
        encodingPropertyKey: someModelProperty.propertyKey,
      })).sort((propertyEncodingAaa, encodingPropertyBbb) =>
        propertyEncodingAaa.encodingPropertyKey.localeCompare(
          encodingPropertyBbb.encodingPropertyKey,
        )
      ),
  ];
}

interface GetNextModelEncodingApi extends __GetModelEncodingApi {
  staleDataModel: DataModel;
}

function getNextModelEncoding(
  api: GetNextModelEncodingApi,
): DataModel['modelEncoding'] {
  const { staleDataModel, someSolidifiedModel } = api;
  const [
    identifierEncoding,
    ...stalePropertiesEncoding
  ] = staleDataModel.modelEncoding;
  const propertyStatusMap = Object.values(
    someSolidifiedModel.modelProperties,
  ).filter((someModelProperty) =>
    (someModelProperty.propertyElement.elementKind === 'booleanLiteral' ||
      someModelProperty.propertyElement.elementKind === 'numberLiteral' ||
      someModelProperty.propertyElement.elementKind === 'stringLiteral') ===
      false
  ).reduce<
    Record<string, 'newOrRenamed' | 'retyped' | 'unchanged'>
  >((
    statusMapResult,
    someNextProperty,
  ) => {
    const staleModelProperty =
      staleDataModel.modelProperties[someNextProperty.propertyKey];
    if (staleModelProperty === undefined) {
      statusMapResult[someNextProperty.propertyKey] = 'newOrRenamed';
    } else if (
      staleModelProperty.propertyElement.elementKind !==
        someNextProperty.propertyElement.elementKind
    ) {
      statusMapResult[someNextProperty.propertyKey] = 'retyped';
    } else if (
      staleModelProperty.propertyElement.elementKind ===
        someNextProperty.propertyElement.elementKind
    ) {
      statusMapResult[someNextProperty.propertyKey] = 'unchanged';
    } else {
      throwInvalidPathError('newOrUpdatedPropertyKeys');
    }
    return statusMapResult;
  }, {});
  return [
    identifierEncoding,
    ...stalePropertiesEncoding.filter((someStalePropertyEncoding) =>
      propertyStatusMap[someStalePropertyEncoding.encodingPropertyKey] ===
        'unchanged'
    ),
    ...Object.entries(propertyStatusMap).filter((
      [somePropertyKey, propertyStatus],
    ) => propertyStatus === 'newOrRenamed' || propertyStatus === 'retyped')
      .map(
        ([somePropertyKey]) => ({
          encodingPropertyKey: somePropertyKey,
        }),
      ).sort((propertyEncodingAaa, encodingPropertyBbb) =>
        propertyEncodingAaa.encodingPropertyKey.localeCompare(
          encodingPropertyBbb.encodingPropertyKey,
        )
      ),
  ];
}

interface __GetDataSchemaApi<ThisAdditionalModelEncodingApi> {
  solidifiedSchema: SolidifiedSchema;
  additionalModelEncodingApi: ThisAdditionalModelEncodingApi;
  getModelEncoding: (
    api: GetModelEncodingApi<this['additionalModelEncodingApi']>,
  ) => DataModel['modelEncoding'];
}

type GetModelEncodingApi<ThisAdditionalModelEncodingApi> =
  & __GetModelEncodingApi
  & ThisAdditionalModelEncodingApi;

interface __GetModelEncodingApi {
  someSolidifiedModel: __GetDataSchemaApi<
    unknown
  >['solidifiedSchema']['schemaMap'][string];
}

function __getDataSchema<ThisAdditionalModelEncodingApi>(
  api: __GetDataSchemaApi<ThisAdditionalModelEncodingApi>,
) {
  const {
    solidifiedSchema,
    getModelEncoding,
    additionalModelEncodingApi,
  } = api;
  return {
    ...solidifiedSchema,
    schemaMap: Object.values(solidifiedSchema.schemaMap).reduce<
      DataSchema['schemaMap']
    >((schemaMapResult, someSolidifiedModel) => {
      schemaMapResult[someSolidifiedModel.modelSymbol] = {
        ...someSolidifiedModel,
        modelEncoding: getModelEncoding({
          someSolidifiedModel,
          ...additionalModelEncodingApi,
        })
      };
      return schemaMapResult;
    }, {}),
  };
}