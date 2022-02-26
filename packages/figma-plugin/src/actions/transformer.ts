import { html_beautify } from 'js-beautify';
import { SkeletonOption } from '../model';
import { NodeElement, NodeMetaData } from './model/node';
import { nodeConstants } from './node';

/**
 * Comparison of parent parent's absoluteX and absoluteY values and children's x and y values
 */
function toMetaTree(
  targetNode: NodeElement,
  rootNode: NodeElement
): NodeMetaData {
  const isRootNode = targetNode.id === rootNode.id;
  const nextValidChildren = targetNode.children?.filter(
    ({ type }) => !nodeConstants.unsupportedTypes.includes(type)
  );

  const position = isRootNode ? 'relative' : 'absolute';
  const { x, y, width, height } = targetNode.renderBounds;
  const top = isRootNode ? 0 : y - rootNode.renderBounds.y;
  const left = isRootNode ? 0 : x - rootNode.renderBounds.x;

  return {
    name: targetNode.name,
    position,
    top,
    left,
    width,
    height,
    children: nextValidChildren?.map(nextNode =>
      toMetaTree(nextNode, targetNode)
    ),
  };
}

const DATA_ATTR_NAME = 'data-skeleton-name';
type ElementType = 'Skeleton' | 'div';
function skeletonJSXString(
  targetNode: NodeMetaData,
  options: SkeletonOption | undefined = {}
): string {
  const {
    position,
    top,
    left,
    width: rawWidth,
    height: rawHeight,
    children,
    name,
  } = targetNode;
  const shouldDrawSkeleton = children == null || children.length === 0;

  const isNumericWidth = typeof rawWidth === 'number';
  const isNumericHeight = typeof rawHeight === 'number';
  const isNumericSize = isNumericWidth && isNumericHeight;
  const isSquareLike =
    isNumericSize && Math.abs(1 - rawWidth / rawHeight) < 0.1;

  const width = isNumericWidth ? rawWidth : `'${rawWidth}'`;
  const height = isNumericHeight ? rawHeight : `'${rawHeight}'`;
  const positionStyleString = `position: '${position}', top: ${top}, left: ${left}`;
  const sizeStyleString = `width: ${
    isNumericWidth ? width : `'${width}'`
  }, height: ${isNumericHeight ? height : `'${height}'`}`;

  const elementType: ElementType = shouldDrawSkeleton ? 'Skeleton' : 'div';
  const customProps = getPropsByElementType(elementType, {
    ...options,
    isSquareLike,
  });
  const elementProps =
    elementType === 'Skeleton'
      ? `style={{ ${positionStyleString}, ${sizeStyleString} }} ${customProps}`
      : `style={{ ${positionStyleString} }} `;

  return `<${elementType} ${DATA_ATTR_NAME}="${name}" ${elementProps}>${(
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
  const {
    animation = 'wave',
    squareAs = 'text',
    isSquareLike,
    startColor,
    endColor,
  } = options;

  if (!isComponent(elementType)) {
    return '';
  }

  const variant = isSquareLike && squareAs === 'circle' ? 'circle' : 'text';

  if (elementType === 'Skeleton') {
    return `animation="${animation}" variant="${variant}" startColor="${startColor}" endColor="${endColor}"`;
  }
}
function isComponent(elementType: string) {
  return /[A-Z]/.test(elementType);
}

export const transformer = {
  toMetaTree,
  skeletonJSXString,
  beautify,
};
