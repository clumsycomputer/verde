export const basicDataModelSource = `
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
`.trim()

export const dataModelUnionSource = `
type DataModelUnion = BasicDataModel;
`.trim()

export const validSchemaModuleSource = `
import { VerdeTable, VerdeArray } from '../../../source/library/module.ts';
import { RemoteDataModel } from './SecondarySchemaModule.ts';

export type ValidSchema = [BasicDataModel, DataModelUnion, RemoteDataModel];

${basicDataModelSource}

${dataModelUnionSource}
`.trim()

const remoteDataModelSource = `
interface RemoteDataModel {}
`.trim()

export const secondarySchemaModuleSource = `
export ${remoteDataModelSource}
`