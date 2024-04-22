import { FileSystem } from '../imports/FileSystem.ts';
import { Path } from '../imports/Path.ts';

export interface SetupValidSchemaApi {
  initialSchemaOutline: InitialSchemaOutline;
}

export interface SetupValidSchemaResult {
  validSchemaModulePath: string;
  sourceSchemaOutline: SourceSchemaOutline;
}

export async function setupValidSchema(
  api: SetupValidSchemaApi,
): Promise<SetupValidSchemaResult> {
  const { initialSchemaOutline } = api;
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
  const sourceAliasesOutlines: SourceSchemaOutline['schemaAliases'] = Object.values(
    initialSchemaOutline.schemaAliases,
  ).reduce<Record<string, SourceAliasOutline>>(
    (typesSourceOutlineResult, { aliasSymbol, aliasElementSymbol}) => {
      typesSourceOutlineResult[aliasSymbol] = {
        aliasSymbol,
        aliasElementSymbol,
        aliasSource: `type ${aliasSymbol} = ${aliasElementSymbol};`
      }
      return typesSourceOutlineResult
    },
    {},
  );
  const sourceSchemaOutline: SourceSchemaOutline = {
    ...initialSchemaOutline,
    schemaModels: sourceModelsOutlines,
    schemaAliases: sourceAliasesOutlines,
    schemaSource: `export type ${initialSchemaOutline.schemaSymbol} = [${
      initialSchemaOutline.schemaExports.join(',')
    }]; ${
      Object.values(sourceModelsOutlines).reduce(
        (modelsSourceResult, { modelSource }) =>
          `${modelsSourceResult}\n\n${modelSource}`,
        '',
      )
    }${Object.values(sourceAliasesOutlines).reduce(
      (aliasesSourceResult, { aliasSource }) =>
        `${aliasesSourceResult}\n\n${aliasSource}`,
      '',
    )}`,
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

export interface InitialSchemaOutline
  extends __SchemaOutline<IntialModelOutline, InitialAliasOutline> {}

interface IntialModelOutline extends __ModelOutline<InitialPropertyOutline> {}

interface InitialPropertyOutline extends __PropertyOutline {}

interface InitialAliasOutline extends __AliasOutline {}

interface SourceSchemaOutline
  extends __SchemaOutline<SourceModelOutline, SourceAliasOutline> {
  schemaSource: string;
}

interface SourceModelOutline extends __ModelOutline<SourcePropertyOutline> {
  modelSource: string;
}

interface SourcePropertyOutline extends __PropertyOutline {
  propertySource: string;
}

interface SourceAliasOutline extends __AliasOutline {
  aliasSource: string;
}

interface __SchemaOutline<ThisOutlineModel, ThisOutlineAlias> {
  schemaSymbol: string;
  schemaExports: Array<string>;
  schemaModels: Record<string, ThisOutlineModel>;
  schemaAliases: Record<string, ThisOutlineAlias>;
}

interface __ModelOutline<ThisOutlineProperty> {
  modelSymbol: string;
  modelProperties: Record<string, ThisOutlineProperty>;
}

interface __PropertyOutline {
  propertyKey: string;
  propertyElementSymbol: string;
}

interface __AliasOutline {
  aliasSymbol: string;
  aliasElementSymbol: string;
}
