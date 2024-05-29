import { IntermediateSchema } from '../types/IntermediateSchema.ts';
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
  const schemaDeriveTypeQueue: Array<SchemaDeriveTypeQueueOperation> = [];
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
      deriveThisSchemaType,
      thisTypeArguments: {
        typeLocalSymbol,
        typeSourceSymbol,
        typeSourceDeclaration,
      },
    } of schemaDeriveTypeQueue
  ) {
    const derivedSchemaType = (deriveThisSchemaType as any)({
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

export type SchemaDeriveTypeQueueOperation =
  | DeriveDataModelQueueOperation
  | DeriveConcreteTemplateModelQueueOperation
  | DeriveGenericTemplateModelQueueOperation
  | DeriveAliasQueueOperation;

interface DeriveDataModelQueueOperation
  extends __SchemaDeriveTypeQueueOperation<typeof deriveDataModelType> {}

interface DeriveConcreteTemplateModelQueueOperation
  extends
    __SchemaDeriveTypeQueueOperation<typeof deriveConcreteTemplateModelType> {}

interface DeriveGenericTemplateModelQueueOperation
  extends
    __SchemaDeriveTypeQueueOperation<typeof deriveGenericTemplateModelType> {}

interface DeriveAliasQueueOperation
  extends __SchemaDeriveTypeQueueOperation<typeof deriveAliasType> {}

interface __SchemaDeriveTypeQueueOperation<
  DeriveThisSchemaType extends
    | typeof deriveDataModelType
    | typeof deriveConcreteTemplateModelType
    | typeof deriveGenericTemplateModelType
    | typeof deriveAliasType,
> {
  deriveThisSchemaType: DeriveThisSchemaType;
  thisTypeArguments: Pick<
    Parameters<DeriveThisSchemaType>[0],
    'typeLocalSymbol' | 'typeSourceSymbol' | 'typeSourceDeclaration'
  >;
}
