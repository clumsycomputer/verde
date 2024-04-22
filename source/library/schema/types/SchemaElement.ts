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
  parameterName: string;
}

export type DefinitiveSchemaElement = SchemaElement<
  TerminalElement<never>
>;

type SchemaElement<ThisTerminalElement> =
  | ThisTerminalElement
  | StructureElement<ThisTerminalElement>
  | UnionCompositionElement<
    ThisTerminalElement | StructureElement<ThisTerminalElement>
  >;

export interface UnionCompositionElement<ThisMemberElement>
  extends __SchemaElement<'unionComposition'> {
  unionMembers: Record<
    string,
    | ThisMemberElement
    | NullElement
  >;
}

export interface NullElement extends __SchemaElement<'null'> {}

export type StructureElement<ThisTerminalElement> =
  | ObjectStructureElement<ThisTerminalElement>
  | TupleStructureElement<ThisTerminalElement>;

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
  | AliasReferenceElement
  | DataModelReferenceElement
  | PrimitiveElement
  | LiteralElement;

export type VerdeElement<ThisParameterElement> =
  | VerdeTableElement<ThisParameterElement>
  | VerdeArrayElement<ThisParameterElement>;

export interface VerdeTableElement<ThisParameterElement>
  extends
    __CollectionElement<
      'verdeTable',
      | DataModelReferenceElement
      | AliasReferenceElement
      | ThisParameterElement
      | UnionCompositionElement<
        DataModelReferenceElement | AliasReferenceElement | ThisParameterElement
      >
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

export interface AliasReferenceElement
  extends __SchemaElement<'aliasReference'> {
  aliasNameKey: string;
}

export interface DataModelReferenceElement
  extends __SchemaElement<'dataModelReference'> {
  dataModelNameKey: string;
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
  literalSymbol: string;
}

export interface __SchemaElement<ThisElementKind> {
  elementKind: ThisElementKind;
}
