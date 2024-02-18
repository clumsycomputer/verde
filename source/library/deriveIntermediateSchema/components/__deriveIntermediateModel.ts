import { throwInvalidPathError } from '../../../helpers/throwError.ts';
import { irrelevantAny } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateModel,
  CoreIntermediateElement,
  DataIntermediateModel,
  GenericTemplateIntermediateElement,
  GenericTemplateIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';
import {
  ElementTypeCase,
  getDefinitiveElementTypeCases,
  getGenericElementTypeCases,
  VerifiedElementTypeCases,
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
    deriveTargetModel: deriveTargetModel__deriveDataModel,
    targetKind: 'data',
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
): DataIntermediateModel {
  const { modelSymbolKey, modelTemplates, modelProperties } = api;
  return {
    modelKind: 'data',
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
    deriveTargetModel: deriveResultModel__deriveConcreteTemplateModel,
    targetKind: 'concreteTemplate',
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
): ConcreteTemplateIntermediateModel {
  const { modelSymbolKey, modelTemplates, modelProperties } = api;
  return {
    modelKind: 'concreteTemplate',
    modelSymbolKey,
    modelTemplates,
    modelProperties,
  };
}

interface __DeriveDefinitiveModel<
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisTargetKind,
      ThisModelType
    >,
    | 'targetKind'
    | 'deriveTargetModel'
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'someModelType'
    | 'typeContext'
  > {}

function __deriveDefinitiveModel<
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
>(
  api: __DeriveDefinitiveModel<
    ThisTargetKind,
    ThisModelType
  >,
) {
  const {
    targetKind,
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
    targetKind,
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
    deriveTargetModel: deriveTargetModel__deriveGenericTemplateModel,
    targetKind: 'genericTemplate',
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
): GenericTemplateIntermediateModel {
  const {
    modelSymbolKey,
    modelTemplates,
    modelProperties,
    someModelType,
  } = api;
  const genericTypeParameters = someModelType.target.typeParameters ??
    throwInvalidPathError('genericTypeParameters');
  return {
    modelKind: 'genericTemplate',
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
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> extends
  Defined__DeriveIntermediateModelApi,
  Custom__DeriveIntermediateModelApi<
    ThisTargetKind,
    ThisModelType
  > {
}

interface Defined__DeriveIntermediateModelApi
  extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaResult: IntermediateSchema;
  typeContext: TypeContext;
}

interface Custom__DeriveIntermediateModelApi<
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> {
  targetKind: ThisTargetKind;
  someModelType: ThisModelType;
  deriveTargetModel: (
    api: DeriveTargetModelApi<ThisTargetKind, ThisModelType>,
  ) => IntermediateSchema['schemaMap'][ThisTargetKind][string];
  elementTypeCases: Array<
    ElementTypeCase<
      IntermediateSchema['schemaMap'][ThisTargetKind][string][
        'modelProperties'
      ][string]['propertyElement'],
      Typescript.Type
    >
  >;
}

interface DeriveTargetModelApi<
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      irrelevantAny,
      ThisModelType
    >,
    'schemaTypeChecker' | 'schemaResult' | 'someModelType'
  >,
  Pick<
    IntermediateSchema['schemaMap'][ThisTargetKind][string],
    'modelSymbolKey' | 'modelTemplates' | 'modelProperties'
  > {}

function __deriveIntermediateModel<
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
>(
  api: __DeriveIntermediateModelApi<
    ThisTargetKind,
    ThisModelType
  >,
): IntermediateSchema['schemaMap'][ThisTargetKind][string] {
  const {
    someModelType,
    schemaResult,
    targetKind,
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
    .schemaMap[targetKind][modelSymbolKey];
  if (isCachedTargetKind(targetKind, maybeCachedTargetModel)) {
    return maybeCachedTargetModel;
  }
  const newTargetModel = deriveTargetModel({
    someModelType,
    schemaResult,
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
  schemaResult.schemaMap[targetKind][newTargetModel.modelSymbolKey] =
    newTargetModel;
  return newTargetModel;
}

function isCachedTargetKind<
  ThisTargetKind extends keyof IntermediateSchema['schemaMap'],
>(
  targetKind: ThisTargetKind,
  someIntermediateModel:
    | IntermediateSchema['schemaMap'][keyof IntermediateSchema['schemaMap']][
      string
    ]
    | undefined,
): someIntermediateModel is IntermediateSchema['schemaMap'][ThisTargetKind][
  string
] {
  return someIntermediateModel
    ? someIntermediateModel.modelKind === targetKind
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
