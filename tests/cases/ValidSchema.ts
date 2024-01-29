export type ValidSchema = [
  BasicDataModel, 
  CompositeDataModel
];

interface BasicDataModel {
  stringProperty: string;
  numberProperty: number;
  booleanProperty: boolean;
  interfaceProperty: PropertyDataModel;
}

interface PropertyDataModel {
  fooProperty: string;
}

interface CompositeDataModel extends MetaConcreteTemplateModel {
  bazProperty: number
}

interface MetaConcreteTemplateModel {
  tazProperty: string
}