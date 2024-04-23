import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { isPropertySymbol } from '../helpers/typeguards.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';
import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveModelPropertiesApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind>,
    | 'elementCases'
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelSymbol'
  > // | 'astContext'
{}

export function deriveModelProperties<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: DeriveModelPropertiesApi<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind>['modelProperties'] {
  const {
    modelSymbol,
    schemaTypeChecker,
    schemaResult,
    elementCases,
    // astContext,
  } = api;
  const typeProperties = (modelSymbol.members &&
    Array.from(modelSymbol.members.values()).filter(
      isPropertySymbol,
    )) ??
    [];
  return typeProperties.reduce<
    GetThisIntermediateModel<ThisTargetModelKind>['modelProperties']
  >(
    (modelPropertiesResult, someTypeProperty) => {
      const propertyKey = someTypeProperty.name;
      modelPropertiesResult[propertyKey] = {
        propertyKey,
        propertyElement: deriveSchemaElement({
          elementCases,
          schemaTypeChecker,
          schemaResult,
          elementNode: someTypeProperty.valueDeclaration &&
              Typescript.isPropertySignature(
                someTypeProperty.valueDeclaration,
              ) && someTypeProperty.valueDeclaration.type ||
            throwInvalidPathError('propertyElementNode'),
          // astContext: [
          //   ...astContext,
          //   {
          //     astNodeKind: 'propertyElement',
          //     astNodeTypeNode: propertySourceTypeNode,
          //     propertyKey,
          //   },
          // ],
        }),
      };
      return modelPropertiesResult;
    },
    {},
  );
}
