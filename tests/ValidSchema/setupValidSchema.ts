import { FileSystem } from '../imports/FileSystem.ts';
import { Path } from '../imports/Path.ts';

export interface SetupValidSchemaApi {
  validSchemaModuleSource: string;
  secondarySchemaModuleSource: string;
}

export interface SetupValidSchemaResult {
  validSchemaModulePath: string;
}

export async function setupValidSchema(
  api: SetupValidSchemaApi,
): Promise<SetupValidSchemaResult> {
  const { validSchemaModuleSource, secondarySchemaModuleSource } = api;
  const thisFilePath = Path.fromFileUrl(import.meta.url);
  const testsDirectoryPath = Path.dirname(thisFilePath);
  const schemaDirectoryPath = Path.join(
    testsDirectoryPath,
    `./schemas`,
  );
  await FileSystem.emptyDir(schemaDirectoryPath);
  const validSchemaModulePath = Path.join(
    schemaDirectoryPath,
    './ValidSchema.ts',
  );
  await Deno.writeTextFile(
    validSchemaModulePath,
    validSchemaModuleSource
  );
  const secondarySchemaModulePath = Path.join(
    schemaDirectoryPath,
    './SecondarySchemaModule.ts',
  );
  await Deno.writeTextFile(
    secondarySchemaModulePath,
    secondarySchemaModuleSource
  );
  return { 
    validSchemaModulePath 
  };
}