import { genericAny, irrelevantAny } from '../../../../../helpers/types.ts';
import { Typescript } from '../../../../../imports/Typescript.ts';
import {
  __DeriveIntermediateSchemaApi,
  SchemaDeriveTypeQueueOperation,
} from '../../deriveIntermediateSchema.ts';
import { throwInvalidSchemaElement } from '../../errors.ts';
import { resolveElementSourceDeclaration } from '../__resolveSourceDeclaration.ts';
import {
  DEFINITIVE_ELEMENT_RESOLVERS,
  ElementResolver,
  EXPORT_ELEMENT_RESOLVERS,
  GENERIC_ELEMENT_RESOLVERS,
} from './__getElementResolvers.ts';

interface DeriveExportElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveExportElement(api: DeriveExportElementApi) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: EXPORT_ELEMENT_RESOLVERS,
  });
}

interface DeriveDefinitiveElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveDefinitiveElement(api: DeriveDefinitiveElementApi) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: DEFINITIVE_ELEMENT_RESOLVERS,
  });
}

interface DeriveGenericTemplateModelElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveGenericTemplateModelElement(
  api: DeriveGenericTemplateModelElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: GENERIC_ELEMENT_RESOLVERS,
  });
}

export interface __DeriveSchemaElementApi<
  ThisElementResolvers extends readonly [
    ElementResolver<genericAny>,
    ...Array<ElementResolver<genericAny>>,
  ],
> extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaDeriveTypeQueue: Array<SchemaDeriveTypeQueueOperation>;
  elementLocalNode: Typescript.Node;
  elementResolvers__: ThisElementResolvers;
}

function __deriveSchemaElement<
  ThisElementResolvers extends readonly [
    ElementResolver<genericAny>,
    ...Array<ElementResolver<genericAny>>,
  ],
>(
  api: __DeriveSchemaElementApi<ThisElementResolvers>,
): GetDerivedSchemaElement<ThisElementResolvers> {
  const {
    elementLocalNode,
    elementResolvers__,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
  } = api;
  const [elementLocalSymbol, elementSourceSymbol, elementSourceDeclaration] =
    Typescript.isTypeReferenceNode(elementLocalNode)
      ? resolveElementSourceDeclaration({
        schemaTypeChecker,
        localNode: elementLocalNode.typeName,
      })
      : [null, null, null];
  for (const maybeResolveElement__ of elementResolvers__) {
    const maybeSchemaElement = maybeResolveElement__({
      schemaTypeChecker,
      schemaDeriveTypeQueue,
      elementLocalNode,
      elementLocalSymbol,
      elementSourceSymbol,
      elementSourceDeclaration,
    });
    if (maybeSchemaElement) {
      return maybeSchemaElement;
    }
  }
  throwInvalidSchemaElement({
    schemaTypeChecker,
    elementLocalNode,
  });
}

type GetDerivedSchemaElement<
  ThisElementResolvers,
  SchemaElementResult = never,
> = ThisElementResolvers extends
  readonly [
    ElementResolver<infer SomeElementResolver>,
    ...infer RemainingResolvers,
  ]
  ? GetDerivedSchemaElement<
    RemainingResolvers,
    SomeElementResolver | SchemaElementResult
  >
  : SchemaElementResult;
