import {
  DefinitiveSchemaElement
} from './SchemaElement.ts';

export interface __StructuredSchema<ThisSchemaModels, ThisSchemaAlias> {
  schemaName: string;
  schemaModels: ThisSchemaModels;
  schemaAliases: Record<string, ThisSchemaAlias>;
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

export interface __SchemaAlias<ThisAliasKind> {
  aliasKind: ThisAliasKind;
  aliasName: string;
  aliasElement: DefinitiveSchemaElement;
}
