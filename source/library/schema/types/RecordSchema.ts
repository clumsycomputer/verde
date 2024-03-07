import { SolidifiedModel } from './SolidfiedSchema.ts';
import { BasicStructuredSchema } from './StructuredSchema.ts';

export interface RecordSchema extends BasicStructuredSchema<RecordModel> {}

export interface RecordModel extends SolidifiedModel {
  modelRecordEncoding: [
    IdentifierEncoding,
    ModelSymbolKeyEncoding,
    ...Array<PropertyEncoding>,
  ];
}

export interface IdentifierEncoding extends __MetadataEncoding<'__id'> {}

export interface ModelSymbolKeyEncoding
  extends __MetadataEncoding<'__modelSymbolKey'> {}

interface __MetadataEncoding<MetadataKey> {
  encodingMetadataKey: MetadataKey;
}

export interface PropertyEncoding {
  encodingPropertyKey: string;
}
