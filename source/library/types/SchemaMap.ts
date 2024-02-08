export interface SchemaMap<
  ThisSchemaModel extends AnySchemaModel,
> {
  schemaSymbol: string;
  schemaModels: Record<ThisSchemaModel['modelKey'], ThisSchemaModel>;
}

type AnySchemaModel = SchemaModel<ModelProperty<any>>;

type UnknownSchemaModel = SchemaModel<ModelProperty<unknown>>;

export interface SchemaModel<
  ThisModelProperty extends AnyModelProperty,
> {
  modelKey: string;
  modelSymbol: string;
  modelProperties: Record<ThisModelProperty['propertyKey'], ThisModelProperty>;
}

type AnyModelProperty = ModelProperty<any>;

export interface ModelProperty<ThisPropertyElement> {
  propertyKey: string;
  propertyElement: ThisPropertyElement;
}

export type ModelElement<ThisDataModel extends UnknownSchemaModel> =
  | DataModelElement<ThisDataModel>
  | LiteralModelElement
  | PrimitiveModelElement;

export interface DataModelElement<
  ThisDataModel extends UnknownSchemaModel,
> extends ModelElementBase<'dataModel'> {
  dataModelKey: ThisDataModel['modelKey'];
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

interface LiteralModelElementBase<
  LiteralKind extends PrimitiveModelElement['primitiveKind'],
> extends ModelElementBase<'literal'> {
  literalKind: LiteralKind;
  literalSymbol: string;
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

export interface ModelElementBase<ElementKind> {
  elementKind: ElementKind;
}
