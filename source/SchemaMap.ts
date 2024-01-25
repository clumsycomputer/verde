export interface SchemaMap {
  schemaName: string;
  schemaItems: Record<string, SchemaItem>;
}

export interface SchemaItem {
  itemName: string;
  itemProperties: Record<string, SchemaProperty>;
  itemBaseItems: Array<string>;
}

export interface SchemaProperty {
  propertyName: string;
  propertyType: SchemaType;
}

export type SchemaType = PrimitiveSchemaType


interface PrimitiveSchemaType extends SchemaTypeBase<'primitive'> {}

interface SchemaTypeBase<TypeKind> {
  typeKind: TypeKind;
  typeName: string
}
