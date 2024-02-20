import { TerminalSchema } from '../types/TerminalSchema.ts';

export interface CreateSchemaRecordApi {
  terminalSchema: TerminalSchema;
  modelSymbolKey: keyof TerminalSchema['schemaMap'];
  modelData: CreateSchemaRecord__ModelData<
    this['terminalSchema']['schemaMap'][this['modelSymbolKey']]
  >;
}

type CreateSchemaRecord__ModelData<
  ThisTerminalModel extends TerminalSchema['schemaMap'][string],
> = Record<string, any>;

export function createSchemaRecord(
  api: CreateSchemaRecordApi,
) {
  const {} = api
}
