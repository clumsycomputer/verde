import { throwUserError } from '../../../../helpers/throwError.ts';
import { irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import { DeriveSchemaElementApi } from '../components/deriveSchemaElement.ts';
// import { DeriveSchemaElementApi } from '../components/deriveSchemaElement.ts';
import { LoadSchemaModuleApi } from '../components/loadSchemaModule.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';

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

export function throwInvalidSchemaModule__NotTupleExport(
  api: ThrowInvalidSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: non-tuple export at "${schemaModulePath}"`,
  );
}

export interface ThrowInvalidTopLevelModelApi extends
  Pick<
  __DeriveIntermediateSchemaApi,
    'schemaTypeChecker'
  > {
  topLevelDataModelType: Typescript.Type;
}

export function throwInvalidTopLevelModel(
  api: ThrowInvalidTopLevelModelApi,
): never {
  const { schemaTypeChecker, topLevelDataModelType } = api;
  throwUserError(
    `invalid top-level model: ${
      schemaTypeChecker.typeToString(topLevelDataModelType)
    }`,
  );
}

// export interface ThrowInvalidModelTemplateApi extends
//   Pick<
//     DeriveModelTemplatesApi<irrelevantAny, Typescript.Type>,
//     'schemaTypeChecker' | 'modelType'
//   > {
//   modelTemplateType: Typescript.BaseType;
// }

// export function throwInvalidModelTemplate(
//   api: ThrowInvalidModelTemplateApi,
// ): never {
//   const { schemaTypeChecker, modelTemplateType, modelType } = api;
//   throwUserError(
//     `invalid model template: ${
//       schemaTypeChecker.typeToString(modelTemplateType)
//     } on ${modelType.symbol.name}`,
//   );
// }

export interface ThrowInvalidSchemaElementApi extends
  Pick<
    DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' 
    // | 'astContext'
  > {}

export function throwInvalidSchemaElement(
  api: ThrowInvalidSchemaElementApi,
): never {
  const {} = api;
  throwUserError(`invalid model element: TODO`);
}
