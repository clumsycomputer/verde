import { throwInvalidPathError } from '../../../../../helpers/throwError.ts';
import { irrelevantAny } from '../../../../../helpers/types.ts';
import { Typescript } from '../../../../../imports/Typescript.ts';
import {
  ConcreteTemplateIntermediateSchemaModel,
  DataIntermediateSchemaModel,
  GenericTemplateIntermediateSchemaModel,
  IntermediateSchema,
  IntermediateSchemaAlias,
  IntermediateSchemaModel,
  IntermediateSchemaType,
} from '../../../types/IntermediateSchema.ts';
import {
  __DeriveIntermediateSchemaApi,
  SchemaDeriveTypeQueueOperation,
} from '../../deriveIntermediateSchema.ts';
import {
  throwInvalidGenericTemplateModelParameter__DefaultArgument,
  throwInvalidModelDeclaration__DeclarationMerging,
  throwInvalidTypeDeclaration,
  throwInvalidTypeImport__ImportAliased,
  throwInvalidTypeUsage,
} from '../../errors.ts';
import { deriveDefinitiveElement } from '../__deriveSchemaElement/__deriveSchemaElement.ts';
import { deriveModelProperties__deriveDefinitiveModelType__, deriveModelProperties__deriveGenericTemplateModelType__ } from './deriveModelProperties__.ts';
import { deriveModelTemplates__deriveDefinitiveModelType__, deriveModelTemplates__deriveGenericTemplateModelType__ } from './deriveModelTemplates__.ts';

interface DeriveDataModelTypeApi extends
  Pick<
    __DeriveModelTypeApi<irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'schemaResult'
    | 'typeLocalSymbol'
    | 'typeSourceSymbol'
    | 'typeSourceDeclaration'
  > {}

export function deriveDataModelType(
  api: DeriveDataModelTypeApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
  } = api;
  return __deriveModelType({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    typeKind__: 'dataModel',
    deriveNewSchemaType__: deriveNewSchemaType__deriveDataModelType__,
  });
}

interface DeriveNewSchemaTypeApi__deriveDataModelType__ extends
  Pick<
    __DeriveNewSchemaTypeApi__deriveDefinitiveModelType__<irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'typeSourceDeclaration'
    | 'typeName'
    | 'typeSourcePath'
  > {}

function deriveNewSchemaType__deriveDataModelType__(
  api: DeriveNewSchemaTypeApi__deriveDataModelType__,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
  } = api;
  return __deriveNewSchemaType__deriveDefinitiveModelType__({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
    deriveNewModelType__: deriveNewModelType__deriveDataModelType__,
  });
}

function deriveNewModelType__deriveDataModelType__(
  api: DeriveNewModelTypeApi__<DataIntermediateSchemaModel>,
): DataIntermediateSchemaModel {
  const { typeName, typeSourcePath, typeModelTemplates, typeModelProperties } =
    api;
  return {
    typeName,
    typeSourcePath,
    typeModelTemplates,
    typeModelProperties,
    typeKind: 'dataModel',
  };
}

interface DeriveConcreteTemplateModelTypeApi extends
  Pick<
    __DeriveModelTypeApi<irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'schemaResult'
    | 'typeLocalSymbol'
    | 'typeSourceSymbol'
    | 'typeSourceDeclaration'
  > {}

export function deriveConcreteTemplateModelType(
  api: DeriveConcreteTemplateModelTypeApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
  } = api;
  return __deriveModelType({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    typeKind__: 'concreteTemplateModel',
    deriveNewSchemaType__:
      deriveNewSchemaType__deriveConcreteTemplateModelType__,
  });
}

interface DeriveNewSchemaTypeApi__deriveConcreteTemplateModelType__
  extends
    Pick<
      __DeriveNewSchemaTypeApi__deriveDefinitiveModelType__<irrelevantAny>,
      | 'schemaTypeChecker'
      | 'schemaDeriveTypeQueue'
      | 'typeSourceDeclaration'
      | 'typeName'
      | 'typeSourcePath'
    > {}

function deriveNewSchemaType__deriveConcreteTemplateModelType__(
  api: DeriveNewSchemaTypeApi__deriveConcreteTemplateModelType__,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
  } = api;
  return __deriveNewSchemaType__deriveDefinitiveModelType__({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
    deriveNewModelType__: deriveNewModelType__deriveConcreteTemplateModelType__,
  });
}

function deriveNewModelType__deriveConcreteTemplateModelType__(
  api: DeriveNewModelTypeApi__<ConcreteTemplateIntermediateSchemaModel>,
): ConcreteTemplateIntermediateSchemaModel {
  const { typeName, typeSourcePath, typeModelTemplates, typeModelProperties } =
    api;
  return {
    typeName,
    typeSourcePath,
    typeModelTemplates,
    typeModelProperties,
    typeKind: 'concreteTemplateModel',
  };
}

interface __DeriveNewSchemaTypeApi__deriveDefinitiveModelType__<
  ThisSchemaType extends
    | DataIntermediateSchemaModel
    | ConcreteTemplateIntermediateSchemaModel,
> extends
  Pick<
    __DeriveNewSchemaTypeApi__deriveModelType__<ThisSchemaType>,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'typeSourceDeclaration'
    | 'typeName'
    | 'typeSourcePath'
    | 'deriveNewModelType__'
  > {}

function __deriveNewSchemaType__deriveDefinitiveModelType__<
  ThisSchemaType extends
    | DataIntermediateSchemaModel
    | ConcreteTemplateIntermediateSchemaModel,
>(
  api: __DeriveNewSchemaTypeApi__deriveDefinitiveModelType__<ThisSchemaType>,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
    deriveNewModelType__,
  } = api;
  return __deriveNewSchemaType__deriveModelType__({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
    deriveNewModelType__,
    deriveModelTemplates__: deriveModelTemplates__deriveDefinitiveModelType__,
    deriveModelProperties__: deriveModelProperties__deriveDefinitiveModelType__,
  });
}

export interface DeriveGenericTemplateModelTypeApi extends
  Pick<
    __DeriveModelTypeApi<irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'schemaResult'
    | 'typeLocalSymbol'
    | 'typeSourceSymbol'
    | 'typeSourceDeclaration'
  > {}

export function deriveGenericTemplateModelType(
  api: DeriveGenericTemplateModelTypeApi,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
  } = api;
  return __deriveModelType({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    typeKind__: 'genericTemplateModel',
    deriveNewSchemaType__:
      deriveNewSchemaType__deriveGenericTemplateModelType__,
  });
}

interface __DeriveNewSchemaTypeApi__deriveGenericTemplateModelType__
  extends
    Pick<
      __DeriveNewSchemaTypeApi__deriveModelType__<irrelevantAny>,
      | 'schemaTypeChecker'
      | 'schemaDeriveTypeQueue'
      | 'typeSourceDeclaration'
      | 'typeName'
      | 'typeSourcePath'
    > {}

function deriveNewSchemaType__deriveGenericTemplateModelType__(
  api: __DeriveNewSchemaTypeApi__deriveGenericTemplateModelType__,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
  } = api;
  return __deriveNewSchemaType__deriveModelType__({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
    deriveNewModelType__: deriveNewModelType__deriveGenericTemplateModelType__,
    deriveModelTemplates__:
      deriveModelTemplates__deriveGenericTemplateModelType__,
    deriveModelProperties__:
      deriveModelProperties__deriveGenericTemplateModelType__,
  });
}

function deriveNewModelType__deriveGenericTemplateModelType__(
  api: DeriveNewModelTypeApi__<GenericTemplateIntermediateSchemaModel>,
): GenericTemplateIntermediateSchemaModel {
  const {
    typeName,
    typeSourcePath,
    typeModelTemplates,
    typeModelProperties,
    typeSourceDeclaration,
    schemaTypeChecker,
  } = api;
  return {
    typeName,
    typeSourcePath,
    typeModelTemplates,
    typeModelProperties,
    typeKind: 'genericTemplateModel',
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
    Pick<
      __DeriveSchemaTypeApi<ThisSchemaType, Typescript.InterfaceDeclaration>,
      | 'schemaTypeChecker'
      | 'schemaDeriveTypeQueue'
      | 'schemaResult'
      | 'typeSourceDeclaration'
      | 'typeLocalSymbol'
      | 'typeSourceSymbol'
      | 'typeKind__'
      | 'deriveNewSchemaType__'
    > {}

function __deriveModelType<ThisSchemaType extends IntermediateSchemaModel>(
  api: __DeriveModelTypeApi<ThisSchemaType>,
) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    typeKind__,
    deriveNewSchemaType__,
  } = api;
  return __deriveSchemaType({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    typeKind__,
    deriveNewSchemaType__,
    schemaTypeSourceValidators__: [
      validateSchemaTypeSource__DirectImport__,
      validateSchemaTypeSource__SingularDeclaration__,
    ],
  });
}

function validateSchemaTypeSource__SingularDeclaration__(
  api: ValidateSchemaTypeSourceApi__,
) {
  const { typeSourceSymbol } = api;
  if (typeSourceSymbol.declarations!.length > 1) {
    throwInvalidModelDeclaration__DeclarationMerging({
      typeSourceSymbol,
    });
  }
}

interface __DeriveNewSchemaTypeApi__deriveModelType__<
  ThisSchemaType extends IntermediateSchemaModel,
> extends DeriveNewSchemaTypeApi__<Typescript.InterfaceDeclaration> {
  deriveNewModelType__: (
    api: DeriveNewModelTypeApi__<ThisSchemaType>,
  ) => ThisSchemaType;
  deriveModelTemplates__: (
    api: DeriveModelTemplatesApi__,
  ) => ThisSchemaType['typeModelTemplates'];
  deriveModelProperties__: (
    api: DeriveModelPropertiesApi__,
  ) => ThisSchemaType['typeModelProperties'];
}

interface DeriveNewModelTypeApi__<
  ThisSchemaType extends IntermediateSchemaModel,
> extends
  Pick<
    __DeriveNewSchemaTypeApi__deriveModelType__<ThisSchemaType>,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'typeSourceDeclaration'
    | 'typeName'
    | 'typeSourcePath'
  >,
  Pick<ThisSchemaType, 'typeModelTemplates' | 'typeModelProperties'> {}

export interface DeriveModelTemplatesApi__ extends
  Pick<
    __DeriveNewSchemaTypeApi__deriveModelType__<irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'typeSourceDeclaration'
  > {}

export interface DeriveModelPropertiesApi__ extends
  Pick<
    __DeriveNewSchemaTypeApi__deriveModelType__<irrelevantAny>,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'typeSourceDeclaration'
  > {}

function __deriveNewSchemaType__deriveModelType__<
  ThisSchemaType extends IntermediateSchemaModel,
>(
  api: __DeriveNewSchemaTypeApi__deriveModelType__<ThisSchemaType>,
): ThisSchemaType {
  const {
    deriveNewModelType__,
    typeName,
    typeSourcePath,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    deriveModelTemplates__,
    deriveModelProperties__,
  } = api;
  return deriveNewModelType__({
    typeName,
    typeSourcePath,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeModelTemplates: deriveModelTemplates__({
      schemaTypeChecker,
      schemaDeriveTypeQueue,
      typeSourceDeclaration,
    }),
    typeModelProperties: deriveModelProperties__({
      schemaTypeChecker,
      schemaDeriveTypeQueue,
      typeSourceDeclaration,
    }),
  });
}

interface DeriveAliasTypeApi extends
  Pick<
    __DeriveSchemaTypeApi<
      irrelevantAny,
      Typescript.TypeAliasDeclaration
    >,
    | 'schemaTypeChecker'
    | 'schemaDeriveTypeQueue'
    | 'schemaResult'
    | 'typeLocalSymbol'
    | 'typeSourceSymbol'
    | 'typeSourceDeclaration'
  > {}

export function deriveAliasType(api: DeriveAliasTypeApi) {
  const {
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
  } = api;
  return __deriveSchemaType({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    schemaResult,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    typeKind__: 'alias',
    deriveNewSchemaType__: deriveNewSchemaType__deriveAliasType__,
    schemaTypeSourceValidators__: [
      validateSchemaTypeSource__DirectImport__,
    ],
  });
}

function deriveNewSchemaType__deriveAliasType__(
  api: DeriveNewSchemaTypeApi__<Typescript.TypeAliasDeclaration>,
): IntermediateSchemaAlias {
  const {
    typeName,
    typeSourcePath,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
  } = api;
  return {
    typeName,
    typeSourcePath,
    typeKind: 'alias',
    typeAliasElement: deriveDefinitiveElement({
      schemaTypeChecker,
      schemaDeriveTypeQueue,
      elementLocalNode: typeSourceDeclaration.type,
    }),
  };
}

export interface __DeriveSchemaTypeApi<
  ThisSchemaType extends IntermediateSchemaType,
  ThisSourceDeclaration extends
    | Typescript.InterfaceDeclaration
    | Typescript.TypeAliasDeclaration,
> extends Pick<__DeriveIntermediateSchemaApi, 'schemaTypeChecker'> {
  schemaDeriveTypeQueue: Array<SchemaDeriveTypeQueueOperation>;
  schemaResult: IntermediateSchema;
  typeLocalSymbol: Typescript.Symbol;
  typeSourceSymbol: Typescript.Symbol;
  typeSourceDeclaration: ThisSourceDeclaration;
  typeKind__: ThisSchemaType['typeKind'];
  schemaTypeSourceValidators__: Array<
    (api: ValidateSchemaTypeSourceApi__) => void
  >;
  deriveNewSchemaType__: (
    api: DeriveNewSchemaTypeApi__<ThisSourceDeclaration>,
  ) => ThisSchemaType;
}

interface ValidateSchemaTypeSourceApi__ extends
  Pick<
    __DeriveSchemaTypeApi<irrelevantAny, irrelevantAny>,
    'typeLocalSymbol' | 'typeSourceSymbol'
  > {}

interface DeriveNewSchemaTypeApi__<
  ThisSourceDeclaration extends
    | Typescript.InterfaceDeclaration
    | Typescript.TypeAliasDeclaration,
> extends
  Pick<
    __DeriveSchemaTypeApi<irrelevantAny, ThisSourceDeclaration>,
    'schemaTypeChecker' | 'schemaDeriveTypeQueue' | 'typeSourceDeclaration'
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
    schemaTypeSourceValidators__,
    typeLocalSymbol,
    typeSourceSymbol,
    typeSourceDeclaration,
    schemaResult,
    typeKind__,
    deriveNewSchemaType__,
    schemaTypeChecker,
    schemaDeriveTypeQueue,
  } = api;
  for (
    const validateSchemaTypeSource__ of schemaTypeSourceValidators__
  ) {
    validateSchemaTypeSource__({
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
      typeKind__,
      typeSourcePath,
    )
  ) {
    return cachedSchemaType;
  }
  return deriveNewSchemaType__({
    schemaTypeChecker,
    schemaDeriveTypeQueue,
    typeSourceDeclaration,
    typeName,
    typeSourcePath,
  });
}

function isValidThisSchemaType<ThisSchemaType extends IntermediateSchemaType>(
  cachedSchemaType: IntermediateSchemaType,
  thisTypeKind: ThisSchemaType['typeKind'],
  typeSourcePath: string,
): cachedSchemaType is ThisSchemaType {
  if (cachedSchemaType === undefined) {
    return false;
  } else if (cachedSchemaType.typeKind !== thisTypeKind) {
    throwInvalidTypeUsage({
      cachedSchemaType,
      thisTypeKind,
    });
  } else if (cachedSchemaType.typeSourcePath !== typeSourcePath) {
    throwInvalidTypeDeclaration({
      cachedSchemaType,
    });
  }
  return true;
}

function validateSchemaTypeSource__DirectImport__(
  api: ValidateSchemaTypeSourceApi__,
) {
  const { typeLocalSymbol, typeSourceSymbol } = api;
  if (typeLocalSymbol.name !== typeSourceSymbol.name) {
    throwInvalidTypeImport__ImportAliased({
      typeLocalSymbol,
      typeSourceSymbol,
    });
  }
}
