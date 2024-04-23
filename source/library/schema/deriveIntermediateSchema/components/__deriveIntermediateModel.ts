import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  DataIntermediateModel,
  GetThisIntermediateElement,
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __DeriveIntermediateSchemaApi } from '../deriveIntermediateSchema.ts';
import {
  ElementCaseHandler,
  getDefinitiveElementCases,
} from './__getElementCases.ts';
import { deriveModelProperties } from './deriveModelProperties.ts';

export interface DeriveDataModelApi extends
  Pick<
    Defined__DeriveIntermediateModelApi,
    'schemaTypeChecker' | 'schemaResult' | 'modelSymbol'
  > {
}

export function deriveDataModel(
  api: DeriveDataModelApi,
): DataIntermediateModel {
  const {
    schemaTypeChecker,
    schemaResult,
    modelSymbol,
  } = api;
  return __deriveDefinitiveModel({
    targetModelKind: 'data',
    initializeTargetModel: initializeTargetModel__deriveDataModel,
    schemaTypeChecker,
    schemaResult,
    modelSymbol,
    // astContext: [{
    //   astNodeKind: 'dataModel',
    //   astNodeTypeNode: dataModelType,
    // }],
  });
}

function initializeTargetModel__deriveDataModel(
  api: InitializeTargetModelApi<'data'>,
): DataIntermediateModel {
  const { targetModelKind, modelSymbol } = api;
  return {
    modelKind: targetModelKind,
    modelName: modelSymbol.name,
    modelTemplates: [],
    modelProperties: {},
  };
}

interface __DeriveDefinitiveModel<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind>,
    | 'targetModelKind'
    | 'initializeTargetModel'
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelSymbol'
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
    modelSymbol,
    // astContext,
  } = api;
  return __deriveIntermediateModel({
    elementCases: getDefinitiveElementCases(),
    targetModelKind,
    initializeTargetModel,
    schemaTypeChecker,
    schemaResult,
    modelSymbol,
    // astContext,
  });
}

export interface __DeriveIntermediateModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Defined__DeriveIntermediateModelApi,
  Custom__DeriveIntermediateModelApi<ThisTargetModelKind> {
}

interface Defined__DeriveIntermediateModelApi
  extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaResult: IntermediateSchema;
  modelSymbol: Typescript.Symbol;
  // astContext: AstContext;
}

interface Custom__DeriveIntermediateModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> {
  targetModelKind: ThisTargetModelKind;
  initializeTargetModel: (
    api: InitializeTargetModelApi<ThisTargetModelKind>,
  ) => GetThisIntermediateModel<ThisTargetModelKind>;
  elementCases: Array<
    ElementCaseHandler<
      GetThisIntermediateElement<ThisTargetModelKind>['elementKind'],
      GetThisIntermediateElement<ThisTargetModelKind>
    >
  >;
}

interface InitializeTargetModelApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind>,
    'targetModelKind' | 'schemaTypeChecker' | 'schemaResult' | 'modelSymbol'
  > {}

function __deriveIntermediateModel<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: __DeriveIntermediateModelApi<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind> {
  const {
    modelSymbol,
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
  const modelName = modelSymbol.name;
  const maybeCachedTargetModel = schemaResult
    .schemaModels[targetModelKind][modelName];
  if (isCachedTargetKind(targetModelKind, maybeCachedTargetModel)) {
    return maybeCachedTargetModel;
  }
  const newTargetModel = initializeTargetModel({
    targetModelKind,
    schemaTypeChecker,
    schemaResult,
    modelSymbol,
  });
  // enable recursive model processing (direct & indirect)
  schemaResult.schemaModels[targetModelKind][newTargetModel.modelName] =
    newTargetModel;
  // newTargetModel.modelTemplates = deriveModelTemplates({
  //   someModelType,
  //   schemaResult,
  //   schemaTypeChecker,
  //   typeContext,
  //   elementTypeCases,
  // });
  newTargetModel.modelProperties = deriveModelProperties({
    elementCases,
    schemaTypeChecker,
    schemaResult,
    modelSymbol,
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
    ][
      string
    ]
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
