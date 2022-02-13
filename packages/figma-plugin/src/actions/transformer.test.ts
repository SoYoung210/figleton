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

describe('[StringFormatter] toMetaTree', () => {
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
    const result = transformer.toMetaTree(element, element);

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

  test('when 2 depth children', () => {
    const childNode = { ...rawBaseMockNodes, name: 'childrenNode' };

    const baseMockNodes = {
      ...rawBaseMockNodes,
      children: [childNode],
    };

    const mockNodes = [
      {
        ...baseMockNodes,
        children: arrayOf(3).map((_, index) => ({
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
    const result = transformer.toMetaTree(element, element);

    result.children?.forEach((child, index) => {
      expect(Array.isArray(child.children)).toBe(true);
      const parentLeft = generateMockBoundsValue('X', index);
      const parentTop = generateMockBoundsValue('Y', index);

      expect(child.left).toBe(parentLeft);
      expect(child.top).toBe(parentTop);
      expect(child.width).toBe(generateMockBoundsValue('WIDTH', index));
      expect(child.height).toBe(generateMockBoundsValue('HEIGHT', index));

      child.children?.forEach((innerChild, innerIndex) => {
        expect(innerChild.left).toBe(
          generateMockBoundsValue('X', innerIndex) - parentLeft
        );
        expect(innerChild.top).toBe(
          generateMockBoundsValue('Y', innerIndex) - parentTop
        );
        expect(innerChild.width).toBe(
          generateMockBoundsValue('WIDTH', innerIndex)
        );
        expect(innerChild.height).toBe(
          generateMockBoundsValue('HEIGHT', innerIndex)
        );
      });
    });
  });

  test('has unsupported node type', () => {
    const unsupportedMockWidth = 100;
    const supportedMockWidth = 50;

    const mockNodes = [
      {
        ...rawBaseMockNodes,
        children: [
          /* Unsupported Type */
          {
            ...rawBaseMockNodes,
            width: unsupportedMockWidth,
            type: 'BOOLEAN_OPERATION',
          },
          {
            ...rawBaseMockNodes,
            width: unsupportedMockWidth,
            type: 'BOOLEAN_OPERATION',
          },
          {
            ...rawBaseMockNodes,
            width: unsupportedMockWidth,
            type: 'BOOLEAN_OPERATION',
          },
          {
            ...rawBaseMockNodes,
            width: unsupportedMockWidth,
            type: 'BOOLEAN_OPERATION',
          },
          {
            ...rawBaseMockNodes,
            width: unsupportedMockWidth,
            type: 'BOOLEAN_OPERATION',
          },
          /* Supported Type */
          { ...rawBaseMockNodes, width: supportedMockWidth, type: 'COMPONENT' },
          { ...rawBaseMockNodes, width: supportedMockWidth, type: 'INSTANCE' },
          {
            ...rawBaseMockNodes,
            width: supportedMockWidth,
            type: 'SHAPE_WITH_TEXT',
          },
        ],
      },
    ];

    const element = nodeParser.init(mockNodes as any);
    const result = transformer.toMetaTree(element, element);

    expect(result.children?.length).toBe(3);

    expect(
      result.children
        ?.map(({ width }) => width)
        .every(mockWidth => mockWidth !== unsupportedMockWidth)
    ).toBe(true);
  });
});
