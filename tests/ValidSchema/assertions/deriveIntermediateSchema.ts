import { deriveIntermediateSchema } from '../../../source/library/module.ts';
import { Assert } from '../../imports/Assert.ts';
import { SetupValidSchemaResult } from '../setupValidSchema.ts';

export interface deriveIntermediateSchema__assertionsApi
  extends Pick<SetupValidSchemaResult, 'sourceSchemaOutline'> {
  testContext: Deno.TestContext;
  validIntermediateSchema: ReturnType<typeof deriveIntermediateSchema>;
}

export function deriveIntermediateSchema__assertions(
  api: deriveIntermediateSchema__assertionsApi,
) {
  const { testContext, sourceSchemaOutline, validIntermediateSchema } = api;
  return Promise.all([
    testContext.step('BooleanLiteralElement', () => {
      Assert.assert(
        sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
          .includes('booleanLiteralProperty: true;'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['booleanLiteralProperty']?.propertyElement,
        {
          elementKind: 'booleanLiteral',
          literalSymbol: 'true',
        },
      );
    }),
    testContext.step('NumberLiteralElement', () => {
      Assert.assert(
        sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
          .includes('numberLiteralProperty: 123;'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['numberLiteralProperty']?.propertyElement,
        {
          elementKind: 'numberLiteral',
          literalSymbol: '123',
        },
      );
    }),
    testContext.step('StringLiteralElement', () => {
      Assert.assert(
        sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
          .includes('stringLiteralProperty: "hello";'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['stringLiteralProperty']?.propertyElement,
        {
          elementKind: 'stringLiteral',
          literalSymbol: '"hello"',
        },
      );
    }),
    testContext.step('BooleanElement', () => {
      Assert.assert(
        sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
          .includes('booleanProperty: boolean;'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['booleanProperty']?.propertyElement,
        {
          elementKind: 'booleanPrimitive',
        },
      );
    }),
    testContext.step('NumberElement', () => {
      Assert.assert(
        sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
          .includes('numberProperty: number;'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['numberProperty']?.propertyElement,
        {
          elementKind: 'numberPrimitive',
        },
      );
    }),
    testContext.step('StringElement', () => {
      Assert.assert(
        sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
          .includes('stringProperty: string;'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['stringProperty']?.propertyElement,
        {
          elementKind: 'stringPrimitive',
        },
      );
    }),
    testContext.step('DataModelReferenceElement', () => {
      Assert.assert(
        sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
          .includes('dataModelReferenceProperty: BasicDataModel;'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['dataModelReferenceProperty']?.propertyElement,
        {
          elementKind: 'dataModelReference',
          dataModelNameKey: 'BasicDataModel',
        },
      );
    }),
    testContext.step('AliasReferenceElement', () => {
      Assert.assert(
        sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
          .includes('aliasReferenceProperty: DataModelUnion;'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['aliasReferenceProperty']
          ?.propertyElement,
        {
          elementKind: 'aliasReference',
          aliasNameKey: 'DataModelUnion',
        },
      );
    }),
    testContext.step('VerdeTableElement', () => {
      Assert.assert(
        sourceSchemaOutline.schemaModels['BasicDataModel']?.modelSource
          .includes('verdeTableProperty: VerdeTable<DataModelUnion>;'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['verdeTableProperty']
          ?.propertyElement,
        {
          elementKind: 'verdeTable',
          collectionElement: {
            elementKind: 'aliasReference',
            aliasNameKey: 'DataModelUnion'
          }
        },
      );
    }),
    // testContext.step('VerdeArrayElement', () => {}),
    // testContext.step('ObjectElement', () => {}),
    // testContext.step('TupleElement', () => {}),
    // testContext.step('UnionElement', () => {}),
    // testContext.step('BasicParameterElement', () => {}),
    // testContext.step('GenericParameterElement', () => {}),
  ]);
}
