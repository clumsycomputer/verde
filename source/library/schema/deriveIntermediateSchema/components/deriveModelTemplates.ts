import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';

export interface DeriveModelTemplatesApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind>,
    | 'elementCases'
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelDeclaration'
  > // | 'astContext'
{}

export function deriveModelTemplates<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: DeriveModelTemplatesApi<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind>['modelTemplates'] {
  const { modelDeclaration, schemaTypeChecker } = api;
  if (modelDeclaration.heritageClauses && modelDeclaration.heritageClauses[0]) {
    modelDeclaration.heritageClauses[0].types.forEach((someHeritageLocalNode) => {
      const heritageLocalSymbol =
        schemaTypeChecker.getSymbolAtLocation(someHeritageLocalNode.expression) ??
          throwInvalidPathError('heritageLocalSymbol');
      const heritageLocalDeclaration = heritageLocalSymbol.declarations &&
          heritageLocalSymbol.declarations[0] ||
        throwInvalidPathError('heritageLocalDeclaration');        
      const heritageSourceSymbol =
        Typescript.isImportSpecifier(heritageLocalDeclaration)
          ? schemaTypeChecker.getAliasedSymbol(heritageLocalSymbol)
          : heritageLocalSymbol;
      const heritageSourceDeclaration = heritageSourceSymbol.declarations &&
          heritageSourceSymbol.declarations[0] ||
        throwInvalidPathError('heritageSourceDeclaration');
      console.log(heritageSourceDeclaration.kind);
      console.log(heritageSourceSymbol.name);
      if (someHeritageLocalNode.typeArguments) {
        // generic
      } else {
        // concrete
      }
    });
  }
  return [];
}
