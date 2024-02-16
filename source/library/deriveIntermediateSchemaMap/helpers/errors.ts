import { throwUserError } from '../../../helpers/throwError.ts';
import { irrelevantAny } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { DeriveModelElementApi } from '../components/deriveModelElement.ts';
import { DeriveModelTemplatesApi } from '../components/deriveModelTemplates.ts';
import { LoadSchemaModuleApi } from '../components/loadSchemaModule.ts';
import { DeriveSchemaMapApi } from '../deriveIntermediateSchemaMap.ts';

export interface ThrowInvalidSchemaModulePathApi
  extends Pick<LoadSchemaModuleApi, 'schemaModulePath'> {}

export function throwInvalidSchemaModulePath(
  api: ThrowInvalidSchemaModulePathApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(`schemaModulePath: "${schemaModulePath}" doesn't exist`);
}

export interface ThrowNoExportsSchemaModuleApi
  extends Pick<LoadSchemaModuleApi, 'schemaModulePath'> {}

export function throwNoExportsSchemaModule(
  api: ThrowNoExportsSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: no exports at "${schemaModulePath}"`,
  );
}

export interface ThrowMultipleExportsSchemaModuleApi
  extends Pick<LoadSchemaModuleApi, 'schemaModulePath'> {}

export function throwMultipleExportsSchemaModule(
  api: ThrowMultipleExportsSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: multiple exports at "${schemaModulePath}"`,
  );
}

export interface ThrowNonTypeExportSchemaModuleApi
  extends Pick<LoadSchemaModuleApi, 'schemaModulePath'> {}

export function throwNonTypeExportSchemaModule(
  api: ThrowNonTypeExportSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: non-type export at "${schemaModulePath}"`,
  );
}

export interface ThrowNotConcreteTypeAliasExportSchemaModuleApi
  extends Pick<LoadSchemaModuleApi, 'schemaModulePath'> {}

export function throwNotConcreteTypeAliasExportSchemaModule(
  api: ThrowNotConcreteTypeAliasExportSchemaModuleApi,
): never {
  const { schemaModulePath } = api;
  throwUserError(
    `invalid schema module: not a concrete type-alias export at "${schemaModulePath}"`,
  );
}

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
