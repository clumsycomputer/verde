import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';
import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveModelPropertiesApi<ThisTargetModelKind extends keyof IntermediateSchema['schemaModels']> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind>,    
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelSourceDeclaration'
    | 'targetModelElementResolvers'
  >
{}

export function deriveModelProperties<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels']
>(
  api: DeriveModelPropertiesApi<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind>['modelProperties'] {
  const {
    modelSourceDeclaration,
    schemaTypeChecker,
    schemaResult,
    targetModelElementResolvers,
  } = api;
  return modelSourceDeclaration.members.reduce<
    GetThisIntermediateModel<ThisTargetModelKind>['modelProperties']
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
            schemaResult,
            elementResolvers: targetModelElementResolvers,
            elementLocalNode: somePropertyNode.type,
          }),
        };
      }
      return modelPropertiesResult;
    },
    {},
  );
}
