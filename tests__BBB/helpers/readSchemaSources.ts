import { throwInvalidPathError } from '../../source/helpers/throwError.ts';
import { Path } from '../imports/Path.ts';

export interface ReadSchemaSourcesApi {
  schemaDirectoryPath: string;
}

export async function readSchemaSources(
  api: ReadSchemaSourcesApi,
) {
  const { schemaDirectoryPath } = api;
  const schemaSourcesResult: Record<string, string> = {}
  const schemaFileEntries = await Deno.readDir(schemaDirectoryPath);
  for await (const someSchemaFileEntry of schemaFileEntries) {
    if (someSchemaFileEntry.isFile) {
      const schemaFilePath = Path.join(
        schemaDirectoryPath,
        someSchemaFileEntry.name,
      );
      const schemaSource = await Deno.readTextFile(schemaFilePath);
      schemaSourcesResult[someSchemaFileEntry.name] = schemaSource;
    }
    else {
      throwInvalidPathError('readSchemaSources')
    } 
  }
  return {
    schemaSources: schemaSourcesResult,
  };
}
