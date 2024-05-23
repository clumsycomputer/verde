import {
  AliasReferenceElement,
  DataModelReferenceElement,
  DefinitiveSchemaElement,
  ExportUnionElement,
  GenericSchemaElement,
} from './SchemaElement.ts';
import {
  __SchemaAlias,
  __SchemaExport,
  __SchemaModel,
  __StructuredSchema,
} from './__StructuredSchema.ts';

export interface IntermediateSchema
  extends __StructuredSchema<IntermediateSchemaExport, IntermediateSchemaType> {}

interface IntermediateSchemaExport extends
  __SchemaExport<
    DataModelReferenceElement | AliasReferenceElement | ExportUnionElement
  > {}

export type IntermediateSchemaType = IntermediateSchemaModel | IntermediateSchemaAlias;

export type IntermediateSchemaModel = DataIntermediateSchemaModel | TemplateIntermediateSchemaModel;

export interface DataIntermediateSchemaModel
  extends __IntermediateModel<'dataModel', DefinitiveSchemaElement> {}

type TemplateIntermediateSchemaModel =
  | ConcreteTemplateIntermediateSchemaModel
  | GenericTemplateIntermediateSchemaModel;

export interface ConcreteTemplateIntermediateSchemaModel
  extends
  __TemplateIntermediateSchemaModel<
      'concreteTemplateModel',
      DefinitiveSchemaElement
    > {}

export interface GenericTemplateIntermediateSchemaModel
  extends
  __TemplateIntermediateSchemaModel<'genericTemplateModel', GenericSchemaElement> {
  typeModelParameters: Array<GenericTemplateModelParameter>;
}

export type GenericTemplateModelParameter =
  | BasicTemplateModelParameter
  | ConstrainedTemplateModelParameter;

interface BasicTemplateModelParameter
  extends __GenericTemplateParameter<'basic'> {}

interface ConstrainedTemplateModelParameter
  extends __GenericTemplateParameter<'constrained'> {
  parameterConstraint: string;
}

interface __GenericTemplateParameter<ThisParameterKind> {
  parameterKind: ThisParameterKind;
  parameterName: string;
}

interface __TemplateIntermediateSchemaModel<ThisTypeKind, ThisModelElement>
  extends __IntermediateModel<ThisTypeKind, ThisModelElement> {}

interface __IntermediateModel<ThisTypeKind, ThisModelElement>
  extends __SchemaModel<ThisTypeKind, ThisModelElement>, __IntermediateSchemaType {
  typeModelTemplates: Array<ModelTemplate<ThisModelElement>>;
}

type ModelTemplate<ThisModelElement> =
  | ConcreteModelTemplate
  | GenericModelTemplate<ThisModelElement>;

interface ConcreteModelTemplate
  extends __ModelTemplate<'concreteTemplateModel'> {}

export interface GenericModelTemplate<ThisArgumentElement>
  extends __ModelTemplate<'genericTemplateModel'> {
  templateArguments: Record<
    GenericTemplateArgument<ThisArgumentElement>['argumentParameterName'],
    GenericTemplateArgument<ThisArgumentElement>
  >;
}

interface GenericTemplateArgument<ThisModelElement> {
  argumentIndex: number;
  argumentParameterName: string;  
  argumentElement: ThisModelElement;
}

interface __ModelTemplate<
  ThisTemplateModelKind extends TemplateIntermediateSchemaModel['typeKind'],
> {
  templateModelKind: ThisTemplateModelKind;
  templateModelName: TemplateIntermediateSchemaModel['typeName'];
}

export interface IntermediateSchemaAlias extends __SchemaAlias<'alias'>, __IntermediateSchemaType {}

interface __IntermediateSchemaType {
  typeSourcePath: string;
}
