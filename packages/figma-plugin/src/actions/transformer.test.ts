import { expect, test, describe } from 'vitest';
import arrayOf from '../utils/array';
import { nodeParser } from './node';
import { transformer } from './transformer';

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

const MOCK_OFFSET = {
  X: 10,
  Y: 20,
  WIDTH: 30,
  HEIGHT: 40,
};
function generateMockBoundsValue(key: keyof typeof MOCK_OFFSET, index: number) {
  return (index + 1) * MOCK_OFFSET[key];
}

describe('[StringFormatter] positionTree', () => {
  test('when 1 depth children', () => {
    const baseMockNodes = rawBaseMockNodes;
    const mockNodes = [
      {
        ...baseMockNodes,
        children: arrayOf(1).map((_, index) => ({
          ...baseMockNodes,
          x: generateMockBoundsValue('X', index),
          y: generateMockBoundsValue('Y', index),
          width: generateMockBoundsValue('WIDTH', index),
          height: generateMockBoundsValue('HEIGHT', index),
          name: generateMockLabel(baseMockNodes.name, index),
          id: generateMockLabel(baseMockNodes.id, index),
        })),
      },
    ];
    const element = nodeParser.init(mockNodes as any);
    const result = transformer.positionTree(element, element);

    // rootNode property
    expect(result.position).toBe('relative');
    expect(result.top).toBe(0);
    expect(result.left).toBe(0);
    // children
    result.children?.forEach((child, index) => {
      expect(child.left).toBe(generateMockBoundsValue('X', index));
      expect(child.top).toBe(generateMockBoundsValue('Y', index));
      expect(child.width).toBe(generateMockBoundsValue('WIDTH', index));
      expect(child.height).toBe(generateMockBoundsValue('HEIGHT', index));
    });
  });
});
