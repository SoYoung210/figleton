import { NodeElement } from '../model';

const rootNodeId = 'ROOT_NODE_ID';
const rootNodeName = 'ROOT_NODE_NAME';
const defaultRenderBounds = {
  x: 0,
  y: 0,
  height: '100%',
  width: '100%',
};
/**
 * if selectionNode.length > 1 -> wrap root Element -> to NodeElement
 * else -> to NodeElement
 */
function initWithRootNode(
  selectionNodes: ReadonlyArray<SceneNode>
): NodeElement {
  if (selectionNodes.length === 1) {
    const rootNode = selectionNodes[0];
    const { name, id, x, y, width, height } = rootNode;
    const baseNode = {
      name,
      id,
      renderBounds: {
        x,
        y,
        width,
        height,
      },
    };

    return {
      ...baseNode,
      children:
        'children' in rootNode
          ? rootNode.children.map(toNodeElement)
          : undefined,
    };
  }

  return {
    name: rootNodeName,
    id: rootNodeId,
    renderBounds: defaultRenderBounds,
    children: selectionNodes.map(toNodeElement),
  };
}

function toNodeElement(node: SceneNode): NodeElement {
  return {
    id: node.id,
    name: node.name,
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
  defaultRenderBounds,
};
