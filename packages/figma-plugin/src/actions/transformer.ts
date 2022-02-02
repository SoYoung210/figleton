import { NodeElement } from '../model';
import { nodeConstants } from './node';

function skeletonJSXString(
  targetNode: NodeElement,
  rootNode: NodeElement
): string {
  const isRootNode = targetNode.id === rootNode.id;
  const isFirstChild = rootNode.children?.some(
    rootChild => rootChild.id === targetNode.id
  );
  const nextValidChildren = targetNode.children?.filter(
    ({ type }) => !nodeConstants.unsupportedTypes.includes(type)
  );
  const hasChildren = nextValidChildren != null && nextValidChildren.length > 0;

  const position = isRootNode ? 'relative' : 'absolute';
  const { x, y, width, height } = targetNode.renderBounds;
  const top = isRootNode ? 0 : isFirstChild ? y - rootNode.renderBounds.y : y;
  const left = isRootNode ? 0 : isFirstChild ? x - rootNode.renderBounds.x : x;

  const positionStyleString = `position: '${position}', top: ${top}, left: ${left}, width: ${width}, height: ${height}`;
  // TODO: replace to render <Skeleton /> or not
  const mockString = `, border: '1px solid red'`;

  return `<div style={{ ${
    hasChildren ? positionStyleString : positionStyleString.concat(mockString)
  } }}>${nextValidChildren
    ?.map(nextNode => skeletonJSXString(nextNode, rootNode))
    .join('')}</div>`;
}

// TODO: beautify for codeGen
function beautify(rawHtml: string): string {
  return rawHtml;
}

export const transformer = {
  skeletonJSXString,
  beautify,
};
