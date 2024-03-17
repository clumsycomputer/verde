import { FileSystem } from '../../../source/imports/FileSystem.ts';
import { DataSchema } from '../../../source/library/module.ts';
import { Path } from '../../imports/Path.ts';

export interface SetupTestDatabaseApi {
  testDataDirectoryPath: string;
  recordSchema: DataSchema;
}

export async function setupTestDatabase(api: SetupTestDatabaseApi) {
  const { testDataDirectoryPath, recordSchema } = api;
  await FileSystem.emptyDir(testDataDirectoryPath);
  await Promise.all(
    Object.values(recordSchema.schemaMap).map(async (someSchemaModel) => {
      const modelDataDirectoryPath = Path.join(
        testDataDirectoryPath,
        `./${someSchemaModel.modelSymbol}`,
      );
      await FileSystem.emptyDir(modelDataDirectoryPath);
      const initialModelHeadPageFile = await Deno.create(
        Path.join(modelDataDirectoryPath, `./0.data`),
      );
      initialModelHeadPageFile.close();
    }),
  );
}