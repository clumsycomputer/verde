import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GenericModelTemplate,
  GetThisIntermediateElement,
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import {
  __DeriveIntermediateModelApi,
  deriveConcreteTemplateModel,
  deriveGenericTemplateModel,
} from './__deriveIntermediateModel.ts';
import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveModelTemplatesApi<ThisTargetModelKind extends keyof IntermediateSchema['schemaModels']> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind>,
    | 'elementCases'
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelDeclaration'
  > {}

export function deriveModelTemplates<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: DeriveModelTemplatesApi<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind>['modelTemplates'] {
  const { modelDeclaration, schemaTypeChecker, schemaResult, elementCases } =
    api;
  return modelDeclaration.heritageClauses && modelDeclaration.heritageClauses[0]
    ? modelDeclaration.heritageClauses[0].types.map<
      GetThisIntermediateModel<ThisTargetModelKind>['modelTemplates'][number]
    >(
      (someHeritageLocalNode) => {
        const heritageLocalSymbol = schemaTypeChecker.getSymbolAtLocation(
          someHeritageLocalNode.expression,
        ) ??
          throwInvalidPathError('heritageLocalSymbol');
        const heritageLocalDeclaration = heritageLocalSymbol.declarations &&
            heritageLocalSymbol.declarations[0] ||
          throwInvalidPathError('heritageLocalDeclaration');
        const heritageSourceSymbol =
          Typescript.isImportSpecifier(heritageLocalDeclaration)
            ? schemaTypeChecker.getAliasedSymbol(heritageLocalSymbol)
            : heritageLocalSymbol;
        const heritageSourceDeclaration = heritageSourceSymbol.declarations &&
            heritageSourceSymbol.declarations[0] &&
            Typescript.isInterfaceDeclaration(
              heritageSourceSymbol.declarations[0],
            ) && heritageSourceSymbol.declarations[0] ||
          throwInvalidPathError('heritageSourceDeclaration');
        if (heritageSourceDeclaration.typeParameters) {
          const heritageGenericTemplateModel = deriveGenericTemplateModel({
            schemaTypeChecker,
            schemaResult,
            modelDeclaration: heritageSourceDeclaration,
          });
          return {
            templateKind: 'genericTemplate',
            templateModelNameKey: heritageGenericTemplateModel.modelName,
            templateArguments: heritageGenericTemplateModel.modelParameters
              .reduce<
                GenericModelTemplate<
                  GetThisIntermediateElement<ThisTargetModelKind>
                >['templateArguments']
              >(
                (
                  genericArgumentsResult,
                  someModelParameter,
                  argumentIndex,
                ) => {
                  const argumentParameterNameKey =
                    someModelParameter.parameterName;
                  genericArgumentsResult[argumentParameterNameKey] = {
                    argumentIndex,
                    argumentParameterNameKey,
                    argumentElement: deriveSchemaElement({
                      elementCases,
                      schemaTypeChecker,
                      schemaResult,
                      elementLocalNode: someHeritageLocalNode.typeArguments &&
                          someHeritageLocalNode.typeArguments[argumentIndex] ||
                        throwInvalidPathError('argumentElementNode'),
                    }),
                  };
                  return genericArgumentsResult;
                },
                {},
              ),
          };
        } else {
          const heritageConcreteTemplateModel = deriveConcreteTemplateModel({
            schemaTypeChecker,
            schemaResult,
            modelDeclaration: heritageSourceDeclaration,
          });
          return {
            templateKind: 'concreteTemplate',
            templateModelNameKey: heritageConcreteTemplateModel.modelName,
          };
        }
      },
    )
    : [];
}
