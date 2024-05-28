import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { FileSystem } from '../../../../imports/FileSystem.ts';
import { Path } from '../../../../imports/Path.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  DeriveIntermediateSchemaApi
} from '../deriveIntermediateSchema.ts';
import {
  throwInvalidSchemaModule_PathDoesNotExist,
  throwInvalidSchemaModule__CodeExport,
  throwInvalidSchemaModule__GenericTypeAliasExport,
  throwInvalidSchemaModule__MultipleExports,
  throwInvalidSchemaModule__NoExports,
  throwInvalidSchemaModule__NonTypeAliasExport,
} from '../errors.ts';

export interface LoadSchemaModuleApi
  extends Pick<DeriveIntermediateSchemaApi, 'schemaModulePath'> {}

export interface LoadSchemaModuleResult {
  schemaTypeChecker: Typescript.TypeChecker;
  schemaExportNode: Typescript.TypeAliasDeclaration;
}

export function loadSchemaModule(
  api: LoadSchemaModuleApi,
): LoadSchemaModuleResult {
  const { schemaModulePath } = api;
  const workingDirectoryPath = Deno.cwd();
  const resolvedSchemaModulePath = Path.isAbsolute(schemaModulePath)
    ? schemaModulePath
    : Path.join(workingDirectoryPath, schemaModulePath);
  if (true !== FileSystem.existsSync(resolvedSchemaModulePath)) {
    throwInvalidSchemaModule_PathDoesNotExist({
      schemaModulePath,
    });
  }
  const schemaProgram = Typescript.createProgram([schemaModulePath], {
    rootDir: workingDirectoryPath,
    target: Typescript.ScriptTarget.Latest,
    strictNullChecks: true,
  });
  const schemaTypeChecker = schemaProgram.getTypeChecker();
  const schemaModuleFile = schemaProgram.getSourceFile(schemaModulePath) ??
    throwInvalidPathError('schemaModuleFile');
  const schemaModuleSymbol = schemaTypeChecker.getSymbolAtLocation(
    schemaModuleFile,
  );
  if (undefined === schemaModuleSymbol) {
    throwInvalidSchemaModule__NoExports({
      schemaModulePath,
    });
  }
  const schemaExports = schemaTypeChecker.getExportsOfModule(
    schemaModuleSymbol,
  );
  if (1 < schemaExports.length) {
    throwInvalidSchemaModule__MultipleExports({
      schemaModulePath,
    });
  }
  const lhsSchemaExportSymbol =
    (schemaExports.length === 1 && schemaExports[0]) ||
    throwInvalidPathError('lhsSchemaExportSymbol');
  if (undefined !== lhsSchemaExportSymbol.valueDeclaration) {
    throwInvalidSchemaModule__CodeExport({
      schemaModulePath,
    });
  }
  const schemaExportNode = (lhsSchemaExportSymbol.declarations &&
    lhsSchemaExportSymbol.declarations[0]) ??
    throwInvalidPathError('schemaExportNode');
  if (true !== Typescript.isTypeAliasDeclaration(schemaExportNode)) {
    throwInvalidSchemaModule__NonTypeAliasExport({
      schemaModulePath,
    });
  } else if (undefined !== schemaExportNode.typeParameters) {
    throwInvalidSchemaModule__GenericTypeAliasExport({
      schemaModulePath,
    });
  }
  return {
    schemaTypeChecker,
    schemaExportNode,
  };
}
