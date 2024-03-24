import { DataModel } from '../../schema/types/DataSchema.ts';
import { RecordUuid } from './createRecordUuid.ts';

export function isShallowWellFormedRecord(
  dataRecord: Record<string, unknown>,
): dataRecord is ShallowWellFormedRecord {
  return typeof dataRecord['__modelSymbol'] === 'string' &&
    dataRecord['__uuid'] instanceof Array &&
    typeof dataRecord['__uuid'][0] === 'number' &&
    typeof dataRecord['__uuid'][1] === 'number' &&
    (dataRecord['__status'] === 'new' ||
      (dataRecord['__status'] === 'filed' &&
        typeof dataRecord['__pageIndex'] === 'number'));
}

export type ShallowWellFormedRecord =
  | NewShallowWellFormedRecord
  | FiledShallowWellFormedRecord;

export interface NewShallowWellFormedRecord
  extends __ShallowWellFormedRecord<'new'> {}

export interface FiledShallowWellFormedRecord
  extends __ShallowWellFormedRecord<'filed'> {
  __pageIndex: number;
}

interface __ShallowWellFormedRecord<RecordStatus> {
  __status: RecordStatus;
  __uuid: RecordUuid;
  __modelSymbol: DataModel['modelSymbol'];
  [propertyKey: string]: unknown;
}