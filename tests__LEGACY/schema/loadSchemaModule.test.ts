import { loadSchemaModule } from '../../source/library/schema/deriveIntermediateSchema/components/loadSchemaModule.ts';
import { resolveCasePath } from './helpers/resolveCasePath.ts';
import { Assert } from '../imports/Assert.ts';

Deno.test('loadSchemaModule', async (testContext) => {
  await testContext.step('module errors', async (subTestContext) => {
    await subTestContext.step('path does not exist', () => {
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
        `invalid schema module: "${nonExistentCasePath}" does not exist`,
      );
    })
    await subTestContext.step('no exports', () => {
      const noExportsCasePath = resolveCasePath({
        someCaseName: 'Error_InvalidSchemaModule_NoExports',
      });
      Assert.assertThrows(
        () => {
          loadSchemaModule({
            schemaModulePath: noExportsCasePath,
          });
        },
        Error,
        `invalid schema module: no exports at "${noExportsCasePath}"`,
      );
    })
    await subTestContext.step('multiple exports', () => {
      const multipleExportsCasePath = resolveCasePath({
        someCaseName: 'Error_InvalidSchemaModule_MultipleExports',
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
    })
    await subTestContext.step('code export', () => {
      const codeExportCasePath = resolveCasePath({
        someCaseName: 'Error_InvalidSchemaModule_CodeExport',
      });
      Assert.assertThrows(
        () => {
          loadSchemaModule({
            schemaModulePath: codeExportCasePath,
          });
        },
        Error,
        `invalid schema module: code export at "${codeExportCasePath}"`,
      );
    })
    await subTestContext.step('default code export', () => {
      const defaultCodeExportCasePath = resolveCasePath({
        someCaseName: 'Error_InvalidSchemaModule_DefaultCodeExport',
      });
      Assert.assertThrows(
        () => {
          loadSchemaModule({
            schemaModulePath: defaultCodeExportCasePath,
          });
        },
        Error,
        `invalid schema module: code export at "${defaultCodeExportCasePath}"`,
      );
    })
    await subTestContext.step('non type-alias export', () => {
      const nonTypeAliasExportCasePath = resolveCasePath({
        someCaseName: 'Error_InvalidSchemaModule_NonTypeAliasExport',
      });
      Assert.assertThrows(
        () => {
          loadSchemaModule({
            schemaModulePath: nonTypeAliasExportCasePath,
          });
        },
        Error,
        `invalid schema module: non type-alias export at "${nonTypeAliasExportCasePath}"`,
      );
    })
    await subTestContext.step('generic type-alias export', () => {
      const genericTypeAliasExportCasePath = resolveCasePath({
        someCaseName: 'Error_InvalidSchemaModule_GenericTypeAliasExport',
      });
      Assert.assertThrows(
        () => {
          loadSchemaModule({
            schemaModulePath: genericTypeAliasExportCasePath,
          });
        },
        Error,
        `invalid schema module: generic type-alias export at "${genericTypeAliasExportCasePath}"`,
      );
    })
  })
  await testContext.step('valid schema module', () => {
    const validSchemaCasePath = resolveCasePath({
      someCaseName: 'ValidSchema',
    });
    const { lhsSchemaExportSymbol } = loadSchemaModule({
      schemaModulePath: validSchemaCasePath,
    });
    Assert.assert(lhsSchemaExportSymbol.name === 'ValidSchema');
  })
})