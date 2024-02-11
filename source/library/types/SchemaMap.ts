export interface SchemaMap<
  ThisSchemaModel extends SchemaModel_Core<any>,
> {
  schemaSymbol: string;
  schemaModels: Record<ThisSchemaModel['modelKey'], ThisSchemaModel>;
}

export interface SchemaModel_Core<ThisModelElement> {
  modelKey: string;
  modelSymbol: string;
  modelProperties: Record<
    ModelProperty<ThisModelElement>['propertyKey'],
    ModelProperty<ThisModelElement>
  >;
}

export interface ModelProperty<ThisPropertyElement> {
  propertyKey: string;
  propertyElement: ThisPropertyElement;
}

export type ModelElement<ThisDataModel extends SchemaModel_Core<unknown>> =
  | DataModelElement<ThisDataModel>
  | LiteralModelElement
  | PrimitiveModelElement;

export interface DataModelElement<
  ThisDataModel extends SchemaModel_Core<unknown>,
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
