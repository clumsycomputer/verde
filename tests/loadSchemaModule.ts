import { loadSchemaModule } from '../source/loadSchemaModule.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from './imports/Assert.ts';

Deno.test({ name: `non-existent "schemaModulePath"` }, () => {
  const nonExistentCasePath = resolveCasePath({
    someCaseName: 'NonExistentCase',
  });
  Assert.assertThrows(
    () => {
      loadSchemaModule({
        schemaModulePath: nonExistentCasePath,
      });
    },
    Error,
    `schemaModulePath: "${nonExistentCasePath}" doesn't exist`,
  );
});

Deno.test({ name: 'no exports at "schemaModulePath"' }, () => {
  const emptyFileCasePath = resolveCasePath({
    someCaseName: 'EmptyFile',
  });
  Assert.assertThrows(
    () => {
      loadSchemaModule({
        schemaModulePath: emptyFileCasePath,
      });
    },
    Error,
    `invalid schema module: no exports at "${emptyFileCasePath}"`,
  );
});

Deno.test({ name: 'multiple exports at "schemaModulePath"' }, () => {
  const multipleExportsCasePath = resolveCasePath({
    someCaseName: 'MultipleExports',
  });
  Assert.assertThrows(
    () => {
      loadSchemaModule({
        schemaModulePath: multipleExportsCasePath,
      });
    },
    Error,
    `invalid schema module: multiple exports at "${multipleExportsCasePath}"`,
  );
});

Deno.test({ name: 'interface export at "schemaModulePath"' }, () => {
  const interfaceExportCasePath = resolveCasePath({
    someCaseName: 'InterfaceExport',
  });
  Assert.assertThrows(
    () => {
      loadSchemaModule({
        schemaModulePath: interfaceExportCasePath,
      });
    },
    Error,
    `invalid schema module: interface export at "${interfaceExportCasePath}"`,
  );
});

Deno.test({ name: 'non-type export at "schemaModulePath"' }, () => {
  const codeExportCasePath = resolveCasePath({
    someCaseName: 'CodeExport',
  });
  Assert.assertThrows(
    () => {
      loadSchemaModule({
        schemaModulePath: codeExportCasePath,
      });
    },
    Error,
    `invalid schema module: non-type export at "${codeExportCasePath}"`,
  );
});

Deno.test({ name: 'default non-type export at "schemaModulePath"' }, () => {
  const defaultExportCasePath = resolveCasePath({
    someCaseName: 'DefaultCodeExport',
  });
  Assert.assertThrows(
    () => {
      loadSchemaModule({
        schemaModulePath: defaultExportCasePath,
      });
    },
    Error,
    `invalid schema module: non-type export at "${defaultExportCasePath}"`,
  );
});

Deno.test({ name: 'valid schema module format' }, () => {
  const basicSchemaCasePath = resolveCasePath({
    someCaseName: 'BasicSchema',
  });
  const { lhsSchemaExportSymbol, rhsSchemaExportType } = loadSchemaModule({
    schemaModulePath: basicSchemaCasePath,
  });
  Assert.assert(lhsSchemaExportSymbol.name === 'BasicSchema');
  Assert.assert(rhsSchemaExportType.symbol.name === 'ProvidedVerdeSchema');
});
