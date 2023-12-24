import { Command, Input, Type } from "../deps/cliffy.ts";
import { Path } from "../deps/path.ts";
import { Sqlite } from "../deps/sqlite.ts";
import { Typescript } from "../deps/typescript.ts";
import { throwError, throwInvalidPathError } from "../helpers/errors.ts";
//

export const setupProjectCommand = new Command()
  .name("setup")
  .arguments("<projectDirectoryPath>")
  .action(async (___, projectDirectoryPath) => {
    await setupProject({
      projectDirectoryPath,
    });
  });

interface SetupProjectApi {
  projectDirectoryPath: string;
}

async function setupProject(api: SetupProjectApi) {
  const { projectDirectoryPath } = api;
  const resolvedProjectDirectoryPath = Path.isAbsolute(projectDirectoryPath)
    ? projectDirectoryPath
    : Path.join(Deno.cwd(), projectDirectoryPath);
  const projectDirectoryStats = await Deno.stat(resolvedProjectDirectoryPath);
  if (projectDirectoryStats.isDirectory) {
    const schemaPath = Path.join(
      resolvedProjectDirectoryPath,
      "./schema.verde.ts"
    );
    const schemaProgram = Typescript.createProgram([schemaPath], {
      target: Typescript.ScriptTarget.Latest,
    });
    const schemaTypeChecker = schemaProgram.getTypeChecker();
    const schemaFile =
      schemaProgram.getSourceFile(schemaPath) ??
      throwInvalidPathError("schemaFile");
    const schemaExports = schemaTypeChecker.getExportsOfModule(
      schemaTypeChecker.getSymbolAtLocation(schemaFile) ??
        throwInvalidPathError("schemaExports")
    );
    const schemaExportSymbol =
      (schemaExports.length === 1 && schemaExports[0]) ||
      throwInvalidPathError("schemaExportSymbol");
    const schemaExportNode =
      (schemaExportSymbol.declarations && schemaExportSymbol.declarations[0]) ??
      throwInvalidPathError("schemaExportNode");
    const schemaExportType =
      schemaTypeChecker.getTypeAtLocation(schemaExportNode);
    const resolvedSchemaSymbol = schemaExportType.symbol;
    if (resolvedSchemaSymbol.name === "ProvidedVerdeSchema") {
      const rootSchemaType =
        (isTypeReferenceType(schemaExportType) &&
          schemaTypeChecker.getTypeArguments(schemaExportType)[0]) ||
        throwInvalidPathError("rawSchemaType");
      console.log(schemaTypeChecker.typeToString(rootSchemaType));
      const topLevelSchemaTypes =
        (isTypeReferenceType(rootSchemaType) &&
          schemaTypeChecker.getTypeArguments(rootSchemaType)) ||
        throwInvalidPathError("rawSchemaItems");
      topLevelSchemaTypes.forEach((someTopLevelInterface) => {
        processSchemaInterface({
          schemaTypeChecker,
          topLevelInterface: someTopLevelInterface,
          someSchemaInterface: someTopLevelInterface,
          interfaceDepth: 0,
        });
        console.log("");
      });
    } else if (resolvedSchemaSymbol.name === "VerdeError") {
      console.error(schemaTypeChecker.typeToString(schemaExportType));
    } else {
      throwInvalidPathError("resolvedSchemaSymbol.name");
    }
  } else {
    // throw error
    // or
    // if (projectDirectoryStats.isDirectory === false) {
    //   await Deno.mkdir(resolvedProjectDirectoryPath);
    // }
  }
}

interface ProcessSchemaInterfaceApi {
  schemaTypeChecker: Typescript.TypeChecker;
  topLevelInterface: Typescript.Type;
  someSchemaInterface: Typescript.Type;
  interfaceDepth: number;
}

function processSchemaInterface(api: ProcessSchemaInterfaceApi) {
  const {
    someSchemaInterface,
    schemaTypeChecker,
    topLevelInterface,
    interfaceDepth,
  } = api;
  const depthSpacer = new Array(interfaceDepth).fill("  ").join("");
  if (isInterfaceType(someSchemaInterface)) {
    const directProperties = Array.from(
      someSchemaInterface.symbol.members
        ? someSchemaInterface.symbol.members.values()
        : throwInvalidPathError("someSchemaInterface.symbol.members")
    ).filter((someInterfaceMember) => isPropertySymbol(someInterfaceMember));
    const directBaseInterfaces =
      schemaTypeChecker.getBaseTypes(someSchemaInterface);
    console.log(`${depthSpacer}${someSchemaInterface.symbol.getName()}`);
    directProperties.forEach((someDirectProperty) => {
      const directPropertyName = someDirectProperty.getName();
      const resolvedPropertyType = schemaTypeChecker.getTypeOfSymbol(
        topLevelInterface.getProperty(directPropertyName) ??
          throwInvalidPathError("resolvedPropertyType")
      );
      console.log(
        `${depthSpacer}  ${directPropertyName}: ${schemaTypeChecker.typeToString(
          resolvedPropertyType
        )}`
      );
    });
    directBaseInterfaces.forEach((someBaseInterface) => {
      const nextSchemaInterface =
        (someBaseInterface.symbol.declarations &&
          someBaseInterface.symbol.declarations[0] &&
          schemaTypeChecker.getTypeAtLocation(
            someBaseInterface.symbol.declarations[0]
          )) ||
        throwInvalidPathError("nextSchemaInterface");
      processSchemaInterface({
        schemaTypeChecker,
        topLevelInterface,
        someSchemaInterface: nextSchemaInterface,
        interfaceDepth: interfaceDepth + 1,
      });
    });
  } else {
    throwInvalidPathError("processSchemaItem");
  }
}

function isTypeReferenceType(
  someType: Typescript.Type
): someType is Typescript.TypeReference {
  return (
    isObjectFlagsType(someType) &&
    Boolean(someType.objectFlags & Typescript.ObjectFlags.Reference)
  );
}

function isInterfaceType(
  someType: Typescript.Type
): someType is Typescript.InterfaceType {
  return (
    isObjectFlagsType(someType) &&
    Boolean(someType.objectFlags & Typescript.ObjectFlags.Interface)
  );
}

function isPropertySymbol(
  someSymbol: Typescript.Symbol
): someSymbol is Typescript.Symbol {
  return Boolean(someSymbol.flags & Typescript.SymbolFlags.Property);
}

function isObjectFlagsType(
  someType: Typescript.Type
): someType is Typescript.TypeReference {
  return Boolean(
    someType.flags &
      (Typescript.TypeFlags.Any |
        Typescript.TypeFlags.Undefined |
        Typescript.TypeFlags.Null |
        Typescript.TypeFlags.Never |
        Typescript.TypeFlags.Object |
        Typescript.TypeFlags.Union |
        Typescript.TypeFlags.Intersection)
  );
}

// interface TableSchema {
//   tableName: string;
//   tableColumns: Array<ColumnSchema>;
// }

// type ColumnSchema = StringColumnSchema;

// interface StringColumnSchema extends ColumnSchemaBase<"TEXT"> {}

// interface ColumnSchemaBase<ColumnType> {
//   columnName: string;
//   columnType: ColumnType;
// }

// interface GetCreateTableQueryApi {
//   someTableSchema: TableSchema;
// }

// function getCreateTableQuery(api: GetCreateTableQueryApi) {
//   const { someTableSchema } = api;
//   return `
// CREATE TABLE IF NOT EXISTS ${someTableSchema.tableName} (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   ${someTableSchema.tableColumns
//     .map(
//       (someColumnSchema) =>
//         `${someColumnSchema.columnName} ${someColumnSchema.columnType} NOT NULL`
//     )
//     .join(",\n")}
// );
// `.trim();
// }

// interface GetCreateRecordQueryApi {
//   someTableSchema: TableSchema;
// }

// function getCreateRandomRecordQuery(api: GetCreateRecordQueryApi) {
//   const { someTableSchema } = api;
//   return `
// INSERT INTO ${someTableSchema.tableName} (${someTableSchema.tableColumns
//     .map((someColumnSchema) => someColumnSchema.columnName)
//     .join(", ")}) VALUES (${someTableSchema.tableColumns
//     .map((someColumnSchema) =>
//       someColumnSchema.columnType === "TEXT"
//         ? "'random text value'"
//         : throwInvalidPathError("getCreateRandomRecordQuery")
//     )
//     .join(", ")});
// `.trim();
// }
