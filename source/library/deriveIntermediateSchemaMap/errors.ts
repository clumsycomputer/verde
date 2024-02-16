import { throwUserError } from '../../helpers/throwError.ts';
import { irrelevantAny } from '../../helpers/types.ts';
import { Typescript } from '../../imports/Typescript.ts';
import {
  DeriveModelElementApi,
  DeriveModelTemplatesApi,
  DeriveSchemaMapApi,
} from './deriveIntermediateSchemaMap.ts';

export interface ThrowSchemaExportNotTuple extends
  Pick<
    DeriveSchemaMapApi,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportType'
  > {}

export function throwSchemaExportNotTuple(
  api: ThrowSchemaExportNotTuple,
): never {
  const { lhsSchemaExportSymbol, schemaTypeChecker, rhsSchemaExportType } = api;
  throwUserError(
    `${lhsSchemaExportSymbol.name}: ${
      schemaTypeChecker.typeToString(rhsSchemaExportType)
    } is not a tuple`,
  );
}

export interface ThrowInvalidTopLevelModelApi extends
  Pick<
    DeriveSchemaMapApi,
    'schemaTypeChecker'
  > {
  someTopLevelDataModelType: Typescript.Type;
}

export function throwInvalidTopLevelModel(
  api: ThrowInvalidTopLevelModelApi,
): never {
  const { schemaTypeChecker, someTopLevelDataModelType } = api;
  throwUserError(
    `invalid top-level model: ${
      schemaTypeChecker.typeToString(someTopLevelDataModelType)
    }`,
  );
}

export interface ThrowInvalidModelTemplateApi extends
  Pick<
    DeriveModelTemplatesApi<irrelevantAny, Typescript.Type>,
    'schemaTypeChecker' | 'someModelType'
  > {
  someModelTemplateType: Typescript.BaseType;
}

export function throwInvalidModelTemplate(
  api: ThrowInvalidModelTemplateApi,
): never {
  const { schemaTypeChecker, someModelTemplateType, someModelType } = api;
  throwUserError(
    `invalid model template: ${
      schemaTypeChecker.typeToString(someModelTemplateType)
    } on ${someModelType.symbol.name}`,
  );
}

export interface ThrowInvalidModelElementApi
  extends
    Pick<
      DeriveModelElementApi<irrelevantAny>,
      'schemaTypeChecker' | 'typeContext'
    > {}

export function throwInvalidModelElement(
  api: ThrowInvalidModelElementApi,
): never {
  const {} = api
  throwUserError(`invalid model element: TODO`);
}
