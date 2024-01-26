export type ValidSchema = [BasicSchemaItem, ExtensionSchemaItem];

interface BasicSchemaItem {
  stringProperty: string;
  numberProperty: number;
  booleanProperty: boolean;
  interfaceProperty: FooItem;
}

interface FooItem {
  fooProperty: string;
}

interface ExtensionSchemaItem extends BasicSchemaItem {
  extensionStringProperty: string;
}
