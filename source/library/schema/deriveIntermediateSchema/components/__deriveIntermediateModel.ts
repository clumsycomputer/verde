import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateModel,
  DataIntermediateModel,
  GenericTemplateIntermediateModel,
  GetThisIntermediateElement,
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';
import {
  ElementResolver,
  getDefinitiveElementResolvers,
  getGenericElementResolvers,
} from './__getElementResolvers.ts';
import { deriveModelProperties } from './deriveModelProperties.ts';
import { deriveModelTemplates } from './deriveModelTemplates.ts';

export interface DeriveDataModelApi extends
  Pick<
    Defined__DeriveIntermediateModelApi,
    'schemaTypeChecker' | 'schemaResult' | 'modelSourceDeclaration'
  > {}

export function deriveDataModel(
  api: DeriveDataModelApi,
): DataIntermediateModel {
  const {
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
  } = api;
  return __deriveDefinitiveModel({
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
    targetModelKind: 'data',
    initializeTargetModel: initializeTargetModel__deriveDataModel,
  });
}

function initializeTargetModel__deriveDataModel(
  api: InitializeTargetModelApi,
): DataIntermediateModel {
  const { modelName } = api;
  return {
    modelName,
    modelKind: 'data',
    modelTemplates: [],
    modelProperties: {},
  };
}

export interface DeriveConcreteTemplateModelApi extends
  Pick<
    Defined__DeriveIntermediateModelApi,
    'schemaTypeChecker' | 'schemaResult' | 'modelSourceDeclaration'
  > {
}

export function deriveConcreteTemplateModel(
  api: DeriveDataModelApi,
): ConcreteTemplateIntermediateModel {
  const {
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
  } = api;
  return __deriveDefinitiveModel({
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
    targetModelKind: 'concreteTemplate',
    initializeTargetModel: initializeTargetModel__deriveConcreteTemplateModel,
  });
}

function initializeTargetModel__deriveConcreteTemplateModel(
  api: InitializeTargetModelApi,
): ConcreteTemplateIntermediateModel {
  const { modelName } = api;
  return {
    modelName,
    modelKind: 'concreteTemplate',
    modelTemplates: [],
    modelProperties: {},
  };
}

interface __DeriveDefinitiveModel<
  ThisTargetModelKind extends
    | DataIntermediateModel['modelKind']
    | ConcreteTemplateIntermediateModel['modelKind'],
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisTargetModelKind
    >,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelSourceDeclaration'
    | 'targetModelKind'
    | 'initializeTargetModel'
  > {}

function __deriveDefinitiveModel<
  ThisTargetModelKind extends
    | DataIntermediateModel['modelKind']
    | ConcreteTemplateIntermediateModel['modelKind'],
>(
  api: __DeriveDefinitiveModel<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind> {
  const {
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
    targetModelKind,
    initializeTargetModel,
  } = api;
  return __deriveIntermediateModel({
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
    targetModelKind,
    initializeTargetModel,
    targetModelElementResolvers: getDefinitiveElementResolvers(),
  });
}

export interface DeriveGenericTemplateModelApi extends
  Pick<
    __DeriveIntermediateModelApi<
      irrelevantAny
    >,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelSourceDeclaration'
  > {}

export function deriveGenericTemplateModel(api: DeriveGenericTemplateModelApi) {
  const { schemaTypeChecker, schemaResult, modelSourceDeclaration } = api;
  return __deriveIntermediateModel({
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
    targetModelKind: 'genericTemplate',
    initializeTargetModel: initializeTargetModel__deriveGenericTemplateModel,
    targetModelElementResolvers: getGenericElementResolvers(),
  });
}

function initializeTargetModel__deriveGenericTemplateModel(
  api: InitializeTargetModelApi,
): GenericTemplateIntermediateModel {
  const { modelName, modelSourceDeclaration, schemaTypeChecker } = api;
  const modelTypeParameters = modelSourceDeclaration.typeParameters ??
    throwInvalidPathError('modelTypeParameters');
  return {
    modelName,
    modelKind: 'genericTemplate',
    modelTemplates: [],
    modelProperties: {},
    modelParameters: modelTypeParameters.map((
      someTypeParameterDeclaration,
    ) => {
      return someTypeParameterDeclaration.constraint
        ? {
          parameterKind: 'constrained',
          parameterName: someTypeParameterDeclaration.name.text,
          parameterConstraint: Typescript.isTypeReferenceNode(
              someTypeParameterDeclaration.constraint,
            )
            ? someTypeParameterDeclaration.name.text
            : schemaTypeChecker.typeToString(
              schemaTypeChecker.getTypeFromTypeNode(
                someTypeParameterDeclaration.constraint,
              ),
            ),
        }
        : {
          parameterKind: 'basic',
          parameterName: someTypeParameterDeclaration.name.text,
        };
    }),
  };
}

export interface __DeriveIntermediateModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Defined__DeriveIntermediateModelApi,
  Custom__DeriveIntermediateModelApi<ThisTargetModelKind> {}

interface Defined__DeriveIntermediateModelApi
  extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaResult: IntermediateSchema;
  modelSourceDeclaration: Typescript.InterfaceDeclaration;
}

interface Custom__DeriveIntermediateModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> {
  targetModelKind: ThisTargetModelKind;
  initializeTargetModel: (
    api: InitializeTargetModelApi,
  ) => GetThisIntermediateModel<ThisTargetModelKind>;
  targetModelElementResolvers: Array<
    ElementResolver<GetThisIntermediateElement<ThisTargetModelKind>>
  >;
}

interface InitializeTargetModelApi extends
  Pick<
    __DeriveIntermediateModelApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaResult' | 'modelSourceDeclaration'
  > {
  modelName: string;
}

function __deriveIntermediateModel<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: __DeriveIntermediateModelApi<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind> {
  const {
    modelSourceDeclaration,
    schemaResult,
    targetModelKind,
    schemaTypeChecker,
    initializeTargetModel,
    targetModelElementResolvers,
  } = api;
  // todo:
  //    1. check if declaration name for `modelSourceDeclaration` is unique, a.k.a,
  //       check for naming collisions with other processed model type declarations
  //
  //    2. if declaration name not unique or exists as other modelKind, throw user error
  //
  const modelName = modelSourceDeclaration.name.text;
  const maybeCachedTargetModel = schemaResult
    .schemaModels[targetModelKind][modelName];
  if (isCachedTargetKind(targetModelKind, maybeCachedTargetModel)) {
    return maybeCachedTargetModel;
  }
  const newTargetModel = initializeTargetModel({
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
    modelName,
  });
  schemaResult.schemaModels[targetModelKind][newTargetModel.modelName] =
    newTargetModel;
  newTargetModel.modelTemplates = deriveModelTemplates({
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
    targetModelElementResolvers,
  });
  newTargetModel.modelProperties = deriveModelProperties({
    schemaTypeChecker,
    schemaResult,
    modelSourceDeclaration,
    targetModelElementResolvers,
  });
  return newTargetModel;
}

function isCachedTargetKind<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  targetModelKind: ThisTargetModelKind,
  someIntermediateModel:
    | IntermediateSchema['schemaModels'][
      keyof IntermediateSchema['schemaModels']
    ][string]
    | undefined,
): someIntermediateModel is IntermediateSchema['schemaModels'][
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
