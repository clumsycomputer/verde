import { ModelElement, SchemaMap, __SchemaModel } from './SchemaMap.ts';

export interface TerminalSchemaMap extends SchemaMap<TerminalSchemaModel> {}

export interface TerminalSchemaModel
  extends __SchemaModel<TerminalModelElement> {}

export type TerminalModelElement = ModelElement<TerminalSchemaModel>;
