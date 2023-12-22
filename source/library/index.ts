import * as Types from "./types.ts";

namespace Verde {
  export type Schema<T> = Types.VerdeSchema<T>;
  export type String = Types.VerdeString;
  export type Float = Types.VerdeFloat;
  export type Integer = Types.VerdeInteger;
  export type Boolean = Types.VerdeBoolean;
}

export default Verde;
export * from "./types.ts";
