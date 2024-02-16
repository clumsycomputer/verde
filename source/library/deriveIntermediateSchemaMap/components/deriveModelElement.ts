import { irrelevantAny } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { IntermediateSchemaModel } from '../../types/IntermediateSchemaMap.ts';
import { throwInvalidModelElement } from '../helpers/errors.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';

export interface DeriveModelElementApi<
  ThisResultModel extends IntermediateSchemaModel,
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisResultModel, irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'typeContext'
    | 'elementTypeCases'
  > {
  someElementType: Typescript.Type;
}

export function deriveModelElement<ThisResultModel extends IntermediateSchemaModel>(
  api: DeriveModelElementApi<ThisResultModel>,
): GetThisModelElement<ThisResultModel> {
  const {
    elementTypeCases,
    someElementType,
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
  } = api;
  const targetElementTypeCase = elementTypeCases.find((someElementTypeCase) =>
    someElementTypeCase.assertCase(someElementType)
  );
  return targetElementTypeCase
    ? targetElementTypeCase.handleCase({
      someElementType,
      schemaTypeChecker,
      schemaMapResult,
    })
    : throwInvalidModelElement({
      schemaTypeChecker,
      typeContext,
    });
}

export type GetThisModelElement<ThisResultModel extends IntermediateSchemaModel> =
  ThisResultModel['modelProperties'][string]['propertyElement'];