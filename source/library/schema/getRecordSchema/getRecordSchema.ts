import { throwInvalidPathError } from '../../../helpers/throwError.ts';
import { RecordModel, RecordSchema } from '../types/RecordSchema.ts';
import { SolidifiedSchema } from '../types/SolidfiedSchema.ts';

export interface GetInitialRecordSchemaApi
  extends Pick<__ResolveRecordSchemaApi<unknown>, 'solidifiedSchema'> {
}

export function getInitialRecordSchema(
  api: GetInitialRecordSchemaApi,
): RecordSchema {
  const { solidifiedSchema } = api;
  return __getRecordSchema({
    solidifiedSchema,
    getModelRecordEncoding: getInitialModelRecordEncoding,
    additionalModelRecordEncodingApi: {},
  });
}

export interface GetNextRecordSchemaApi
  extends Pick<__ResolveRecordSchemaApi<unknown>, 'solidifiedSchema'> {
  staleRecordSchema: RecordSchema;
}

export function getNextRecordSchema(api: GetNextRecordSchemaApi) {
  const { solidifiedSchema, staleRecordSchema } = api;
  return __getRecordSchema({
    getModelRecordEncoding: getModelRecordEncoding__resolveNextRecordSchema,
    additionalModelRecordEncodingApi: {
      staleRecordSchema,
    },
    solidifiedSchema,
  });
}

interface GetModelRecordEncodingApi__resolveNextRecordSchema
  extends
    __GetModelRecordEncodingApi,
    Pick<GetNextRecordSchemaApi, 'staleRecordSchema'> {
}

function getModelRecordEncoding__resolveNextRecordSchema(
  api: GetModelRecordEncodingApi__resolveNextRecordSchema,
) {
  const { staleRecordSchema, someSolidifiedModel } = api;
  const staleRecordModel =
    staleRecordSchema.schemaMap[someSolidifiedModel.modelSymbolKey];
  return staleRecordModel
    ? getNextModelRecordEncoding({
      staleRecordModel,
      someSolidifiedModel,
    })
    : getInitialModelRecordEncoding({
      someSolidifiedModel,
    });
}

interface GetInitialModelRecordEncodingApi
  extends __GetModelRecordEncodingApi {}

function getInitialModelRecordEncoding(
  api: GetInitialModelRecordEncodingApi,
): RecordModel['modelRecordEncoding'] {
  const { someSolidifiedModel } = api;
  return [
    { encodingMetadataKey: '__id' },
    { encodingMetadataKey: '__modelSymbolKey' },
    ...Object.keys(someSolidifiedModel.modelProperties)
      .sort()
      .map((somePropertyKey) => ({
        encodingPropertyKey: somePropertyKey,
      })),
  ];
}

interface GetNextModelRecordEncodingApi extends __GetModelRecordEncodingApi {
  staleRecordModel: RecordModel;
}

function getNextModelRecordEncoding(
  api: GetNextModelRecordEncodingApi,
): RecordModel['modelRecordEncoding'] {
  const { staleRecordModel, someSolidifiedModel } = api;
  const [
    identifierEncoding,
    modelSymbolKeyEncoding,
    ...stalePropertiesEncoding
  ] = staleRecordModel.modelRecordEncoding;
  const propertyStatusMap = Object.values(
    someSolidifiedModel.modelProperties,
  ).reduce<
    Record<string, 'newOrRenamed' | 'retyped' | 'unchanged'>
  >((
    statusMapResult,
    someNextProperty,
  ) => {
    const staleModelProperty =
      staleRecordModel.modelProperties[someNextProperty.propertyKey];
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
    modelSymbolKeyEncoding,
    ...stalePropertiesEncoding.filter((someStalePropertyEncoding) =>
      propertyStatusMap[someStalePropertyEncoding.encodingPropertyKey] ===
        'unchanged'
    ),
    ...Object.entries(propertyStatusMap).filter((
      [somePropertyKey, propertyStatus],
    ) => propertyStatus === 'newOrRenamed' || propertyStatus === 'retyped')
      .sort().map(([somePropertyKey]) => ({
        encodingPropertyKey: somePropertyKey,
      })),
  ];
}

interface __ResolveRecordSchemaApi<ThisAdditionalModelRecordEncodingApi> {
  solidifiedSchema: SolidifiedSchema;
  additionalModelRecordEncodingApi: ThisAdditionalModelRecordEncodingApi;
  getModelRecordEncoding: (
    api: GetModelRecordEncodingApi<this['additionalModelRecordEncodingApi']>,
  ) => RecordModel['modelRecordEncoding'];
}

type GetModelRecordEncodingApi<ThisAdditionalModelRecordEncodingApi> =
  & __GetModelRecordEncodingApi
  & ThisAdditionalModelRecordEncodingApi;

interface __GetModelRecordEncodingApi {
  someSolidifiedModel: __ResolveRecordSchemaApi<
    unknown
  >['solidifiedSchema']['schemaMap'][string];
}

function __getRecordSchema<ThisAdditionalModelRecordEncodingApi>(
  api: __ResolveRecordSchemaApi<ThisAdditionalModelRecordEncodingApi>,
) {
  const {
    solidifiedSchema,
    getModelRecordEncoding,
    additionalModelRecordEncodingApi,
  } = api;
  return {
    ...solidifiedSchema,
    schemaMap: Object.values(solidifiedSchema.schemaMap).reduce<
      RecordSchema['schemaMap']
    >((schemaMapResult, someSolidifiedModel) => {
      schemaMapResult[someSolidifiedModel.modelSymbolKey] = {
        ...someSolidifiedModel,
        modelRecordEncoding: getModelRecordEncoding({
          someSolidifiedModel,
          ...additionalModelRecordEncodingApi,
        }),
      };
      return schemaMapResult;
    }, {}),
  };
}
