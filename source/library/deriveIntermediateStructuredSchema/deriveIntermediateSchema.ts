import { throwInvalidPathError } from '../../helpers/throwError.ts';
import {
  IntermediateSchema
} from '../types/IntermediateSchema.ts';
import { deriveDataModel } from './components/__deriveIntermediateModel.ts';
import {
  __LoadSchemaModuleResult,
  __loadSchemaModule,
} from './components/loadSchemaModule.ts';
import {
  throwInvalidTopLevelModel,
  throwInvalidSchemaExport__NotTuple
} from './helpers/errors.ts';
import {
  isInterfaceType,
  isTypeReference
} from './helpers/typeguards.ts';

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
    rhsSchemaExportType,
  } = __loadSchemaModule({
    schemaModulePath,
  });
  return __deriveIntermediateSchema({
    schemaTypeChecker,
    lhsSchemaExportSymbol,
    rhsSchemaExportType,
  });
}

export interface __DeriveIntermediateSchemaApi extends
  Pick<
    __LoadSchemaModuleResult,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportType'
  > {}

function __deriveIntermediateSchema(api: __DeriveIntermediateSchemaApi): IntermediateSchema {
  const { schemaTypeChecker, rhsSchemaExportType, lhsSchemaExportSymbol } = api;
  if (true !== schemaTypeChecker.isTupleType(rhsSchemaExportType)) {
    throwInvalidSchemaExport__NotTuple({
      schemaTypeChecker,
      rhsSchemaExportType,
    });
  }
  const schemaResult: IntermediateSchema = {
    schemaSymbol: lhsSchemaExportSymbol.name,
    schemaMap: {
      data: {},
      concreteTemplate: {},
      genericTemplate: {}
    },
  };
  const topLevelDataModelTypes = (isTypeReference(rhsSchemaExportType) &&
    schemaTypeChecker.getTypeArguments(rhsSchemaExportType)) ||
    throwInvalidPathError('topLevelDataModelTypes');
  topLevelDataModelTypes.forEach((someTopLevelDataModelType) => {
    if (true !== isInterfaceType(someTopLevelDataModelType)) {
      throwInvalidTopLevelModel({
        schemaTypeChecker,
        someTopLevelDataModelType,
      });
    }
    deriveDataModel({
      schemaTypeChecker,
      schemaResult,
      someDataModelType: someTopLevelDataModelType,
    });
  });
  return schemaResult;
}


