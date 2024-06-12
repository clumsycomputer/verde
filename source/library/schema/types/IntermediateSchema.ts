import {
  AliasReferenceElement,
  DataModelReferenceElement,
  ExportUnionElement,
  ParameterReferenceElement,
  SchemaElement,
  TerminalElement,
  TupleSpreadReference,
} from './SchemaElement.ts';
import {
  __SchemaExport,
  __SchemaModel,
  __SchemaType,
  __StructuredSchema,
} from './__StructuredSchema.ts';

export interface IntermediateSchema
  extends
    __StructuredSchema<IntermediateSchemaExport, IntermediateSchemaType> {}

interface IntermediateSchemaExport
  extends __SchemaExport<IntermediateExportElement> {}

export type IntermediateSchemaType =
  | IntermediateSchemaModel
  | IntermediateSchemaAlias;

export type IntermediateSchemaModel =
  | DataIntermediateSchemaModel
  | TemplateIntermediateSchemaModel;

export interface DataIntermediateSchemaModel
  extends
    __IntermediateModel<'dataModel', DefinitiveIntermediateSchemaElement> {}

type TemplateIntermediateSchemaModel =
  | ConcreteTemplateIntermediateSchemaModel
  | GenericTemplateIntermediateSchemaModel;

export interface ConcreteTemplateIntermediateSchemaModel
  extends
    __TemplateIntermediateSchemaModel<
      'concreteTemplateModel',
      DefinitiveIntermediateSchemaElement
    > {}

export interface GenericTemplateIntermediateSchemaModel
  extends
    __TemplateIntermediateSchemaModel<
      'genericTemplateModel',
      GenericIntermediateSchemaElement
    > {
  typeModelParameters: Array<GenericTemplateModelParameter>;
}

export type GenericTemplateModelParameter =
  | BasicTemplateModelParameter
  | ConstrainedTemplateModelParameter;

interface BasicTemplateModelParameter
  extends __GenericTemplateModelParameter<'basic'> {}

interface ConstrainedTemplateModelParameter
  extends __GenericTemplateModelParameter<'constrained'> {
  parameterConstraint: string;
}

interface __GenericTemplateModelParameter<ThisParameterKind> {
  parameterKind: ThisParameterKind;
  parameterName: string;
}

interface __TemplateIntermediateSchemaModel<ThisTypeKind, ThisModelElement>
  extends __IntermediateModel<ThisTypeKind, ThisModelElement> {}

interface __IntermediateModel<ThisTypeKind, ThisModelElement>
  extends
    __SchemaModel<ThisTypeKind, ThisModelElement>,
    __IntermediateSchemaType {
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

export interface IntermediateSchemaAlias
  extends __SchemaType<'alias'>, __IntermediateSchemaType {
  typeAliasElement: DefinitiveIntermediateSchemaElement;
}

interface __IntermediateSchemaType {
  typeSourcePath: string;
}

export type IntermediateExportElement =
  | DataModelReferenceElement
  | AliasReferenceElement
  | ExportUnionElement<AliasReferenceElement>;

type GenericIntermediateSchemaElement = SchemaElement<
  GenericIntermediateTerminalElement,
  GenericIntermediateTupleSpreadReference
>;

export type GenericIntermediateTerminalElement = TerminalElement<
  AliasReferenceElement | ParameterReferenceElement,
  GenericIntermediateTupleSpreadReference
>;

export type GenericIntermediateTupleSpreadReference = TupleSpreadReference<
  GenericIntermediateTerminalElement
>;

type DefinitiveIntermediateSchemaElement = SchemaElement<
  DefinitiveIntermediateTerminalElement,
  TupleSpreadReference<DefinitiveIntermediateTerminalElement>
>;

export type DefinitiveIntermediateTerminalElement = TerminalElement<
  AliasReferenceElement,
  DefinitiveIntermediateTupleSpreadReference
>;

export type DefinitiveIntermediateTupleSpreadReference = TupleSpreadReference<
  DefinitiveIntermediateTerminalElement
>;
