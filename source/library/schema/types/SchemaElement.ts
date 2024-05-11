export type GenericSchemaElement = SchemaElement<
  TerminalElement<ParameterReferenceElement>
>;

export type DefinitiveSchemaElement = SchemaElement<
  TerminalElement<never>
>;

type SchemaElement<ThisTerminalElement> =
  | ThisTerminalElement
  | StructureElement<ThisTerminalElement>
  | CoreUnionElement<ThisTerminalElement>;

export interface CoreUnionElement<ThisTerminalElement> extends
  __UnionElement<
    'coreUnion',
    ThisTerminalElement | StructureElement<ThisTerminalElement> | NullElement
  > {}

export interface DataModelUnionElement<ThisParameterReferenceElement>
  extends
    __UnionElement<
      'dataModelUnion',
      DataModelReferenceElement | AliasReferenceElement | ThisParameterReferenceElement
    > {}

export interface __UnionElement<ThisElementKind, ThisMemberElement>
  extends __SchemaElement<ThisElementKind> {
  elementMembers: Array<ThisMemberElement>;
}

export interface NullElement extends __SchemaElement<'null'> {}

export type StructureElement<ThisTerminalElement> =
  | ObjectStructureElement<
    ThisTerminalElement | StructureElement<ThisTerminalElement>
  >
  | TupleStructureElement<
    ThisTerminalElement | StructureElement<ThisTerminalElement>
  >;

export interface ObjectStructureElement<ThisTerminalElement>
  extends
    __StructureElement<
      'objectStructure',
      ObjectElementProperty<ThisTerminalElement>
    > {}

interface ObjectElementProperty<ThisTerminalElement>
  extends __ElementProperty<ThisTerminalElement> {}

export interface TupleStructureElement<ThisTerminalElement>
  extends
    __StructureElement<
      'tupleStructure',
      TupleElementProperty<ThisTerminalElement>
    > {}

interface TupleElementProperty<ThisTerminalElement>
  extends __ElementProperty<ThisTerminalElement> {
  propertyIndex: number;
}

interface __StructureElement<ThisElementKind, ThisElementProperty>
  extends __SchemaElement<ThisElementKind> {
  elementProperties: Record<string, ThisElementProperty>;
}

interface __ElementProperty<ThisTerminalElement> {
  propertyKey: string;
  propertyElement: SchemaElement<ThisTerminalElement>;
}

export type TerminalElement<ThisParameterReferenceElement> =
  | BasicTerminalElement
  | ThisParameterReferenceElement
  | VerdeElement<ThisParameterReferenceElement>;

export type BasicTerminalElement =
  | AliasReferenceElement
  | DataModelReferenceElement
  | PrimitiveElement
  | LiteralElement;

export type VerdeElement<ThisParameterReferenceElement> =
  | VerdeTableElement<ThisParameterReferenceElement>
  | VerdeArrayElement<ThisParameterReferenceElement>;

export interface VerdeTableElement<ThisParameterReferenceElement>
  extends
    __CollectionElement<
      'verdeTable',
      | DataModelReferenceElement
      | AliasReferenceElement
      | ThisParameterReferenceElement
      | DataModelUnionElement<ThisParameterReferenceElement>
    > {}

export interface VerdeArrayElement<ThisParameterReferenceElement>
  extends
    __CollectionElement<
      'verdeArray',
      SchemaElement<BasicTerminalElement | ThisParameterReferenceElement>
    > {}

export interface __CollectionElement<
  ThisElementKind,
  ThisCollectionElement,
> extends __VerdeElement<ThisElementKind, [ThisCollectionElement]> {}

interface __VerdeElement<ThisElementKind, ThisElementArguments>
  extends __SchemaElement<ThisElementKind> {
  elementArguments: ThisElementArguments;
}

export interface ParameterReferenceElement
  extends __ReferenceElement<'parameterReference'> {}

export interface AliasReferenceElement
  extends __ReferenceElement<'aliasReference'> {}

export interface DataModelReferenceElement
  extends __ReferenceElement<'dataModelReference'> {}

interface __ReferenceElement<ThisElementKind>
  extends __SchemaElement<ThisElementKind> {
  elementName: string;
}

export type PrimitiveElement =
  | StringPrimitiveElement
  | NumberPrimitiveElement
  | BooleanPrimitiveElement;

export interface StringPrimitiveElement
  extends __PrimitiveElement<'stringPrimitive'> {}

export interface NumberPrimitiveElement
  extends __PrimitiveElement<'numberPrimitive'> {}

export interface BooleanPrimitiveElement
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
  elementSymbol: string;
}

export interface __SchemaElement<ThisElementKind> {
  elementKind: ThisElementKind;
}
