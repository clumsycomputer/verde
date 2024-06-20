import { IntermediateSchema } from '../types/IntermediateSchema.ts';

interface ValidateIndirectReferenceElementsApi {
  intermediateSchema: IntermediateSchema
}

function validateIndirectReferenceElements(api: ValidateIndirectReferenceElementsApi) {
  const {intermediateSchema} = api
  intermediateSchema.schemaExport
}