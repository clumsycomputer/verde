import { __loadSchemaModule } from '../source/library/deriveIntermediateSchema/components/loadSchemaModule.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from './imports/Assert.ts';

Deno.test({ name: `invalid schema module => path does not exist` }, () => {
  const nonExistentCasePath = resolveCasePath({
    someCaseName: 'NonExistentCase',
  });
  Assert.assertThrows(
    () => {
      __loadSchemaModule({
        schemaModulePath: nonExistentCasePath,
      });
    },
    Error,
    `invalid schema module: "${nonExistentCasePath}" does not exist`,
  );
});

Deno.test({ name: 'invalid schema module => no exports' }, () => {
  const noExportsCasePath = resolveCasePath({
    someCaseName: 'Error_InvalidSchemaModule_NoExports',
  });
  Assert.assertThrows(
    () => {
      __loadSchemaModule({
        schemaModulePath: noExportsCasePath,
      });
    },
    Error,
    `invalid schema module: no exports at "${noExportsCasePath}"`,
  );
});

Deno.test({ name: 'invalid schema module => multiple exports' }, () => {
  const multipleExportsCasePath = resolveCasePath({
    someCaseName: 'Error_InvalidSchemaModule_MultipleExports',
  });
  Assert.assertThrows(
    () => {
      __loadSchemaModule({
        schemaModulePath: multipleExportsCasePath,
      });
    },
    Error,
    `invalid schema module: multiple exports at "${multipleExportsCasePath}"`,
  );
});

Deno.test({ name: 'invalid schema module => code export' }, () => {
  const codeExportCasePath = resolveCasePath({
    someCaseName: 'Error_InvalidSchemaModule_CodeExport',
  });
  Assert.assertThrows(
    () => {
      __loadSchemaModule({
        schemaModulePath: codeExportCasePath,
      });
    },
    Error,
    `invalid schema module: code export at "${codeExportCasePath}"`,
  );
});

Deno.test({ name: 'invalid schema module => default code export' }, () => {
  const defaultCodeExportCasePath = resolveCasePath({
    someCaseName: 'Error_InvalidSchemaModule_DefaultCodeExport',
  });
  Assert.assertThrows(
    () => {
      __loadSchemaModule({
        schemaModulePath: defaultCodeExportCasePath,
      });
    },
    Error,
    `invalid schema module: code export at "${defaultCodeExportCasePath}"`,
  );
});

Deno.test({ name: 'invalid schema module => non type-alias export' }, () => {
  const nonTypeAliasExportCasePath = resolveCasePath({
    someCaseName: 'Error_InvalidSchemaModule_NonTypeAliasExport',
  });
  Assert.assertThrows(
    () => {
      __loadSchemaModule({
        schemaModulePath: nonTypeAliasExportCasePath,
      });
    },
    Error,
    `invalid schema module: non type-alias export at "${nonTypeAliasExportCasePath}"`,
  );
});

Deno.test(
  { name: 'invalid schema module => generic type-alias export' },
  () => {
    const genericTypeAliasExportCasePath = resolveCasePath({
      someCaseName: 'Error_InvalidSchemaModule_GenericTypeAliasExport',
    });
    Assert.assertThrows(
      () => {
        __loadSchemaModule({
          schemaModulePath: genericTypeAliasExportCasePath,
        });
      },
      Error,
      `invalid schema module: generic type-alias export at "${genericTypeAliasExportCasePath}"`,
    );
  },
);

Deno.test({ name: 'valid schema module' }, () => {
  const validSchemaCasePath = resolveCasePath({
    someCaseName: 'ValidSchema',
  });
  const { lhsSchemaExportSymbol } = __loadSchemaModule({
    schemaModulePath: validSchemaCasePath,
  });
  Assert.assert(lhsSchemaExportSymbol.name === 'ValidSchema');
});
