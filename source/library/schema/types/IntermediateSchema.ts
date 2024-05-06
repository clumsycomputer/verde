import {
  DefinitiveSchemaElement,
  GenericSchemaElement,
} from './SchemaElement.ts';
import {
  __SchemaAlias,
  __SchemaModel,
  __StructuredSchema,
} from './__StructuredSchema.ts';

export interface IntermediateSchema
  extends
    __StructuredSchema<IntermediateSchemaModels, IntermediateSchemaAlias> {}

interface IntermediateSchemaModels {
  data: Record<DataIntermediateModel['modelName'], DataIntermediateModel>;
  concreteTemplate: Record<
    ConcreteTemplateIntermediateModel['modelName'],
    ConcreteTemplateIntermediateModel
  >;
  genericTemplate: Record<
    GenericTemplateIntermediateModel['modelName'],
    GenericTemplateIntermediateModel
  >;
}

export interface DataIntermediateModel
  extends __IntermediateModel<'data', DefinitiveSchemaElement> {}

type TemplateIntermediateModel =
  | ConcreteTemplateIntermediateModel
  | GenericTemplateIntermediateModel;

export interface ConcreteTemplateIntermediateModel
  extends
    __TemplateIntermediateModel<
      'concreteTemplate',
      DefinitiveSchemaElement
    > {}

export interface GenericTemplateIntermediateModel
  extends
    __TemplateIntermediateModel<
      'genericTemplate',
      GenericSchemaElement
    > {
  modelParameters: Array<GenericTemplateParameter>;
}

export type GenericTemplateParameter = BasicTemplateParameter | ConstrainedTemplateParameter;

interface BasicTemplateParameter extends __GenericTemplateParameter<'basic'> {}

interface ConstrainedTemplateParameter
  extends __GenericTemplateParameter<'constrained'> {
  parameterConstraint: string;
}

interface __GenericTemplateParameter<ThisParameterKind> {
  parameterKind: ThisParameterKind;
  parameterName: string;
}

interface __TemplateIntermediateModel<ThisModelKind, ThisModelElement>
  extends __IntermediateModel<ThisModelKind, ThisModelElement> {}

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

interface ConcreteModelTemplate extends __ModelTemplate<'concreteTemplate'> {}

export interface GenericModelTemplate<ThisArgumentElement>
  extends __ModelTemplate<'genericTemplate'> {
  templateArguments: Record<
    GenericArgument<ThisArgumentElement>['argumentParameterNameKey'],
    GenericArgument<ThisArgumentElement>
  >;
}

interface GenericArgument<ThisModelElement> {
  argumentParameterNameKey: string;
  argumentIndex: number;
  argumentElement: ThisModelElement;
}

interface __ModelTemplate<
  ThisTemplateKind extends TemplateIntermediateModel['modelKind'],
> {
  templateKind: ThisTemplateKind;
  templateModelNameKey: TemplateIntermediateModel['modelName'];
}

type IntermediateSchemaAlias =
  | DataModelIntermediateAlias
  | GeneralIntermediateAlias;

export interface DataModelIntermediateAlias
  extends __SchemaAlias<'dataModel'> {}

export interface GeneralIntermediateAlias extends __SchemaAlias<'general'> {}

export type GetThisIntermediateElement<
  ThisModelKind extends keyof IntermediateSchema['schemaModels'],
> = GetThisIntermediateModel<
  ThisModelKind
>['modelProperties'][string]['propertyElement'];

export type GetThisIntermediateModel<
  ThisModelKind extends keyof IntermediateSchema['schemaModels'],
> = IntermediateSchema['schemaModels'][ThisModelKind][string];
