import {
  throwInvalidPathError
} from '../../../helpers/throwError.ts';
import { FileSystem } from '../../../imports/FileSystem.ts';
import { Path } from '../../../imports/Path.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { DeriveIntermediateSchemaMapApi } from '../deriveIntermediateSchemaMap.ts';
import {
  throwInvalidSchemaModulePath,
  throwMultipleExportsSchemaModule,
  throwNoExportsSchemaModule,
  throwNonTypeExportSchemaModule,
  throwNotConcreteTypeAliasExportSchemaModule,
} from '../helpers/errors.ts';

export interface LoadSchemaModuleApi
  extends Pick<DeriveIntermediateSchemaMapApi, 'schemaModulePath'> {
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
  if (true !== FileSystem.existsSync(resolvedSchemaModulePath)) {
    throwInvalidSchemaModulePath({
      schemaModulePath,
    });
  }
  const schemaProgram = Typescript.createProgram([schemaModulePath], {
    target: Typescript.ScriptTarget.Latest,
    rootDir: workingDirectoryPath,
    strictNullChecks: true,
  });
  const schemaTypeChecker = schemaProgram.getTypeChecker();
  const schemaModuleFile = schemaProgram.getSourceFile(schemaModulePath) ??
    throwInvalidPathError('schemaFile');
  const schemaModuleSymbol = schemaTypeChecker.getSymbolAtLocation(
    schemaModuleFile,
  );
  if (undefined === schemaModuleSymbol) {
    throwNoExportsSchemaModule({
      schemaModulePath,
    });
  }
  const schemaExports = schemaTypeChecker.getExportsOfModule(
    schemaModuleSymbol,
  );
  if (1 < schemaExports.length) {
    throwMultipleExportsSchemaModule({
      schemaModulePath,
    });
  }
  const lhsSchemaExportSymbol =
    (schemaExports.length === 1 && schemaExports[0]) ||
    throwInvalidPathError('lhsSchemaExportSymbol');
  if (undefined !== lhsSchemaExportSymbol.valueDeclaration) {
    throwNonTypeExportSchemaModule({
      schemaModulePath,
    });
  }
  const schemaExportNode = (lhsSchemaExportSymbol.declarations &&
    lhsSchemaExportSymbol.declarations[0]) ??
    throwInvalidPathError('schemaExportNode');
  if (
    true !== Typescript.isTypeAliasDeclaration(schemaExportNode) ||
    undefined !== schemaExportNode.typeParameters
  ) {
    throwNotConcreteTypeAliasExportSchemaModule({
      schemaModulePath
    })
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
