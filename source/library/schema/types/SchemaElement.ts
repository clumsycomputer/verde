export type GenericSchemaElement = SchemaElement<
  TerminalElement<ParameterReferenceElement>
>;

export type DefinitiveSchemaElement = SchemaElement<
  TerminalElement<never>
>;

type SchemaElement<ThisTerminalElement> =
  | ThisTerminalElement
  | StructureElement<ThisTerminalElement>
  | GeneralUnionElement<ThisTerminalElement>;

export interface GeneralUnionElement<ThisTerminalElement>
  extends
    __UnionElement<
      'generalUnion',
      ThisTerminalElement | StructureElement<ThisTerminalElement> | NullElement
    > {}

export interface VerdeTableUnionElement<ThisParameterReferenceElement>
  extends
    __UnionElement<
      'verdeTableUnion',
      ReferenceElement<ThisParameterReferenceElement>
    > {}

export interface VerdeArrayUnionElement<ThisParameterReferenceElement>
  extends
    __UnionElement<
      'verdeArrayUnion',
      | PrimitiveElement
      | ReferenceElement<ThisParameterReferenceElement>
    > {}

export interface ExportUnionElement extends
  __UnionElement<
    'exportUnion',
    ReferenceElement<never>
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

export type TerminalElement<ThisParameterReferenceElement> =
  | LiteralElement
  | PrimitiveElement
  | ReferenceElement<ThisParameterReferenceElement>
  | VerdeElement<ThisParameterReferenceElement>;

export type VerdeElement<ThisParameterReferenceElement> =
  | VerdeTableElement<ThisParameterReferenceElement>
  | VerdeArrayElement<ThisParameterReferenceElement>;

export interface VerdeTableElement<ThisParameterReferenceElement>
  extends
    __CollectionElement<
      'verdeTable',
      | ReferenceElement<ThisParameterReferenceElement>
      | VerdeTableUnionElement<ThisParameterReferenceElement>
    > {}

export interface VerdeArrayElement<ThisParameterReferenceElement>
  extends
    __CollectionElement<
      'verdeArray',
      SchemaElement<
        | PrimitiveElement
        | ReferenceElement<ThisParameterReferenceElement>
        | VerdeArrayUnionElement<ThisParameterReferenceElement>
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

export type ReferenceElement<ThisParameterReferenceElement> =
  | DataModelReferenceElement
  | AliasReferenceElement
  | ThisParameterReferenceElement;

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
