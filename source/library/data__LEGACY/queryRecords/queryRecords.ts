export interface QueryRecordsApi {
  dataQuery: DataQuery;
}

export function queryRecords(api: QueryRecordsApi) {
  const { dataQuery } = api;
  console.log('todo');
}

interface DataQuery {
  queryFilter: QueryFilter;
  querySort: QuerySort;
}

type QueryFilter = CompositeMacroFilter | ModelQueryFilter;

type CompositeMacroFilter =
  | AndMacroFilter
  | OrMacroFilter
  | CascadingMacroFilter;

interface AndMacroFilter extends __CompoundQueryFilter<'andMacro'> {}

interface OrMacroFilter extends __CompoundQueryFilter<'orMacro'> {}

interface __CompoundQueryFilter<FilterKind>
  extends __QueryFilter<FilterKind, Array<QueryFilter>> {}

interface CascadingMacroFilter
  extends __QueryFilter<'cascadingMacro', QueryFilter> {}

interface ModelQueryFilter
  extends __QueryFilter<'model', Record<string, PropertyFilter>> {
  filterModelSymbol: string;
}

type PropertyFilter =
  | CompoundPropertyFilter
  | DataModelPropertyFilter
  | EqualsStringPropertyFilter
  | NotStringPropertyFilter
  | EqualsNumberPropertyFilter
  | NotNumberPropertyFilter
  | GreaterThanEqualsNumberPropertyFilter
  | GreaterThanNumberPropertyFilter
  | LessThanEqualsNumberPropertyFilter
  | LessThanNumberPropertyFilter
  | InclusiveToInclusiveRangeNumberFilter
  | InclusiveToExclusiveRangeNumberFilter
  | ExclusiveToInclusiveRangeNumberFilter  
  | ExclusiveToExclusiveRangeNumberFilter
  | EqualsBooleanPropertyFilter
  | NotBooleanPropertyFilter;

type CompoundPropertyFilter = AndPropertyFilter | OrPropertyFilter;

interface AndPropertyFilter extends __CompoundPropertyFilter<'andProperty'> {}

interface OrPropertyFilter extends __CompoundPropertyFilter<'orProperty'> {}

interface __CompoundPropertyFilter<FilterKind>
  extends __PropertyFilter<FilterKind, Array<PropertyFilter>> {}

interface DataModelPropertyFilter
  extends __PropertyFilter<ModelQueryFilter, 'dataModelProperty'> {}

interface EqualsStringPropertyFilter
  extends __StringPropertyFilter<'equalsStringProperty'> {}

interface NotStringPropertyFilter extends __StringPropertyFilter<'notStringProperty'> {}

interface __StringPropertyFilter<FilterKind>
  extends __PropertyFilter<FilterKind, string> {}

interface EqualsNumberPropertyFilter
  extends __NumberPropertyFilter<'equalsNumberProperty'> {}

interface NotNumberPropertyFilter extends __NumberPropertyFilter<'notNumberProperty'> {}

interface GreaterThanEqualsNumberPropertyFilter
  extends __NumberPropertyFilter<'greaterThanEqualsNumberProperty'> {}

interface GreaterThanNumberPropertyFilter
  extends __NumberPropertyFilter<'greaterThanNumberProperty'> {}

interface LessThanEqualsNumberPropertyFilter
  extends __NumberPropertyFilter<'lessThanEqualsNumberProperty'> {}

interface LessThanNumberPropertyFilter
  extends __NumberPropertyFilter<'lessThanNumberProperty'> {}

interface __NumberPropertyFilter<FilterKind>
  extends __PropertyFilter<FilterKind, number> {}

interface InclusiveToInclusiveRangeNumberFilter
  extends __NumberRangePropertyFilter<'inclusiveToInclusiveRangeNumberProperty'> {}

interface ExclusiveToInclusiveRangeNumberFilter
  extends __NumberRangePropertyFilter<'exclusiveToInclusiveRangeNumberProperty'> {}

interface InclusiveToExclusiveRangeNumberFilter
  extends __NumberRangePropertyFilter<'inclusiveToExclusiveRangeNumberProperty'> {}

interface ExclusiveToExclusiveRangeNumberFilter
  extends __NumberRangePropertyFilter<'exclusiveToExclusiveRangeNumberProperty'> {}

interface __NumberRangePropertyFilter<FilterKind>
  extends __PropertyFilter<FilterKind, [from: number, to: number]> {}

interface EqualsBooleanPropertyFilter
  extends __BooleanPropertyFilter<'equalsBooleanProperty'> {}

interface NotBooleanPropertyFilter
  extends __BooleanPropertyFilter<'notBooleanProperty'> {}

interface __BooleanPropertyFilter<FilterKind>
  extends __PropertyFilter<FilterKind, boolean> {}

interface __PropertyFilter<FilterKind, FilterCondition>
  extends __QueryFilter<FilterKind, FilterCondition> {
  filterPropertyKey: string;
}

interface __QueryFilter<FilterKind, FilterCondition> {
  filterKind: FilterKind;
  filterCondition: FilterCondition;
}

type QuerySort =
  | GroupPropertySort
  | CascadingPropertySort
  | BasicPropertySort
  | NoopSort;

interface GroupPropertySort extends __PropertySort<'groupProperty'> {
  sortGroup: Array<{
    groupCase: string;
    groupSort: QuerySort;
  }>;
}

interface CascadingPropertySort extends __PropertySort<'cascadingProperty'> {
  sortCascadeSort: BasicPropertySort | CascadingPropertySort;
}

interface BasicPropertySort extends __PropertySort<'basicProperty'> {}

interface __PropertySort<SortKind> extends __QuerySort<SortKind> {
  sortPropertyKey: string | [string, string, ...Array<string>];
  sortOrder: 'ascending' | 'descending';
}

interface NoopSort extends __QuerySort<'noop'> {}

interface __QuerySort<SortKind> {
  sortKind: SortKind;
}

// interface QueryProjection {
//   projectionModels: Array<ModelProjection>
// }

// type ModelProjection = DataProjection | TemplateProjection

// interface DataProjection extends __ModelProjection<'data'> {}

// interface TemplateProjection extends __ModelProjection<'template'> {
//   projectionBranches: Array<ModelProjection>
// }

// interface __ModelProjection<ProjectionKind> {
//   projectionKind: ProjectionKind
//   projectionModel: string;
//   projectionProperties: Record<string, boolean>
// }

// interface QueryPagination {
//   paginationSize: number;
// }

function retrieveFilteredAndSortedRecordMetadataBytes() {}

interface QueryPage {
  pageSource: Uint8Array
  pageByteOffset: unknown
  pageSize: unknown
  pageProjection: unknown
}

function retrieveProjectedPageRecordBytes() {}

function decodePageRecords() {}