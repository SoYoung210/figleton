import { html_beautify } from 'js-beautify';
import { SkeletonOption } from '../model';
import { NodeElement, NodePositionData } from './model/node';
import { nodeConstants } from './node';

/**
 * Comparison of parent parent's absoluteX and absoluteY values and children's x and y values
 */
function positionTree(
  targetNode: NodeElement,
  rootNode: NodeElement
): NodePositionData {
  const isRootNode = targetNode.id === rootNode.id;
  const nextValidChildren = targetNode.children?.filter(
    ({ type }) => !nodeConstants.unsupportedTypes.includes(type)
  );

  const position = isRootNode ? 'relative' : 'absolute';
  const { x, y, width, height } = targetNode.renderBounds;
  const top = isRootNode ? 0 : y - rootNode.renderBounds.y;
  const left = isRootNode ? 0 : x - rootNode.renderBounds.x;

  return {
    position,
    top,
    left,
    width,
    height,
    children: nextValidChildren?.map(nextNode =>
      positionTree(nextNode, targetNode)
    ),
  };
}

type ElementType = 'Skeleton' | 'div';
function skeletonJSXString(
  targetNode: NodePositionData,
  options: SkeletonOption | undefined = {}
): string {
  const { position, top, left, width, height, children } = targetNode;
  const shouldDrawSkeleton = children == null || children.length === 0;

  const isNumericWidth = typeof width === 'number';
  const isNumericHeight = typeof height === 'number';
  const isNumericSize = isNumericWidth && isNumericHeight;
  const isSquareLike = isNumericSize && Math.abs(1 - height / width) < 0.1;

  const styleString = `position: '${position}', top: ${top}, left: ${left}, width: ${
    isNumericWidth ? width : `'${width}'`
  }, height: ${isNumericHeight ? height : `'${height}'`}`;

  const elementType: ElementType = shouldDrawSkeleton ? 'Skeleton' : 'div';
  const customProps = getPropsByElementType(elementType, {
    ...options,
    isSquareLike,
  });

  return `<${elementType} style={{ ${styleString} }} ${customProps}>${(
    children ?? []
  )
    ?.map(childNode => skeletonJSXString(childNode, options))
    .join('')}</${elementType}>`;
}

function beautify(rawHtml: string): string {
  return html_beautify(rawHtml, { indent_size: 2, indent_with_tabs: false });
}

interface GetPropsParams extends SkeletonOption {
  isSquareLike: boolean;
}
function getPropsByElementType(
  elementType: ElementType,
  options: GetPropsParams | undefined = { isSquareLike: false }
) {
  const { animation = 'wave', squareAs = 'text', isSquareLike } = options;

  if (!isComponent(elementType)) {
    return '';
  }

  const variant = isSquareLike && squareAs === 'circle' ? 'circle' : 'text';

  if (elementType === 'Skeleton') {
    return `animation="${animation}" variant="${variant}"`;
  }
}
function isComponent(elementType: string) {
  return /[A-Z]/.test(elementType);
}

export const transformer = {
  positionTree,
  skeletonJSXString,
  beautify,
};
