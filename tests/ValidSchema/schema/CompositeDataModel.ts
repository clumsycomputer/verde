export interface CompositeDataModel
  extends ConcreteTemplateModel, GenericTemplateModel<CompositeDataModel, number> {}

export interface ConcreteTemplateModel {
  indirectRecursiveTemplateDataModelProperty: CompositeDataModel;
}

export interface GenericTemplateModel<
  BasicParameter,
  ConstrainedParameter extends number,
  DefaultParameter = string,
> extends NestedGenericTemplateModel<DefaultParameter> {  
  basicParameterProperty: BasicParameter;
  constrainedParameterProperty: ConstrainedParameter;
}

export interface NestedGenericTemplateModel<IndirectParameter> {
  indirectParameterProperty: IndirectParameter
}