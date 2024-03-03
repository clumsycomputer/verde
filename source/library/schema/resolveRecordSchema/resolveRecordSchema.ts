import { RecordModel, RecordSchema } from '../types/RecordSchema.ts';
import { SolidifiedSchema } from '../types/SolidfiedSchema.ts';

export interface ResolveInitialRecordSchemaApi
  extends Pick<__ResolveRecordSchemaApi, 'solidifiedSchema'> {
}

export function resolveInitialRecordSchema(
  api: ResolveInitialRecordSchemaApi,
): RecordSchema {
  const { solidifiedSchema } = api;
  return __resolveRecordSchema({
    solidifiedSchema,
    getRecordModelEncoding: ({ someSolidifiedModel }) =>
      Object.keys(someSolidifiedModel.modelProperties)
        .sort()
        .map((somePropertyKey) => ({
          entryPropertyKey: somePropertyKey,
        })),
  });
}

export interface ResolveNextRecordSchemaApi
  extends Pick<__ResolveRecordSchemaApi, 'solidifiedSchema'> {
  staleRecordSchema: RecordSchema;
}

export function resolveNextRecordSchema(api: ResolveNextRecordSchemaApi) {
  const { solidifiedSchema, staleRecordSchema } = api;
  return __resolveRecordSchema({
    solidifiedSchema,
    getRecordModelEncoding: ({ someSolidifiedModel }) => [
      ...staleRecordSchema.schemaMap[someSolidifiedModel.modelSymbolKey]
        ?.modelEncoding.filter((someStaleEntry) =>
          someSolidifiedModel
            .modelProperties[someStaleEntry.entryPropertyKey] !== undefined
        ) ?? [],
      ...Object.keys(someSolidifiedModel.modelProperties).filter((
        someNextPropertyKey,
      ) =>
        undefined ===
          staleRecordSchema.schemaMap[someSolidifiedModel.modelSymbolKey]
            ?.modelProperties[someNextPropertyKey]
      )
        .sort().map((someNewPropertyKey) => ({
          entryPropertyKey: someNewPropertyKey,
        })),
    ],
  });
}

interface __ResolveRecordSchemaApi {
  solidifiedSchema: SolidifiedSchema;
  getRecordModelEncoding: (
    api: GetRecordModelEncodingApi,
  ) => RecordModel['modelEncoding'];
}

interface GetRecordModelEncodingApi {
  someSolidifiedModel:
    __ResolveRecordSchemaApi['solidifiedSchema']['schemaMap'][string];
}

function __resolveRecordSchema(api: __ResolveRecordSchemaApi) {
  const { solidifiedSchema, getRecordModelEncoding } = api;
  return {
    ...solidifiedSchema,
    schemaMap: Object.values(solidifiedSchema.schemaMap).reduce<
      RecordSchema['schemaMap']
    >((schemaMapResult, someSolidifiedModel) => {
      schemaMapResult[someSolidifiedModel.modelSymbolKey] = {
        ...someSolidifiedModel,
        modelEncoding: getRecordModelEncoding({
          someSolidifiedModel,
        }),
      };
      return schemaMapResult;
    }, {}),
  };
}
