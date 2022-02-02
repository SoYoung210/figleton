import { NodeElement } from '../model';

function toHtmlString(targetNode: NodeElement, rootNode: NodeElement): string {
  const isRootNode = targetNode.id === rootNode.id;

  const isRootFirstChild = rootNode.children?.some(
    rootChild => rootChild.id === targetNode.id
  );

  const position = isRootNode ? 'relative' : 'absolute';
  const { x, y, width, height } = targetNode.renderBounds;
  const top = isRootNode
    ? 0
    : isRootFirstChild
    ? y - rootNode.renderBounds.y
    : y;
  const left = isRootNode
    ? 0
    : isRootFirstChild
    ? x - rootNode.renderBounds.x
    : x;

  return `<div style={{ position: '${position}', top: ${top}, left: ${left}, width: ${width}, height: ${height}, border: '1px solid red' }}>${(
    targetNode.children ?? []
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
