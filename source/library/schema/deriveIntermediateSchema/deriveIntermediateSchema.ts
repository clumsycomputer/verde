import { IntermediateSchema } from '../types/IntermediateSchema.ts';
import {
  __DeriveSchemaTypeApi,
  deriveAliasType,
  deriveConcreteTemplateModelType,
  deriveDataModelType,
  deriveGenericTemplateModelType,
} from './components/__deriveIntermediateSchemaType.ts';
import { EXPORT_ELEMENT_RESOLVERS } from './components/__getElementResolvers.ts';
import { deriveSchemaElement } from './components/deriveSchemaElement.ts';
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
  const deriveSchemaTypeQueue: Array<DeriveSchemaTypeQueueOperation> = [];
  const schemaResult: IntermediateSchema = {
    schemaTypes: {},
    schemaExport: {
      exportName: schemaExportNode.name.text,
      exportElement: deriveSchemaElement({
        schemaTypeChecker,
        deriveSchemaTypeQueue,
        elementLocalNode: schemaExportNode.type,
        elementResolvers: EXPORT_ELEMENT_RESOLVERS,
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
    } of deriveSchemaTypeQueue
  ) {
    const derivedSchemaType = deriveThisSchemaType({
      schemaTypeChecker,
      deriveSchemaTypeQueue,
      schemaResult,      
      typeLocalSymbol,
      typeSourceSymbol,
      typeSourceDeclaration,
    } as any);
    schemaResult.schemaTypes[derivedSchemaType.typeName] = derivedSchemaType;
  }
  return schemaResult;
}

export type DeriveSchemaTypeQueueOperation =
  | DeriveDataModelQueueOperation
  | DeriveConcreteTemplateModelQueueOperation
  | DeriveGenericTemplateModelQueueOperation
  | DeriveAliasQueueOperation;

interface DeriveDataModelQueueOperation
  extends __DeriveSchemaTypeQueueOperation<typeof deriveDataModelType> {}

interface DeriveConcreteTemplateModelQueueOperation
  extends
    __DeriveSchemaTypeQueueOperation<typeof deriveConcreteTemplateModelType> {}

interface DeriveGenericTemplateModelQueueOperation
  extends
    __DeriveSchemaTypeQueueOperation<typeof deriveGenericTemplateModelType> {}

interface DeriveAliasQueueOperation
  extends __DeriveSchemaTypeQueueOperation<typeof deriveAliasType> {}

interface __DeriveSchemaTypeQueueOperation<
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
