import { RecordSchema } from '../schema/types/RecordSchema.ts';

interface CreateRecordApi {
  recordSchema: RecordSchema
  recordSymbolKey: string
  recordData: Record<string, unknown>
}

function createRecord(api: CreateRecordApi) {
  const {recordData} = api
  
}