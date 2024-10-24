import { throwInvalidPathError } from '../../../helpers/throwError.ts';
import {
  GenericParameter,
  GetThisIntermediateElement,
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../types/IntermediateSchema.ts';
import {
  SolidifiedElement,
  SolidifiedModel,
  SolidifiedSchema,
} from '../types/SolidfiedSchema.ts';

export interface GetSolidifiedSchemaApi {
  intermediateSchema: IntermediateSchema;
}

export function getSolidifiedSchema(
  api: GetSolidifiedSchemaApi,
): SolidifiedSchema {
  const { intermediateSchema } = api;
  return {
    schemaSymbol: intermediateSchema.schemaSymbol,
    schemaMap: Object.values(intermediateSchema.schemaMap.data).reduce<
      SolidifiedSchema['schemaMap']
    >((modelsResult, someDataIntermediateModel) => {
      modelsResult[someDataIntermediateModel.modelSymbol] = {
        modelSymbol: someDataIntermediateModel.modelSymbol,
        modelProperties: resolveModelProperties({
          argumentElements: {},
          intermediateSchema,
          someIntermediateModel: someDataIntermediateModel,
        }),
      };
      return modelsResult;
    }, {}),
  };
}

interface ResolveModelPropertiesApi
  extends Pick<GetSolidifiedSchemaApi, 'intermediateSchema'> {
  someIntermediateModel: GetThisIntermediateModel<
    keyof IntermediateSchema['schemaMap']
  >;
  argumentElements: Record<
    GenericParameter['parameterSymbol'],
    SolidifiedElement
  >;
}

function resolveModelProperties(
  api: ResolveModelPropertiesApi,
): SolidifiedModel['modelProperties'] {
  const { someIntermediateModel, intermediateSchema, argumentElements } = api;
  const resolvedTemplateProperties = someIntermediateModel.modelTemplates
    .reduce<
      SolidifiedModel['modelProperties']
    >((templatePropertiesResult, someModelTemplate) => {
      const templateIntermediateModel = intermediateSchema
        .schemaMap[someModelTemplate.templateKind][
          someModelTemplate.templateModelSymbolKey
        ] ??
        throwInvalidPathError('templateIntermediateModel');
      return {
        ...templatePropertiesResult,
        ...resolveModelProperties({
          intermediateSchema,
          someIntermediateModel: templateIntermediateModel,
          argumentElements: resolveArgumentElements({
            argumentElements,
            someModelTemplate,
          }),
        }),
      };
    }, {});
  const directProperties = Object.values(someIntermediateModel.modelProperties)
    .reduce<
      SolidifiedModel['modelProperties']
    >(
      (directPropertiesResult, someIntermediateProperty) => ({
        ...directPropertiesResult,
        [someIntermediateProperty.propertyKey]: {
          propertyKey: someIntermediateProperty.propertyKey,
          propertyElement: resolvePropertyElement({
            argumentElements,
            someIntermediatePropertyElement:
              someIntermediateProperty.propertyElement,
          }),
        },
      }),
      {},
    );
  return {
    ...resolvedTemplateProperties,
    ...directProperties,
  };
}

interface ResolvePropertyElementApi
  extends Pick<ResolveModelPropertiesApi, 'argumentElements'> {
  someIntermediatePropertyElement: GetThisIntermediateElement<
    keyof IntermediateSchema['schemaMap']
  >;
}

function resolvePropertyElement(
  api: ResolvePropertyElementApi,
): SolidifiedElement {
  const { someIntermediatePropertyElement, argumentElements } = api;
  if (
    someIntermediatePropertyElement.elementKind === 'basicParameter' ||
    someIntermediatePropertyElement.elementKind === 'constrainedParameter'
  ) {
    const resolvedArgumentElement =
      argumentElements[someIntermediatePropertyElement.parameterSymbol] ??
        throwInvalidPathError('resolvedArgumentElement');
    return {
      ...resolvedArgumentElement,
    };
  } else {
    return {
      ...someIntermediatePropertyElement,
    };
  }
}

interface ResolveArgumentElementsApi
  extends Pick<ResolveModelPropertiesApi, 'argumentElements'> {
  someModelTemplate:
    ResolveModelPropertiesApi['someIntermediateModel']['modelTemplates'][
      number
    ];
}

function resolveArgumentElements(
  api: ResolveArgumentElementsApi,
) {
  const { someModelTemplate, argumentElements } = api;
  if (someModelTemplate.templateKind === 'concreteTemplate') {
    return {};
  }
  return Object.values(someModelTemplate.genericArguments).reduce<
    ResolveModelPropertiesApi['argumentElements']
  >((argumentsResult, someGenericArgument) => {
    argumentsResult[someGenericArgument.argumentParameterSymbolKey] =
      someGenericArgument.argumentElement.elementKind === 'basicParameter' ||
        someGenericArgument.argumentElement.elementKind ===
          'constrainedParameter'
        ? argumentElements[someGenericArgument.argumentElement.parameterSymbol] ??
          throwInvalidPathError(
            'argumentsResult[someGenericArgument.argumentParameterSymbolKey]',
          )
        : someGenericArgument.argumentElement;
    return argumentsResult;
  }, {});  
}
