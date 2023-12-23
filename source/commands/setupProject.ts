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
    const schemaModulePath = Path.join(
      resolvedProjectDirectoryPath,
      "./schema.verde.ts"
    );
    const schemaProgram = Typescript.createProgram([schemaModulePath], {
      target: Typescript.ScriptTarget.Latest,
    });
    const schemaTypeChecker = schemaProgram.getTypeChecker();
    const schemaModuleFile =
      schemaProgram.getSourceFile(schemaModulePath) ??
      throwInvalidPathError("schemaModuleFile");
    const { exportedTypeAliasNode } = tryGetExportedTypeAliasNode({
      schemaModuleFile,
    });
    const exportedTypeAliasType = schemaTypeChecker.getTypeAtLocation(
      exportedTypeAliasNode
    );
    console.log(schemaTypeChecker.typeToString(exportedTypeAliasType));
    console.log(exportedTypeAliasType.symbol.name);
    console.log("");
    const { exportedSchemaMembers } =
      exportedTypeAliasType.symbol.name === "__VERDE_SCHEMA"
        ? tryGetExportedSchemaMembers({
            exportedTypeAliasNode,
          })
        : throwError("exported schema not properly validated");
    exportedSchemaMembers.forEach((someMemberReferenceNode) => {
      const memberReferenceType = schemaTypeChecker.getTypeAtLocation(
        someMemberReferenceNode
      );
      const memberReferenceSymbol = memberReferenceType.symbol;
      const memberDeclarationNode =
        (memberReferenceSymbol.declarations &&
          memberReferenceSymbol.declarations[0] &&
          memberReferenceSymbol.declarations.length === 1 &&
          Typescript.isInterfaceDeclaration(
            memberReferenceSymbol.declarations[0]
          ) &&
          memberReferenceSymbol.declarations[0]) ||
        throwInvalidPathError("memberDeclarationNode");
      const memberDeclarationType = schemaTypeChecker.getTypeAtLocation(
        memberDeclarationNode
      );
      console.log(memberDeclarationNode.getText());
      console.log(
        `interface ${schemaTypeChecker.typeToString(memberDeclarationType)}`
      );
      memberDeclarationNode.members.forEach((somePropertyNode) => {
        if (Typescript.isPropertySignature(somePropertyNode)) {
          const propertySignatureChildren = somePropertyNode.getChildren();
          const propertyIdentifierNode =
            (propertySignatureChildren[0] &&
              Typescript.isIdentifier(propertySignatureChildren[0]) &&
              propertySignatureChildren[0]) ||
            throwInvalidPathError("propertyIdentifierNode");
          const propertyTypeReference =
            (propertySignatureChildren[2] &&
              Typescript.isTypeReferenceNode(propertySignatureChildren[2]) &&
              propertySignatureChildren[2]) ||
            throwInvalidPathError("propertyTypeReference");
          console.log(
            `  ${propertyIdentifierNode.getText()}: ${propertyTypeReference.getText()}`
          );
        }
      });
      const memberHeritageExpressions =
        (memberDeclarationNode.heritageClauses &&
          memberDeclarationNode.heritageClauses[0] &&
          memberDeclarationNode.heritageClauses[0].types) ||
        [];
      memberHeritageExpressions.forEach((someHeritageExpressionNode) => {
        const heritageExpressionType = schemaTypeChecker.getTypeAtLocation(
          someHeritageExpressionNode
        );
        const heritageExpressionSymbol = heritageExpressionType.symbol;
        console.log(`  ${heritageExpressionSymbol.getName()}`);
        const heritageDeclarationNode =
          (heritageExpressionSymbol.declarations &&
            heritageExpressionSymbol.declarations[0] &&
            heritageExpressionSymbol.declarations.length === 1 &&
            Typescript.isInterfaceDeclaration(
              heritageExpressionSymbol.declarations[0]
            ) &&
            heritageExpressionSymbol.declarations[0]) ||
          throwInvalidPathError("heritageExpressionSymbol");
        heritageDeclarationNode.members.forEach((somePropertyNode) => {
          if (Typescript.isPropertySignature(somePropertyNode)) {
            const propertySignatureChildren = somePropertyNode.getChildren();
            const propertyIdentifierNode =
              (propertySignatureChildren[0] &&
                Typescript.isIdentifier(propertySignatureChildren[0]) &&
                propertySignatureChildren[0]) ||
              throwInvalidPathError("propertyIdentifierNode");
            const propertyTypeReference =
              (propertySignatureChildren[2] &&
                Typescript.isTypeReferenceNode(propertySignatureChildren[2]) &&
                propertySignatureChildren[2]) ||
              throwInvalidPathError("propertyTypeReference");
            const resolvedPropertyType =
              heritageExpressionType.getProperty(
                propertyIdentifierNode.getText()
              ) ?? throwInvalidPathError("resolvedPropertyType");
            console.log(
              `    ${propertyIdentifierNode.getText()}: ${schemaTypeChecker.typeToString(
                schemaTypeChecker.getTypeOfSymbol(resolvedPropertyType)
              )}`
            );
          }
        });
      });
      console.log("");
    });
  } else {
    // throw error
    // or
    // if (projectDirectoryStats.isDirectory === false) {
    //   await Deno.mkdir(resolvedProjectDirectoryPath);
    // }
  }
}

interface TryGetExportedTypeAliasNodeApi {
  schemaModuleFile: Typescript.SourceFile;
}
function tryGetExportedTypeAliasNode(api: TryGetExportedTypeAliasNodeApi) {
  const { schemaModuleFile } = api;
  const exportedTypeAliasDeclarationsResult: Array<Typescript.TypeAliasDeclaration> =
    [];
  schemaModuleFile.forEachChild((someTopLevelNode) => {
    if (
      Typescript.isTypeAliasDeclaration(someTopLevelNode) &&
      Typescript.getCombinedModifierFlags(someTopLevelNode) &
        Typescript.ModifierFlags.Export
    ) {
      exportedTypeAliasDeclarationsResult.push(someTopLevelNode);
    }
  });
  return {
    exportedTypeAliasNode:
      exportedTypeAliasDeclarationsResult[0] &&
      exportedTypeAliasDeclarationsResult.length === 1
        ? exportedTypeAliasDeclarationsResult[0]
        : throwError("exportedTypeAliasNode"),
  };
}

interface TryGetExportedSchemaMembersApi {
  exportedTypeAliasNode: Typescript.TypeAliasDeclaration;
}

function tryGetExportedSchemaMembers(api: TryGetExportedSchemaMembersApi) {
  const { exportedTypeAliasNode } = api;
  const exportedVerdeSchemaChildren = exportedTypeAliasNode.getChildren();
  const exportedSchemaReferenceNode =
    (exportedVerdeSchemaChildren[4] &&
      Typescript.isTypeReferenceNode(exportedVerdeSchemaChildren[4]) &&
      exportedVerdeSchemaChildren[4]) ||
    throwInvalidPathError("exportedSchemaReferenceNode");
  const exportedSchemaMembersResult: Array<Typescript.TypeReferenceNode> = [];
  exportedSchemaReferenceNode.forEachChild((someReferenceChildNode) => {
    if (Typescript.isTupleTypeNode(someReferenceChildNode)) {
      someReferenceChildNode.elements.forEach(
        (someTopLevelSchemaMemberNode) => {
          if (Typescript.isNamedTupleMember(someTopLevelSchemaMemberNode)) {
            const namedSchemaMemberChildren =
              someTopLevelSchemaMemberNode.getChildren();
            const namedSchemaMemberReferenceNode =
              (namedSchemaMemberChildren[2] &&
                Typescript.isTypeReferenceNode(namedSchemaMemberChildren[2]) &&
                namedSchemaMemberChildren[2]) ||
              throwInvalidPathError("namedSchemaMemberReferenceNode");
            exportedSchemaMembersResult.push(namedSchemaMemberReferenceNode);
          } else if (
            Typescript.isTypeReferenceNode(someTopLevelSchemaMemberNode)
          ) {
            exportedSchemaMembersResult.push(someTopLevelSchemaMemberNode);
          }
        }
      );
    }
  });
  return {
    exportedSchemaMembers: exportedSchemaMembersResult,
  };
}

interface TableSchema {
  tableName: string;
  tableColumns: Array<ColumnSchema>;
}

type ColumnSchema = StringColumnSchema;

interface StringColumnSchema extends ColumnSchemaBase<"TEXT"> {}

interface ColumnSchemaBase<ColumnType> {
  columnName: string;
  columnType: ColumnType;
}

interface GetCreateTableQueryApi {
  someTableSchema: TableSchema;
}

function getCreateTableQuery(api: GetCreateTableQueryApi) {
  const { someTableSchema } = api;
  return `
CREATE TABLE IF NOT EXISTS ${someTableSchema.tableName} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ${someTableSchema.tableColumns
    .map(
      (someColumnSchema) =>
        `${someColumnSchema.columnName} ${someColumnSchema.columnType} NOT NULL`
    )
    .join(",\n")}
);
`.trim();
}

interface GetCreateRecordQueryApi {
  someTableSchema: TableSchema;
}

function getCreateRandomRecordQuery(api: GetCreateRecordQueryApi) {
  const { someTableSchema } = api;
  return `
INSERT INTO ${someTableSchema.tableName} (${someTableSchema.tableColumns
    .map((someColumnSchema) => someColumnSchema.columnName)
    .join(", ")}) VALUES (${someTableSchema.tableColumns
    .map((someColumnSchema) =>
      someColumnSchema.columnType === "TEXT"
        ? "'random text value'"
        : throwInvalidPathError("getCreateRandomRecordQuery")
    )
    .join(", ")});
`.trim();
}
