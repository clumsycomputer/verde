import {
  throwInvalidPathError
} from '../../helpers/throwError.ts';
import { genericAny, irrelevantAny } from '../../helpers/types.ts';
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
  throwInvalidModelElement,
  throwInvalidModelTemplate,
  throwInvalidTopLevelModel,
  throwSchemaExportNotTuple,
} from './errors.ts';
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
  LoadSchemaModuleResult,
  loadSchemaModule,
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

export interface DeriveSchemaMapApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportType'
  > {}

function deriveSchemaMap(api: DeriveSchemaMapApi): IntermediateSchemaMap {
  const { schemaTypeChecker, rhsSchemaExportType, lhsSchemaExportSymbol } = api;
  if (false === schemaTypeChecker.isTupleType(rhsSchemaExportType)) {
    throwSchemaExportNotTuple({
      schemaTypeChecker,
      rhsSchemaExportType,
      lhsSchemaExportSymbol,
    });
  }
  const schemaMapResult: IntermediateSchemaMap = {
    schemaSymbol: lhsSchemaExportSymbol.name,
    schemaModels: {},
  };
  const topLevelDataModelTypes = (isTypeReference(rhsSchemaExportType) &&
    schemaTypeChecker.getTypeArguments(rhsSchemaExportType)) ||
    throwInvalidPathError('topLevelDataModelTypes');
  topLevelDataModelTypes.forEach((someTopLevelDataModelType) => {
    if (false === isInterfaceType(someTopLevelDataModelType)) {
      throwInvalidTopLevelModel({
        schemaTypeChecker,
        someTopLevelDataModelType,
      });
    }
    deriveDataModel({
      schemaTypeChecker,
      schemaMapResult,
      someDataModelType: someTopLevelDataModelType,
    });
  });
  return schemaMapResult;
}

interface DeriveDataModelApi extends
  Pick<
    Defined__DeriveIntermediateModelApi,
    'schemaTypeChecker' | 'schemaMapResult'
  > {
  someDataModelType: Typescript.InterfaceType;
}

function deriveDataModel(api: DeriveDataModelApi): DataIntermediateSchemaModel {
  const {
    schemaTypeChecker,
    schemaMapResult,
    someDataModelType,
  } = api;
  return __deriveDefinitiveModel({
    isCachedResultKind: isCachedResultKind__deriveDataModel,
    deriveResultModel: deriveResultModel__deriveDataModel,
    schemaTypeChecker,
    schemaMapResult,
    someModelType: someDataModelType,
    typeContext: [{
      infoKind: 'dataModel',
      infoType: someDataModelType,
    }],
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
  const { modelSymbolKey, modelTemplates, modelProperties } = api;
  return {
    modelKind: 'data',
    modelSymbolKey,
    modelTemplates,
    modelProperties,
  };
}

interface DeriveConcreteTemplateModelApi
  extends Defined__DeriveIntermediateModelApi {
  someConcreteTemplateModelType: Typescript.InterfaceType;
}

function deriveConcreteTemplateModel(
  api: DeriveConcreteTemplateModelApi,
) {
  const {
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
    someConcreteTemplateModelType,
  } = api;
  return __deriveDefinitiveModel({
    isCachedResultKind: isCachedResultKind__deriveConcreteTemplateModel,
    deriveResultModel: deriveResultModel__deriveConcreteTemplateModel,
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
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
  const { modelSymbolKey, modelTemplates, modelProperties } = api;
  return {
    modelKind: 'template',
    templateKind: 'concrete',
    modelSymbolKey,
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
    | 'typeContext'
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
    typeContext,
    someModelType,
  } = api;
  return __deriveIntermediateModel({
    elementTypeCases:
      getDefinitiveElementTypeCases() satisfies VerifiedElementTypeCases<
        ElementTypeCase<
          CoreIntermediateModelElement,
          Typescript.Type
        >,
        ReturnType<typeof getDefinitiveElementTypeCases>
      > as Array<
        ElementTypeCase<
          CoreIntermediateModelElement,
          Typescript.Type
        >
      >,
    isCachedResultKind,
    deriveResultModel,
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
    someModelType,
  });
}

interface DeriveGenericTemplateModelApi
  extends Defined__DeriveIntermediateModelApi {
  someGenericTemplateModelType: Typescript.TypeReference;
}

function deriveGenericTemplateModel(
  api: DeriveGenericTemplateModelApi,
) {
  const {
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
    someGenericTemplateModelType,
  } = api;
  return __deriveIntermediateModel({
    isCachedResultKind: isCachedResultKind__deriveGenericTemplateModel,
    deriveResultModel: deriveResultModel__deriveGenericTemplateModel,
    elementTypeCases:
      getGenericElementTypeCases() satisfies VerifiedElementTypeCases<
        ElementTypeCase<
          GenericTemplateIntermediateModelElement,
          Typescript.Type
        >,
        ReturnType<typeof getGenericElementTypeCases>
      > as Array<
        ElementTypeCase<
          GenericTemplateIntermediateModelElement,
          Typescript.Type
        >
      >,
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
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
    modelSymbolKey,
    modelTemplates,
    modelProperties,
    someModelType,
  } = api;
  const genericTypeParameters = someModelType.target.typeParameters ??
    throwInvalidPathError('genericTypeParameters');
  return {
    modelKind: 'template',
    templateKind: 'generic',
    modelSymbolKey,
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
  Defined__DeriveIntermediateModelApi,
  Custom__DeriveIntermediateModelApi<
    ThisResultModel,
    ThisModelType
  > {
}

interface Defined__DeriveIntermediateModelApi
  extends Pick<DeriveSchemaMapApi, 'schemaTypeChecker'> {
  schemaMapResult: IntermediateSchemaMap;
  typeContext: TypeContext;
}

type TypeContext = [
  DataModelTypeInfo,
  ...Array<SecondaryModelTypeInfo>,
];

interface DataModelTypeInfo extends __TypeInfo<'dataModel'> {}

type SecondaryModelTypeInfo = TemplateTypeInfo | ElementTypeInfo;

type TemplateTypeInfo = ConcreteTemplateTypeInfo | GenericTemplateTypeInfo;

interface ConcreteTemplateTypeInfo extends __TemplateTypeInfo<'concrete'> {}

interface GenericTemplateTypeInfo extends __TemplateTypeInfo<'generic'> {}

interface __TemplateTypeInfo<TemplateKind> extends __TypeInfo<'template'> {
  templateKind: TemplateKind;
}

type ElementTypeInfo = ArgumentElementTypeInfo | PropertyElementTypeInfo;

interface ArgumentElementTypeInfo extends __ElementTypeInfo<'argument'> {}

interface PropertyElementTypeInfo extends __ElementTypeInfo<'property'> {
  propertyKey: string;
}

interface __ElementTypeInfo<ElementKind> extends __TypeInfo<'element'> {
  elementKind: ElementKind;
}

interface __TypeInfo<InfoKind> {
  infoKind: InfoKind;
  infoType: Typescript.Type;
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
    'modelSymbolKey' | 'modelTemplates' | 'modelProperties'
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
    typeContext,
    elementTypeCases,
  } = api;
  // todo:
  //    1. check if declaration symbol for `someModelType` is unique, a.k.a,
  //       check for naming collisions with other processed model type declarations
  //
  //    2. if declaration symbol not unique, throw user error
  //
  const modelSymbolKey = someModelType.symbol.name;
  const maybeCachedResultModel = schemaMapResult.schemaModels[modelSymbolKey];
  if (isCachedResultKind(maybeCachedResultModel)) {
    return maybeCachedResultModel;
  }
  const resultModel = deriveResultModel({
    someModelType,
    schemaMapResult,
    schemaTypeChecker,
    modelSymbolKey,
    modelTemplates: deriveModelTemplates({
      someModelType,
      schemaMapResult,
      schemaTypeChecker,
      typeContext,
      elementTypeCases,
    }),
    modelProperties: deriveModelProperties({
      someModelType,
      schemaMapResult,
      schemaTypeChecker,
      typeContext,
      elementTypeCases,
    }),
  });
  schemaMapResult.schemaModels[resultModel.modelSymbolKey] = resultModel;
  return resultModel;
}

export interface DeriveModelTemplatesApi<
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
    | 'typeContext'
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
    typeContext,
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
          typeContext: [
            ...typeContext,
            {
              infoKind: 'template',
              templateKind: 'concrete',
              infoType: someModelTemplateType,
            },
          ],
        });
        return {
          templateKind: 'concrete',
          templateModelSymbolKey: concreteTemplateModel.modelSymbolKey,
        };
      } else if (
        isTypeReference(someModelTemplateType) &&
        isInterfaceType(someModelTemplateType.target)
      ) {
        const genericTemplateModel = deriveGenericTemplateModel({
          schemaTypeChecker,
          schemaMapResult,
          someGenericTemplateModelType: someModelTemplateType,
          typeContext: [
            ...typeContext,
            {
              infoKind: 'template',
              templateKind: 'generic',
              infoType: someModelTemplateType,
            },
          ],
        });
        return {
          templateKind: 'generic',
          templateModelSymbolKey: genericTemplateModel.modelSymbolKey,
          genericArguments: deriveGenericArguments({
            schemaTypeChecker,
            schemaMapResult,
            typeContext,
            elementTypeCases,
            genericTemplateModel,
            someGenericModelTemplateType: someModelTemplateType,
          }),
        };
      } else {
        throwInvalidModelTemplate({
          schemaTypeChecker,
          someModelType,
          someModelTemplateType,
        });
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
    | 'typeContext'
    | 'elementTypeCases'
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
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
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
    const argumentSymbolKey = argumentParameter.parameterSymbol;
    argumentsResult[argumentSymbolKey] = {
      argumentIndex,
      argumentSymbolKey,
      argumentElement: deriveModelElement({
        schemaTypeChecker,
        schemaMapResult,
        elementTypeCases,
        someElementType: someArgumentElementType,
        typeContext: [
          ...typeContext,
          {
            infoKind: 'element',
            elementKind: 'argument',
            infoType: someArgumentElementType,
          },
        ],
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
    | 'typeContext'
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
    typeContext,
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
      const somePropertyElementType = schemaTypeChecker.getTypeOfSymbol(
        someTypeProperty,
      );
      modelPropertiesResult[propertyKey] = {
        propertyKey,
        propertyElement: deriveModelElement({
          schemaTypeChecker,
          schemaMapResult,
          elementTypeCases,
          someElementType: somePropertyElementType,
          typeContext: [
            ...typeContext,
            {
              infoKind: 'element',
              elementKind: 'property',
              propertyKey,
              infoType: somePropertyElementType,
            },
          ],
        }),
      };
      return modelPropertiesResult;
    },
    {},
  );
}

export interface DeriveModelElementApi<
  ThisResultModel extends IntermediateSchemaModel,
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisResultModel, irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'typeContext'
    | 'elementTypeCases'
  > {
  someElementType: Typescript.Type;
}

function deriveModelElement<ThisResultModel extends IntermediateSchemaModel>(
  api: DeriveModelElementApi<ThisResultModel>,
): GetThisModelElement<ThisResultModel> {
  const {
    elementTypeCases,
    someElementType,
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
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
    : throwInvalidModelElement({
      schemaTypeChecker,
      typeContext,
    });
}

type GetThisModelElement<ThisResultModel extends IntermediateSchemaModel> =
  ThisResultModel['modelProperties'][string]['propertyElement'];

function getDefinitiveElementTypeCases() {
  return __getElementTypeCases({
    uniqueElementTypeCases: [],
  });
}

function getGenericElementTypeCases() {
  return __getElementTypeCases({
    uniqueElementTypeCases: [
      elementTypeCase({
        assertCase: isContrainedParameterType,
        handleCase: ({ someElementType }) => ({
          elementKind: 'parameter',
          parameterKind: 'constrained',
          parameterSymbol: someElementType.symbol.name,
        }),
      }),
      elementTypeCase({
        assertCase: isParameterType,
        handleCase: ({ someElementType }) => ({
          elementKind: 'parameter',
          parameterKind: 'basic',
          parameterSymbol: someElementType.symbol.name,
        }),
      }),
    ],
  });
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
  return getExtendedTuple([
    elementTypeCase({
      assertCase: isStringLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'literal',
        literalKind: 'string',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    }),
    elementTypeCase({
      assertCase: isNumberLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'literal',
        literalKind: 'number',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    }),
    elementTypeCase({
      assertCase: isBooleanLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'literal',
        literalKind: 'boolean',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    }),
    elementTypeCase({
      assertCase: isStringType,
      handleCase: () => ({
        elementKind: 'primitive',
        primitiveKind: 'string',
      }),
    }),
    elementTypeCase({
      assertCase: isNumberType,
      handleCase: () => ({
        elementKind: 'primitive',
        primitiveKind: 'number',
      }),
    }),
    elementTypeCase({
      assertCase: isBooleanType,
      handleCase: () => ({
        elementKind: 'primitive',
        primitiveKind: 'boolean',
      }),
    }),
    elementTypeCase({
      assertCase: isInterfaceType,
      handleCase: (
        {
          schemaTypeChecker,
          schemaMapResult,
          someElementType,
        },
      ) => {
        const elementDataModel = deriveDataModel({
          schemaTypeChecker,
          schemaMapResult,
          someDataModelType: someElementType,
        });
        return {
          elementKind: 'dataModel',
          dataModelSymbolKey: elementDataModel.modelSymbolKey,
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

interface ElementTypeCaseHandlerApi<ThisElementType> extends
  Pick<
    DeriveModelElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaMapResult'
  > {
  someElementType: ThisElementType;
}

function getExtendedTuple<
  ThisCoreTuple extends [genericAny, ...Array<genericAny>],
  ThisExtensionTuple extends [genericAny, ...Array<genericAny>] | [],
>(
  thisCoreTuple: ThisCoreTuple,
  thisExtensionTuple: ThisExtensionTuple,
): [...ThisCoreTuple, ...ThisExtensionTuple] {
  return [...thisCoreTuple, ...thisExtensionTuple];
}

function elementTypeCase<
  ThisModelElement extends IntermediateSchemaModel['modelProperties'][string][
    'propertyElement'
  ],
  ThisElementType extends Typescript.Type,
>(thisElementTypeCase: ElementTypeCase<ThisModelElement, ThisElementType>) {
  return thisElementTypeCase;
}

type VerifiedElementTypeCases<
  TargetElementTypeCase extends ElementTypeCase<genericAny, genericAny>,
  ThisElementTypeCases extends Array<ElementTypeCase<genericAny, genericAny>>,
> = VerifyElementTypeCases<
  TargetElementTypeCase,
  ThisElementTypeCases,
  []
>;

type VerifyElementTypeCases<
  TargetElementTypeCase extends ElementTypeCase<genericAny, genericAny>,
  CurrentElementTypeCases extends Array<genericAny>,
  ResultElementTypeCases extends Array<
    CurrentElementTypeCases[number]
  >,
> = TargetElementTypeCase extends
  ElementTypeCase<infer TargetModelElement, infer TargetElementType>
  ? CurrentElementTypeCases extends
    [infer CurrentElementTypeCase, ...infer RemainingElementTypeCases]
    ? CurrentElementTypeCase extends
      ElementTypeCase<infer CurrentModelElement, infer CurrentElementType>
      ? CurrentModelElement extends TargetModelElement
        ? CurrentElementType extends TargetElementType ? VerifyElementTypeCases<
            TargetElementTypeCase,
            RemainingElementTypeCases,
            [
              ...ResultElementTypeCases,
              CurrentElementTypeCase,
            ]
          >
        : never
      : never
    : never
  : ResultElementTypeCases
  : never;
