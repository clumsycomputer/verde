import { throwInvalidPathError } from '../../source/helpers/throwError.ts';

export const styledJson = getStyledJson;

export const branchJsonNode = getBranchJsonNode;

export const leafJsonNode = getLeafJsonNode;

export interface GetStyledJsonApi {
  jsonSource: any;
  jsonNodes: Array<JsonNode>;
}

type JsonNode = BranchJsonNode | LeafJsonNode;

interface BranchJsonNode extends __JsonNode<'branch'> {
  nodeChildren: Array<JsonNode>;
}

interface LeafJsonNode extends __JsonNode<'leaf'> {
  nodeStyle: Array<number>;
}

interface __JsonNode<ThisNodeKind> {
  nodeKind: ThisNodeKind;
  nodeKey: string | number;
}

export function getStyledJson(api: GetStyledJsonApi): string {
  const { jsonSource, jsonNodes } = api;
  const augmentedJsonSource = jsonSource instanceof Array
    ? [...jsonSource]
    : { ...jsonSource };
  jsonNodes.forEach((someJsonNode) => {
    augmentedJsonSource[someJsonNode.nodeKey] = `__<${someJsonNode.nodeKey}>__`;
  });
  return jsonNodes.reduce((styledJsonResult, someJsonNode) => {
    const nextSource = jsonSource[someJsonNode.nodeKey] ??
      throwInvalidPathError('nextSource');
    return styledJsonResult.replace(
      `"__<${someJsonNode.nodeKey}>__"`,
      someJsonNode.nodeKind === 'branch'
        ? getStyledJson({
          jsonSource: nextSource,
          jsonNodes: someJsonNode.nodeChildren,
        }).split('\n').join('\n  ')
        : getStyledProperty({
          propertySource: nextSource,
          propertyStyle: someJsonNode.nodeStyle,
        }).split('\n').join('\n '),
    );
  }, JSON.stringify(augmentedJsonSource, null, 1));
}

interface GetStyledPropertyApi {
  propertySource: unknown;
  propertyStyle: LeafJsonNode['nodeStyle'];
}

function getStyledProperty(api: GetStyledPropertyApi) {
  const { propertySource, propertyStyle } = api;
  const sourceJson = JSON.stringify(propertySource, null, 1);
  const sourceLines = sourceJson.split('\n');
  const sourceStylePrefix = propertyStyle.reduce(
    (stylePrefixResult, someStyleCode) =>
      `${stylePrefixResult}\x1b[${someStyleCode}m`,
    '',
  );
  return sourceLines.map(
    (someSourceLine) => `${sourceStylePrefix}${someSourceLine}\x1b[0m`,
  ).join('\n');
}

export interface GetBranchNodeApi
  extends Pick<BranchJsonNode, 'nodeKey' | 'nodeChildren'> {}

export function getBranchJsonNode(api: GetBranchNodeApi): BranchJsonNode {
  const { nodeKey, nodeChildren } = api;
  return {
    nodeKind: 'branch',
    nodeKey,
    nodeChildren,
  };
}

export interface GetLeafNodeApi
  extends Pick<LeafJsonNode, 'nodeKey' | 'nodeStyle'> {}

export function getLeafJsonNode(api: GetLeafNodeApi): LeafJsonNode {
  const { nodeKey, nodeStyle } = api;
  return {
    nodeKind: 'leaf',
    nodeKey,
    nodeStyle
  };
}

