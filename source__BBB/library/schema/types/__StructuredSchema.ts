export interface __StructuredSchema<ThisSchemaExport, ThisSchemaType> {
  schemaExport: ThisSchemaExport;
  schemaTypes: Record<string, ThisSchemaType>;
}

export interface __SchemaExport<ThisExportElement> {
  exportName: string;
  exportElement: ThisExportElement;
}

export interface __SchemaType<ThisTypeKind> {
  typeKind: ThisTypeKind;
  typeName: string;
}

export interface __SchemaModel<ThisTypeKind, ThisModelElement>
  extends __SchemaType<ThisTypeKind> {
  typeModelProperties: Record<
    ModelProperty<ThisModelElement>['propertyKey'],
    ModelProperty<ThisModelElement>
  >;
}

export interface ModelProperty<ThisModelElement> {
  propertyKey: string;
  propertyElement: ThisModelElement;
}