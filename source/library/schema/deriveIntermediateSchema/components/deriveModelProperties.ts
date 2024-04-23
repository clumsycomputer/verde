import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GetThisIntermediateModel,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { isPropertySymbol } from '../helpers/typeguards.ts';
import { __DeriveIntermediateModelApi } from './__deriveIntermediateModel.ts';
import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveModelPropertiesApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
> extends
  Pick<
    __DeriveIntermediateModelApi<ThisTargetModelKind>,
    | 'elementCases'
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'modelSymbol'
  > // | 'astContext'
{}

export function deriveModelProperties<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaModels'],
>(
  api: DeriveModelPropertiesApi<ThisTargetModelKind>,
): GetThisIntermediateModel<ThisTargetModelKind>['modelProperties'] {
  const {
    modelSymbol,
    schemaTypeChecker,
    schemaResult,
    elementCases,
    // astContext,
  } = api;
  const typeProperties = (modelSymbol.members &&
    Array.from(modelSymbol.members.values()).filter(
      isPropertySymbol,
    )) ??
    [];
  return typeProperties.reduce<
    GetThisIntermediateModel<ThisTargetModelKind>['modelProperties']
  >(
    (modelPropertiesResult, someTypeProperty) => {
      const propertyKey = someTypeProperty.name;
      // const propertyElementType = schemaTypeChecker.getTypeOfSymbol(
      //   someTypeProperty,
      // );
      // console.log(
      //   Boolean(
      //     someTypeProperty.valueDeclaration && Typescript.isPropertySignature(
      //       someTypeProperty.valueDeclaration,
      //     ) && someTypeProperty.valueDeclaration.type &&
      //       schemaTypeChecker.getTypeAtLocation(
      //         someTypeProperty.valueDeclaration.type,
      //       ),
      //   ),
      // );
      // console.log(schemaTypeChecker.typeToString(propertyElementType));
      // console.log(
      //   schemaTypeChecker.typeToString(
      //     someTypeProperty.valueDeclaration && Typescript.isPropertySignature(
      //           someTypeProperty.valueDeclaration,
      //         ) &&
      //         someTypeProperty.valueDeclaration.type &&
      //         schemaTypeChecker.getTypeAtLocation(
      //           someTypeProperty.valueDeclaration.type,
      //         ) || throwInvalidPathError('asdff'),
      //   ),
      // );
      // const propertyElementValueType = someTypeProperty.valueDeclaration &&
      //     Typescript.isPropertySignature(
      //       someTypeProperty.valueDeclaration,
      //     ) && someTypeProperty.valueDeclaration.type &&
      //     Typescript.isTypeReferenceNode(
      //       someTypeProperty.valueDeclaration.type,
      //     ) && someTypeProperty.valueDeclaration.type || null;
      // const propertyElementSourceSymbol = propertyElementValueType
      //   ? schemaTypeChecker.getSymbolAtLocation(
      //     propertyElementValueType.typeName,
      //   ) ?? throwInvalidPathError('propertyElementSourceSymbol')
      //   : null;
      // const propertyElementNode: ElementNode<Typescript.Type> =
      //   propertyElementSourceSymbol &&
      //     propertyElementSourceSymbol.name !==
      //       propertyElementType.symbol.name &&
      //     propertyElementValueType && propertyElementValueType.typeArguments
      //     ? {
      //       nodeKind: 'typeFunction',
      //       nodeResolvedType: propertyElementType,
      //       nodeSourceSymbol: propertyElementSourceSymbol,
      //       nodeTypeArguments: propertyElementValueType.typeArguments.map(
      //         (someArgumentNode): GeneralElementNode<Typescript.Type> => {
      //           // const argumentValueType = Typescript.isTypeReferenceNode(someArgumentNode) && someArgumentNode || null

      //           return {
      //             nodeKind: 'general',
      //             nodeResolvedType: schemaTypeChecker.getTypeAtLocation(
      //               someArgumentNode,
      //             ),
      //           };
      //         },
      //       ),
      //     }
      //     : propertyElementSourceSymbol &&
      //         propertyElementSourceSymbol.name !==
      //           propertyElementType.symbol.name
      //     ? {
      //       nodeKind: 'aliasReference',
      //       nodeResolvedType: propertyElementType,
      //       nodeSourceSymbol: propertyElementSourceSymbol,
      //     }
      //     : {
      //       nodeKind: 'general',
      //       nodeResolvedType: propertyElementType,
      //     };
      //   const propertySourceTypeNode = someTypeProperty.valueDeclaration &&
      //   Typescript.isPropertySignature(
      //     someTypeProperty.valueDeclaration,
      //   ) && someTypeProperty.valueDeclaration.type ||
      // throwInvalidPathError('propertySourceTypeNode')
      modelPropertiesResult[propertyKey] = {
        propertyKey,
        propertyElement: deriveSchemaElement({
          elementCases,
          schemaTypeChecker,
          schemaResult,
          elementNode: someTypeProperty.valueDeclaration &&
              Typescript.isPropertySignature(
                someTypeProperty.valueDeclaration,
              ) && someTypeProperty.valueDeclaration.type ||
            throwInvalidPathError('propertyElementNode'),
          // astContext: [
          //   ...astContext,
          //   {
          //     astNodeKind: 'propertyElement',
          //     astNodeTypeNode: propertySourceTypeNode,
          //     propertyKey,
          //   },
          // ],
        }),
      };
      return modelPropertiesResult;
    },
    {},
  );
}
