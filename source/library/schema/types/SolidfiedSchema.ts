import {
  __SchemaModel,
  BasicStructuredSchema,
  ModelElement,
} from './StructuredSchema.ts';

export interface SolidifiedSchema
  extends BasicStructuredSchema<SolidifiedModel> {}

export interface SolidifiedModel extends __SchemaModel<SolidifiedElement> {}

export type SolidifiedElement = ModelElement<SolidifiedModel>;
