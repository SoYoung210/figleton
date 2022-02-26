import { js_beautify } from 'js-beautify';
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

  const { x, y, width, height } = targetNode.renderBounds;
  const top = isRootNode ? 0 : y - rootNode.renderBounds.y;
  const left = isRootNode ? 0 : x - rootNode.renderBounds.x;

  return {
    name: targetNode.name,
    top,
    left,
    width,
    height,
    children: nextValidChildren?.map(nextNode =>
      toMetaTree(nextNode, rootNode)
    ),
  };
}

const DATA_ATTR_NAME = 'data-skeleton-name';
const STYLED_SKELETON_COMP_NAME = 'StyledSkeleton';

function skeletonJSXString(
  targetNode: NodeMetaData,
  options: SkeletonOption | undefined = {}
): string {
  const {
    top,
    left,
    width: rawWidth,
    height: rawHeight,
    children,
    name,
  } = targetNode;
  const shouldDrawSkeleton = children == null || children.length === 0;

  if (!shouldDrawSkeleton) {
    return (children ?? [])
      ?.map(childNode => skeletonJSXString(childNode, options))
      .join('');
  }

  const isNumericWidth = typeof rawWidth === 'number';
  const isNumericHeight = typeof rawHeight === 'number';
  const isNumericSize = isNumericWidth && isNumericHeight;
  const isSquareLike =
    isNumericSize && Math.abs(1 - rawWidth / rawHeight) < 0.1;

  const width = isNumericWidth ? rawWidth : `'${rawWidth}'`;
  const height = isNumericHeight ? rawHeight : `'${rawHeight}'`;
  const variant =
    isSquareLike && options.squareAs === 'circle' ? 'circle' : 'text';

  const positionStyleString = `top: ${top}, left: ${left}`;
  const sizeStyleString = `width: ${
    isNumericWidth ? width : `'${width}'`
  }, height: ${isNumericHeight ? height : `'${height}'`}`;

  const variantPropsString = variant !== 'text' ? `variant="${variant}"` : '';

  return `<StyledSkeleton ${DATA_ATTR_NAME}="${name}" style={{ ${positionStyleString}, ${sizeStyleString} }}${variantPropsString} />`;
}

function beautify(rawHtml: string): string {
  return js_beautify(rawHtml, {
    indent_size: 2,
    indent_with_tabs: false,
    max_preserve_newlines: 1,
    wrap_line_length: 110,
    brace_style: 'preserve-inline',
    e4x: true,
  });
}

function defaultPropsString(options: SkeletonOption | undefined = {}) {
  const { animation = 'wave', startColor, endColor } = options;

  return `animation="${animation}", startColor="${startColor}", endColor="${endColor}"`;
}

function styledSkeletonComponentString(propsString: string) {
  return `
    import { Skeleton, SkeletonProps } from "@figeleton/skeleton";

    function ${STYLED_SKELETON_COMP_NAME}({
      ${propsString},
      style,
      ...props,
    }: SkeletonProps) {
      return (
        <Skeleton
          animation={animation}
          startColor={startColor}
          endColor={endColor}
          style={{
            position: 'absolute',
            ...style,
          }}
          {...props}
        />
      )
    }
  `;
}

function combineComponentString(options: SkeletonOption | undefined) {
  const propsString = defaultPropsString(options);
  const baseComponentString = styledSkeletonComponentString(propsString);

  return function (parsedSkeletonComponentString: string) {
    return `
      ${baseComponentString}

      export function MySkeleton() {
        return (
          <div style={{ position: 'relative' }}>
            ${parsedSkeletonComponentString}
          </div>
        )
      }
    `;
  };
}

export const transformer = {
  toMetaTree,
  skeletonJSXString,
  combineComponentString,
  beautify,
};
