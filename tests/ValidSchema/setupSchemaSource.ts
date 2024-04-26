import { throwInvalidPathError } from '../../source/helpers/throwError.ts';
import { FileSystem } from '../imports/FileSystem.ts';
import { Path } from '../imports/Path.ts';

export interface SetupSchemaSourceApi {
  schemaSourceModules: Array<[
    moduleName: string,
    moduleSource: string,
  ]>;
}

export async function setupSchemaSource(
  api: SetupSchemaSourceApi,
) {
  const { schemaSourceModules } = api;
  const thisFilePath = Path.fromFileUrl(import.meta.url);
  const testsDirectoryPath = Path.dirname(thisFilePath);
  const schemaDirectoryPath = Path.join(
    testsDirectoryPath,
    `./__source`,
  );
  await FileSystem.emptyDir(schemaDirectoryPath);
  const writtenSchemaModules = await Promise.all(
    schemaSourceModules.map(([moduleName, moduleSource]) => {
      const moduleSourcePath = Path.join(
        schemaDirectoryPath,
        `./${moduleName}.ts`,
      );
      return Promise.all([
        moduleSourcePath,
        Deno.writeTextFile(moduleSourcePath, moduleSource),
      ]);
    }),
  );
  const schemaEntryModulePath = writtenSchemaModules[0]
    ? writtenSchemaModules[0][0]
    : throwInvalidPathError('schemaEntryModulePath');
  return schemaEntryModulePath;
}
