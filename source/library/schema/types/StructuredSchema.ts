import { ConcreteSchemaElement } from './SchemaElement.ts';

export interface BasicStructuredSchema<SomeSchemaModel>
  extends StructuredSchema<Record<string, SomeSchemaModel>> {}

export interface StructuredSchema<ThisSchemaModels> {
  schemaSymbol: string;
  schemaModels: ThisSchemaModels;
  schemaTypes: Record<string, SchemaType>;
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

interface SchemaType {
  typeSymbol: string;
  typeElement: ConcreteSchemaElement
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
