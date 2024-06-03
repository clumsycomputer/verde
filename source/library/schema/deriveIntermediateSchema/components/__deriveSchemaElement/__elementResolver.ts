import { genericAny, irrelevantAny } from '../../../../../helpers/types.ts';
import { Typescript } from '../../../../../imports/Typescript.ts';
import {
  __CollectionElement,
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
  StructureProperty,
  TerminalElement,
  TupleElement,
  TupleSpreadReference,
  VerdeArrayElement,
  VerdeArrayUnionElement,
  VerdeTableElement,
  VerdeTableUnionElement,
} from '../../../types/SchemaElement.ts';
import {
  throwInvalidObjectStructure__NonPropertySignature,
  throwInvalidTupleStructure__UnnamedTupleProperty,
} from '../../errors.ts';
import {
  deriveAliasType,
  deriveDataModelType,
} from '../__deriveSchemaType/__deriveSchemaType.ts';
import {
  __DeriveSchemaElementApi,
  deriveBasicReferenceElement,
  deriveDefinitiveElement,
  deriveDefinitiveGeneralUnionMemberElement,
  deriveDefinitiveTupleSpreadElement,
  deriveDefinitiveVerdeArrayElement,
  deriveDefinitiveVerdeArrayUnionMemberElement,
  deriveDefinitiveVerdeTableElement,
  deriveGenericTemplateModelElement,
  deriveGenericTemplateModelGeneralUnionMemberElement,
  deriveGenericTemplateModelTupleSpreadElement,
  deriveGenericTemplateModelVerdeArrayElement,
  deriveGenericTemplateModelVerdeArrayUnionMemberElement,
  deriveGenericTemplateModelVerdeTableElement,
  deriveGenericTemplateModelVerdeTableUnionElement,
} from './__deriveSchemaElement.ts';

export function booleanLiteralElementResolver(
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

export function numberLiteralElementResolver(
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

export function stringLiteralElementResolver(
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

export function booleanPrimitiveElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<BooleanPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.BooleanKeyword
    ? { elementKind: 'booleanPrimitive' }
    : null;
}

export function numberPrimitiveElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<NumberPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.NumberKeyword
    ? { elementKind: 'numberPrimitive' }
    : null;
}

export function stringPrimitiveElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<StringPrimitiveElement> {
  const { elementLocalNode } = api;
  return elementLocalNode.kind === Typescript.SyntaxKind.StringKeyword
    ? { elementKind: 'stringPrimitive' }
    : null;
}

export function dataModelReferenceElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<DataModelReferenceElement> {
  const {
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    schemaDeriveTypeQueue,
  } = api;
  if (
    elementLocalSymbol &&
    elementSourceSymbol &&
    elementSourceDeclaration &&
    Typescript.isInterfaceDeclaration(elementSourceDeclaration)
  ) {
    schemaDeriveTypeQueue.push({
      operationDeriveSchemaType: deriveDataModelType,
      operationTypeArguments: {
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

export function aliasReferenceElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<AliasReferenceElement> {
  const {
    elementLocalSymbol,
    elementSourceSymbol,
    elementLocalNode,
    elementSourceDeclaration,
    schemaDeriveTypeQueue,
  } = api;
  if (
    elementLocalSymbol &&
    elementSourceSymbol &&
    Typescript.isTypeReferenceNode(elementLocalNode) &&
    elementSourceDeclaration &&
    Typescript.isTypeAliasDeclaration(elementSourceDeclaration) &&
    elementSourceDeclaration.typeParameters === undefined
  ) {
    schemaDeriveTypeQueue.push({
      operationDeriveSchemaType: deriveAliasType,
      operationTypeArguments: {
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

export function parameterReferenceElementResolver(
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

export function definitiveVerdeTableElementResolver(
  api: ElementResolverApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __verdeTableElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveArgumentElement__: deriveDefinitiveVerdeTableElement,
  });
}

export function genericTemplateModelVerdeTableElementResolver(
  api: ElementResolverApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __verdeTableElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveArgumentElement__: deriveGenericTemplateModelVerdeTableElement,
  });
}

interface __VerdeTableElementResolverApi<ThisParameterReferenceElement>
  extends
    Pick<
      __CollectionElementResolverApi<
        VerdeTableElement<ThisParameterReferenceElement>
      >,
      | 'schemaTypeChecker'
      | 'schemaDeriveTypeQueue'
      | 'elementLocalNode'
      | 'elementLocalSymbol'
      | 'elementSourceSymbol'
      | 'elementSourceDeclaration'
      | 'deriveArgumentElement__'
    > {}

function __verdeTableElementResolver<ThisParameterReferenceElement>(
  api: __VerdeTableElementResolverApi<ThisParameterReferenceElement>,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveArgumentElement__,
  } = api;
  return __collectionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveArgumentElement__,
    elementDeclarationName: 'VerdeTable',
    createCollectionElement__:
      createCollectionElement__verdeTableElementResolver__<
        ThisParameterReferenceElement
      >,
  });
}

function createCollectionElement__verdeTableElementResolver__<
  ThisParameterReferenceElement,
>(
  api: CreateCollectionElementApi__<
    VerdeTableElement<ThisParameterReferenceElement>
  >,
): VerdeTableElement<ThisParameterReferenceElement> {
  const { elementArguments } = api;
  return {
    elementArguments,
    elementKind: 'verdeTable',
  };
}

export function definitiveVerdeArrayElementResolver(
  api: ElementResolverApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __verdeArrayElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveArgumentElement__: deriveDefinitiveVerdeArrayElement,
  });
}

export function genericTemplateModelVerdeArrayElementResolver(
  api: ElementResolverApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __verdeArrayElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveArgumentElement__: deriveGenericTemplateModelVerdeArrayElement,
  });
}

interface __VerdeArrayElementResolverApi<ThisParameterReferenceElement>
  extends
    Pick<
      __CollectionElementResolverApi<
        VerdeArrayElement<ThisParameterReferenceElement>
      >,
      | 'schemaTypeChecker'
      | 'schemaDeriveTypeQueue'
      | 'elementLocalNode'
      | 'elementLocalSymbol'
      | 'elementSourceSymbol'
      | 'elementSourceDeclaration'
      | 'deriveArgumentElement__'
    > {}

function __verdeArrayElementResolver<ThisParameterReferenceElement>(
  api: __VerdeArrayElementResolverApi<ThisParameterReferenceElement>,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveArgumentElement__,
  } = api;
  return __collectionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveArgumentElement__,
    elementDeclarationName: 'VerdeArray',
    createCollectionElement__:
      createCollectionElement__verdeArrayElementResolver__<
        ThisParameterReferenceElement
      >,
  });
}

function createCollectionElement__verdeArrayElementResolver__<
  ThisParameterReferenceElement,
>(
  api: CreateCollectionElementApi__<
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
> extends ElementResolverApi {
  elementDeclarationName: string;
  createCollectionElement__: (
    api: CreateCollectionElementApi__<ThisCollectionElement>,
  ) => ThisCollectionElement;
  deriveArgumentElement__: (
    api: DeriveArgumentElementApi__,
  ) => ThisCollectionElement['elementArguments'][0];
}

interface CreateCollectionElementApi__<
  ThisCollectionElement extends __CollectionElement<genericAny, genericAny>,
> {
  elementArguments: [ThisCollectionElement['elementArguments'][number]];
}

interface DeriveArgumentElementApi__ extends
  Pick<
    __CollectionElementResolverApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

function __collectionElementResolver<
  ThisCollectionElement extends __CollectionElement<genericAny, genericAny>,
>(
  api: __CollectionElementResolverApi<ThisCollectionElement>,
) {
  const {
    elementSourceDeclaration,
    elementDeclarationName,
    elementLocalNode,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    createCollectionElement__,
    deriveArgumentElement__,
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
    return createCollectionElement__({
      elementArguments: [deriveArgumentElement__({
        schemaTypeChecker,
        schemaDeriveTypeQueue,
        elementLocalNode: elementLocalNode.typeArguments[0],
      })],
    });
  }
  return null;
}

export function definitiveObjectElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<
  ObjectElement<TerminalElement<never>>
> {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __objectElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    derivePropertyElement__: deriveDefinitiveElement,
  });
}

export function genericTemplateModelObjectElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<
  ObjectElement<TerminalElement<ParameterReferenceElement>>
> {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __objectElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    derivePropertyElement__: deriveGenericTemplateModelElement,
  });
}

interface __ObjectElementResolverApi<
  ThisParameterReferenceElement,
> extends ElementResolverApi {
  derivePropertyElement__: (
    api: DeriveObjectPropertyElementApi__,
  ) => ObjectElement<
    TerminalElement<ThisParameterReferenceElement>
  >['elementStructure'][string]['propertyElement'];
}

interface DeriveObjectPropertyElementApi__ extends
  Pick<
    __ObjectElementResolverApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

function __objectElementResolver<ThisParameterReferenceElement>(
  api: __ObjectElementResolverApi<ThisParameterReferenceElement>,
): ElementResolverResult<
  ObjectElement<TerminalElement<ThisParameterReferenceElement>>
> {
  const {
    elementLocalNode,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    derivePropertyElement__,
  } = api;
  if (Typescript.isTypeLiteralNode(elementLocalNode)) {
    return {
      elementKind: 'objectStructure',
      elementStructure: elementLocalNode.members.reduce<
        ObjectElement<
          TerminalElement<ThisParameterReferenceElement>
        >['elementStructure']
      >(
        (elementStructureResult, someObjectStructureNode) => {
          if (
            Typescript.isPropertySignature(someObjectStructureNode) &&
            Typescript.isIdentifier(someObjectStructureNode.name) &&
            someObjectStructureNode.type
          ) {
            const objectPropertyKey = someObjectStructureNode.name.text;
            elementStructureResult[objectPropertyKey] = {
              propertyKey: objectPropertyKey,
              propertyElement: derivePropertyElement__({
                schemaTypeChecker,
                schemaDeriveTypeQueue,
                elementLocalNode: someObjectStructureNode.type,
              }),
            };
          } else {
            throwInvalidObjectStructure__NonPropertySignature({
              objectStructureNode: someObjectStructureNode,
            });
          }
          return elementStructureResult;
        },
        {},
      ),
    };
  }
  return null;
}

export function definitiveTupleElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<TupleElement<TerminalElement<never>>> {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __tupleElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    derivePropertyElement__: deriveDefinitiveElement,
    deriveSpreadElement__: deriveDefinitiveTupleSpreadElement,
  });
}

export function genericTemplateModelTupleElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<
  TupleElement<TerminalElement<ParameterReferenceElement>>
> {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __tupleElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    derivePropertyElement__: deriveGenericTemplateModelElement,
    deriveSpreadElement__: deriveGenericTemplateModelTupleSpreadElement,
  });
}

interface __TupleElementResolverApi<
  ThisParameterReferenceElement,
> extends ElementResolverApi {
  derivePropertyElement__: (
    api: DeriveTuplePropertyElementApi__,
  ) => StructureProperty<
    TerminalElement<ThisParameterReferenceElement>
  >['propertyElement'];
  deriveSpreadElement__: (
    api: DeriveSpreadElementApi__,
  ) => TupleSpreadReference<
    TerminalElement<ThisParameterReferenceElement>
  >['spreadElement'];
}

interface DeriveTuplePropertyElementApi__ extends
  Pick<
    __TupleElementResolverApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

interface DeriveSpreadElementApi__ extends
  Pick<
    __TupleElementResolverApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

function __tupleElementResolver<
  ThisParameterReferenceElement,
>(
  api: __TupleElementResolverApi<ThisParameterReferenceElement>,
): ElementResolverResult<
  TupleElement<
    TerminalElement<ThisParameterReferenceElement>
  >
> {
  const {
    elementLocalNode,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    derivePropertyElement__,
    deriveSpreadElement__,
  } = api;
  if (Typescript.isTupleTypeNode(elementLocalNode)) {
    return {
      elementKind: 'tupleStructure',
      elementStructure: elementLocalNode.elements.map<
        TupleElement<
          TerminalElement<ThisParameterReferenceElement>
        >['elementStructure'][number]
      >(
        (someTupleStructureNode) => {
          if (Typescript.isNamedTupleMember(someTupleStructureNode)) {
            const tuplePropertyKey = someTupleStructureNode.name.text;
            return {
              propertyKey: tuplePropertyKey,
              propertyElement: derivePropertyElement__({
                schemaTypeChecker,
                schemaDeriveTypeQueue,
                elementLocalNode: someTupleStructureNode.type,
              }),
            };
          } else if (
            Typescript.isRestTypeNode(someTupleStructureNode) &&
            Typescript.isTypeReferenceNode(someTupleStructureNode.type) &&
            Typescript.isIdentifier(someTupleStructureNode.type.typeName)
          ) {
            return {
              spreadElement: deriveSpreadElement__({
                schemaTypeChecker,
                schemaDeriveTypeQueue,
                elementLocalNode: someTupleStructureNode.type,
              }),
            };
          } else {
            throwInvalidTupleStructure__UnnamedTupleProperty({
              tupleStructureNode: someTupleStructureNode,
            });
          }
        },
      ),
    };
  }
  return null;
}

export function nullElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<NullElement> {
  const { elementLocalNode } = api;
  return Typescript.isLiteralTypeNode(elementLocalNode) &&
      elementLocalNode.literal.kind === Typescript.SyntaxKind.NullKeyword
    ? { elementKind: 'null' }
    : null;
}

export function exportUnionElementResolver(api: ElementResolverApi) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __unionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    createUnionElement__: createUnionElement__exportUnionElementResolver__,
    deriveMemberElement__: deriveBasicReferenceElement,
  });
}

function createUnionElement__exportUnionElementResolver__(
  api: CreateUnionElementApi__<ExportUnionElement>,
): ExportUnionElement {
  const { elementMembers } = api;
  return {
    elementMembers,
    elementKind: 'exportUnion',
  };
}

export function definitiveGeneralUnionElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<GeneralUnionElement<TerminalElement<never>>> {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __generalUnionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__: deriveDefinitiveGeneralUnionMemberElement,
  });
}

export function genericTemplateModelGeneralUnionElementResolver(
  api: ElementResolverApi,
): ElementResolverResult<
  GeneralUnionElement<TerminalElement<ParameterReferenceElement>>
> {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __generalUnionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__: deriveGenericTemplateModelGeneralUnionMemberElement,
  });
}

interface __GeneralUnionElementResolverApi<
  ThisParameterReferenceElement,
> extends
  Pick<
    __UnionElementResolverApi<
      GeneralUnionElement<TerminalElement<ThisParameterReferenceElement>>
    >,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'elementLocalNode'
    | 'elementLocalSymbol'
    | 'elementSourceSymbol'
    | 'elementSourceDeclaration'
    | 'deriveMemberElement__'
  > {}

function __generalUnionElementResolver<
  ThisParameterReferenceElement,
>(
  api: __GeneralUnionElementResolverApi<ThisParameterReferenceElement>,
): ElementResolverResult<
  GeneralUnionElement<TerminalElement<ThisParameterReferenceElement>>
> {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__,
  } = api;
  return __unionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__,
    createUnionElement__: createUnionElement__generalUnionElementResolver__<
      ThisParameterReferenceElement
    >,
  });
}

function createUnionElement__generalUnionElementResolver__<
  ThisParameterReferenceElement,
>(
  api: CreateUnionElementApi__<
    GeneralUnionElement<TerminalElement<ThisParameterReferenceElement>>
  >,
): GeneralUnionElement<TerminalElement<ThisParameterReferenceElement>> {
  const { elementMembers } = api;
  return {
    elementMembers,
    elementKind: 'generalUnion',
  };
}

export function definitiveVerdeTableUnionElementResolver(
  api: ElementResolverApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __verdeTableUnionElementResolver<never>({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__: deriveBasicReferenceElement,
  });
}

export function genericTemplateModelVerdeTableUnionElementResolver(
  api: ElementResolverApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __verdeTableUnionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__: deriveGenericTemplateModelVerdeTableUnionElement,
  });
}

interface __VerdeTableUnionElementResolverApi<ThisParameterReferenceElement>
  extends
    Pick<
      __UnionElementResolverApi<
        VerdeTableUnionElement<ThisParameterReferenceElement>
      >,
      | 'schemaTypeChecker'
      | 'schemaDeriveTypeQueue'
      | 'elementLocalNode'
      | 'elementLocalSymbol'
      | 'elementSourceSymbol'
      | 'elementSourceDeclaration'
      | 'deriveMemberElement__'
    > {}

function __verdeTableUnionElementResolver<ThisParameterReferenceElement>(
  api: __VerdeTableUnionElementResolverApi<ThisParameterReferenceElement>,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__,
  } = api;
  return __unionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__,
    createUnionElement__: createUnionElement__verdeTableUnionElementResolver__<
      ThisParameterReferenceElement
    >,
  });
}

function createUnionElement__verdeTableUnionElementResolver__<
  ThisParameterReferenceElement,
>(
  api: CreateUnionElementApi__<
    VerdeTableUnionElement<ThisParameterReferenceElement>
  >,
): VerdeTableUnionElement<ThisParameterReferenceElement> {
  const { elementMembers } = api;
  return {
    elementMembers,
    elementKind: 'verdeTableUnion',
  };
}

export function definitiveVerdeArrayUnionElementResolver(
  api: ElementResolverApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __verdeArrayUnionElementResolver<never>({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__: deriveDefinitiveVerdeArrayUnionMemberElement,
  });
}

export function genericTemplateModelVerdeArrayUnionElementResolver(
  api: ElementResolverApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
  } = api;
  return __verdeArrayUnionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__:
      deriveGenericTemplateModelVerdeArrayUnionMemberElement,
  });
}

interface __VerdeArrayUnionElementResolverApi<
  ThisParameterReferenceElement,
> extends
  Pick<
    __UnionElementResolverApi<
      VerdeArrayUnionElement<ThisParameterReferenceElement>
    >,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'elementLocalNode'
    | 'elementLocalSymbol'
    | 'elementSourceSymbol'
    | 'elementSourceDeclaration'
    | 'deriveMemberElement__'
  > {}

function __verdeArrayUnionElementResolver<ThisParameterReferenceElement>(
  api: __VerdeArrayUnionElementResolverApi<ThisParameterReferenceElement>,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__,
  } = api;
  return __unionElementResolver({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementLocalSymbol,
    elementSourceSymbol,
    elementSourceDeclaration,
    deriveMemberElement__,
    createUnionElement__: createUnionElement__verdeArrayUnionElementResolver__<
      ThisParameterReferenceElement
    >,
  });
}

function createUnionElement__verdeArrayUnionElementResolver__<
  ThisParameterReferenceElement,
>(
  api: CreateUnionElementApi__<
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
  createUnionElement__: (
    api: CreateUnionElementApi__<ThisUnionElement>,
  ) => ThisUnionElement;
  deriveMemberElement__: (
    api: DeriveMemberElementApi__,
  ) => ThisUnionElement['elementMembers'][number];
}

interface CreateUnionElementApi__<
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
> {
  elementMembers: ThisUnionElement['elementMembers'];
}

interface DeriveMemberElementApi__ extends
  Pick<
    __UnionElementResolverApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

function __unionElementResolver<
  ThisUnionElement extends __UnionElement<genericAny, genericAny>,
>(
  api: __UnionElementResolverApi<ThisUnionElement>,
) {
  const {
    elementLocalNode,
    createUnionElement__,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    deriveMemberElement__,
  } = api;
  if (Typescript.isUnionTypeNode(elementLocalNode)) {
    return createUnionElement__({
      elementMembers: elementLocalNode.types.map((someUnionMemberNode) =>
        deriveMemberElement__({
          schemaTypeChecker,
          schemaDeriveTypeQueue,
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
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {
  elementLocalSymbol: Typescript.Symbol | null;
  elementSourceSymbol: Typescript.Symbol | null;
  elementSourceDeclaration: Typescript.Declaration | null;
}

type ElementResolverResult<ThisSchemaElement> = ThisSchemaElement | null;
