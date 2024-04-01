import { FileSystem } from '../../../source/imports/FileSystem.ts';
import { DataSchema } from '../../../source/library/module.ts';
import { Path } from '../../imports/Path.ts';

export interface SetupTestDatabaseApi {
  dataDirectoryPath: string;
  dataSchema: DataSchema;
}

export async function setupTestDatabase(api: SetupTestDatabaseApi) {
  const { dataDirectoryPath, dataSchema } = api;
  await FileSystem.emptyDir(dataDirectoryPath);
  await Promise.all(
    Object.values(dataSchema.schemaMap).map(async (someDataModel) => {
      const modelDataDirectoryPath = Path.join(
        dataDirectoryPath,
        `./${someDataModel.modelSymbol}`,
      );
      await FileSystem.emptyDir(modelDataDirectoryPath);
      await Deno.writeFile(
        Path.join(modelDataDirectoryPath, `./0.data`),
        new Uint8Array()
      );
    }),
  );
}