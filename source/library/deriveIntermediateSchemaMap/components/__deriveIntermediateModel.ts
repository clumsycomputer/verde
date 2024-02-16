import { throwInvalidPathError } from '../../../helpers/throwError.ts';
import { irrelevantAny } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateSchemaModel,
  CoreIntermediateModelElement,
  DataIntermediateSchemaModel,
  GenericTemplateIntermediateModelElement,
  GenericTemplateIntermediateSchemaModel,
  IntermediateSchemaMap,
  IntermediateSchemaModel,
} from '../../types/IntermediateSchemaMap.ts';
import { DeriveSchemaMapApi } from '../deriveIntermediateSchemaMap.ts';
import { ElementTypeCase, VerifiedElementTypeCases, getDefinitiveElementTypeCases, getGenericElementTypeCases } from './__getElementTypeCases.ts';
import { GetThisModelElement } from './deriveModelElement.ts';
import { deriveModelProperties } from './deriveModelProperties.ts';
import { deriveModelTemplates } from './deriveModelTemplates.ts';

export interface DeriveDataModelApi extends
  Pick<
    Defined__DeriveIntermediateModelApi,
    'schemaTypeChecker' | 'schemaMapResult'
  > {
  someDataModelType: Typescript.InterfaceType;
}

export function deriveDataModel(
  api: DeriveDataModelApi,
): DataIntermediateSchemaModel {
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

export interface DeriveConcreteTemplateModelApi
  extends Defined__DeriveIntermediateModelApi {
  someConcreteTemplateModelType: Typescript.InterfaceType;
}

export function deriveConcreteTemplateModel(
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

export interface DeriveGenericTemplateModelApi
  extends Defined__DeriveIntermediateModelApi {
  someGenericTemplateModelType: Typescript.TypeReference;
}

export function deriveGenericTemplateModel(
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

export interface __DeriveIntermediateModelApi<
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
