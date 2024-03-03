export interface BasicStructuredSchema<SomeSchemaModel>
  extends StructuredSchema<Record<string, SomeSchemaModel>> {}

export interface StructuredSchema<ThisSchemaMap> {
  schemaSymbol: string;
  schemaMap: ThisSchemaMap;
}

export interface __SchemaModel<ThisModelElement> {
  modelSymbolKey: string;
  modelProperties: Record<
    ModelProperty<ThisModelElement>['propertyKey'],
    ModelProperty<ThisModelElement>
  >;
}

export interface ModelProperty<ThisPropertyElement> {
  propertyKey: string;
  propertyElement: ThisPropertyElement;
}

export type ModelElement<ThisDataModel extends __SchemaModel<unknown>> =
  | DataModelElement<ThisDataModel>
  | LiteralModelElement
  | PrimitiveModelElement;

export interface DataModelElement<
  ThisDataModel extends __SchemaModel<unknown>,
> extends ModelElementBase<'dataModel'> {
  dataModelSymbolKey: ThisDataModel['modelSymbolKey'];
}

export type LiteralModelElement =
  | StringLiteralModelElement
  | NumberLiteralModelElement
  | BooleanLiteralModelElement;

export interface StringLiteralModelElement
  extends LiteralModelElementBase<'stringLiteral'> {}

export interface NumberLiteralModelElement
  extends LiteralModelElementBase<'numberLiteral'> {}

export interface BooleanLiteralModelElement
  extends LiteralModelElementBase<'booleanLiteral'> {}

interface LiteralModelElementBase<
  ThisElementKind,
> extends ModelElementBase<ThisElementKind> {
  literalSymbol: string;
}

export type PrimitiveModelElement =
  | StringModelElement
  | NumberModelElement
  | BooleanModelElement;

export interface StringModelElement
  extends PrimitiveModelElementBase<'stringPrimitive'> {}

export interface NumberModelElement
  extends PrimitiveModelElementBase<'numberPrimitive'> {}

export interface BooleanModelElement
  extends PrimitiveModelElementBase<'booleanPrimitive'> {}

interface PrimitiveModelElementBase<ThisElementKind>
  extends ModelElementBase<ThisElementKind> {}

export interface ModelElementBase<ElementKind> {
  elementKind: ElementKind;
}
