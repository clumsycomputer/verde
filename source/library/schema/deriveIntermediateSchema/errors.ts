import { throwUserError } from '../../../helpers/throwError.ts';
import { irrelevantAny, irrelevantUnknown } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { IntermediateSchemaType } from '../types/IntermediateSchema.ts';
import { __DeriveSchemaElementApi } from './components/__deriveSchemaElement/__deriveSchemaElement.ts';
import { __DeriveSchemaTypeApi } from './components/__deriveSchemaType/__deriveSchemaType.ts';
import { __DeriveModelTemplatesApi__ } from './components/__deriveSchemaType/deriveModelTemplates__.ts';
import { LoadSchemaModuleApi } from './components/loadSchemaModule.ts';

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
    __DeriveSchemaElementApi<irrelevantAny>,
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

interface ThrowInvalidModelTemplateApi extends
  Pick<
    __DeriveModelTemplatesApi__<irrelevantUnknown>,
    'typeSourceDeclaration'
  > {
  heritageLocalNode: Typescript.Node;
}

export function throwInvalidModelTemplate__DefaultParameterArgument(
  api: ThrowInvalidModelTemplateApi,
): never {
  const { heritageLocalNode, typeSourceDeclaration } = api;
  throwUserError(
    `invalid model template: default parameter arguments not supported (extends ${heritageLocalNode.getText()} on ${typeSourceDeclaration.name.text})`,
  );
}

interface ThrowInvalidModelDeclarationApi extends
  Pick<
    __DeriveSchemaTypeApi<irrelevantUnknown, irrelevantUnknown>,
    'typeSourceSymbol'
  > {}

export function throwInvalidModelDeclaration__DeclarationMerging(
  api: ThrowInvalidModelDeclarationApi,
): never {
  const { typeSourceSymbol } = api;
  throwUserError(
    `invalid model declaration: "${typeSourceSymbol.name}" has multiple declarations`,
  );
}

interface ThrowInvalidTypeImportApi__ImportAliased extends
  Pick<
    __DeriveSchemaTypeApi<irrelevantUnknown, irrelevantUnknown>,
    'typeLocalSymbol' | 'typeSourceSymbol'
  > {}

export function throwInvalidTypeImport__ImportAliased(
  api: ThrowInvalidTypeImportApi__ImportAliased,
): never {
  const { typeSourceSymbol, typeLocalSymbol } = api;
  throwUserError(
    `invalid type import: "${typeSourceSymbol.name} as ${typeLocalSymbol.name}"`,
  );
}

interface ThrowInvalidTypeUsageApi {
  cachedSchemaType: IntermediateSchemaType;
  thisTypeKind: IntermediateSchemaType['typeKind'];
}

export function throwInvalidTypeUsage(api: ThrowInvalidTypeUsageApi): never {
  const { thisTypeKind, cachedSchemaType } = api;
  throwUserError(
    `invalid type usage (${thisTypeKind}): "${cachedSchemaType.typeName}" already registered as "${cachedSchemaType.typeKind}"`,
  );
}

interface ThrowInvalidTypeDeclarationApi {
  cachedSchemaType: IntermediateSchemaType;
}

export function throwInvalidTypeDeclaration(
  api: ThrowInvalidTypeDeclarationApi,
): never {
  const { cachedSchemaType } = api;
  throwUserError(
    `invalid type declaration: "${cachedSchemaType.typeName}" is defined in multiple files`,
  );
}

interface ThrowInvalidGenericTemplateModelParameterApi__DefaultArgument {
  typeParameterDeclaration: Typescript.TypeParameterDeclaration;
  typeName: string;
}

export function throwInvalidGenericTemplateModelParameter__DefaultArgument(
  api: ThrowInvalidGenericTemplateModelParameterApi__DefaultArgument,
): never {
  const { typeParameterDeclaration, typeName } = api;
  throwUserError(
    `invalid generic template model parameter: default arguments not supported ("${typeParameterDeclaration.name.text}" on "${typeName}")`,
  );
}

interface ThrowInvalidObjecStructureApi__NonPropertySignature {
  objectStructureNode: Typescript.TypeElement;
}

export function throwInvalidObjectStructure__NonPropertySignature(
  api: ThrowInvalidObjecStructureApi__NonPropertySignature,
): never {
  const { objectStructureNode } = api;
  throwUserError(
    `invalid object structure: non-property signature ("${objectStructureNode.getText()}" in "${objectStructureNode.parent.getText()}")`,
  );
}

interface ThrowInvalidModelApi__NonPropertySignature {
  modelMemberNode: Typescript.TypeElement;
}

export function throwInvalidModel__NonPropertySignature(
  api: ThrowInvalidModelApi__NonPropertySignature,
): never {
  const { modelMemberNode } = api;
  throwUserError(
    `invalid model: non-property signature ("${modelMemberNode.getText()}" in "${modelMemberNode.parent.getText()}")`,
  );
}

interface ThrowInvalidTupleStructureApi__UnnamedTupleProperty {
  tupleStructureNode: Typescript.TypeNode;
}

export function throwInvalidTupleStructure__UnnamedTupleProperty(
  api: ThrowInvalidTupleStructureApi__UnnamedTupleProperty,
): never {
  const { tupleStructureNode } = api;
  throwUserError(
    `invalid tuple structure: tuple properties must have a name ("${tupleStructureNode.parent.getText()}")`,
  );
}
