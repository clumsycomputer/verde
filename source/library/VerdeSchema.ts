export type VerdeSchema<MaybeVerdeSchema> = MaybeVerdeSchema extends
  VerdeError<unknown> ? MaybeVerdeSchema
  : ProvidedVerdeSchema<MaybeVerdeSchema>;

interface VerdeError<DisplayedVerdeError> {
  __empty_interface_workaround__: "needed to assert 'extends VerdeError'";
}

interface ProvidedVerdeSchema<SomeVerdeSchema> {}

export type VerdeVerify<
  UnverifiedSchemaItems extends Array<any>,
  VerifiedSchemaItems extends Array<any> = [],
> = UnverifiedSchemaItems extends [
  infer CurrentSchemaItem,
  ...infer NextUnverifiedItems,
] ? IsFiniteInterface<CurrentSchemaItem> extends true ? VerdeVerify<
      NextUnverifiedItems,
      [...VerifiedSchemaItems, CurrentSchemaItem]
    >
  : VerdeError<{
    errorType: 'item not a finite interface';
    errorItem: CurrentSchemaItem;
  }>
  : VerifiedSchemaItems;

type FiniteInterface<SubjectType> = FiniteInterfaceCircuit<
  never,
  SubjectType,
  SubjectType
>;

type IsFiniteInterface<SubjectType> = FiniteInterfaceCircuit<
  false,
  true,
  SubjectType
>;

type FiniteInterfaceCircuit<FalseResult, TrueResult, SubjectType> =
  SubjectType extends Record<string, any> ? NotFiniteInterfaceCircuit<
      FalseResult,
      TrueResult,
      SubjectType
    > extends FalseResult ? TrueResult
    : FalseResult
    : TrueResult;

type NotFiniteInterfaceCircuit<FalseResult, TrueResult, SubjectType> =
  SubjectType extends Record<symbol, never> ? TrueResult
    : SubjectType extends
      | { [someSymbolKey: symbol]: any }
      | { [someNumberKey: number]: any } ? TrueResult
    : FalseResult;
