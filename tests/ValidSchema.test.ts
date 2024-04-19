import { deriveIntermediateSchema } from '../source/library/module.ts';
import { Assert } from './imports/Assert.ts';
import { FileSystem } from './imports/FileSystem.ts';
import { Path } from './imports/Path.ts';

Deno.test('ValidSchema', async (rootContext) => {
  const { validSchemaModulePath, sourceSchemaOutline } =
    await setupValidSchema();
  const validIntermediateSchema = deriveIntermediateSchema({
    schemaModulePath: validSchemaModulePath,
  });
  await Promise.all([
    assertDeriveIntermediateSchemaBehavior({
      rootContext,
      sourceSchemaOutline,
      validIntermediateSchema
    }),
  ]);
});

interface SetupValidSchemaResult {
  validSchemaModulePath: string;
  sourceSchemaOutline: SourceSchemaOutline;
}

async function setupValidSchema(): Promise<SetupValidSchemaResult> {
  const initialSchemaOutline: InitialSchemaOutline = {
    schemaSymbol: 'ValidSchema',
    schemaExports: ['BasicDataModel'],
    schemaModels: {
      BasicDataModel: {
        modelSymbol: 'BasicDataModel',
        modelProperties: {
          stringProperty: {
            propertyKey: 'stringProperty',
            propertyElementSymbol: 'string',
          },
          numberProperty: {
            propertyKey: 'numberProperty',
            propertyElementSymbol: 'number',
          },
          booleanProperty: {
            propertyKey: 'booleanProperty',
            propertyElementSymbol: 'boolean',
          },
        },
      },
    },
  };
  const sourceModelsOutlines: SourceSchemaOutline['schemaModels'] = Object
    .values(initialSchemaOutline.schemaModels)
    .reduce<Record<string, SourceModelOutline>>(
      (modelsSourceOutlineResult, { modelProperties, modelSymbol }) => {
        const propertiesSourceOutline = Object.values(
          modelProperties,
        ).reduce<Record<string, SourcePropertyOutline>>(
          (
            propertiesSourceOutlineResult,
            { propertyKey, propertyElementSymbol },
          ) => {
            propertiesSourceOutlineResult[propertyKey] = {
              propertyKey,
              propertyElementSymbol,
              propertySource: `${propertyKey}: ${propertyElementSymbol};`,
            };
            return propertiesSourceOutlineResult;
          },
          {},
        );
        modelsSourceOutlineResult[modelSymbol] = {
          modelSymbol,
          modelProperties: propertiesSourceOutline,
          modelSource: `interface ${modelSymbol} {${
            Object.values(propertiesSourceOutline).reduce((
              propertySourceResult,
              { propertySource },
            ) => `${propertySourceResult}\n  ${propertySource}`, '')
          }\n}`,
        };
        return modelsSourceOutlineResult;
      },
      {},
    );
  const sourceSchemaOutline: SourceSchemaOutline = {
    ...initialSchemaOutline,
    schemaModels: sourceModelsOutlines,
    schemaSource: `export type ${initialSchemaOutline.schemaSymbol} = [${
      initialSchemaOutline.schemaExports.join(',')
    }]; ${
      Object.values(sourceModelsOutlines).reduce(
        (modelsSourceResult, { modelSource }) =>
          `${modelsSourceResult}\n\n${modelSource}`,
        '',
      )
    }`,
  };
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
    sourceSchemaOutline.schemaSource,
  );
  return { sourceSchemaOutline, validSchemaModulePath };
}

interface InitialSchemaOutline extends __SchemaOutline<IntialModelOutline> {}

interface IntialModelOutline extends __ModelOutline<InitialPropertyOutline> {}

interface InitialPropertyOutline extends __PropertyOutline {}

interface SourceSchemaOutline extends __SchemaOutline<SourceModelOutline> {
  schemaSource: string;
}

interface SourceModelOutline extends __ModelOutline<SourcePropertyOutline> {
  modelSource: string;
}

interface SourcePropertyOutline extends __PropertyOutline {
  propertySource: string;
}

interface __SchemaOutline<ThisOutlineModel> {
  schemaSymbol: string;
  schemaExports: Array<string>;
  schemaModels: Record<string, ThisOutlineModel>;
}

interface __ModelOutline<ThisOutlineProperty> {
  modelSymbol: string;
  modelProperties: Record<string, ThisOutlineProperty>;
}

interface __PropertyOutline {
  propertyKey: string;
  propertyElementSymbol: string;
}

interface AssertDeriveIntermediateSchemaBehaviorApi
  extends Pick<SetupValidSchemaResult, 'sourceSchemaOutline'> {
  rootContext: Deno.TestContext;
  validIntermediateSchema: ReturnType<typeof deriveIntermediateSchema>;
}

function assertDeriveIntermediateSchemaBehavior(
  api: AssertDeriveIntermediateSchemaBehaviorApi,
) {
  const { rootContext, sourceSchemaOutline, validIntermediateSchema } = api;
  return rootContext.step('deriveIntermediateSchema', async (contextAaa) => {
    await contextAaa.step(
      'model properties',
      async (contextBbb) => {
        await contextBbb.step('string property', () => {
          Assert.assert(
            sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
              .includes('stringProperty: string;'),
          );
          Assert.assertEquals(
            validIntermediateSchema.schemaModels.data['BasicDataModel']
              ?.modelProperties['stringProperty'],
            {
              propertyKey: 'stringProperty',
              propertyElement: {
                elementKind: 'stringPrimitive',
              },
            },
          );
        });
        await contextBbb.step('number property', () => {
          Assert.assert(
            sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
              .includes('numberProperty: number;'),
          );
          Assert.assertEquals(
            validIntermediateSchema.schemaModels.data['BasicDataModel']
              ?.modelProperties['numberProperty'],
            {
              propertyKey: 'numberProperty',
              propertyElement: {
                elementKind: 'numberPrimitive',
              },
            },
          );
        });
        await contextBbb.step('boolean property', () => {
          Assert.assert(
            sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
              .includes('booleanProperty: boolean;'),
          );
          Assert.assertEquals(
            validIntermediateSchema.schemaModels.data['BasicDataModel']
              ?.modelProperties['booleanProperty'],
            {
              propertyKey: 'booleanProperty',
              propertyElement: {
                elementKind: 'booleanPrimitive',
              },
            },
          );
        });
      },
    );
  });
}
