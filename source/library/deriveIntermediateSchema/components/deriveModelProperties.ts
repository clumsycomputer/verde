import { Typescript } from '../../../imports/Typescript.ts';
import { GetThisIntermediateModel, IntermediateSchema } from '../../types/IntermediateSchema.ts';
import { isPropertySymbol } from '../helpers/typeguards.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';
import { deriveModelElement } from './deriveModelElement.ts';

export interface DeriveModelPropertiesApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
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
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
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
  return typeProperties.reduce<GetThisIntermediateModel<ThisTargetModelKind>['modelProperties']>(
    (modelPropertiesResult, someTypeProperty) => {
      const propertyKey = someTypeProperty.name;
      const somePropertyElementType = schemaTypeChecker.getTypeOfSymbol(
        someTypeProperty,
      );
      modelPropertiesResult[propertyKey] = {
        propertyKey,
        propertyElement: deriveModelElement({
          schemaTypeChecker,
          schemaResult,
          elementTypeCases,
          someElementType: somePropertyElementType,
          typeContext: [
            ...typeContext,
            {
              infoKind: 'element',
              elementKind: 'property',
              propertyKey,
              infoType: somePropertyElementType,
            },
          ],
        }),
      };
      return modelPropertiesResult;
    },
    {},
  );
}
