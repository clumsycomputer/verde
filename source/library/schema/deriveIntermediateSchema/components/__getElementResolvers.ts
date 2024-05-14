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
import { deriveDataModel } from './__deriveIntermediateModel.ts';
import {
  deriveSchemaElement,
  DeriveSchemaElementApi,
} from './deriveSchemaElement.ts';

export function getDefinitiveElementResolvers() {
  return [
    ...getDefinitiveStructureElementResolvers(),
    definitiveCoreUnionElementResolver,
  ];
}

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

export function getGenericElementResolvers() {
  return [
    ...getGenericStructureElementResolvers(),
    genericCoreUnionElementResolver,
  ];
}

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

function getBasicVerdeArrayElementResolvers() {
  return [
    ...getPrimitiveElementResolvers(),
    ...getBasicReferenceElementResolvers()
  ]
}

function getGenericReferenceElementResolvers() {
  return [
    ...getBasicReferenceElementResolvers(),
    parameterReferenceElementResolver
  ]
}

function getBasicReferenceElementResolvers() {
  return [
    dataModelReferenceElementResolver,
    aliasReferenceElementResolver,
  ]
}

function getBasicElementResolvers() {
  return [
    ...getLiteralElementResolvers(),
    ...getPrimitiveElementResolvers()   
  ];
}

function getPrimitiveElementResolvers() {
  return [
    booleanPrimitiveElementResolver,
    numberPrimitiveElementResolver,
    stringPrimitiveElementResolver,
  ]
}

function getLiteralElementResolvers() {
  return [
    booleanLiteralElementResolver,
    numberLiteralElementResolver,
    stringLiteralElementResolver
  ]
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

function aliasReferenceElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<AliasReferenceElement> {
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
      ...getBasicReferenceElementResolvers(),
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
      ...getGenericReferenceElementResolvers(),
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
      ...getBasicVerdeArrayElementResolvers(),
      definitiveVerdeArrayUnionElementResolver
    ]
  });
}

function genericVerdeArrayElementResolver(
  api: ElementResolverApi,
) {
  return __verdeArrayElementResolver<ParameterReferenceElement>({
    ...api,
    elementResolvers: [
      ...getBasicVerdeArrayElementResolvers(),
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
    elementResolvers: getDefinitiveElementResolvers(),
  });
}

function genericObjectElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<
  ObjectElement<TerminalElement<ParameterReferenceElement>>
> {
  return __objectElementResolver({
    ...api,
    elementResolvers: getGenericElementResolvers(),
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
  const { elementLocalNode, schemaTypeChecker, schemaResult, elementResolvers } =
    api;
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
                schemaResult,
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
    elementResolvers: getDefinitiveElementResolvers(),
  });
}

function genericTupleElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<
  TupleElement<TerminalElement<ParameterReferenceElement>>
> {
  return __tupleElementResolver({
    ...api,
    elementResolvers: getGenericElementResolvers(),
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
  const { elementLocalNode, schemaTypeChecker, schemaResult, elementResolvers } =
    api;
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
                schemaResult,
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

function nullElementResolver(api: ElementResolverApi): ElementResolverResult<NullElement> {
  const { elementLocalNode } = api;
  return Typescript.isLiteralTypeNode(elementLocalNode) &&
      elementLocalNode.literal.kind === Typescript.SyntaxKind.NullKeyword
    ? { elementKind: 'null' }
    : null;
}

function definitiveCoreUnionElementResolver(api: ElementResolverApi) {
  return __coreUnionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__coreUnionElementResolver<never>,
    elementResolvers: [
      ...getDefinitiveStructureElementResolvers(),
      nullElementResolver,
    ],
  });
}

function genericCoreUnionElementResolver(api: ElementResolverApi) {
  return __coreUnionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__coreUnionElementResolver<
      ParameterReferenceElement
    >,
    elementResolvers: [
      ...getGenericStructureElementResolvers(),
      nullElementResolver,
    ],
  });
}

interface __CoreUnionElementResolverApi<
  ThisParameterReferenceElement,
> extends
  ElementResolverApi,
  Pick<
    __UnionElementResolverApi<
      CoreUnionElement<TerminalElement<ThisParameterReferenceElement>>
    >,
    'elementResolvers' | 'createThisUnionElement'
  > {}

function __coreUnionElementResolver<
  ThisParameterReferenceElement,
>(
  api: __CoreUnionElementResolverApi<ThisParameterReferenceElement>,
) {
  return __unionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__coreUnionElementResolver<
      ThisParameterReferenceElement
    >,
  });
}

function createThisUnionElement__coreUnionElementResolver<
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

function definitiveVerdeTableUnionElementResolver(api: ElementResolverApi) {
  return __verdeTableUnionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__verdeTableUnionElementResolver<
      never
    >,
    elementResolvers: getBasicReferenceElementResolvers()
  });
}

function genericVerdeTableUnionElementResolver(
  api: ElementResolverApi,
) {
  return __verdeTableUnionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__verdeTableUnionElementResolver<
      ParameterReferenceElement
    >,
    elementResolvers: getGenericReferenceElementResolvers()
  });
}

interface __VerdeTableUnionElementResolverApi<
  ThisParameterReferenceElement,
> extends
  ElementResolverApi,
  Pick<
    __UnionElementResolverApi<VerdeTableUnionElement<ThisParameterReferenceElement>>,
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
    createThisUnionElement: createThisUnionElement__verdeArrayUnionElementResolver<
      never
    >,
    elementResolvers: [
      ...getPrimitiveElementResolvers(),
      ...getBasicReferenceElementResolvers(),      
    ]
  });
}

function genericVerdeArrayUnionElementResolver(
  api: ElementResolverApi,
) {
  return __verdeArrayUnionElementResolver({
    ...api,
    createThisUnionElement: createThisUnionElement__verdeArrayUnionElementResolver<
      ParameterReferenceElement
    >,
    elementResolvers: [
      ...getPrimitiveElementResolvers(),
      ...getGenericReferenceElementResolvers(),      
    ]
  });
}

interface __VerdeArrayUnionElementResolverApi<
  ThisParameterReferenceElement,
> extends
  ElementResolverApi,
  Pick<
    __UnionElementResolverApi<VerdeArrayUnionElement<ThisParameterReferenceElement>>,
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
  elementResolvers: Array<ElementResolver<ThisUnionElement['elementMembers'][number]>>;
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
    schemaResult,
    elementResolvers,
  } = api;
  if (Typescript.isUnionTypeNode(elementLocalNode)) {
    return createThisUnionElement({
      elementMembers: elementLocalNode.types.map((someUnionMemberNode) =>
        deriveSchemaElement({
          schemaTypeChecker,
          schemaResult,
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
    'schemaTypeChecker' | 'schemaResult' | 'elementLocalNode'
  > {
  elementSourceDeclaration: Typescript.Declaration | null;
}

type ElementResolverResult<ThisSchemaElement> = ThisSchemaElement | null;

export type GetResolverSchemaElement<
  ThisElementResolver extends ElementResolver<genericAny>,
> = ThisElementResolver extends ElementResolver<infer ThisSchemaElement>
  ? ThisSchemaElement
  : never;
