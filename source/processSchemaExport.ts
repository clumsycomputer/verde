import {
  ConcreteTemplateModel,
  DataModel,
  ExtensionArgument,
  GenericTemplateModel,
  ModelElement,
  ModelExtension,
  SchemaMap,
  SchemaModel,
} from './SchemaMap.ts';
import { throwInvalidPathError, throwUserError } from './helpers/throwError.ts';
import { Typescript } from './imports/Typescript.ts';
import { LoadSchemaModuleResult } from './loadSchemaModule.ts';

export interface ProcessSchemaExportApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportType'
  > {}

export function processSchemaExport(api: ProcessSchemaExportApi): SchemaMap {
  const { schemaTypeChecker, rhsSchemaExportType, lhsSchemaExportSymbol } = api;
  if (schemaTypeChecker.isTupleType(rhsSchemaExportType) === false) {
    throwUserError(
      `${lhsSchemaExportSymbol.name}: ${
        schemaTypeChecker.typeToString(rhsSchemaExportType)
      } is not a tuple`,
    );
  }
  const schemaMapResult: SchemaMap = {
    schemaSymbol: lhsSchemaExportSymbol.name,
    schemaModels: {},
  };
  const topLevelModelTypes = (isTypeReferenceType(rhsSchemaExportType) &&
    schemaTypeChecker.getTypeArguments(rhsSchemaExportType)) ||
    throwInvalidPathError('topLevelModelTypes');
  topLevelModelTypes.forEach((someTopLevelModelType) => {
    if (isInterfaceType(someTopLevelModelType) === false) {
      throwUserError(
        `invalid top-level model: ${
          schemaTypeChecker.typeToString(someTopLevelModelType)
        }`,
      );
    }
    processDataModelType({
      schemaTypeChecker,
      schemaMapResult,
      someModelType: someTopLevelModelType,
    });
  });
  return schemaMapResult;
}

interface ProcessDataModelTypeApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.InterfaceType, DataModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  > {}

function processDataModelType(api: ProcessDataModelTypeApi) {
  const { schemaTypeChecker, schemaMapResult, someModelType } = api;
  return processSchemaModelType({
    schemaTypeChecker,
    schemaMapResult,
    someModelType,
    isTargetModel: isDataModel,
    processTargetModelType: _processDataModelType,
  });
}

function isDataModel(
  someSchemaModel: SchemaModel,
): someSchemaModel is DataModel {
  return someSchemaModel.modelKind === 'data';
}

function _processDataModelType(
  api: ProcessTargetModelTypeApi<Typescript.InterfaceType, DataModel>,
): DataModel {
  const { modelId, modelSymbol, modelExtensions, modelProperties } = api;
  return {
    modelKind: 'data',
    modelId,
    modelSymbol,
    modelExtensions,
    modelProperties,
  };
}

interface ProcessConcreteTemplateModelTypeApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.InterfaceType, ConcreteTemplateModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  > {}

function processConcreteTemplateModelType(
  api: ProcessConcreteTemplateModelTypeApi,
) {
  const { schemaTypeChecker, schemaMapResult, someModelType } = api;
  return processSchemaModelType({
    schemaTypeChecker,
    schemaMapResult,
    someModelType,
    isTargetModel: isConcreteTemplateModel,
    processTargetModelType: _processConcreteTemplateModelType,
  });
}

function isConcreteTemplateModel(
  someSchemaModel: SchemaModel,
): someSchemaModel is ConcreteTemplateModel {
  return someSchemaModel.modelKind === 'template' &&
    someSchemaModel.templateKind === 'concrete';
}

function _processConcreteTemplateModelType(
  api: ProcessTargetModelTypeApi<
    Typescript.InterfaceType,
    ConcreteTemplateModel
  >,
): ConcreteTemplateModel {
  const { modelId, modelSymbol, modelExtensions, modelProperties } = api;
  return {
    modelKind: 'template',
    templateKind: 'concrete',
    modelId,
    modelSymbol,
    modelExtensions,
    modelProperties,
  };
}

interface ProcessGenericTemplateModelTypeApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.TypeReference, GenericTemplateModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  > {
}

function processGenericTemplateModelType(
  api: ProcessGenericTemplateModelTypeApi,
): GenericTemplateModel {
  const { schemaTypeChecker, schemaMapResult, someModelType } = api;
  return processSchemaModelType({
    schemaTypeChecker,
    schemaMapResult,
    someModelType,
    isTargetModel: isGenericTemplateModel,
    processTargetModelType: _processGenericTemplateModelType,
  });
}

function isGenericTemplateModel(
  someSchemaModel: SchemaModel,
): someSchemaModel is GenericTemplateModel {
  return someSchemaModel.modelKind === 'template' &&
    someSchemaModel.templateKind === 'generic';
}

function _processGenericTemplateModelType(
  api: ProcessTargetModelTypeApi<
    Typescript.TypeReference,
    GenericTemplateModel
  >,
): GenericTemplateModel {
  const {
    modelId,
    modelSymbol,
    modelExtensions,
    modelProperties,
    someModelType,
  } = api;
  const typeParameterTypes = someModelType.target.typeParameters ??
    throwInvalidPathError('typeParameterTypes');
  return {
    modelKind: 'template',
    templateKind: 'generic',
    modelId,
    modelSymbol,
    modelExtensions,
    modelProperties,
    templateParameters: typeParameterTypes.map((
      someTypeParameter,
    ) => ({
      parameterSymbol: someTypeParameter.symbol.name,
    })),
  };
}

interface ProcessSchemaModelTypeApi<
  ModelType extends Typescript.Type,
  SchemaModelResult extends SchemaModel,
> extends Pick<ProcessSchemaExportApi, 'schemaTypeChecker'> {
  schemaMapResult: SchemaMap;
  someModelType: ModelType;
  isTargetModel: (
    someSchemaModel: SchemaModel,
  ) => someSchemaModel is SchemaModelResult;
  processTargetModelType: (
    api: ProcessTargetModelTypeApi<ModelType, SchemaModelResult>,
  ) => SchemaModelResult;
}

interface ProcessTargetModelTypeApi<
  ModelType extends Typescript.Type,
  SchemaModelResult extends SchemaModel,
> extends
  Pick<
    ProcessSchemaModelTypeApi<ModelType, SchemaModelResult>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  >,
  Pick<
    SchemaModel,
    'modelId' | 'modelSymbol' | 'modelExtensions' | 'modelProperties'
  > {}

function processSchemaModelType<
  ModelType extends Typescript.Type,
  SchemaModelResult extends SchemaModel,
>(
  api: ProcessSchemaModelTypeApi<ModelType, SchemaModelResult>,
): SchemaModelResult {
  const {
    someModelType,
    schemaMapResult,
    isTargetModel,
    schemaTypeChecker,
    processTargetModelType,
  } = api;
  const modelSymbol = someModelType.symbol.name;
  // todo: find way to generate deterministic modelId from symbol name and scope
  const modelId = modelSymbol;
  const alreadyProcessedSchemaModel = schemaMapResult.schemaModels[modelId];
  if (alreadyProcessedSchemaModel !== undefined) {
    return (isTargetModel(alreadyProcessedSchemaModel) &&
      alreadyProcessedSchemaModel) ||
      throwInvalidPathError('alreadyProcessedSchemaModel');
  } else {
    const targetSchemaModel = processTargetModelType({
      someModelType,
      schemaMapResult,
      schemaTypeChecker,
      modelId,
      modelSymbol,
      modelExtensions: processModelExtensions({
        schemaTypeChecker,
        schemaMapResult,
        someModelType,
      }),
      modelProperties: processModelProperties({
        schemaTypeChecker,
        schemaMapResult,
        someModelType,
      }),
    });
    schemaMapResult.schemaModels[targetSchemaModel.modelId] = targetSchemaModel;
    return targetSchemaModel;
  }
}

interface ProcessModelExtensionsApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.Type, SchemaModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  > {}

function processModelExtensions(
  api: ProcessModelExtensionsApi,
): SchemaModel['modelExtensions'] {
  const { someModelType, schemaTypeChecker, schemaMapResult } = api;
  const typeBases = someModelType.getBaseTypes() ?? [];
  return typeBases.map<ModelExtension>(
    (someTypeBase) => {
      if (isInterfaceType(someTypeBase)) {
        const concreteTemplateModel = processConcreteTemplateModelType({
          schemaTypeChecker,
          schemaMapResult,
          someModelType: someTypeBase,
        });
        return {
          extensionKind: 'concrete',
          extensionModelId: concreteTemplateModel.modelId,
        };
      } else if (
        isTypeReferenceType(someTypeBase) &&
        isInterfaceType(someTypeBase.target)
      ) {
        const typeArgumentTypes = someTypeBase.typeArguments ??
          throwInvalidPathError('typeArgumentTypes');
        const genericTemplateModel = processGenericTemplateModelType({
          schemaTypeChecker,
          schemaMapResult,
          someModelType: someTypeBase,
        });
        return {
          extensionKind: 'generic',
          extensionModelId: genericTemplateModel.modelId,
          extensionArguments: typeArgumentTypes.map<ExtensionArgument>((
            someTypeArgumentType,
          ) => ({
            argumentElement: processArgumentElement({
              schemaTypeChecker,
              schemaMapResult,
              someModelType,
              someTypeBase,
              someElementType: someTypeArgumentType,
            }),
          })),
        };
      } else {
        throwUserError(
          `invalid model extension: ${
            schemaTypeChecker.typeToString(someTypeBase)
          } on ${someModelType.symbol.name}`,
        );
      }
    },
  );
}

interface ProcessModelPropertiesApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.Type, SchemaModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  > {}

function processModelProperties(
  api: ProcessModelPropertiesApi,
): SchemaModel['modelProperties'] {
  const { someModelType, schemaTypeChecker, schemaMapResult } = api;
  const typeProperties = (someModelType.symbol.members &&
    Array.from(someModelType.symbol.members.values()).filter(
      isPropertySymbol,
    )) ??
    [];
  return typeProperties.reduce<SchemaModel['modelProperties']>(
    (modelPropertiesResult, someTypeProperty) => {
      const propertyKey = someTypeProperty.name;
      modelPropertiesResult[propertyKey] = {
        propertyKey,
        propertyElement: processPropertyElement({
          schemaTypeChecker,
          schemaMapResult,
          someModelType,
          propertyKey,
          someElementType: schemaTypeChecker.getTypeOfSymbol(someTypeProperty),
        }),
      };
      return modelPropertiesResult;
    },
    {},
  );
}

interface ProcessArgumentElementApi extends
  Pick<
    ProcessModelElementApi,
    'schemaTypeChecker' | 'schemaMapResult' | 'someElementType'
  >,
  Pick<ProcessModelPropertiesApi, 'someModelType'> {
  someTypeBase: Typescript.TypeReference;
}

function processArgumentElement(api: ProcessArgumentElementApi) {
  const {
    someElementType,
    someTypeBase,
    someModelType,
    schemaTypeChecker,
    schemaMapResult,
  } = api;
  return processModelElement({
    preformattedUserError: `invalid extension argument: ${
      schemaTypeChecker.typeToString(someElementType)
    } in ${schemaTypeChecker.typeToString(someTypeBase)} on ${
      schemaTypeChecker.typeToString(someModelType)
    }`,
    schemaTypeChecker,
    schemaMapResult,
    someElementType,
  });
}

interface ProcessPropertyElementApi extends
  Pick<
    ProcessModelElementApi,
    'schemaTypeChecker' | 'schemaMapResult' | 'someElementType'
  >,
  Pick<ProcessModelPropertiesApi, 'someModelType'> {
  propertyKey: string;
}

function processPropertyElement(api: ProcessPropertyElementApi) {
  const {
    someModelType,
    propertyKey,
    schemaTypeChecker,
    schemaMapResult,
    someElementType,
  } = api;
  return processModelElement({
    preformattedUserError:
      `invalid model property: ${someModelType.symbol.name}["${propertyKey}"]`,
    schemaTypeChecker,
    schemaMapResult,
    someElementType,
  });
}

interface ProcessModelElementApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.Type, SchemaModel>,
    'schemaTypeChecker' | 'schemaMapResult'
  > {
  someElementType: Typescript.Type;
  preformattedUserError: string;
}

function processModelElement(api: ProcessModelElementApi): ModelElement {
  const {
    someElementType,
    schemaTypeChecker,
    schemaMapResult,
    preformattedUserError,
  } = api;
  if (isStringLiteralType(someElementType)) {
    return {
      elementKind: 'literal',
      literalKind: 'string',
      literalSymbol: schemaTypeChecker.typeToString(someElementType),
    };
  } else if (isNumberLiteralType(someElementType)) {
    return {
      elementKind: 'literal',
      literalKind: 'number',
      literalSymbol: schemaTypeChecker.typeToString(someElementType),
    };
  } else if (isBooleanLiteralType(someElementType)) {
    return {
      elementKind: 'literal',
      literalKind: 'boolean',
      literalSymbol: schemaTypeChecker.typeToString(someElementType),
    };
  } else if (isStringType(someElementType)) {
    return {
      elementKind: 'primitive',
      primitiveKind: 'string',
    };
  } else if (isNumberType(someElementType)) {
    return {
      elementKind: 'primitive',
      primitiveKind: 'number',
    };
  } else if (isBooleanType(someElementType)) {
    return {
      elementKind: 'primitive',
      primitiveKind: 'boolean',
    };
  } else if (isInterfaceType(someElementType)) {
    const elementDataModel = processDataModelType({
      schemaTypeChecker,
      schemaMapResult,
      someModelType: someElementType,
    });
    return {
      elementKind: 'dataModel',
      dataModelId: elementDataModel.modelId,
    };
  } else if (
    isParameterType(someElementType) &&
    someElementType.getConstraint() !== undefined
  ) {
    return {
      elementKind: 'parameter',
      parameterKind: 'constrained',
      // parameterSymbol: someElementType.symbol.name
    };
  } else if (isParameterType(someElementType)) {
    return {
      elementKind: 'parameter',
      parameterKind: 'basic',
      // parameterSymbol: someElementType.symbol.name,
    };
  } else {
    throwUserError(preformattedUserError);
  }
}

function isStringLiteralType(
  someType: Typescript.Type,
): someType is Typescript.StringLiteralType {
  return Boolean(someType.flags & Typescript.TypeFlags.StringLiteral);
}

function isNumberLiteralType(
  someType: Typescript.Type,
): someType is Typescript.NumberLiteralType {
  return Boolean(someType.flags & Typescript.TypeFlags.NumberLiteral);
}

function isBooleanLiteralType(
  someType: Typescript.Type,
) {
  return Boolean(someType.flags & Typescript.TypeFlags.BooleanLiteral);
}

function isStringType(someType: Typescript.Type) {
  return Boolean(someType.flags & Typescript.TypeFlags.String);
}

function isNumberType(someType: Typescript.Type) {
  return Boolean(someType.flags & Typescript.TypeFlags.Number);
}

function isBooleanType(someType: Typescript.Type) {
  return Boolean(someType.flags & Typescript.TypeFlags.Boolean);
}

function isInterfaceType(
  someType: Typescript.Type,
): someType is Typescript.InterfaceType {
  return (
    isObjectFlagsType(someType) &&
    Boolean(someType.objectFlags & Typescript.ObjectFlags.Interface)
  );
}

function isTypeReferenceType(
  someType: Typescript.Type,
): someType is Typescript.TypeReference {
  return (
    isObjectFlagsType(someType) &&
    Boolean(someType.objectFlags & Typescript.ObjectFlags.Reference)
  );
}

function isObjectFlagsType(
  someType: Typescript.Type,
): someType is Typescript.TypeReference {
  return Boolean(
    someType.flags &
      (Typescript.TypeFlags.Any |
        Typescript.TypeFlags.Undefined |
        Typescript.TypeFlags.Null |
        Typescript.TypeFlags.Never |
        Typescript.TypeFlags.Object |
        Typescript.TypeFlags.Union |
        Typescript.TypeFlags.Intersection),
  );
}

function isParameterType(
  someType: Typescript.Type,
): someType is Typescript.TypeParameter {
  return Boolean(someType.flags & Typescript.TypeFlags.TypeParameter);
}

function isPropertySymbol(
  someSymbol: Typescript.Symbol,
): someSymbol is Typescript.Symbol {
  return Boolean(someSymbol.flags & Typescript.SymbolFlags.Property);
}
