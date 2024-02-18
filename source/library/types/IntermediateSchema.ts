import {
  __SchemaModel,
  ModelElement,
  ModelElementBase,
  StructuredSchema,
} from './StructuredSchema.ts';

export interface IntermediateSchema
  extends StructuredSchema<IntermediateSchemaMap> {
}

interface IntermediateSchemaMap {
  data: Record<string,DataIntermediateModel>,
  concreteTemplate: Record<string,ConcreteTemplateIntermediateModel>,
  genericTemplate: Record<string,GenericTemplateIntermediateModel>
};

// export type GetIntermediateModel<
//   TargetModelKind extends IntermediateModel['modelKind'],
//   RemainingOptions extends [IntermediateModel, ...Array<IntermediateModel>] =
//     IntermediateModelOptions,
// > = RemainingOptions[0]['modelKind'] extends TargetModelKind
//   ? RemainingOptions[0]
//   : GetIntermediateModel<
//     TargetModelKind,
//     RemainingOptions extends [infer StaleOption, ...infer NextRemainingOptions]
//       ? NextRemainingOptions extends
//         [IntermediateModel, ...Array<IntermediateModel>] ? NextRemainingOptions
//       : never
//       : never
//   >;

type IntermediateModel = IntermediateModelOptions[number];

export type IntermediateModelOptions = [
  DataIntermediateModel,
  ...TemplateIntermediateModelOptions,
];

export interface DataIntermediateModel
  extends __IntermediateModel<'data', CoreIntermediateElement> {}

export type TemplateIntermediateModel =
  TemplateIntermediateModelOptions[number];

export type TemplateIntermediateModelOptions = [
  ConcreteTemplateIntermediateModel,
  GenericTemplateIntermediateModel,
];

export interface ConcreteTemplateIntermediateModel
  extends
    __TemplateIntermediateModel<
      'concreteTemplate',
      CoreIntermediateElement
    > {}

export interface GenericTemplateIntermediateModel
  extends
    __TemplateIntermediateModel<
      'genericTemplate',
      GenericTemplateIntermediateElement
    > {
  genericParameters: Array<GenericParameter>;
}

export interface GenericParameter {
  parameterSymbol: string;
}

interface __TemplateIntermediateModel<ThisModelKind, ThisModelElement>
  extends __IntermediateModel<ThisModelKind, ThisModelElement> {
}

export interface __IntermediateModel<
  ThisModelKind,
  ThisModelElement,
> extends __SchemaModel<ThisModelElement> {
  modelKind: ThisModelKind;
  modelTemplates: Array<ModelTemplate<ThisModelElement>>;
}

export type ModelTemplate<ThisModelElement> =
  | ConcreteModelTemplate
  | GenericModelTemplate<ThisModelElement>;

export interface ConcreteModelTemplate
  extends ModelTemplateBase<'concreteTemplate'> {}

export interface GenericModelTemplate<ThisArgumentElement>
  extends ModelTemplateBase<'genericTemplate'> {
  genericArguments: Record<
    GenericArgument<ThisArgumentElement>['argumentSymbolKey'],
    GenericArgument<ThisArgumentElement>
  >;
}

export interface GenericArgument<ThisArgumentElement> {
  argumentSymbolKey: string;
  argumentIndex: number;
  argumentElement: ThisArgumentElement;
}

interface ModelTemplateBase<
  ThisTemplateKind extends TemplateIntermediateModel['modelKind'],
> {
  templateKind: ThisTemplateKind;
  templateModelSymbolKey: TemplateIntermediateModel['modelSymbolKey'];
}

export type GenericTemplateIntermediateElement =
  | ParameterElement
  | CoreIntermediateElement;

export type ParameterElement =
  | BasicParameterElement
  | ConstrainedParameterElement;

export interface BasicParameterElement
  extends ParameterElementBase<'basicParameter'> {}

export interface ConstrainedParameterElement
  extends ParameterElementBase<'constrainedParameter'> {}

interface ParameterElementBase<ThisElementKind>
  extends ModelElementBase<ThisElementKind> {
  parameterSymbol: string;
}

export type CoreIntermediateElement = ModelElement<
  DataIntermediateModel
>;
