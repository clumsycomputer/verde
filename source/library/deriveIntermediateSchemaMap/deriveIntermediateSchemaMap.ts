import { throwInvalidPathError } from '../../helpers/throwError.ts';
import {
  IntermediateSchemaMap
} from '../types/IntermediateSchemaMap.ts';
import { deriveDataModel } from './components/__deriveIntermediateModel.ts';
import {
  LoadSchemaModuleResult,
  loadSchemaModule,
} from './components/loadSchemaModule.ts';
import {
  throwInvalidTopLevelModel,
  throwSchemaExportNotTuple
} from './helpers/errors.ts';
import {
  isInterfaceType,
  isTypeReference
} from './helpers/typeguards.ts';

export interface DeriveIntermediateSchemaMapApi {
  schemaModulePath: string;
}

export function deriveIntermediateSchemaMap(
  api: DeriveIntermediateSchemaMapApi,
): IntermediateSchemaMap {
  const { schemaModulePath } = api;
  const {
    schemaTypeChecker,
    lhsSchemaExportSymbol,
    rhsSchemaExportType,
  } = loadSchemaModule({
    schemaModulePath,
  });
  return deriveSchemaMap({
    schemaTypeChecker,
    lhsSchemaExportSymbol,
    rhsSchemaExportType,
  });
}

export interface DeriveSchemaMapApi extends
  Pick<
    LoadSchemaModuleResult,
    'schemaTypeChecker' | 'lhsSchemaExportSymbol' | 'rhsSchemaExportType'
  > {}

function deriveSchemaMap(api: DeriveSchemaMapApi): IntermediateSchemaMap {
  const { schemaTypeChecker, rhsSchemaExportType, lhsSchemaExportSymbol } = api;
  if (false === schemaTypeChecker.isTupleType(rhsSchemaExportType)) {
    throwSchemaExportNotTuple({
      schemaTypeChecker,
      rhsSchemaExportType,
      lhsSchemaExportSymbol,
    });
  }
  const schemaMapResult: IntermediateSchemaMap = {
    schemaSymbol: lhsSchemaExportSymbol.name,
    schemaModels: {},
  };
  const topLevelDataModelTypes = (isTypeReference(rhsSchemaExportType) &&
    schemaTypeChecker.getTypeArguments(rhsSchemaExportType)) ||
    throwInvalidPathError('topLevelDataModelTypes');
  topLevelDataModelTypes.forEach((someTopLevelDataModelType) => {
    if (false === isInterfaceType(someTopLevelDataModelType)) {
      throwInvalidTopLevelModel({
        schemaTypeChecker,
        someTopLevelDataModelType,
      });
    }
    deriveDataModel({
      schemaTypeChecker,
      schemaMapResult,
      someDataModelType: someTopLevelDataModelType,
    });
  });
  return schemaMapResult;
}


