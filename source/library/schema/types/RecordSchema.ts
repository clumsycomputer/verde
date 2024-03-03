import { SolidifiedModel } from './SolidfiedSchema.ts';
import { BasicStructuredSchema } from './StructuredSchema.ts';

export interface RecordSchema extends BasicStructuredSchema<RecordModel> {}

export interface RecordModel extends SolidifiedModel {
  modelEncoding: Array<EncodingEntry>;
}

export interface EncodingEntry {
  entryPropertyKey: string;
}
