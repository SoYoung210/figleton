import { map, max, min, sum } from '@fxts/core';
import { NodeElement } from '../model';

const rootNodeId = 'ROOT_NODE_ID';
const rootNodeName = 'ROOT_NODE_NAME';
const UNSUPPORTED_NODE_TYPES: NodeType[] = [
  'BOOLEAN_OPERATION',
  'CODE_BLOCK',
  'LINE',
  'POLYGON',
  'VECTOR',
];

/**
 * if selectionNode.length > 1 -> wrap root Element -> to NodeElement
 * else -> to NodeElement
 */
function initWithRootNode(
  selectionNodes: ReadonlyArray<SceneNode>
): NodeElement {
  if (selectionNodes.length === 1) {
    const rootNode = selectionNodes[0];
    const { x, y, width, height } = rootNode;

    const baseNode = {
      name: rootNodeName,
      id: rootNodeId,
      renderBounds: {
        x,
        y,
        width,
        height,
      },
    };

    /**
     * consider root node as 'FRAME'
     */
    return {
      ...baseNode,
      type: 'FRAME',
      children:
        'children' in rootNode
          ? rootNode.children.map(toNodeElement)
          : undefined,
    };
  }

  const positions = selectionNodes.map(node => ({ x: node.x, y: node.y }));
  const baseX = min(map(({ x }) => x, positions));
  const baseY = min(map(({ y }) => y, positions));

  const sizes = selectionNodes.map(node => ({
    width: node.width,
    height: node.height,
  }));
  const containerWidth = max(map(({ width }) => width, sizes));
  const containerHeight = sum(map(({ height }) => height, sizes));

  return {
    name: rootNodeName,
    id: rootNodeId,
    type: 'FRAME',
    renderBounds: {
      width: containerWidth,
      height: containerHeight,
      x: baseX,
      y: baseY,
    },
    children: selectionNodes.map(toNodeElement),
  };
}

function toNodeElement(node: SceneNode): NodeElement {
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    children: 'children' in node ? node.children.map(toNodeElement) : undefined,
    renderBounds: {
      x: node.x,
      y: node.y,
      height: node.height,
      width: node.width,
    },
  };
}

export const NodeParser = {
  init: initWithRootNode,
};

export const NodeConstants = {
  rootNodeId,
  rootNodeName,
  unsupportedTypes: UNSUPPORTED_NODE_TYPES,
};
