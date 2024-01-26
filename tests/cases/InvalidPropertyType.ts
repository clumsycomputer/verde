export type InvalidPropertyTypeSchema = [FooSchemaItem]

interface FooSchemaItem {
  invalidProperty: string | null;
}