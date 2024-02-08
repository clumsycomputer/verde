import { IntermediateSchemaMap } from '../types/IntermediateSchemaMap.ts';

export interface DeriveTerminalSchemaMapApi {
  someIntermediateSchemaMap: IntermediateSchemaMap
}

export function deriveTerminalSchemaMap(api: DeriveTerminalSchemaMapApi) {
  const {} = api
}