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
  'Schema__IndirectModelName.ts': 'indirect model name: "Model__AA as Model__BB"',
  'Schema__DoubleDeclarationModel.ts':
    'invalid model declaration: "Model__AA" has multiple declarations',
};
