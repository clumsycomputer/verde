import {
  __SchemaModel,
  ModelElement,
  StructuredSchema,
} from './StructuredSchema.ts';

export interface TerminalStructuredSchema
  extends StructuredSchema<Record<string, TerminalSchemaModel>> {}

export interface TerminalSchemaModel
  extends __SchemaModel<TerminalModelElement> {}

export type TerminalModelElement = ModelElement<TerminalSchemaModel>;
