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
      const rawSchemaType =
        (isTypeReference(schemaExportType) &&
          schemaTypeChecker.getTypeArguments(schemaExportType)[0]) ||
        throwInvalidPathError("rawSchemaType");
      console.log(schemaTypeChecker.typeToString(rawSchemaType));
      const rawSchemaItems =
        (isTypeReference(rawSchemaType) &&
          schemaTypeChecker.getTypeArguments(rawSchemaType)) ||
        throwInvalidPathError("rawSchemaItems");
      rawSchemaItems.forEach((someSchemaItemType) => {
        console.log(schemaTypeChecker.typeToString(someSchemaItemType));
        if (isInterface(someSchemaItemType)) {
          schemaTypeChecker.getBaseTypes(someSchemaItemType).forEach((foo) => {
            console.log(schemaTypeChecker.typeToString(foo));
          });
        }
        console.log("");
        // schemaTypeChecker.getBaseTypes();
        // const foo = someSchemaItemType.symbol.declarations[0]
        // console.log(schemaTypeChecker.typeToString(someSchemaItemType));
        // console.log(someSchemaItemType.symbol.declarations![0]?.getText());
        // someSchemaItemType.symbol.members?.forEach((someItemMember) => {
        //   console.log(someItemMember.getName());
        // });
      });
    } else if (resolvedSchemaSymbol.name === "VerdeError") {
      console.error(schemaTypeChecker.typeToString(schemaExportType));
    } else {
      throwInvalidPathError("resolvedSchemaSymbol.name");
    }
    // schemaExportNode.getChildren().forEach((foo) => {
    //   console.log(foo.getText());
    // });
    // schemaTypeChecker.getTypeArguments(schemaExportType).forEach((foo) => {});

    // console.log(schemaTypeChecker.getSymbolAtLocation(schemaFile)?.getName());
    // const { exportedTypeAliasNode } = tryGetExportedTypeAliasNode({
    //   schemaModuleFile,
    // });
    // const exportedTypeAliasType = schemaContext.getTypeAtLocation(
    //   exportedTypeAliasNode
    // );
    // console.log(schemaContext.typeToString(exportedTypeAliasType));
    // console.log(exportedTypeAliasType.symbol.name);
    // console.log("");
    // const { exportedSchemaMembers } =
    //   exportedTypeAliasType.symbol.name === "ProvidedVerdeSchema"
    //     ? tryGetExportedSchemaMembers({
    //         exportedTypeAliasNode,
    //       })
    //     : throwError("todo: better error message");
    // exportedSchemaMembers.forEach((someMemberReferenceNode) => {
    //   const memberReferenceType = schemaTypeChecker.getTypeAtLocation(
    //     someMemberReferenceNode
    //   );
    //   const memberReferenceSymbol = memberReferenceType.symbol;
    //   const memberDeclarationNode =
    //     (memberReferenceSymbol.declarations &&
    //       memberReferenceSymbol.declarations[0] &&
    //       memberReferenceSymbol.declarations.length === 1 &&
    //       Typescript.isInterfaceDeclaration(
    //         memberReferenceSymbol.declarations[0]
    //       ) &&
    //       memberReferenceSymbol.declarations[0]) ||
    //     throwInvalidPathError("memberDeclarationNode");
    //   const memberDeclarationType = schemaTypeChecker.getTypeAtLocation(
    //     memberDeclarationNode
    //   );
    //   console.log(memberDeclarationNode.getText());
    //   console.log(
    //     `interface ${schemaTypeChecker.typeToString(memberDeclarationType)}`
    //   );
    //   memberDeclarationNode.members.forEach((somePropertyNode) => {
    //     if (Typescript.isPropertySignature(somePropertyNode)) {
    //       const propertySignatureChildren = somePropertyNode.getChildren();
    //       const propertyIdentifierNode =
    //         (propertySignatureChildren[0] &&
    //           Typescript.isIdentifier(propertySignatureChildren[0]) &&
    //           propertySignatureChildren[0]) ||
    //         throwInvalidPathError("propertyIdentifierNode");
    //       const propertyTypeReference =
    //         (propertySignatureChildren[2] &&
    //           Typescript.isTypeReferenceNode(propertySignatureChildren[2]) &&
    //           propertySignatureChildren[2]) ||
    //         throwInvalidPathError("propertyTypeReference");
    //       console.log(
    //         `  ${propertyIdentifierNode.getText()}: ${propertyTypeReference.getText()}`
    //       );
    //     }
    //   });
    //   const memberHeritageExpressions =
    //     (memberDeclarationNode.heritageClauses &&
    //       memberDeclarationNode.heritageClauses[0] &&
    //       memberDeclarationNode.heritageClauses[0].types) ||
    //     [];
    //   memberHeritageExpressions.forEach((someHeritageExpressionNode) => {
    //     const heritageExpressionType = schemaTypeChecker.getTypeAtLocation(
    //       someHeritageExpressionNode
    //     );
    //     const heritageExpressionSymbol = heritageExpressionType.symbol;
    //     console.log(`  ${heritageExpressionSymbol.getName()}`);
    //     const heritageDeclarationNode =
    //       (heritageExpressionSymbol.declarations &&
    //         heritageExpressionSymbol.declarations[0] &&
    //         heritageExpressionSymbol.declarations.length === 1 &&
    //         Typescript.isInterfaceDeclaration(
    //           heritageExpressionSymbol.declarations[0]
    //         ) &&
    //         heritageExpressionSymbol.declarations[0]) ||
    //       throwInvalidPathError("heritageExpressionSymbol");
    //     heritageDeclarationNode.members.forEach((somePropertyNode) => {
    //       if (Typescript.isPropertySignature(somePropertyNode)) {
    //         const propertySignatureChildren = somePropertyNode.getChildren();
    //         const propertyIdentifierNode =
    //           (propertySignatureChildren[0] &&
    //             Typescript.isIdentifier(propertySignatureChildren[0]) &&
    //             propertySignatureChildren[0]) ||
    //           throwInvalidPathError("propertyIdentifierNode");
    //         const propertyTypeReference =
    //           (propertySignatureChildren[2] &&
    //             Typescript.isTypeReferenceNode(propertySignatureChildren[2]) &&
    //             propertySignatureChildren[2]) ||
    //           throwInvalidPathError("propertyTypeReference");
    //         const resolvedPropertyType =
    //           heritageExpressionType.getProperty(
    //             propertyIdentifierNode.getText()
    //           ) ?? throwInvalidPathError("resolvedPropertyType");
    //         console.log(
    //           `    ${propertyIdentifierNode.getText()}: ${schemaTypeChecker.typeToString(
    //             schemaTypeChecker.getTypeOfSymbol(resolvedPropertyType)
    //           )}`
    //         );
    //       }
    //     });
    //   });
    //   console.log("");
    // });
  } else {
    // throw error
    // or
    // if (projectDirectoryStats.isDirectory === false) {
    //   await Deno.mkdir(resolvedProjectDirectoryPath);
    // }
  }
}

function isTypeReference(
  someType: Typescript.Type
): someType is Typescript.TypeReference {
  return (
    isObjectFlagsType(someType) &&
    Boolean(someType.objectFlags & Typescript.ObjectFlags.Reference)
  );
}

function isInterface(
  someType: Typescript.Type
): someType is Typescript.InterfaceType {
  return (
    isObjectFlagsType(someType) &&
    Boolean(someType.objectFlags & Typescript.ObjectFlags.Interface)
  );
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

// interface TypeReference extends ObjectType {
//   target: GenericType;
//   node?: TypeReferenceNode | ArrayTypeNode | TupleTypeNode;
// }
// interface TypeReference {
//   typeArguments?: readonly Type[];
// }

// interface TryGetExportedTypeAliasNodeApi {
//   schemaModuleFile: Typescript.SourceFile;
// }

// function tryGetExportedTypeAliasNode(api: TryGetExportedTypeAliasNodeApi) {
//   const { schemaModuleFile } = api;
//   const exportedTypeAliasDeclarationsResult: Array<Typescript.TypeAliasDeclaration> =
//     [];
//   schemaModuleFile.forEachChild((someTopLevelNode) => {
//     if (
//       Typescript.isTypeAliasDeclaration(someTopLevelNode) &&
//       Typescript.getCombinedModifierFlags(someTopLevelNode) &
//         Typescript.ModifierFlags.Export
//     ) {
//       exportedTypeAliasDeclarationsResult.push(someTopLevelNode);
//     }
//   });
//   return {
//     exportedTypeAliasNode:
//       exportedTypeAliasDeclarationsResult[0] &&
//       exportedTypeAliasDeclarationsResult.length === 1
//         ? exportedTypeAliasDeclarationsResult[0]
//         : throwError("exportedTypeAliasNode"),
//   };
// }

// interface TryGetExportedSchemaMembersApi {
//   exportedTypeAliasNode: Typescript.TypeAliasDeclaration;
// }

// function tryGetExportedSchemaMembers(api: TryGetExportedSchemaMembersApi) {
//   const { exportedTypeAliasNode } = api;
//   const exportedVerdeSchemaChildren = exportedTypeAliasNode.getChildren();
//   const exportedSchemaReferenceNode =
//     (exportedVerdeSchemaChildren[4] &&
//       Typescript.isTypeReferenceNode(exportedVerdeSchemaChildren[4]) &&
//       exportedVerdeSchemaChildren[4]) ||
//     throwInvalidPathError("exportedSchemaReferenceNode");
//   const exportedSchemaMembersResult: Array<Typescript.TypeReferenceNode> = [];
//   exportedSchemaReferenceNode.forEachChild((someReferenceChildNode) => {
//     if (Typescript.isTupleTypeNode(someReferenceChildNode)) {
//       someReferenceChildNode.elements.forEach(
//         (someTopLevelSchemaMemberNode) => {
//           if (Typescript.isNamedTupleMember(someTopLevelSchemaMemberNode)) {
//             const namedSchemaMemberChildren =
//               someTopLevelSchemaMemberNode.getChildren();
//             const namedSchemaMemberReferenceNode =
//               (namedSchemaMemberChildren[2] &&
//                 Typescript.isTypeReferenceNode(namedSchemaMemberChildren[2]) &&
//                 namedSchemaMemberChildren[2]) ||
//               throwInvalidPathError("namedSchemaMemberReferenceNode");
//             exportedSchemaMembersResult.push(namedSchemaMemberReferenceNode);
//           } else if (
//             Typescript.isTypeReferenceNode(someTopLevelSchemaMemberNode)
//           ) {
//             exportedSchemaMembersResult.push(someTopLevelSchemaMemberNode);
//           }
//         }
//       );
//     }
//   });
//   return {
//     exportedSchemaMembers: exportedSchemaMembersResult,
//   };
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
