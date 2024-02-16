import { throwInvalidPathError } from '../../../helpers/throwError.ts';
import { Typescript } from '../../../imports/Typescript.ts';
import {
  GenericModelTemplate,
  GenericTemplateIntermediateSchemaModel,
  IntermediateSchemaModel,
} from '../../types/IntermediateSchemaMap.ts';
import { throwInvalidModelTemplate } from '../helpers/errors.ts';
import { isInterfaceType, isTypeReference } from '../helpers/typeguards.ts';
import {
__DeriveIntermediateModelApi,
  deriveConcreteTemplateModel,
  deriveGenericTemplateModel,
} from './__deriveIntermediateModel.ts';
import { GetThisModelElement, deriveModelElement } from './deriveModelElement.ts';

export interface DeriveModelTemplatesApi<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    __DeriveIntermediateModelApi<
      ThisResultModel,
      ThisModelType
    >,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'typeContext'
    | 'elementTypeCases'
    | 'someModelType'
  > {}

export function deriveModelTemplates<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
>(
  api: DeriveModelTemplatesApi<
    ThisResultModel,
    ThisModelType
  >,
): ThisResultModel['modelTemplates'] {
  const {
    someModelType,
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
    elementTypeCases,
  } = api;
  const modelTemplateTypes = someModelType.getBaseTypes() ?? [];
  return modelTemplateTypes.map<ThisResultModel['modelTemplates'][number]>(
    (someModelTemplateType) => {
      if (isInterfaceType(someModelTemplateType)) {
        const concreteTemplateModel = deriveConcreteTemplateModel({
          schemaTypeChecker,
          schemaMapResult,
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
          templateKind: 'concrete',
          templateModelSymbolKey: concreteTemplateModel.modelSymbolKey,
        };
      } else if (
        isTypeReference(someModelTemplateType) &&
        isInterfaceType(someModelTemplateType.target)
      ) {
        const genericTemplateModel = deriveGenericTemplateModel({
          schemaTypeChecker,
          schemaMapResult,
          someGenericTemplateModelType: someModelTemplateType,
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
          templateKind: 'generic',
          templateModelSymbolKey: genericTemplateModel.modelSymbolKey,
          genericArguments: deriveGenericArguments({
            schemaTypeChecker,
            schemaMapResult,
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
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
> extends
  Pick<
    DeriveModelTemplatesApi<
      ThisResultModel,
      ThisModelType
    >,
    | 'schemaTypeChecker'
    | 'schemaMapResult'
    | 'typeContext'
    | 'elementTypeCases'
  > {
  genericTemplateModel: GenericTemplateIntermediateSchemaModel;
  someGenericModelTemplateType: Typescript.TypeReference;
}

function deriveGenericArguments<
  ThisResultModel extends IntermediateSchemaModel,
  ThisModelType extends Typescript.Type,
>(
  api: DeriveGenericArgumentsApi<
    ThisResultModel,
    ThisModelType
  >,
): GenericModelTemplate<
  GetThisModelElement<ThisResultModel>
>['genericArguments'] {
  const {
    someGenericModelTemplateType,
    genericTemplateModel,
    schemaTypeChecker,
    schemaMapResult,
    typeContext,
    elementTypeCases,
  } = api;
  const argumentElementTypes = someGenericModelTemplateType.typeArguments ??
    throwInvalidPathError('argumentElementTypes');
  return argumentElementTypes.reduce<
    GenericModelTemplate<
      GetThisModelElement<ThisResultModel>
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
        schemaMapResult,
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
