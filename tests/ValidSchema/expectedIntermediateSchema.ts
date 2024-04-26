import { IntermediateSchema } from '../../source/library/schema/types/IntermediateSchema.ts';

export const expectedIntermediateSchema: IntermediateSchema = {
  schemaName: 'ValidSchema',
  schemaModels: {
    data: {
      BasicDataModel: {
        modelKind: 'data',
        modelName: 'BasicDataModel',
        modelTemplates: [],
        modelProperties: {
          booleanLiteralProperty: {
            propertyKey: 'booleanLiteralProperty',
            propertyElement: {
              elementKind: 'booleanLiteral',
              literalSymbol: 'true'
            }
          },
          numberLiteralProperty: {
            propertyKey: 'numberLiteralProperty',
            propertyElement: {
              elementKind: 'numberLiteral',
              literalSymbol: '123'
            }
          },
          stringLiteralProperty: {
            propertyKey: 'stringLiteralProperty',
            propertyElement: {
              elementKind: 'stringLiteral',
              literalSymbol: '"hello"'
            }
          },
          booleanProperty: {
            propertyKey: 'booleanProperty',
            propertyElement: {
              elementKind: 'booleanPrimitive'
            }
          },
          numberProperty: {
            propertyKey: 'numberProperty',
            propertyElement: {
              elementKind: 'numberPrimitive'
            }
          },
          stringProperty: {
            propertyKey: 'stringProperty',
            propertyElement: {
              elementKind: 'stringPrimitive'
            }
          },
          dataModelProperty: {
            propertyKey: 'dataModelProperty',
            propertyElement: {
              elementKind: 'dataModelReference',
              dataModelNameKey: 'BasicDataModel'
            }
          },
          aliasProperty: {
            propertyKey: 'aliasProperty',
            propertyElement: {
              elementKind: 'aliasReference',
              aliasNameKey: 'DataModelUnion'
            }
          },
          verdeTableProperty: {
            propertyKey: 'verdeTableProperty',
            propertyElement: {
              elementKind: 'verdeTable',
              collectionElement: {
                elementKind: 'aliasReference',
                aliasNameKey: 'DataModelUnion'
              }
            }
          },
          verdeArrayProperty: {
            propertyKey: 'verdeArrayProperty',
            propertyElement: {
              elementKind: 'verdeArray',
              collectionElement: {
                elementKind: 'stringPrimitive',
              }
            }
          },
          objectProperty: {
            propertyKey: 'objectProperty',
            propertyElement: {
              elementKind: 'objectStructure',
              structureProperties: {
                objectStringProperty: {
                  propertyKey: 'objectStringProperty',
                  propertyElement: {
                    elementKind: 'stringPrimitive'
                  }
                }
              }
            }
          },
          tupleProperty: {
            propertyKey: 'tupleProperty',
            propertyElement: {
              elementKind: 'tupleStructure',
              structureProperties: {
                tupleNumberProperty: {
                  propertyIndex: 0,
                  propertyKey: 'tupleNumberProperty',
                  propertyElement: {
                    elementKind: 'numberPrimitive'
                  }
                }
              }
            }
          },
          unionProperty: {
            propertyKey: 'unionProperty',
            propertyElement: {
              elementKind: 'unionComposition',
              unionMembers: [
                { elementKind: 'stringPrimitive' },
                { elementKind: 'null' }
              ]
            }
          }
        }
      },
      CompositeDataModel: {
        modelKind: 'data',
        modelName: 'CompositeDataModel',
        modelTemplates: [
          {
            templateKind: 'concreteTemplate',
            templateModelNameKey: 'ConcreteTemplateModel'
          },
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
        ],
        modelProperties: {}
      }
    },
    concreteTemplate: {
      ConcreteTemplateModel: {
        modelKind: 'concreteTemplate',
        modelName: 'ConcreteTemplateModel',
        modelTemplates: [],
        modelProperties: {}
      }
    },
    genericTemplate: {
      GenericTemplateModel: {
        modelKind: 'genericTemplate',
        modelName: 'GenericTemplateModel',
        modelTemplates: [],
        modelProperties: {
          basicParameterProperty: {
            propertyKey: 'basicParameterProperty',
            propertyElement: {
              elementKind: 'basicParameter',
              parameterName: 'BasicParameter'
            }
          },
          constrainedParameterProperty: {
            propertyKey: 'constrainedParameterProperty',
            propertyElement: {
              elementKind: 'constrainedParameter',
              parameterName: 'ConstrainedParameter'
            }
          }
        },
        genericParameters: [
          { parameterName: 'BasicParameter' },
          { parameterName: 'ConstrainedParameter' },
          { parameterName: 'DefaultParameter' },
        ]
      }
    }
  },
  schemaAliases: {
    // DataModelUnion: {
    //   aliasKind: ''
    // }
  }
}