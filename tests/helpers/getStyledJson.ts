import { throwInvalidPathError } from '../../source/helpers/throwError.ts';

export interface GetStyledJsonApi {
  jsonSource: any;
  jsonPropertyPath: Array<string | number>;
  jsonPropertyStyle: Array<number>;
}

export function getStyledJson(api: GetStyledJsonApi): string {
  const { jsonSource, jsonPropertyPath, jsonPropertyStyle } = api;
  const [maybeCurrentPathKey, ...remainingJsonPropertyPath] = jsonPropertyPath;
  const currentPathKey = maybeCurrentPathKey ??
    throwInvalidPathError('currentPathKey');
  const augmentedJsonSource = jsonSource instanceof Array
    ? [...jsonSource]
    : { ...jsonSource };
  augmentedJsonSource[currentPathKey] = '__<propertyPlaceholder>__';
  const nextPropertySource = jsonSource[currentPathKey];
  const styledJsonResult = JSON.stringify(augmentedJsonSource, null, 1);
  return styledJsonResult.replace(
    '"__<propertyPlaceholder>__"',
    remainingJsonPropertyPath.length === 0
      ? getStyledProperty({
        jsonPropertyStyle,
        propertySource: nextPropertySource,
      }).split('\n').join('\n ')
      : getStyledJson({
        jsonPropertyStyle,
        jsonPropertyPath: remainingJsonPropertyPath,
        jsonSource: nextPropertySource,
      }).split('\n').join('\n  '),
  );
}

interface GetStyledPropertyApi
  extends Pick<GetStyledJsonApi, 'jsonPropertyStyle'> {
  propertySource: unknown;
}

function getStyledProperty(api: GetStyledPropertyApi) {
  const { propertySource, jsonPropertyStyle } = api;
  const sourceJson = JSON.stringify(propertySource, null, 1);
  const sourceLines = sourceJson.split('\n');
  const sourceStylePrefix = jsonPropertyStyle.reduce(
    (stylePrefixResult, someStyleCode) =>
      `${stylePrefixResult}\x1b[${someStyleCode}m`,
    '',
  );
  return sourceLines.map(
    (someSourceLine) => `${sourceStylePrefix}${someSourceLine}\x1b[0m`,
  ).join('\n');
}
