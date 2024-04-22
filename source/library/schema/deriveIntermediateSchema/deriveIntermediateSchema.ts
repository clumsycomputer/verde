import {
  throwInvalidPathError,
  throwUserError,
} from '../../../helpers/throwError.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { IntermediateSchema } from '../types/IntermediateSchema.ts';
import { deriveDataModel } from './components/__deriveIntermediateModel.ts';
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
  rhsSchemaExportNode.elements.forEach((someSchemaExportItemNode) => {
    const schemaExportItemSymbol =
      Typescript.isTypeReferenceNode(someSchemaExportItemNode) &&
        schemaTypeChecker.getSymbolAtLocation(
          someSchemaExportItemNode.typeName,
        ) ||
      throwUserError('schemaExportItemSymbol: todo');
    const schemaExportItemDeclaration = schemaExportItemSymbol.declarations &&
        schemaExportItemSymbol.declarations.length === 1 &&
        schemaExportItemSymbol.declarations[0] ||
      throwUserError('schemaExportItemDeclaration: todo');
    if (Typescript.isInterfaceDeclaration(schemaExportItemDeclaration)) {
      deriveDataModel({
        schemaTypeChecker,
        schemaResult,
        modelSymbol: schemaExportItemSymbol,
      });
    } else if (Typescript.isTypeAliasDeclaration(schemaExportItemDeclaration)) {
      // console.log(schemaExportItemDeclaration.name);
    } else {
      throwUserError('invalid schema export item: todo');
    }
  });
  return schemaResult;
}
