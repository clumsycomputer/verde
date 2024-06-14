import { LoadSchemaModuleResult } from '../loadSchemaModule/loadSchemaModule.ts';
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

export interface DeriveIntermediateSchemaApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'schemaExportNode'
  > {}

export function deriveIntermediateSchema(
  api: DeriveIntermediateSchemaApi,
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
      operationDeriveSchemaType: deriveSchemaType,
      operationTypeArguments: {
        typeLocalSymbol,
        typeSourceSymbol,
        typeSourceDeclaration,
      },
    } of schemaDeriveTypeQueue
  ) {
    const derivedSchemaType = (deriveSchemaType as DeriveSchemaType)({
      schemaTypeChecker,
      schemaDeriveTypeQueue,
      schemaResult,
      typeLocalSymbol,
      typeSourceSymbol,
      typeSourceDeclaration,
    });
    schemaResult.schemaTypes[derivedSchemaType.typeName] = derivedSchemaType;
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

type DeriveSchemaType = (
  api: DeriveSchemaTypeApi,
) => IntermediateSchemaType;

interface DeriveSchemaTypeApi extends
  Pick<
    Parameters<DeriveSchemaTypeOperation['operationDeriveSchemaType']>[0],
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'schemaResult'
    | 'typeLocalSymbol'
    | 'typeSourceSymbol'
    | 'typeSourceDeclaration'
  > {}
