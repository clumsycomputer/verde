export function throwInvalidPathError(invalidPath: string): never {
  throw new Error(`invalid path: ${invalidPath}`);
}

export function throwError(errorMessage: string): never {
  throw new Error(errorMessage);
}
