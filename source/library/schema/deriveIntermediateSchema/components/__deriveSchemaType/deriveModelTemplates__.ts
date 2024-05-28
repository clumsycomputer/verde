import {
  ConcreteTemplateIntermediateSchemaModel,
  DataIntermediateSchemaModel,
  GenericModelTemplate,
  GenericTemplateIntermediateSchemaModel,
  IntermediateSchemaModel,
} from '../../../types/IntermediateSchema.ts';
import { throwInvalidModelTemplate__DefaultParameterArgument } from '../../errors.ts';
import {
  deriveConcreteTemplateModelType,
  deriveGenericTemplateModelType,
  DeriveModelTemplatesApi__,
} from './__deriveSchemaType.ts';
import { resolveHeritageSourceDeclaration } from '../__resolveSourceDeclaration.ts';
import {
  __DeriveSchemaElementApi,
  deriveDefinitiveElement,
  deriveGenericTemplateModelElement,
} from '../__deriveSchemaElement/__deriveSchemaElement.ts';
import { irrelevantAny } from '../../../../../helpers/types.ts';

export function deriveModelTemplates__deriveDefinitiveModelType__(
  api: DeriveModelTemplatesApi__,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, typeSourceDeclaration } =
    api;
  return __deriveModelTemplates__<
    DataIntermediateSchemaModel | ConcreteTemplateIntermediateSchemaModel
  >({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    deriveModelElement__: deriveDefinitiveElement,
  });
}

export function deriveModelTemplates__deriveGenericTemplateModelType__(
  api: DeriveModelTemplatesApi__,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, typeSourceDeclaration } =
    api;
  return __deriveModelTemplates__<
    GenericTemplateIntermediateSchemaModel
  >({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    deriveModelElement__: deriveGenericTemplateModelElement,
  });
}

export interface __DeriveModelTemplatesApi__<
  ThisSchemaType extends IntermediateSchemaModel,
> extends DeriveModelTemplatesApi__ {
  deriveModelElement__: (
    api: DeriveModelElementApi__,
  ) => ThisSchemaType['typeModelProperties'][string]['propertyElement'];
}

interface DeriveModelElementApi__ extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

function __deriveModelTemplates__<
  ThisSchemaType extends IntermediateSchemaModel,
>(
  api: __DeriveModelTemplatesApi__<ThisSchemaType>,
): ThisSchemaType['typeModelTemplates'] {
  const {
    typeSourceDeclaration,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    deriveModelElement__,
  } = api;
  return typeSourceDeclaration.heritageClauses &&
      typeSourceDeclaration.heritageClauses[0]
    ? typeSourceDeclaration.heritageClauses[0].types.map<
      ThisSchemaType['typeModelTemplates'][number]
    >(
      (someHeritageLocalNode) => {
        const [
          heritageLocalSymbol,
          heritageSourceSymbol,
          heritageSourceDeclaration,
        ] = resolveHeritageSourceDeclaration({
          schemaTypeChecker,
          localNode: someHeritageLocalNode.expression,
        });
        if (heritageSourceDeclaration.typeParameters) {
          schemaDeriveTypeQueue.push({
            deriveThisSchemaType: deriveGenericTemplateModelType,
            thisTypeArguments: {
              typeLocalSymbol: heritageLocalSymbol,
              typeSourceSymbol: heritageSourceSymbol,
              typeSourceDeclaration: heritageSourceDeclaration,
            },
          });
          return {
            templateModelKind: 'genericTemplateModel',
            templateModelName: heritageSourceDeclaration.name.text,
            templateArguments: heritageSourceDeclaration.typeParameters
              .reduce<
                GenericModelTemplate<
                  ThisSchemaType['typeModelProperties'][string][
                    'propertyElement'
                  ]
                >['templateArguments']
              >(
                (
                  genericArgumentsResult,
                  someTypeParameterDeclaration,
                  parameterIndex,
                ) => {
                  const argumentParameterName =
                    someTypeParameterDeclaration.name.text;
                  genericArgumentsResult[argumentParameterName] = {
                    argumentParameterName,
                    argumentIndex: parameterIndex,
                    argumentElement: deriveModelElement__({
                      schemaTypeChecker,
                      schemaDeriveTypeQueue,
                      elementLocalNode: someHeritageLocalNode.typeArguments &&
                          someHeritageLocalNode.typeArguments[parameterIndex] ||
                        throwInvalidModelTemplate__DefaultParameterArgument({
                          typeSourceDeclaration,
                          heritageLocalNode: someHeritageLocalNode,
                        }),
                    }),
                  };
                  return genericArgumentsResult;
                },
                {},
              ),
          };
        } else {
          schemaDeriveTypeQueue.push({
            deriveThisSchemaType: deriveConcreteTemplateModelType,
            thisTypeArguments: {
              typeLocalSymbol: heritageLocalSymbol,
              typeSourceSymbol: heritageSourceSymbol,
              typeSourceDeclaration: heritageSourceDeclaration,
            },
          });
          return {
            templateModelKind: 'concreteTemplateModel',
            templateModelName: heritageSourceDeclaration.name.text,
          };
        }
      },
    )
    : [];
}
