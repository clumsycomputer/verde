import { irrelevantAny } from '../../../../../helpers/types.ts';
import { Typescript } from '../../../../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateSchemaModel,
  DataIntermediateSchemaModel,
  GenericTemplateIntermediateSchemaModel,
  IntermediateSchemaModel,
} from '../../../types/IntermediateSchema.ts';
import { throwInvalidModel__NonPropertySignature } from '../../errors.ts';
import {
  __DeriveSchemaElementApi,
  deriveDefinitiveElement,
  deriveGenericTemplateModelElement,
} from '../__deriveSchemaElement/__deriveSchemaElement.ts';
import { DeriveModelPropertiesApi__ } from './__deriveSchemaType.ts';

export function deriveModelProperties__deriveDefinitiveModelType__(
  api: DeriveModelPropertiesApi__,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, typeSourceDeclaration } =
    api;
  return __deriveModelProperties__<
    DataIntermediateSchemaModel | ConcreteTemplateIntermediateSchemaModel
  >({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    deriveModelElement__: deriveDefinitiveElement,
  });
}

export function deriveModelProperties__deriveGenericTemplateModelType__(
  api: DeriveModelPropertiesApi__,
) {
  const { schemaTypeChecker, schemaDeriveTypeQueue, typeSourceDeclaration } =
    api;
  return __deriveModelProperties__<
    GenericTemplateIntermediateSchemaModel
  >({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    deriveModelElement__: deriveGenericTemplateModelElement,
  });
}

interface __DeriveModelPropertiesApi__<
  ThisSchemaType extends IntermediateSchemaModel,
> extends DeriveModelPropertiesApi__ {
  deriveModelElement__: (
    api: DeriveModelElementApi__,
  ) => ThisSchemaType['typeModelProperties'][string]['propertyElement'];
}

interface DeriveModelElementApi__ extends
  Pick<
    __DeriveSchemaElementApi<irrelevantAny>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'elementLocalNode'
  > {}

function __deriveModelProperties__<
  ThisSchemaType extends IntermediateSchemaModel,
>(
  api: __DeriveModelPropertiesApi__<ThisSchemaType>,
): ThisSchemaType['typeModelProperties'] {
  const {
    typeSourceDeclaration,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    deriveModelElement__,
  } = api;
  return typeSourceDeclaration.members.reduce<
    ThisSchemaType['typeModelProperties']
  >(
    (modelPropertiesResult, someModelMemberNode) => {
      if (
        Typescript.isPropertySignature(someModelMemberNode) &&
        Typescript.isIdentifier(someModelMemberNode.name) &&
        someModelMemberNode.type
      ) {
        const propertyKey = someModelMemberNode.name.text;
        modelPropertiesResult[propertyKey] = {
          propertyKey,
          propertyElement: deriveModelElement__({
            schemaTypeChecker,
            schemaDeriveTypeQueue,
            elementLocalNode: someModelMemberNode.type,
          }),
        };
      } else {
        throwInvalidModel__NonPropertySignature({
          modelMemberNode: someModelMemberNode,
        });
      }
      return modelPropertiesResult;
    },
    {},
  );
}
