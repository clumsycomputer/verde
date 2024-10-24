export const expectedDeriveIntermediateSchemaErrors = {
  'Schema__UndefinedTemplateArgument.ts':
    'invalid model template: default parameter arguments not supported (extends Model__BB on Model__AA)',
  'Schema__CustomGenericTypeAliasElement.ts':
    'invalid schema element: Alias__AA<never> at aaProperty__AA: Alias__AA<never>;',
  'Schema__IndirectModelName.ts':
    'invalid type import: "Model__AA as Model__BB"',
  'Schema__DoubleDeclarationModel.ts':
    'invalid model declaration: "Model__AA" has multiple declarations',
  'Schema__DataModelRegistered.ts':
    'invalid type usage (concreteTemplateModel): "Model__AA" already registered as "dataModel"',
  'Schema__ConcreteTemplateModelRegistered.ts':
    'invalid type usage (dataModel): "Model__BB" already registered as "concreteTemplateModel"',
  'Schema__AliasRegistered.ts':
    'invalid type usage (dataModel): "SharedReferenceTypeName" already registered as "alias"',
  'Schema__PrivateDoubleDeclaration.ts':
    'invalid type declaration: "Model__AA" is defined in multiple files',
  'Schema__DefaultParameterArgument.ts':
    'invalid generic template model parameter: default arguments not supported ("BbParameter__AA" on "Model__BB")',
  'Schema__DefaultParameterArgumentEmpty.ts':
    'invalid model template: default parameter arguments not supported (extends Model__BB on Model__AA)',
  'Schema__UnnamedTupleProperty.ts':
    'invalid tuple structure: tuple properties must have a name ("[number]")',
  'Schema__TupleArraySpread.ts':
    'invalid schema element: Array<string> at ...Array<string>',
  'Schema__ModelIndexProperty.ts':
    'invalid model: non-property signature ("[aaKey: string]: string;" in "interface Model__AA {\n  [aaKey: string]: string;\n}")',
  'Schema__ObjectIndexProperty.ts':
    'invalid object structure: non-property signature ("[__aaKey: string]: string;" in "{\n    [__aaKey: string]: string;\n  }")',
};
