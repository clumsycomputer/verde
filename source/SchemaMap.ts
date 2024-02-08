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

export interface TemplateParameter {
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
  extensionArguments: Array<ExtensionArgument>;
}

export interface ExtensionArgument {
  argumentElement: ModelElement;
}

interface ModelExtensionBase<
  ExtensionKind extends TemplateModel['templateKind'],
> {
  extensionKind: ExtensionKind;
  extensionModelId: TemplateModel['modelId'];
}

export interface ModelProperty {
  propertyKey: string;
  propertyElement: ModelElement;
}

export type ModelElement =
  | ParameterModelElement
  | DataModelModelElement
  | PrimitiveModelElement
  | LiteralModelElement;

export type ParameterModelElement =
  | BasicParameterModelElement
  | ConstrainedParameterModelElement;

export interface BasicParameterModelElement
  extends ParameterModelElementBase<'basic'> {}

export interface ConstrainedParameterModelElement
  extends ParameterModelElementBase<'constrained'> {
}

interface ParameterModelElementBase<ParameterKind>
  extends ModelElementBase<'parameter'> {
  parameterKind: ParameterKind;
}

export interface DataModelModelElement extends ModelElementBase<'dataModel'> {
  dataModelId: DataModel['modelId'];
}

export type PrimitiveModelElement =
  | StringModelElement
  | NumberModelElement
  | BooleanModelElement;

export interface StringModelElement
  extends PrimitiveModelElementBase<'string'> {}

export interface NumberModelElement
  extends PrimitiveModelElementBase<'number'> {}

export interface BooleanModelElement
  extends PrimitiveModelElementBase<'boolean'> {}

interface PrimitiveModelElementBase<PrimitiveKind>
  extends ModelElementBase<'primitive'> {
  primitiveKind: PrimitiveKind;
}

export type LiteralModelElement =
  | StringLiteralModelElement
  | NumberLiteralModelElement
  | BooleanLiteralModelElement;

export interface StringLiteralModelElement
  extends LiteralModelElementBase<'string'> {}

export interface NumberLiteralModelElement
  extends LiteralModelElementBase<'number'> {}

export interface BooleanLiteralModelElement
  extends LiteralModelElementBase<'boolean'> {}

interface LiteralModelElementBase<LiteralKind>
  extends ModelElementBase<'literal'> {
  literalKind: LiteralKind;
  literalSymbol: string;
}

interface ModelElementBase<ElementKind> {
  elementKind: ElementKind;
}
