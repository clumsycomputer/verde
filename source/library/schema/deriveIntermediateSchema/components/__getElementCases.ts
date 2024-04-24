import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  __SchemaElement,
  BasicParameterElement,
  ObjectStructureElement,
  TerminalElement,
  TupleStructureElement,
} from '../../types/SchemaElement.ts';
import { deriveDataModel } from './__deriveIntermediateModel.ts';
import {
  deriveSchemaElement,
  DeriveSchemaElementApi,
} from './deriveSchemaElement.ts';

export function getGenericElementCases() {
  return __getElementCases({
    uniqueElementCases: [
      elementCase(({ elementSourceDeclaration }) => {
        if (
          elementSourceDeclaration &&
          Typescript.isTypeParameterDeclaration(elementSourceDeclaration) &&
          elementSourceDeclaration.constraint === undefined
        ) {
          return {
            elementKind: 'basicParameter',
            parameterName: elementSourceDeclaration.name.text,
          };
        }
        return null;
      }),
      elementCase(({ elementSourceDeclaration }) => {
        if (
          elementSourceDeclaration &&
          Typescript.isTypeParameterDeclaration(elementSourceDeclaration) &&
          elementSourceDeclaration.constraint
        ) {
          return {
            elementKind: 'constrainedParameter',
            parameterName: elementSourceDeclaration.name.text,
          };
        }
        return null;
      }),
    ],
  });
}

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
      ({ elementLocalNode, schemaTypeChecker }) =>
        Typescript.isLiteralTypeNode(elementLocalNode) &&
          elementLocalNode.literal.kind ===
            (Typescript.SyntaxKind.TrueKeyword ||
              Typescript.SyntaxKind.FalseKeyword)
          ? ({
            elementKind: 'booleanLiteral',
            literalSymbol: schemaTypeChecker.typeToString(
              schemaTypeChecker.getTypeAtLocation(elementLocalNode),
            ),
          })
          : null,
    ),
    elementCase(({ elementLocalNode, schemaTypeChecker }) =>
      Typescript.isLiteralTypeNode(elementLocalNode) &&
        Typescript.isNumericLiteral(elementLocalNode.literal)
        ? ({
          elementKind: 'numberLiteral',
          literalSymbol: schemaTypeChecker.typeToString(
            schemaTypeChecker.getTypeAtLocation(elementLocalNode),
          ),
        })
        : null
    ),
    elementCase(({ elementLocalNode, schemaTypeChecker }) =>
      Typescript.isLiteralTypeNode(elementLocalNode) &&
        Typescript.isStringLiteral(elementLocalNode.literal)
        ? ({
          elementKind: 'stringLiteral',
          literalSymbol: schemaTypeChecker.typeToString(
            schemaTypeChecker.getTypeAtLocation(elementLocalNode),
          ),
        })
        : null
    ),
    elementCase(({ elementLocalNode }) =>
      elementLocalNode.kind === Typescript.SyntaxKind.BooleanKeyword
        ? { elementKind: 'booleanPrimitive' }
        : null
    ),
    elementCase(({ elementLocalNode }) =>
      elementLocalNode.kind === Typescript.SyntaxKind.NumberKeyword
        ? { elementKind: 'numberPrimitive' }
        : null
    ),
    elementCase(({ elementLocalNode }) =>
      elementLocalNode.kind === Typescript.SyntaxKind.StringKeyword
        ? { elementKind: 'stringPrimitive' }
        : null
    ),
    elementCase(
      ({ elementSourceDeclaration, schemaTypeChecker, schemaResult }) => {
        if (
          elementSourceDeclaration &&
          Typescript.isInterfaceDeclaration(elementSourceDeclaration)
        ) {
          const elementDataModel = deriveDataModel({
            schemaTypeChecker,
            schemaResult,
            modelDeclaration: elementSourceDeclaration,
          });
          return {
            elementKind: 'dataModelReference',
            dataModelNameKey: elementDataModel.modelName,
          };
        }
        return null;
      },
    ),
    elementCase(({ elementSourceDeclaration, elementLocalNode }) => {
      if (
        elementSourceDeclaration &&
        Typescript.isTypeAliasDeclaration(elementSourceDeclaration) &&
        Typescript.isTypeReferenceNode(elementLocalNode) &&
        elementLocalNode.typeArguments === undefined
      ) {
        // todo deriveIntermediateAlias
        return {
          elementKind: 'aliasReference',
          aliasNameKey: elementSourceDeclaration.name.text,
        };
      }
      return null;
    }),
    elementCase(
      (
        {
          elementSourceDeclaration,
          elementLocalNode,
          elementCases,
          schemaTypeChecker,
          schemaResult,
        },
      ) => {
        if (
          elementSourceDeclaration &&
          Typescript.isTypeAliasDeclaration(elementSourceDeclaration) &&
          elementSourceDeclaration.name.text === 'VerdeTable' &&
          Typescript.isTypeReferenceNode(elementLocalNode) &&
          elementLocalNode.typeArguments &&
          elementLocalNode.typeArguments[0] &&
          elementLocalNode.typeArguments.length === 1
        ) {
          return {
            elementKind: 'verdeTable',
            collectionElement: deriveSchemaElement<any>({
              elementCases: elementCases,
              schemaTypeChecker,
              schemaResult,
              elementLocalNode: elementLocalNode.typeArguments[0],
            }),
          };
        }
        return null;
      },
    ),
    elementCase(
      (
        {
          elementSourceDeclaration,
          elementLocalNode,
          elementCases,
          schemaTypeChecker,
          schemaResult,
        },
      ) => {
        if (
          elementSourceDeclaration &&
          Typescript.isTypeAliasDeclaration(elementSourceDeclaration) &&
          elementSourceDeclaration.name.text === 'VerdeArray' &&
          Typescript.isTypeReferenceNode(elementLocalNode) &&
          elementLocalNode.typeArguments &&
          elementLocalNode.typeArguments[0] &&
          elementLocalNode.typeArguments.length === 1
        ) {
          return {
            elementKind: 'verdeArray',
            collectionElement: deriveSchemaElement<any>({
              elementCases,
              schemaTypeChecker,
              schemaResult,
              elementLocalNode: elementLocalNode.typeArguments[0],
            }),
          };
        }
        return null;
      },
    ),
    elementCase(
      ({ elementLocalNode, elementCases, schemaTypeChecker, schemaResult }) => {
        if (Typescript.isTypeLiteralNode(elementLocalNode)) {
          return {
            elementKind: 'objectStructure',
            structureProperties: elementLocalNode.members.reduce<
              ObjectStructureElement<
                TerminalElement<any>
              >['structureProperties']
            >(
              (objectPropertyElementsResult, someObjectPropertyNode) => {
                if (
                  Typescript.isPropertySignature(someObjectPropertyNode) &&
                  Typescript.isIdentifier(someObjectPropertyNode.name) &&
                  someObjectPropertyNode.type
                ) {
                  const objectPropertyKey = someObjectPropertyNode.name.text;
                  objectPropertyElementsResult[objectPropertyKey] = {
                    propertyKey: objectPropertyKey,
                    propertyElement: deriveSchemaElement({
                      elementCases,
                      schemaTypeChecker,
                      schemaResult,
                      elementLocalNode: someObjectPropertyNode.type,
                    }),
                  };
                }
                return objectPropertyElementsResult;
              },
              {},
            ),
          };
        }
        return null;
      },
    ),
    elementCase(
      ({ elementLocalNode, elementCases, schemaTypeChecker, schemaResult }) => {
        if (Typescript.isTupleTypeNode(elementLocalNode)) {
          return {
            elementKind: 'tupleStructure',
            structureProperties: elementLocalNode.elements.reduce<
              TupleStructureElement<
                TerminalElement<any>
              >['structureProperties']
            >(
              (
                tuplePropertyElementsResult,
                someTuplePropertyNode,
                tuplePropertyIndex,
              ) => {
                if (Typescript.isNamedTupleMember(someTuplePropertyNode)) {
                  const tuplePropertyKey = someTuplePropertyNode.name.text;
                  tuplePropertyElementsResult[tuplePropertyKey] = {
                    propertyIndex: tuplePropertyIndex,
                    propertyKey: tuplePropertyKey,
                    propertyElement: deriveSchemaElement({
                      elementCases,
                      schemaTypeChecker,
                      schemaResult,
                      elementLocalNode: someTuplePropertyNode.type,
                    }),
                  };
                }
                return tuplePropertyElementsResult;
              },
              {},
            ),
          };
        }
        return null;
      },
    ),
    elementCase(
      ({ elementLocalNode, elementCases, schemaTypeChecker, schemaResult }) => {
        if (Typescript.isUnionTypeNode(elementLocalNode)) {
          return ({
            elementKind: 'unionComposition',
            unionMembers: elementLocalNode.types.map((someUnionMemberNode) =>
              deriveSchemaElement<any>({
                elementCases,
                schemaTypeChecker,
                schemaResult,
                elementLocalNode: someUnionMemberNode,
              })
            ),
          });
        }
        return null;
      },
    ),
    elementCase<string, any>(({ elementLocalNode }) =>
      Typescript.isLiteralTypeNode(elementLocalNode) &&
        elementLocalNode.literal.kind === Typescript.SyntaxKind.NullKeyword
        ? { elementKind: 'null' }
        : null
    ),
  ], uniqueElementCases);
}

export type ElementCaseHandler<
  ThisElementKind extends string,
  ThisSchemaElement extends __SchemaElement<ThisElementKind>,
> = (api: ElementCaseHandlerApi) => ThisSchemaElement | null;

interface ElementCaseHandlerApi extends
  Pick<
    DeriveSchemaElementApi<irrelevantAny, Typescript.Node>,
    'elementCases' | 'schemaTypeChecker' | 'schemaResult' | 'elementLocalNode'
  > // | 'astContext'
{
  elementSourceDeclaration: Typescript.Declaration | null;
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
