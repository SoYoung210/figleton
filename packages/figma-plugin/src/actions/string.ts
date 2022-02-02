import { NodeElement } from '../model';
import { NodeConstants } from './node';

function toHtmlString(targetNode: NodeElement, rootNode: NodeElement): string {
  const isRootNode = targetNode.id === rootNode.id;
  const isFirstChild = rootNode.children?.some(
    rootChild => rootChild.id === targetNode.id
  );
  const nextValidChildren = targetNode.children?.filter(
    ({ type }) => !NodeConstants.unsupportedTypes.includes(type)
  );
  const hasChildren = nextValidChildren != null;

  const position = isRootNode ? 'relative' : 'absolute';
  const { x, y, width, height } = targetNode.renderBounds;
  const top = isRootNode ? 0 : isFirstChild ? y - rootNode.renderBounds.y : y;
  const left = isRootNode ? 0 : isFirstChild ? x - rootNode.renderBounds.x : x;

  const positionStyleString = `position: '${position}', top: ${top}, left: ${left}, width: ${width}, height: ${height}`;

  return `<div style={{ ${positionStyleString}, border: '1px solid red' }}>${(
    nextValidChildren ?? []
  )
    .map(nextNode => toHtmlString(nextNode, rootNode))
    .join('')}</div>`;
}

// TODO: beautify for codeGen
function beautify(rawHtml: string): string {
  return rawHtml;
}

export const StringFormatter = {
  toHtmlString,
  beautify,
};
