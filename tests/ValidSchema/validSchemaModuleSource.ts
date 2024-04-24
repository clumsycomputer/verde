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
import { RemoteDataModel, CompositeDataModel } from './SecondarySchemaModule.ts';

export type ValidSchema = [BasicDataModel, DataModelUnion, RemoteDataModel, CompositeDataModel];

${basicDataModelSource}

${dataModelUnionSource}
`.trim()

export const compositeDataModelSource = `
interface CompositeDataModel 
  extends ConcreteTemplateModel, GenericTemplateModel<boolean, number> {}
`.trim()

export const concreteTemplateModelSource = `
interface ConcreteTemplateModel {}
`.trim()

export const genericTemplateModelSource = `
interface GenericTemplateModel<BasicParameter, ConstrainedParameter extends number, DefaultParameter = string> {
  basicParameterProperty: BasicParameter;
  constrainedParameterProperty: ConstrainedParameter;
}
`.trim()


export const remoteDataModelSource = `
interface RemoteDataModel {}
`.trim()

export const secondarySchemaModuleSource = `
export ${compositeDataModelSource}

export ${concreteTemplateModelSource}

export ${genericTemplateModelSource}

export ${remoteDataModelSource}
`.trim()