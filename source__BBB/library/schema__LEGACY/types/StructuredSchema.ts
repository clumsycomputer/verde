import { AliasReferenceElement } from './SchemaElement.ts';

export interface BasicStructuredSchema<SomeSchemaModel>
  extends StructuredSchema<Record<string, SomeSchemaModel>, unknown> {}

export interface StructuredSchema<ThisSchemaModels, ThisSchemaAlias> {
  schemaSymbol: string;
  schemaModels: ThisSchemaModels;
  schemaAliases: Record<string, ThisSchemaAlias>;
}

export interface __SchemaModel<ThisModelElement> {
  modelSymbol: string;
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
  aliasSymbol: string;
  aliasElement: AliasReferenceElement;
}

export type SchemaRecord<ThisRecordProperties extends Record<string, any>> =
  & {
    __id: number;
    __modelSymbol: string;
  }
  & {
    [SomePropertyKey in keyof ThisRecordProperties]:
      ThisRecordProperties[SomePropertyKey];
  };
