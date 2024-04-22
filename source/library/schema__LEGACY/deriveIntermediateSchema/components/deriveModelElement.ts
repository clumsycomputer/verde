import { irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import { GetThisIntermediateElement, IntermediateSchema } from '../../types/IntermediateSchema.ts';
import { throwInvalidModelElement } from '../helpers/errors.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';

export interface DeriveModelElementApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind, irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'typeContext'
    | 'elementTypeCases'
  > {
  elementType: Typescript.Type;
}

export function deriveModelElement<ThisTargetModelKind extends keyof IntermediateSchema['schemaModels']>(
  api: DeriveModelElementApi<ThisTargetModelKind>,
): GetThisIntermediateElement<ThisTargetModelKind> {
  const {
    elementTypeCases,
    elementType,
    schemaTypeChecker,
    schemaResult,
    typeContext,
  } = api;
  const targetElementTypeCase = elementTypeCases.find((someElementTypeCase) =>
    someElementTypeCase.assertCase(elementType)
  );
  return targetElementTypeCase
    ? targetElementTypeCase.handleCase({
      elementType,
      schemaTypeChecker,
      schemaResult,
    })
    : throwInvalidModelElement({
      schemaTypeChecker,
      typeContext,
    });
}