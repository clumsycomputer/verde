import { throwInvalidPathError } from '../../helpers/throwError.ts';
import {
  GenericParameter,
  GetThisIntermediateElement,
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../types/IntermediateSchema.ts';
import {
  TerminalElement,
  TerminalModel,
  TerminalSchema,
} from '../types/TerminalSchema.ts';

export interface ResolveTerminalSchemaApi {
  intermediateSchema: IntermediateSchema;
}

export function resolveTerminalSchema(
  api: ResolveTerminalSchemaApi,
): TerminalSchema {
  const { intermediateSchema } = api;
  return {
    schemaSymbol: intermediateSchema.schemaSymbol,
    schemaMap: Object.values(intermediateSchema.schemaMap.data).reduce<
      TerminalSchema['schemaMap']
    >((modelsResult, someDataIntermediateModel) => {
      modelsResult[someDataIntermediateModel.modelSymbolKey] = {
        modelSymbolKey: someDataIntermediateModel.modelSymbolKey,
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
  extends Pick<ResolveTerminalSchemaApi, 'intermediateSchema'> {
  someIntermediateModel: this['intermediateSchema']['schemaMap'][
    keyof IntermediateSchema['schemaMap']
  ][
    string
  ];
  argumentElements: Record<
    GenericParameter['parameterSymbol'],
    TerminalElement
  >;
}

function resolveModelProperties(
  api: ResolveModelPropertiesApi,
): TerminalModel['modelProperties'] {
  const { someIntermediateModel, intermediateSchema, argumentElements } = api;
  const resolvedTemplateProperties = someIntermediateModel.modelTemplates
    .reduce<
      TerminalModel['modelProperties']
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
            templateIntermediateModel,
          }),
        }),
      };
    }, {});
  const directProperties = Object.values(someIntermediateModel.modelProperties)
    .reduce<
      TerminalModel['modelProperties']
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
): TerminalElement {
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
  templateIntermediateModel: GetThisIntermediateModel<
    ResolveModelPropertiesApi['someIntermediateModel']['modelTemplates'][
      number
    ]['templateKind']
  >;
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
    argumentsResult[someGenericArgument.argumentSymbolKey] =
      someGenericArgument.argumentElement.elementKind === 'basicParameter' ||
        someGenericArgument.argumentElement.elementKind ===
          'constrainedParameter'
        ? argumentElements[someGenericArgument.argumentSymbolKey] ??
          throwInvalidPathError(
            'argumentsResult[someGenericArgument.argumentSymbolKey]',
          )
        : someGenericArgument.argumentElement;
    return argumentsResult;
  }, {});
}
