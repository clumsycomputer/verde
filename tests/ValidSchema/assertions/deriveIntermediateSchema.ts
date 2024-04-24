import { IntermediateSchema } from '../../../source/library/schema/types/IntermediateSchema.ts';
import { Assert } from '../../imports/Assert.ts';

export interface deriveIntermediateSchema__assertionsApi {
  testContext: Deno.TestContext;
  basicDataModelSource: string;
  validIntermediateSchema: IntermediateSchema;
}

export function deriveIntermediateSchema__assertions(
  api: deriveIntermediateSchema__assertionsApi,
) {
  const { testContext, basicDataModelSource, validIntermediateSchema } = api;
  return Promise.all([
    testContext.step('BooleanLiteralElement', () => {
      Assert.assert(
        basicDataModelSource.includes('booleanLiteralProperty: true;'),
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
        basicDataModelSource.includes('numberLiteralProperty: 123;'),
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
        basicDataModelSource.includes('stringLiteralProperty: "hello";'),
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
        basicDataModelSource.includes('booleanProperty: boolean;'),
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
        basicDataModelSource.includes('numberProperty: number;'),
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
        basicDataModelSource.includes('stringProperty: string;'),
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
        basicDataModelSource.includes(
          'dataModelReferenceProperty: BasicDataModel;',
        ),
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
        basicDataModelSource.includes(
          'aliasReferenceProperty: DataModelUnion;',
        ),
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
        basicDataModelSource.includes(
          'verdeTableProperty: VerdeTable<DataModelUnion>;',
        ),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['verdeTableProperty']
          ?.propertyElement,
        {
          elementKind: 'verdeTable',
          collectionElement: {
            elementKind: 'aliasReference',
            aliasNameKey: 'DataModelUnion',
          },
        },
      );
    }),
    testContext.step('VerdeArrayElement', () => {
      Assert.assert(
        basicDataModelSource.includes(
          'verdeArrayProperty: VerdeArray<string>;',
        ),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['verdeArrayProperty']
          ?.propertyElement,
        {
          elementKind: 'verdeArray',
          collectionElement: {
            elementKind: 'stringPrimitive',
          },
        },
      );
    }),
    testContext.step('ObjectStructureElement', () => {
      Assert.assert(
        basicDataModelSource.includes(
          'objectProperty: { objectStringProperty: string; };',
        ),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['objectProperty']
          ?.propertyElement,
        {
          elementKind: 'objectStructure',
          structureProperties: {
            objectStringProperty: {
              propertyKey: 'objectStringProperty',
              propertyElement: {
                elementKind: 'stringPrimitive',
              },
            },
          },
        },
      );
    }),
    testContext.step('TupleStructureElement', () => {
      Assert.assert(
        basicDataModelSource.includes(
          'tupleProperty: [tupleNumberProperty: number];',
        ),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['tupleProperty']
          ?.propertyElement,
        {
          elementKind: 'tupleStructure',
          structureProperties: {
            tupleNumberProperty: {
              propertyIndex: 0,
              propertyKey: 'tupleNumberProperty',
              propertyElement: {
                elementKind: 'numberPrimitive',
              },
            },
          },
        },
      );
    }),
    testContext.step('UnionCompositionElement', () => {
      Assert.assert(
        basicDataModelSource.includes('unionProperty: string | null;'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['BasicDataModel']
          ?.modelProperties['unionProperty']
          ?.propertyElement,
        {
          elementKind: 'unionComposition',
          unionMembers: [
            { elementKind: 'stringPrimitive' },
            { elementKind: 'null' },
          ],
        },
      );
    }),
    // testContext.step('BasicParameterElement', () => {}),
    // testContext.step('GenericParameterElement', () => {}),
  ]);
}
