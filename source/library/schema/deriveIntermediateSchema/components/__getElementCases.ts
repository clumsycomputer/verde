import { genericAny, irrelevantUnknown } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  __CollectionElement,
  __SchemaElement,
  __UnionElement,
  AliasReferenceElement,
  BooleanLiteralElement,
  BooleanPrimitiveElement,
  CoreUnionElement,
  DataModelReferenceElement,
  DataModelUnionElement,
  NullElement,
  NumberLiteralElement,
  NumberPrimitiveElement,
  ObjectStructureElement,
  ParameterReferenceElement,
  StringLiteralElement,
  StringPrimitiveElement,
  TerminalElement,
  TupleStructureElement,
  UnionCompositionElement,
  VerdeArrayElement,
  VerdeElement,
  VerdeTableElement,
} from '../../types/SchemaElement.ts';
import { VerdeTable } from '../../types/VerdeTypes.ts';
import { deriveDataModel } from './__deriveIntermediateModel.ts';
import {
  deriveSchemaElement,
  DeriveSchemaElementApi,
} from './deriveSchemaElement.ts';

export function getGenericElementCases() {
  return __getElementCases({
    uniqueElementCases: [
      elementCase<ParameterReferenceElement>(
        ({ elementSourceDeclaration }) => {
          if (
            elementSourceDeclaration &&
            Typescript.isTypeParameterDeclaration(elementSourceDeclaration)
          ) {
            return {
              elementKind: 'parameterReference',
              elementName: elementSourceDeclaration.name.text,
            };
          }
          return null;
        },
      ),
    ],
  });
}

export function getDefinitiveElementCases() {
  return __getElementCases({
    uniqueElementCases: [],
  });
}

interface __GetElementCasesApi<
  ThisUniqueElementCases extends [
    ElementCaseHandler<genericAny>,
    ...Array<ElementCaseHandler<genericAny>>,
  ] | [],
> {
  uniqueElementCases: ThisUniqueElementCases;
}

function __getElementCases<
  ThisUniqueElementCases extends [
    ElementCaseHandler<genericAny>,
    ...Array<ElementCaseHandler<genericAny>>,
  ] | [],
>(
  api: __GetElementCasesApi<ThisUniqueElementCases>,
) {
  const { uniqueElementCases } = api;
  return getExtendedTuple([
    elementCase<BooleanLiteralElement>(
      ({ elementLocalNode, schemaTypeChecker }) =>
        Typescript.isLiteralTypeNode(elementLocalNode) &&
          elementLocalNode.literal.kind ===
            (Typescript.SyntaxKind.TrueKeyword ||
              Typescript.SyntaxKind.FalseKeyword)
          ? ({
            elementKind: 'booleanLiteral',
            elementSymbol: schemaTypeChecker.typeToString(
              schemaTypeChecker.getTypeAtLocation(elementLocalNode),
            ),
          })
          : null,
    ),
    elementCase<NumberLiteralElement>((
      { elementLocalNode, schemaTypeChecker },
    ) =>
      Typescript.isLiteralTypeNode(elementLocalNode) &&
        Typescript.isNumericLiteral(elementLocalNode.literal)
        ? ({
          elementKind: 'numberLiteral',
          elementSymbol: schemaTypeChecker.typeToString(
            schemaTypeChecker.getTypeAtLocation(elementLocalNode),
          ),
        })
        : null
    ),
    elementCase<StringLiteralElement>((
      { elementLocalNode, schemaTypeChecker },
    ) =>
      Typescript.isLiteralTypeNode(elementLocalNode) &&
        Typescript.isStringLiteral(elementLocalNode.literal)
        ? ({
          elementKind: 'stringLiteral',
          elementSymbol: schemaTypeChecker.typeToString(
            schemaTypeChecker.getTypeAtLocation(elementLocalNode),
          ),
        })
        : null
    ),
    elementCase<BooleanPrimitiveElement>((
      { elementLocalNode },
    ) =>
      elementLocalNode.kind === Typescript.SyntaxKind.BooleanKeyword
        ? { elementKind: 'booleanPrimitive' }
        : null
    ),
    elementCase<NumberPrimitiveElement>((
      { elementLocalNode },
    ) =>
      elementLocalNode.kind === Typescript.SyntaxKind.NumberKeyword
        ? { elementKind: 'numberPrimitive' }
        : null
    ),
    elementCase<StringPrimitiveElement>((
      { elementLocalNode },
    ) =>
      elementLocalNode.kind === Typescript.SyntaxKind.StringKeyword
        ? { elementKind: 'stringPrimitive' }
        : null
    ),
    elementCase<DataModelReferenceElement>(
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
            elementName: elementDataModel.modelName,
          };
        }
        return null;
      },
    ),
    elementCase<AliasReferenceElement>(
      ({ elementSourceDeclaration, elementLocalNode }) => {
        if (
          elementSourceDeclaration &&
          Typescript.isTypeAliasDeclaration(elementSourceDeclaration) &&
          Typescript.isTypeReferenceNode(elementLocalNode) &&
          elementLocalNode.typeArguments === undefined
        ) {
          // todo deriveIntermediateAlias
          return {
            elementKind: 'aliasReference',
            elementName: elementSourceDeclaration.name.text,
          };
        }
        return null;
      },
    ),
    elementCase<VerdeTableElement<any>>(
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
            elementArguments: [deriveSchemaElement({
              elementCases: elementCases,
              schemaTypeChecker,
              schemaResult,
              elementLocalNode: elementLocalNode.typeArguments[0],
            })],
          };
        }
        return null;
      },
    ),
    elementCase<VerdeArrayElement<any>>(
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
            elementArguments: [deriveSchemaElement({
              elementCases,
              schemaTypeChecker,
              schemaResult,
              elementLocalNode: elementLocalNode.typeArguments[0],
            })],
          };
        }
        return null;
      },
    ),
    elementCase<ObjectStructureElement<any>>(
      ({ elementLocalNode, elementCases, schemaTypeChecker, schemaResult }) => {
        if (Typescript.isTypeLiteralNode(elementLocalNode)) {
          return {
            elementKind: 'objectStructure',
            elementProperties: elementLocalNode.members.reduce<
              ObjectStructureElement<
                TerminalElement<any>
              >['elementProperties']
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
    elementCase<TupleStructureElement<any>>(
      ({ elementLocalNode, elementCases, schemaTypeChecker, schemaResult }) => {
        if (Typescript.isTupleTypeNode(elementLocalNode)) {
          return {
            elementKind: 'tupleStructure',
            elementProperties: elementLocalNode.elements.reduce<
              TupleStructureElement<
                TerminalElement<any>
              >['elementProperties']
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
    elementCase<UnionCompositionElement<any>>(
      ({ elementLocalNode, elementCases, schemaTypeChecker, schemaResult }) => {
        if (Typescript.isUnionTypeNode(elementLocalNode)) {
          return ({
            elementKind: 'unionComposition',
            elementMembers: elementLocalNode.types.map((someUnionMemberNode) =>
              deriveSchemaElement({
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
    elementCase<NullElement>(({ elementLocalNode }) =>
      Typescript.isLiteralTypeNode(elementLocalNode) &&
        elementLocalNode.literal.kind === Typescript.SyntaxKind.NullKeyword
        ? { elementKind: 'null' }
        : null
    ),
  ], uniqueElementCases);
}

function getBasicTerminalElementCases() {
  return [
    booleanLiteralElementCase,
    numberLiteralElementCase,
    stringLiteralElementCase,
    booleanPrimitiveElementCase,
    numberPrimitiveElementCase,
    stringPrimitiveElementCase,
    dataModelReferenceElementCase,
    aliasReferenceElementCase,
  ];
}

function booleanLiteralElementCase(
  api: ElementCaseApi,
): ElementCaseResult<BooleanLiteralElement> {
  const { elementLocalNode, schemaTypeChecker } = api;
  return Typescript.isLiteralTypeNode(elementLocalNode) &&
      elementLocalNode.literal.kind ===
        (Typescript.SyntaxKind.TrueKeyword ||
          Typescript.SyntaxKind.FalseKeyword)
    ? ({
      elementKind: 'booleanLiteral',
      elementSymbol: schemaTypeChecker.typeToString(
        schemaTypeChecker.getTypeAtLocation(elementLocalNode),
      ),
    })
    : null;
}

function numberLiteralElementCase(
  api: ElementCaseApi,
): ElementCaseResult<NumberLiteralElement> {
  const { elementLocalNode, schemaTypeChecker } = api;
  return Typescript.isLiteralTypeNode(elementLocalNode) &&
      Typescript.isNumericLiteral(elementLocalNode.literal)
    ? ({
      elementKind: 'numberLiteral',
      elementSymbol: schemaTypeChecker.typeToString(
        schemaTypeChecker.getTypeAtLocation(elementLocalNode),
      ),
    })
    : null;
}

function stringLiteralElementCase(
  api: ElementCaseApi,
): ElementCaseResult<StringLiteralElement> {
  const { elementLocalNode, schemaTypeChecker } = api;
  return Typescript.isLiteralTypeNode(elementLocalNode) &&
      Typescript.isStringLiteral(elementLocalNode.literal)
    ? ({
      elementKind: 'stringLiteral',
      elementSymbol: schemaTypeChecker.typeToString(
        schemaTypeChecker.getTypeAtLocation(elementLocalNode),
      ),
    })
    : null;
}

function booleanPrimitiveElementCase(
  api: ElementCaseApi,
): ElementCaseResult<BooleanPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.BooleanKeyword
    ? { elementKind: 'booleanPrimitive' }
    : null;
}

function numberPrimitiveElementCase(
  api: ElementCaseApi,
): ElementCaseResult<NumberPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.BooleanKeyword
    ? { elementKind: 'numberPrimitive' }
    : null;
}

function stringPrimitiveElementCase(
  api: ElementCaseApi,
): ElementCaseResult<StringPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.BooleanKeyword
    ? { elementKind: 'stringPrimitive' }
    : null;
}

function dataModelReferenceElementCase(
  api: ElementCaseApi,
): ElementCaseResult<DataModelReferenceElement> {
  const { elementSourceDeclaration, schemaTypeChecker, schemaResult } = api;
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
      elementName: elementDataModel.modelName,
    };
  }
  return null;
}

function aliasReferenceElementCase(
  api: ElementCaseApi,
): ElementCaseResult<AliasReferenceElement> {
  const { elementSourceDeclaration, elementLocalNode } = api;
  if (
    elementSourceDeclaration &&
    Typescript.isTypeAliasDeclaration(elementSourceDeclaration) &&
    Typescript.isTypeReferenceNode(elementLocalNode) &&
    elementLocalNode.typeArguments === undefined
  ) {
    // todo deriveIntermediateAlias
    return {
      elementKind: 'aliasReference',
      elementName: elementSourceDeclaration.name.text,
    };
  }
  return null;
}

function parameterReferenceElementCase(
  api: ElementCaseApi,
): ElementCaseResult<ParameterReferenceElement> {
  const { elementSourceDeclaration } = api;
  if (
    elementSourceDeclaration &&
    Typescript.isTypeParameterDeclaration(elementSourceDeclaration)
  ) {
    return {
      elementKind: 'parameterReference',
      elementName: elementSourceDeclaration.name.text,
    };
  }
  return null;
}

function definitiveVerdeTableElementCase(
  api: ElementCaseApi,
) {
  return __verdeTableElementCase<never>({
    ...api,
    elementCases: [
      // dataModelReferenceElementCase,
      // aliasReferenceElementCase,
      // dataModelUnionElementCase
    ],
  });
}

function genericVerdeTableElementCase(
  api: ElementCaseApi,
) {
  return __verdeTableElementCase<ParameterReferenceElement>({
    ...api,
    elementCases: [
      dataModelReferenceElementCase,
      aliasReferenceElementCase,
      parameterReferenceElementCase,
      // dataModelUnionElementCase
    ],
  });
}

interface __VerdeTableElementCaseApi<ThisParameterReferenceElement>
  extends
    ElementCaseApi,
    Pick<
      __CollectionElementCaseApi<
        VerdeTableElement<ThisParameterReferenceElement>,
        ElementCase<
          VerdeTableElement<
            ThisParameterReferenceElement
          >['elementArguments'][number]
        >
      >,
      'elementCases'
    > {}

function __verdeTableElementCase<ThisParameterReferenceElement>(
  api: __VerdeTableElementCaseApi<ThisParameterReferenceElement>,
) {
  return __collectionElementCase({
    ...api,
    elementDeclarationName: 'VerdeTable',
    createThisCollectionElement:
      createThisCollectionElement__verdeTableElementCase<
        ThisParameterReferenceElement
      >,
  });
}

function createThisCollectionElement__verdeTableElementCase<
  ThisParameterReferenceElement,
>(
  api: CreateThisCollectionElementApi<
    VerdeTableElement<ThisParameterReferenceElement>
  >,
): VerdeTableElement<ThisParameterReferenceElement> {
  const { elementArguments } = api;
  return {
    elementKind: 'verdeTable',
    elementArguments,
  };
}

function definitiveVerdeArrayElementCase(
  api: ElementCaseApi,
) {
  return __verdeArrayElementCase<never>({
    ...api,
    elementCases: [],
  });
}

function genericVerdeArrayElementCase(
  api: ElementCaseApi,
) {
  return __verdeArrayElementCase<ParameterReferenceElement>({
    ...api,
    elementCases: [],
  });
}

interface __VerdeArrayElementCaseApi<ThisParameterReferenceElement>
  extends
    ElementCaseApi,
    Pick<
      __CollectionElementCaseApi<
        VerdeArrayElement<ThisParameterReferenceElement>,
        ElementCase<
          VerdeArrayElement<
            ThisParameterReferenceElement
          >['elementArguments'][number]
        >
      >,
      'elementCases'
    > {}

function __verdeArrayElementCase<ThisParameterReferenceElement>(
  api: __VerdeArrayElementCaseApi<ThisParameterReferenceElement>,
) {
  return __collectionElementCase({
    ...api,
    elementDeclarationName: 'VerdeArray',
    createThisCollectionElement:
      createThisCollectionElement__verdeArrayElementCase<
        ThisParameterReferenceElement
      >,
  });
}

function createThisCollectionElement__verdeArrayElementCase<
  ThisParameterReferenceElement,
>(
  api: CreateThisCollectionElementApi<
    VerdeArrayElement<ThisParameterReferenceElement>
  >,
): VerdeArrayElement<ThisParameterReferenceElement> {
  const { elementArguments } = api;
  return {
    elementKind: 'verdeArray',
    elementArguments,
  };
}

interface __CollectionElementCaseApi<
  ThisCollectionElement extends __CollectionElement<genericAny, genericAny>,
  ThisElementCase extends ElementCase<
    ThisCollectionElement['elementArguments'][number]
  >,
> extends ElementCaseApi {
  elementDeclarationName: string;
  elementCases: Array<ThisElementCase>;
  createThisCollectionElement: (
    api: CreateThisCollectionElementApi<ThisCollectionElement>,
  ) => ThisCollectionElement;
}

interface CreateThisCollectionElementApi<
  ThisCollectionElement extends __CollectionElement<genericAny, genericAny>,
> {
  elementArguments: [ThisCollectionElement['elementArguments'][number]];
}

function __collectionElementCase<
  ThisCollectionElement extends __CollectionElement<genericAny, genericAny>,
  ThisElementCase extends ElementCase<
    ThisCollectionElement['elementArguments'][number]
  >,
>(
  api: __CollectionElementCaseApi<
    ThisCollectionElement,
    ThisElementCase
  >,
) {
  const {
    elementSourceDeclaration,
    elementDeclarationName,
    elementLocalNode,
    elementCases,
    schemaTypeChecker,
    schemaResult,
    createThisCollectionElement,
  } = api;
  if (
    elementSourceDeclaration &&
    Typescript.isTypeAliasDeclaration(elementSourceDeclaration) &&
    elementSourceDeclaration.name.text === elementDeclarationName &&
    Typescript.isTypeReferenceNode(elementLocalNode) &&
    elementLocalNode.typeArguments &&
    elementLocalNode.typeArguments[0] &&
    elementLocalNode.typeArguments.length === 1
  ) {
    return createThisCollectionElement({
      elementArguments: [deriveSchemaElement({
        elementCases,
        schemaTypeChecker,
        schemaResult,
        elementLocalNode: elementLocalNode.typeArguments[0],
      })],
    });
  }
  return null;
}

function definitiveObjectStructureElement(api: ElementCaseApi) {
  return __objectStructureElementCase({
    ...api,
    elementCases: [
      numberPrimitiveElementCase,
      stringPrimitiveElementCase,
    ],
  });
}

function genericObjectStructureElement(api: ElementCaseApi) {
  return __objectStructureElementCase({
    ...api,
    elementCases: [],
  });
}

interface __ObjectStructureElementCaseApi<
  ThisElementCase extends ElementCase<genericAny>,
> extends ElementCaseApi {
  elementCases: Array<ThisElementCase>;
}

function __objectStructureElementCase<
  ThisElementCase extends ElementCase<genericAny>,
>(api: __ObjectStructureElementCaseApi<ThisElementCase>) {
  const { elementLocalNode, schemaTypeChecker, schemaResult, elementCases } =
    api;
  if (Typescript.isTypeLiteralNode(elementLocalNode)) {
    return {
      elementKind: 'objectStructure',
      elementProperties: elementLocalNode.members.reduce<
        ObjectStructureElement<
          GetCaseSchemaElement<ThisElementCase>
        >['elementProperties']
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
                schemaTypeChecker,
                schemaResult,
                elementCases,
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
}

function definitiveTupleStructureElement(api: ElementCaseApi) {
  return __tupleStructureElementCase({
    ...api,
    elementCases: [
      numberPrimitiveElementCase,
      stringPrimitiveElementCase,
    ],
  });
}

function genericTupleStructureElement(api: ElementCaseApi) {
  return __tupleStructureElementCase({
    ...api,
    elementCases: [],
  });
}

interface __TupleStructureElementCaseApi<
  ThisElementCase extends ElementCase<genericAny>,
> extends ElementCaseApi {
  elementCases: Array<ThisElementCase>;
}

function __tupleStructureElementCase<
  ThisElementCase extends ElementCase<genericAny>,
>(api: __TupleStructureElementCaseApi<ThisElementCase>) {
  const { elementLocalNode, schemaTypeChecker, schemaResult, elementCases } =
    api;
  if (Typescript.isTupleTypeNode(elementLocalNode)) {
    return {
      elementKind: 'tupleStructure',
      elementProperties: elementLocalNode.elements.reduce<
        TupleStructureElement<
          GetCaseSchemaElement<ThisElementCase>
        >['elementProperties']
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
                schemaTypeChecker,
                schemaResult,
                elementCases,
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
}

function nullElementCase(api: ElementCaseApi): ElementCaseResult<NullElement> {
  const { elementLocalNode } = api;
  return Typescript.isLiteralTypeNode(elementLocalNode) &&
      elementLocalNode.literal.kind === Typescript.SyntaxKind.NullKeyword
    ? { elementKind: 'null' }
    : null;
}

function definitiveCoreUnionElementCase(api: ElementCaseApi) {
  return __coreUnionElementCase({
    ...api,
    elementCases: [],
  });
}

function genericCoreUnionElementCase(api: ElementCaseApi) {
  return __coreUnionElementCase({
    ...api,
    elementCases: [],
  });
}

interface __CoreUnionElementCaseApi<
  ThisElementCase extends ElementCase<genericAny>,
  ThisParameterReferenceElement,
> extends
  ElementCaseApi,
  Pick<
    __UnionElementCaseApi<
      ThisElementCase,
      CoreUnionElement<TerminalElement<ThisParameterReferenceElement>>
    >,
    'elementCases'
  > {}

function __coreUnionElementCase<
  ThisElementCase extends ElementCase<genericAny>,
  ThisParameterReferenceElement,
>(
  api: __CoreUnionElementCaseApi<
    ThisElementCase,
    ThisParameterReferenceElement
  >,
) {
  return __unionElementCase({
    ...api,
    createThisUnionElement: createThisUnionElement__coreUnionElementCase<
      ThisParameterReferenceElement
    >,
  });
}

function createThisUnionElement__coreUnionElementCase<
  ThisParameterReferenceElement,
>(
  api: CreateThisUnionElementApi<
    CoreUnionElement<TerminalElement<ThisParameterReferenceElement>>
  >,
): CoreUnionElement<TerminalElement<ThisParameterReferenceElement>> {
  const { elementMembers } = api;
  return {
    elementMembers,
    elementKind: 'coreUnion',
  };
}

function definitiveDataModelUnionElementCase(api: ElementCaseApi) {
  return __dataModelUnionElementCase({
    ...api,
    elementCases: [],
  });
}

function genericDataModelUnionElementCase(api: ElementCaseApi) {
  return __dataModelUnionElementCase({
    ...api,
    elementCases: [],
  });
}

interface __DataModelUnionElementCaseApi<
  ThisElementCase extends ElementCase<genericAny>,
  ThisParameterReferenceElement,
> extends
  ElementCaseApi,
  Pick<
    __UnionElementCaseApi<
      ThisElementCase,
      DataModelUnionElement<ThisParameterReferenceElement>
    >,
    'elementCases'
  > {}

function __dataModelUnionElementCase<
  ThisElementCase extends ElementCase<genericAny>,
  ThisParameterReferenceElement,
>(
  api: __DataModelUnionElementCaseApi<
    ThisElementCase,
    ThisParameterReferenceElement
  >,
) {
  return __unionElementCase({
    ...api,
    createThisUnionElement: createThisUnionElement__dataModelUnionElementCase<
      ThisParameterReferenceElement
    >,
  });
}

function createThisUnionElement__dataModelUnionElementCase<
  ThisParameterReferenceElement,
>(
  api: CreateThisUnionElementApi<
    DataModelUnionElement<ThisParameterReferenceElement>
  >,
): DataModelUnionElement<ThisParameterReferenceElement> {
  const { elementMembers } = api;
  return {
    elementMembers,
    elementKind: 'dataModelUnion',
  };
}

interface __UnionElementCaseApi<
  ThisElementCase extends ElementCase<genericAny>,
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
> extends ElementCaseApi {
  elementCases: Array<ThisElementCase>;
  createThisUnionElement: (
    api: CreateThisUnionElementApi<ThisUnionElement>,
  ) => ThisUnionElement;
}

interface CreateThisUnionElementApi<
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
> {
  elementMembers: ThisUnionElement['elementMembers'];
}

function __unionElementCase<
  ThisElementCase extends ElementCase<genericAny>,
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
>(
  api: __UnionElementCaseApi<ThisElementCase, ThisUnionElement>,
) {
  const {
    elementLocalNode,
    createThisUnionElement,
    schemaTypeChecker,
    schemaResult,
    elementCases,
  } = api;
  if (Typescript.isUnionTypeNode(elementLocalNode)) {
    return createThisUnionElement({
      elementMembers: elementLocalNode.types.map((someUnionMemberNode) =>
        deriveSchemaElement({
          schemaTypeChecker,
          schemaResult,
          elementCases,
          elementLocalNode: someUnionMemberNode,
        })
      ),
    });
  }
  return null;
}

export type ElementCase<ThisSchemaElement> = (
  api: ElementCaseApi,
) => ElementCaseResult<ThisSchemaElement>;

interface ElementCaseApi extends
  Pick<
    DeriveSchemaElementApi<irrelevantUnknown, Typescript.Node>,
    'schemaTypeChecker' | 'schemaResult' | 'elementLocalNode'
  > {
  elementSourceDeclaration: Typescript.Declaration | null;
}

type ElementCaseResult<ThisSchemaElement> = ThisSchemaElement | null;

export type GetCaseSchemaElement<
  ThisElementCase extends ElementCase<genericAny>,
> = ThisElementCase extends ElementCase<infer ThisSchemaElement>
  ? ThisSchemaElement
  : never;

function getExtendedTuple<
  ThisCoreTuple extends [genericAny, ...Array<genericAny>],
  ThisExtensionTuple extends [genericAny, ...Array<genericAny>] | [],
>(
  thisCoreTuple: ThisCoreTuple,
  thisExtensionTuple: ThisExtensionTuple,
): [...ThisCoreTuple, ...ThisExtensionTuple] {
  return [...thisCoreTuple, ...thisExtensionTuple];
}
