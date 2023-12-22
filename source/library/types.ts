export type VerdeSchema<SomeVerdeSchema> =
  SomeVerdeSchema extends __VERDE_SCHEMA<SomeVerdeSchema>
    ? __VERDE_SCHEMA<SomeVerdeSchema>
    : never;

interface __VERDE_SCHEMA<SomeVerdeSchema> {}

export type VerdeString = string;
export type VerdeFloat = number;
export type VerdeInteger = number;
export type VerdeBoolean = boolean;
