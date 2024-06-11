import { __SchemaExport, __StructuredSchema } from './__StructuredSchema.ts';

export interface SimplifiedSchema
  extends __StructuredSchema<SimplifiedSchemaExport, SimplifiedSchemaType> {}

interface SimplifiedSchemaExport extends __SchemaExport<never> {}

export type SimplifiedSchemaType = never;
