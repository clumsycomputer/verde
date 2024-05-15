import { Typescript } from '../../../../imports/Typescript.ts';
import { IntermediateSchema, IntermediateSchemaAlias } from '../../types/IntermediateSchema.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';
import { getDefinitiveElementResolvers } from './__getElementResolvers.ts';
import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveIntermediateAliasApi
  extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaResult: IntermediateSchema;
  aliasSourceDeclaration: Typescript.TypeAliasDeclaration;
}

export function deriveIntermediateAlias(api: DeriveIntermediateAliasApi): IntermediateSchemaAlias {
  const { aliasSourceDeclaration, schemaResult, schemaTypeChecker } = api;
  const aliasName = aliasSourceDeclaration.name.text;
  const newSchemaAlias: IntermediateSchemaAlias = {
    aliasKind: 'general',
    aliasName: aliasName,
    aliasElement: deriveSchemaElement({
      schemaTypeChecker,
      schemaResult,
      elementLocalNode: aliasSourceDeclaration.type,
      elementResolvers: getDefinitiveElementResolvers(),
    }),
  };
  schemaResult.schemaAliases[aliasName] = newSchemaAlias
  return newSchemaAlias
}
