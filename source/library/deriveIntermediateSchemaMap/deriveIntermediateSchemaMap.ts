import {
  throwInvalidPathError,
  throwUserError,
} from '../../helpers/throwError.ts';
import { irrelevantAny } from '../../helpers/types.ts';
import { Typescript } from '../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateSchemaModel,
  CoreIntermediateModelElement,
  DataIntermediateSchemaModel,
  GenericModelTemplate,
  GenericTemplateIntermediateModelElement,
  GenericTemplateIntermediateSchemaModel,
  IntermediateSchemaMap,
  IntermediateSchemaModel,
} from '../types/IntermediateSchemaMap.ts';
import { ModelElementBase } from '../types/SchemaMap.ts';
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

interface DeriveDataModelApi extends Static__DeriveIntermediateModelApi {
  someDataModelType: Typescript.InterfaceType;
}

function deriveDataModel(api: DeriveDataModelApi): DataIntermediateSchemaModel {
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
    DataIntermediateSchemaModel,
    Typescript.InterfaceType
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

interface DeriveConcreteTemplateModelApi
  extends Static__DeriveIntermediateModelApi {
  someConcreteTemplateModelType: Typescript.InterfaceType;
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
    ConcreteTemplateIntermediateSchemaModel,
    Typescript.InterfaceType
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
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisResultModel,
      ThisModelType
    >,
    | 'isCachedResultKind'
    | 'deriveResultModel'
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'someModelType'
  > {}

function __deriveDefinitiveModel<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
>(
  api: __DeriveDefinitiveModel<
    ThisResultModel,
    ThisModelType
  >,
) {
  const {
    isCachedResultKind,
    deriveResultModel,
    schemaTypeChecker,
    schemaMapResult,
    someModelType,
  } = api;
  return __deriveIntermediateModel({
    elementTypeCases: getDefinitiveElementTypeCases(),
    isCachedResultKind,
    deriveResultModel,
    schemaTypeChecker,
    schemaMapResult,
    someModelType,
  });
}

interface DeriveGenericTemplateModelApi
  extends Static__DeriveIntermediateModelApi {
  someGenericTemplateModelType: Typescript.TypeReference;
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
    GenericTemplateIntermediateSchemaModel,
    Typescript.TypeReference
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
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Static__DeriveIntermediateModelApi,
  Custom__DeriveIntermediateModelApi<
    ThisResultModel,
    ThisModelType
  > {
}

interface Static__DeriveIntermediateModelApi
  extends Pick<DeriveSchemaMapApi, 'schemaTypeChecker'> {
  schemaMapResult: IntermediateSchemaMap;
}

interface Custom__DeriveIntermediateModelApi<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> {
  isCachedResultKind: (
    maybeCachedResultModel: IntermediateSchemaModel | undefined,
  ) => maybeCachedResultModel is ThisResultModel;
  deriveResultModel: (
    api: DeriveResultModelApi<ThisResultModel, ThisModelType>,
  ) => ThisResultModel;
  elementTypeCases: Array<
    ElementTypeCase<
      GetThisModelElement<ThisResultModel>,
      Typescript.Type
    >
  >;
  someModelType: ThisModelType;
}

interface DeriveResultModelApi<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      irrelevantAny,
      ThisModelType
    >,
    'schemaTypeChecker' | 'schemaMapResult' | 'someModelType'
  >,
  Pick<
    ThisResultModel,
    'modelKey' | 'modelSymbol' | 'modelTemplates' | 'modelProperties'
  > {}

function __deriveIntermediateModel<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
>(
  api: __DeriveIntermediateModelApi<
    ThisResultModel,
    ThisModelType
  >,
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
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisResultModel,
      ThisModelType
    >,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'elementTypeCases'
    | 'someModelType'
  > {}

function deriveModelTemplates<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
>(
  api: DeriveModelTemplatesApi<
    ThisResultModel,
    ThisModelType
  >,
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
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    DeriveModelTemplatesApi<
      ThisResultModel,
      ThisModelType
    >,
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
  ThisModelType extends Typescript.Type,
>(
  api: DeriveGenericArgumentsApi<
    ThisResultModel,
    ThisModelType
  >,
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
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisResultModel,
      ThisModelType
    >,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'elementTypeCases'
    | 'someModelType'
  > {}

function deriveModelProperties<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
>(
  api: DeriveModelPropertiesApi<
    ThisResultModel,
    ThisModelType
  >,
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

interface DeriveArgumentElementApi<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    DeriveGenericArgumentsApi<irrelevantAny, ThisModelType>,
    'someModelType' | 'someGenericModelTemplateType'
  >,
  Pick<
    __DeriveModelElementApi<ThisResultModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'elementTypeCases'
  > {
  someArgumentElementType: Typescript.Type;
}

function deriveArgumentElement<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
>(api: DeriveArgumentElementApi<ThisResultModel, ThisModelType>) {
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

interface DerivePropertyElementApi<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    DeriveModelPropertiesApi<irrelevantAny, ThisModelType>,
    'someModelType'
  >,
  Pick<
    __DeriveModelElementApi<ThisResultModel>,
    'schemaTypeChecker' | 'schemaMapResult' | 'elementTypeCases'
  > {
  propertyKey: string;
  somePropertyElementType: Typescript.Type;
}

function derivePropertyElement<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
>(
  api: DerivePropertyElementApi<ThisResultModel, ThisModelType>,
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
    __DeriveIntermediateModelApi<ThisResultModel, irrelevantAny>,
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

type GetThisModelElement<ThisResultModel extends IntermediateSchemaModel> =
  ThisResultModel['modelProperties'][string]['propertyElement'];

function getDefinitiveElementTypeCases() {
  return __getElementTypeCases({
    uniqueElementTypeCases: [],
  }) as Array<
    ElementTypeCase<
      CoreIntermediateModelElement,
      Typescript.Type
    >
  >;
}

function getGenericElementTypeCases() {
  return __getElementTypeCases({
    uniqueElementTypeCases: [
      extensionTypeCase({
        assertCase: isContrainedParameterType,
        handleCase: ({ someElementType }) => ({
          elementKind: 'parameter',
          parameterKind: 'constrained',
          parameterSymbol: someElementType.symbol.name,
        }),
      }),
      extensionTypeCase({
        assertCase: isParameterType,
        handleCase: ({ someElementType }) => ({
          elementKind: 'parameter',
          parameterKind: 'basic',
          parameterSymbol: someElementType.symbol.name,
        }),
      }),
    ],
  }) as Array<
    ElementTypeCase<
      GenericTemplateIntermediateModelElement,
      Typescript.Type
    >
  >;
}

interface __GetElementTypeCasesApi<
  SomeUniqueModelElement extends ModelElementBase<string>,
  SomeUniqueElementType extends Typescript.Type,
  ThisUniqueElementTypeCases extends [
    ElementTypeCase<SomeUniqueModelElement, SomeUniqueElementType>,
    ...Array<ElementTypeCase<SomeUniqueModelElement, SomeUniqueElementType>>,
  ] | [],
> {
  uniqueElementTypeCases: ThisUniqueElementTypeCases;
}

function __getElementTypeCases<
  SomeUniqueModelKind extends string,
  SomeUniqueModelElement extends ModelElementBase<SomeUniqueModelKind>,
  SomeUniqueElementType extends Typescript.Type,
  SomeElementTypeCase extends ElementTypeCase<
    SomeUniqueModelElement,
    SomeUniqueElementType
  >,
  ThisUniqueElementTypeCases extends [
    SomeElementTypeCase,
    ...Array<SomeElementTypeCase>,
  ] | [],
>(
  api: __GetElementTypeCasesApi<
    SomeUniqueModelElement,
    SomeUniqueElementType,
    ThisUniqueElementTypeCases
  >,
) {
  const { uniqueElementTypeCases } = api;
  return extendedTuple([
    extensionTypeCase({
      assertCase: isStringLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'literal',
        literalKind: 'string',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    }),
    extensionTypeCase({
      assertCase: isNumberLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'literal',
        literalKind: 'number',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    }),
    extensionTypeCase({
      assertCase: isBooleanLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'literal',
        literalKind: 'boolean',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    }),
    extensionTypeCase({
      assertCase: isStringType,
      handleCase: () => ({
        elementKind: 'primitive',
        primitiveKind: 'string',
      }),
    }),
    extensionTypeCase({
      assertCase: isNumberType,
      handleCase: () => ({
        elementKind: 'primitive',
        primitiveKind: 'number',
      }),
    }),
    extensionTypeCase({
      assertCase: isBooleanType,
      handleCase: () => ({
        elementKind: 'primitive',
        primitiveKind: 'boolean',
      }),
    }),
    extensionTypeCase({
      assertCase: isInterfaceType,
      handleCase: (
        { schemaTypeChecker, schemaMapResult, someElementType },
      ) => {
        const elementDataModel = deriveDataModel({
          schemaTypeChecker,
          schemaMapResult,
          someDataModelType: someElementType,
        });
        return {
          elementKind: 'dataModel',
          dataModelKey: elementDataModel.modelKey,
        };
      },
    }),
  ], uniqueElementTypeCases);
}

interface ElementTypeCase<
  ThisModelElement extends ModelElementBase<string>,
  ThisElementType extends Typescript.Type,
> {
  assertCase: (
    someElementType: Typescript.Type,
  ) => someElementType is ThisElementType;
  handleCase: (
    api: ElementTypeCaseHandlerApi<ThisElementType>,
  ) => ThisModelElement;
}

interface ElementTypeCaseHandlerApi<ThisElementType extends Typescript.Type>
  extends
    Pick<
      __DeriveModelElementApi<irrelevantAny>,
      'schemaTypeChecker' | 'schemaMapResult'
    > {
  someElementType: ThisElementType;
}

function extendedTuple<
  ThisCoreTuple extends [any, ...Array<any>],
  ThisExtensionTuple extends [any, ...Array<any>] | [],
>(
  thisCoreTuple: ThisCoreTuple,
  thisExtensionTuple: ThisExtensionTuple,
): [...ThisCoreTuple, ...ThisExtensionTuple] {
  return [...thisCoreTuple, ...thisExtensionTuple];
}

function extensionTypeCase<
  ThisModelElement extends IntermediateSchemaModel['modelProperties'][string][
    'propertyElement'
  ],
  ThisElementType extends Typescript.Type,
>(thisExtensionTypeCase: ElementTypeCase<ThisModelElement, ThisElementType>) {
  return thisExtensionTypeCase;
}
