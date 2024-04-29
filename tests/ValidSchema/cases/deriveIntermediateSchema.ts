import { TestCase } from '../../helpers/TestCase.ts';

export interface GetDeriveIntermediateSchemaTestCasesApi {
  schemaSources: Record<string, string>;
}

export function getDeriveIntermediateSchemaTestCases(
  api: GetDeriveIntermediateSchemaTestCasesApi,
): Array<TestCase> {
  const { schemaSources } = api;
  return [
    {
      caseKey: 'concreteModelTemplate',
      caseLabel: 'concrete model template',
      caseTechnicalLabel:
        '__IntermediateModel["modelTemplates"][number] => ConcreteModelTemplate',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['CompositeDataModel.ts']!,
          highlightScopes: [{
            scopeRange: [7, 109],
            scopeHighlights: [{
              highlightRange: [39, 60],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'CompositeDataModel',
          'modelTemplates',
          0,
        ],
      }],
    },
    {
      caseKey: 'genericModelTemplate',
      caseLabel: 'generic model template',
      caseTechnicalLabel:
        '__IntermediateModel["modelTemplates"][number] => GenericModelTemplate',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['CompositeDataModel.ts']!,
          highlightScopes: [{
            scopeRange: [7, 109],
            scopeHighlights: [{
              highlightRange: [62, 99],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'CompositeDataModel',
          'modelTemplates',
          1,
        ],
      }],
    },
    {
      caseKey: 'booleanLiteralElement__modelProperty',
      caseLabel: 'boolean literal element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanLiteralElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [29, 58],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'booleanLiteralProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'numberLiteralElement__modelProperty',
      caseLabel: 'number literal element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberLiteralElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [61, 88],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'numberLiteralProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'stringLiteralElement__modelProperty',
      caseLabel: 'string literal element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringLiteralElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [91, 122],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'stringLiteralProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'booleanElement__modelProperty',
      caseLabel: 'boolean element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => BooleanElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [125, 150],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'booleanProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'numberElement__modelProperty',
      caseLabel: 'number element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => NumberElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [153, 176],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'numberProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'stringElement__modelProperty',
      caseLabel: 'string element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => StringElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [179, 202],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'stringProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'dataModelReferenceElement__modelProperty',
      caseLabel: 'data model reference element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => DataModelReferenceElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [205, 239],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'dataModelProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'aliasReferenceElement__modelProperty',
      caseLabel: 'alias reference element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => AliasReferenceElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [242, 272],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'aliasProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'verdeTableElement-aliasReferenceElement__modelProperty',
      caseLabel:
        'verde table element => alias reference element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeTableElement<AliasReferenceElement>',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [275, 322],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'verdeTableProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'verdeArrayElement-stringElement__modelProperty',
      caseLabel: 'verde array element => stringElement (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => VerdeArrayElement<StringElement>',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [325, 364],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'verdeArrayProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'objectStructureElement__modelProperty',
      caseLabel: 'object structure element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => ObjectStructureElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [367, 417],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'objectProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'tupleStructureElement__modelProperty',
      caseLabel: 'tuple structure element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => TupleStructureElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [420, 465],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'tupleProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'unionCompositionElement__modelProperty',
      caseLabel: 'union composition element (model property)',
      caseTechnicalLabel:
        '__IntermediateModel["modelProperties"][string]["propertyElement"] => UnionCompositionElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['ValidSchema.ts']!,
          highlightScopes: [{
            scopeRange: [219, 718],
            scopeHighlights: [{
              highlightRange: [468, 497],
            }],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'data',
          'BasicDataModel',
          'modelProperties',
          'unionProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'genericParameter',
      caseLabel: 'generic parameter',
      caseTechnicalLabel:
        'GenericTemplateIntermediateModel["genericParameters"][number] => GenericParameter',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['CompositeDataModel.ts']!,
          highlightScopes: [{
            scopeRange: [161, 380],
            scopeHighlights: [
              { highlightRange: [34, 48] },
              { highlightRange: [52, 87] },
              { highlightRange: [91, 116] },
            ],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'genericTemplate',
          'GenericTemplateModel',
          'genericParameters',
          0,
        ],
      }],
    },
    {
      caseKey: 'baseParameterElement__modelProperty',
      caseLabel: 'basic parameter element (model property)',
      caseTechnicalLabel:
        'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => BasicParameterElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['CompositeDataModel.ts']!,
          highlightScopes: [{
            scopeRange: [161, 380],
            scopeHighlights: [
              { highlightRange: [34, 48] },
              { highlightRange: [124, 163] },
            ],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'genericTemplate',
          'GenericTemplateModel',
          'modelProperties',
          'basicParameterProperty',
          'propertyElement',
        ],
      }],
    },
    {
      caseKey: 'constrainedParameterElement__modelProperty',
      caseLabel: 'constrained parameter element (model property)',
      caseTechnicalLabel:
        'GenericTemplateIntermediateModel["modelProperties"][string]["propertyElement"] => ConstrainedParameterElement',
      caseAssertions: [{
        assertionKind: 'direct',
        assertionHighlights: [{
          highlightSource: schemaSources['CompositeDataModel.ts']!,
          highlightScopes: [{
            scopeRange: [161, 380],
            scopeHighlights: [
              { highlightRange: [52, 87] },
              { highlightRange: [166, 217] },
            ],
          }],
        }],
        assertionPath: [
          'schemaModels',
          'genericTemplate',
          'GenericTemplateModel',
          'modelProperties',
          'constrainedParameterProperty',
          'propertyElement',
        ],
      }],
    },
  ];
}
