import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GeneralElementTypescriptType,
  TypeReferenceElementTypescriptType,
} from '../../types/AugmentedTypescriptType.ts';
import { ElementTypescriptType } from '../../types/AugmentedTypescriptType.ts';
import {
  GetThisIntermediateElement,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __SchemaElement } from '../../types/SchemaElement.ts';
import {
  isBooleanLiteralType,
  isBooleanType,
  isContrainedParameterType,
  isInterfaceType,
  isNumberLiteralType,
  isNumberType,
  isParameterType,
  isStringLiteralType,
  isStringType,
  isTypeReference,
} from '../helpers/typeguards.ts';
import { deriveDataModel } from './__deriveIntermediateModel.ts';
import { DeriveModelElementApi } from './deriveModelElement.ts';

export function getDefinitiveElementTypeCases() {
  return __getElementTypeCases({
    uniqueElementTypeCases: [],
  });
}

export function getGenericElementTypeCases() {
  return __getElementTypeCases({
    uniqueElementTypeCases: [
      elementTypeCase({
        assertCase: (
          someElementType,
        ): someElementType is GeneralElementTypescriptType<
          Typescript.TypeParameter
        > => isContrainedParameterType(someElementType.typeResolved),
        handleCase: ({ elementType }) => ({
          elementKind: 'constrainedParameter',
          parameterSymbol: elementType.typeResolved.symbol.name,
        }),
      }),
      elementTypeCase({
        assertCase: (
          someElementType,
        ): someElementType is GeneralElementTypescriptType<
          Typescript.TypeParameter
        > => isParameterType(someElementType.typeResolved),
        handleCase: ({ elementType }) => ({
          elementKind: 'basicParameter',
          parameterSymbol: elementType.typeResolved.symbol.name,
        }),
      }),
    ],
  });
}

interface __GetElementTypeCasesApi<
  SomeUniqueModelElement extends __SchemaElement<string>,
  SomeTypescriptType extends Typescript.Type,
  SomeUniqueElementType extends ElementTypescriptType<SomeTypescriptType>,
  ThisUniqueElementTypeCases extends [
    ElementTypeCase<
      SomeUniqueModelElement,
      SomeTypescriptType,
      SomeUniqueElementType
    >,
    ...Array<
      ElementTypeCase<
        SomeUniqueModelElement,
        SomeTypescriptType,
        SomeUniqueElementType
      >
    >,
  ] | [],
> {
  uniqueElementTypeCases: ThisUniqueElementTypeCases;
}

function __getElementTypeCases<
  SomeUniqueModelKind extends string,
  SomeUniqueModelElement extends __SchemaElement<SomeUniqueModelKind>,
  SomeTypescriptType extends Typescript.Type,
  SomeUniqueElementType extends ElementTypescriptType<SomeTypescriptType>,
  SomeElementTypeCase extends ElementTypeCase<
    SomeUniqueModelElement,
    SomeTypescriptType,
    SomeUniqueElementType
  >,
  ThisUniqueElementTypeCases extends [
    SomeElementTypeCase,
    ...Array<SomeElementTypeCase>,
  ] | [],
>(
  api: __GetElementTypeCasesApi<
    SomeUniqueModelElement,
    SomeTypescriptType,
    SomeUniqueElementType,
    ThisUniqueElementTypeCases
  >,
) {
  const { uniqueElementTypeCases } = api;
  return getExtendedTuple([
    elementTypeCase({
      assertCase: (
        someType,
      ): someType is GeneralElementTypescriptType<Typescript.StringLiteralType> =>
        isStringLiteralType(someType.typeResolved),
      handleCase: ({ schemaTypeChecker, elementType }) => ({
        elementKind: 'stringLiteral',
        literalSymbol: schemaTypeChecker.typeToString(elementType.typeResolved),
      }),
    }),
    elementTypeCase({
      assertCase: (
        someType,
      ): someType is GeneralElementTypescriptType<Typescript.NumberLiteralType> =>
        isNumberLiteralType(someType.typeResolved)
      handleCase: ({ schemaTypeChecker, elementType }) => ({
        elementKind: 'numberLiteral',
        literalSymbol: schemaTypeChecker.typeToString(elementType.typeResolved),
      }),
    }),
    elementTypeCase({
      assertCase: isBooleanLiteralType,
      handleCase: ({ schemaTypeChecker, elementType }) => ({
        elementKind: 'booleanLiteral',
        literalSymbol: schemaTypeChecker.typeToString(elementType.typeResolved),
      }),
    }),
    elementTypeCase({
      assertCase: isStringType,
      handleCase: () => ({
        elementKind: 'stringPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: isNumberType,
      handleCase: () => ({
        elementKind: 'numberPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: isBooleanType,
      handleCase: () => ({
        elementKind: 'booleanPrimitive',
      }),
    }),
    // typeReference needs to be checked before dataModelReference
    elementTypeCase({
      assertCase: (
        someType,
      ): someType is TypeReferenceElementTypescriptType<Typescript.Type> =>
        someType.typeKind === 'typeReference',
      handleCase: ({ elementType }) => {
        return {
          elementKind: 'typeReference',
          typeSymbolKey: elementType.typeSourceSymbol.name,
        };
      },
    }),
    elementTypeCase({
      assertCase: isInterfaceType,
      handleCase: (
        {
          schemaTypeChecker,
          schemaResult,
          elementType,
        },
      ) => {
        const elementDataModel = deriveDataModel({
          schemaTypeChecker,
          schemaResult,
          someDataModelType: elementType.typeResolved,
        });
        return {
          elementKind: 'dataModelReference',
          dataModelSymbolKey: elementDataModel.modelSymbol,
        };
      },
    }),
    // elementTypeCase({
    //   assertCase: (someType): someType is Typescript.Type => false,
    //   handleCase: () => {
    //     return {
    //       elementKind: 'verdeTable',
    //       collectionElement: todo
    //     }
    //   }
    // }),
    // elementTypeCase({
    //   assertCase: (someType): someType is Typescript.Type => false,
    //   handleCase: () => {
    //     return {
    //       elementKind: 'verdeArray',
    //       collectionElement: todo
    //     }
    //   }
    // }),
    // elementTypeCase({
    //   assertCase: (someType): someType is Typescript.Type => false,
    //   handleCase: () => {
    //     return {
    //       elementKind: 'union',
    //       unionMembers: {todo}
    //     }
    //   }
    // }),
    // elementTypeCase({
    //   assertCase: (someType): someType is Typescript.Type => false,
    //   handleCase: () => {
    //     return {
    //       elementKind: 'object',
    //       structureProperties: {todo}
    //     }
    //   }
    // }),
    // elementTypeCase({
    //   assertCase: (someType): someType is Typescript.Type => false,
    //   handleCase: () => {
    //     return {
    //       elementKind: 'tuple',
    //       structureProperties: {todo}
    //     }
    //   }
    // })
  ], uniqueElementTypeCases);
}

export interface ElementTypeCase<
  ThisModelElement extends __SchemaElement<string>,
  ThisTypeResolved extends Typescript.Type,
  ThisElementTypescriptType extends ElementTypescriptType<ThisTypeResolved>,
> {
  assertCase: (
    elementType: ElementTypescriptType<Typescript.Type>,
  ) => elementType is ThisElementTypescriptType;
  handleCase: (
    api: ElementTypeCaseHandlerApi<ThisElementTypescriptType>,
  ) => ThisModelElement;
}

interface ElementTypeCaseHandlerApi<ThisElementTypescriptType> extends
  Pick<
    DeriveModelElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaResult'
  > {
  elementType: ThisElementTypescriptType;
}

function getExtendedTuple<
  ThisCoreTuple extends [genericAny, ...Array<genericAny>],
  ThisExtensionTuple extends [genericAny, ...Array<genericAny>] | [],
>(
  thisCoreTuple: ThisCoreTuple,
  thisExtensionTuple: ThisExtensionTuple,
): [...ThisCoreTuple, ...ThisExtensionTuple] {
  return [...thisCoreTuple, ...thisExtensionTuple];
}

function elementTypeCase<
  ThisModelElement extends GetThisIntermediateElement<
    keyof IntermediateSchema['schemaModels']
  >,
  ThisTypeResolved extends Typescript.Type,
  ThisElementTypescriptType extends ElementTypescriptType<ThisTypeResolved>,
>(
  thisElementTypeCase: ElementTypeCase<
    ThisModelElement,
    ThisTypeResolved,
    ThisElementTypescriptType
  >,
) {
  return thisElementTypeCase;
}

export type VerifiedElementTypeCases<
  TargetElementTypeCase extends ElementTypeCase<
    genericAny,
    genericAny,
    genericAny
  >,
  ThisElementTypeCases extends Array<
    ElementTypeCase<genericAny, genericAny, genericAny>
  >,
> = VerifyElementTypeCases<
  TargetElementTypeCase,
  ThisElementTypeCases,
  []
>;

type VerifyElementTypeCases<
  TargetElementTypeCase extends ElementTypeCase<
    genericAny,
    genericAny,
    genericAny
  >,
  CurrentElementTypeCases extends Array<genericAny>,
  ResultElementTypeCases extends Array<
    CurrentElementTypeCases[number]
  >,
> = TargetElementTypeCase extends
  ElementTypeCase<infer TargetModelElement, infer TargetElementType>
  ? CurrentElementTypeCases extends
    [infer CurrentElementTypeCase, ...infer RemainingElementTypeCases]
    ? CurrentElementTypeCase extends
      ElementTypeCase<infer CurrentModelElement, infer CurrentElementType>
      ? CurrentModelElement extends TargetModelElement
        ? CurrentElementType extends TargetElementType ? VerifyElementTypeCases<
            TargetElementTypeCase,
            RemainingElementTypeCases,
            [
              ...ResultElementTypeCases,
              CurrentElementTypeCase,
            ]
          >
        : never
      : never
    : never
  : ResultElementTypeCases
  : never;
