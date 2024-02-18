// import { throwInvalidPathError } from '../../helpers/throwError.ts';
// import {
//   GenericParameter,
//   IntermediateSchemaModel,
//   IntermediateStructuredSchema,
// } from '../types/IntermediateSchema.ts';
// import {
//   TerminalStructuredSchema,
//   TerminalSchemaModel,
// } from '../types/TerminalStructuredSchema.ts';

// export interface ResolveTerminalStructuredSchemaApi {
//   intermediateStructuredSchema: IntermediateStructuredSchema;
// }

// export function resolveTerminalStructuredSchema(
//   api: ResolveTerminalStructuredSchemaApi,
// ): TerminalStructuredSchema {
//   const { intermediateStructuredSchema } = api;
//   return {
//     schemaSymbol: intermediateStructuredSchema.schemaSymbol,
//     schemaMap: Object.values(intermediateStructuredSchema.schemaMap.data).reduce<
//       TerminalStructuredSchema['schemaMap']
//     >((modelsResult, someDataIntermediateModel) => {
//       someDataIntermediateModel.modelTemplates;
//       modelsResult[someDataIntermediateModel.modelSymbolKey] = {
//         modelSymbolKey: someDataIntermediateModel.modelSymbolKey,
//         modelProperties: resolveModelProperties({
//           parameterArguments: {},
//           intermediateSchemaMap,
//           someIntermediateModel: someDataIntermediateModel,
//         }),
//       };
//       return modelsResult;
//     }, {}),
//   };
// }

// interface ResolveModelPropertiesApi
//   extends Pick<ResolveTerminalStructuredSchemaApi, 'intermediateStructuredSchema'> {
//   someIntermediateModel: this['intermediateStructuredSchema']['schemaMap']
//   parameterArguments: Record<
//     GenericParameter['parameterSymbol'],
//     TerminalSchemaModel['modelProperties'][string]['propertyElement']
//   >;
// }

// function resolveModelProperties(
//   api: ResolveModelPropertiesApi,
// ): TerminalSchemaModel['modelProperties'] {
//   const { someIntermediateModel, intermediateSchemaMap, parameterArguments } =
//     api;
//   const resolvedTemplateProperties = someIntermediateModel.modelTemplates
//     .reduce<
//       TerminalSchemaModel['modelProperties']
//     >((templatePropertiesResult, someModelTemplate) => {
//       const templateIntermediateModel = intermediateSchemaMap
//         .schemaModels[someModelTemplate.templateModelSymbolKey] ??
//         throwInvalidPathError('templateIntermediateModel');
//       return {
//         ...templatePropertiesResult,
//         ...resolveModelProperties({
//           intermediateSchemaMap,
//           someIntermediateModel: templateIntermediateModel,
//           parameterArguments: resolveParameterArguments({
//             parameterArguments,
//             someModelTemplate,
//             templateIntermediateModel,
//           }),
//         }),
//       };
//     }, {});
//   const directProperties = Object.values(someIntermediateModel.modelProperties)
//     .reduce<
//       TerminalSchemaModel['modelProperties']
//     >(
//       (directPropertiesResult, someIntermediateProperty) => ({
//         ...directPropertiesResult,
//         [someIntermediateProperty.propertyKey]: {
//           propertyKey: someIntermediateProperty.propertyKey,
//           propertyElement: resolvePropertyElement({
//             parameterArguments,
//             someIntermediatePropertyElement:
//               someIntermediateProperty.propertyElement,
//           }),
//         },
//       }),
//       {},
//     );
//   return {
//     ...resolvedTemplateProperties,
//     ...directProperties,
//   };
// }

// interface ResolvePropertyElementApi
//   extends Pick<ResolveModelPropertiesApi, 'parameterArguments'> {
//   someIntermediatePropertyElement:
//     IntermediateSchemaModel['modelProperties'][string]['propertyElement'];
// }

// function resolvePropertyElement(
//   api: ResolvePropertyElementApi,
// ): TerminalSchemaModel['modelProperties'][string]['propertyElement'] {
//   const { someIntermediatePropertyElement, parameterArguments } = api;
//   if (
//     someIntermediatePropertyElement.elementKind === 'literal' ||
//     someIntermediatePropertyElement.elementKind === 'primitive' ||
//     someIntermediatePropertyElement.elementKind === 'dataModel'
//   ) {
//     return {
//       ...someIntermediatePropertyElement,
//     };
//   } else if (someIntermediatePropertyElement.elementKind === 'parameter') {
//     const parameterArgumentElement =
//       parameterArguments[someIntermediatePropertyElement.parameterSymbol] ??
//         throwInvalidPathError('parameterArgumentElement');
//     return {
//       ...parameterArgumentElement,
//     };
//   } else {
//     throwInvalidPathError('resolvePropertyElement');
//   }
// }

// interface ResolveParameterArgumentsApi
//   extends Pick<ResolveModelPropertiesApi, 'parameterArguments'> {
//   someModelTemplate:
//     ResolveModelPropertiesApi['someIntermediateModel']['modelTemplates'][
//       number
//     ];
//   templateIntermediateModel: IntermediateSchemaMap['schemaModels'][
//     this['someModelTemplate']['templateModelSymbolKey']
//   ];
// }

// function resolveParameterArguments(
//   api: ResolveParameterArgumentsApi,
// ) {
//   const { someModelTemplate, parameterArguments } = api;
//   if (someModelTemplate.templateKind === 'concrete') {
//     return {};
//   }
//   return Object.values(someModelTemplate.genericArguments).reduce<
//     ResolveModelPropertiesApi['parameterArguments']
//   >((argumentsResult, someGenericArgument) => {
//     argumentsResult[someGenericArgument.argumentSymbolKey] =
//       someGenericArgument.argumentElement.elementKind === 'parameter'
//         ? parameterArguments[someGenericArgument.argumentSymbolKey] ??
//           throwInvalidPathError(
//             'argumentsResult[someGenericArgument.argumentSymbolKey]',
//           )
//         : someGenericArgument.argumentElement;
//     return argumentsResult;
//   }, {});
// }
