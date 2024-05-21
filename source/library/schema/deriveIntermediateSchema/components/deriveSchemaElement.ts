import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { genericAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import { IntermediateSchema } from '../../types/IntermediateSchema.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';
import { throwInvalidSchemaElement } from '../helpers/errors.ts';
import {
  ElementResolver,
  GetResolverSchemaElement,
} from './__getElementResolvers.ts';

export interface DeriveSchemaElementApi<
  ThisElementResolver extends ElementResolver<genericAny>,
> extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaResult: IntermediateSchema;
  elementResolvers: Array<ThisElementResolver>;
  elementLocalNode: Typescript.Node;
}

export function deriveSchemaElement<
  ThisElementResolver extends ElementResolver<genericAny>,
>(
  api: DeriveSchemaElementApi<ThisElementResolver>,
): GetResolverSchemaElement<ThisElementResolver> {
  const {
    elementResolvers,
    elementLocalNode,
    schemaTypeChecker,
    schemaResult,
  } = api;
  const elementLocalSymbol = Typescript.isTypeReferenceNode(elementLocalNode)
    ? schemaTypeChecker.getSymbolAtLocation(elementLocalNode.typeName) ??
      throwInvalidPathError('elementLocalSymbol')
    : null;
  const elementLocalDeclaration = elementLocalSymbol
    ? elementLocalSymbol.declarations && elementLocalSymbol.declarations[0] ||
      throwInvalidPathError('elementLocalDeclaration')
    : null;
  const elementSourceSymbol = elementLocalSymbol && elementLocalDeclaration &&
      Typescript.isImportSpecifier(elementLocalDeclaration)
    ? schemaTypeChecker.getAliasedSymbol(elementLocalSymbol)
    : elementLocalSymbol;
  const elementSourceDeclaration = elementSourceSymbol
    ? elementSourceSymbol.declarations && elementSourceSymbol.declarations[0] ||
      throwInvalidPathError('elementSourceDeclaration')
    : null;
  for (const maybeResolveSomeElement of elementResolvers) {
    const maybeSchemaElement = maybeResolveSomeElement({
      schemaTypeChecker,
      schemaResult,
      elementLocalNode,
      elementLocalSymbol,
      elementSourceSymbol,
      elementSourceDeclaration,
    });
    if (maybeSchemaElement) {
      return maybeSchemaElement;
    }
  }
  throwInvalidSchemaElement({
    schemaTypeChecker,
    elementLocalNode,
  });
}
