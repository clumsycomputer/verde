import { irrelevantAny } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { IntermediateSchema } from '../../types/IntermediateSchema.ts';
import { throwInvalidModelElement } from '../helpers/errors.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';

export interface DeriveModelElementApi<
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetKind, irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'typeContext'
    | 'elementTypeCases'
  > {
  someElementType: Typescript.Type;
}

export function deriveModelElement<ThisTargetKind extends keyof IntermediateSchema['schemaMap']>(
  api: DeriveModelElementApi<ThisTargetKind>,
): IntermediateSchema['schemaMap'][ThisTargetKind][string]['modelProperties'][string]['propertyElement'] {
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

// export type GetThisModelElement<ThisResultModel extends IntermediateSchemaModel> =
//   ThisResultModel['modelProperties'][string]['propertyElement'];