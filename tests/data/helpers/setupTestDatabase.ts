import { FileSystem } from '../../../source/imports/FileSystem.ts';
import { DataSchema } from '../../../source/library/module.ts';
import { Path } from '../../imports/Path.ts';

export interface SetupTestDatabaseApi {
  testDataDirectoryPath: string;
  dataSchema: DataSchema;
}

export async function setupTestDatabase(api: SetupTestDatabaseApi) {
  const { testDataDirectoryPath, dataSchema } = api;
  await FileSystem.emptyDir(testDataDirectoryPath);
  await Promise.all(
    Object.values(dataSchema.schemaMap).map(async (someDataModel) => {
      const modelDataDirectoryPath = Path.join(
        testDataDirectoryPath,
        `./${someDataModel.modelSymbol}`,
      );
      await FileSystem.emptyDir(modelDataDirectoryPath);
      const initialModelHeadPageFile = await Deno.create(
        Path.join(modelDataDirectoryPath, `./0.data`),
      );
      initialModelHeadPageFile.close();
    }),
  );
}