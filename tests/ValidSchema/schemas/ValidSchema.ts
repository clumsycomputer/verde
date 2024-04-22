export type ValidSchema = [BasicDataModel]; 

interface BasicDataModel {
  stringProperty: string;
  numberProperty: number;
  booleanProperty: boolean;
  stringLiteralProperty: "hello";
  numberLiteralProperty: 123;
  booleanLiteralProperty: true;
  dataModelReferenceProperty: BasicDataModel;
  aliasReferenceProperty: DataModelUnion;
}

type DataModelUnion = BasicDataModel;