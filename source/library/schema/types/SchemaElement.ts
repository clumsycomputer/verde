export type SchemaElement<ThisTerminalElement, ThisTupleSpreadReference> =
  | ThisTerminalElement
  | StructureElement<ThisTerminalElement, ThisTupleSpreadReference>
  | GeneralUnionElement<ThisTerminalElement, ThisTupleSpreadReference>;

export interface GeneralUnionElement<
  ThisTerminalElement,
  ThisTupleSpreadReference,
> extends
  __UnionElement<
    'generalUnion',
    | ThisTerminalElement
    | StructureElement<ThisTerminalElement, ThisTupleSpreadReference>
    | NullElement
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

export interface ExportUnionElement<ThisIndirectReferenceElement>
  extends
    __UnionElement<
      'exportUnion',
      ReferenceElement<ThisIndirectReferenceElement>
    > {}

export interface __UnionElement<ThisElementKind, ThisMemberElement>
  extends __SchemaElement<ThisElementKind> {
  elementMembers: Array<ThisMemberElement>;
}

export interface NullElement extends __SchemaElement<'null'> {}

export type StructureElement<
  ThisTerminalElement,
  ThisTupleSpreadReference,
> =
  | ObjectElement<ThisTerminalElement, ThisTupleSpreadReference>
  | TupleElement<ThisTerminalElement, ThisTupleSpreadReference>;

export interface ObjectElement<ThisTerminalElement, ThisTupleSpreadReference>
  extends
    __StructureElement<
      'objectStructure',
      Record<
        string,
        StructureProperty<ThisTerminalElement, ThisTupleSpreadReference>
      >
    > {}

export interface TupleElement<
  ThisTerminalElement,
  ThisTupleSpreadReference,
> extends
  __StructureElement<
    'tupleStructure',
    Array<
      | StructureProperty<ThisTerminalElement, ThisTupleSpreadReference>
      | ThisTupleSpreadReference
    >
  > {}

export interface TupleSpreadReference<ThisTerminalElement> {
  spreadElement:
    | AliasReferenceElement
    | Include<ThisTerminalElement, ParameterReferenceElement>;
}

type Include<T, U> = T extends U ? T : never;

interface __StructureElement<ThisElementKind, ThisElementStructure>
  extends __SchemaElement<ThisElementKind> {
  elementStructure: ThisElementStructure;
}

export interface StructureProperty<
  ThisTerminalElement,
  ThisTupleSpreadReference,
> {
  propertyKey: string;
  propertyElement: SchemaElement<ThisTerminalElement, ThisTupleSpreadReference>;
}

export type TerminalElement<
  ThisIndirectReferenceElement,
  ThisTupleSpreadReference,
> =
  | LiteralElement
  | PrimitiveElement
  | ReferenceElement<ThisIndirectReferenceElement>
  | VerdeElement<ThisIndirectReferenceElement, ThisTupleSpreadReference>;

export type VerdeElement<ThisIndirectReferenceElement, ThisTupleSpreadReference> =
  | VerdeTableElement<ThisIndirectReferenceElement>
  | VerdeArrayElement<ThisIndirectReferenceElement, ThisTupleSpreadReference>;

export interface VerdeTableElement<ThisIndirectReferenceElement>
  extends
    __CollectionElement<
      'verdeTable',
      | ReferenceElement<ThisIndirectReferenceElement>
      | VerdeTableUnionElement<ThisIndirectReferenceElement>
    > {}

export interface VerdeArrayElement<
  ThisIndirectReferenceElement,
  ThisTupleSpreadReference,
> extends
  __CollectionElement<
    'verdeArray',
    SchemaElement<
      VerdeArrayTerminalElement<ThisIndirectReferenceElement>,
      ThisTupleSpreadReference
    >
  > {}

type VerdeArrayTerminalElement<ThisIndirectReferenceElement> =
  | PrimitiveElement
  | ReferenceElement<ThisIndirectReferenceElement>
  | VerdeArrayUnionElement<ThisIndirectReferenceElement>;

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
