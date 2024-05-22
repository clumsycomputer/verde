import { IntermediateSchema } from '../types/IntermediateSchema.ts';
import { getExportElementResolvers } from './components/__getElementResolvers.ts';
import { deriveSchemaElement } from './components/deriveSchemaElement.ts';
import {
  LoadSchemaModuleResult,
  loadSchemaModule,
} from './components/loadSchemaModule.ts';

export interface DeriveIntermediateSchemaApi {
  schemaModulePath: string;
}

export function deriveIntermediateSchema(
  api: DeriveIntermediateSchemaApi,
): IntermediateSchema {
  const { schemaModulePath } = api;
  const {
    schemaTypeChecker,
    schemaExportNode,
  } = loadSchemaModule({
    schemaModulePath,
  });
  return __deriveIntermediateSchema({
    schemaTypeChecker,
    schemaExportNode,
  });
}

export interface __DeriveIntermediateSchemaApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'schemaExportNode'
  > {}

function __deriveIntermediateSchema(
  api: __DeriveIntermediateSchemaApi,
): IntermediateSchema {
  const { schemaTypeChecker, schemaExportNode } = api;  
  const schemaResult: IntermediateSchema = {
    // schemaSymbolPathMap: {},
    schemaAliases: {},
    schemaModels: {
      data: {},
      concreteTemplate: {},
      genericTemplate: {},
    },
    schemaExport: undefined as unknown as IntermediateSchema['schemaExport'],
  };
  schemaResult.schemaExport = {
    exportName: schemaExportNode.name.text,
    exportElement: deriveSchemaElement({
      schemaTypeChecker,      
      schemaResult,
      elementLocalNode: schemaExportNode.type,
      elementResolvers: getExportElementResolvers(),
    }),
  };
  return schemaResult;
}
