import { Command } from "../deps/cliffy.ts";
import { Path } from "../deps/path.ts";
import { Typescript } from "../deps/typescript.ts";
import { throwInvalidPathError } from "../helpers/errors.ts";
//

export const processSchemaCommand = new Command()
  .name("setup")
  .arguments("<projectDirectoryPath>")
  .action(async (___, projectDirectoryPath) => {
    await processSchema({
      projectDirectoryPath,
    });
  });

interface ProcessSchemaApi {
  projectDirectoryPath: string;
}

async function processSchema(api: ProcessSchemaApi) {
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
      rootDir: Deno.cwd(),
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
        throwInvalidPathError("rootSchemaType");
      console.log(schemaTypeChecker.typeToString(rootSchemaType));
      const topLevelSchemaTypes =
        (isTypeReferenceType(rootSchemaType) &&
          schemaTypeChecker.getTypeArguments(rootSchemaType)) ||
        throwInvalidPathError("topLevelSchemaTypes");
      topLevelSchemaTypes.forEach((someTopLevelInterface) => {
        if (isTypeReferenceType(someTopLevelInterface)) {
          processSchemaInterface({
            schemaTypeChecker,
            someSchemaInterface: someTopLevelInterface,
          });
        } else {
          throwInvalidPathError("someTopLevelInterface");
        }
      });
    } else if (resolvedSchemaSymbol.name === "VerdeError") {
      console.error(schemaTypeChecker.typeToString(schemaExportType));
    } else {
      throwInvalidPathError("resolvedSchemaSymbol.name");
    }
  } else {
    // throw error
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

interface ProcessSchemaInterfaceApi {
  schemaTypeChecker: Typescript.TypeChecker;
  someSchemaInterface: Typescript.TypeReference;
}

function processSchemaInterface(api: ProcessSchemaInterfaceApi) {
  const { someSchemaInterface, schemaTypeChecker } = api;
  console.log(schemaTypeChecker.typeToString(someSchemaInterface));
  console.log(schemaTypeChecker.typeToString(someSchemaInterface.target));
  someSchemaInterface.target.typeParameters?.forEach(
    (someParameter, parameterIndex) => {
      console.log(
        `${schemaTypeChecker.typeToString(
          someParameter
        )} => ${schemaTypeChecker.typeToString(
          someSchemaInterface.typeArguments![parameterIndex]!
        )}`
      );
    }
  );
  const directInterfaceProperties =
    (someSchemaInterface.symbol.members &&
      Array.from(someSchemaInterface.symbol.members.values()).filter(
        isPropertySymbol
      )) ??
    [];
  directInterfaceProperties.forEach((someDirectProperty) => {
    const directPropertyName = someDirectProperty.getName();
    const resolvedPropertyValue =
      someSchemaInterface.getProperty(directPropertyName) ??
      throwInvalidPathError("resolvedPropertyValue");
    const resolvedPropertyValueType = schemaTypeChecker.getTypeOfSymbol(
      resolvedPropertyValue
    );
    console.log(
      `${directPropertyName}: ${schemaTypeChecker.typeToString(
        schemaTypeChecker.getTypeOfSymbol(
          someSchemaInterface.target.getProperty(directPropertyName)!
        )
      )} => ${schemaTypeChecker.typeToString(resolvedPropertyValueType)}`
    );
  });
  const schemaBaseInterfaces = someSchemaInterface.target.getBaseTypes();
  if (schemaBaseInterfaces) {
    schemaBaseInterfaces.forEach((someBaseInterface) => {
      if (someBaseInterface.isIntersection()) {
        console.log("intersection");
        console.log(schemaTypeChecker.typeToString(someBaseInterface));
      } else if (someBaseInterface.isClass()) {
        console.log("class");
        console.log(schemaTypeChecker.typeToString(someBaseInterface));
      } else if (isTypeReferenceType(someBaseInterface)) {
        console.log("reference");
        processSchemaInterface({
          schemaTypeChecker,
          someSchemaInterface: someBaseInterface,
        });
      }
    });
  }
}

// interface ProcessSchemaInterfaceApi {
//   schemaTypeChecker: Typescript.TypeChecker;
//   topLevelInterface: Typescript.Type;
//   someSchemaInterface: Typescript.Type;
// }

// function processSchemaInterface(api: ProcessSchemaInterfaceApi) {
//   const {
//     someSchemaInterface,
//     schemaTypeChecker,
//     topLevelInterface,
//     // interfaceDepth,
//   } = api;
//   console.log(
//     `processSchemaInterface: ${schemaTypeChecker.typeToString(
//       someSchemaInterface
//     )}`
//   );
//   console.log(`${someSchemaInterface.symbol.getName()}`);
//   if (isInterfaceType(someSchemaInterface)) {
//     // someSchemaInterface.localTypeParameters?.forEach((foo) => {
//     //   console.log(schemaTypeChecker.typeToString(foo));
//     // });
//     // if (
//     //   someSchemaInterface.symbol.declarations &&
//     //   someSchemaInterface.symbol.declarations[0] &&
//     //   Typescript.isInterfaceDeclaration(
//     //     someSchemaInterface.symbol.declarations[0]
//     //   )
//     // ) {
//     //   console.log(someSchemaInterface.symbol.declarations[0].getText());
//     //   someSchemaInterface.symbol.declarations[0].heritageClauses?.forEach(
//     //     (foo) => {
//     //       console.log(foo.getText());
//     //       foo.types.forEach((foo) => {
//     //         console.log(foo.getText());
//     //         foo.typeArguments?.forEach((foo) => {
//     //           console.log(foo.getText());
//     //           console.log(foo.kind);
//     //         });
//     //       });
//     //     }
//     //   );
//     // }
//     // someSchemaInterface.outerTypeParameters
//     // console.log("ttt");
//     const immediateProperties = Array.from(
//       someSchemaInterface.symbol.members
//         ? someSchemaInterface.symbol.members.values()
//         : throwInvalidPathError("someSchemaInterface.symbol.members")
//     ).filter((someInterfaceMember) => isPropertySymbol(someInterfaceMember));
//     immediateProperties.forEach((someImmediateProperty) => {
//       processValueTypeNode({
//         schemaTypeChecker,
//         topLevelInterface,
//         thisPropertyName: someImmediateProperty.getName(),
//         someValueTypeNode:
//           (someImmediateProperty.declarations &&
//             someImmediateProperty.declarations[0] &&
//             Typescript.isPropertySignature(
//               someImmediateProperty.declarations[0]
//             ) &&
//             someImmediateProperty.declarations[0].type) ||
//           throwInvalidPathError("immediatePropertyTypeNode"),
//       });
//     });
//     const immediateBaseInterfaces =
//       schemaTypeChecker.getBaseTypes(someSchemaInterface);
//     immediateBaseInterfaces.forEach((someImmediateBaseInterface) => {
//       const nextSchemaInterfaceDeclaration =
//         (someImmediateBaseInterface.symbol.declarations &&
//           someImmediateBaseInterface.symbol.declarations[0] &&
//           Typescript.isInterfaceDeclaration(
//             someImmediateBaseInterface.symbol.declarations[0]
//           ) &&
//           someImmediateBaseInterface.symbol.declarations[0]) ||
//         throwInvalidPathError("nextSchemaInterfaceDeclaration");
//       // const fooTypes =
//       //   (nextSchemaInterfaceDeclaration.heritageClauses &&
//       //     nextSchemaInterfaceDeclaration.heritageClauses[0] &&
//       //     nextSchemaInterfaceDeclaration.heritageClauses[0].types) ??
//       //   throwInvalidPathError("fooTypes");
//       const nextSchemaInterface = schemaTypeChecker.getTypeAtLocation(
//         nextSchemaInterfaceDeclaration
//       );
//       processSchemaInterface({
//         schemaTypeChecker,
//         topLevelInterface,
//         someSchemaInterface: nextSchemaInterface,
//         // interfaceDepth: interfaceDepth + 1,
//       });
//     });
//   } else {
//     throwInvalidPathError("processSchemaInterface");
//   }
// }

// interface ProcessValueTypeNodeApi {
//   schemaTypeChecker: Typescript.TypeChecker;
//   topLevelInterface: Typescript.Type;
//   thisPropertyName: string;
//   someValueTypeNode: Typescript.Node;
// }

// function processValueTypeNode(api: ProcessValueTypeNodeApi) {
//   const {
//     someValueTypeNode,
//     schemaTypeChecker,
//     topLevelInterface,
//     thisPropertyName,
//   } = api;
//   console.log(`processValueTypeNode: ${someValueTypeNode.getText()}`);
//   console.log(thisPropertyName);
//   if (Typescript.isLiteralTypeNode(someValueTypeNode)) {
//     console.log("literal");
//   } else if (
//     [
//       Typescript.SyntaxKind.StringKeyword,
//       Typescript.SyntaxKind.NumberKeyword,
//       Typescript.SyntaxKind.BooleanKeyword,
//     ].includes(someValueTypeNode.kind)
//   ) {
//     console.log("keyword");
//   } else if (Typescript.isTypeReferenceNode(someValueTypeNode)) {
//     console.log("reference node");
//     const propertyValueReferenceSymbol =
//       schemaTypeChecker.getSymbolAtLocation(someValueTypeNode.typeName) ??
//       throwInvalidPathError("propertyValueReferenceSymbol");
//     const propertyValueReferenceDeclaration =
//       (propertyValueReferenceSymbol.declarations &&
//         propertyValueReferenceSymbol.declarations[0]) ??
//       throwInvalidPathError("propertyValueReferenceDeclaration");
//     console.log(propertyValueReferenceSymbol.getName());
//     console.log(propertyValueReferenceDeclaration.getText());
//     if (Typescript.isTypeAliasDeclaration(propertyValueReferenceDeclaration)) {
//       console.log("type alias declaration");
//       console.log(propertyValueReferenceDeclaration.type.getText());
//       processValueTypeNode({
//         schemaTypeChecker,
//         topLevelInterface,
//         thisPropertyName,
//         someValueTypeNode: propertyValueReferenceDeclaration.type,
//       });
//     } else if (
//       Typescript.isImportSpecifier(propertyValueReferenceDeclaration)
//     ) {
//       console.log("import specifier");
//       console.log(propertyValueReferenceDeclaration.propertyName?.getText());

//       processPropertyDeclarationSymbol({
//         processValueTypeNode,
//         schemaTypeChecker,
//         topLevelInterface,
//         thisPropertyName,
//         somePropertyDeclarationSymbol:
//           schemaTypeChecker.getSymbolAtLocation(
//             propertyValueReferenceDeclaration.propertyName!
//           ) ?? throwInvalidPathError("originalImportReferenceSymbol"),
//       });
//     } else if (
//       Typescript.isTypeParameterDeclaration(propertyValueReferenceDeclaration)
//     ) {
//       console.log("");
//       console.log("");
//       const resolvedPropertyType = schemaTypeChecker.getTypeOfSymbol(
//         topLevelInterface.getProperty(thisPropertyName) ??
//           throwInvalidPathError("resolvedPropertySymbol")
//       );

//       console.log("type parameter declaration");
//       console.log(schemaTypeChecker.typeToString(resolvedPropertyType));

//       if (resolvedPropertyType.isLiteral()) {
//         console.log("parameter => literal");
//       } else if (
//         resolvedPropertyType.flags &
//         (Typescript.TypeFlags.Boolean |
//           Typescript.TypeFlags.Number |
//           Typescript.TypeFlags.String)
//       ) {
//         console.log("parameter => keyword");
//       } else if (resolvedPropertyType.symbol) {
//         console.log("parameter => symbol");

//         processPropertyDeclarationSymbol({
//           processValueTypeNode,
//           schemaTypeChecker,
//           topLevelInterface,
//           thisPropertyName,
//           somePropertyDeclarationSymbol: resolvedPropertyType.symbol,
//         });
//       }
//     } else {
//       throwInvalidPathError("narrowing: immediatePropertyDeclaration");
//     }
//   } else {
//     throwInvalidPathError("someValueTypeNode");
//   }
// }

// interface ProcessPropertyDeclarationSymbolApi
//   extends Pick<
//     ProcessValueTypeNodeApi,
//     "schemaTypeChecker" | "topLevelInterface" | "thisPropertyName"
//   > {
//   processValueTypeNode: typeof processValueTypeNode;
//   somePropertyDeclarationSymbol: Typescript.Symbol;
// }

// function processPropertyDeclarationSymbol(
//   api: ProcessPropertyDeclarationSymbolApi
// ) {
//   const {
//     somePropertyDeclarationSymbol,
//     schemaTypeChecker,
//     topLevelInterface,
//     thisPropertyName,
//   } = api;

//   console.log(
//     `processPropertyDeclarationSymbol: ${somePropertyDeclarationSymbol.getName()}`
//   );

//   const propertyDeclaration =
//     (somePropertyDeclarationSymbol.declarations &&
//       somePropertyDeclarationSymbol.declarations[0]) ||
//     throwInvalidPathError("propertyDeclaration");
//   if (Typescript.isTypeAliasDeclaration(propertyDeclaration)) {
//     processValueTypeNode({
//       schemaTypeChecker,
//       topLevelInterface,
//       thisPropertyName,
//       someValueTypeNode: propertyDeclaration.type,
//     });
//   } else if (Typescript.isInterfaceDeclaration(propertyDeclaration)) {
//   } else {
//     throwInvalidPathError("processPropertyDeclarationSymbol");
//   }
// }

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
