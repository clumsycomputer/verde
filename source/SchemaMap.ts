export interface SchemaMap {
  schemaId: string;
  schemaItems: Record<string, SchemaItem>;
}

export interface SchemaItem {
  itemId: string;
  itemBaseIds: Array<string>;
  itemProperties: Record<string, SchemaProperty>;  
}

export interface SchemaProperty {
  propertyId: string;
  propertyType: SchemaType;
}

export type SchemaType = PrimitiveSchemaType | InterfaceSchemaType;

interface PrimitiveSchemaType extends SchemaTypeBase<'primitive'> {}

interface InterfaceSchemaType extends SchemaTypeBase<'interface'> {}

interface SchemaTypeBase<TypeKind> {
  typeKind: TypeKind;
  typeId: string;
}
