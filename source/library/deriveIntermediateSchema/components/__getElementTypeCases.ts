import { genericAny, irrelevantAny } from '../../../helpers/types.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import { GetThisIntermediateElement, IntermediateSchema } from '../../types/IntermediateSchema.ts';
import { ModelElementBase } from '../../types/StructuredSchema.ts';
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
        assertCase: isContrainedParameterType,
        handleCase: ({ someElementType }) => ({
          elementKind: 'constrainedParameter',
          parameterSymbol: someElementType.symbol.name,
        }),
      }),
      elementTypeCase({
        assertCase: isParameterType,
        handleCase: ({ someElementType }) => ({
          elementKind: 'basicParameter',
          parameterSymbol: someElementType.symbol.name,
        }),
      }),
    ],
  });
}

interface __GetElementTypeCasesApi<
  SomeUniqueModelElement extends ModelElementBase<string>,
  SomeUniqueElementType extends Typescript.Type,
  ThisUniqueElementTypeCases extends [
    ElementTypeCase<SomeUniqueModelElement, SomeUniqueElementType>,
    ...Array<ElementTypeCase<SomeUniqueModelElement, SomeUniqueElementType>>,
  ] | [],
> {
  uniqueElementTypeCases: ThisUniqueElementTypeCases;
}

function __getElementTypeCases<
  SomeUniqueModelKind extends string,
  SomeUniqueModelElement extends ModelElementBase<SomeUniqueModelKind>,
  SomeUniqueElementType extends Typescript.Type,
  SomeElementTypeCase extends ElementTypeCase<
    SomeUniqueModelElement,
    SomeUniqueElementType
  >,
  ThisUniqueElementTypeCases extends [
    SomeElementTypeCase,
    ...Array<SomeElementTypeCase>,
  ] | [],
>(
  api: __GetElementTypeCasesApi<
    SomeUniqueModelElement,
    SomeUniqueElementType,
    ThisUniqueElementTypeCases
  >,
) {
  const { uniqueElementTypeCases } = api;
  return getExtendedTuple([
    elementTypeCase({
      assertCase: isStringLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'stringLiteral',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    }),
    elementTypeCase({
      assertCase: isNumberLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'numberLiteral',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
      }),
    }),
    elementTypeCase({
      assertCase: isBooleanLiteralType,
      handleCase: ({ schemaTypeChecker, someElementType }) => ({
        elementKind: 'booleanLiteral',
        literalSymbol: schemaTypeChecker.typeToString(someElementType),
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
    elementTypeCase({
      assertCase: isInterfaceType,
      handleCase: (
        {
          schemaTypeChecker,
          schemaResult,
          someElementType,
        },
      ) => {
        const elementDataModel = deriveDataModel({
          schemaTypeChecker,
          schemaResult,
          someDataModelType: someElementType,
        });
        return {
          elementKind: 'dataModel',
          dataModelSymbolKey: elementDataModel.modelSymbolKey,
        };
      },
    }),
  ], uniqueElementTypeCases);
}

export interface ElementTypeCase<
  ThisModelElement extends ModelElementBase<string>,
  ThisElementType extends Typescript.Type,
> {
  assertCase: (
    someElementType: Typescript.Type,
  ) => someElementType is ThisElementType;
  handleCase: (
    api: ElementTypeCaseHandlerApi<ThisElementType>,
  ) => ThisModelElement;
}

interface ElementTypeCaseHandlerApi<ThisElementType> extends
  Pick<
    DeriveModelElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaResult'
  > {
  someElementType: ThisElementType;
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
    keyof IntermediateSchema['schemaMap']
  >,
  ThisElementType extends Typescript.Type,
>(thisElementTypeCase: ElementTypeCase<ThisModelElement, ThisElementType>) {
  return thisElementTypeCase;
}

export type VerifiedElementTypeCases<
  TargetElementTypeCase extends ElementTypeCase<genericAny, genericAny>,
  ThisElementTypeCases extends Array<ElementTypeCase<genericAny, genericAny>>,
> = VerifyElementTypeCases<
  TargetElementTypeCase,
  ThisElementTypeCases,
  []
>;

type VerifyElementTypeCases<
  TargetElementTypeCase extends ElementTypeCase<genericAny, genericAny>,
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
