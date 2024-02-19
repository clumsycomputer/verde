import {
  __SchemaModel,
  ModelElement,
  StructuredSchema,
} from './StructuredSchema.ts';



export interface TerminalSchema
  extends StructuredSchema<Record<string, TerminalModel>> {}

export interface TerminalModel
  extends __SchemaModel<TerminalElement> {}

export type TerminalElement = ModelElement<TerminalModel>;
