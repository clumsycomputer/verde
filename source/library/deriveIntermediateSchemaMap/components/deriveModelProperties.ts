import { Typescript } from '../../../imports/Typescript.ts';
import { IntermediateSchemaModel } from '../../types/IntermediateSchemaMap.ts';
import { isPropertySymbol } from '../helpers/typeguards.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';
import { deriveModelElement } from './deriveModelElement.ts';

export interface DeriveModelPropertiesApi<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisResultModel,
      ThisModelType
    >,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'typeContext'
    | 'elementTypeCases'
    | 'someModelType'
  > {}

export function deriveModelProperties<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
>(
  api: DeriveModelPropertiesApi<
    ThisResultModel,
    ThisModelType
  >,
): ThisResultModel['modelProperties'] {
  const {
    someModelType,
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
    elementTypeCases,
  } = api;
  const typeProperties = (someModelType.symbol.members &&
    Array.from(someModelType.symbol.members.values()).filter(
      isPropertySymbol,
    )) ??
    [];
  return typeProperties.reduce<ThisResultModel['modelProperties']>(
    (modelPropertiesResult, someTypeProperty) => {
      const propertyKey = someTypeProperty.name;
      const somePropertyElementType = schemaTypeChecker.getTypeOfSymbol(
        someTypeProperty,
      );
      modelPropertiesResult[propertyKey] = {
        propertyKey,
        propertyElement: deriveModelElement({
          schemaTypeChecker,
          schemaMapResult,
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
