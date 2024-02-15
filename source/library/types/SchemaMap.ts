import { genericAny } from '../../helpers/types.ts';

export interface SchemaMap<
  ThisSchemaModel extends __SchemaModel<genericAny>,
> {
  schemaSymbol: string;
  schemaModels: Record<ThisSchemaModel['modelKey'], ThisSchemaModel>;
}

export interface __SchemaModel<ThisModelElement> {
  modelKey: string;
  modelSymbol: string;
  modelProperties: Record<
    ModelProperty<ThisModelElement>['propertyKey'],
    ModelProperty<ThisModelElement>
  >;
}

export interface ModelProperty<ThisPropertyElement> {
  propertyKey: string;
  propertyElement: ThisPropertyElement;
}

export type ModelElement<ThisDataModel extends __SchemaModel<unknown>> =
  | DataModelElement<ThisDataModel>
  | LiteralModelElement
  | PrimitiveModelElement;

export interface DataModelElement<
  ThisDataModel extends __SchemaModel<unknown>,
> extends ModelElementBase<'dataModel'> {
  dataModelKey: ThisDataModel['modelKey'];
}

export type LiteralModelElement =
  | StringLiteralModelElement
  | NumberLiteralModelElement
  | BooleanLiteralModelElement;

export interface StringLiteralModelElement
  extends LiteralModelElementBase<'string'> {}

export interface NumberLiteralModelElement
  extends LiteralModelElementBase<'number'> {}

export interface BooleanLiteralModelElement
  extends LiteralModelElementBase<'boolean'> {}

interface LiteralModelElementBase<
  LiteralKind extends PrimitiveModelElement['primitiveKind'],
> extends ModelElementBase<'literal'> {
  literalKind: LiteralKind;
  literalSymbol: string;
}

export type PrimitiveModelElement =
  | StringModelElement
  | NumberModelElement
  | BooleanModelElement;

export interface StringModelElement
  extends PrimitiveModelElementBase<'string'> {}

export interface NumberModelElement
  extends PrimitiveModelElementBase<'number'> {}

export interface BooleanModelElement
  extends PrimitiveModelElementBase<'boolean'> {}

interface PrimitiveModelElementBase<PrimitiveKind>
  extends ModelElementBase<'primitive'> {
  primitiveKind: PrimitiveKind;
}

export interface ModelElementBase<ElementKind> {
  elementKind: ElementKind;
}
