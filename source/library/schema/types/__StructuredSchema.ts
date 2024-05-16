import {
  DefinitiveSchemaElement
} from './SchemaElement.ts';

export interface __StructuredSchema<ThisSchemaExport, ThisSchemaModels, ThisSchemaAlias> {
  schemaExport: ThisSchemaExport;
  schemaModels: ThisSchemaModels;
  schemaAliases: Record<string, ThisSchemaAlias>;
}

export interface __SchemaExport<ThisExportElement> {
  exportName: string;
  exportElement: ThisExportElement;
}

export interface __SchemaModel<ThisModelElement> {
  modelName: string;
  modelProperties: Record<
    ModelProperty<ThisModelElement>['propertyKey'],
    ModelProperty<ThisModelElement>
  >;
}

export interface ModelProperty<ThisModelElement> {
  propertyKey: string;
  propertyElement: ThisModelElement;
}

export interface __SchemaAlias {
  aliasName: string;
  aliasElement: DefinitiveSchemaElement;
}
