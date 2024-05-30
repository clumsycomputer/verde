import { genericAny, irrelevantAny } from '../../../../../helpers/types.ts';
import { Typescript } from '../../../../../imports/Typescript.ts';
import {
  __DeriveIntermediateSchemaApi,
  SchemaDeriveTypeQueueOperation,
} from '../../deriveIntermediateSchema.ts';
import { throwInvalidSchemaElement } from '../../errors.ts';
import { resolveElementSourceDeclaration } from '../__resolveSourceDeclaration.ts';
import {
  BASIC_REFERENCE_ELEMENT_RESOLVERS,
  DEFINITIVE_ELEMENT_RESOLVERS,
  DEFINITIVE_GENERAL_UNION_MEMBER_ELEMENT_RESOLVERS,
  DEFINITIVE_VERDE_ARRAY_ELEMENT_RESOLVERS,
  DEFINITIVE_VERDE_ARRAY_UNION_MEMBER_ELEMENT_RESOLVERS,
  DEFINITIVE_VERDE_TABLE_ELEMENT_RESOLVERS,
  EXPORT_ELEMENT_RESOLVERS,
  GENERIC_TEMPLATE_MODEL_ELEMENT_RESOLVERS,
  GENERIC_TEMPLATE_MODEL_GENERAL_UNION_MEMBER_ELEMENT_RESOLVERS,
  GENERIC_TEMPLATE_MODEL_REFERENCE_ELEMENT_RESOLVERS,
  GENERIC_TEMPLATE_MODEL_VERDE_ARRAY_ELEMENT_RESOLVERS,
  GENERIC_TEMPLATE_MODEL_VERDE_ARRAY_UNION_MEMBER_ELEMENT_RESOLVERS,
  GENERIC_TEMPLATE_MODEL_VERDE_TABLE_ELEMENT_RESOLVERS,
} from './RESOLVER_SETS.ts';
import { ElementResolver } from './__elementResolver.ts';

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
    elementResolvers__: GENERIC_TEMPLATE_MODEL_ELEMENT_RESOLVERS,
  });
}

interface DeriveDefinitiveVerdeArrayElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveDefinitiveVerdeArrayElement(
  api: DeriveDefinitiveVerdeArrayElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: DEFINITIVE_VERDE_ARRAY_ELEMENT_RESOLVERS,
  });
}

interface DeriveGenericTemplateModelVerdeArrayElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveGenericTemplateModelVerdeArrayElement(
  api: DeriveGenericTemplateModelVerdeArrayElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: GENERIC_TEMPLATE_MODEL_VERDE_ARRAY_ELEMENT_RESOLVERS,
  });
}

interface DeriveDefinitiveVerdeTableElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveDefinitiveVerdeTableElement(
  api: DeriveDefinitiveVerdeTableElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: DEFINITIVE_VERDE_TABLE_ELEMENT_RESOLVERS,
  });
}

interface DeriveGenericTemplateModelVerdeTableElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveGenericTemplateModelVerdeTableElement(
  api: DeriveGenericTemplateModelVerdeTableElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: GENERIC_TEMPLATE_MODEL_VERDE_TABLE_ELEMENT_RESOLVERS,
  });
}

interface DeriveDefinitiveVerdeArrayUnionMemberElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveDefinitiveVerdeArrayUnionMemberElement(
  api: DeriveDefinitiveVerdeArrayUnionMemberElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: DEFINITIVE_VERDE_ARRAY_UNION_MEMBER_ELEMENT_RESOLVERS,
  });
}

interface DeriveGenericTemplateModelVerdeArrayUnionElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveGenericTemplateModelVerdeArrayUnionMemberElement(
  api: DeriveGenericTemplateModelVerdeArrayUnionElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__:
      GENERIC_TEMPLATE_MODEL_VERDE_ARRAY_UNION_MEMBER_ELEMENT_RESOLVERS,
  });
}

interface DeriveBasicReferenceElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveBasicReferenceElement(
  api: DeriveBasicReferenceElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: BASIC_REFERENCE_ELEMENT_RESOLVERS,
  });
}

interface DeriveGenericTemplateModelVerdeTableUnionElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveGenericTemplateModelVerdeTableUnionElement(
  api: DeriveGenericTemplateModelVerdeTableUnionElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: GENERIC_TEMPLATE_MODEL_REFERENCE_ELEMENT_RESOLVERS,
  });
}

interface DeriveDefinitiveGeneralUnionMemberElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveDefinitiveGeneralUnionMemberElement(
  api: DeriveDefinitiveGeneralUnionMemberElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__: DEFINITIVE_GENERAL_UNION_MEMBER_ELEMENT_RESOLVERS,
  });
}

interface DeriveGenericTemplateModelGeneralUnionMemberElementApi extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

export function deriveGenericTemplateModelGeneralUnionMemberElement(
  api: DeriveGenericTemplateModelGeneralUnionMemberElementApi,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, elementLocalNode } = api;
  return __deriveSchemaElement({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    elementLocalNode,
    elementResolvers__:
      GENERIC_TEMPLATE_MODEL_GENERAL_UNION_MEMBER_ELEMENT_RESOLVERS,
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
): __DeriveSchemaElementResult<ThisElementResolvers> {
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

type __DeriveSchemaElementResult<
  ThisElementResolvers,
  SchemaElementResult = never,
> = ThisElementResolvers extends readonly [
  ElementResolver<infer SomeElementResolver>,
  ...infer RemainingResolvers,
] ? __DeriveSchemaElementResult<
    RemainingResolvers,
    SomeElementResolver | SchemaElementResult
  >
  : SchemaElementResult;
