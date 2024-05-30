import { irrelevantAny } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { IntermediateSchema } from '../types/IntermediateSchema.ts';
import { deriveExportElement } from './components/__deriveSchemaElement/__deriveSchemaElement.ts';
import {
  __DeriveSchemaTypeApi,
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
      operationDeriveSchemaType: deriveSchemaType,
      operationTypeArguments: {
        typeLocalSymbol,
        typeSourceSymbol,
        typeSourceDeclaration,
      },
    } of schemaDeriveTypeQueue
  ) {
    const derivedSchemaType = deriveSchemaType({
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
  ThisDeriveSchemaType extends
    | typeof deriveDataModelType
    | typeof deriveConcreteTemplateModelType
    | typeof deriveGenericTemplateModelType
    | typeof deriveAliasType,
> {
  operationDeriveSchemaType: (
    api: OperationDeriveSchemaTypeApi<ThisDeriveSchemaType>,
  ) => ReturnType<ThisDeriveSchemaType>;
  operationTypeArguments: Pick<
    Parameters<ThisDeriveSchemaType>[0],
    'typeLocalSymbol' | 'typeSourceSymbol' | 'typeSourceDeclaration'
  >;
}

interface OperationDeriveSchemaTypeApi<
  ThisDeriveSchemaType extends
    | typeof deriveDataModelType
    | typeof deriveConcreteTemplateModelType
    | typeof deriveGenericTemplateModelType
    | typeof deriveAliasType,
> extends
  Pick<
    __DeriveSchemaTypeApi<
      ReturnType<ThisDeriveSchemaType>,
      irrelevantAny
    >,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'schemaResult'
    | 'typeLocalSymbol'
    | 'typeSourceSymbol'
  > {
  typeSourceDeclaration:
    | Typescript.TypeAliasDeclaration
    | Typescript.InterfaceDeclaration
    | any;
}
