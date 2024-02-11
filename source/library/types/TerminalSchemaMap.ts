import { ModelElement, SchemaMap, SchemaModel_Core } from './SchemaMap.ts';

export interface TerminalSchemaMap extends SchemaMap<TerminalSchemaModel> {}

export interface TerminalSchemaModel
  extends SchemaModel_Core<TerminalModelElement> {}

export type TerminalModelElement = ModelElement<TerminalSchemaModel>;
