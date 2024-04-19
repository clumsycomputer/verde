import { ConcreteSchemaElement, GenericSchemaElement, TerminalElement } from './SchemaElement.ts';
import {
  __SchemaModel,

  StructuredSchema,
} from './StructuredSchema.ts';

export type GetThisIntermediateElement<
  ThisModelKind extends keyof IntermediateSchema['schemaModels'],
> = GetThisIntermediateModel<
  ThisModelKind
>['modelProperties'][string]['propertyElement'];

export type GetThisIntermediateModel<
  ThisModelKind extends keyof IntermediateSchema['schemaModels'],
> = IntermediateSchema['schemaModels'][ThisModelKind][string];

type Foo = GetThisIntermediateElement<'genericTemplate'>

type Baz = Foo['elementKind']

export interface IntermediateSchema
  extends StructuredSchema<IntermediateSchemaModels> {}

interface IntermediateSchemaModels {
  data: Record<DataIntermediateModel['modelSymbol'], DataIntermediateModel>;
  concreteTemplate: Record<
    ConcreteTemplateIntermediateModel['modelSymbol'],
    ConcreteTemplateIntermediateModel
  >;
  genericTemplate: Record<
    GenericTemplateIntermediateModel['modelSymbol'],
    GenericTemplateIntermediateModel
  >;
}

export interface DataIntermediateModel
  extends __IntermediateModel<'data', ConcreteSchemaElement> {}

type TemplateIntermediateModel =
  | ConcreteTemplateIntermediateModel
  | GenericTemplateIntermediateModel;

export interface ConcreteTemplateIntermediateModel
  extends
    __TemplateIntermediateModel<
      'concreteTemplate',
      ConcreteSchemaElement
    > {}

export interface GenericTemplateIntermediateModel
  extends
    __TemplateIntermediateModel<
      'genericTemplate',
      GenericSchemaElement
    > {
  genericParameters: Array<GenericParameter>;
}

export interface GenericParameter {
  parameterSymbol: string;
}

interface __TemplateIntermediateModel<ThisModelKind, ThisModelElement>
  extends __IntermediateModel<ThisModelKind, ThisModelElement> {
}

interface __IntermediateModel<
  ThisModelKind,
  ThisModelElement,
> extends __SchemaModel<ThisModelElement> {
  modelKind: ThisModelKind;
  modelTemplates: Array<ModelTemplate<ThisModelElement>>;
}

type ModelTemplate<ThisModelElement> =
  | ConcreteModelTemplate
  | GenericModelTemplate<ThisModelElement>;

interface ConcreteModelTemplate extends ModelTemplateBase<'concreteTemplate'> {}

export interface GenericModelTemplate<ThisArgumentElement>
  extends ModelTemplateBase<'genericTemplate'> {
  genericArguments: Record<
    GenericArgument<ThisArgumentElement>['argumentParameterSymbolKey'],
    GenericArgument<ThisArgumentElement>
  >;
}

interface GenericArgument<ThisArgumentElement> {
  argumentParameterSymbolKey: string;
  argumentIndex: number;
  argumentElement: ThisArgumentElement;
}

interface ModelTemplateBase<
  ThisTemplateKind extends TemplateIntermediateModel['modelKind'],
> {
  templateKind: ThisTemplateKind;
  templateModelSymbolKey: TemplateIntermediateModel['modelSymbol'];
}
