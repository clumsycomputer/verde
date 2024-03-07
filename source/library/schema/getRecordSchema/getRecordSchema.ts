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
  return [
    identifierEncoding,
    modelSymbolKeyEncoding,
    ...stalePropertiesEncoding.filter((someStalePropertyEncoding) =>
      someSolidifiedModel
        .modelProperties[someStalePropertyEncoding.encodingPropertyKey] !==
        undefined
    ),
    ...Object.keys(someSolidifiedModel.modelProperties).filter((
      someNextPropertyKey,
    ) =>
      undefined ===
        staleRecordModel.modelProperties[someNextPropertyKey]
    )
      .sort().map((someNewPropertyKey) => ({
        encodingPropertyKey: someNewPropertyKey,
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
