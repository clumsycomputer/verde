import {
  throwInvalidPathError,
  throwUserError,
} from '../../helpers/throwError.ts';
import { irrelevantAny } from '../../helpers/types.ts';
import { Typescript } from '../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateSchemaModel,
  DataIntermediateSchemaModel,
  GenericModelTemplate,
  GenericTemplateIntermediateSchemaModel,
  IntermediateSchemaMap,
  IntermediateSchemaModel,
  IntermediateSchemaModel_Core,
} from '../types/IntermediateSchemaMap.ts';
import {
ExtractModelElement,
  isInterfaceType,
  isPropertySymbol,
  isTypeReference,
} from './helpers.ts';
import {
  loadSchemaModule,
  LoadSchemaModuleResult,
} from './loadSchemaModule.ts';

export interface DeriveIntermediateSchemaMapApi {
  schemaModulePath: string;
}

export function deriveIntermediateSchemaMap(
  api: DeriveIntermediateSchemaMapApi,
): IntermediateSchemaMap {
  const { schemaModulePath } = api;
  const {
    schemaTypeChecker,
    lhsSchemaExportSymbol,
    rhsSchemaExportType,
  } = loadSchemaModule({
    schemaModulePath,
  });
  return deriveSchemaMap({
    schemaTypeChecker,
    lhsSchemaExportSymbol,
    rhsSchemaExportType,
  });
}

interface DeriveSchemaMapApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportType'
  > {}

function deriveSchemaMap(api: DeriveSchemaMapApi): IntermediateSchemaMap {
  const { schemaTypeChecker, rhsSchemaExportType, lhsSchemaExportSymbol } = api;
  if (false === schemaTypeChecker.isTupleType(rhsSchemaExportType)) {
    throwUserError(
      `${lhsSchemaExportSymbol.name}: ${
        schemaTypeChecker.typeToString(rhsSchemaExportType)
      } is not a tuple`,
    );
  }
  const schemaMapResult: IntermediateSchemaMap = {
    schemaSymbol: lhsSchemaExportSymbol.name,
    schemaModels: {},
  };
  const topDataModelTypes = (isTypeReference(rhsSchemaExportType) &&
    schemaTypeChecker.getTypeArguments(rhsSchemaExportType)) ||
    throwInvalidPathError('topDataModelTypes');
  topDataModelTypes.forEach((someTopDataModelType) => {
    if (false === isInterfaceType(someTopDataModelType)) {
      throwUserError(
        `invalid top-level model: ${
          schemaTypeChecker.typeToString(someTopDataModelType)
        }`,
      );
    }
    deriveDataModel({
      schemaTypeChecker,
      schemaMapResult,
      someDataModelType: someTopDataModelType,
    });
  });
  return schemaMapResult;
}

interface DeriveDataModelApi extends
  Pick<
    __DeriveIntermediateModelApi<irrelevantAny, irrelevantAny>,
    'schemaTypeChecker' | 'schemaMapResult'
  > {
  someDataModelType: __DeriveIntermediateModelApi<
    Typescript.InterfaceType,
    irrelevantAny
  >['someModelType'];
}

function deriveDataModel(api: DeriveDataModelApi) {
  const { schemaTypeChecker, schemaMapResult, someDataModelType } = api;
  return __deriveIntermediateModel({
    isCachedResultKind: isCachedResultKind__deriveDataModel,
    deriveResultModel: deriveResultModel__deriveDataModel,
    schemaTypeChecker,
    schemaMapResult,
    someModelType: someDataModelType,
  });
}

function isCachedResultKind__deriveDataModel(
  maybeCachedResultModel: IntermediateSchemaModel | undefined,
): maybeCachedResultModel is DataIntermediateSchemaModel {
  return Boolean(
    maybeCachedResultModel && maybeCachedResultModel.modelKind === 'data',
  );
}

function deriveResultModel__deriveDataModel(
  api: DeriveResultModelApi<
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

interface DeriveConcreteTemplateModelApi extends
  Pick<
    __DeriveIntermediateModelApi<irrelevantAny, irrelevantAny>,
    'schemaTypeChecker' | 'schemaMapResult'
  > {
  someConcreteTemplateModelType: __DeriveIntermediateModelApi<
    Typescript.InterfaceType,
    irrelevantAny
  >['someModelType'];
}

function deriveConcreteTemplateModel(
  api: DeriveConcreteTemplateModelApi,
) {
  const { schemaTypeChecker, schemaMapResult, someConcreteTemplateModelType } =
    api;
  return __deriveIntermediateModel({
    isCachedResultKind: isCachedResultKind__deriveConcreteTemplateModel,
    deriveResultModel: deriveResultModel__deriveConcreteTemplateModel,
    schemaTypeChecker,
    schemaMapResult,
    someModelType: someConcreteTemplateModelType,
  });
}

function isCachedResultKind__deriveConcreteTemplateModel(
  maybeCachedResultModel: IntermediateSchemaModel | undefined,
): maybeCachedResultModel is ConcreteTemplateIntermediateSchemaModel {
  return Boolean(
    maybeCachedResultModel && maybeCachedResultModel.modelKind === 'template' &&
      maybeCachedResultModel.templateKind === 'concrete',
  );
}

function deriveResultModel__deriveConcreteTemplateModel(
  api: DeriveResultModelApi<
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

interface DeriveGenericTemplateModelApi extends
  Pick<
    __DeriveIntermediateModelApi<irrelevantAny, irrelevantAny>,
    'schemaTypeChecker' | 'schemaMapResult'
  > {
  someGenericTemplateModelType: __DeriveIntermediateModelApi<
    Typescript.TypeReference,
    irrelevantAny
  >['someModelType'];
}

function deriveGenericTemplateModel(
  api: DeriveGenericTemplateModelApi,
) {
  const { schemaTypeChecker, schemaMapResult, someGenericTemplateModelType } =
    api;
  return __deriveIntermediateModel({
    isCachedResultKind: isCachedResultKind__deriveGenericTemplateModel,
    deriveResultModel: deriveResultModel__deriveGenericTemplateModel,
    schemaTypeChecker,
    schemaMapResult,
    someModelType: someGenericTemplateModelType,
  });
}

function isCachedResultKind__deriveGenericTemplateModel(
  maybeCachedResultModel: IntermediateSchemaModel | undefined,
): maybeCachedResultModel is GenericTemplateIntermediateSchemaModel {
  return Boolean(
    maybeCachedResultModel && maybeCachedResultModel.modelKind === 'template' &&
      maybeCachedResultModel.templateKind === 'generic',
  );
}

function deriveResultModel__deriveGenericTemplateModel(
  api: DeriveResultModelApi<
    Typescript.TypeReference,
    GenericTemplateIntermediateSchemaModel
  >,
): GenericTemplateIntermediateSchemaModel {
  const { modelKey, modelSymbol, modelTemplates, modelProperties } = api;
  return {
    modelKind: 'template',
    templateKind: 'generic',
    modelKey,
    modelSymbol,
    modelTemplates,
    modelProperties,
    genericParameters: [],
  };
}

interface __DeriveIntermediateModelApi<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
> extends Pick<DeriveSchemaMapApi, 'schemaTypeChecker'> {
  schemaMapResult: IntermediateSchemaMap;
  someModelType: ThisModelType;
  isCachedResultKind: (
    maybeCachedResultModel: IntermediateSchemaModel | undefined,
  ) => maybeCachedResultModel is ThisResultModel;
  deriveResultModel: (
    api: DeriveResultModelApi<ThisModelType, ThisResultModel>,
  ) => ThisResultModel;
}

interface DeriveResultModelApi<
  ModelType extends Typescript.Type,
  ResultModel extends IntermediateSchemaModel,
> extends
  Pick<
    __DeriveIntermediateModelApi<ModelType, ResultModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  >,
  Pick<
    ResultModel,
    'modelKey' | 'modelSymbol' | 'modelTemplates' | 'modelProperties'
  > {}

function __deriveIntermediateModel<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
>(
  api: __DeriveIntermediateModelApi<ThisModelType, ThisResultModel>,
): ThisResultModel {
  const {
    someModelType,
    schemaMapResult,
    isCachedResultKind,
    deriveResultModel,
    schemaTypeChecker,
  } = api;
  // todo:
  //    1. check if declaration symbol for `someModelType` is unique, a.k.a,
  //       check for naming collisions with other processed model type declarations
  //
  //    2. derive deterministic `modelKey` from symbol (append suffix if declaration symbol not unique)
  //
  const modelSymbol = someModelType.symbol.name;
  const modelKey = modelSymbol;
  const maybeCachedResultModel = schemaMapResult.schemaModels[modelKey];
  if (isCachedResultKind(maybeCachedResultModel)) {
    return maybeCachedResultModel;
  }
  const resultModel = deriveResultModel({
    someModelType,
    schemaMapResult,
    schemaTypeChecker,
    modelSymbol,
    modelKey,
    modelTemplates: deriveModelTemplates({
      someModelType,
      schemaMapResult,
      schemaTypeChecker,
    }),
    modelProperties: deriveModelProperties({
      someModelType,
      schemaMapResult,
      schemaTypeChecker,
    }),
  });
  schemaMapResult.schemaModels[resultModel.modelKey] = resultModel;
  return resultModel;
}

interface DeriveModelTemplatesApi<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisModelType, ThisResultModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  > {}

function deriveModelTemplates<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
>(
  api: DeriveModelTemplatesApi<ThisModelType, ThisResultModel>,
): ThisResultModel['modelTemplates'] {
  const { someModelType, schemaTypeChecker, schemaMapResult } = api;
  const modelTemplateTypes = someModelType.getBaseTypes() ?? [];
  return modelTemplateTypes.map<ThisResultModel['modelTemplates'][number]>(
    (someModelTemplateType) => {
      if (isInterfaceType(someModelTemplateType)) {
        const concreteTemplateModel = deriveConcreteTemplateModel({
          schemaTypeChecker,
          schemaMapResult,
          someConcreteTemplateModelType: someModelTemplateType,
        });
        return {
          templateKind: 'concrete',
          templateModelKey: concreteTemplateModel.modelKey,
        };
      } else if (
        isTypeReference(someModelTemplateType) &&
        isInterfaceType(someModelTemplateType.target)
      ) {
        const genericTemplateModel = deriveGenericTemplateModel({
          schemaTypeChecker,
          schemaMapResult,
          someGenericTemplateModelType: someModelTemplateType,
        });
        return {
          templateKind: 'generic',
          templateModelKey: genericTemplateModel.modelKey,
          genericArguments: deriveGenericArguments({
            someGenericModelTemplateType: someModelTemplateType,
          }),
        };
      } else {
        throwUserError(
          `invalid model template: ${
            schemaTypeChecker.typeToString(someModelTemplateType)
          } on ${someModelType.symbol.name}`,
        );
      }
    },
  );
}

interface DeriveGenericArgumentsApi {
  someGenericModelTemplateType: Typescript.TypeReference;
}

function deriveGenericArguments<
  ThisResultModel extends IntermediateSchemaModel,
>(
  api: DeriveGenericArgumentsApi,
): GenericModelTemplate<
  ExtractModelElement<ThisResultModel>
>['genericArguments'] {
  const { someGenericModelTemplateType } = api;
  const argumentElementTypes = someGenericModelTemplateType.typeArguments ??
    throwInvalidPathError('argumentElementTypes');
  return argumentElementTypes.reduce<
    GenericModelTemplate<
      ExtractModelElement<ThisResultModel>
    >['genericArguments']
  >((argumentsResult, someArgumentElementType) => {
    return argumentsResult;
  }, {});
}

interface DeriveModelPropertiesApi<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisModelType, ThisResultModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  > {}

function deriveModelProperties<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
>(
  api: DeriveModelPropertiesApi<ThisModelType, ThisResultModel>,
): ThisResultModel['modelProperties'] {
  const { someModelType, schemaTypeChecker, schemaMapResult } = api;
  const typeProperties = (someModelType.symbol.members &&
    Array.from(someModelType.symbol.members.values()).filter(
      isPropertySymbol,
    )) ??
    [];
  return typeProperties.reduce<ThisResultModel['modelProperties']>(
    (modelPropertiesResult, someTypeProperty) => {
      const propertyKey = someTypeProperty.name;
      modelPropertiesResult[propertyKey] = {
        propertyKey,
        propertyElement: derivePropertyElement({
          someModelType,
          schemaTypeChecker,
          schemaMapResult,
          propertyKey,
          someElementType: schemaTypeChecker.getTypeOfSymbol(someTypeProperty),
        }),
      };
      return modelPropertiesResult;
    },
    {},
  );
}

interface DerivePropertyElementApi {}

function derivePropertyElement(
  api: DerivePropertyElementApi,
) {
}

interface __DeriveModelElementApi {}

function __deriveModelElement(api: __DeriveModelElementApi) {}
