import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
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
  ObjectElement,
  ParameterReferenceElement,
  StringLiteralElement,
  StringPrimitiveElement,
  TerminalElement,
  TupleElement,
  VerdeArrayElement,
  VerdeTableElement,
} from '../../types/SchemaElement.ts';
import { deriveDataModel } from './__deriveIntermediateModel.ts';
import {
  deriveSchemaElement,
  DeriveSchemaElementApi,
} from './deriveSchemaElement.ts';

export function getDefinitiveElementCases() {
  return [
    ...getDefinitiveStructureElementCases(),
    definitiveCoreUnionElementCase,
  ];
}

function getDefinitiveStructureElementCases() {
  return [
    ...getDefinitiveTerminalElementCases(),
    definitiveTupleElement,
    definitiveObjectElement,
  ];
}

function getDefinitiveTerminalElementCases() {
  return [
    ...getBasicTerminalElementCases(),
    definitiveVerdeTableElementCase,
    definitiveVerdeArrayElementCase,
  ];
}

export function getGenericElementCases() {
  return [
    ...getGenericStructureElementCases(),
    genericCoreUnionElementCase,
  ];
}

function getGenericStructureElementCases() {
  return [
    ...getGenericTerminalElementCases(),
    genericTupleElement,
    genericObjectElement,
  ];
}

function getGenericTerminalElementCases() {
  return [
    ...getBasicTerminalElementCases(),
    genericVerdeTableElementCase,
    genericVerdeArrayElementCase,
    parameterReferenceElementCase,
  ];
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
  return elementLocalNode.kind === Typescript.SyntaxKind.NumberKeyword
    ? { elementKind: 'numberPrimitive' }
    : null;
}

function stringPrimitiveElementCase(
  api: ElementCaseApi,
): ElementCaseResult<StringPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.StringKeyword
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
      dataModelReferenceElementCase,
      aliasReferenceElementCase,
      definitiveDataModelUnionElementCase,
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
      genericDataModelUnionElementCase,
      parameterReferenceElementCase,
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
    elementArguments,
    elementKind: 'verdeTable',
  };
}

function definitiveVerdeArrayElementCase(
  api: ElementCaseApi,
) {
  return __verdeArrayElementCase<never>({
    ...api,
    elementCases: getBasicTerminalElementCases(),
  });
}

function genericVerdeArrayElementCase(
  api: ElementCaseApi,
) {
  return __verdeArrayElementCase<ParameterReferenceElement>({
    ...api,
    elementCases: [
      ...getBasicTerminalElementCases(),
      parameterReferenceElementCase,
    ],
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
    elementArguments,
    elementKind: 'verdeArray',
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
        schemaTypeChecker,
        schemaResult,
        elementCases,
        elementLocalNode: elementLocalNode.typeArguments[0],
      })],
    });
  }
  return null;
}

function definitiveObjectElement(
  api: ElementCaseApi,
): ElementCaseResult<
  ObjectElement<TerminalElement<never>>
> {
  return __objectElementCase({
    ...api,
    elementCases: getDefinitiveElementCases(),
  });
}

function genericObjectElement(
  api: ElementCaseApi,
): ElementCaseResult<
  ObjectElement<TerminalElement<ParameterReferenceElement>>
> {
  return __objectElementCase({
    ...api,
    elementCases: getGenericElementCases(),
  });
}

interface __ObjectElementCaseApi<
  ThisElementCase extends ElementCase<genericAny>,
> extends ElementCaseApi {
  elementCases: Array<ThisElementCase>;
}

function __objectElementCase<
  ThisElementCase extends ElementCase<genericAny>,
  ThisPropertyElement extends __SchemaElement<genericAny>,
>(
  api: __ObjectElementCaseApi<ThisElementCase>,
): ElementCaseResult<ObjectElement<ThisPropertyElement>> {
  const { elementLocalNode, schemaTypeChecker, schemaResult, elementCases } =
    api;
  if (Typescript.isTypeLiteralNode(elementLocalNode)) {
    return {
      elementKind: 'objectStructure',
      elementProperties: elementLocalNode.members.reduce<
        ObjectElement<
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

function definitiveTupleElement(
  api: ElementCaseApi,
): ElementCaseResult<TupleElement<TerminalElement<never>>> {
  return __tupleElementCase({
    ...api,
    elementCases: getDefinitiveElementCases(),
  });
}

function genericTupleElement(
  api: ElementCaseApi,
): ElementCaseResult<
  TupleElement<TerminalElement<ParameterReferenceElement>>
> {
  return __tupleElementCase({
    ...api,
    elementCases: getGenericElementCases(),
  });
}

interface __TupleElementCaseApi<
  ThisPropertyElementCase extends ElementCase<genericAny>,
> extends ElementCaseApi {
  elementCases: Array<ThisPropertyElementCase>;
}

function __tupleElementCase<
  ThisPropertElement extends __SchemaElement<genericAny>,
  ThisPropertyElementCase extends ElementCase<genericAny>,
>(
  api: __TupleElementCaseApi<ThisPropertyElementCase>,
): ElementCaseResult<TupleElement<ThisPropertElement>> {
  const { elementLocalNode, schemaTypeChecker, schemaResult, elementCases } =
    api;
  if (Typescript.isTupleTypeNode(elementLocalNode)) {
    return {
      elementKind: 'tupleStructure',
      elementProperties: elementLocalNode.elements.reduce<
        TupleElement<
          GetCaseSchemaElement<ThisPropertyElementCase>
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
    createThisUnionElement: createThisUnionElement__coreUnionElementCase<never>,
    elementCases: [
      ...getDefinitiveStructureElementCases(),
      nullElementCase,
    ],
  });
}

function genericCoreUnionElementCase(api: ElementCaseApi) {
  return __coreUnionElementCase({
    ...api,
    createThisUnionElement: createThisUnionElement__coreUnionElementCase<
      ParameterReferenceElement
    >,
    elementCases: [
      ...getGenericStructureElementCases(),
      nullElementCase,
    ],
  });
}

interface __CoreUnionElementCaseApi<
  ThisParameterReferenceElement,
> extends
  ElementCaseApi,
  Pick<
    __UnionElementCaseApi<
      CoreUnionElement<TerminalElement<ThisParameterReferenceElement>>
    >,
    'elementCases' | 'createThisUnionElement'
  > {}

function __coreUnionElementCase<
  ThisParameterReferenceElement,
>(
  api: __CoreUnionElementCaseApi<ThisParameterReferenceElement>,
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
    createThisUnionElement: createThisUnionElement__dataModelUnionElementCase<
      never
    >,
    elementCases: [
      dataModelReferenceElementCase,
      aliasReferenceElementCase,
    ],
  });
}

function genericDataModelUnionElementCase(
  api: ElementCaseApi,
) {
  return __dataModelUnionElementCase({
    ...api,
    createThisUnionElement: createThisUnionElement__dataModelUnionElementCase<
      ParameterReferenceElement
    >,
    elementCases: [
      dataModelReferenceElementCase,
      aliasReferenceElementCase,
      parameterReferenceElementCase,
    ],
  });
}

interface __DataModelUnionElementCaseApi<
  ThisParameterReferenceElement,
> extends
  ElementCaseApi,
  Pick<
    __UnionElementCaseApi<DataModelUnionElement<ThisParameterReferenceElement>>,
    'elementCases' | 'createThisUnionElement'
  > {}

function __dataModelUnionElementCase<ThisParameterReferenceElement>(
  api: __DataModelUnionElementCaseApi<ThisParameterReferenceElement>,
) {
  return __unionElementCase(api);
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
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
> extends ElementCaseApi {
  elementCases: Array<ElementCase<ThisUnionElement['elementMembers'][number]>>;
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
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
>(
  api: __UnionElementCaseApi<ThisUnionElement>,
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
    DeriveSchemaElementApi<irrelevantAny, Typescript.Node>,
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
