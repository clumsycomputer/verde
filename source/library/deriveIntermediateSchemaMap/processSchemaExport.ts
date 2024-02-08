import {
  throwInvalidPathError,
  throwUserError,
} from '../../helpers/throwError.ts';
import { Typescript } from '../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateSchemaModel,
  DataIntermediateSchemaModel,
  GenericTemplateIntermediateSchemaModel,
  IntermediateSchemaMap,
  IntermediateModelElement,
  IntermediateSchemaModel,
  ModelTemplate,
  GenericArgument,
} from '../types/IntermediateSchemaMap.ts';
import { LoadSchemaModuleResult } from './loadSchemaModule.ts';

export interface ProcessSchemaExportApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportType'
  > {}

export function processSchemaExport(
  api: ProcessSchemaExportApi,
): IntermediateSchemaMap {
  const { schemaTypeChecker, rhsSchemaExportType, lhsSchemaExportSymbol } = api;
  if (schemaTypeChecker.isTupleType(rhsSchemaExportType) === false) {
    throwUserError(
      `${lhsSchemaExportSymbol.name}: ${
        schemaTypeChecker.typeToString(rhsSchemaExportType)
      } is not a tuple`,
    );
  }
  const schemaResult: IntermediateSchemaMap = {
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
      schemaResult,
      someModelType: someTopLevelModelType,
    });
  });
  return schemaResult;
}

interface ProcessDataModelTypeApi extends
  Pick<
    ProcessSchemaModelTypeApi<
      Typescript.InterfaceType,
      DataIntermediateSchemaModel
    >,
    'schemaTypeChecker' | 'schemaResult' | 'someModelType'
  > {}

function processDataModelType(api: ProcessDataModelTypeApi) {
  const { schemaTypeChecker, schemaResult, someModelType } = api;
  return processSchemaModelType({
    schemaTypeChecker,
    schemaResult,
    someModelType,
    isTargetModel: isDataModel,
    processTargetModelType: _processDataModelType,
  });
}

function isDataModel(
  someSchemaModel: IntermediateSchemaModel,
): someSchemaModel is DataIntermediateSchemaModel {
  return someSchemaModel.modelKind === 'data';
}

function _processDataModelType(
  api: ProcessTargetModelTypeApi<
    Typescript.InterfaceType,
    DataIntermediateSchemaModel
  >,
): DataIntermediateSchemaModel {
  const { modelKey, modelSymbol, modelTemplates, modelProperties } = api;
  return {
    modelKind: 'data',
    modelKey,
    modelSymbol,
    modelTemplates,
    modelProperties,
  };
}

interface ProcessConcreteTemplateModelTypeApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.InterfaceType, ConcreteTemplateIntermediateSchemaModel>,
    'schemaTypeChecker' | 'schemaResult' | 'someModelType'
  > {}

function processConcreteTemplateModelType(
  api: ProcessConcreteTemplateModelTypeApi,
) {
  const { schemaTypeChecker, schemaResult, someModelType } = api;
  return processSchemaModelType({
    schemaTypeChecker,
    schemaResult,
    someModelType,
    isTargetModel: isConcreteTemplateModel,
    processTargetModelType: _processConcreteTemplateModelType,
  });
}

function isConcreteTemplateModel(
  someSchemaModel: IntermediateSchemaModel,
): someSchemaModel is ConcreteTemplateIntermediateSchemaModel {
  return someSchemaModel.modelKind === 'template' &&
    someSchemaModel.templateKind === 'concrete';
}

function _processConcreteTemplateModelType(
  api: ProcessTargetModelTypeApi<
    Typescript.InterfaceType,
    ConcreteTemplateIntermediateSchemaModel
  >,
): ConcreteTemplateIntermediateSchemaModel {
  const { modelKey, modelSymbol, modelTemplates, modelProperties } = api;
  return {
    modelKind: 'template',
    templateKind: 'concrete',
    modelKey,
    modelSymbol,
    modelTemplates,
    modelProperties,
  };
}

interface ProcessGenericTemplateModelTypeApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.TypeReference, GenericTemplateIntermediateSchemaModel>,
    'schemaTypeChecker' | 'schemaResult' | 'someModelType'
  > {
}

function processGenericTemplateModelType(
  api: ProcessGenericTemplateModelTypeApi,
): GenericTemplateIntermediateSchemaModel {
  const { schemaTypeChecker, schemaResult, someModelType } = api;
  return processSchemaModelType({
    schemaTypeChecker,
    schemaResult,
    someModelType,
    isTargetModel: isGenericTemplateModel,
    processTargetModelType: _processGenericTemplateModelType,
  });
}

function isGenericTemplateModel(
  someSchemaModel: IntermediateSchemaModel,
): someSchemaModel is GenericTemplateIntermediateSchemaModel {
  return someSchemaModel.modelKind === 'template' &&
    someSchemaModel.templateKind === 'generic';
}

function _processGenericTemplateModelType(
  api: ProcessTargetModelTypeApi<
    Typescript.TypeReference,
    GenericTemplateIntermediateSchemaModel
  >,
): GenericTemplateIntermediateSchemaModel {
  const {
    modelKey,
    modelSymbol,
    modelTemplates,
    modelProperties,
    someModelType,
  } = api;
  const typeParameterTypes = someModelType.target.typeParameters ??
    throwInvalidPathError('typeParameterTypes');
  return {
    modelKind: 'template',
    templateKind: 'generic',
    modelKey,
    modelSymbol,
    modelTemplates,
    modelProperties,
    genericParameters: typeParameterTypes.map((
      someTypeParameter,
    ) => ({
      parameterSymbol: someTypeParameter.symbol.name,
    })),
  };
}

interface ProcessSchemaModelTypeApi<
  ModelType extends Typescript.Type,
  SchemaModelResult extends IntermediateSchemaModel,
> extends Pick<ProcessSchemaExportApi, 'schemaTypeChecker'> {
  schemaResult: IntermediateSchemaMap;
  someModelType: ModelType;
  isTargetModel: (
    someSchemaModel: IntermediateSchemaModel,
  ) => someSchemaModel is SchemaModelResult;
  processTargetModelType: (
    api: ProcessTargetModelTypeApi<ModelType, SchemaModelResult>,
  ) => SchemaModelResult;
}

interface ProcessTargetModelTypeApi<
  ModelType extends Typescript.Type,
  SchemaModelResult extends IntermediateSchemaModel,
> extends
  Pick<
    ProcessSchemaModelTypeApi<ModelType, SchemaModelResult>,
    'schemaTypeChecker' | 'schemaResult' | 'someModelType'
  >,
  Pick<
    IntermediateSchemaModel,
    'modelKey' | 'modelSymbol' | 'modelProperties' | 'modelTemplates'
  > {}

function processSchemaModelType<
  ModelType extends Typescript.Type,
  SchemaModelResult extends IntermediateSchemaModel,
>(
  api: ProcessSchemaModelTypeApi<ModelType, SchemaModelResult>,
): SchemaModelResult {
  const {
    someModelType,
    schemaResult,
    isTargetModel,
    schemaTypeChecker,
    processTargetModelType,
  } = api;
  const modelSymbol = someModelType.symbol.name;
  // todo: find way to generate deterministic modelKey from symbol name and scope
  const modelKey = modelSymbol;
  const alreadyProcessedSchemaModel = schemaResult.schemaModels[modelKey];
  if (alreadyProcessedSchemaModel !== undefined) {
    return (isTargetModel(alreadyProcessedSchemaModel) &&
      alreadyProcessedSchemaModel) ||
      throwInvalidPathError('alreadyProcessedSchemaModel');
  } else {
    const targetSchemaModel = processTargetModelType({
      someModelType,
      schemaResult,
      schemaTypeChecker,
      modelKey,
      modelSymbol,
      modelTemplates: processModelTemplates({
        schemaTypeChecker,
        schemaResult,
        someModelType,
      }),
      modelProperties: processModelProperties({
        schemaTypeChecker,
        schemaResult,
        someModelType,
      }),
    });
    schemaResult.schemaModels[targetSchemaModel.modelKey] = targetSchemaModel;
    return targetSchemaModel;
  }
}

interface ProcessModelTemplatesApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.Type, IntermediateSchemaModel>,
    'schemaTypeChecker' | 'schemaResult' | 'someModelType'
  > {}

function processModelTemplates(
  api: ProcessModelTemplatesApi,
): IntermediateSchemaModel['modelTemplates'] {
  const { someModelType, schemaTypeChecker, schemaResult } = api;
  const typeBases = someModelType.getBaseTypes() ?? [];
  return typeBases.map<ModelTemplate>(
    (someTypeBase) => {
      if (isInterfaceType(someTypeBase)) {
        const concreteTemplateModel = processConcreteTemplateModelType({
          schemaTypeChecker,
          schemaResult,
          someModelType: someTypeBase,
        });
        return {
          templateKind: 'concrete',
          templateModelKey: concreteTemplateModel.modelKey
          // dataModelKey: concreteTemplateModel.modelId,
        };
      } else if (
        isTypeReferenceType(someTypeBase) &&
        isInterfaceType(someTypeBase.target)
      ) {
        const typeArgumentTypes = someTypeBase.typeArguments ??
          throwInvalidPathError('typeArgumentTypes');
        const genericTemplateModel = processGenericTemplateModelType({
          schemaTypeChecker,
          schemaResult,
          someModelType: someTypeBase,
        });
        return {
          templateKind: 'generic',
          templateModelKey: genericTemplateModel.modelKey,
          genericArguments: typeArgumentTypes.map<GenericArgument>((
            someTypeArgumentType,
          ) => ({
            argumentElement: processArgumentElement({
              schemaTypeChecker,
              schemaResult,
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
    ProcessSchemaModelTypeApi<Typescript.Type, IntermediateSchemaModel>,
    'schemaTypeChecker' | 'schemaResult' | 'someModelType'
  > {}

function processModelProperties(
  api: ProcessModelPropertiesApi,
): IntermediateSchemaModel['modelProperties'] {
  const { someModelType, schemaTypeChecker, schemaResult } = api;
  const typeProperties = (someModelType.symbol.members &&
    Array.from(someModelType.symbol.members.values()).filter(
      isPropertySymbol,
    )) ??
    [];
  return typeProperties.reduce<IntermediateSchemaModel['modelProperties']>(
    (modelPropertiesResult, someTypeProperty) => {
      const propertyKey = someTypeProperty.name;
      modelPropertiesResult[propertyKey] = {
        propertyKey,
        propertyElement: processPropertyElement({
          schemaTypeChecker,
          schemaResult,
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
    'schemaTypeChecker' | 'schemaResult' | 'someElementType'
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
    schemaResult,
  } = api;
  return processModelElement({
    preformattedUserError: `invalid extension argument: ${
      schemaTypeChecker.typeToString(someElementType)
    } in ${schemaTypeChecker.typeToString(someTypeBase)} on ${
      schemaTypeChecker.typeToString(someModelType)
    }`,
    schemaTypeChecker,
    schemaResult,
    someElementType,
  });
}

interface ProcessPropertyElementApi extends
  Pick<
    ProcessModelElementApi,
    'schemaTypeChecker' | 'schemaResult' | 'someElementType'
  >,
  Pick<ProcessModelPropertiesApi, 'someModelType'> {
  propertyKey: string;
}

function processPropertyElement(api: ProcessPropertyElementApi) {
  const {
    someModelType,
    propertyKey,
    schemaTypeChecker,
    schemaResult,
    someElementType,
  } = api;
  return processModelElement({
    preformattedUserError:
      `invalid model property: ${someModelType.symbol.name}["${propertyKey}"]`,
    schemaTypeChecker,
    schemaResult,
    someElementType,
  });
}

interface ProcessModelElementApi extends
  Pick<
    ProcessSchemaModelTypeApi<Typescript.Type, IntermediateSchemaModel>,
    'schemaTypeChecker' | 'schemaResult'
  > {
  someElementType: Typescript.Type;
  preformattedUserError: string;
}

function processModelElement(api: ProcessModelElementApi): IntermediateModelElement {
  const {
    someElementType,
    schemaTypeChecker,
    schemaResult,
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
      schemaResult,
      someModelType: someElementType,
    });
    return {
      elementKind: 'dataModel',
      dataModelKey: elementDataModel.modelKey,
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
