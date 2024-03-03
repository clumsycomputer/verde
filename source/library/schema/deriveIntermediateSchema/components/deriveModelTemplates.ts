import { throwInvalidPathError } from '../../../../helpers/throwError.ts';
import { Typescript } from '../../../../imports/Typescript.ts';
import {
  GenericModelTemplate,
  GenericTemplateIntermediateModel,
  GetThisIntermediateElement,
  IntermediateSchema,
} from '../../types/IntermediateSchema.ts';
import { throwInvalidModelTemplate } from '../helpers/errors.ts';
import { isInterfaceType, isTypeReference } from '../helpers/typeguards.ts';
import {
  __DeriveIntermediateModelApi,
  deriveConcreteTemplateModel,
  deriveGenericTemplateModel,
} from './__deriveIntermediateModel.ts';
import { deriveModelElement } from './deriveModelElement.ts';

export interface DeriveModelTemplatesApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisTargetModelKind,
      ThisModelType
    >,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'typeContext'
    | 'elementTypeCases'
    | 'someModelType'
  > {}

export function deriveModelTemplates<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
>(
  api: DeriveModelTemplatesApi<
    ThisTargetModelKind,
    ThisModelType
  >,
): IntermediateSchema['schemaMap'][ThisTargetModelKind][string][
  'modelTemplates'
] {
  const {
    someModelType,
    schemaTypeChecker,
    schemaResult,
    typeContext,
    elementTypeCases,
  } = api;
  const modelTemplateTypes = someModelType.getBaseTypes() ?? [];
  return modelTemplateTypes.map<
    IntermediateSchema['schemaMap'][ThisTargetModelKind][string][
      'modelTemplates'
    ][
      number
    ]
  >(
    (someModelTemplateType) => {
      if (isInterfaceType(someModelTemplateType)) {
        const concreteTemplateModel = deriveConcreteTemplateModel({
          schemaTypeChecker,
          schemaResult,
          someConcreteTemplateModelType: someModelTemplateType,
          typeContext: [
            ...typeContext,
            {
              infoKind: 'template',
              templateKind: 'concrete',
              infoType: someModelTemplateType,
            },
          ],
        });
        return {
          templateKind: 'concreteTemplate',
          templateModelSymbolKey: concreteTemplateModel.modelSymbolKey,
        };
      } else if (
        isTypeReference(someModelTemplateType) &&
        isInterfaceType(someModelTemplateType.target)
      ) {
        const genericTemplateModel = deriveGenericTemplateModel({
          schemaTypeChecker,
          schemaResult,
          someGenericTemplateModelType: someModelTemplateType.target,
          typeContext: [
            ...typeContext,
            {
              infoKind: 'template',
              templateKind: 'generic',
              infoType: someModelTemplateType,
            },
          ],
        });        
        return {
          templateKind: 'genericTemplate',
          templateModelSymbolKey: genericTemplateModel.modelSymbolKey,
          genericArguments: deriveGenericArguments({
            schemaTypeChecker,
            schemaResult,
            typeContext,
            elementTypeCases,
            genericTemplateModel,
            someGenericModelTemplateType: someModelTemplateType,
          }),
        };
      } else {
        throwInvalidModelTemplate({
          schemaTypeChecker,
          someModelType,
          someModelTemplateType,
        });
      }
    },
  );
}

interface DeriveGenericArgumentsApi<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    DeriveModelTemplatesApi<
      ThisTargetModelKind,
      ThisModelType
    >,
    | 'schemaTypeChecker'
    | 'schemaResult'
    | 'typeContext'
    | 'elementTypeCases'
  > {
  genericTemplateModel: GenericTemplateIntermediateModel;
  someGenericModelTemplateType: Typescript.TypeReference;
}

function deriveGenericArguments<
  ThisTargetModelKind extends keyof IntermediateSchema['schemaMap'],
  ThisModelType extends Typescript.Type,
>(
  api: DeriveGenericArgumentsApi<
    ThisTargetModelKind,
    ThisModelType
  >,
): GenericModelTemplate<
  GetThisIntermediateElement<ThisTargetModelKind>
>['genericArguments'] {
  const {
    someGenericModelTemplateType,
    genericTemplateModel,
    schemaTypeChecker,
    schemaResult,
    typeContext,
    elementTypeCases,
  } = api;
  const argumentElementTypes = someGenericModelTemplateType.typeArguments ??
    throwInvalidPathError('argumentElementTypes');
  return argumentElementTypes.reduce<
    GenericModelTemplate<
      GetThisIntermediateElement<ThisTargetModelKind>
    >['genericArguments']
  >((argumentsResult, someArgumentElementType, argumentIndex) => {
    const argumentParameter =
      genericTemplateModel.genericParameters[argumentIndex] ??
        throwInvalidPathError('argumentParameter');
    const argumentSymbolKey = argumentParameter.parameterSymbol;
    argumentsResult[argumentSymbolKey] = {
      argumentIndex,
      argumentSymbolKey,
      argumentElement: deriveModelElement({
        schemaTypeChecker,
        schemaResult,
        elementTypeCases,
        someElementType: someArgumentElementType,
        typeContext: [
          ...typeContext,
          {
            infoKind: 'element',
            elementKind: 'argument',
            infoType: someArgumentElementType,
          },
        ],
      }),
    };
    return argumentsResult;
  }, {});
}
