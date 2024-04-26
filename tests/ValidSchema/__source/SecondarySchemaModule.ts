export interface CompositeDataModel
  extends ConcreteTemplateModel, GenericTemplateModel<boolean, number> {}

export interface ConcreteTemplateModel {}

export interface GenericTemplateModel<BasicParameter, ConstrainedParameter extends number, DefaultParameter = string> {
  basicParameterProperty: BasicParameter;
  constrainedParameterProperty: ConstrainedParameter;
}

export interface RemoteDataModel {}