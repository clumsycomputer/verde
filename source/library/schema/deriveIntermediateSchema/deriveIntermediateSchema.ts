import {
  IntermediateSchema,
  IntermediateSchemaType,
} from '../types/IntermediateSchema.ts';
import { deriveExportElement } from './components/__deriveSchemaElement/__deriveSchemaElement.ts';
import {
  deriveAliasType,
  deriveConcreteTemplateModelType,
  deriveDataModelType,
  deriveGenericTemplateModelType,
} from './components/__deriveSchemaType/__deriveSchemaType.ts';
import {
  loadSchemaModule,
  LoadSchemaModuleResult,
} from './components/loadSchemaModule.ts';

export interface DeriveIntermediateSchemaApi {
  schemaModulePath: string;
}

export function deriveIntermediateSchema(
  api: DeriveIntermediateSchemaApi,
): IntermediateSchema {
  const { schemaModulePath } = api;
  const { schemaTypeChecker, schemaExportNode } = loadSchemaModule({
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
  const schemaDeriveTypeQueue: Array<DeriveSchemaTypeOperation> = [];
  const schemaResult: IntermediateSchema = {
    schemaTypes: {},
    schemaExport: {
      exportName: schemaExportNode.name.text,
      exportElement: deriveExportElement({
        schemaTypeChecker,
        schemaDeriveTypeQueue,
        elementLocalNode: schemaExportNode.type,
      }),
    },
  };
  for (
    const {
      operationDeriveSchemaType: deriveOperationSchemaType,
      operationTypeArguments: {
        typeLocalSymbol,
        typeSourceSymbol,
        typeSourceDeclaration,
      },
    } of schemaDeriveTypeQueue
  ) {
    const derivedOperationSchemaType =
      (deriveOperationSchemaType as DeriveOperationSchemaType)({
        schemaTypeChecker,
        schemaDeriveTypeQueue,
        schemaResult,
        typeLocalSymbol,
        typeSourceSymbol,
        typeSourceDeclaration,
      });
    schemaResult.schemaTypes[derivedOperationSchemaType.typeName] =
      derivedOperationSchemaType;
  }
  return schemaResult;
}

export type DeriveSchemaTypeOperation =
  | DeriveDataModelOperation
  | DeriveConcreteTemplateModelOperation
  | DeriveGenericTemplateModelOperation
  | DeriveAliasOperation;

interface DeriveDataModelOperation
  extends __DeriveSchemaTypeOperation<typeof deriveDataModelType> {}

interface DeriveConcreteTemplateModelOperation
  extends __DeriveSchemaTypeOperation<typeof deriveConcreteTemplateModelType> {}

interface DeriveGenericTemplateModelOperation
  extends __DeriveSchemaTypeOperation<typeof deriveGenericTemplateModelType> {}

interface DeriveAliasOperation
  extends __DeriveSchemaTypeOperation<typeof deriveAliasType> {}

interface __DeriveSchemaTypeOperation<
  ThisDeriveSchemaType extends
    | typeof deriveDataModelType
    | typeof deriveConcreteTemplateModelType
    | typeof deriveGenericTemplateModelType
    | typeof deriveAliasType,
> {
  operationDeriveSchemaType: ThisDeriveSchemaType;
  operationTypeArguments: Pick<
    Parameters<ThisDeriveSchemaType>[0],
    'typeLocalSymbol' | 'typeSourceSymbol' | 'typeSourceDeclaration'
  >;
}

type DeriveOperationSchemaType = (
  api: DeriveOperationSchemaTypeApi,
) => IntermediateSchemaType;

interface DeriveOperationSchemaTypeApi extends
  Pick<
    Parameters<DeriveSchemaTypeOperation['operationDeriveSchemaType']>[0],
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'schemaResult'
    | 'typeLocalSymbol'
    | 'typeSourceSymbol'
    | 'typeSourceDeclaration'
  > {}
