import { IntermediateSchema } from '../../../source/library/schema/types/IntermediateSchema.ts';

export const expectedIntermediateSchema = {
  schemaExport: {
    exportName: 'Schema__AA',
    exportElement: {
      elementKind: 'exportUnion',
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
          elementKind: 'dataModelReference',
          elementName: 'Model__BB',
        },
        {
          elementKind: 'dataModelReference',
          elementName: 'Model__FF',
        },
      ],
    },
  },
  schemaTypes: {
    Model__AA: {
      typeKind: 'dataModel',
      typeName: 'Model__AA',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Schema__AA.ts',
      typeModelTemplates: [],
      typeModelProperties: {
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
            elementStructure: [{
              propertyKey: '__llProperty__AA',
              propertyElement: {
                elementKind: 'numberPrimitive',
              },
            }],
          },
        },
        aaProperty__MM: {
          propertyKey: 'aaProperty__MM',
          propertyElement: {
            elementKind: 'objectStructure',
            elementStructure: {
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
      typeKind: 'dataModel',
      typeName: 'Model__BB',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Model__BB.ts',
      typeModelTemplates: [
        {
          templateModelKind: 'concreteTemplateModel',
          templateModelName: 'Model__CC',
        },
        {
          templateModelKind: 'genericTemplateModel',
          templateModelName: 'Model__DD',
          templateArguments: {
            DdParameter__AA: {
              argumentIndex: 0,
              argumentParameterName: 'DdParameter__AA',
              argumentElement: {
                elementKind: 'dataModelReference',
                elementName: 'Model__BB',
              },
            },
            DdParameter__BB: {
              argumentIndex: 1,
              argumentParameterName: 'DdParameter__BB',
              argumentElement: {
                elementKind: 'numberPrimitive',
              },
            },
            DdParameter__CC: {
              argumentIndex: 2,
              argumentParameterName: 'DdParameter__CC',
              argumentElement: {
                elementKind: 'stringPrimitive',
              },
            },
          },
        },
      ],
      typeModelProperties: {},
    },
    Model__FF: {
      typeKind: 'dataModel',
      typeName: 'Model__FF',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Schema__AA.ts',
      typeModelProperties: {
        ffProperty__AA: {
          propertyKey: 'ffProperty__AA',
          propertyElement: {
            elementKind: 'dataModelReference',
            elementName: 'Model__BB',
          },
        },
      },
      typeModelTemplates: [
        {
          templateModelKind: 'concreteTemplateModel',
          templateModelName: 'Model__CC',
        },
        {
          templateModelKind: 'genericTemplateModel',
          templateModelName: 'Model__GG',
          templateArguments: {
            GgParameter__AA: {
              argumentIndex: 0,
              argumentParameterName: 'GgParameter__AA',
              argumentElement: {
                elementKind: 'dataModelReference',
                elementName: 'Model__AA',
              },
            },
            GgParameter__BB: {
              argumentIndex: 1,
              argumentParameterName: 'GgParameter__BB',
              argumentElement: {
                elementKind: 'tupleStructure',
                elementStructure: [{
                  propertyKey: '__ffProperty__00',
                  propertyElement: {
                    elementKind: 'numberPrimitive'
                  }
                }]
              }
            }
          },
        },
      ],
    },
    Model__CC: {
      typeKind: 'concreteTemplateModel',
      typeName: 'Model__CC',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Model__BB.ts',
      typeModelTemplates: [],
      typeModelProperties: {
        ccProperty__AA: {
          propertyKey: 'ccProperty__AA',
          propertyElement: {
            elementKind: 'dataModelReference',
            elementName: 'Model__BB',
          },
        },
      },
    },
    Model__DD: {
      typeKind: 'genericTemplateModel',
      typeName: 'Model__DD',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Model__BB.ts',
      typeModelParameters: [
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
      typeModelTemplates: [{
        templateModelKind: 'genericTemplateModel',
        templateModelName: 'Model__EE',
        templateArguments: {
          EeParameter__AA: {
            argumentIndex: 0,
            argumentParameterName: 'EeParameter__AA',
            argumentElement: {
              elementKind: 'parameterReference',
              elementName: 'DdParameter__CC',
            },
          },
          EeParameter__BB: {
            argumentIndex: 1,
            argumentParameterName: 'EeParameter__BB',
            argumentElement: {
              elementKind: 'dataModelReference',
              elementName: 'Model__BB',
            },
          },
        },
      }],
      typeModelProperties: {
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
      typeKind: 'genericTemplateModel',
      typeName: 'Model__EE',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Model__BB.ts',
      typeModelParameters: [
        {
          parameterKind: 'basic',
          parameterName: 'EeParameter__AA',
        },
        {
          parameterKind: 'basic',
          parameterName: 'EeParameter__BB',
        },
      ],
      typeModelTemplates: [],
      typeModelProperties: {
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
      typeKind: 'genericTemplateModel',
      typeName: 'Model__GG',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Schema__AA.ts',
      typeModelParameters: [
        {
        parameterKind: 'basic',
        parameterName: 'GgParameter__AA',
      },
      {
        parameterKind: 'constrained',
        parameterName: 'GgParameter__BB',
        parameterConstraint: '[number, ...number[]]'
      }
    ],
      typeModelTemplates: [],
      typeModelProperties: {
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
        ggProperty__JJ: {
          propertyKey: 'ggProperty__JJ',
          propertyElement: {
            elementKind: 'tupleStructure',
            elementStructure: [
              {
                spreadElement: {
                  elementKind: 'aliasReference',
                  elementName: 'Alias__CC'
                },
              },
              {
                spreadElement: {
                  elementKind: 'parameterReference',
                  elementName: 'GgParameter__BB'
                }
              }
            ]
          }
        }
      },
    },
    Alias__AA: {
      typeKind: 'alias',
      typeName: 'Alias__AA',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Schema__AA.ts',
      typeAliasElement: {
        elementKind: 'dataModelReference',
        elementName: 'Model__AA',
      },
    },
    Alias__BB: {
      typeKind: 'alias',
      typeName: 'Alias__BB',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Schema__AA.ts',
      typeAliasElement: {
        elementKind: 'tupleStructure',
        elementStructure: [{
          propertyKey: 'bbProperty__00',
          propertyElement: {
            elementKind: 'numberPrimitive',
          },
        }],
      },
    },
    Alias__CC: {
      typeKind: 'alias',
      typeName: 'Alias__CC',
      typeSourcePath: '/home/verde/tests/ValidSchema/schema/Schema__AA.ts',
      typeAliasElement: {
        elementKind: 'tupleStructure',
        elementStructure: [
          {
            spreadElement: {
              elementKind: 'aliasReference',
              elementName: 'Alias__BB'
            }
          },
          {
          propertyKey: 'ccProperty__11',
          propertyElement: {
            elementKind: 'stringPrimitive',
          },
        }],
      },
    },
  },
} satisfies IntermediateSchema;
