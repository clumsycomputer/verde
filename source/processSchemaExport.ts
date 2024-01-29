import {
  ConcreteTemplateModel,
  DataModel,
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
    ProcessSchemaModelTypeApi<DataModel>,
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
  api: ProcessTargetModelTypeApi<DataModel>,
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
    ProcessSchemaModelTypeApi<ConcreteTemplateModel>,
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
  api: ProcessTargetModelTypeApi<ConcreteTemplateModel>,
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

interface ProcessGenericTemplateModelTypeApi {}

function processGenericTemplateModelType(
  api: ProcessGenericTemplateModelTypeApi,
) {}

interface ProcessSchemaModelTypeApi<SchemaModelResult extends SchemaModel>
  extends Pick<ProcessSchemaExportApi, 'schemaTypeChecker'> {
  schemaMapResult: SchemaMap;
  someModelType: Typescript.InterfaceType;
  isTargetModel: (
    someSchemaModel: SchemaModel,
  ) => someSchemaModel is SchemaModelResult;
  processTargetModelType: (
    api: ProcessTargetModelTypeApi<SchemaModelResult>,
  ) => SchemaModelResult;
}

interface ProcessTargetModelTypeApi<SchemaModelResult extends SchemaModel>
  extends
    Pick<
      ProcessSchemaModelTypeApi<SchemaModelResult>,
      'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
    >,
    Pick<
      SchemaModel,
      'modelId' | 'modelSymbol' | 'modelExtensions' | 'modelProperties'
    > {}

function processSchemaModelType<SchemaModelResult extends SchemaModel>(
  api: ProcessSchemaModelTypeApi<SchemaModelResult>,
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
    ProcessSchemaModelTypeApi<SchemaModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  > {}

function processModelExtensions(
  api: ProcessModelExtensionsApi,
): SchemaModel['modelExtensions'] {
  const { someModelType, schemaTypeChecker, schemaMapResult } = api;
  const typeBases = someModelType.getBaseTypes() ?? [];
  return typeBases.reduce<SchemaModel['modelExtensions']>(
    (modelExtensionsResult, someTypeBase) => {
      if (isInterfaceType(someTypeBase)) {
        const concreteTemplateModel = processConcreteTemplateModelType({
          schemaTypeChecker,
          schemaMapResult,
          someModelType: someTypeBase,
        });
        modelExtensionsResult.push({
          extensionKind: 'concrete',
          extensionModelId: concreteTemplateModel.modelId,
        });
      } else {
        throwUserError(
          `invalid model extension: ${
            schemaTypeChecker.typeToString(someTypeBase)
          } on ${someModelType.symbol.name}`,
        );
      }
      return modelExtensionsResult;
    },
    [],
  );
}

interface ProcessModelPropertiesApi extends
  Pick<
    ProcessSchemaModelTypeApi<SchemaModel>,
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
      const propertyType = schemaTypeChecker.getTypeOfSymbol(someTypeProperty);
      if (isStringType(propertyType)) {
        modelPropertiesResult[propertyKey] = {
          propertyKey,
          propertyKind: 'primitive',
          primitiveKind: 'string',
        };
      } else if (isNumberType(propertyType)) {
        modelPropertiesResult[propertyKey] = {
          propertyKey,
          propertyKind: 'primitive',
          primitiveKind: 'number',
        };
      } else if (isBooleanType(propertyType)) {
        modelPropertiesResult[propertyKey] = {
          propertyKey,
          propertyKind: 'primitive',
          primitiveKind: 'boolean',
        };
      } else if (isInterfaceType(propertyType)) {
        const propertyDataModel = processDataModelType({
          schemaTypeChecker,
          schemaMapResult,
          someModelType: propertyType,
        });
        modelPropertiesResult[propertyKey] = {
          propertyKey,
          propertyKind: 'dataModel',
          dataModelId: propertyDataModel.modelId,
        };
      } else {
        throwUserError(
          `invalid model property: ${someModelType.symbol.name}["${propertyKey}"]`,
        );
      }
      return modelPropertiesResult;
    },
    {},
  );
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

function isPropertySymbol(
  someSymbol: Typescript.Symbol,
): someSymbol is Typescript.Symbol {
  return Boolean(someSymbol.flags & Typescript.SymbolFlags.Property);
}
