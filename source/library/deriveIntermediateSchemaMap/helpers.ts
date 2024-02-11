import { Typescript } from '../../imports/Typescript.ts';
import { IntermediateSchemaModel, IntermediateSchemaModel_Core } from '../types/IntermediateSchemaMap.ts';

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

export function isPropertySymbol(
  someSymbol: Typescript.Symbol,
): someSymbol is Typescript.Symbol {
  return Boolean(someSymbol.flags & Typescript.SymbolFlags.Property);
}

export type ExtractModelElement<
  ThisResultModel extends IntermediateSchemaModel,
> = ThisResultModel extends
  IntermediateSchemaModel_Core<infer ThisModelKind, infer ThisModelElement>
  ? ThisModelElement
  : never;