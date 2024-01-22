export type VerdeVerify<
  UnverifiedSchemaItems,
  VerifiedSchemaItems extends Array<any> = []
> = UnverifiedSchemaItems extends [
  infer CurrentSchemaItem,
  ...infer NextUnverifiedItems
]
  ? IsFiniteInterface<CurrentSchemaItem> extends true
    ? VerdeVerify<
        NextUnverifiedItems,
        [...VerifiedSchemaItems, CurrentSchemaItem]
      >
    : VerdeError<{
        errorType: "item not a finite interface";
        errorItem: CurrentSchemaItem;
      }>
  : VerifiedSchemaItems;

interface VerdeError<DisplayedVerdeError> {
  __type_contortion_thing__: ";p";
}

export type VerdeSchema<MaybeVerdeSchema> =
  MaybeVerdeSchema extends VerdeError<unknown>
    ? MaybeVerdeSchema
    : ProvidedVerdeSchema<MaybeVerdeSchema>;

interface ProvidedVerdeSchema<SomeVerdeSchema> {}

export type FiniteInterface<SubjectType> = FiniteInterfaceCircuit<
  never,
  SubjectType,
  SubjectType
>;

export type IsFiniteInterface<SubjectType> = FiniteInterfaceCircuit<
  false,
  true,
  SubjectType
>;

type FiniteInterfaceCircuit<FalseResult, TrueResult, SubjectType> =
  SubjectType extends Record<string, any>
    ? NotFiniteInterfaceCircuit<
        FalseResult,
        TrueResult,
        SubjectType
      > extends FalseResult
      ? TrueResult
      : FalseResult
    : TrueResult;

type NotFiniteInterfaceCircuit<FalseResult, TrueResult, SubjectType> =
  SubjectType extends Record<symbol, never>
    ? TrueResult
    : SubjectType extends
        | { [someSymbolKey: symbol]: any }
        | { [someNumberKey: number]: any }
    ? TrueResult
    : FalseResult;

export type VerdeString = string;
export type VerdeFloat = number;
export type VerdeInteger = number;
export type VerdeBoolean = boolean;
