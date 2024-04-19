import { ConcreteSchemaElement } from './SchemaElement.ts';

export interface BasicStructuredSchema<SomeSchemaModel>
  extends StructuredSchema<Record<string, SomeSchemaModel>, unknown> {}

export interface StructuredSchema<ThisSchemaModels, ThisSchemaTypes> {
  schemaSymbol: string;
  schemaModels: ThisSchemaModels;
  schemaTypes: ThisSchemaTypes;
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

export interface __SchemaType<ThisTypeKind, ThisTypeElement> {
  typeKind: ThisTypeKind;
  typeElement: ThisTypeElement;
  typeSymbol: string;  
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
