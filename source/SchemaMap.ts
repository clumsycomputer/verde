export interface SchemaMap {
  schemaSymbol: string;
  schemaModels: Record<SchemaModel['modelId'], SchemaModel>;
}

export type SchemaModel = DataModel | TemplateModel;

export interface DataModel extends SchemaModelBase<'data'> {}

export type TemplateModel =
  | GenericTemplateModel
  | ConcreteTemplateModel;

export interface GenericTemplateModel extends TemplateSchemaBase<'generic'> {
  templateParameters: Array<TemplateParameter>;
}

interface TemplateParameter {
  parameterSymbol: string;
}

export interface ConcreteTemplateModel extends TemplateSchemaBase<'concrete'> {}

interface TemplateSchemaBase<TemplateKind> extends SchemaModelBase<'template'> {
  templateKind: TemplateKind;
}

interface SchemaModelBase<TypeKind> {
  modelKind: TypeKind;
  modelId: string;
  modelSymbol: string;
  modelExtensions: Array<ModelExtension>;
  modelProperties: Record<
    ModelProperty['propertyKey'],
    ModelProperty
  >;
}

export type ModelExtension =
  | ConcreteModelExtension
  | GenericModelExtension;

export interface ConcreteModelExtension
  extends ModelExtensionBase<ConcreteTemplateModel['templateKind']> {}

export interface GenericModelExtension
  extends ModelExtensionBase<GenericTemplateModel['templateKind']> {
  extensionTypeArguments: Array<unknown>;
}

interface ModelExtensionBase<
  ExtensionKind extends TemplateModel['templateKind'],
> {
  extensionKind: ExtensionKind;
  extensionModelId: TemplateModel['modelId'];
}

export type ModelProperty =
  | DataModelModelProperty
  | PrimitiveModelProperty;

export interface DataModelModelProperty
  extends ModelPropertyBase<'dataModel'> {
  dataModelId: DataModel['modelId'];
}

export type PrimitiveModelProperty =
  | StringModelProperty
  | NumberModelProperty
  | BooleanModelProperty;

export interface StringModelProperty
  extends PrimitiveModelPropertyBase<'string'> {}

export interface NumberModelProperty
  extends PrimitiveModelPropertyBase<'number'> {}

export interface BooleanModelProperty
  extends PrimitiveModelPropertyBase<'boolean'> {}

interface PrimitiveModelPropertyBase<PrimitiveKind>
  extends ModelPropertyBase<'primitive'> {
  primitiveKind: PrimitiveKind;
}

interface ModelPropertyBase<PropertyKind> {
  propertyKind: PropertyKind;
  propertyKey: string;
}
