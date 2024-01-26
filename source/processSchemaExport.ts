import { throwInvalidPathError, throwUserError } from './helpers/throwError.ts';
import { LoadSchemaModuleResult } from './loadSchemaModule.ts';
import { Typescript } from './imports/Typescript.ts';
import { SchemaItem, SchemaMap } from './SchemaMap.ts';

export interface ProcessSchemaExportApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportType'
  > {}

export function processSchemaExport(api: ProcessSchemaExportApi): SchemaMap {
  const { schemaTypeChecker, rhsSchemaExportType, lhsSchemaExportSymbol } = api;
  if (schemaTypeChecker.isTupleType(rhsSchemaExportType) === false) {
    throwUserError(
      `${lhsSchemaExportSymbol.name}: ${
        schemaTypeChecker.typeToString(rhsSchemaExportType)
      } is not a tuple`,
    );
  }
  const schemaMapResult: SchemaMap = {
    schemaId: lhsSchemaExportSymbol.name,
    schemaItems: {},
  };
  const topLevelItems = (isTypeReferenceType(rhsSchemaExportType) &&
    schemaTypeChecker.getTypeArguments(rhsSchemaExportType)) ||
    throwInvalidPathError('schemaItemTypes');
  topLevelItems.forEach((someTopLevelItem) => {
    if (isInterfaceType(someTopLevelItem) === false) {
      throwUserError(
        `invalid top-level item: ${
          schemaTypeChecker.typeToString(someTopLevelItem)
        }`,
      );
    }
    processInterfaceItem({
      schemaTypeChecker,
      schemaMapResult,
      someInterfaceItem: someTopLevelItem,
    });
  });
  return schemaMapResult;
}

interface ProcessInterfaceItemApi
  extends Pick<ProcessSchemaExportApi, 'schemaTypeChecker'> {
  schemaMapResult: SchemaMap;
  someInterfaceItem: Typescript.InterfaceType;
}

function processInterfaceItem(api: ProcessInterfaceItemApi) {
  const { someInterfaceItem, schemaMapResult, schemaTypeChecker } = api;
  const itemSymbolName = someInterfaceItem.symbol.name;
  if (Object.hasOwn(schemaMapResult.schemaItems, itemSymbolName)) {
    return itemSymbolName;
  }
  const newSchemaItemResult: SchemaItem = {
    itemId: itemSymbolName,
    itemProperties: {},
    itemBaseIds: [],
  };
  someInterfaceItem.typeParameters?.forEach((someInterfaceParameter) => {
    console.log(someInterfaceParameter.symbol.name);
  });
  const itemDirectProperties = (someInterfaceItem.symbol.members &&
    Array.from(someInterfaceItem.symbol.members.values()).filter(
      isPropertySymbol,
    )) ??
    [];
  itemDirectProperties.forEach((someDirectyProperty) => {
    const propertySymbolName = someDirectyProperty.name;
    const propertyType = schemaTypeChecker.getTypeOfSymbol(someDirectyProperty);
    if (
      isStringType(propertyType) ||
      isNumberType(propertyType) ||
      isBooleanType(propertyType)
    ) {
      newSchemaItemResult.itemProperties[propertySymbolName] = {
        propertyId: propertySymbolName,
        propertyType: {
          typeKind: 'primitive',
          typeId: schemaTypeChecker.typeToString(propertyType),
        },
      };
    } else if (isInterfaceType(propertyType)) {
      const propertyTypeName = processInterfaceItem({
        schemaTypeChecker,
        schemaMapResult,
        someInterfaceItem: propertyType,
      });
      newSchemaItemResult.itemProperties[propertySymbolName] = {
        propertyId: propertySymbolName,
        propertyType: {
          typeKind: 'interface',
          typeId: propertyTypeName,
        },
      };
    } else {
      throwUserError(
        `invalid property type: ${itemSymbolName}["${propertySymbolName}"]`,
      );
    }
  });
  const itemBaseItems = someInterfaceItem.getBaseTypes() ?? [];
  itemBaseItems.forEach((someBaseItem) => {
    if (isInterfaceType(someBaseItem)) {
      const baseItemName = processInterfaceItem({
        schemaTypeChecker,
        schemaMapResult,
        someInterfaceItem: someBaseItem,
      });
      newSchemaItemResult.itemBaseIds.push(baseItemName);
    } else {
      throwUserError(
        `invalid base item: ${
          schemaTypeChecker.typeToString(someBaseItem)
        } on ${newSchemaItemResult.itemId}`,
      );
    }
  });
  schemaMapResult.schemaItems[newSchemaItemResult.itemId] = newSchemaItemResult;
  return newSchemaItemResult.itemId;
}

function isStringType(someType: Typescript.Type) {
  return Boolean(someType.flags & Typescript.TypeFlags.String);
}

function isNumberType(someType: Typescript.Type) {
  return Boolean(someType.flags & Typescript.TypeFlags.Number);
}

function isBooleanType(someType: Typescript.Type) {
  return Boolean(someType.flags & Typescript.TypeFlags.Boolean);
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

function isPropertySymbol(
  someSymbol: Typescript.Symbol,
): someSymbol is Typescript.Symbol {
  return Boolean(someSymbol.flags & Typescript.SymbolFlags.Property);
}
