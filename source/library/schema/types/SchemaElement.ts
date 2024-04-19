export type GenericSchemaElement = SchemaElement<
TerminalElement<TemplateParameterElement>
>;

export type TemplateParameterElement =
  | ConstrainedParameterElement
  | BasicParameterElement;

export interface ConstrainedParameterElement
  extends __TemplateParameterElement<'constrainedParameter'> {}

export interface BasicParameterElement
  extends __TemplateParameterElement<'basicParameter'> {}

interface __TemplateParameterElement<ThisElementKind>
  extends __SchemaElement<ThisElementKind> {
  parameterSymbol: string;
}

export type ConcreteSchemaElement = SchemaElement<
TerminalElement<never>
>;

type SchemaElement<ThisTerminalElement> =
  | ThisTerminalElement
  | StructureElement<ThisTerminalElement>
  | UnionElement<ThisTerminalElement | StructureElement<ThisTerminalElement>>;

export interface UnionElement<ThisMemberElement>
  extends __SchemaElement<'union'> {
  unionMembers: Record<
    string,
    | ThisMemberElement
    | NullElement
  >;
}

export interface NullElement extends __SchemaElement<'null'> {}

export type StructureElement<ThisTerminalElement> =
  | ObjectElement<ThisTerminalElement>
  | TupleElement<ThisTerminalElement>;

export interface ObjectElement<ThisTerminalElement>
  extends
    __StructureElement<'object', ObjectElementProperty<ThisTerminalElement>> {}

interface ObjectElementProperty<ThisTerminalElement>
  extends __ElementProperty<ThisTerminalElement> {}

export interface TupleElement<ThisTerminalElement>
  extends
    __StructureElement<'tuple', TupleElementProperty<ThisTerminalElement>> {}

interface TupleElementProperty<ThisTerminalElement>
  extends __ElementProperty<ThisTerminalElement> {
  propertyIndex: number;
}

interface __StructureElement<ThisElementKind, ThisElementProperty>
  extends __SchemaElement<ThisElementKind> {
  structureProperties: Record<string, ThisElementProperty>;
}

interface __ElementProperty<ThisTerminalElement> {
  propertyKey: string;
  propertyElement: SchemaElement<ThisTerminalElement>;
}

export type TerminalElement<ThisParameterElement> =
  | ConcreteTerminalElement
  | ThisParameterElement
  | VerdeElement<ThisParameterElement>;

export type ConcreteTerminalElement =
  | TypeReferenceElement
  | DataModelReferenceElement
  | PrimitiveElement
  | LiteralElement;

export type VerdeElement<ThisParameterElement> =
  | VerdeTableElement<ThisParameterElement>
  | VerdeArrayElement<ThisParameterElement>;

export interface VerdeTableElement<ThisParameterElement>
  extends
    __CollectionElement<
      'verdeElement',
      | DataModelReferenceElement
      | TypeReferenceElement
      | ThisParameterElement
      | UnionElement<DataModelReferenceElement | TypeReferenceElement | ThisParameterElement>
    > {}

export interface VerdeArrayElement<ThisParameterElement>
  extends
    __CollectionElement<
      'verdeArray',
      SchemaElement<ConcreteTerminalElement | ThisParameterElement>
    > {}

interface __CollectionElement<
  ThisElementKind,
  ThisCollectionElement,
> extends __VerdeElement<ThisElementKind> {
  collectionElement: ThisCollectionElement;
}

interface __VerdeElement<ThisElementKind>
  extends __SchemaElement<ThisElementKind> {}

export interface TypeReferenceElement extends __SchemaElement<'typeReference'> {
  typeSymbolKey: string;
}

export interface DataModelReferenceElement extends __SchemaElement<'dataModelReference'> {
  dataModelSymbolKey: string;
}

export type PrimitiveElement = StringElement | NumberElement | BooleanElement;

export interface StringElement extends __PrimitiveElement<'stringPrimitive'> {}

export interface NumberElement extends __PrimitiveElement<'numberPrimitive'> {}

export interface BooleanElement
  extends __PrimitiveElement<'booleanPrimitive'> {}

interface __PrimitiveElement<ThisElementKind>
  extends __SchemaElement<ThisElementKind> {}

export type LiteralElement =
  | StringLiteralElement
  | NumberLiteralElement
  | BooleanLiteralElement;

export interface StringLiteralElement
  extends __LiteralElement<'stringLiteral'> {}

export interface NumberLiteralElement
  extends __LiteralElement<'numberLiteral'> {}

export interface BooleanLiteralElement
  extends __LiteralElement<'booleanLiteral'> {}

interface __LiteralElement<ThisElementKind>
  extends __SchemaElement<ThisElementKind> {
  literalSymbol: string;
}

export interface __SchemaElement<ThisElementKind> {
  elementKind: ThisElementKind;
}
