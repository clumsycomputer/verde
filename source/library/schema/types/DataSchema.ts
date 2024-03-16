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

// export type DataRecord = NewDataRecord | PagedDataRecord;

// export interface NewDataRecord extends __DataRecord<'new'> {}

// export interface PagedDataRecord extends __DataRecord<'paged'> {
//   __pageIndex: number;
// }

// interface __DataRecord<RecordStatus> {
//   __status: RecordStatus;
//   __uuid: RecordUuid;
//   __modelSymbol: DataModel['modelSymbol'];
//   [propertyKey: string]: unknown;
// }

export type RecordUuid = [firstChunk: number, secondChunk: number]
