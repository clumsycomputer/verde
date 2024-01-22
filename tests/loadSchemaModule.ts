import { loadSchemaModule } from '../source/loadSchemaModule.ts';
import { Path } from './imports/Path.ts';
import { Assert } from './imports/Assert.ts';

const testsDirectoryPath = Path.dirname(new URL(import.meta.url).pathname);

Deno.test({ name: `non-existent "schemaModulePath"` }, () => {
  const basicSchemaCasePath = Path.join(
    testsDirectoryPath,
    './nonExistentPath.ts',
  );
  try {
    loadSchemaModule({
      schemaModulePath: basicSchemaCasePath,
    });
  } catch (someError) {
    Assert.assert(
      someError instanceof Error &&
        someError.message ===
          `schemaModulePath: "${basicSchemaCasePath}" doesn't exist`,
    );
  }
});

Deno.test({ name: 'no exports at "schemaModulePath"' }, () => {
  const emptyFileCasePath = Path.join(
    testsDirectoryPath,
    './cases/EmptyFile.ts',
  );
  try {
    loadSchemaModule({
      schemaModulePath: emptyFileCasePath,
    });
  } catch (someError) {
    Assert.assert(
      someError instanceof Error &&
        someError.message ===
          `invalid schema module: no exports at "${emptyFileCasePath}"`,
    );
  }
});

Deno.test({ name: 'multiple exports at "schemaModulePath"' }, async () => {
  const multipleExportsCasePath = Path.join(
    testsDirectoryPath,
    './cases/MultipleExports.ts',
  );
  try {
    loadSchemaModule({
      schemaModulePath: multipleExportsCasePath,
    });
  } catch (someError) {
    Assert.assert(
      someError instanceof Error &&
        someError.message ===
          `invalid schema module: multiple exports at "${multipleExportsCasePath}"`,
    );
  }
});

Deno.test({ name: 'valid schema module format' }, () => {
  const basicSchemaCasePath = Path.join(
    testsDirectoryPath,
    './cases/BasicSchema.ts',
  );
  const {lhsSchemaExportSymbol, rhsSchemaExportType} = loadSchemaModule({
    schemaModulePath: basicSchemaCasePath,
  });
  Assert.assert(lhsSchemaExportSymbol.name === 'BasicSchema')
  Assert.assert(rhsSchemaExportType.symbol.name === 'ProvidedVerdeSchema')
});
