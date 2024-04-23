import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { irrelevantAny } from '../../../../helpers/types.ts';
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
  elementNode: ThisElementNode;
}

export function deriveSchemaElement<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: DeriveSchemaElementApi<ThisTargetModelKind, Typescript.Node>,
): GetThisIntermediateElement<ThisTargetModelKind> {
  const {
    elementCases,
    elementNode,
    schemaTypeChecker,
    schemaResult,
    // astContext,
  } = api;
  const localElementSymbol = schemaTypeChecker.getSymbolAtLocation(
    Typescript.isTypeReferenceNode(elementNode)
      ? elementNode.typeName
      : elementNode,
  ) ?? null;
  const localElementSymbolDeclaration = localElementSymbol
    ? localElementSymbol.declarations && localElementSymbol.declarations[0] ||
      throwInvalidPathError('localElementSymbolDeclaration')
    : null;
  const sourceElementSymbol =
    localElementSymbol && localElementSymbolDeclaration &&
      Typescript.isImportSpecifier(localElementSymbolDeclaration)
      ? schemaTypeChecker.getAliasedSymbol(localElementSymbol)
      : localElementSymbol;
  const targetElementCase = elementCases.find((someElementCase) =>
    someElementCase.assertCase(elementNode, sourceElementSymbol)
  );
  return targetElementCase
    ? targetElementCase.handleCase({
      elementCases,
      schemaTypeChecker,
      schemaResult,
      elementNode,
      elementSymbol: sourceElementSymbol,
      // astContext,
    })
    : throwInvalidSchemaElement({
      schemaTypeChecker,
      // astContext,
    });
}
