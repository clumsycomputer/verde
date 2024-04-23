import { VerdeTable, VerdeArray } from '../../../source/library/module.ts';

export type ValidSchema = [BasicDataModel,DataModelUnion]; 

interface BasicDataModel {
  booleanLiteralProperty: true;
  numberLiteralProperty: 123;
  stringLiteralProperty: "hello";
  booleanProperty: boolean;
  numberProperty: number;
  stringProperty: string;
  dataModelReferenceProperty: BasicDataModel;
  aliasReferenceProperty: DataModelUnion;
  verdeTableProperty: VerdeTable<DataModelUnion>;
  verdeArrayProperty: VerdeArray<string>;
  objectProperty: { objectStringProperty: string; };
  tupleProperty: [tupleNumberProperty: number];
  unionProperty: string | null;
}

type DataModelUnion = BasicDataModel;