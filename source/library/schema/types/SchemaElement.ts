export type SchemaElement<ThisTerminalElement> =
  | ThisTerminalElement
  | StructureElement<ThisTerminalElement>
  | GeneralUnionElement<ThisTerminalElement>;

export interface GeneralUnionElement<ThisTerminalElement>
  extends
    __UnionElement<
      'generalUnion',
      ThisTerminalElement | StructureElement<ThisTerminalElement> | NullElement
    > {}

export interface VerdeTableUnionElement<ThisIndirectReferenceElement>
  extends
    __UnionElement<
      'verdeTableUnion',
      ReferenceElement<ThisIndirectReferenceElement>
    > {}

export interface VerdeArrayUnionElement<ThisIndirectReferenceElement>
  extends
    __UnionElement<
      'verdeArrayUnion',
      | PrimitiveElement
      | ReferenceElement<ThisIndirectReferenceElement>
    > {}

export interface ExportUnionElement<ThisIndirectReferenceElement> extends
  __UnionElement<
    'exportUnion',
    ReferenceElement<ThisIndirectReferenceElement>
  > {}

export interface __UnionElement<ThisElementKind, ThisMemberElement>
  extends __SchemaElement<ThisElementKind> {
  elementMembers: Array<ThisMemberElement>;
}

export interface NullElement extends __SchemaElement<'null'> {}

export type StructureElement<ThisTerminalElement> =
  | ObjectElement<ThisTerminalElement>
  | TupleElement<ThisTerminalElement>;

export interface ObjectElement<ThisTerminalElement> extends
  __StructureElement<
    'objectStructure',
    Record<string, StructureProperty<ThisTerminalElement>>
  > {}

export interface TupleElement<ThisTerminalElement> extends
  __StructureElement<
    'tupleStructure',
    Array<
      | StructureProperty<ThisTerminalElement>
      | TupleSpreadReference<ThisTerminalElement>
    >
  > {}

export interface TupleSpreadReference<ThisTerminalElement> {
  spreadElement:
    | AliasReferenceElement
    | Include<ThisTerminalElement, ParameterReferenceElement>
}

type Include<T, U> = T extends U ? T : never;

interface __StructureElement<ThisElementKind, ThisElementStructure>
  extends __SchemaElement<ThisElementKind> {
  elementStructure: ThisElementStructure;
}

export interface StructureProperty<ThisTerminalElement> {
  propertyKey: string;
  propertyElement: SchemaElement<ThisTerminalElement>;
}

export type TerminalElement<ThisIndirectReferenceElement> =
  | LiteralElement
  | PrimitiveElement
  | ReferenceElement<ThisIndirectReferenceElement>
  | VerdeElement<ThisIndirectReferenceElement>;

export type VerdeElement<ThisIndirectReferenceElement> =
  | VerdeTableElement<ThisIndirectReferenceElement>
  | VerdeArrayElement<ThisIndirectReferenceElement>;

export interface VerdeTableElement<ThisIndirectReferenceElement>
  extends
    __CollectionElement<
      'verdeTable',
      | ReferenceElement<ThisIndirectReferenceElement>
      | VerdeTableUnionElement<ThisIndirectReferenceElement>
    > {}

export interface VerdeArrayElement<ThisIndirectReferenceElement>
  extends
    __CollectionElement<
      'verdeArray',
      SchemaElement<
        | PrimitiveElement
        | ReferenceElement<ThisIndirectReferenceElement>
        | VerdeArrayUnionElement<ThisIndirectReferenceElement>
      >
    > {}

export interface __CollectionElement<
  ThisElementKind,
  ThisCollectionElement,
> extends __VerdeElement<ThisElementKind, [ThisCollectionElement]> {}

interface __VerdeElement<ThisElementKind, ThisElementArguments>
  extends __SchemaElement<ThisElementKind> {
  elementArguments: ThisElementArguments;
}

export type ReferenceElement<ThisIndirectReferenceElement> =
  | DataModelReferenceElement
  | ThisIndirectReferenceElement;

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
