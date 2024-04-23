import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
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
  SomeElementKind extends string,
  SomeSchemaElement extends __SchemaElement<SomeElementKind>,
  ThisUniqueElementCases extends [
    ElementCaseHandler<SomeElementKind, SomeSchemaElement>,
    ...Array<ElementCaseHandler<SomeElementKind, SomeSchemaElement>>,
  ] | [],
> {
  uniqueElementCases: ThisUniqueElementCases;
}

function __getElementCases<
  SomeElementKind extends string,
  SomeSchemaElement extends __SchemaElement<SomeElementKind>,
  ThisUniqueElementCases extends [
    ElementCaseHandler<SomeElementKind, SomeSchemaElement>,
    ...Array<ElementCaseHandler<SomeElementKind, SomeSchemaElement>>,
  ] | [],
>(
  api: __GetElementCasesApi<
    SomeElementKind,
    SomeSchemaElement,
    ThisUniqueElementCases
  >,
) {
  const { uniqueElementCases } = api;
  return getExtendedTuple([
    elementCase(
      ({ elementNode, schemaTypeChecker }) =>
        Typescript.isLiteralTypeNode(elementNode) &&
          elementNode.literal.kind ===
            (Typescript.SyntaxKind.TrueKeyword ||
              Typescript.SyntaxKind.FalseKeyword)
          ? ({
            elementKind: 'booleanLiteral',
            literalSymbol: schemaTypeChecker.typeToString(
              schemaTypeChecker.getTypeAtLocation(elementNode),
            ),
          })
          : null,
    ),
    elementCase(({ elementNode, schemaTypeChecker }) =>
      Typescript.isLiteralTypeNode(elementNode) &&
        Typescript.isNumericLiteral(elementNode.literal)
        ? ({
          elementKind: 'numberLiteral',
          literalSymbol: schemaTypeChecker.typeToString(
            schemaTypeChecker.getTypeAtLocation(elementNode),
          ),
        })
        : null
    ),
    elementCase(({ elementNode, schemaTypeChecker }) =>
      Typescript.isLiteralTypeNode(elementNode) &&
        Typescript.isStringLiteral(elementNode.literal)
        ? ({
          elementKind: 'stringLiteral',
          literalSymbol: schemaTypeChecker.typeToString(
            schemaTypeChecker.getTypeAtLocation(elementNode),
          ),
        })
        : null
    ),
    elementCase(({ elementNode }) =>
      elementNode.kind === Typescript.SyntaxKind.BooleanKeyword
        ? { elementKind: 'booleanPrimitive' }
        : null
    ),
    elementCase(({ elementNode }) =>
      elementNode.kind === Typescript.SyntaxKind.NumberKeyword
        ? { elementKind: 'numberPrimitive' }
        : null
    ),
    elementCase(({ elementNode }) =>
      elementNode.kind === Typescript.SyntaxKind.StringKeyword
        ? { elementKind: 'stringPrimitive' }
        : null
    ),
    elementCase(({ sourceElementSymbol, schemaTypeChecker, schemaResult }) => {
      if (
        sourceElementSymbol &&
        sourceElementSymbol.declarations &&
        sourceElementSymbol.declarations[0] &&
        Typescript.isInterfaceDeclaration(
          sourceElementSymbol.declarations[0],
        )
      ) {
        const elementDataModel = deriveDataModel({
          schemaTypeChecker,
          schemaResult,
          modelSymbol: sourceElementSymbol,
        });
        return {
          elementKind: 'dataModelReference',
          dataModelNameKey: elementDataModel.modelName,
        };
      }
      return null;
    }),
    elementCase(({ sourceElementSymbol, elementNode }) => {
      if (
        sourceElementSymbol &&
        sourceElementSymbol.declarations &&
        sourceElementSymbol.declarations[0] &&
        Typescript.isTypeAliasDeclaration(
          sourceElementSymbol.declarations[0],
        ) &&
        Typescript.isTypeReferenceNode(elementNode) &&
        elementNode.typeArguments === undefined
      ) {
        // todo deriveIntermediateAlias
        return {
          elementKind: 'aliasReference',
          aliasNameKey: sourceElementSymbol.name,
        };
      }
      return null;
    }),
    elementCase(
      (
        {
          sourceElementSymbol,
          elementNode,
          elementCases,
          schemaTypeChecker,
          schemaResult,
        },
      ) => {
        if (
          sourceElementSymbol &&
          sourceElementSymbol.name === 'VerdeTable' &&
          sourceElementSymbol.declarations &&
          sourceElementSymbol.declarations[0] &&
          Typescript.isTypeAliasDeclaration(
            sourceElementSymbol.declarations[0],
          ) &&
          Typescript.isTypeReferenceNode(elementNode) &&
          elementNode.typeArguments &&
          elementNode.typeArguments[0] &&
          elementNode.typeArguments.length === 1
        ) {
          return {
            elementKind: 'verdeTable',
            collectionElement: deriveSchemaElement<any>({
              elementCases: elementCases,
              schemaTypeChecker,
              schemaResult,
              elementNode: elementNode.typeArguments[0],
            }),
          };
        }
        return null;
      },
    ),
    elementCase(
      (
        {
          sourceElementSymbol,
          elementNode,
          elementCases,
          schemaTypeChecker,
          schemaResult,
        },
      ) => {
        if (
          sourceElementSymbol &&
          sourceElementSymbol.name === 'VerdeArray' &&
          sourceElementSymbol.declarations &&
          sourceElementSymbol.declarations[0] &&
          Typescript.isTypeAliasDeclaration(
            sourceElementSymbol.declarations[0],
          ) &&
          Typescript.isTypeReferenceNode(elementNode) &&
          elementNode.typeArguments &&
          elementNode.typeArguments[0] &&
          elementNode.typeArguments.length === 1
        ) {
          return {
            elementKind: 'verdeArray',
            collectionElement: deriveSchemaElement<any>({
              elementCases,
              schemaTypeChecker,
              schemaResult,
              elementNode: elementNode.typeArguments[0],
            }),
          };
        }
        return null;
      },
    ),
    
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

export type ElementCaseHandler<
  ThisElementKind extends string,
  ThisSchemaElement extends __SchemaElement<ThisElementKind>,
> = (api: ElementCaseHandlerApi) => ThisSchemaElement | null;

interface ElementCaseHandlerApi extends
  Pick<
    DeriveSchemaElementApi<irrelevantAny, Typescript.Node>,
    'elementCases' | 'schemaTypeChecker' | 'schemaResult' | 'elementNode'
  > // | 'astContext'
{
  sourceElementSymbol: Typescript.Symbol | null;
}

function elementCase<
  ThisElementKind extends string,
  ThisSchemaElement extends __SchemaElement<ThisElementKind>,
>(
  thisElementCaseHandler: ElementCaseHandler<
    ThisElementKind,
    ThisSchemaElement
  >,
) {
  return thisElementCaseHandler;
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
