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
  isBooleanLiteralType,
  isBooleanType,
  isContrainedParameterType,
  isInterfaceType,
  isNumberLiteralType,
  isNumberType,
  isParameterType,
  isPropertySymbol,
  isStringLiteralType,
  isStringType,
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
    __DeriveDefinitiveModel<irrelevantAny, irrelevantAny>,
    'schemaTypeChecker' | 'schemaMapResult'
  > {
  someDataModelType: __DeriveDefinitiveModel<
    Typescript.InterfaceType,
    irrelevantAny
  >['someModelType'];
}

function deriveDataModel(api: DeriveDataModelApi) {
  const { schemaTypeChecker, schemaMapResult, someDataModelType } = api;
  return __deriveDefinitiveModel({
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
    __DeriveDefinitiveModel<irrelevantAny, irrelevantAny>,
    'schemaTypeChecker' | 'schemaMapResult'
  > {
  someConcreteTemplateModelType: __DeriveDefinitiveModel<
    Typescript.InterfaceType,
    irrelevantAny
  >['someModelType'];
}

function deriveConcreteTemplateModel(
  api: DeriveConcreteTemplateModelApi,
) {
  const { schemaTypeChecker, schemaMapResult, someConcreteTemplateModelType } =
    api;
  return __deriveDefinitiveModel({
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

interface __DeriveDefinitiveModel<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisModelType, ThisResultModel>,
    | 'isCachedResultKind'
    | 'deriveResultModel'
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'someModelType'
  > {}

function __deriveDefinitiveModel<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
>(api: __DeriveDefinitiveModel<ThisModelType, ThisResultModel>) {
  const {
    isCachedResultKind,
    deriveResultModel,
    schemaTypeChecker,
    schemaMapResult,
    someModelType,
  } = api;
  return __deriveIntermediateModel({
    elementTypeCases: getDefinitiveElementTypeCases<ThisResultModel>(),
    isCachedResultKind,
    deriveResultModel,
    schemaTypeChecker,
    schemaMapResult,
    someModelType,
  });
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
    elementTypeCases: getGenericElementTypeCases(),
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
  const {
    modelKey,
    modelSymbol,
    modelTemplates,
    modelProperties,
    someModelType,
  } = api;
  const genericTypeParameters = someModelType.target.typeParameters ??
    throwInvalidPathError('genericTypeParameters');
  return {
    modelKind: 'template',
    templateKind: 'generic',
    modelKey,
    modelSymbol,
    modelTemplates,
    modelProperties,
    genericParameters: genericTypeParameters.map((
      someGenericTypeParameter,
    ) => ({
      parameterSymbol: someGenericTypeParameter.symbol.name,
    })),
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
  elementTypeCases: Array<
    ElementTypeCase<ThisResultModel, Typescript.Type>
  >;
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
    elementTypeCases,
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
      elementTypeCases,
    }),
    modelProperties: deriveModelProperties({
      someModelType,
      schemaMapResult,
      schemaTypeChecker,
      elementTypeCases,
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
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'elementTypeCases'
    | 'someModelType'
  > {}

function deriveModelTemplates<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
>(
  api: DeriveModelTemplatesApi<ThisModelType, ThisResultModel>,
): ThisResultModel['modelTemplates'] {
  const {
    someModelType,
    schemaTypeChecker,
    schemaMapResult,
    elementTypeCases,
  } = api;
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
            someModelType,
            schemaTypeChecker,
            schemaMapResult,
            elementTypeCases,
            genericTemplateModel,
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

interface DeriveGenericArgumentsApi<
  ThisResultModel extends IntermediateSchemaModel,
> extends
  Pick<
    DeriveModelTemplatesApi<irrelevantAny, ThisResultModel>,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'elementTypeCases'
    | 'someModelType'
  > {
  genericTemplateModel: GenericTemplateIntermediateSchemaModel;
  someGenericModelTemplateType: Typescript.TypeReference;
}

function deriveGenericArguments<
  ThisResultModel extends IntermediateSchemaModel,
>(
  api: DeriveGenericArgumentsApi<ThisResultModel>,
): GenericModelTemplate<
  GetThisModelElement<ThisResultModel>
>['genericArguments'] {
  const {
    someGenericModelTemplateType,
    genericTemplateModel,
    someModelType,
    schemaTypeChecker,
    schemaMapResult,
    elementTypeCases,
  } = api;
  const argumentElementTypes = someGenericModelTemplateType.typeArguments ??
    throwInvalidPathError('argumentElementTypes');
  return argumentElementTypes.reduce<
    GenericModelTemplate<
      GetThisModelElement<ThisResultModel>
    >['genericArguments']
  >((argumentsResult, someArgumentElementType, argumentIndex) => {
    const argumentParameter =
      genericTemplateModel.genericParameters[argumentIndex] ??
        throwInvalidPathError('argumentParameter');
    const argumentSymbol = argumentParameter.parameterSymbol;
    argumentsResult[argumentSymbol] = {
      argumentIndex,
      argumentSymbol,
      argumentElement: deriveArgumentElement({
        someGenericModelTemplateType,
        someModelType,
        schemaTypeChecker,
        schemaMapResult,
        elementTypeCases,
        someArgumentElementType,
      }),
    };
    return argumentsResult;
  }, {});
}

interface DeriveModelPropertiesApi<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisModelType, ThisResultModel>,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'elementTypeCases'
    | 'someModelType'
  > {}

function deriveModelProperties<
  ThisModelType extends Typescript.Type,
  ThisResultModel extends IntermediateSchemaModel,
>(
  api: DeriveModelPropertiesApi<ThisModelType, ThisResultModel>,
): ThisResultModel['modelProperties'] {
  const {
    someModelType,
    schemaTypeChecker,
    schemaMapResult,
    elementTypeCases,
  } = api;
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
          elementTypeCases,
          propertyKey,
          somePropertyElementType: schemaTypeChecker.getTypeOfSymbol(
            someTypeProperty,
          ),
        }),
      };
      return modelPropertiesResult;
    },
    {},
  );
}

function getDefinitiveElementTypeCases<
  ThisResultModel extends IntermediateSchemaModel,
>() {
  return __getElementTypeCases<ThisResultModel>({
    uniqueElementTypeCases: [],
  });
}

function getGenericElementTypeCases() {
  return __getElementTypeCases<GenericTemplateIntermediateSchemaModel>({
    uniqueElementTypeCases: [{
      assertCase: isContrainedParameterType,
      handleCase: ({ someElementType }) => ({
        elementKind: 'parameter',
        parameterKind: 'constrained',
        parameterSymbol: someElementType.symbol.name,
      }),
    }, {
      assertCase: isParameterType,
      handleCase: ({ someElementType }) => ({
        elementKind: 'parameter',
        parameterKind: 'basic',
        parameterSymbol: someElementType.symbol.name,
      }),
    }],
  });
}

interface __GetElementTypeCasesApi<
  ThisResultModel extends IntermediateSchemaModel,
> {
  uniqueElementTypeCases: Array<
    ElementTypeCase<ThisResultModel, Typescript.Type>
  >;
}

function __getElementTypeCases<
  ThisResultModel extends IntermediateSchemaModel,
>(
  api: __GetElementTypeCasesApi<ThisResultModel>,
): Array<ElementTypeCase<ThisResultModel, Typescript.Type>> {
  const { uniqueElementTypeCases } = api;
  return [
    {
      assertCase: isStringLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'literal',
        literalKind: 'string',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    },
    {
      assertCase: isNumberLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'literal',
        literalKind: 'number',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    },
    {
      assertCase: isBooleanLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'literal',
        literalKind: 'boolean',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    },
    {
      assertCase: isStringType,
      handleCase: () => ({
        elementKind: 'primitive',
        primitiveKind: 'string',
      }),
    },
    {
      assertCase: isNumberType,
      handleCase: () => ({
        elementKind: 'primitive',
        primitiveKind: 'number',
      }),
    },
    {
      assertCase: isBooleanType,
      handleCase: () => ({
        elementKind: 'primitive',
        primitiveKind: 'boolean',
      }),
    },
    {
      assertCase: isInterfaceType,
      handleCase: (
        { schemaTypeChecker, schemaMapResult, someElementType },
      ) => {
        const elementDataModel = deriveDataModel({
          schemaTypeChecker,
          schemaMapResult,
          someDataModelType: someElementType as any,
        });
        return {
          elementKind: 'dataModel',
          dataModelKey: elementDataModel.modelKey,
        };
      },
    },
    ...uniqueElementTypeCases,
  ];
}

interface ElementTypeCase<
  ThisResultModel extends IntermediateSchemaModel,
  ThisElementType extends Typescript.Type,
> {
  assertCase: (
    someElementType: Typescript.Type,
  ) => someElementType is ThisElementType;
  handleCase: (
    api: ElementTypeCaseHandlerApi<ThisElementType>,
  ) => GetThisModelElement<ThisResultModel>;
}

interface ElementTypeCaseHandlerApi<ThisElementType extends Typescript.Type>
  extends
    Pick<
      __DeriveModelElementApi<irrelevantAny>,
      'schemaTypeChecker' | 'schemaMapResult'
    > {
  someElementType: ThisElementType;
}

interface DeriveArgumentElementApi extends
  Pick<
    DeriveGenericArgumentsApi<irrelevantAny>,
    'someModelType' | 'someGenericModelTemplateType'
  >,
  Pick<
    __DeriveModelElementApi<
      irrelevantAny
    >,
    'schemaTypeChecker' | 'schemaMapResult' | 'elementTypeCases'
  > {
  someArgumentElementType: __DeriveModelElementApi<
    irrelevantAny
  >['someElementType'];
}

function deriveArgumentElement(api: DeriveArgumentElementApi) {
  const {
    someArgumentElementType,
    someGenericModelTemplateType,
    someModelType,
    schemaTypeChecker,
    schemaMapResult,
    elementTypeCases,
  } = api;
  return __deriveModelElement({
    invalidModelElementMessage: `invalid model argument: ${
      schemaTypeChecker.typeToString(someArgumentElementType)
    } in ${schemaTypeChecker.typeToString(someGenericModelTemplateType)} on ${
      schemaTypeChecker.typeToString(someModelType)
    }`,
    schemaTypeChecker,
    schemaMapResult,
    elementTypeCases,
    someElementType: someArgumentElementType,
  });
}

interface DerivePropertyElementApi extends
  Pick<
    DeriveModelPropertiesApi<irrelevantAny, irrelevantAny>,
    'someModelType'
  >,
  Pick<
    __DeriveModelElementApi<
      irrelevantAny
    >,
    'schemaTypeChecker' | 'schemaMapResult' | 'elementTypeCases'
  > {
  propertyKey: string;
  somePropertyElementType: __DeriveModelElementApi<
    irrelevantAny
  >['someElementType'];
}

function derivePropertyElement(
  api: DerivePropertyElementApi,
) {
  const {
    someModelType,
    propertyKey,
    schemaTypeChecker,
    schemaMapResult,
    elementTypeCases,
    somePropertyElementType,
  } = api;
  return __deriveModelElement({
    invalidModelElementMessage: `invalid model property: ${
      schemaTypeChecker.typeToString(someModelType)
    }["${propertyKey}"]`,
    schemaTypeChecker,
    schemaMapResult,
    elementTypeCases,
    someElementType: somePropertyElementType,
  });
}

interface __DeriveModelElementApi<
  ThisResultModel extends IntermediateSchemaModel,
> extends
  Pick<
    __DeriveIntermediateModelApi<irrelevantAny, ThisResultModel>,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'elementTypeCases'
  > {
  invalidModelElementMessage: string;
  someElementType: Typescript.Type;
}

function __deriveModelElement<ThisResultModel extends IntermediateSchemaModel>(
  api: __DeriveModelElementApi<ThisResultModel>,
): GetThisModelElement<ThisResultModel> {
  const {
    elementTypeCases,
    someElementType,
    schemaTypeChecker,
    schemaMapResult,
    invalidModelElementMessage,
  } = api;
  const targetElementTypeCase = elementTypeCases.find((someElementTypeCase) =>
    someElementTypeCase.assertCase(someElementType)
  );
  return targetElementTypeCase
    ? targetElementTypeCase.handleCase({
      someElementType,
      schemaTypeChecker,
      schemaMapResult,
    })
    : throwUserError(invalidModelElementMessage);
}

type GetThisModelElement<
  ThisResultModel extends IntermediateSchemaModel_Core<any, any>,
> = ThisResultModel['modelProperties'][string]['propertyElement'];
