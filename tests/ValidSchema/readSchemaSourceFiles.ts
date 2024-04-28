import { Path } from '../imports/Path.ts';

export interface ReadSchemaSourceFilesApi {
  schemaDirectoryPath: string;
}

export async function readSchemaSources(
  api: ReadSchemaSourceFilesApi,
) {
  const {schemaDirectoryPath} = api
  const schemaSourcesResult: Record<string, string> = {}
  const schemaFileEntries = await Deno.readDir(schemaDirectoryPath)
  for await (const someSchemaFileEntry of schemaFileEntries) {
    const schemaFilePath = Path.join(schemaDirectoryPath, someSchemaFileEntry.name)
    const schemaSource = await Deno.readTextFile(schemaFilePath)
    schemaSourcesResult[someSchemaFileEntry.name] = schemaSource
  }
  return {
    schemaSources: schemaSourcesResult
  }
}
