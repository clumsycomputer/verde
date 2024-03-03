import { SolidifiedSchema } from '../../schema/types/SolidfiedSchema.ts';

export interface CreateSchemaRecordApi {
  databaseDirectoryPath: string;
  terminalSchema: SolidifiedSchema;
  recordModelSymbolKey: keyof SolidifiedSchema['schemaMap'];
  recordData: CreateSchemaRecord__ModelData<
    this['terminalSchema']['schemaMap'][this['recordModelSymbolKey']]
  >;
}

type CreateSchemaRecord__ModelData<
  ThisTerminalModel extends SolidifiedSchema['schemaMap'][string],
> = Record<string, any>;

export function createSchemaRecord(
  api: CreateSchemaRecordApi,
) {
  const {} = api;
}
