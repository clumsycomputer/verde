export type ValidSchema = [
  BasicDataModel_EXAMPLE,
  CompositeDataModel_EXAMPLE,
];

interface BasicDataModel_EXAMPLE {
  stringProperty_EXAMPLE: string;
  numberProperty_EXAMPLE: number;
  booleanProperty_EXAMPLE: boolean;
  interfaceProperty_EXAMPLE: PropertyDataModel_EXAMPLE;
}

interface PropertyDataModel_EXAMPLE {
  fooProperty: string;
}

interface CompositeDataModel_EXAMPLE
  extends
    ConcreteTemplateModel_EXAMPLE,
    GenericTemplateModel_EXAMPLE<PropertyDataModel_EXAMPLE, 7> {
  bazProperty: number;
}

interface ConcreteTemplateModel_EXAMPLE {
  tazProperty: string;
}

interface GenericTemplateModel_EXAMPLE<
  BasicParameter_EXAMPLE,
  ConstrainedParameter_EXAMPLE extends number,
  DefaultParameter_EXAMPLE = string,
> {
  basicParameterProperty_EXAMPLE: BasicParameter_EXAMPLE;
  constrainedParameterProperty_EXAMPLE: ConstrainedParameter_EXAMPLE;
  defaultParameterProperty_EXAMPLE: DefaultParameter_EXAMPLE;
}
