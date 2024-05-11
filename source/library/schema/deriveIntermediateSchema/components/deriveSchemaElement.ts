import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import { throwInvalidSchemaElement } from '../helpers/errors.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';
import { ElementCase, GetCaseSchemaElement } from './__getElementCases.ts';

export interface DeriveSchemaElementApi<
  ThisElementCase extends ElementCase<genericAny>
> extends
  Pick<
    __DeriveIntermediateModelApi<irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaResult'
  >
{
  elementCases: Array<ThisElementCase>;
  elementLocalNode: Typescript.Node;
}

export function deriveSchemaElement<
  ThisElementCase extends ElementCase<genericAny>,
>(
  api: DeriveSchemaElementApi<ThisElementCase>,
): GetCaseSchemaElement<ThisElementCase> {
  const {
    elementCases,
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
  for (const handleSomeElementCase of elementCases) {
    const maybeSchemaElement = handleSomeElementCase({
      schemaTypeChecker,
      schemaResult,
      elementLocalNode,
      elementSourceDeclaration,
    });
    if (maybeSchemaElement) {
      return maybeSchemaElement;
    }
  }
  throwInvalidSchemaElement({
    schemaTypeChecker,
    elementLocalNode
  });
}
