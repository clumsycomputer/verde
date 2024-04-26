export const schemaSourceInputs: Record<string, string> = {}

schemaSourceInputs['BasicDataModel'] = `
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
`.trim()

schemaSourceInputs['DataModelUnion'] = `
type DataModelUnion = BasicDataModel;
`.trim()

schemaSourceInputs['ValidSchemaModule'] = `
import { VerdeTable, VerdeArray } from '../../../source/library/module.ts';
import { RemoteDataModel, CompositeDataModel } from './SecondarySchemaModule.ts';

export type ValidSchema = [BasicDataModel, DataModelUnion, RemoteDataModel, CompositeDataModel];

${schemaSourceInputs['BasicDataModel']}

${schemaSourceInputs['DataModelUnion']}
`.trim()

schemaSourceInputs['CompositeDataModel'] = `
interface CompositeDataModel
  extends ConcreteTemplateModel, GenericTemplateModel<boolean, number> {}
`.trim()

schemaSourceInputs['ConcreteTemplateModel'] = `
interface ConcreteTemplateModel {}
`.trim()

schemaSourceInputs['GenericTemplateModel'] = `
interface GenericTemplateModel<BasicParameter, ConstrainedParameter extends number, DefaultParameter = string> {
  basicParameterProperty: BasicParameter;
  constrainedParameterProperty: ConstrainedParameter;
}
`.trim()


schemaSourceInputs['RemoteDataModel'] = `
interface RemoteDataModel {}
`.trim()

schemaSourceInputs['SecondarySchemaModule'] = `
export ${schemaSourceInputs['CompositeDataModel']}

export ${schemaSourceInputs['ConcreteTemplateModel']}

export ${schemaSourceInputs['GenericTemplateModel']}

export ${schemaSourceInputs['RemoteDataModel']}
`.trim()