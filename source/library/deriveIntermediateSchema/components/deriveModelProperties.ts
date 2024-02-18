import { Typescript } from '../../../imports/Typescript.ts';
import { IntermediateSchema } from '../../types/IntermediateSchema.ts';
import { isPropertySymbol } from '../helpers/typeguards.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';
import { deriveModelElement } from './deriveModelElement.ts';

export interface DeriveModelPropertiesApi<
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisTargetKind,
      ThisModelType
    >,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'typeContext'
    | 'elementTypeCases'
    | 'someModelType'
  > {}

export function deriveModelProperties<
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
>(
  api: DeriveModelPropertiesApi<
    ThisTargetKind,
    ThisModelType
  >,
): IntermediateSchema['schemaMap'][ThisTargetKind][string]['modelProperties'] {
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
  return typeProperties.reduce<IntermediateSchema['schemaMap'][ThisTargetKind][string]['modelProperties'] >(
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
