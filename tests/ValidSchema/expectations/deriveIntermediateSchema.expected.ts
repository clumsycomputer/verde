import { IntermediateSchema } from '../../../source/library/schema/types/IntermediateSchema.ts';

export const expectedIntermediateSchema: IntermediateSchema = {
  schemaName: 'Schema__AA',
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
              literalSymbol: 'true',
            },
          },
          aaProperty__BB: {
            propertyKey: 'aaProperty__BB',
            propertyElement: {
              elementKind: 'numberLiteral',
              literalSymbol: '123',
            },
          },
          aaProperty__CC: {
            propertyKey: 'aaProperty__CC',
            propertyElement: {
              elementKind: 'stringLiteral',
              literalSymbol: '"hello"',
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
              dataModelNameKey: 'Model__AA',
            },
          },
          aaProperty__HH: {
            propertyKey: 'aaProperty__HH',
            propertyElement: {
              elementKind: 'aliasReference',
              aliasNameKey: 'Alias__AA',
            },
          },
          aaProperty__II: {
            propertyKey: 'aaProperty__II',
            propertyElement: {
              elementKind: 'verdeTable',
              collectionElement: {
                elementKind: 'aliasReference',
                aliasNameKey: 'Alias__AA',
              },
            },
          },
          aaProperty__JJ: {
            propertyKey: 'aaProperty__JJ',
            propertyElement: {
              elementKind: 'verdeArray',
              collectionElement: {
                elementKind: 'stringPrimitive',
              },
            },
          },
          aaProperty__KK: {
            propertyKey: 'aaProperty__KK',
            propertyElement: {
              elementKind: 'unionComposition',
              unionMembers: [
                { elementKind: 'stringPrimitive' },
                { elementKind: 'null' },
              ],
            },
          },
          aaProperty__LL: {
            propertyKey: 'aaProperty__LL',
            propertyElement: {
              elementKind: 'tupleStructure',
              structureProperties: {
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
              structureProperties: {
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
            genericArguments: {
              DdParameter__AA: {
                argumentIndex: 0,
                argumentParameterNameKey: 'DdParameter__AA',
                argumentElement: {
                  elementKind: 'dataModelReference',
                  dataModelNameKey: 'Model__BB',
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
              dataModelNameKey: 'Model__BB',
            },
          },
        },
      },
    },
    genericTemplate: {
      Model__DD: {
        modelKind: 'genericTemplate',
        modelName: 'Model__DD',
        genericParameters: [
          { parameterName: 'DdParameter__AA' },
          { parameterName: 'DdParameter__BB' },
          { parameterName: 'DdParameter__CC' },
        ],
        modelTemplates: [{
          templateKind: 'genericTemplate',
          templateModelNameKey: 'Model__EE',
          genericArguments: {
            EeParameter__AA: {
              argumentIndex: 0,
              argumentParameterNameKey: 'EeParameter__AA',
              argumentElement: {
                elementKind: 'basicParameter',
                parameterName: 'DdParameter__CC',
              },
            },
          },
        }],
        modelProperties: {
          ddProperty__AA: {
            propertyKey: 'ddProperty__AA',
            propertyElement: {
              elementKind: 'basicParameter',
              parameterName: 'DdParameter__AA',
            },
          },
          ddProperty__BB: {
            propertyKey: 'ddProperty__BB',
            propertyElement: {
              elementKind: 'constrainedParameter',
              parameterName: 'DdParameter__BB',
            },
          },
        },
      },
      Model__EE: {
        modelKind: 'genericTemplate',
        modelName: 'Model__EE',
        genericParameters: [{
          parameterName: 'EeParameter__AA'
        }],
        modelTemplates: [],
        modelProperties: {
          eeProperty__AA: {
            propertyKey: 'eeProperty__AA',
            propertyElement: {
              elementKind: 'basicParameter',
              parameterName: 'EeParameter__AA'
            }
          }
        },
      }
    },
  },
  schemaAliases: {
    // DataModelUnion: {
    //   aliasKind: ''
    // }
  },
};
