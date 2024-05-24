import {
  throwInvalidPathError,
} from '../../../../helpers/throwError.ts';
import { irrelevantAny } from '../../../../helpers/types.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateSchemaModel,
  DataIntermediateSchemaModel,
  GenericTemplateIntermediateSchemaModel,
  IntermediateSchema,
  IntermediateSchemaAlias,
  IntermediateSchemaModel,
  IntermediateSchemaType,
} from '../../types/IntermediateSchema.ts';
import {
  __DeriveIntermediateSchemaApi,
  DeriveSchemaTypeQueueOperation,
} from '../deriveIntermediateSchema.ts';
import {
  throwInvalidGenericTemplateModelParameter__DefaultArgument,
  throwInvalidModelDeclaration__DeclarationMerging,
  throwInvalidTypeDeclaration,
  throwInvalidTypeImport__ImportAliased,
  throwInvalidTypeUsage,
} from '../errors.ts';
import {
  DEFINITIVE_ELEMENT_RESOLVERS,
  GENERIC_ELEMENT_RESOLVERS,
} from './__getElementResolvers.ts';
import { deriveModelProperties } from './deriveModelProperties.ts';
import { deriveModelTemplates } from './deriveModelTemplates.ts';
import { deriveSchemaElement } from './deriveSchemaElement.ts';

export interface DeriveDataModelTypeApi extends Data__DeriveModelTypeApi {}

export function deriveDataModelType(api: DeriveDataModelTypeApi) {
  const {
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
  } = api;
  return __deriveModelType({
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    thisSchemaTypeKind: 'dataModel',
    deriveNewThisSchemaType: deriveNewThisSchemaType__deriveDataModelType,
  });
}

interface DeriveNewThisSchemaTypeApi__deriveDataModelType
  extends Data__DeriveNewThisSchemaTypeApi__DeriveModelType {}

function deriveNewThisSchemaType__deriveDataModelType(
  api: DeriveNewThisSchemaTypeApi__deriveDataModelType,
): DataIntermediateSchemaModel {
  const {
    typeName,
    typeSourcePath,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    typeSourceDeclaration,
  } = api;
  const thisModelElementResolvers = DEFINITIVE_ELEMENT_RESOLVERS;
  return {
    typeName,
    typeSourcePath,
    typeKind: 'dataModel',
    typeModelTemplates: deriveModelTemplates<DataIntermediateSchemaModel>({
      schemaTypeChecker,
      deriveSchemaTypeQueue,
      typeSourceDeclaration,
      thisModelElementResolvers,
    }),
    typeModelProperties: deriveModelProperties<DataIntermediateSchemaModel>({
      schemaTypeChecker,
      deriveSchemaTypeQueue,
      typeSourceDeclaration,
      thisModelElementResolvers,
    }),
  };
}

export interface DeriveConcreteTemplateModelTypeApi
  extends Data__DeriveModelTypeApi {}

export function deriveConcreteTemplateModelType(api: DeriveDataModelTypeApi) {
  const {
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
  } = api;
  return __deriveModelType({
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    thisSchemaTypeKind: 'concreteTemplateModel',
    deriveNewThisSchemaType:
      deriveNewThisSchemaType__deriveConcreteTemplateModelType,
  });
}

interface DeriveNewThisSchemaTypeApi__deriveConcreteTemplateModelType
  extends Data__DeriveNewThisSchemaTypeApi__DeriveModelType {}

function deriveNewThisSchemaType__deriveConcreteTemplateModelType(
  api: DeriveNewThisSchemaTypeApi__deriveConcreteTemplateModelType,
): ConcreteTemplateIntermediateSchemaModel {
  const {
    typeName,
    typeSourcePath,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    typeSourceDeclaration,
  } = api;
  const thisModelElementResolvers = DEFINITIVE_ELEMENT_RESOLVERS;
  return {
    typeName,
    typeSourcePath,
    typeKind: 'concreteTemplateModel',
    typeModelTemplates: deriveModelTemplates<
      ConcreteTemplateIntermediateSchemaModel
    >({
      schemaTypeChecker,
      deriveSchemaTypeQueue,
      typeSourceDeclaration,
      thisModelElementResolvers,
    }),
    typeModelProperties: deriveModelProperties<
      ConcreteTemplateIntermediateSchemaModel
    >({
      schemaTypeChecker,
      deriveSchemaTypeQueue,
      typeSourceDeclaration,
      thisModelElementResolvers,
    }),
  };
}

export interface DeriveGenericTemplateModelTypeApi
  extends Data__DeriveModelTypeApi {}

export function deriveGenericTemplateModelType(api: DeriveDataModelTypeApi) {
  const {
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
  } = api;
  return __deriveModelType({
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    thisSchemaTypeKind: 'genericTemplateModel',
    deriveNewThisSchemaType:
      deriveNewThisSchemaType__deriveGenericTemplateModelType,
  });
}

interface DeriveNewThisSchemaTypeApi__deriveGenericModelType
  extends Data__DeriveNewThisSchemaTypeApi__DeriveModelType {}

function deriveNewThisSchemaType__deriveGenericTemplateModelType(
  api: DeriveNewThisSchemaTypeApi__deriveGenericModelType,
): GenericTemplateIntermediateSchemaModel {
  const {
    typeName,
    typeSourcePath,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    typeSourceDeclaration,
  } = api;
  const thisModelElementResolvers = GENERIC_ELEMENT_RESOLVERS;
  return {
    typeName,
    typeSourcePath,
    typeKind: 'genericTemplateModel',
    typeModelTemplates: deriveModelTemplates<
      GenericTemplateIntermediateSchemaModel
    >({
      schemaTypeChecker,
      deriveSchemaTypeQueue,
      typeSourceDeclaration,
      thisModelElementResolvers,
    }),
    typeModelProperties: deriveModelProperties<
      GenericTemplateIntermediateSchemaModel
    >({
      schemaTypeChecker,
      deriveSchemaTypeQueue,
      typeSourceDeclaration,
      thisModelElementResolvers,
    }),
    typeModelParameters: typeSourceDeclaration.typeParameters?.map((
      someTypeParameterDeclaration,
    ) =>
      someTypeParameterDeclaration.default
        ? throwInvalidGenericTemplateModelParameter__DefaultArgument({
          typeName,
          typeParameterDeclaration: someTypeParameterDeclaration,
        })
        : someTypeParameterDeclaration.constraint
        ? {
          parameterKind: 'constrained',
          parameterName: someTypeParameterDeclaration.name.text,
          parameterConstraint: Typescript.isTypeReferenceNode(
              someTypeParameterDeclaration.constraint,
            )
            ? someTypeParameterDeclaration.name.text
            : schemaTypeChecker.typeToString(
              schemaTypeChecker.getTypeFromTypeNode(
                someTypeParameterDeclaration.constraint,
              ),
            ),
        }
        : {
          parameterKind: 'basic',
          parameterName: someTypeParameterDeclaration.name.text,
        }
    ) ?? throwInvalidPathError('typeSourceDeclaration.typeParameters'),
  };
}

interface __DeriveModelTypeApi<ThisSchemaType extends IntermediateSchemaModel>
  extends
    Config__DeriveModelTypeApi<ThisSchemaType>,
    Data__DeriveModelTypeApi {}

interface Config__DeriveModelTypeApi<
  ThisSchemaType extends IntermediateSchemaModel,
> extends
  Pick<
    Config__DeriveSchemaTypeApi<
      ThisSchemaType,
      Typescript.InterfaceDeclaration
    >,
    'thisSchemaTypeKind' | 'deriveNewThisSchemaType'
  > {}

interface Data__DeriveModelTypeApi
  extends Data__DeriveSchemaTypeApi<Typescript.InterfaceDeclaration> {}

function __deriveModelType<ThisSchemaType extends IntermediateSchemaModel>(
  api: __DeriveModelTypeApi<ThisSchemaType>,
) {
  const {
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    thisSchemaTypeKind,
    deriveNewThisSchemaType,
  } = api;
  return __deriveSchemaType({
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    thisSchemaTypeKind,
    deriveNewThisSchemaType,
    thisSchemaTypeSourceValidators: [
      validateThisSchemaTypeSourceName,
      validateThisModelTypeSourceDeclarations,
    ],
  });
}

function validateThisModelTypeSourceDeclarations(
  api: ValidateThisSchemaTypeSourceApi,
) {
  const { typeSourceSymbol } = api;
  if (typeSourceSymbol.declarations!.length > 1) {
    throwInvalidModelDeclaration__DeclarationMerging({
      typeSourceSymbol,
    });
  }
}

export interface Data__DeriveNewThisSchemaTypeApi__DeriveModelType
  extends Data__DeriveNewThisSchemaTypeApi<Typescript.InterfaceDeclaration> {}

export interface DeriveAliasTypeApi
  extends Data__DeriveSchemaTypeApi<Typescript.TypeAliasDeclaration> {}

export function deriveAliasType(api: DeriveAliasTypeApi) {
  const {
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
  } = api;
  return __deriveSchemaType({
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    thisSchemaTypeKind: 'alias',
    deriveNewThisSchemaType: deriveNewThisSchemaType__deriveAliasType,
    thisSchemaTypeSourceValidators: [validateThisSchemaTypeSourceName],
  });
}

interface DeriveNewThisSchemaTypeApi__deriveAliasType
  extends Data__DeriveNewThisSchemaTypeApi<Typescript.TypeAliasDeclaration> {}

function deriveNewThisSchemaType__deriveAliasType(
  api: DeriveNewThisSchemaTypeApi__deriveAliasType,
): IntermediateSchemaAlias {
  const {
    typeName,
    typeSourcePath,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    typeSourceDeclaration,
  } = api;
  return {
    typeName,
    typeSourcePath,
    typeKind: 'alias',
    typeAliasElement: deriveSchemaElement({
      schemaTypeChecker,
      deriveSchemaTypeQueue,
      elementLocalNode: typeSourceDeclaration.type,
      elementResolvers: DEFINITIVE_ELEMENT_RESOLVERS,
    }),
  };
}

export interface __DeriveSchemaTypeApi<
  ThisSchemaType extends IntermediateSchemaType,
  ThisSourceDeclaration extends
    | Typescript.InterfaceDeclaration
    | Typescript.TypeAliasDeclaration,
> extends
  Config__DeriveSchemaTypeApi<ThisSchemaType, ThisSourceDeclaration>,
  Data__DeriveSchemaTypeApi<ThisSourceDeclaration> {}

export interface Data__DeriveSchemaTypeApi<
  ThisSourceDeclaration extends
    | Typescript.InterfaceDeclaration
    | Typescript.TypeAliasDeclaration,
> extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  deriveSchemaTypeQueue: Array<DeriveSchemaTypeQueueOperation>;
  schemaResult: IntermediateSchema;
  typeLocalSymbol: Typescript.Symbol;
  typeSourceSymbol: Typescript.Symbol;
  typeSourceDeclaration: ThisSourceDeclaration;
}

interface Config__DeriveSchemaTypeApi<
  ThisSchemaType extends IntermediateSchemaType,
  ThisSourceDeclaration extends
    | Typescript.InterfaceDeclaration
    | Typescript.TypeAliasDeclaration,
> {
  thisSchemaTypeKind: ThisSchemaType['typeKind'];
  thisSchemaTypeSourceValidators: Array<
    (api: ValidateThisSchemaTypeSourceApi) => void
  >;
  deriveNewThisSchemaType: (
    api: DeriveNewThisSchemaTypeApi<ThisSourceDeclaration>,
  ) => ThisSchemaType;
}

interface ValidateThisSchemaTypeSourceApi extends
  Pick<
    Data__DeriveSchemaTypeApi<irrelevantAny>,
    'typeLocalSymbol' | 'typeSourceSymbol'
  > {}

interface DeriveNewThisSchemaTypeApi<
  ThisSourceDeclaration extends
    | Typescript.InterfaceDeclaration
    | Typescript.TypeAliasDeclaration,
> extends Data__DeriveNewThisSchemaTypeApi<ThisSourceDeclaration> {}

interface Data__DeriveNewThisSchemaTypeApi<
  ThisSourceDeclaration extends
    | Typescript.InterfaceDeclaration
    | Typescript.TypeAliasDeclaration,
> extends
  Pick<
    Data__DeriveSchemaTypeApi<ThisSourceDeclaration>,
    'schemaTypeChecker' | 'deriveSchemaTypeQueue' | 'typeSourceDeclaration'
  > {
  typeName: string;
  typeSourcePath: string;
}

function __deriveSchemaType<
  ThisSchemaType extends IntermediateSchemaType,
  ThisSourceDeclaration extends
    | Typescript.InterfaceDeclaration
    | Typescript.TypeAliasDeclaration,
>(
  api: __DeriveSchemaTypeApi<ThisSchemaType, ThisSourceDeclaration>,
): ThisSchemaType {
  const {
    thisSchemaTypeSourceValidators,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    schemaResult,
    thisSchemaTypeKind,
    deriveNewThisSchemaType,
    schemaTypeChecker,
    deriveSchemaTypeQueue,
  } = api;
  for (const validateThisSchemaTypeSource of thisSchemaTypeSourceValidators) {
    validateThisSchemaTypeSource({
      typeLocalSymbol,
      typeSourceSymbol,
    });
  }
  const typeName = typeSourceDeclaration.name.text;
  const typeSourcePath = typeSourceDeclaration.getSourceFile().fileName;
  const cachedSchemaType = schemaResult.schemaTypes[typeName];
  if (
    cachedSchemaType &&
    isValidThisSchemaType(
      cachedSchemaType,
      thisSchemaTypeKind,
      typeSourcePath,
    )
  ) {
    return cachedSchemaType;
  }
  return deriveNewThisSchemaType({
    schemaTypeChecker,
    deriveSchemaTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
  });
}

function isValidThisSchemaType<ThisSchemaType extends IntermediateSchemaType>(
  cachedSchemaType: IntermediateSchemaType,
  thisSchemaTypeKind: ThisSchemaType['typeKind'],
  typeSourcePath: string,
): cachedSchemaType is ThisSchemaType {
  if (cachedSchemaType === undefined) {
    return false;
  } else if (cachedSchemaType.typeKind !== thisSchemaTypeKind) {
    throwInvalidTypeUsage({
      cachedSchemaType,
      thisSchemaTypeKind,
    });
  } else if (cachedSchemaType.typeSourcePath !== typeSourcePath) {
    throwInvalidTypeDeclaration({
      cachedSchemaType,
    });
  }
  return true;
}

function validateThisSchemaTypeSourceName(
  api: ValidateThisSchemaTypeSourceApi,
) {
  const { typeLocalSymbol, typeSourceSymbol } = api;
  if (typeLocalSymbol.name !== typeSourceSymbol.name) {
    throwInvalidTypeImport__ImportAliased({
      typeLocalSymbol,
      typeSourceSymbol,
    });
  }
}
