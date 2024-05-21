import {
  throwInvalidPathError
} from '../../../../helpers/throwError.ts';
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
import { throwIndirectModelName, throwInvalidModelDeclaration__MultipleDeclarations, throwInvalidModelUsage__AliasRegistered, throwInvalidModelUsage__ConcreteTemplateModelRegistered, throwInvalidModelUsage__DataModelRegistered } from '../helpers/errors.ts';
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
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelLocalSymbol'
    | 'modelSourceSymbol'
    | 'modelSourceDeclaration'
  > {}

export function deriveDataModel(
  api: DeriveDataModelApi,
): DataIntermediateModel {
  const {
    schemaTypeChecker,
    schemaResult,
    modelLocalSymbol,
    modelSourceSymbol,
    modelSourceDeclaration,
  } = api;
  return __deriveDefinitiveModel({
    schemaTypeChecker,
    schemaResult,
    modelLocalSymbol,
    modelSourceSymbol,
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
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelLocalSymbol'
    | 'modelSourceSymbol'
    | 'modelSourceDeclaration'
  > {
}

export function deriveConcreteTemplateModel(
  api: DeriveDataModelApi,
): ConcreteTemplateIntermediateModel {
  const {
    schemaTypeChecker,
    schemaResult,
    modelLocalSymbol,
    modelSourceSymbol,
    modelSourceDeclaration,
  } = api;
  return __deriveDefinitiveModel({
    schemaTypeChecker,
    schemaResult,
    modelLocalSymbol,
    modelSourceSymbol,
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
    | 'modelLocalSymbol'
    | 'modelSourceSymbol'
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
    modelLocalSymbol,
    modelSourceSymbol,
    modelSourceDeclaration,
    targetModelKind,
    initializeTargetModel,
  } = api;
  return __deriveIntermediateModel({
    schemaTypeChecker,
    schemaResult,
    modelLocalSymbol,
    modelSourceSymbol,
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
    | 'modelLocalSymbol'
    | 'modelSourceSymbol'
    | 'modelSourceDeclaration'
  > {}

export function deriveGenericTemplateModel(api: DeriveGenericTemplateModelApi) {
  const {
    schemaTypeChecker,
    schemaResult,
    modelLocalSymbol,
    modelSourceSymbol,
    modelSourceDeclaration,
  } = api;
  return __deriveIntermediateModel({
    schemaTypeChecker,
    schemaResult,
    modelLocalSymbol,
    modelSourceSymbol,
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
  modelLocalSymbol: Typescript.Symbol;
  modelSourceSymbol: Typescript.Symbol;
  modelSourceDeclaration: Typescript.InterfaceDeclaration;
}

interface Custom__DeriveIntermediateModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> {
  targetModelKind: ThisTargetModelKind;
  targetModelElementResolvers: Array<
    ElementResolver<GetThisIntermediateElement<ThisTargetModelKind>>
  >;
  initializeTargetModel: (
    api: InitializeTargetModelApi,
  ) => GetThisIntermediateModel<ThisTargetModelKind>;
}

interface InitializeTargetModelApi extends
  Pick<
    __DeriveIntermediateModelApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaResult' | 'modelSourceDeclaration'
  > {
  modelName: string;
}

export interface ValidateTargetModelApi extends
  Pick<
    Defined__DeriveIntermediateModelApi,
    | 'schemaResult'
    | 'modelLocalSymbol'
    | 'modelSourceSymbol'
  > {}

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
    modelLocalSymbol,
    modelSourceSymbol,
    initializeTargetModel,
    targetModelElementResolvers,
  } = api;
  const modelName = modelSourceDeclaration.name.text;
  const maybeCachedTargetModel = schemaResult
    .schemaModels[targetModelKind][modelName];
  if (isCachedTargetKind(targetModelKind, maybeCachedTargetModel)) {
    return maybeCachedTargetModel;
  }
  else if (modelLocalSymbol.name !== modelSourceSymbol.name) {
    throwIndirectModelName({
      modelLocalSymbol,
      modelSourceSymbol
    })
  }
  else if (1 < modelSourceSymbol.declarations!.length) {
    throwInvalidModelDeclaration__MultipleDeclarations({
      modelSourceSymbol
    })
  }
  else if (undefined !== schemaResult.schemaModels.data[modelSourceSymbol.name]) {
    throwInvalidModelUsage__DataModelRegistered({
      modelSourceSymbol
    })
  }
  else if (undefined !== schemaResult.schemaModels.concreteTemplate[modelSourceSymbol.name]) {
    throwInvalidModelUsage__ConcreteTemplateModelRegistered({
      modelSourceSymbol
    })
  }
  else if (undefined !== schemaResult.schemaAliases[modelSourceSymbol.name]) {
    throwInvalidModelUsage__AliasRegistered({
      modelSourceSymbol
    })
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
