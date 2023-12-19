export function throwInvalidPathError(invalidPath: string): never {
  throw new Error(`invalid path: ${invalidPath}`);
}

export function throwError(someError: unknown): never {
  throw someError;
}
