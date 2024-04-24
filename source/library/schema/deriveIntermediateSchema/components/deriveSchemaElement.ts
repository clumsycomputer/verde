import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GetThisIntermediateElement,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { throwInvalidSchemaElement } from '../helpers/errors.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';

export interface DeriveSchemaElementApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
  ThisElementNode extends Typescript.Node,
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind>,
    | 'elementCases'
    | 'schemaTypeChecker'
    | 'schemaResult'
  > // | 'astContext'
{
  elementLocalNode: ThisElementNode;
}

export function deriveSchemaElement<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: DeriveSchemaElementApi<ThisTargetModelKind, Typescript.Node>,
): GetThisIntermediateElement<ThisTargetModelKind> {
  const {
    elementCases,
    elementLocalNode,
    schemaTypeChecker,
    schemaResult,
    // astContext,
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
  for (const handleSomeElementCase of elementCases) {
    const maybeSchemaElement = handleSomeElementCase({
      elementCases,
      schemaTypeChecker,
      schemaResult,
      elementLocalNode,
      elementSourceDeclaration,
      // astContext
    });
    if (maybeSchemaElement) {
      return maybeSchemaElement;
    }
  }
  throwInvalidSchemaElement({
    schemaTypeChecker,
    // astContext,
  });
}
