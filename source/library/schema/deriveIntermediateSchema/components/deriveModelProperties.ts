import { Typescript } from '../../../../imports/Typescript.ts';
import { IntermediateSchemaModel } from '../../types/IntermediateSchema.ts';
import { Data__DeriveNewThisSchemaTypeApi__DeriveModelType } from './__deriveIntermediateSchemaType.ts';
import { ElementResolver } from './__getElementResolvers.ts';

import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveModelPropertiesApi<
  ThisSchemaType extends IntermediateSchemaModel,
> extends
  Config__DeriveModelPropertiesApi<ThisSchemaType>,
  Data__DeriveModelPropertiesApi {}

interface Config__DeriveModelPropertiesApi<
  ThisSchemaType extends IntermediateSchemaModel,
> {
  thisModelElementResolvers: Array<
    ElementResolver<
      ThisSchemaType['typeModelProperties'][string]['propertyElement']
    >
  >;
}

interface Data__DeriveModelPropertiesApi extends
  Pick<
    Data__DeriveNewThisSchemaTypeApi__DeriveModelType,
    'schemaTypeChecker' | 'deriveSchemaTypeQueue' | 'typeSourceDeclaration'
  > {}

export function deriveModelProperties<
  ThisSchemaType extends IntermediateSchemaModel,
>(
  api: DeriveModelPropertiesApi<ThisSchemaType>,
): ThisSchemaType['typeModelProperties'] {
  const {
    typeSourceDeclaration,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    thisModelElementResolvers,
  } = api;
  return typeSourceDeclaration.members.reduce<
    ThisSchemaType['typeModelProperties']
  >(
    (modelPropertiesResult, somePropertyNode) => {
      if (
        Typescript.isPropertySignature(somePropertyNode) &&
        Typescript.isIdentifier(somePropertyNode.name) &&
        somePropertyNode.type
      ) {
        const propertyKey = somePropertyNode.name.text;
        modelPropertiesResult[propertyKey] = {
          propertyKey,
          propertyElement: deriveSchemaElement({
            schemaTypeChecker,
            deriveSchemaTypeQueue,
            elementResolvers: thisModelElementResolvers,
            elementLocalNode: somePropertyNode.type,
          }),
        };
      }
      return modelPropertiesResult;
    },
    {},
  );
}
