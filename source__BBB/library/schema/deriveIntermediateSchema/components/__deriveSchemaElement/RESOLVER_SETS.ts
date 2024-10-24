import {
  aliasReferenceElementResolver,
  booleanLiteralElementResolver,
  booleanPrimitiveElementResolver,
  dataModelReferenceElementResolver,
  definitiveGeneralUnionElementResolver,
  definitiveObjectElementResolver,
  definitiveTupleElementResolver,
  definitiveVerdeArrayElementResolver,
  definitiveVerdeArrayUnionElementResolver,
  definitiveVerdeTableElementResolver,
  definitiveVerdeTableUnionElementResolver,
  exportUnionElementResolver,
  genericTemplateModelGeneralUnionElementResolver,
  genericTemplateModelObjectElementResolver,
  genericTemplateModelTupleElementResolver,
  genericTemplateModelVerdeArrayElementResolver,
  genericTemplateModelVerdeArrayUnionElementResolver,
  genericTemplateModelVerdeTableElementResolver,
  genericTemplateModelVerdeTableUnionElementResolver,
  nullElementResolver,
  numberLiteralElementResolver,
  numberPrimitiveElementResolver,
  parameterReferenceElementResolver,
  stringLiteralElementResolver,
  stringPrimitiveElementResolver,
} from './__elementResolver.ts';

export const EXPORT_ELEMENT_RESOLVERS = getExportElementResolvers();

function getExportElementResolvers() {
  return [
    ...getBasicReferenceElementResolvers(),
    exportUnionElementResolver,
  ] as const;
}

export const DEFINITIVE_ELEMENT_RESOLVERS = getDefinitiveElementResolvers();

function getDefinitiveElementResolvers() {
  return [
    ...getDefinitiveStructureElementResolvers(),
    definitiveGeneralUnionElementResolver,
  ] as const;
}

export const DEFINITIVE_STRUCTURE_ELEMENT_RESOLVERS =
  getDefinitiveStructureElementResolvers();

function getDefinitiveStructureElementResolvers() {
  return [
    ...getDefinitiveTerminalElementResolvers(),
    definitiveTupleElementResolver,
    definitiveObjectElementResolver,
  ] as const;
}

function getDefinitiveTerminalElementResolvers() {
  return [
    ...getBasicElementResolvers(),
    ...getBasicReferenceElementResolvers(),
    definitiveVerdeTableElementResolver,
    definitiveVerdeArrayElementResolver,
  ] as const;
}

export const DEFINITIVE_VERDE_ARRAY_ELEMENT_RESOLVERS =
  getDefinitiveVerdeArrayElementResolvers();

function getDefinitiveVerdeArrayElementResolvers() {
  return [
    ...getBasicVerdeArrayElementResolvers(),
    definitiveVerdeArrayUnionElementResolver,
  ] as const;
}

export const DEFINITIVE_VERDE_TABLE_ELEMENT_RESOLVERS =
  getDefinitiveVerdeTableElementResolvers();

function getDefinitiveVerdeTableElementResolvers() {
  return [
    ...getBasicReferenceElementResolvers(),
    definitiveVerdeTableUnionElementResolver,
  ] as const;
}

export const DEFINITIVE_TUPLE_SPREAD_ELEMENT_RESOLVERS =
  getDefinitiveTupleSpreadElementResolvers();

function getDefinitiveTupleSpreadElementResolvers() {
  return [
    aliasReferenceElementResolver,
  ] as const;
}

export const DEFINITIVE_VERDE_ARRAY_UNION_MEMBER_ELEMENT_RESOLVERS =
  getDefinitiveVerdeArrayUnionMemberElementResolvers();

function getDefinitiveVerdeArrayUnionMemberElementResolvers() {
  return [
    ...getPrimitiveElementResolvers(),
    ...getBasicReferenceElementResolvers(),
  ] as const;
}

export const DEFINITIVE_GENERAL_UNION_MEMBER_ELEMENT_RESOLVERS =
  getDefinitiveGeneralUnionElementResolvers();

function getDefinitiveGeneralUnionElementResolvers() {
  return [
    ...getDefinitiveStructureElementResolvers(),
    nullElementResolver,
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_ELEMENT_RESOLVERS =
  getGenericTemplateModelElementResolvers();

function getGenericTemplateModelElementResolvers() {
  return [
    ...getGenericTemplateModelStructureElementResolvers(),
    genericTemplateModelGeneralUnionElementResolver,
  ] as const;
}

function getGenericTemplateModelStructureElementResolvers() {
  return [
    ...getGenericTemplateModeTerminalElementResolvers(),
    genericTemplateModelTupleElementResolver,
    genericTemplateModelObjectElementResolver,
  ] as const;
}

function getGenericTemplateModeTerminalElementResolvers() {
  return [
    ...getBasicElementResolvers(),
    ...getGenericTemplateModelReferenceElementResolvers(),
    genericTemplateModelVerdeTableElementResolver,
    genericTemplateModelVerdeArrayElementResolver,
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_VERDE_TABLE_ELEMENT_RESOLVERS =
  getGenericTemplateModelVerdeTableElementResolvers();

function getGenericTemplateModelVerdeTableElementResolvers() {
  return [
    ...getGenericTemplateModelReferenceElementResolvers(),
    genericTemplateModelVerdeTableUnionElementResolver,
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_VERDE_ARRAY_ELEMENT_RESOLVERS =
  getGenericTemplateModelVerdeArrayElementResolvers();

function getGenericTemplateModelVerdeArrayElementResolvers() {
  return [
    ...getBasicVerdeArrayElementResolvers(),
    genericTemplateModelVerdeArrayUnionElementResolver,
    parameterReferenceElementResolver,
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_TUPLE_SPREAD_ELEMENT_RESOLVERS =
  getGenericTemplateModelTupleSpreadElementResolvers();

function getGenericTemplateModelTupleSpreadElementResolvers() {
  return [
    aliasReferenceElementResolver,
    parameterReferenceElementResolver
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_VERDE_ARRAY_UNION_MEMBER_ELEMENT_RESOLVERS =
  getGenericTemplateModelVerdeArrayUnionMemberElementResolvers();

function getGenericTemplateModelVerdeArrayUnionMemberElementResolvers() {
  return [
    ...getPrimitiveElementResolvers(),
    ...getGenericTemplateModelReferenceElementResolvers(),
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_GENERAL_UNION_MEMBER_ELEMENT_RESOLVERS =
  getGenericTemplateModelGeneralUnionMemberElementResolvers();

function getGenericTemplateModelGeneralUnionMemberElementResolvers() {
  return [
    ...getGenericTemplateModelStructureElementResolvers(),
    nullElementResolver,
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_REFERENCE_ELEMENT_RESOLVERS =
  getGenericTemplateModelReferenceElementResolvers();

function getGenericTemplateModelReferenceElementResolvers() {
  return [
    ...getBasicReferenceElementResolvers(),
    parameterReferenceElementResolver,
  ] as const;
}

function getBasicVerdeArrayElementResolvers() {
  return [
    ...getPrimitiveElementResolvers(),
    ...getBasicReferenceElementResolvers(),
  ] as const;
}

export const BASIC_REFERENCE_ELEMENT_RESOLVERS =
  getBasicReferenceElementResolvers();

function getBasicReferenceElementResolvers() {
  return [
    dataModelReferenceElementResolver,
    aliasReferenceElementResolver,
  ] as const;
}

function getBasicElementResolvers() {
  return [
    ...getLiteralElementResolvers(),
    ...getPrimitiveElementResolvers(),
  ] as const;
}

export const PRIMITIVE_ELEMENT_RESOLVERS = getPrimitiveElementResolvers();

function getPrimitiveElementResolvers() {
  return [
    booleanPrimitiveElementResolver,
    numberPrimitiveElementResolver,
    stringPrimitiveElementResolver,
  ] as const;
}

function getLiteralElementResolvers() {
  return [
    booleanLiteralElementResolver,
    numberLiteralElementResolver,
    stringLiteralElementResolver,
  ] as const;
}
