import { VerdeTable, VerdeArray } from '../../../source/library/module.ts';
import {CompositeDataModel } from './CompositeDataModel.ts';

export type ValidSchema = [BasicDataModel, DataModelUnion, CompositeDataModel];

interface BasicDataModel {
  booleanLiteralProperty: true;
  numberLiteralProperty: 123;
  stringLiteralProperty: "hello";
  booleanProperty: boolean;
  numberProperty: number;
  stringProperty: string;
  dataModelProperty: BasicDataModel;
  aliasProperty: DataModelUnion;
  verdeTableProperty: VerdeTable<DataModelUnion>;
  verdeArrayProperty: VerdeArray<string>;
  objectProperty: { objectStringProperty: string; };
  tupleProperty: [tupleNumberProperty: number];
  unionProperty: string | null;
}

type DataModelUnion = BasicDataModel;