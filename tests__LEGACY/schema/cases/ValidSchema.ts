export type ValidSchema = [
  BasicDataModel__EXAMPLE,
];

interface BasicDataModel__EXAMPLE {
  stringProperty__EXAMPLE: string;
  numberProperty__EXAMPLE: number;
  booleanProperty__EXAMPLE: boolean;
  stringLiteralProperty__EXAMPLE: 'foo';
  numberLiteralProperty__EXAMPLE: 7;
  booleanLiteralProperty__EXAMPLE: true;
  dataModelProperty__EXAMPLE: CompositeDataModel__EXAMPLE;
}

interface CompositeDataModel__EXAMPLE
  extends
    ConcreteTemplateModel__EXAMPLE,
    GenericTemplateModel__EXAMPLE<boolean, number> {
}

interface ConcreteTemplateModel__EXAMPLE {}

interface GenericTemplateModel__EXAMPLE<
  BasicParameter__EXAMPLE,
  ConstrainedParameter__EXAMPLE extends number,
  DefaultParameter__EXAMPLE = string,
> {
  basicParameterProperty__EXAMPLE: BasicParameter__EXAMPLE;
  constrainedParameterProperty__EXAMPLE: ConstrainedParameter__EXAMPLE;
}
