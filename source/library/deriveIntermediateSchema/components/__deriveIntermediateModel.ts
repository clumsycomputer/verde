import { throwInvalidPathError } from '../../../helpers/throwError.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import {
  CoreIntermediateElement,
  DataIntermediateModel,
  GenericTemplateIntermediateElement,
  GetThisIntermediateElement,
  GetThisIntermediateModel,
  IntermediateSchema
} from '../../types/IntermediateSchema.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';
import {
  ElementTypeCase,
  VerifiedElementTypeCases,
  getDefinitiveElementTypeCases,
  getGenericElementTypeCases,
} from './__getElementTypeCases.ts';
import { deriveModelProperties } from './deriveModelProperties.ts';
import { deriveModelTemplates } from './deriveModelTemplates.ts';

export interface DeriveDataModelApi extends
  Pick<
    Defined__DeriveIntermediateModelApi,
    'schemaTypeChecker' | 'schemaResult'
  > {
  someDataModelType: Typescript.InterfaceType;
}

export function deriveDataModel(
  api: DeriveDataModelApi,
): DataIntermediateModel {
  const {
    schemaTypeChecker,
    schemaResult,
    someDataModelType,
  } = api;
  return __deriveDefinitiveModel({
    targetModelKind: 'data',
    deriveTargetModel: deriveTargetModel__deriveDataModel,
    schemaTypeChecker,
    schemaResult,
    someModelType: someDataModelType,
    typeContext: [{
      infoKind: 'dataModel',
      infoType: someDataModelType,
    }],
  });
}

function deriveTargetModel__deriveDataModel(
  api: DeriveTargetModelApi<
    'data',
    Typescript.InterfaceType
  >,
) {
  const { targetModelKind, modelSymbolKey, modelTemplates, modelProperties } =
    api;
  return {
    modelKind: targetModelKind,
    modelSymbolKey,
    modelTemplates,
    modelProperties,
  };
}

export interface DeriveConcreteTemplateModelApi
  extends Defined__DeriveIntermediateModelApi {
  someConcreteTemplateModelType: Typescript.InterfaceType;
}

export function deriveConcreteTemplateModel(
  api: DeriveConcreteTemplateModelApi,
) {
  const {
    schemaTypeChecker,
    schemaResult,
    typeContext,
    someConcreteTemplateModelType,
  } = api;
  return __deriveDefinitiveModel({
    targetModelKind: 'concreteTemplate',
    deriveTargetModel: deriveResultModel__deriveConcreteTemplateModel,
    schemaTypeChecker,
    schemaResult,
    typeContext,
    someModelType: someConcreteTemplateModelType,
  });
}

function deriveResultModel__deriveConcreteTemplateModel(
  api: DeriveTargetModelApi<
    'concreteTemplate',
    Typescript.InterfaceType
  >,
) {
  const { targetModelKind, modelSymbolKey, modelTemplates, modelProperties } =
    api;
  return {
    modelKind: targetModelKind,
    modelSymbolKey,
    modelTemplates,
    modelProperties,
  };
}

interface __DeriveDefinitiveModel<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisTargetModelKind,
      ThisModelType
    >,
    | 'targetModelKind'
    | 'deriveTargetModel'
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'someModelType'
    | 'typeContext'
  > {}

function __deriveDefinitiveModel<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
>(
  api: __DeriveDefinitiveModel<
    ThisTargetModelKind,
    ThisModelType
  >,
) {
  const {
    targetModelKind,
    deriveTargetModel,
    schemaTypeChecker,
    schemaResult,
    typeContext,
    someModelType,
  } = api;
  return __deriveIntermediateModel({
    elementTypeCases:
      getDefinitiveElementTypeCases() satisfies VerifiedElementTypeCases<
        ElementTypeCase<
          CoreIntermediateElement,
          Typescript.Type
        >,
        ReturnType<typeof getDefinitiveElementTypeCases>
      > as Array<
        ElementTypeCase<
          CoreIntermediateElement,
          Typescript.Type
        >
      >,
    targetModelKind,
    deriveTargetModel,
    schemaTypeChecker,
    schemaResult,
    typeContext,
    someModelType,
  });
}

export interface DeriveGenericTemplateModelApi
  extends Defined__DeriveIntermediateModelApi {
  someGenericTemplateModelType: Typescript.TypeReference;
}

export function deriveGenericTemplateModel(
  api: DeriveGenericTemplateModelApi,
) {
  const {
    schemaTypeChecker,
    schemaResult,
    typeContext,
    someGenericTemplateModelType,
  } = api;
  return __deriveIntermediateModel({
    targetModelKind: 'genericTemplate',
    deriveTargetModel: deriveTargetModel__deriveGenericTemplateModel,
    elementTypeCases:
      getGenericElementTypeCases() satisfies VerifiedElementTypeCases<
        ElementTypeCase<
          GenericTemplateIntermediateElement,
          Typescript.Type
        >,
        ReturnType<typeof getGenericElementTypeCases>
      > as Array<
        ElementTypeCase<
          GenericTemplateIntermediateElement,
          Typescript.Type
        >
      >,
    schemaTypeChecker,
    schemaResult,
    typeContext,
    someModelType: someGenericTemplateModelType,
  });
}

function deriveTargetModel__deriveGenericTemplateModel(
  api: DeriveTargetModelApi<
    'genericTemplate',
    Typescript.TypeReference
  >,
) {
  const {
    targetModelKind,
    modelSymbolKey,
    modelTemplates,
    modelProperties,
    someModelType,
  } = api;
  const genericTypeParameters = someModelType.target.typeParameters ??
    throwInvalidPathError('genericTypeParameters');
  return {
    modelKind: targetModelKind,
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

export interface __DeriveIntermediateModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> extends
  Defined__DeriveIntermediateModelApi,
  Custom__DeriveIntermediateModelApi<
    ThisTargetModelKind,
    ThisModelType
  > {
}

interface Defined__DeriveIntermediateModelApi
  extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaResult: IntermediateSchema;
  typeContext: TypeContext;
}

interface Custom__DeriveIntermediateModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> {
  targetModelKind: ThisTargetModelKind;
  someModelType: ThisModelType;
  deriveTargetModel: (
    api: DeriveTargetModelApi<ThisTargetModelKind, ThisModelType>,
  ) => GetThisIntermediateModel<ThisTargetModelKind>;
  elementTypeCases: Array<
    ElementTypeCase<
      GetThisIntermediateElement<ThisTargetModelKind>,
      Typescript.Type
    >
  >;
}

interface DeriveTargetModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisTargetModelKind,
      ThisModelType
    >,
    'schemaTypeChecker' | 'schemaResult' | 'someModelType' | 'targetModelKind'
  >,
  Pick<
    GetThisIntermediateModel<ThisTargetModelKind>,
    'modelSymbolKey' | 'modelTemplates' | 'modelProperties'
  > {}

function __deriveIntermediateModel<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
>(
  api: __DeriveIntermediateModelApi<
    ThisTargetModelKind,
    ThisModelType
  >,
): IntermediateSchema['schemaMap'][ThisTargetModelKind][string] {
  const {
    someModelType,
    schemaResult,
    targetModelKind,
    deriveTargetModel,
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
  const maybeCachedTargetModel = schemaResult
    .schemaMap[targetModelKind][modelSymbolKey];
  if (isCachedTargetKind(targetModelKind, maybeCachedTargetModel)) {
    return maybeCachedTargetModel;
  }
  const newTargetModel = deriveTargetModel({
    someModelType,
    schemaResult,
    targetModelKind,
    schemaTypeChecker,
    modelSymbolKey,
    modelTemplates: deriveModelTemplates({
      someModelType,
      schemaResult,
      schemaTypeChecker,
      typeContext,
      elementTypeCases,
    }),
    modelProperties: deriveModelProperties({
      someModelType,
      schemaResult,
      schemaTypeChecker,
      typeContext,
      elementTypeCases,
    }),
  });
  schemaResult.schemaMap[targetModelKind][newTargetModel.modelSymbolKey] =
    newTargetModel;
  return newTargetModel;
}

function isCachedTargetKind<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
>(
  targetModelKind: ThisTargetModelKind,
  someIntermediateModel:
    | IntermediateSchema['schemaMap'][keyof IntermediateSchema['schemaMap']][
      string
    ]
    | undefined,
): someIntermediateModel is IntermediateSchema['schemaMap'][
  ThisTargetModelKind
][
  string
] {
  return someIntermediateModel
    ? someIntermediateModel.modelKind === targetModelKind
      ? true
      : throwInvalidPathError('isCachedTargetKind')
    : false;
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
