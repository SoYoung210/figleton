import { map, min } from '@fxts/core';
import { NodeElement, RenderBounds } from './model/node';

const rootNodeId = 'ROOT_NODE_ID';
const rootNodeName = 'ROOT_NODE_NAME';
// TODO: change it to user option
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
  console.log('selectionNodes', selectionNodes);

  if (selectionNodes.length === 1) {
    const rootNode = selectionNodes[0];
    const renderBounds = getRenderBounds(rootNode);

    const baseNode = {
      name: rootNodeName,
      id: rootNodeId,
      renderBounds,
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

  const positions = selectionNodes.map(node => ({
    absoluteRenderBounds: (node as any).absoluteRenderBounds as RenderBounds,
  }));

  const baseX = min(
    map(({ absoluteRenderBounds }) => absoluteRenderBounds.x, positions)
  );
  const baseY = min(
    map(({ absoluteRenderBounds }) => absoluteRenderBounds.y, positions)
  );

  return {
    name: rootNodeName,
    id: rootNodeId,
    type: 'FRAME',
    renderBounds: {
      width: '100%',
      height: '100%',
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
    renderBounds: getRenderBounds(node),
  };
}

function getRenderBounds(node: SceneNode): RenderBounds {
  return 'absoluteRenderBounds' in node && node.absoluteRenderBounds != null
    ? node.absoluteRenderBounds
    : {
        x: node.x,
        y: node.y,
        height: node.height,
        width: node.width,
      };
}

export const nodeParser = {
  init: initWithRootNode,
};

export const nodeConstants = {
  rootNodeId,
  rootNodeName,
  unsupportedTypes: UNSUPPORTED_NODE_TYPES,
};
