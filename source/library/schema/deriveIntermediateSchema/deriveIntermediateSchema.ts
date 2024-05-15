import {
  throwInvalidPathError,
  throwUserError,
} from '../../../helpers/throwError.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { IntermediateSchema } from '../types/IntermediateSchema.ts';
import { deriveDataModel } from './components/__deriveIntermediateModel.ts';
import { deriveIntermediateAlias } from './components/deriveIntermediateAlias.ts';
import {
  loadSchemaModule,
  LoadSchemaModuleResult,
} from './components/loadSchemaModule.ts';

export interface DeriveIntermediateSchemaApi {
  schemaModulePath: string;
}

export function deriveIntermediateSchema(
  api: DeriveIntermediateSchemaApi,
): IntermediateSchema {
  const { schemaModulePath } = api;
  const {
    schemaTypeChecker,
    lhsSchemaExportSymbol,
    rhsSchemaExportNode,
  } = loadSchemaModule({
    schemaModulePath,
  });
  return __deriveIntermediateSchema({
    schemaTypeChecker,
    lhsSchemaExportSymbol,
    rhsSchemaExportNode,
  });
}

export interface __DeriveIntermediateSchemaApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportNode'
  > {}

function __deriveIntermediateSchema(
  api: __DeriveIntermediateSchemaApi,
): IntermediateSchema {
  const { schemaTypeChecker, lhsSchemaExportSymbol, rhsSchemaExportNode } = api;
  const schemaResult: IntermediateSchema = {
    schemaName: lhsSchemaExportSymbol.name,
    schemaModels: {
      data: {},
      concreteTemplate: {},
      genericTemplate: {},
    },
    schemaAliases: {},
  };
  rhsSchemaExportNode.elements.forEach((someExportItemLocalNode) => {
    const exportItemLocalSymbol =
      Typescript.isTypeReferenceNode(someExportItemLocalNode) &&
        schemaTypeChecker.getSymbolAtLocation(
          someExportItemLocalNode.typeName,
        ) ||
      throwUserError('exportItemLocalSymbol: todo');
    const exportItemLocalDeclaration = exportItemLocalSymbol.declarations &&
        exportItemLocalSymbol.declarations.length === 1 &&
        exportItemLocalSymbol.declarations[0] ||
      throwUserError('exportItemLocalDeclaration: todo');
    const exportItemSourceSymbol =
      Typescript.isImportSpecifier(exportItemLocalDeclaration)
        ? schemaTypeChecker.getAliasedSymbol(exportItemLocalSymbol)
        : exportItemLocalSymbol;
    const exportItemSourceDeclaration = exportItemSourceSymbol.declarations &&
        exportItemSourceSymbol.declarations[0] ||
      throwInvalidPathError('exportItemSourceDeclaration');
    if (Typescript.isInterfaceDeclaration(exportItemSourceDeclaration)) {
      deriveDataModel({
        schemaTypeChecker,
        schemaResult,
        modelDeclaration: exportItemSourceDeclaration,
      });
    } else if (
      Typescript.isTypeAliasDeclaration(exportItemSourceDeclaration) &&
      exportItemSourceDeclaration.typeParameters === undefined
    ) {
      deriveIntermediateAlias({
        schemaTypeChecker,
        schemaResult,
        aliasSourceDeclaration: exportItemSourceDeclaration,
      });
    } else {
      // when does this execute
      throwUserError('invalid schema export item: todo');
    }
  });
  return schemaResult;
}
