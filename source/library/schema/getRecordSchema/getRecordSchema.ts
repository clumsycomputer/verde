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
    getModelEncoding: getInitialModelEncoding,
    additionalModelEncodingApi: {},
  });
}

export interface GetNextRecordSchemaApi
  extends Pick<__ResolveRecordSchemaApi<unknown>, 'solidifiedSchema'> {
  staleRecordSchema: RecordSchema;
}

export function getNextRecordSchema(api: GetNextRecordSchemaApi) {
  const { solidifiedSchema, staleRecordSchema } = api;
  return __getRecordSchema({
    getModelEncoding: getModelEncoding__resolveNextRecordSchema,
    additionalModelEncodingApi: {
      staleRecordSchema,
    },
    solidifiedSchema,
  });
}

interface GetModelEncodingApi__resolveNextRecordSchema
  extends
    __GetModelEncodingApi,
    Pick<GetNextRecordSchemaApi, 'staleRecordSchema'> {
}

function getModelEncoding__resolveNextRecordSchema(
  api: GetModelEncodingApi__resolveNextRecordSchema,
) {
  const { staleRecordSchema, someSolidifiedModel } = api;
  const staleRecordModel =
    staleRecordSchema.schemaMap[someSolidifiedModel.modelSymbol];
  return staleRecordModel
    ? getNextModelEncoding({
      staleRecordModel,
      someSolidifiedModel,
    })
    : getInitialModelEncoding({
      someSolidifiedModel,
    });
}

interface GetInitialModelEncodingApi
  extends __GetModelEncodingApi {}

function getInitialModelEncoding(
  api: GetInitialModelEncodingApi,
): RecordModel['modelEncoding'] {
  const { someSolidifiedModel } = api;
  return [
    { encodingMetadataKey: '__uuid' },
    ...Object.keys(someSolidifiedModel.modelProperties)
      .sort()
      .map((somePropertyKey) => ({
        encodingPropertyKey: somePropertyKey,
      })),
  ];
}

interface GetNextModelEncodingApi extends __GetModelEncodingApi {
  staleRecordModel: RecordModel;
}

function getNextModelEncoding(
  api: GetNextModelEncodingApi,
): RecordModel['modelEncoding'] {
  const { staleRecordModel, someSolidifiedModel } = api;
  const [
    identifierEncoding,
    ...stalePropertiesEncoding
  ] = staleRecordModel.modelEncoding;
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

interface __ResolveRecordSchemaApi<ThisAdditionalModelEncodingApi> {
  solidifiedSchema: SolidifiedSchema;
  additionalModelEncodingApi: ThisAdditionalModelEncodingApi;
  getModelEncoding: (
    api: GetModelEncodingApi<this['additionalModelEncodingApi']>,
  ) => RecordModel['modelEncoding'];
}

type GetModelEncodingApi<ThisAdditionalModelEncodingApi> =
  & __GetModelEncodingApi
  & ThisAdditionalModelEncodingApi;

interface __GetModelEncodingApi {
  someSolidifiedModel: __ResolveRecordSchemaApi<
    unknown
  >['solidifiedSchema']['schemaMap'][string];
}

function __getRecordSchema<ThisAdditionalModelEncodingApi>(
  api: __ResolveRecordSchemaApi<ThisAdditionalModelEncodingApi>,
) {
  const {
    solidifiedSchema,
    getModelEncoding,
    additionalModelEncodingApi,
  } = api;
  return {
    ...solidifiedSchema,
    schemaMap: Object.values(solidifiedSchema.schemaMap).reduce<
      RecordSchema['schemaMap']
    >((schemaMapResult, someSolidifiedModel) => {
      schemaMapResult[someSolidifiedModel.modelSymbol] = {
        ...someSolidifiedModel,
        modelEncoding: getModelEncoding({
          someSolidifiedModel,
          ...additionalModelEncodingApi,
        }),
      };
      return schemaMapResult;
    }, {}),
  };
}
