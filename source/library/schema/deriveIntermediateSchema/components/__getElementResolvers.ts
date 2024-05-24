import { genericAny, irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  __CollectionElement,
  __SchemaElement,
  __UnionElement,
  AliasReferenceElement,
  BooleanLiteralElement,
  BooleanPrimitiveElement,
  DataModelReferenceElement,
  ExportUnionElement,
  GeneralUnionElement,
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
  VerdeArrayUnionElement,
  VerdeTableElement,
  VerdeTableUnionElement,
} from '../../types/SchemaElement.ts';
import {
  deriveAliasType,
  deriveDataModelType,
} from './__deriveIntermediateSchemaType.ts';
import {
  deriveSchemaElement,
  DeriveSchemaElementApi,
} from './deriveSchemaElement.ts';

export const EXPORT_ELEMENT_RESOLVERS = getExportElementResolvers();

function getExportElementResolvers() {
  return [
    ...getBasicReferenceElementResolvers(),
    exportUnionElementResolver,
  ];
}

export const DEFINITIVE_ELEMENT_RESOLVERS = getDefinitiveElementResolvers();

function getDefinitiveElementResolvers() {
  return [
    ...getDefinitiveStructureElementResolvers(),
    definitiveGeneralUnionElementResolver,
  ];
}

export const DEFINITIVE_STRUCTURE_ELEMENT_RESOLVERS = getDefinitiveStructureElementResolvers()

function getDefinitiveStructureElementResolvers() {
  return [
    ...getDefinitiveTerminalElementResolvers(),
    definitiveTupleElementResolver,
    definitiveObjectElementResolver,
  ];
}

function getDefinitiveTerminalElementResolvers() {
  return [
    ...getBasicElementResolvers(),
    ...getBasicReferenceElementResolvers(),
    definitiveVerdeTableElementResolver,
    definitiveVerdeArrayElementResolver,
  ];
}

export const GENERIC_ELEMENT_RESOLVERS = getGenericElementResolvers();

function getGenericElementResolvers() {
  return [
    ...getGenericStructureElementResolvers(),
    genericGeneralUnionElementResolver,
  ];
}

const GENERIC_STRUCTURE_ELEMENT_RESOLVERS = getGenericStructureElementResolvers()

function getGenericStructureElementResolvers() {
  return [
    ...getGenericTerminalElementResolvers(),
    genericTupleElementResolver,
    genericObjectElementResolver,
  ];
}

function getGenericTerminalElementResolvers() {
  return [
    ...getBasicElementResolvers(),
    ...getGenericReferenceElementResolvers(),
    genericVerdeTableElementResolver,
    genericVerdeArrayElementResolver,
  ];
}

const GENERIC_REFERENCE_ELEMENT_RESOLVERS = getGenericReferenceElementResolvers()

function getGenericReferenceElementResolvers() {
  return [
    ...getBasicReferenceElementResolvers(),
    parameterReferenceElementResolver,
  ];
}

const BASIC_VERDE_ARRAY_ELEMENT_RESOLVERS = getBasicVerdeArrayElementResolvers()

function getBasicVerdeArrayElementResolvers() {
  return [
    ...getPrimitiveElementResolvers(),
    ...getBasicReferenceElementResolvers(),
  ];
}

const BASIC_REFERENCE_ELEMENT_RESOLVERS = getBasicReferenceElementResolvers()

function getBasicReferenceElementResolvers() {
  return [
    dataModelReferenceElementResolver,
    aliasReferenceElementResolver,
  ];
}

function getBasicElementResolvers() {
  return [
    ...getLiteralElementResolvers(),
    ...getPrimitiveElementResolvers(),
  ];
}

const PRIMITIVE_ELEMENT_RESOLVERS = getPrimitiveElementResolvers()

function getPrimitiveElementResolvers() {
  return [
    booleanPrimitiveElementResolver,
    numberPrimitiveElementResolver,
    stringPrimitiveElementResolver,
  ];
}

function getLiteralElementResolvers() {
  return [
    booleanLiteralElementResolver,
    numberLiteralElementResolver,
    stringLiteralElementResolver,
  ];
}

function booleanLiteralElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<BooleanLiteralElement> {
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

function numberLiteralElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<NumberLiteralElement> {
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

function stringLiteralElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<StringLiteralElement> {
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

function booleanPrimitiveElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<BooleanPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.BooleanKeyword
    ? { elementKind: 'booleanPrimitive' }
    : null;
}

function numberPrimitiveElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<NumberPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.NumberKeyword
    ? { elementKind: 'numberPrimitive' }
    : null;
}

function stringPrimitiveElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<StringPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.StringKeyword
    ? { elementKind: 'stringPrimitive' }
    : null;
}

function dataModelReferenceElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<DataModelReferenceElement> {
  const {
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveSchemaTypeQueue,
  } = api;
  if (
    elementLocalSymbol &&
    elementSourceSymbol &&
    elementSourceDeclaration &&
    Typescript.isInterfaceDeclaration(elementSourceDeclaration)
  ) {
    deriveSchemaTypeQueue.push({
      deriveThisSchemaType: deriveDataModelType,
      thisTypeArguments: {
        typeLocalSymbol: elementLocalSymbol,
        typeSourceSymbol: elementSourceSymbol,
        typeSourceDeclaration: elementSourceDeclaration,
      },
    });
    return {
      elementKind: 'dataModelReference',
      elementName: elementSourceDeclaration.name.text,
    };
  }
  return null;
}

function aliasReferenceElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<AliasReferenceElement> {
  const {
    elementLocalSymbol,
    elementSourceSymbol,
    elementLocalNode,
    elementSourceDeclaration,
    deriveSchemaTypeQueue,
  } = api;
  if (
    elementLocalSymbol &&
    elementSourceSymbol &&
    Typescript.isTypeReferenceNode(elementLocalNode) &&
    elementSourceDeclaration &&
    Typescript.isTypeAliasDeclaration(elementSourceDeclaration) &&
    elementSourceDeclaration.typeParameters === undefined
  ) {
    deriveSchemaTypeQueue.push({
      deriveThisSchemaType: deriveAliasType,
      thisTypeArguments: {
        typeLocalSymbol: elementLocalSymbol,
        typeSourceSymbol: elementSourceSymbol,
        typeSourceDeclaration: elementSourceDeclaration,
      },
    });
    return {
      elementKind: 'aliasReference',
      elementName: elementSourceDeclaration.name.text,
    };
  }
  return null;
}

function parameterReferenceElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<ParameterReferenceElement> {
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

function definitiveVerdeTableElementResolver(
  api: ElementResolverApi,
) {
  return __verdeTableElementResolver<never>({
    ...api,
    elementResolvers: [
      ...BASIC_REFERENCE_ELEMENT_RESOLVERS,
      definitiveVerdeTableUnionElementResolver,
    ],
  });
}

function genericVerdeTableElementResolver(
  api: ElementResolverApi,
) {
  return __verdeTableElementResolver<ParameterReferenceElement>({
    ...api,
    elementResolvers: [
      ...GENERIC_REFERENCE_ELEMENT_RESOLVERS,
      genericVerdeTableUnionElementResolver,
    ],
  });
}

interface __VerdeTableElementResolverApi<ThisParameterReferenceElement>
  extends
    ElementResolverApi,
    Pick<
      __CollectionElementResolverApi<
        VerdeTableElement<ThisParameterReferenceElement>,
        ElementResolver<
          VerdeTableElement<
            ThisParameterReferenceElement
          >['elementArguments'][number]
        >
      >,
      'elementResolvers'
    > {}

function __verdeTableElementResolver<ThisParameterReferenceElement>(
  api: __VerdeTableElementResolverApi<ThisParameterReferenceElement>,
) {
  return __collectionElementResolver({
    ...api,
    elementDeclarationName: 'VerdeTable',
    createThisCollectionElement:
      createThisCollectionElement__verdeTableElementResolver<
        ThisParameterReferenceElement
      >,
  });
}

function createThisCollectionElement__verdeTableElementResolver<
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

function definitiveVerdeArrayElementResolver(
  api: ElementResolverApi,
) {
  return __verdeArrayElementResolver<never>({
    ...api,
    elementResolvers: [
      ...BASIC_VERDE_ARRAY_ELEMENT_RESOLVERS,
      definitiveVerdeArrayUnionElementResolver,
    ],
  });
}

function genericVerdeArrayElementResolver(
  api: ElementResolverApi,
) {
  return __verdeArrayElementResolver<ParameterReferenceElement>({
    ...api,
    elementResolvers: [
      ...BASIC_VERDE_ARRAY_ELEMENT_RESOLVERS,
      genericVerdeArrayUnionElementResolver,
      parameterReferenceElementResolver,
    ],
  });
}

interface __VerdeArrayElementResolverApi<ThisParameterReferenceElement>
  extends
    ElementResolverApi,
    Pick<
      __CollectionElementResolverApi<
        VerdeArrayElement<ThisParameterReferenceElement>,
        ElementResolver<
          VerdeArrayElement<
            ThisParameterReferenceElement
          >['elementArguments'][number]
        >
      >,
      'elementResolvers'
    > {}

function __verdeArrayElementResolver<ThisParameterReferenceElement>(
  api: __VerdeArrayElementResolverApi<ThisParameterReferenceElement>,
) {
  return __collectionElementResolver({
    ...api,
    elementDeclarationName: 'VerdeArray',
    createThisCollectionElement:
      createThisCollectionElement__verdeArrayElementResolver<
        ThisParameterReferenceElement
      >,
  });
}

function createThisCollectionElement__verdeArrayElementResolver<
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

interface __CollectionElementResolverApi<
  ThisCollectionElement extends __CollectionElement<genericAny, genericAny>,
  ThisElementResolver extends ElementResolver<
    ThisCollectionElement['elementArguments'][number]
  >,
> extends ElementResolverApi {
  elementDeclarationName: string;
  elementResolvers: Array<ThisElementResolver>;
  createThisCollectionElement: (
    api: CreateThisCollectionElementApi<ThisCollectionElement>,
  ) => ThisCollectionElement;
}

interface CreateThisCollectionElementApi<
  ThisCollectionElement extends __CollectionElement<genericAny, genericAny>,
> {
  elementArguments: [ThisCollectionElement['elementArguments'][number]];
}

function __collectionElementResolver<
  ThisCollectionElement extends __CollectionElement<genericAny, genericAny>,
  ThisElementResolver extends ElementResolver<
    ThisCollectionElement['elementArguments'][number]
  >,
>(
  api: __CollectionElementResolverApi<
    ThisCollectionElement,
    ThisElementResolver
  >,
) {
  const {
    elementSourceDeclaration,
    elementDeclarationName,
    elementLocalNode,
    elementResolvers,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
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
        deriveSchemaTypeQueue,
        elementResolvers,
        elementLocalNode: elementLocalNode.typeArguments[0],
      })],
    });
  }
  return null;
}

function definitiveObjectElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<
  ObjectElement<TerminalElement<never>>
> {
  return __objectElementResolver({
    ...api,
    elementResolvers: DEFINITIVE_ELEMENT_RESOLVERS,
  });
}

function genericObjectElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<
  ObjectElement<TerminalElement<ParameterReferenceElement>>
> {
  return __objectElementResolver({
    ...api,
    elementResolvers: GENERIC_ELEMENT_RESOLVERS,
  });
}

interface __ObjectElementResolverApi<
  ThisElementResolver extends ElementResolver<genericAny>,
> extends ElementResolverApi {
  elementResolvers: Array<ThisElementResolver>;
}

function __objectElementResolver<
  ThisElementResolver extends ElementResolver<genericAny>,
  ThisPropertyElement extends __SchemaElement<genericAny>,
>(
  api: __ObjectElementResolverApi<ThisElementResolver>,
): ElementResolverResult<ObjectElement<ThisPropertyElement>> {
  const {
    elementLocalNode,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    elementResolvers,
  } = api;
  if (Typescript.isTypeLiteralNode(elementLocalNode)) {
    return {
      elementKind: 'objectStructure',
      elementProperties: elementLocalNode.members.reduce<
        ObjectElement<
          GetResolverSchemaElement<ThisElementResolver>
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
                deriveSchemaTypeQueue,
                elementResolvers,
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

function definitiveTupleElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<TupleElement<TerminalElement<never>>> {
  return __tupleElementResolver({
    ...api,
    elementResolvers: DEFINITIVE_ELEMENT_RESOLVERS,
  });
}

function genericTupleElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<
  TupleElement<TerminalElement<ParameterReferenceElement>>
> {
  return __tupleElementResolver({
    ...api,
    elementResolvers: GENERIC_ELEMENT_RESOLVERS,
  });
}

interface __TupleElementResolverApi<
  ThisPropertyElementResolver extends ElementResolver<genericAny>,
> extends ElementResolverApi {
  elementResolvers: Array<ThisPropertyElementResolver>;
}

function __tupleElementResolver<
  ThisPropertElement extends __SchemaElement<genericAny>,
  ThisPropertyElementResolver extends ElementResolver<genericAny>,
>(
  api: __TupleElementResolverApi<ThisPropertyElementResolver>,
): ElementResolverResult<TupleElement<ThisPropertElement>> {
  const {
    elementLocalNode,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    elementResolvers,
  } = api;
  if (Typescript.isTupleTypeNode(elementLocalNode)) {
    return {
      elementKind: 'tupleStructure',
      elementProperties: elementLocalNode.elements.reduce<
        TupleElement<
          GetResolverSchemaElement<ThisPropertyElementResolver>
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
                deriveSchemaTypeQueue,
                elementResolvers,
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

function nullElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<NullElement> {
  const { elementLocalNode } = api;
  return Typescript.isLiteralTypeNode(elementLocalNode) &&
      elementLocalNode.literal.kind === Typescript.SyntaxKind.NullKeyword
    ? { elementKind: 'null' }
    : null;
}

export function exportUnionElementResolver(api: ElementResolverApi) {
  return __unionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__exportUnionElementResolver,
    elementResolvers: BASIC_REFERENCE_ELEMENT_RESOLVERS,
  });
}

function createThisUnionElement__exportUnionElementResolver(
  api: CreateThisUnionElementApi<ExportUnionElement>,
): ExportUnionElement {
  const { elementMembers } = api;
  return {
    elementMembers,
    elementKind: 'exportUnion',
  };
}

function definitiveGeneralUnionElementResolver(api: ElementResolverApi) {
  return __generalUnionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__generalUnionElementResolver<
      never
    >,
    elementResolvers: [
      ...DEFINITIVE_STRUCTURE_ELEMENT_RESOLVERS,
      nullElementResolver,
    ],
  });
}

function genericGeneralUnionElementResolver(api: ElementResolverApi) {
  return __generalUnionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__generalUnionElementResolver<
      ParameterReferenceElement
    >,
    elementResolvers: [
      ...GENERIC_STRUCTURE_ELEMENT_RESOLVERS,
      nullElementResolver,
    ],
  });
}

interface __GeneralUnionElementResolverApi<
  ThisParameterReferenceElement,
> extends
  ElementResolverApi,
  Pick<
    __UnionElementResolverApi<
      GeneralUnionElement<TerminalElement<ThisParameterReferenceElement>>
    >,
    'elementResolvers' | 'createThisUnionElement'
  > {}

function __generalUnionElementResolver<
  ThisParameterReferenceElement,
>(
  api: __GeneralUnionElementResolverApi<ThisParameterReferenceElement>,
) {
  return __unionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__generalUnionElementResolver<
      ThisParameterReferenceElement
    >,
  });
}

function createThisUnionElement__generalUnionElementResolver<
  ThisParameterReferenceElement,
>(
  api: CreateThisUnionElementApi<
    GeneralUnionElement<TerminalElement<ThisParameterReferenceElement>>
  >,
): GeneralUnionElement<TerminalElement<ThisParameterReferenceElement>> {
  const { elementMembers } = api;
  return {
    elementMembers,
    elementKind: 'generalUnion',
  };
}

function definitiveVerdeTableUnionElementResolver(api: ElementResolverApi) {
  return __verdeTableUnionElementResolver({
    ...api,
    createThisUnionElement:
      createThisUnionElement__verdeTableUnionElementResolver<
        never
      >,
    elementResolvers: BASIC_REFERENCE_ELEMENT_RESOLVERS,
  });
}

function genericVerdeTableUnionElementResolver(
  api: ElementResolverApi,
) {
  return __verdeTableUnionElementResolver({
    ...api,
    createThisUnionElement:
      createThisUnionElement__verdeTableUnionElementResolver<
        ParameterReferenceElement
      >,
    elementResolvers: GENERIC_REFERENCE_ELEMENT_RESOLVERS,
  });
}

interface __VerdeTableUnionElementResolverApi<
  ThisParameterReferenceElement,
> extends
  ElementResolverApi,
  Pick<
    __UnionElementResolverApi<
      VerdeTableUnionElement<ThisParameterReferenceElement>
    >,
    'elementResolvers' | 'createThisUnionElement'
  > {}

function __verdeTableUnionElementResolver<ThisParameterReferenceElement>(
  api: __VerdeTableUnionElementResolverApi<ThisParameterReferenceElement>,
) {
  return __unionElementResolver(api);
}

function createThisUnionElement__verdeTableUnionElementResolver<
  ThisParameterReferenceElement,
>(
  api: CreateThisUnionElementApi<
    VerdeTableUnionElement<ThisParameterReferenceElement>
  >,
): VerdeTableUnionElement<ThisParameterReferenceElement> {
  const { elementMembers } = api;
  return {
    elementMembers,
    elementKind: 'verdeTableUnion',
  };
}

function definitiveVerdeArrayUnionElementResolver(api: ElementResolverApi) {
  return __verdeArrayUnionElementResolver({
    ...api,
    createThisUnionElement:
      createThisUnionElement__verdeArrayUnionElementResolver<
        never
      >,
    elementResolvers: [
      ...PRIMITIVE_ELEMENT_RESOLVERS,
      ...BASIC_REFERENCE_ELEMENT_RESOLVERS,
    ],
  });
}

function genericVerdeArrayUnionElementResolver(
  api: ElementResolverApi,
) {
  return __verdeArrayUnionElementResolver({
    ...api,
    createThisUnionElement:
      createThisUnionElement__verdeArrayUnionElementResolver<
        ParameterReferenceElement
      >,
    elementResolvers: [
      ...PRIMITIVE_ELEMENT_RESOLVERS,
      ...GENERIC_REFERENCE_ELEMENT_RESOLVERS,
    ],
  });
}

interface __VerdeArrayUnionElementResolverApi<
  ThisParameterReferenceElement,
> extends
  ElementResolverApi,
  Pick<
    __UnionElementResolverApi<
      VerdeArrayUnionElement<ThisParameterReferenceElement>
    >,
    'elementResolvers' | 'createThisUnionElement'
  > {}

function __verdeArrayUnionElementResolver<ThisParameterReferenceElement>(
  api: __VerdeArrayUnionElementResolverApi<ThisParameterReferenceElement>,
) {
  return __unionElementResolver(api);
}

function createThisUnionElement__verdeArrayUnionElementResolver<
  ThisParameterReferenceElement,
>(
  api: CreateThisUnionElementApi<
    VerdeArrayUnionElement<ThisParameterReferenceElement>
  >,
): VerdeArrayUnionElement<ThisParameterReferenceElement> {
  const { elementMembers } = api;
  return {
    elementMembers,
    elementKind: 'verdeArrayUnion',
  };
}

interface __UnionElementResolverApi<
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
> extends ElementResolverApi {
  elementResolvers: Array<
    ElementResolver<ThisUnionElement['elementMembers'][number]>
  >;
  createThisUnionElement: (
    api: CreateThisUnionElementApi<ThisUnionElement>,
  ) => ThisUnionElement;
}

interface CreateThisUnionElementApi<
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
> {
  elementMembers: ThisUnionElement['elementMembers'];
}

function __unionElementResolver<
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
>(
  api: __UnionElementResolverApi<ThisUnionElement>,
) {
  const {
    elementLocalNode,
    createThisUnionElement,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    elementResolvers,
  } = api;
  if (Typescript.isUnionTypeNode(elementLocalNode)) {
    return createThisUnionElement({
      elementMembers: elementLocalNode.types.map((someUnionMemberNode) =>
        deriveSchemaElement({
          schemaTypeChecker,
          deriveSchemaTypeQueue,
          elementResolvers,
          elementLocalNode: someUnionMemberNode,
        })
      ),
    });
  }
  return null;
}

export type ElementResolver<ThisSchemaElement> = (
  api: ElementResolverApi,
) => ElementResolverResult<ThisSchemaElement>;

interface ElementResolverApi extends
  Pick<
    DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'deriveSchemaTypeQueue' | 'elementLocalNode'
  > {
  elementLocalSymbol: Typescript.Symbol | null;
  elementSourceSymbol: Typescript.Symbol | null;
  elementSourceDeclaration: Typescript.Declaration | null;
}

type ElementResolverResult<ThisSchemaElement> = ThisSchemaElement | null;

export type GetResolverSchemaElement<
  ThisElementResolver extends ElementResolver<genericAny>,
> = ThisElementResolver extends ElementResolver<infer ThisSchemaElement>
  ? ThisSchemaElement
  : never;
