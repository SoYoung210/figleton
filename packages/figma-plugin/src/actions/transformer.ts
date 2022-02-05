import { html_beautify } from 'js-beautify';
import { NodeElement, NodePositionData } from './model/node';
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

type ElementType = 'Skeleton' | 'div';
function skeletonJSXString(targetNode: NodePositionData): string {
  const { position, top, left, width, height, children } = targetNode;
  const shouldDrawSkeleton = children == null || children.length === 0;

  const styleString = `position: '${position}', top: ${top}, left: ${left}, width: ${width}, height: ${height}`;
  const elementType: ElementType = shouldDrawSkeleton ? 'Skeleton' : 'div';

  return `<${elementType} style={{ ${styleString} }}>${(children ?? [])
    ?.map(skeletonJSXString)
    .join('')}</${elementType}>`;
}

function beautify(rawHtml: string): string {
  return html_beautify(rawHtml, { indent_size: 2, indent_with_tabs: false });
}

function isComponent(elementType: string) {
  return /[A-Z]/.test(elementType);
}

function getPropsByElementType(elementType: ElementType) {
  if (elementType === 'Skeleton') {
  }
}

export const transformer = {
  positionTree,
  skeletonJSXString,
  beautify,
};
