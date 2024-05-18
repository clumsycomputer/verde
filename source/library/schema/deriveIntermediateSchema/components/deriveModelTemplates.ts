import { throwInvalidPathError, throwUserError } from '../../../../helpers/throwError.ts';
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
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelSourceDeclaration'
    | 'targetModelElementResolvers'
  > {}

export function deriveModelTemplates<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: DeriveModelTemplatesApi<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind>['modelTemplates'] {
  const { modelSourceDeclaration, schemaTypeChecker, schemaResult, targetModelElementResolvers } =
    api;
  return modelSourceDeclaration.heritageClauses && modelSourceDeclaration.heritageClauses[0]
    ? modelSourceDeclaration.heritageClauses[0].types.map<
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
            modelSourceDeclaration: heritageSourceDeclaration,
          });
          return {
            templateKind: 'genericTemplate' as const,
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
                      schemaTypeChecker,
                      schemaResult,
                      elementResolvers: targetModelElementResolvers,
                      elementLocalNode: someHeritageLocalNode.typeArguments &&
                          someHeritageLocalNode.typeArguments[argumentIndex] ||
                        throwUserError(`invalid schema model template: default parameter arguments not supported (extends ${someHeritageLocalNode.getText()} on ${modelSourceDeclaration.name.text})`),
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
            modelSourceDeclaration: heritageSourceDeclaration,
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
