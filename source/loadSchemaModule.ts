import { FileSystem } from './imports/FileSystem.ts';
import { Path } from './imports/Path.ts';
import { Typescript } from './imports/Typescript.ts';
import { throwInvalidPathError, throwUserError } from './helpers/throwError.ts';

export interface LoadSchemaModuleApi {
  schemaModulePath: string;
}

export interface LoadSchemaModuleResult {
  schemaTypeChecker: Typescript.TypeChecker;
  lhsSchemaExportSymbol: Typescript.Symbol;
  rhsSchemaExportType: Typescript.Type;
}

export function loadSchemaModule(
  api: LoadSchemaModuleApi,
): LoadSchemaModuleResult {
  const { schemaModulePath } = api;
  const workingDirectoryPath = Deno.cwd();
  const resolvedSchemaModulePath = Path.isAbsolute(schemaModulePath)
    ? schemaModulePath
    : Path.join(workingDirectoryPath, schemaModulePath);
  if (FileSystem.existsSync(resolvedSchemaModulePath) === false) {
    throwUserError(`schemaModulePath: "${schemaModulePath}" doesn't exist`);
  }
  const schemaProgram = Typescript.createProgram([schemaModulePath], {
    target: Typescript.ScriptTarget.Latest,
    rootDir: workingDirectoryPath,
    strictNullChecks: true
  });
  const schemaTypeChecker = schemaProgram.getTypeChecker();
  const schemaModuleFile = schemaProgram.getSourceFile(schemaModulePath) ??
    throwInvalidPathError('schemaFile');
  const schemaModuleSymbol = schemaTypeChecker.getSymbolAtLocation(
    schemaModuleFile,
  );
  if (schemaModuleSymbol === undefined) {
    throwUserError(
      `invalid schema module: no exports at "${schemaModulePath}"`,
    );
  }
  const schemaExports = schemaTypeChecker.getExportsOfModule(
    schemaModuleSymbol,
  );
  if (schemaExports.length > 1) {
    throwUserError(
      `invalid schema module: multiple exports at "${schemaModulePath}"`,
    );
  }
  const lhsSchemaExportSymbol =
    (schemaExports.length === 1 && schemaExports[0]) ||
    throwInvalidPathError('schemaExportSymbol');  
  if (lhsSchemaExportSymbol.valueDeclaration) {
    throwUserError(
      `invalid schema module: non-type export at "${schemaModulePath}"`,
    );
  }
  const schemaExportNode = (lhsSchemaExportSymbol.declarations &&
    lhsSchemaExportSymbol.declarations[0]) ??
    throwInvalidPathError('schemaExportNode');
  if (Typescript.isInterfaceDeclaration(schemaExportNode)) {
    throwUserError(`invalid schema module: interface export at "${schemaModulePath}"`)
  }
  const rhsSchemaExportType = schemaTypeChecker.getTypeAtLocation(
    schemaExportNode,
  );
  return {
    schemaTypeChecker,
    lhsSchemaExportSymbol,
    rhsSchemaExportType,
  };
}
