import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateModel,
  DataIntermediateModel,
  GenericTemplateIntermediateModel,
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import {
  __SchemaElement,
  DefinitiveSchemaElement,
  GenericSchemaElement,
} from '../../types/SchemaElement.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';
import {
ElementCase,
  getDefinitiveElementCases,
  getGenericElementCases,
} from './__getElementCases.ts';
import { deriveModelProperties } from './deriveModelProperties.ts';
import { deriveModelTemplates } from './deriveModelTemplates.ts';

export interface DeriveDataModelApi extends
  Pick<
    Defined__DeriveIntermediateModelApi,
    'schemaTypeChecker' | 'schemaResult' | 'modelDeclaration'
  > {
}

export function deriveDataModel(
  api: DeriveDataModelApi,
): DataIntermediateModel {
  const {
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
  } = api;
  return __deriveDefinitiveModel({
    targetModelKind: 'data',
    initializeTargetModel: initializeTargetModel__deriveDataModel,
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
    // astContext: [{
    //   astNodeKind: 'dataModel',
    //   astNodeTypeNode: dataModelType,
    // }],
  });
}

function initializeTargetModel__deriveDataModel(
  api: InitializeTargetModelApi,
): DataIntermediateModel {
  const { modelName } = api;
  return {
    modelKind: 'data',
    modelName,
    modelTemplates: [],
    modelProperties: {},
  };
}

export interface DeriveConcreteTemplateModelApi extends
  Pick<
    Defined__DeriveIntermediateModelApi,
    'schemaTypeChecker' | 'schemaResult' | 'modelDeclaration'
  > {
}

export function deriveConcreteTemplateModel(
  api: DeriveDataModelApi,
): ConcreteTemplateIntermediateModel {
  const {
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
  } = api;
  return __deriveDefinitiveModel({
    targetModelKind: 'concreteTemplate',
    initializeTargetModel: initializeTargetModel__deriveConcreteTemplateModel,
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
    // astContext: [{
    //   astNodeKind: 'dataModel',
    //   astNodeTypeNode: dataModelType,
    // }],
  });
}

function initializeTargetModel__deriveConcreteTemplateModel(
  api: InitializeTargetModelApi,
): ConcreteTemplateIntermediateModel {
  const { modelName } = api;
  return {
    modelKind: 'concreteTemplate',
    modelName,
    modelTemplates: [],
    modelProperties: {},
  };
}

interface __DeriveDefinitiveModel<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisTargetModelKind,
      irrelevantAny
    >,
    | 'targetModelKind'
    | 'initializeTargetModel'
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelDeclaration'
  > // | 'astContext'
{}

function __deriveDefinitiveModel<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: __DeriveDefinitiveModel<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind> {
  const {
    targetModelKind,
    initializeTargetModel,
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
    // astContext,
  } = api;
  return __deriveIntermediateModel({
    elementCases: getDefinitiveElementCases() as any as Array<ElementCase<DefinitiveSchemaElement>>,
    targetModelKind,
    initializeTargetModel,
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
    // astContext,
  });
}

export interface DeriveGenericTemplateModelApi extends
  Pick<
    __DeriveIntermediateModelApi<
      irrelevantAny,
      irrelevantAny
    >,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelDeclaration'
  > // | 'astContext'
{}

export function deriveGenericTemplateModel(api: DeriveGenericTemplateModelApi) {
  const { schemaTypeChecker, schemaResult, modelDeclaration } = api;
  return __deriveIntermediateModel({
    targetModelKind: 'genericTemplate',
    initializeTargetModel: initializeTargetModel__deriveGenericTemplateModel,
    elementCases: getGenericElementCases() as any as Array<ElementCase<GenericSchemaElement>>,
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
  });
}

function initializeTargetModel__deriveGenericTemplateModel(
  api: InitializeTargetModelApi,
): GenericTemplateIntermediateModel {
  const { modelName, modelDeclaration, schemaTypeChecker } = api;
  const modelTypeParameters = modelDeclaration.typeParameters ??
    throwInvalidPathError('modelTypeParameters');
  return {
    modelKind: 'genericTemplate',
    modelName,
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
  ThisElementCase extends ElementCase<genericAny>
> extends
  Defined__DeriveIntermediateModelApi,
  Custom__DeriveIntermediateModelApi<
    ThisTargetModelKind,
    ThisElementCase
  > {}

interface Defined__DeriveIntermediateModelApi
  extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaResult: IntermediateSchema;
  modelDeclaration: Typescript.InterfaceDeclaration;
  // astContext: AstContext;
}

interface Custom__DeriveIntermediateModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
  ThisElementCase extends ElementCase<genericAny>
> {
  targetModelKind: ThisTargetModelKind;
  initializeTargetModel: (
    api: InitializeTargetModelApi,
  ) => GetThisIntermediateModel<ThisTargetModelKind>;
  elementCases: Array<ThisElementCase>;
}

interface InitializeTargetModelApi extends
  Pick<
    __DeriveIntermediateModelApi<
      irrelevantAny,
      irrelevantAny
    >,
    'schemaTypeChecker' | 'schemaResult' | 'modelDeclaration'
  > {
  modelName: string;
}

function __deriveIntermediateModel<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
  ThisElementCase extends ElementCase<genericAny>
>(
  api: __DeriveIntermediateModelApi<
    ThisTargetModelKind,
    ThisElementCase
  >,
): GetThisIntermediateModel<ThisTargetModelKind> {
  const {
    modelDeclaration,
    schemaResult,
    targetModelKind,
    schemaTypeChecker,
    initializeTargetModel,
    elementCases,
    // astContext,
  } = api;
  // todo:
  //    1. check if declaration symbol for `someModelType` is unique, a.k.a,
  //       check for naming collisions with other processed model type declarations
  //
  //    2. if declaration symbol not unique or exists as other modelKind, throw user error
  //
  const modelName = modelDeclaration.name.text;
  const maybeCachedTargetModel = schemaResult
    .schemaModels[targetModelKind][modelName];
  if (isCachedTargetKind(targetModelKind, maybeCachedTargetModel)) {
    return maybeCachedTargetModel;
  }
  const newTargetModel = initializeTargetModel({
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
    modelName,
  });
  // enable recursive model processing (direct & indirect)
  schemaResult.schemaModels[targetModelKind][newTargetModel.modelName] =
    newTargetModel;
  newTargetModel.modelTemplates = deriveModelTemplates({
    elementCases,
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
    // astContext,
  });
  newTargetModel.modelProperties = deriveModelProperties({
    elementCases,
    schemaTypeChecker,
    schemaResult,
    modelDeclaration,
    // astContext,
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

// type AstContext = [
//   DataModelAstNode,
//   ...Array<SecondaryModelAstNode>,
// ];

// interface DataModelAstNode extends __AstNode<'dataModel'> {}

// type SecondaryModelAstNode = TemplateAstNode | ElementAstNode;

// type TemplateAstNode = ConcreteTemplateAstNode | GenericTemplateAstNode;

// interface ConcreteTemplateAstNode
//   extends __TemplateTypeInfo<'concreteTemplate'> {}

// interface GenericTemplateAstNode
//   extends __TemplateTypeInfo<'genericTemplate'> {}

// interface __TemplateTypeInfo<ThisAstNodeKind>
//   extends __AstNode<ThisAstNodeKind> {}

// type ElementAstNode = ArgumentElementTypeInfo | PropertyElementTypeInfo | CollectionElementTypeInfo;

// interface ArgumentElementTypeInfo extends __ElementAstNode<'argumentElement'> {}

// interface PropertyElementTypeInfo extends __ElementAstNode<'propertyElement'> {
//   propertyKey: string;
// }

// interface CollectionElementTypeInfo extends __ElementAstNode<'collectionElement'> {
//   collectionAliasSymbol: Typescript.Symbol
// }

// interface __ElementAstNode<ThisAstNodeKind>
//   extends __AstNode<ThisAstNodeKind> {}

// interface __AstNode<ThisAstNodeKind> {
//   astNodeKind: ThisAstNodeKind;
//   astNodeTypeNode: Typescript.TypeNode;
// }
