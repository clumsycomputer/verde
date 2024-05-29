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
  genericGeneralUnionElementResolver,
  genericObjectElementResolver,
  genericTupleElementResolver,
  genericVerdeArrayElementResolver,
  genericVerdeArrayUnionElementResolver,
  genericVerdeTableElementResolver,
  genericVerdeTableUnionElementResolver,
  nullElementResolver,
  numberLiteralElementResolver,
  numberPrimitiveElementResolver,
  parameterReferenceElementResolver,
  stringLiteralElementResolver,
  stringPrimitiveElementResolver
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
    definitiveGeneralUnionElementResolver
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

export const GENERIC_ELEMENT_RESOLVERS = getGenericElementResolvers();

function getGenericElementResolvers() {
  return [
    ...getGenericStructureElementResolvers(),
    genericGeneralUnionElementResolver,
  ] as const;
}

function getGenericStructureElementResolvers() {
  return [
    ...getGenericTerminalElementResolvers(),
    genericTupleElementResolver,
    genericObjectElementResolver,
  ] as const;
}

function getGenericTerminalElementResolvers() {
  return [
    ...getBasicElementResolvers(),
    ...getGenericReferenceElementResolvers(),
    genericVerdeTableElementResolver,
    genericVerdeArrayElementResolver,
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_VERDE_TABLE_ELEMENT_RESOLVERS =
  getGenericTemplateModelVerdeTableElementResolvers()
  
function getGenericTemplateModelVerdeTableElementResolvers(){
  return [
    ...getGenericReferenceElementResolvers(),
    genericVerdeTableUnionElementResolver,
  ] as const
}

export const GENERIC_TEMPLATE_MODEL_VERDE_ARRAY_ELEMENT_RESOLVERS =
  getGenericTemplateModelVerdeArrayElementResolvers();

function getGenericTemplateModelVerdeArrayElementResolvers() {
  return [
    ...getBasicVerdeArrayElementResolvers(),
    genericVerdeArrayUnionElementResolver,
    parameterReferenceElementResolver,
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_VERDE_ARRAY_UNION_MEMBER_ELEMENT_RESOLVERS =
  getGenericTemplateModelVerdeArrayUnionMemberElementResolvers();

function getGenericTemplateModelVerdeArrayUnionMemberElementResolvers() {
  return [
    ...getPrimitiveElementResolvers(),
    ...getGenericReferenceElementResolvers(),
  ] as const;
}

export const GENERIC_TEMPLATE_MODEL_GENERAL_UNION_MEMBER_ELEMENT_RESOLVERS =
  getGenericTemplateModelGeneralUnionMemberElementResolvers();

function getGenericTemplateModelGeneralUnionMemberElementResolvers() {
  return [
    ...getGenericStructureElementResolvers(),
    nullElementResolver,
  ] as const;
}

export const GENERIC_REFERENCE_ELEMENT_RESOLVERS =
  getGenericReferenceElementResolvers();

function getGenericReferenceElementResolvers() {
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
