export interface BasicStructuredSchema<SomeSchemaModel>
  extends StructuredSchema<Record<string, SomeSchemaModel>, unknown> {}

export interface StructuredSchema<ThisSchemaModelMap, ThisSchemaTypeMap> {
  schemaSymbol: string;
  schemaModelMap: ThisSchemaModelMap;
  schemaTypeMap: ThisSchemaTypeMap;
}

export interface __SchemaModel<ThisModelElement> {
  modelSymbol: string;
  modelProperties: Record<
    ModelProperty<ThisModelElement>['propertyKey'],
    ModelProperty<ThisModelElement>
  >;
}

export interface ModelProperty<ThisModelElement> {
  propertyKey: string;
  propertyElement: ThisModelElement;
}

export type ModelElement =
  | DataModelModelElement
  | TypeModelElement
  | PrimitiveModelElement
  | LiteralModelElement;

export interface DataModelModelElement extends __ModelElement<'dataModel'> {
  dataModelSymbolKey: string;
}

type TypeModelElement = DataModelUnionTypeModelElement | ModelElementUnionTypeModelElement | AliasTypeModelElement

interface DataModelUnionTypeModelElement extends __TypeModelElement<'dataModelUnionType'> {}

interface ModelElementUnionTypeModelElement extends __TypeModelElement<'modelElementUnionType'> {}

interface AliasTypeModelElement extends __TypeModelElement<'aliasType'> {}

interface __TypeModelElement<ThisElementKind> extends __ModelElement<ThisElementKind> {
  typeSymbolKey: string;
}

type VerdeModelElement = VerdeTableModelElement | VerdeArrayModelElement

interface VerdeArrayModelElement extends __VerdeModelElement<'verdeArray'> {
  arrayElement: unknown | todo
}

interface VerdeTableModelElement extends __VerdeModelElement<'verdeTable'> {
  tableElement: DataModelUnionTypeModelElement | DataModelModelElement
}

interface __VerdeModelElement<ThisElementKind> extends __ModelElement<ThisElementKind> {}

export type PrimitiveModelElement =
  | StringModelElement
  | NumberModelElement
  | BooleanModelElement;

export interface StringModelElement
  extends __PrimitiveModelElement<'stringPrimitive'> {}

export interface NumberModelElement
  extends __PrimitiveModelElement<'numberPrimitive'> {}

export interface BooleanModelElement
  extends __PrimitiveModelElement<'booleanPrimitive'> {}

interface __PrimitiveModelElement<ThisElementKind>
  extends __ModelElement<ThisElementKind> {}

export type LiteralModelElement =
  | StringLiteralModelElement
  | NumberLiteralModelElement
  | BooleanLiteralModelElement;

export interface StringLiteralModelElement
  extends __LiteralModelElement<'stringLiteral'> {}

export interface NumberLiteralModelElement
  extends __LiteralModelElement<'numberLiteral'> {}

export interface BooleanLiteralModelElement
  extends __LiteralModelElement<'booleanLiteral'> {}

interface __LiteralModelElement<
  ThisElementKind,
> extends __ModelElement<ThisElementKind> {
  literalSymbol: string;
}

export interface __ModelElement<ElementKind> {
  elementKind: ElementKind;
}

interface DataModelUnionType extends __UnionType<'dataModelUnion'> {}

interface ModelElementUnionType extends __UnionType<'modelElementUnion'> {}

interface __UnionType<ThisTypeKind> extends __SchemaType<ThisTypeKind> {}

interface AliasType extends __SchemaType<'alias'> {}

interface __SchemaType<ThisTypeKind> {
  typeKind: ThisTypeKind;
  typeSymbol: string;
}

export type SchemaRecord<ThisRecordProperties extends Record<string, any>> =
  & {
    __id: number;
    __modelSymbol: string;
  }
  & {
    [SomePropertyKey in keyof ThisRecordProperties]:
      ThisRecordProperties[SomePropertyKey];
  };
