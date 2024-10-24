import { Typescript } from '../../../../imports/Typescript.ts';

export function isInterfaceType(
  someType: Typescript.Type,
): someType is Typescript.InterfaceType {
  return (
    isObjectFlagsType(someType) &&
    Boolean(someType.objectFlags & Typescript.ObjectFlags.Interface)
  );
}

export function isTypeReference(
  someType: Typescript.Type,
): someType is Typescript.TypeReference {
  return (
    isObjectFlagsType(someType) &&
    Boolean(someType.objectFlags & Typescript.ObjectFlags.Reference)
  );
}

function isObjectFlagsType(
  someType: Typescript.Type,
): someType is Typescript.TypeReference {
  return Boolean(
    someType.flags &
      (Typescript.TypeFlags.Any |
        Typescript.TypeFlags.Undefined |
        Typescript.TypeFlags.Null |
        Typescript.TypeFlags.Never |
        Typescript.TypeFlags.Object |
        Typescript.TypeFlags.Union |
        Typescript.TypeFlags.Intersection),
  );
}

export function isStringLiteralType(
  someType: Typescript.Type,
): someType is Typescript.StringLiteralType {
  return Boolean(someType.flags & Typescript.TypeFlags.StringLiteral);
}

export function isNumberLiteralType(
  someType: Typescript.Type,
): someType is Typescript.NumberLiteralType {
  return Boolean(someType.flags & Typescript.TypeFlags.NumberLiteral);
}

export function isBooleanLiteralType(
  someType: Typescript.Type,
): someType is Typescript.Type {
  return Boolean(someType.flags & Typescript.TypeFlags.BooleanLiteral);
}

export function isStringType(
  someType: Typescript.Type,
): someType is Typescript.Type {
  return Boolean(someType.flags & Typescript.TypeFlags.String);
}

export function isNumberType(
  someType: Typescript.Type,
): someType is Typescript.Type {
  return Boolean(someType.flags & Typescript.TypeFlags.Number);
}

export function isBooleanType(
  someType: Typescript.Type,
): someType is Typescript.Type {
  return Boolean(someType.flags & Typescript.TypeFlags.Boolean);
}

export function isContrainedParameterType(
  someType: Typescript.Type,
): someType is Typescript.TypeParameter {
  return isParameterType(someType) && Boolean(someType.getConstraint());
}

export function isParameterType(
  someType: Typescript.Type,
): someType is Typescript.TypeParameter {
  return Boolean(someType.flags & Typescript.TypeFlags.TypeParameter);
}

export function isPropertySymbol(
  someSymbol: Typescript.Symbol,
): someSymbol is Typescript.Symbol {
  return Boolean(someSymbol.flags & Typescript.SymbolFlags.Property);
}
