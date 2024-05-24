import {
  throwInvalidPathError
} from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GenericModelTemplate,
  IntermediateSchemaModel,
} from '../../types/IntermediateSchema.ts';
import { throwInvalidModelTemplate__DefaultParameterArgument } from '../errors.ts';
import {
  Data__DeriveNewThisSchemaTypeApi__DeriveModelType,
  deriveConcreteTemplateModelType,
  deriveGenericTemplateModelType,
} from './__deriveIntermediateSchemaType.ts';
import { ElementResolver } from './__getElementResolvers.ts';
import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveModelTemplatesApi<
  ThisSchemaType extends IntermediateSchemaModel,
> extends
  Config__DeriveModelTemplatesApi<ThisSchemaType>,
  Data__DeriveModelTemplatesApi {}

interface Config__DeriveModelTemplatesApi<
  ThisSchemaType extends IntermediateSchemaModel,
> {
  thisModelElementResolvers: Array<
    ElementResolver<
      ThisSchemaType['typeModelProperties'][string]['propertyElement']
    >
  >;
}

interface Data__DeriveModelTemplatesApi extends
  Pick<
    Data__DeriveNewThisSchemaTypeApi__DeriveModelType,
    'schemaTypeChecker' | 'deriveSchemaTypeQueue' | 'typeSourceDeclaration'
  > {}

export function deriveModelTemplates<
  ThisSchemaType extends IntermediateSchemaModel,
>(
  api: DeriveModelTemplatesApi<ThisSchemaType>,
): ThisSchemaType['typeModelTemplates'] {
  const {
    typeSourceDeclaration,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    thisModelElementResolvers,
  } = api;
  return typeSourceDeclaration.heritageClauses &&
      typeSourceDeclaration.heritageClauses[0]
    ? typeSourceDeclaration.heritageClauses[0].types.map<
      ThisSchemaType['typeModelTemplates'][number]
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
          deriveSchemaTypeQueue.push({
            deriveThisSchemaType: deriveGenericTemplateModelType,
            thisTypeArguments: {
              typeLocalSymbol: heritageLocalSymbol,
              typeSourceSymbol: heritageSourceSymbol,
              typeSourceDeclaration: heritageSourceDeclaration,
            },
          });
          return {
            templateModelKind: 'genericTemplateModel',
            templateModelName: heritageSourceDeclaration.name.text,
            templateArguments: heritageSourceDeclaration.typeParameters
              .reduce<
                GenericModelTemplate<
                  ThisSchemaType['typeModelProperties'][string][
                    'propertyElement'
                  ]
                >['templateArguments']
              >(
                (
                  genericArgumentsResult,
                  someTypeParameterDeclaration,
                  parameterIndex,
                ) => {
                  const argumentParameterName =
                    someTypeParameterDeclaration.name.text;
                  genericArgumentsResult[argumentParameterName] = {
                    argumentParameterName,
                    argumentIndex: parameterIndex,
                    argumentElement: deriveSchemaElement({
                      schemaTypeChecker,
                      deriveSchemaTypeQueue,
                      elementResolvers: thisModelElementResolvers,
                      elementLocalNode: someHeritageLocalNode.typeArguments &&
                          someHeritageLocalNode.typeArguments[parameterIndex] ||
                        throwInvalidModelTemplate__DefaultParameterArgument({
                          typeSourceDeclaration,
                          heritageLocalNode: someHeritageLocalNode,
                        }),
                    }),
                  };
                  return genericArgumentsResult;
                },
                {},
              ),
          };
        } else {
          deriveSchemaTypeQueue.push({
            deriveThisSchemaType: deriveConcreteTemplateModelType,
            thisTypeArguments: {
              typeLocalSymbol: heritageLocalSymbol,
              typeSourceSymbol: heritageSourceSymbol,
              typeSourceDeclaration: heritageSourceDeclaration,
            },
          });
          return {
            templateModelKind: 'concreteTemplateModel',
            templateModelName: heritageSourceDeclaration.name.text,
          };
        }
      },
    )
    : [];
}
