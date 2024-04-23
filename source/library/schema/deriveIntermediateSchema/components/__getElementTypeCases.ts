import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GetThisIntermediateElement,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { __SchemaElement } from '../../types/SchemaElement.ts';
import { deriveDataModel } from './__deriveIntermediateModel.ts';
import {
  deriveSchemaElement,
  DeriveSchemaElementApi,
} from './deriveSchemaElement.ts';

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
    elementTypeCase({
      assertCase: (
        elementNode,
      ): elementNode is Typescript.Node =>
        Typescript.isLiteralTypeNode(elementNode) &&
        elementNode.literal.kind ===
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
        elementNode,
      ): elementNode is Typescript.NumericLiteral =>
        Typescript.isLiteralTypeNode(elementNode) &&
        Typescript.isNumericLiteral(elementNode.literal),
      handleCase: ({ schemaTypeChecker, elementNode }) => ({
        elementKind: 'numberLiteral',
        literalSymbol: schemaTypeChecker.typeToString(
          schemaTypeChecker.getTypeAtLocation(elementNode),
        ),
      }),
    }),
    elementTypeCase({
      assertCase: (
        elementNode,
      ): elementNode is Typescript.StringLiteral =>
        Typescript.isLiteralTypeNode(elementNode) &&
        Typescript.isStringLiteral(elementNode.literal),
      handleCase: ({ schemaTypeChecker, elementNode }) => ({
        elementKind: 'stringLiteral',
        literalSymbol: schemaTypeChecker.typeToString(
          schemaTypeChecker.getTypeAtLocation(elementNode),
        ),
      }),
    }),
    elementTypeCase({
      assertCase: (
        elementNode,
      ): elementNode is Typescript.KeywordTypeNode =>
        elementNode.kind === Typescript.SyntaxKind.BooleanKeyword,
      handleCase: () => ({
        elementKind: 'booleanPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: (
        elementNode,
      ): elementNode is Typescript.KeywordTypeNode =>
        elementNode.kind === Typescript.SyntaxKind.NumberKeyword,
      handleCase: () => ({
        elementKind: 'numberPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: (
        elementNode,
      ): elementNode is Typescript.KeywordTypeNode =>
        elementNode.kind === Typescript.SyntaxKind.StringKeyword,
      handleCase: () => ({
        elementKind: 'stringPrimitive',
      }),
    }),
    elementTypeCase({
      assertCase: (
        elementNode,
        elementSymbol,
      ): elementNode is Typescript.TypeReferenceNode =>
        Boolean(
          // Typescript.isTypeReferenceNode(elementNode) &&
          elementSymbol &&
            elementSymbol.declarations &&
            Typescript.isInterfaceDeclaration(
              elementSymbol.declarations[0] ??
                throwInvalidPathError('elementSymbolDeclaration'),
            ),
        ),
      handleCase: (
        {
          schemaTypeChecker,
          schemaResult,
          elementSymbol,
        },
      ) => {
        const elementDataModel = deriveDataModel({
          schemaTypeChecker,
          schemaResult,
          modelSymbol: elementSymbol ??
            throwInvalidPathError('elementDataModelSymbol'),
        });
        return {
          elementKind: 'dataModelReference',
          dataModelNameKey: elementDataModel.modelName,
        };
      },
    }),
    elementTypeCase({
      assertCase: (
        elementNode,
        elementSymbol,
      ): elementNode is Typescript.TypeReferenceNode =>
        Boolean(
          elementSymbol && elementSymbol.declarations &&
            elementSymbol.declarations[0] &&
            Typescript.isTypeAliasDeclaration(
              elementSymbol.declarations[0],
            ) &&
            Typescript.isTypeReferenceNode(elementNode) &&
            elementNode.typeArguments === undefined,
        ),
      handleCase: ({ elementSymbol }) => {
        // todo deriveIntermediateAlias
        return {
          elementKind: 'aliasReference',
          aliasNameKey: elementSymbol && elementSymbol.name ||
            throwInvalidPathError('elementAliasSymbol'),
        };
      },
    }),
    elementTypeCase({
      assertCase: (
        elementNode,
        elementSymbol,
      ): elementNode is Typescript.TypeReferenceNode =>
        Boolean(
          elementSymbol && elementSymbol.name === 'VerdeTable' &&
            elementSymbol.declarations &&
            Typescript.isTypeAliasDeclaration(
              elementSymbol.declarations[0] ??
                throwInvalidPathError('elementSymbolDeclaration'),
            ) &&
            Typescript.isTypeReferenceNode(elementNode) &&
            elementNode.typeArguments &&
            elementNode.typeArguments.length === 1,
        ),
      handleCase: (
        { elementCases, schemaTypeChecker, schemaResult, elementNode },
      ) => {
        return {
          elementKind: 'verdeTable',
          collectionElement: deriveSchemaElement<any>({
            elementCases,
            schemaTypeChecker,
            schemaResult,
            elementNode:
              elementNode.typeArguments && elementNode.typeArguments[0] ||
              throwInvalidPathError('verdeTableElementNode'),
          }),
        };
      },
    }),
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
    elementSymbol: Typescript.Symbol | null,
  ) => elementNode is ThisElementNode;
  handleCase: (
    api: ElementCaseHandlerApi<ThisElementNode>,
  ) => ThisSchemaElement;
}

interface ElementCaseHandlerApi<ThisElementNode extends Typescript.Node>
  extends
    Pick<
      DeriveSchemaElementApi<irrelevantAny, ThisElementNode>,
      'elementCases' | 'schemaTypeChecker' | 'schemaResult' | 'elementNode'
    > // | 'astContext'
{
  elementSymbol: Typescript.Symbol | null;
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
