import { IntermediateSchema } from '../../../source/library/schema/types/IntermediateSchema.ts';

export const expectedIntermediateSchema: IntermediateSchema = {
  schemaExport: {
    exportName: 'Schema__AA',
    exportElement: {
      elementKind: 'exportUnion',
      elementMembers: [
        {
          elementKind: 'dataModelReference',
          elementName: 'Model__AA'
        },
        {
          elementKind: 'aliasReference',
          elementName: 'Alias__AA'
        },
        {
          elementKind: 'dataModelReference',
          elementName: 'Model__BB'
        },
        {
          elementKind: 'dataModelReference',
          elementName: 'Model__FF'
        }
      ]
    }
  },
  schemaModels: {
    data: {
      Model__AA: {
        modelKind: 'data',
        modelName: 'Model__AA',
        modelTemplates: [],
        modelProperties: {
          aaProperty__AA: {
            propertyKey: 'aaProperty__AA',
            propertyElement: {
              elementKind: 'booleanLiteral',
              elementSymbol: 'true',
            },
          },
          aaProperty__BB: {
            propertyKey: 'aaProperty__BB',
            propertyElement: {
              elementKind: 'numberLiteral',
              elementSymbol: '123',
            },
          },
          aaProperty__CC: {
            propertyKey: 'aaProperty__CC',
            propertyElement: {
              elementKind: 'stringLiteral',
              elementSymbol: '"hello"',
            },
          },
          aaProperty__DD: {
            propertyKey: 'aaProperty__DD',
            propertyElement: {
              elementKind: 'booleanPrimitive',
            },
          },
          aaProperty__EE: {
            propertyKey: 'aaProperty__EE',
            propertyElement: {
              elementKind: 'numberPrimitive',
            },
          },
          aaProperty__FF: {
            propertyKey: 'aaProperty__FF',
            propertyElement: {
              elementKind: 'stringPrimitive',
            },
          },
          aaProperty__GG: {
            propertyKey: 'aaProperty__GG',
            propertyElement: {
              elementKind: 'dataModelReference',
              elementName: 'Model__AA',
            },
          },
          aaProperty__HH: {
            propertyKey: 'aaProperty__HH',
            propertyElement: {
              elementKind: 'aliasReference',
              elementName: 'Alias__AA',
            },
          },
          aaProperty__II: {
            propertyKey: 'aaProperty__II',
            propertyElement: {
              elementKind: 'verdeTable',
              elementArguments: [{
                elementKind: 'aliasReference',
                elementName: 'Alias__AA',
              }],
            },
          },
          aaProperty__JJ: {
            propertyKey: 'aaProperty__JJ',
            propertyElement: {
              elementKind: 'verdeArray',
              elementArguments: [{
                elementKind: 'stringPrimitive',
              }],
            },
          },
          aaProperty__KK: {
            propertyKey: 'aaProperty__KK',
            propertyElement: {
              elementKind: 'generalUnion',
              elementMembers: [
                { elementKind: 'stringPrimitive' },
                { elementKind: 'null' },
              ],
            },
          },
          aaProperty__LL: {
            propertyKey: 'aaProperty__LL',
            propertyElement: {
              elementKind: 'tupleStructure',
              elementProperties: {
                __llProperty__AA: {
                  propertyIndex: 0,
                  propertyKey: '__llProperty__AA',
                  propertyElement: {
                    elementKind: 'numberPrimitive',
                  },
                },
              },
            },
          },
          aaProperty__MM: {
            propertyKey: 'aaProperty__MM',
            propertyElement: {
              elementKind: 'objectStructure',
              elementProperties: {
                __mmProperty__AA: {
                  propertyKey: '__mmProperty__AA',
                  propertyElement: {
                    elementKind: 'stringPrimitive',
                  },
                },
              },
            },
          },
        },
      },
      Model__BB: {
        modelKind: 'data',
        modelName: 'Model__BB',
        modelTemplates: [
          {
            templateKind: 'concreteTemplate',
            templateModelNameKey: 'Model__CC',
          },
          {
            templateKind: 'genericTemplate',
            templateModelNameKey: 'Model__DD',
            templateArguments: {
              DdParameter__AA: {
                argumentIndex: 0,
                argumentParameterNameKey: 'DdParameter__AA',
                argumentElement: {
                  elementKind: 'dataModelReference',
                  elementName: 'Model__BB',
                },
              },
              DdParameter__BB: {
                argumentIndex: 1,
                argumentParameterNameKey: 'DdParameter__BB',
                argumentElement: {
                  elementKind: 'numberPrimitive',
                },
              },
              DdParameter__CC: {
                argumentIndex: 2,
                argumentParameterNameKey: 'DdParameter__CC',
                argumentElement: {
                  elementKind: 'stringPrimitive',
                },
              },
            },
          },
        ],
        modelProperties: {},
      },
      Model__FF: {
        modelKind: 'data',
        modelName: 'Model__FF',
        modelProperties: {
          ffProperty__AA: {
            propertyKey: 'ffProperty__AA',
            propertyElement: {
              elementKind: 'dataModelReference',
              elementName: 'Model__BB',
            },
          },
        },
        modelTemplates: [
          {
            templateKind: 'concreteTemplate',
            templateModelNameKey: 'Model__CC',
          },
          {
            templateKind: 'genericTemplate',
            templateModelNameKey: 'Model__GG',
            templateArguments: {
              GgParameter__AA: {
                argumentIndex: 0,
                argumentParameterNameKey: 'GgParameter__AA',
                argumentElement: {
                  elementKind: 'dataModelReference',
                  elementName: 'Model__AA',
                },
              },
            },
          },
        ],
      },
    },
    concreteTemplate: {
      Model__CC: {
        modelKind: 'concreteTemplate',
        modelName: 'Model__CC',
        modelTemplates: [],
        modelProperties: {
          ccProperty__AA: {
            propertyKey: 'ccProperty__AA',
            propertyElement: {
              elementKind: 'dataModelReference',
              elementName: 'Model__BB',
            },
          },
        },
      },
    },
    genericTemplate: {
      Model__DD: {
        modelKind: 'genericTemplate',
        modelName: 'Model__DD',
        modelParameters: [
          {
            parameterKind: 'basic',
            parameterName: 'DdParameter__AA',
          },
          {
            parameterKind: 'constrained',
            parameterName: 'DdParameter__BB',
            parameterConstraint: 'number',
          },
          {
            parameterKind: 'basic',
            parameterName: 'DdParameter__CC',
          },
        ],
        modelTemplates: [{
          templateKind: 'genericTemplate',
          templateModelNameKey: 'Model__EE',
          templateArguments: {
            EeParameter__AA: {
              argumentIndex: 0,
              argumentParameterNameKey: 'EeParameter__AA',
              argumentElement: {
                elementKind: 'parameterReference',
                elementName: 'DdParameter__CC',
              },
            },
            EeParameter__BB: {
              argumentIndex: 1,
              argumentParameterNameKey: 'EeParameter__BB',
              argumentElement: {
                elementKind: 'dataModelReference',
                elementName: 'Model__BB',
              },
            },
          },
        }],
        modelProperties: {
          ddProperty__AA: {
            propertyKey: 'ddProperty__AA',
            propertyElement: {
              elementKind: 'parameterReference',
              elementName: 'DdParameter__AA',
            },
          },
          ddProperty__BB: {
            propertyKey: 'ddProperty__BB',
            propertyElement: {
              elementKind: 'parameterReference',
              elementName: 'DdParameter__BB',
            },
          },
        },
      },
      Model__EE: {
        modelKind: 'genericTemplate',
        modelName: 'Model__EE',
        modelParameters: [
          {
            parameterKind: 'basic',
            parameterName: 'EeParameter__AA',
          },
          {
            parameterKind: 'basic',
            parameterName: 'EeParameter__BB',
          },
        ],
        modelTemplates: [],
        modelProperties: {
          eeProperty__AA: {
            propertyKey: 'eeProperty__AA',
            propertyElement: {
              elementKind: 'parameterReference',
              elementName: 'EeParameter__AA',
            },
          },
          eeProperty__BB: {
            propertyKey: 'eeProperty__BB',
            propertyElement: {
              elementKind: 'parameterReference',
              elementName: 'EeParameter__BB',
            },
          },
        },
      },
      Model__GG: {
        modelKind: 'genericTemplate',
        modelName: 'Model__GG',
        modelParameters: [{
          parameterKind: 'basic',
          parameterName: 'GgParameter__AA',
        }],
        modelTemplates: [],
        modelProperties: {
          ggProperty__AA: {
            propertyKey: 'ggProperty__AA',
            propertyElement: {
              elementKind: 'verdeTable',
              elementArguments: [{
                elementKind: 'parameterReference',
                elementName: 'GgParameter__AA',
              }],
            },
          },
          ggProperty__BB: {
            propertyKey: 'ggProperty__BB',
            propertyElement: {
              elementKind: 'verdeTable',
              elementArguments: [{
                elementKind: 'dataModelReference',
                elementName: 'Model__AA',
              }],
            },
          },
          ggProperty__CC: {
            propertyKey: 'ggProperty__CC',
            propertyElement: {
              elementKind: 'verdeTable',
              elementArguments: [{
                elementKind: 'verdeTableUnion',
                elementMembers: [
                  {
                    elementKind: 'dataModelReference',
                    elementName: 'Model__AA',
                  },
                  {
                    elementKind: 'aliasReference',
                    elementName: 'Alias__AA',
                  },
                  {
                    elementKind: 'parameterReference',
                    elementName: 'GgParameter__AA',
                  },
                ],
              }],
            },
          },
          ggProperty__DD: {
            propertyKey: 'ggProperty__DD',
            propertyElement: {
              elementKind: 'verdeArray',
              elementArguments: [{
                elementKind: 'booleanPrimitive',
              }],
            },
          },
          ggProperty__EE: {
            propertyKey: 'ggProperty__EE',
            propertyElement: {
              elementKind: 'verdeArray',
              elementArguments: [{
                elementKind: 'numberPrimitive',
              }],
            },
          },
          ggProperty__FF: {
            propertyKey: 'ggProperty__FF',
            propertyElement: {
              elementKind: 'verdeArray',
              elementArguments: [{
                elementKind: 'dataModelReference',
                elementName: 'Model__AA',
              }],
            },
          },
          ggProperty__GG: {
            propertyKey: 'ggProperty__GG',
            propertyElement: {
              elementKind: 'verdeArray',
              elementArguments: [{
                elementKind: 'aliasReference',
                elementName: 'Alias__AA',
              }],
            },
          },
          ggProperty__HH: {
            propertyKey: 'ggProperty__HH',
            propertyElement: {
              elementKind: 'verdeArray',
              elementArguments: [{
                elementKind: 'parameterReference',
                elementName: 'GgParameter__AA',
              }],
            },
          },
          ggProperty__II: {
            propertyKey: 'ggProperty__II',
            propertyElement: {
              elementKind: 'verdeArray',
              elementArguments: [{
                elementKind: 'verdeArrayUnion',
                elementMembers: [
                  {
                    elementKind: 'booleanPrimitive',
                  },
                  {
                    elementKind: 'numberPrimitive',
                  },
                  {
                    elementKind: 'stringPrimitive',
                  },
                  {
                    elementKind: 'dataModelReference',
                    elementName: 'Model__AA',
                  },
                  {
                    elementKind: 'aliasReference',
                    elementName: 'Alias__AA',
                  },
                  {
                    elementKind: 'parameterReference',
                    elementName: 'GgParameter__AA',
                  },
                ],
              }],
            },
          },
        },
      },
    },
  },
  schemaAliases: {
    Alias__AA: {
      aliasName: 'Alias__AA',
      aliasElement: {
        elementKind: 'dataModelReference',
        elementName: 'Model__AA'
      }
    }
  },
};
