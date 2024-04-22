import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import { AliasReferenceElementNode, ElementNode, GeneralElementNode } from '../../types/ElementNode.ts';
import {
  GetThisIntermediateElement,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __SchemaElement } from '../../types/SchemaElement.ts';
import {
  isBooleanLiteralType,
  isBooleanType,
  isInterfaceType,
  isNumberLiteralType,
  isNumberType,
  isStringLiteralType,
  isStringType,
} from '../helpers/typeguards.ts';
import { deriveDataModel } from './__deriveIntermediateModel.ts';
import { DeriveSchemaElementApi } from './deriveSchemaElement.ts';

export function getDefinitiveElementCases() {
  return __getElementTypeCases({
    uniqueElementCases: [],
  });
}

interface __GetElementCasesApi<
  SomeSchemaElement extends __SchemaElement<string>,
  SomeElementNode extends ElementNode<any>,
  ThisUniqueElementCases extends [
    ElementCase<
      SomeSchemaElement,
      SomeElementNode
    >,
    ...Array<
      ElementCase<
        SomeSchemaElement,
        SomeElementNode
      >
    >,
  ] | [],
> {
  uniqueElementCases: ThisUniqueElementCases;
}

function __getElementTypeCases<
  SomeElementKind extends string,
  SomeSchemaElement extends __SchemaElement<SomeElementKind>,
  SomeElementNode extends ElementNode<any>,
  SomeElementCase extends ElementCase<
    SomeSchemaElement,
    SomeElementNode
  >,
  ThisUniqueElementCases extends [
    SomeElementCase,
    ...Array<SomeElementCase>,
  ] | [],
>(
  api: __GetElementCasesApi<
    SomeSchemaElement,
    SomeElementNode,
    ThisUniqueElementCases
  >,
) {
  const { uniqueElementCases } = api;
  return getExtendedTuple([
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is AliasReferenceElementNode<Typescript.Type> =>
        someElementNode.nodeKind === 'aliasReference',
      handleCase: ({ elementNode }) => {
        return {
          elementKind: 'aliasReference',
          aliasSymbolKey: elementNode.nodeAliasSymbol.name,
        };
      },
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is GeneralElementNode<Typescript.Type> =>
        isBooleanLiteralType(someElementNode.nodeResolvedType),
      handleCase: ({ schemaTypeChecker, elementNode }) => ({
        elementKind: 'booleanLiteral',
        literalSymbol: schemaTypeChecker.typeToString(
          elementNode.nodeResolvedType,
        ),
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is GeneralElementNode<Typescript.NumberLiteralType> =>
        isNumberLiteralType(someElementNode.nodeResolvedType),
      handleCase: ({ schemaTypeChecker, elementNode }) => ({
        elementKind: 'numberLiteral',
        literalSymbol: schemaTypeChecker.typeToString(
          elementNode.nodeResolvedType,
        ),
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is GeneralElementNode<Typescript.StringLiteralType> =>
        isStringLiteralType(someElementNode.nodeResolvedType),
      handleCase: ({ schemaTypeChecker, elementNode }) => ({
        elementKind: 'stringLiteral',
        literalSymbol: schemaTypeChecker.typeToString(
          elementNode.nodeResolvedType,
        ),
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is GeneralElementNode<Typescript.Type> =>
        isBooleanType(someElementNode.nodeResolvedType),
      handleCase: () => ({
        elementKind: 'booleanPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is GeneralElementNode<Typescript.Type> =>
        isNumberType(someElementNode.nodeResolvedType),
      handleCase: () => ({
        elementKind: 'numberPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is GeneralElementNode<Typescript.Type> =>
        isStringType(someElementNode.nodeResolvedType),
      handleCase: () => ({
        elementKind: 'stringPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is GeneralElementNode<Typescript.InterfaceType> =>
        isInterfaceType(someElementNode.nodeResolvedType),
      handleCase: (
        {
          schemaTypeChecker,
          schemaResult,
          elementNode,
        },
      ) => {
        const elementDataModel = deriveDataModel({
          schemaTypeChecker,
          schemaResult,
          dataModelType: elementNode.nodeResolvedType,
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
  ], uniqueElementCases);
}

export interface ElementCase<
  ThisSchemaElement extends __SchemaElement<string>,
  ThisElementNode extends ElementNode<any>,
> {
  assertCase: (
    elementNode: ElementNode<Typescript.Type>,
  ) => elementNode is ThisElementNode;
  handleCase: (
    api: ElementCaseHandlerApi<ThisElementNode>,
  ) => ThisSchemaElement;
}

interface ElementCaseHandlerApi<ThisElementNode> extends
  Pick<
    DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaResult'
  > {
  elementNode: ThisElementNode;
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
  ThisSchemaElement extends GetThisIntermediateElement<
    keyof IntermediateSchema['schemaModels']
  >,
  ThisElementNode extends ElementNode<any>,
>(
  thisElementCase: ElementCase<
    ThisSchemaElement,
    ThisElementNode
  >,
) {
  return thisElementCase;
}

export type VerifiedElementCases<
  TargetElementCase extends ElementCase<
    genericAny,
    genericAny
  >,
  ThisElementCases extends Array<
    ElementCase<
      genericAny,
      genericAny
    >
  >,
> = VerifyElementCases<
  TargetElementCase,
  ThisElementCases,
  []
>;

type VerifyElementCases<
  TargetElementCase extends ElementCase<
    genericAny,
    genericAny
  >,
  CurrentElementCases extends Array<genericAny>,
  ResultElementCases extends Array<
    CurrentElementCases[number]
  >,
> = TargetElementCase extends ElementCase<
  infer TargetSchemaElement,
  infer TargetElementNode
>
  ? CurrentElementCases extends
    [infer CurrentElementCase, ...infer RemainingElementCases]
    ? CurrentElementCase extends ElementCase<
      infer CurrentSchemaElement,
      infer CurrentElementNode
    >
      ? CurrentSchemaElement extends TargetSchemaElement
        ? CurrentElementNode extends TargetElementNode ? VerifyElementCases<
            TargetElementCase,
            RemainingElementCases,
            [
              ...ResultElementCases,
              CurrentElementCase,
            ]
          >
        : never
      : never
    : never
  : ResultElementCases
  : never;
