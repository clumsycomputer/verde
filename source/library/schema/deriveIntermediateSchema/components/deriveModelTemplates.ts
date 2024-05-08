import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GenericModelTemplate,
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __SchemaElement } from '../../types/SchemaElement.ts';
import {
  __DeriveIntermediateModelApi,
  deriveConcreteTemplateModel,
  deriveGenericTemplateModel,
} from './__deriveIntermediateModel.ts';
import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveModelTemplatesApi<
  ThisSchemaElement extends __SchemaElement<genericAny>,
> extends
  Pick<
    __DeriveIntermediateModelApi<irrelevantAny, ThisSchemaElement>,
    | 'elementCases'
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelDeclaration'
  > // | 'astContext'
{}

export function deriveModelTemplates<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
  ThisSchemaElement extends __SchemaElement<genericAny>,
>(
  api: DeriveModelTemplatesApi<ThisSchemaElement>,
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
                GenericModelTemplate<ThisSchemaElement>['templateArguments']
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
