import { throwUserError } from '../../../helpers/throwError.ts';
import { irrelevantAny } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { DeriveModelElementApi } from '../components/deriveModelElement.ts';
import { DeriveModelTemplatesApi } from '../components/deriveModelTemplates.ts';
import { LoadSchemaModuleApi } from '../components/loadSchemaModule.ts';
import { DeriveSchemaMapApi } from '../deriveIntermediateSchemaMap.ts';

export interface ThrowInvalidSchemaModuleApi
  extends Pick<LoadSchemaModuleApi, 'schemaModulePath'> {}

export function throwInvalidSchemaModule_PathDoesNotExist(
  api: ThrowInvalidSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(`invalid schema module: "${schemaModulePath}" does not exist`);
}

export function throwInvalidSchemaModule__NoExports(
  api: ThrowInvalidSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: no exports at "${schemaModulePath}"`,
  );
}

export function throwInvalidSchemaModule__MultipleExports(
  api: ThrowInvalidSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: multiple exports at "${schemaModulePath}"`,
  );
}

export function throwInvalidSchemaModule__CodeExport(
  api: ThrowInvalidSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: code export at "${schemaModulePath}"`,
  );
}

export function throwInvalidSchemaModule__NonTypeAliasExport(
  api: ThrowInvalidSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: non type-alias export at "${schemaModulePath}"`,
  );
}

export function throwInvalidSchemaModule__GenericTypeAliasExport(
  api: ThrowInvalidSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: generic type-alias export at "${schemaModulePath}"`,
  );
}

export interface ThrowInvalidSchemaExportApi extends
  Pick<
    DeriveSchemaMapApi,
    'schemaTypeChecker' | 'rhsSchemaExportType'
  > {}

export function throwInvalidSchemaExport__NotTuple(
  api: ThrowInvalidSchemaExportApi,
): never {
  const { schemaTypeChecker, rhsSchemaExportType } = api;
  throwUserError(
    `invalid schema export: "${
      schemaTypeChecker.typeToString(rhsSchemaExportType)
    }" is not a tuple`,
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

export interface ThrowInvalidModelElementApi extends
  Pick<
    DeriveModelElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'typeContext'
  > {}

export function throwInvalidModelElement(
  api: ThrowInvalidModelElementApi,
): never {
  const {} = api;
  throwUserError(`invalid model element: TODO`);
}
