import {
  __SchemaModel,
  ModelElement,
  ModelElementBase,
  StructuredSchema,
} from './StructuredSchema.ts';

export type GetThisIntermediateElement<
  ThisModelKind extends keyof IntermediateSchema['schemaMap'],
> = GetThisIntermediateModel<
  ThisModelKind
>['modelProperties'][string]['propertyElement'];

export type GetThisIntermediateModel<
  ThisModelKind extends keyof IntermediateSchema['schemaMap'],
> = IntermediateSchema['schemaMap'][ThisModelKind][string];

export interface IntermediateSchema
  extends StructuredSchema<IntermediateSchemaMap> {
}

interface IntermediateSchemaMap {
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
  extends __IntermediateModel<'data', CoreIntermediateElement> {}

type TemplateIntermediateModel =
  | ConcreteTemplateIntermediateModel
  | GenericTemplateIntermediateModel;

export interface ConcreteTemplateIntermediateModel
  extends
    __TemplateIntermediateModel<
      'concreteTemplate',
      CoreIntermediateElement
    > {}

export interface GenericTemplateIntermediateModel
  extends
    __TemplateIntermediateModel<
      'genericTemplate',
      GenericTemplateIntermediateElement
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

export type GenericTemplateIntermediateElement =
  | ParameterElement
  | CoreIntermediateElement;

type ParameterElement =
  | BasicParameterElement
  | ConstrainedParameterElement;

interface BasicParameterElement
  extends ParameterElementBase<'basicParameter'> {}

interface ConstrainedParameterElement
  extends ParameterElementBase<'constrainedParameter'> {}

interface ParameterElementBase<ThisElementKind>
  extends ModelElementBase<ThisElementKind> {
  parameterSymbol: string;
}

export type CoreIntermediateElement = ModelElement<
  DataIntermediateModel
>;
