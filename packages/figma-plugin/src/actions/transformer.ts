import { NodeElement, NodePositionData } from '../model';
import { nodeConstants } from './node';

function positionTree(
  targetNode: NodeElement,
  rootNode: NodeElement
): NodePositionData {
  const isRootNode = targetNode.id === rootNode.id;
  const isFirstChild = rootNode.children?.some(
    rootChild => rootChild.id === targetNode.id
  );
  const nextValidChildren = targetNode.children?.filter(
    ({ type }) => !nodeConstants.unsupportedTypes.includes(type)
  );

  const position = isRootNode ? 'relative' : 'absolute';
  const { x, y, width, height } = targetNode.renderBounds;
  const top = isRootNode ? 0 : isFirstChild ? y - rootNode.renderBounds.y : y;
  const left = isRootNode ? 0 : isFirstChild ? x - rootNode.renderBounds.x : x;

  return {
    position,
    top,
    left,
    width,
    height,
    children: nextValidChildren?.map(nextNode =>
      positionTree(nextNode, rootNode)
    ),
  };
}

function skeletonJSXString(targetNode: NodePositionData): string {
  const { position, top, left, width, height, children } = targetNode;
  const hasChildren = children != null && children.length > 0;

  const positionStyleString = `position: '${position}', top: ${top}, left: ${left}, width: ${width}, height: ${height}`;
  // TODO: replace to render <Skeleton /> or not
  const mockString = `, border: '1px solid red'`;

  return `<div style={{ ${
    hasChildren ? positionStyleString : positionStyleString.concat(mockString)
  } }}>${(children ?? [])?.map(skeletonJSXString).join('')}</div>`;
}

// TODO: beautify for codeGen
function beautify(rawHtml: string): string {
  return rawHtml;
}

export const transformer = {
  positionTree,
  skeletonJSXString,
  beautify,
};
