export const expectedDeriveIntermediateSchemaErrors = {
  'Schema__CodeExport.ts':
    'invalid schema module: code export at "/home/verde/tests/InvalidSchema/schemas/Schema__CodeExport.ts"',
  'Schema__DefaultCodeExport.ts':
    'invalid schema module: code export at "/home/verde/tests/InvalidSchema/schemas/Schema__DefaultCodeExport.ts"',
  'Schema__GenericTypeAliasExport.ts':
    'invalid schema module: generic type-alias export at "/home/verde/tests/InvalidSchema/schemas/Schema__GenericTypeAliasExport.ts"',
  'Schema__MultipleExports.ts':
    'invalid schema module: multiple exports at "/home/verde/tests/InvalidSchema/schemas/Schema__MultipleExports.ts"',
  'Schema__NoExports.ts':
    'invalid schema module: no exports at "/home/verde/tests/InvalidSchema/schemas/Schema__NoExports.ts"',
  'Schema__NonTypeAliasExport.ts':
    'invalid schema module: non type-alias export at "/home/verde/tests/InvalidSchema/schemas/Schema__NonTypeAliasExport.ts"',
  'Schema__UndefinedTemplateArgument.ts':
    'invalid model template: default parameter arguments not supported (extends Model__BB on Model__AA)',
  'Schema__CustomGenericTypeAliasElement.ts':
    'invalid schema element: Alias__AA<never> at aaProperty__AA: Alias__AA<never>;',
  'Schema__IndirectModelName.ts':
    'invalid type import: "Model__AA as Model__BB"',
  'Schema__DoubleDeclarationModel.ts':
    'invalid model declaration: "Model__AA" has multiple declarations',
  'Schema__Undefined.ts':
    'invalid schema module: "/home/verde/tests/InvalidSchema/schemas/Schema__Undefined.ts" does not exist',
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
