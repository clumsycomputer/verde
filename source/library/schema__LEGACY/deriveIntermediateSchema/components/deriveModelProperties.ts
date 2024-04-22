import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { isPropertySymbol } from '../helpers/typeguards.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';
import { deriveModelElement } from './deriveModelElement.ts';

export interface DeriveModelPropertiesApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisTargetModelKind,
      ThisModelType
    >,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'typeContext'
    | 'elementTypeCases'
    | 'someModelType'
  > {}

export function deriveModelProperties<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
  ThisModelType extends Typescript.Type,
>(
  api: DeriveModelPropertiesApi<
    ThisTargetModelKind,
    ThisModelType
  >,
): GetThisIntermediateModel<ThisTargetModelKind>['modelProperties'] {
  const {
    someModelType,
    schemaTypeChecker,
    schemaResult,
    typeContext,
    elementTypeCases,
  } = api;
  const typeProperties = (someModelType.symbol.members &&
    Array.from(someModelType.symbol.members.values()).filter(
      isPropertySymbol,
    )) ??
    [];
  return typeProperties.reduce<
    GetThisIntermediateModel<ThisTargetModelKind>['modelProperties']
  >(
    (modelPropertiesResult, someTypeProperty) => {
      const propertyKey = someTypeProperty.name;
      const propertyElementType = schemaTypeChecker.getTypeOfSymbol(
        someTypeProperty,
      );
      (propertyElementType as any).typeReferenceSymbol =
        someTypeProperty.valueDeclaration &&
          Typescript.isPropertySignature(someTypeProperty.valueDeclaration) &&
          someTypeProperty.valueDeclaration.type &&
          Typescript.isTypeReferenceNode(someTypeProperty.valueDeclaration.type)
          ? schemaTypeChecker.getSymbolAtLocation(
            someTypeProperty.valueDeclaration.type.typeName,
          ) ?? throwInvalidPathError('propertyElementType.symbol')
          : propertyElementType.symbol;
      modelPropertiesResult[propertyKey] = {
        propertyKey,
        propertyElement: deriveModelElement({
          schemaTypeChecker,
          schemaResult,
          elementTypeCases,
          elementType: propertyElementType,
          typeContext: [
            ...typeContext,
            {
              infoKind: 'element',
              elementKind: 'property',
              propertyKey,
              infoType: propertyElementType,
            },
          ],
        }),
      };
      return modelPropertiesResult;
    },
    {},
  );
}
