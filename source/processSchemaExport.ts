import { throwInvalidPathError, throwUserError } from './helpers/throwError.ts';
import { LoadSchemaModuleResult } from './loadSchemaModule.ts';
import { Typescript } from './imports/Typescript.ts';

export interface ProcessSchemaExportApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportType'
  > {}

export function processSchemaExport(api: ProcessSchemaExportApi) {
  const { schemaTypeChecker, rhsSchemaExportType, lhsSchemaExportSymbol } = api;
  if (schemaTypeChecker.isTupleType(rhsSchemaExportType) === false) {
    throwUserError(
      `${lhsSchemaExportSymbol.name}: ${
        schemaTypeChecker.typeToString(rhsSchemaExportType)
      } is not a tuple`,
    );
  }
  const schemaItemTypes = (isTypeReferenceType(rhsSchemaExportType) &&
    schemaTypeChecker.getTypeArguments(rhsSchemaExportType)) ||
    throwInvalidPathError('topLevelSchemaTypes');
    schemaItemTypes.forEach((someSchemaItemType) => {
    if (isInterfaceType(someSchemaItemType) === false) {
      throwUserError(
        `invalid schema item: ${
          schemaTypeChecker.typeToString(someSchemaItemType)
        }`,
      );
    }
    processSchemaItem({
      someSchemaItemType,
    });
  });
}

interface ProcessSchemaItemApi {
  someSchemaItemType: Typescript.InterfaceType;
}

function processSchemaItem(api: ProcessSchemaItemApi) {
  const { someSchemaItemType } = api;
  console.log(someSchemaItemType.symbol.name);
}

function isInterfaceType(
  someType: Typescript.Type,
): someType is Typescript.InterfaceType {
  return (
    isObjectFlagsType(someType) &&
    Boolean(someType.objectFlags & Typescript.ObjectFlags.Interface)
  );
}

function isTypeReferenceType(
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
