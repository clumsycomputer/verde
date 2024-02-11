import {
  ModelElement,
  ModelElementBase,
  SchemaMap,
  SchemaModel_Core,
} from './SchemaMap.ts';

export interface IntermediateSchemaMap
  extends SchemaMap<IntermediateSchemaModel> {}

export type IntermediateSchemaModel =
  | DataIntermediateSchemaModel
  | TemplateIntermediateSchemaModel;

export interface DataIntermediateSchemaModel
  extends IntermediateSchemaModel_Core<'data', CoreIntermediateModelElement> {}

export type TemplateIntermediateSchemaModel =
  | ConcreteTemplateIntermediateSchemaModel
  | GenericTemplateIntermediateSchemaModel;

export interface ConcreteTemplateIntermediateSchemaModel
  extends
    TemplateIntermediateSchemaModel_Core<
      'concrete',
      CoreIntermediateModelElement
    > {}

export interface GenericTemplateIntermediateSchemaModel
  extends
    TemplateIntermediateSchemaModel_Core<
      'generic',
      GenericTemplateIntermediateModelElement
    > {
  genericParameters: Array<GenericParameter>;
}

export interface GenericParameter {
  parameterSymbol: string;
}

interface TemplateIntermediateSchemaModel_Core<TemplateKind, ThisModelElement>
  extends IntermediateSchemaModel_Core<'template', ThisModelElement> {
  templateKind: TemplateKind;
}

export interface IntermediateSchemaModel_Core<
  ModelKind,
  ThisModelElement,
> extends SchemaModel_Core<ThisModelElement> {
  modelKind: ModelKind;
  modelTemplates: Array<ModelTemplate<ThisModelElement>>;
}

export type ModelTemplate<ThisModelElement> =
  | ConcreteModelTemplate
  | GenericModelTemplate<ThisModelElement>;

export interface ConcreteModelTemplate extends ModelTemplateBase<'concrete'> {}

export interface GenericModelTemplate<ThisArgumentElement>
  extends ModelTemplateBase<'generic'> {
  genericArguments: Record<
    GenericArgument<ThisArgumentElement>['argumentSymbol'],
    GenericArgument<ThisArgumentElement>
  >;
}

export interface GenericArgument<ThisArgumentElement> {
  argumentSymbol: string;
  argumentIndex: number;
  argumentElement: ThisArgumentElement;
}

interface ModelTemplateBase<TemplateKind> {
  templateKind: TemplateKind;
  templateModelKey: TemplateIntermediateSchemaModel['modelKey'];
}

export type GenericTemplateIntermediateModelElement =
  | ParameterModelElement
  | CoreIntermediateModelElement;

export type ParameterModelElement =
  | BasicParameterModelElement
  | ConstrainedParameterModelElement;

export interface BasicParameterModelElement
  extends ParameterModelElementBase<'basic'> {}

export interface ConstrainedParameterModelElement
  extends ParameterModelElementBase<'constrained'> {}

interface ParameterModelElementBase<ParameterKind>
  extends ModelElementBase<'parameter'> {
  parameterKind: ParameterKind;
  parameterSymbol: string;
}

export type CoreIntermediateModelElement = ModelElement<
  DataIntermediateSchemaModel
>;
