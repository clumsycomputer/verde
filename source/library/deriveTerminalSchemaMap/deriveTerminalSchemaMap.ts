import { throwInvalidPathError } from '../../helpers/throwError.ts';
import {
  IntermediateSchemaMap,
  IntermediateSchemaModel,
} from '../types/IntermediateSchemaMap.ts';
import {
  TerminalSchemaMap,
  TerminalSchemaModel,
} from '../types/TerminalSchemaMap.ts';

export interface DeriveTerminalSchemaMapApi {
  someIntermediateSchemaMap: IntermediateSchemaMap;
}

export function deriveTerminalSchemaMap(
  api: DeriveTerminalSchemaMapApi,
): TerminalSchemaMap {
  const { someIntermediateSchemaMap } = api;
  const intermediateDataModels = Object.values(
    someIntermediateSchemaMap.schemaModels,
  ).filter((someIntermediateModel) =>
    someIntermediateModel.modelKind === 'data'
  );
  return {
    schemaSymbol: someIntermediateSchemaMap.schemaSymbol,
    schemaModels: intermediateDataModels.reduce<
      TerminalSchemaMap['schemaModels']
    >((modelsResult, someDataIntermediateModel) => {
      modelsResult[someDataIntermediateModel.modelSymbolKey] = {
        modelSymbolKey: someDataIntermediateModel.modelSymbolKey,
        modelProperties: processModelProperties({
          someIntermediateModel: someDataIntermediateModel,
          propertiesResult: {},
        }),
      };
      return modelsResult;
    }, {}),
  };
}

interface ProcessModelPropertiesApi {
  someIntermediateModel: IntermediateSchemaModel;
  propertiesResult: TerminalSchemaModel['modelProperties'];
}

function processModelProperties(
  api: ProcessModelPropertiesApi,
): TerminalSchemaModel['modelProperties'] {
  const { someIntermediateModel, propertiesResult } = api;
  Object.values(someIntermediateModel.modelProperties).forEach(
    (someModelProperty) => {
      if (someModelProperty.propertyElement.elementKind === 'primitive') {
        propertiesResult[someModelProperty.propertyKey] = {
          propertyKey: someModelProperty.propertyKey,
          propertyElement: someModelProperty.propertyElement,
        };
      } else if (someModelProperty.propertyElement.elementKind === 'literal') {
        propertiesResult[someModelProperty.propertyKey] = {
          propertyKey: someModelProperty.propertyKey,
          propertyElement: someModelProperty.propertyElement,
        };
      } else if (
        someModelProperty.propertyElement.elementKind === 'dataModel'
      ) {
        propertiesResult[someModelProperty.propertyKey] = {
          propertyKey: someModelProperty.propertyKey,
          propertyElement: someModelProperty.propertyElement,
        };
      } else if (
        someIntermediateModel.modelKind === 'template' &&
        someIntermediateModel.templateKind === 'generic' &&
        someModelProperty.propertyElement.elementKind === 'parameter'
      ) {
        someIntermediateModel.genericParameters;
        someModelProperty.propertyElement.parameterSymbol;
      } else {
        throwInvalidPathError('processModelProperties');
      }
    },
  );
  return propertiesResult;
}
