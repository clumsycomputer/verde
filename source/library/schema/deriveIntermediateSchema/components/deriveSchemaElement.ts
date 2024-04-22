import { irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GetThisIntermediateElement,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { throwInvalidSchemaElement } from '../helpers/errors.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';

export interface DeriveSchemaElementApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind>,
    | 'elementCases'
    | 'schemaTypeChecker'
    | 'schemaResult'
    // | 'astContext'
  > {
  elementNode: Typescript.Node;
}

export function deriveSchemaElement<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: DeriveSchemaElementApi<ThisTargetModelKind>,
): GetThisIntermediateElement<ThisTargetModelKind> {
  const {
    elementCases,
    elementNode,
    schemaTypeChecker,
    schemaResult,
    // astContext,
  } = api;
  const targetElementCase = elementCases.find((someElementCase) =>
    someElementCase.assertCase(elementNode)
  );
  return targetElementCase
    ? targetElementCase.handleCase({
      elementCases,
      schemaTypeChecker,
      schemaResult,
      elementNode,
      // astContext,
    })
    : throwInvalidSchemaElement({
      schemaTypeChecker,
      // astContext,
    });
}
