import { SolidifiedModel } from './SolidfiedSchema.ts';
import { BasicStructuredSchema } from './StructuredSchema.ts';

export interface DataSchema extends BasicStructuredSchema<DataModel> {}

export interface DataModel extends SolidifiedModel {
  modelEncoding: [
    IdentifierEncoding,
    ...Array<PropertyEncoding>,
  ];
}

export interface IdentifierEncoding extends __MetadataEncoding<'__uuid'> {}

export interface ModelSymbolKeyEncoding
  extends __MetadataEncoding<'__modelSymbol'> {}

interface __MetadataEncoding<MetadataKey> {
  encodingMetadataKey: MetadataKey;
}

export interface PropertyEncoding {
  encodingPropertyKey: string;
}
