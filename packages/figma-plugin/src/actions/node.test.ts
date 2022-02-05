import { expect, test, describe } from 'vitest';
import arrayOf from '../utils/array';
import { nodeConstants, nodeParser } from './node';

const rawBaseMockNodes = {
  name: 'testNodeName',
  id: '01:123',
  x: 0,
  y: 0,
  width: 10,
  height: 10,
  // just sample type
  type: 'FRAME',
};
function generateMockLabel(base: string, suffix: number | string) {
  return `${base}-${suffix.toString()}`;
}

describe('[NodeParser] init - when selection node length === 1', () => {
  test('has rootNode with 1depth children', () => {
    const baseMockNodes = rawBaseMockNodes;
    const mockNodes = [
      {
        ...baseMockNodes,
        children: arrayOf(3).map(v => ({
          ...baseMockNodes,
          name: generateMockLabel(baseMockNodes.name, v),
          id: generateMockLabel(baseMockNodes.id, v),
        })),
      },
    ];
    const result = nodeParser.init(mockNodes as any);

    expect(result.name).toBe(nodeConstants.rootNodeName);
    expect(result.id).toBe(nodeConstants.rootNodeId);
    expect(result).toHaveProperty('renderBounds', {
      x: baseMockNodes.x,
      y: baseMockNodes.y,
      width: baseMockNodes.width,
      height: baseMockNodes.height,
    });

    result.children?.forEach((child, index) => {
      expect(child.children).toBe(undefined);
      expect(child.id).toBe(generateMockLabel(baseMockNodes.id, index));
    });
  });

  test('has rootNode with 2depth children', () => {
    const childNode = { ...rawBaseMockNodes, name: 'childrenNode' };
    const baseMockNodes = {
      ...rawBaseMockNodes,
      children: [childNode],
    };

    const mockNodes = [
      {
        ...baseMockNodes,
        children: arrayOf(3).map(v => ({
          ...baseMockNodes,
          name: generateMockLabel(baseMockNodes.name, v),
          id: generateMockLabel(baseMockNodes.id, v),
          children: baseMockNodes.children.map((c, i) => ({
            ...c,
            name: generateMockLabel(c.name, i),
            id: generateMockLabel(c.id, i),
          })),
        })),
      },
    ];
    const result = nodeParser.init(mockNodes as any);

    result.children?.forEach(child => {
      expect(Array.isArray(child.children)).toBe(true);

      child.children?.forEach((innerChild, index) => {
        expect(innerChild.children).toBe(undefined);

        expect(innerChild).toHaveProperty(
          'name',
          generateMockLabel(childNode.name, index)
        );
        expect(innerChild).toHaveProperty(
          'id',
          generateMockLabel(childNode.id, index)
        );
        expect(innerChild).toHaveProperty('renderBounds', {
          x: childNode.x,
          y: childNode.y,
          width: childNode.width,
          height: childNode.height,
        });
      });
    });
  });
});

describe('[NodeParser] init - when selection node length > 1', () => {
  test('make rootNode with 1depth children', () => {
    const nodeCount = 3;
    const mockNodes = arrayOf(nodeCount).map(v => ({
      ...rawBaseMockNodes,
      name: generateMockLabel(rawBaseMockNodes.name, v),
      id: generateMockLabel(rawBaseMockNodes.id, v),
    }));

    const result = nodeParser.init(mockNodes as any);

    expect(result.name).toBe(nodeConstants.rootNodeName);
    expect(result.id).toBe(nodeConstants.rootNodeId);
    expect(result.renderBounds).toEqual({
      x: rawBaseMockNodes.x,
      y: rawBaseMockNodes.y,
      width: rawBaseMockNodes.width,
      height: rawBaseMockNodes.height * nodeCount,
    });

    result.children?.forEach((child, index) => {
      expect(child.children).toBe(undefined);
      expect(child.id).toBe(generateMockLabel(rawBaseMockNodes.id, index));
    });
  });
});
