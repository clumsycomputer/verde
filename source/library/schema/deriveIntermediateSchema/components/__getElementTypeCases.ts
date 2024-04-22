import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GetThisIntermediateElement,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __SchemaElement } from '../../types/SchemaElement.ts';
import { DeriveSchemaElementApi } from './deriveSchemaElement.ts';

export function getDefinitiveElementCases() {
  return __getElementCases({
    uniqueElementCases: [],
  });
}

interface __GetElementCasesApi<
  SomeSchemaElement extends __SchemaElement<string>,
  SomeElementNode extends Typescript.Node,
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

function __getElementCases<
  SomeElementKind extends string,
  SomeSchemaElement extends __SchemaElement<SomeElementKind>,
  SomeElementNode extends Typescript.Node,
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
    // elementTypeCase({
    //   assertCase: (
    //     someElementNode,
    //   ): someElementNode is TypeFunctionElementNode<Typescript.Type> =>
    //     someElementNode.nodeKind === 'typeFunction' &&
    //     someElementNode.nodeSourceSymbol.name === 'VerdeTable',
    //   // && someElementNode.nodeTypeArguments.length === 1,
    //   handleCase: (
    //     {
    //       elementCases,
    //       schemaTypeChecker,
    //       schemaResult,
    //       astContext,
    //       elementNode,
    //     },
    //   ) => {
    //     return {
    //       elementKind: 'verdeTable',
    //       collectionElement: deriveSchemaElement<any>({
    //         elementCases,
    //         schemaTypeChecker,
    //         schemaResult,
    //         elementNode: elementNode.nodeTypeArguments[0]!,
    //         astContext: [
    //           ...astContext,
    //           {
    //             astNodeKind: 'collectionElement',
    //             astNodeTypeNode: elementNode.nodeTypeArguments[0]!
    //           }
    //         ],
    //       }),
    //     };
    //   },
    // }),
    // elementTypeCase({
    //   assertCase: (
    //     someElementNode,
    //   ): someElementNode is AliasReferenceElementNode<Typescript.Type> =>
    //     someElementNode.nodeKind === 'aliasReference',
    //   handleCase: ({ elementNode }) => {
    //     // todo deriveIntermediateAlias
    //     return {
    //       elementKind: 'aliasReference',
    //       aliasSymbolKey: elementNode.nodeSourceSymbol.name,
    //     };
    //   },
    // }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is Typescript.Node =>
        Typescript.isLiteralTypeNode(someElementNode) &&
        someElementNode.literal.kind ===
          (Typescript.SyntaxKind.TrueKeyword ||
            Typescript.SyntaxKind.FalseKeyword),
      handleCase: ({ schemaTypeChecker, elementNode }) => ({
        elementKind: 'booleanLiteral',
        literalSymbol: schemaTypeChecker.typeToString(
          schemaTypeChecker.getTypeAtLocation(elementNode),
        ),
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is Typescript.NumericLiteral =>
        Typescript.isLiteralTypeNode(someElementNode) &&
        Typescript.isNumericLiteral(someElementNode.literal),
      handleCase: ({ schemaTypeChecker, elementNode }) => ({
        elementKind: 'numberLiteral',
        literalSymbol: schemaTypeChecker.typeToString(
          schemaTypeChecker.getTypeAtLocation(elementNode),
        ),
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is Typescript.StringLiteral =>
        Typescript.isLiteralTypeNode(someElementNode) &&
        Typescript.isStringLiteral(someElementNode.literal),
      handleCase: ({ schemaTypeChecker, elementNode }) => ({
        elementKind: 'stringLiteral',
        literalSymbol: schemaTypeChecker.typeToString(
          schemaTypeChecker.getTypeAtLocation(elementNode),
        ),
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is Typescript.KeywordTypeNode => 
        someElementNode.kind === Typescript.SyntaxKind.BooleanKeyword,
      handleCase: () => ({
        elementKind: 'booleanPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is Typescript.KeywordTypeNode =>
        someElementNode.kind === Typescript.SyntaxKind.NumberKeyword,
      handleCase: () => ({
        elementKind: 'numberPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: (
        someElementNode,
      ): someElementNode is Typescript.KeywordTypeNode =>
        someElementNode.kind === Typescript.SyntaxKind.StringKeyword,
      handleCase: () => ({
        elementKind: 'stringPrimitive',
      }),
    }),
    // elementTypeCase({
    //   assertCase: (
    //     someElementNode,
    //   ): someElementNode is GeneralElementNode<Typescript.InterfaceType> =>
    //     isInterfaceType(someElementNode.nodeResolvedType),
    //   handleCase: (
    //     {
    //       schemaTypeChecker,
    //       schemaResult,
    //       elementNode,
    //     },
    //   ) => {
    //     const elementDataModel = deriveDataModel({
    //       schemaTypeChecker,
    //       schemaResult,
    //       dataModelType: elementNode.nodeResolvedType,
    //     });
    //     return {
    //       elementKind: 'dataModelReference',
    //       dataModelSymbolKey: elementDataModel.modelSymbol,
    //     };
    //   },
    // }),
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
  ThisElementNode extends Typescript.Node,
> {
  assertCase: (
    elementNode: Typescript.Node,
  ) => elementNode is ThisElementNode;
  handleCase: (
    api: ElementCaseHandlerApi<ThisElementNode>,
  ) => ThisSchemaElement;
}

interface ElementCaseHandlerApi<ThisElementNode> extends
  Pick<
    DeriveSchemaElementApi<irrelevantAny>,
    'elementCases' | 'schemaTypeChecker' | 'schemaResult'
  > // | 'astContext'
{
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
  ThisElementNode extends Typescript.Node,
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
