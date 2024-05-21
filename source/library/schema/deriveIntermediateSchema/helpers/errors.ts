import { throwUserError } from '../../../../helpers/throwError.ts';
import { irrelevantAny, irrelevantUnknown } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import { ValidateTargetModelApi } from '../components/__deriveIntermediateModel.ts';
import { DeriveModelTemplatesApi } from '../components/deriveModelTemplates.ts';
import { DeriveSchemaElementApi } from '../components/deriveSchemaElement.ts';
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

export interface ThrowInvalidSchemaElementApi extends
  Pick<
    DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'elementLocalNode'
  > {}

export function throwInvalidSchemaElement(
  api: ThrowInvalidSchemaElementApi,
): never {
  const { elementLocalNode } = api;
  throwUserError(
    `invalid schema element: ${elementLocalNode.getText()} at ${elementLocalNode.parent.getText()}`,
  );
}

interface ThrowInvalidModelTemplateApi
  extends
    Pick<DeriveModelTemplatesApi<irrelevantUnknown>, 'modelSourceDeclaration'> {
  heritageLocalNode: Typescript.Node;
}

export function throwInvalidModelTemplate__DefaultParameterArgument(
  api: ThrowInvalidModelTemplateApi,
): never {
  const { heritageLocalNode, modelSourceDeclaration } = api;
  throwUserError(
    `invalid model template: default parameter arguments not supported (extends ${heritageLocalNode.getText()} on ${modelSourceDeclaration.name.text})`,
  );
}

interface ThrowInvalidModelUsageApi
  extends Pick<ValidateTargetModelApi, 'modelSourceSymbol'> {}

export function throwInvalidModelUsage__AliasRegistered(
  api: ThrowInvalidModelUsageApi,
): never {
  const { modelSourceSymbol } = api;
  throwUserError(
    `invalid model usage: "${modelSourceSymbol.name}" already registered as alias`,
  );
}

export function throwInvalidModelUsage__GenericTemplateModelRegistered(
  api: ThrowInvalidModelUsageApi,
) {
  const { modelSourceSymbol } = api;
  throwUserError(
    `invalid model usage: "${modelSourceSymbol.name}" already registered as generic template model`,
  );
}

export function throwInvalidModelUsage__ConcreteTemplateModelRegistered(
  api: ThrowInvalidModelUsageApi,
): never {
  const { modelSourceSymbol } = api;
  throwUserError(
    `invalid model usage: "${modelSourceSymbol.name}" already registered as concrete template model`,
  );
}

export function throwInvalidModelUsage__DataModelRegistered(
  api: ThrowInvalidModelUsageApi,
): never {
  const { modelSourceSymbol } = api;
  throwUserError(
    `invalid model usage: "${modelSourceSymbol.name}" already registered as data model`,
  );
}

interface ThrowInvalidModelDeclarationApi
  extends Pick<ValidateTargetModelApi, 'modelSourceSymbol'> {}

export function throwInvalidModelDeclaration__MultipleDeclarations(
  api: ThrowInvalidModelDeclarationApi,
): never {
  const { modelSourceSymbol } = api;
  throwUserError(
    `invalid model declaration: "${modelSourceSymbol.name}" has multiple declarations`,
  );
}

interface ThrowIndirectModelNameApi
  extends
    Pick<ValidateTargetModelApi, 'modelSourceSymbol' | 'modelLocalSymbol'> {}

export function throwIndirectModelName(api: ThrowIndirectModelNameApi) {
  const { modelSourceSymbol, modelLocalSymbol } = api;
  throwUserError(
    `indirect model name: "${modelSourceSymbol.name} as ${modelLocalSymbol.name}"`,
  );
}
