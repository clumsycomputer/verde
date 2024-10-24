import { throwUserError } from '../../../helpers/throwError.ts';
import { LoadSchemaModuleApi } from './loadSchemaModule.ts';

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