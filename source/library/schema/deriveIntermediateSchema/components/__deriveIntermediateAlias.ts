import { genericAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  IntermediateSchema,
  IntermediateSchemaAlias,
} from '../../types/IntermediateSchema.ts';
import { DefinitiveSchemaElement } from '../../types/SchemaElement.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';
import {
  ElementResolver,
  exportItemCoreUnionElementResolver,
  getDefinitiveElementResolvers,
} from './__getElementResolvers.ts';
import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveExportItemAliasApi
  extends Defined__DeriveIntermediateAliasApi {}

export function deriveExportItemAlias(api: DeriveElementAliasApi) {
  const { schemaTypeChecker, schemaResult, aliasSourceDeclaration } = api;
  return __deriveIntermediateAlias({
    schemaTypeChecker,
    schemaResult,
    aliasSourceDeclaration,
    memberElementResolvers: [
      exportItemCoreUnionElementResolver,
    ],
  });
}

export interface DeriveElementAliasApi
  extends Defined__DeriveIntermediateAliasApi {}

export function deriveElementAlias(api: DeriveElementAliasApi) {
  const { schemaTypeChecker, schemaResult, aliasSourceDeclaration } = api;
  return __deriveIntermediateAlias({
    schemaTypeChecker,
    schemaResult,
    aliasSourceDeclaration,
    memberElementResolvers: getDefinitiveElementResolvers(),
  });
}

interface __DeriveIntermediateAliasApi<
  ThisElementResolvers extends Array<ElementResolver<genericAny>>,
> extends
  Defined__DeriveIntermediateAliasApi,
  Custom__DeriveIntermediateAliasApi<ThisElementResolvers> {}

interface Defined__DeriveIntermediateAliasApi
  extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaResult: IntermediateSchema;
  aliasSourceDeclaration: Typescript.TypeAliasDeclaration;
}

interface Custom__DeriveIntermediateAliasApi<
  ThisElementResolvers extends Array<ElementResolver<genericAny>>,
> {
  memberElementResolvers: ThisElementResolvers;
}

function __deriveIntermediateAlias<
  ThisElementResolvers extends Array<ElementResolver<genericAny>>,
>(
  api: __DeriveIntermediateAliasApi<ThisElementResolvers>,
): IntermediateSchemaAlias {
  const {
    aliasSourceDeclaration,
    schemaResult,
    schemaTypeChecker,
    memberElementResolvers,
  } = api;
  const aliasName = aliasSourceDeclaration.name.text;
  const maybeCachedAlias = schemaResult.schemaAliases[aliasName];
  if (maybeCachedAlias !== undefined) {
    return maybeCachedAlias;
  }
  const newSchemaAlias: IntermediateSchemaAlias = {
    aliasName: aliasName,
    aliasElement: undefined as unknown as DefinitiveSchemaElement,
  };
  schemaResult.schemaAliases[aliasName] = newSchemaAlias;
  newSchemaAlias.aliasElement = deriveSchemaElement({
    schemaTypeChecker,
    schemaResult,
    elementLocalNode: aliasSourceDeclaration.type,
    elementResolvers: memberElementResolvers,
  });
  return newSchemaAlias;
}
