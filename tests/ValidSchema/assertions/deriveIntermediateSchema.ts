import { IntermediateSchema } from '../../../source/library/schema/types/IntermediateSchema.ts';
import { Assert } from '../../imports/Assert.ts';

export interface deriveIntermediateSchema__assertionsApi {
  testContext: Deno.TestContext;
  basicDataModelSource: string;
  compositeDataModelSource: string;
  genericTemplateModelSource: string;
  validIntermediateSchema: IntermediateSchema;
}

export function deriveIntermediateSchema__assertions(
  api: deriveIntermediateSchema__assertionsApi,
) {
  const {
    testContext,
    basicDataModelSource,
    validIntermediateSchema,
    genericTemplateModelSource,
    compositeDataModelSource,
  } = api;
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
    testContext.step('BasicParameterElement', () => {
      Assert.assert(
        genericTemplateModelSource.includes('BasicParameter,'),
      );
      Assert.assert(
        genericTemplateModelSource.includes(
          'basicParameterProperty: BasicParameter;',
        ),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels
          .genericTemplate['GenericTemplateModel']
          ?.modelProperties['basicParameterProperty']
          ?.propertyElement,
        {
          elementKind: 'basicParameter',
          parameterName: 'BasicParameter',
        },
      );
    }),
    testContext.step('ConstrainedParameterElement', () => {
      Assert.assert(
        genericTemplateModelSource.includes(
          'ConstrainedParameter extends number,',
        ),
      );
      Assert.assert(
        genericTemplateModelSource.includes(
          'constrainedParameterProperty: ConstrainedParameter;',
        ),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels
          .genericTemplate['GenericTemplateModel']
          ?.modelProperties['constrainedParameterProperty']
          ?.propertyElement,
        {
          elementKind: 'constrainedParameter',
          parameterName: 'ConstrainedParameter',
        },
      );
    }),
    testContext.step('GenericParameter', () => {
      Assert.assert(
        genericTemplateModelSource.includes(
          'interface GenericTemplateModel<BasicParameter, ConstrainedParameter extends number, DefaultParameter = string>',
        ),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels
          .genericTemplate['GenericTemplateModel']?.genericParameters,
        [
          { parameterName: 'BasicParameter' },
          { parameterName: 'ConstrainedParameter' },
          { parameterName: 'DefaultParameter' },
        ],
      );
    }),
    testContext.step('ConcreteModelTemplate', () => {
      Assert.assert(
        compositeDataModelSource.includes('extends ConcreteTemplateModel,'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['CompositeDataModel']?.modelTemplates[0],
        {
          templateKind: 'concreteTemplate',
          templateModelNameKey: 'ConcreteTemplateModel'
        }
      )
    }),
    testContext.step('GenericModelTemplate', () => {
      Assert.assert(
        compositeDataModelSource.includes(', GenericTemplateModel<boolean, number>'),
      );
      Assert.assertEquals(
        validIntermediateSchema.schemaModels.data['CompositeDataModel']?.modelTemplates[1],
        {
          templateKind: 'genericTemplate',
          templateModelNameKey: 'GenericTemplateModel',
          genericArguments: {
            BasicParameter: {
              argumentIndex: 0,
              argumentParameterNameKey: 'BasicParameter',
              argumentElement: {
                elementKind: 'booleanPrimitive'
              }
            },
            ConstrainedParameter: {
              argumentIndex: 1,
              argumentParameterNameKey: 'ConstrainedParameter',
              argumentElement: {
                elementKind: 'numberPrimitive'
              }
            },
            DefaultParameter: {
              argumentIndex: 2,
              argumentParameterNameKey: 'DefaultParameter',
              argumentElement: {
                elementKind: 'stringPrimitive'
              }
            }
          }
        }
      )
    }),
    // testContext.step('GenericArgument', () => {}),
  ]);
}
