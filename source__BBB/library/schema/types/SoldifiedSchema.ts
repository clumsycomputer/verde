import type {
  __SchemaExport,
  __SchemaModel,
  __StructuredSchema,
} from './__StructuredSchema.ts';
import type { ExportUnionElement } from './SchemaElement.ts';
import type { DataModelReferenceElement } from './SchemaElement.ts';

interface SolidifedSchema
  extends __StructuredSchema<SolidifiedSchemaExport, SolidifiedSchemaType> {}

interface SolidifiedSchemaExport
  extends __SchemaExport<SolidifiedExportElement> {}

type SolidifiedExportElement =
  | DataModelReferenceElement
  | ExportUnionElement<never>;

type SolidifiedSchemaType = SolidifiedSchemaModel | SolidifiedSchemaAlias;

type SolidifiedSchemaModel = todo;

type SolidifiedSchemaAlias = todo;

interface DataSolidifiedSchemaModel
  extends __SolidifiedModel<'dataModel', DefinitiveIntermediateSchemaElement> {}

interface __SolidifiedModel<ThisTypeKind, ThisModelElement>
  extends __SchemaModel<ThisTypeKind, ThisModelElement> {
  typeModelTemplates: Array<ModelTemplate<ThisModelElement>>;
}
