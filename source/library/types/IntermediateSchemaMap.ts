import {
  SchemaMap,
  ModelElement,
  ModelElementBase,
  ModelProperty,
  SchemaModel,
} from './SchemaMap.ts';

export interface IntermediateSchemaMap
  extends SchemaMap<IntermediateSchemaModel> {}

export type IntermediateSchemaModel =
  | DataIntermediateSchemaModel
  | TemplateIntermediateSchemaModel;

export interface DataIntermediateSchemaModel
  extends IntermediateSchemaModelBase<'data'> {}

export type TemplateIntermediateSchemaModel =
  | ConcreteTemplateIntermediateSchemaModel
  | GenericTemplateIntermediateSchemaModel;

export interface ConcreteTemplateIntermediateSchemaModel
  extends TemplateIntermediateSchemaModelBase<'concrete'> {}

export interface GenericTemplateIntermediateSchemaModel
  extends TemplateIntermediateSchemaModelBase<'generic'> {
  genericParameters: Array<GenericParameter>;
}

export interface GenericParameter {
  parameterSymbol: string;
}

interface TemplateIntermediateSchemaModelBase<TemplateKind>
  extends IntermediateSchemaModelBase<'template'> {
  templateKind: TemplateKind;
}

interface IntermediateSchemaModelBase<ModelKind>
  extends SchemaModel<IntermediateModelProperty> {
  modelKind: ModelKind;
  modelTemplates: Array<ModelTemplate>;
}

export type ModelTemplate = ConcreteModelTemplate | GenericModelTemplate;

export interface ConcreteModelTemplate extends ModelTemplateBase<'concrete'> {}

export interface GenericModelTemplate extends ModelTemplateBase<'generic'> {
  genericArguments: Array<GenericArgument>;
}

export interface GenericArgument {
  argumentElement: IntermediateModelElement;
}

interface ModelTemplateBase<TemplateKind> {
  templateKind: TemplateKind;
  templateModelKey: TemplateIntermediateSchemaModel['modelKey'];
}

export interface IntermediateModelProperty
  extends ModelProperty<IntermediateModelElement> {}

export type IntermediateModelElement =
  | ParameterModelElement
  | ModelElement<DataIntermediateSchemaModel>;

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
}
