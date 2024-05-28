import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';

export interface ResolveElementSourceDeclarationApi
  extends __Data__ResolveSourceDeclarationApi<Typescript.EntityName> {}

export function resolveElementSourceDeclaration(
  api: ResolveElementSourceDeclarationApi,
) {
  const { schemaTypeChecker, localNode } = api;
  return __resolveSourceDeclaration({
    schemaTypeChecker,
    localNode,
  });
}

export interface ResolveHeritageSourceDeclarationApi
  extends __Data__ResolveSourceDeclarationApi<Typescript.LeftHandSideExpression> {}

export function resolveHeritageSourceDeclaration(
  api: ResolveHeritageSourceDeclarationApi,
): [Typescript.Symbol, Typescript.Symbol, Typescript.InterfaceDeclaration] {
  const { schemaTypeChecker, localNode } = api;
  const [heritageLocalSymbol, heritageSourceSymbol, heritageSourceDeclaration] =
    __resolveSourceDeclaration({
      schemaTypeChecker,
      localNode,
    });
  return [
    heritageLocalSymbol,
    heritageSourceSymbol,
    Typescript.isInterfaceDeclaration(heritageSourceDeclaration) &&
      heritageSourceDeclaration ||
    throwInvalidPathError('heritageSourceDeclaration'),
  ];
}

interface __ResolveSourceDeclarationApi<ThisLocalNode extends Typescript.Node>
  extends __Data__ResolveSourceDeclarationApi<ThisLocalNode> {}

interface __Data__ResolveSourceDeclarationApi<
  ThisLocalNode extends Typescript.Node,
> extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  localNode: ThisLocalNode;
}

function __resolveSourceDeclaration<ThisLocalNode extends Typescript.Node>(
  api: __ResolveSourceDeclarationApi<ThisLocalNode>,
): [
  Typescript.Symbol,
  Typescript.Symbol,
  Typescript.Declaration,
] {
  const { localNode, schemaTypeChecker } = api;
  const localSymbol = schemaTypeChecker.getSymbolAtLocation(localNode) ??
    throwInvalidPathError('localSymbol');
  const localDeclaration = localSymbol.declarations &&
      localSymbol.declarations[0] ||
    throwInvalidPathError('localDeclaration');
  const sourceSymbol = Typescript.isImportSpecifier(localDeclaration)
    ? schemaTypeChecker.getAliasedSymbol(localSymbol)
    : localSymbol;
  const sourceDeclaration =
    sourceSymbol.declarations && sourceSymbol.declarations[0] ||
    throwInvalidPathError('sourceDeclaration');
  return [localSymbol, sourceSymbol, sourceDeclaration];
}
