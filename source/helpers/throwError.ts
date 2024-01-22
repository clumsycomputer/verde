export function throwUserError(errorMessage: string): never {
  throw new Error(errorMessage)
}

export function throwInvalidPathError(pathIdentifier: string): never {
  throw new Error(`invalid path: ${pathIdentifier}`)
}