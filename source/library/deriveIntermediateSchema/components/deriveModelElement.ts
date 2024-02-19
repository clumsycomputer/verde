import { irrelevantAny } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { GetThisIntermediateElement, IntermediateSchema } from '../../types/IntermediateSchema.ts';
import { throwInvalidModelElement } from '../helpers/errors.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';

export interface DeriveModelElementApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind, irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'typeContext'
    | 'elementTypeCases'
  > {
  someElementType: Typescript.Type;
}

export function deriveModelElement<ThisTargetModelKind extends keyof IntermediateSchema['schemaMap']>(
  api: DeriveModelElementApi<ThisTargetModelKind>,
): GetThisIntermediateElement<ThisTargetModelKind> {
  const {
    elementTypeCases,
    someElementType,
    schemaTypeChecker,
    schemaResult,
    typeContext,
  } = api;
  const targetElementTypeCase = elementTypeCases.find((someElementTypeCase) =>
    someElementTypeCase.assertCase(someElementType)
  );
  return targetElementTypeCase
    ? targetElementTypeCase.handleCase({
      someElementType,
      schemaTypeChecker,
      schemaResult,
    })
    : throwInvalidModelElement({
      schemaTypeChecker,
      typeContext,
    });
}