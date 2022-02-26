import { nodeParser } from './node';
import { transformer } from './transformer';

import { pipe } from '@fxts/core';
import { CodedError, ERRORS, SkeletonOption } from '../model';

export default function walk(
  selectionNodes: ReadonlyArray<SceneNode>,
  options: SkeletonOption | undefined
) {
  if (selectionNodes.length === 0) {
    throw new CodedError(
      ERRORS.NO_SELECTION,
      'Expected one or more selected frame'
    );
  }

  const combine = transformer.combineComponentString(options);

  return pipe(
    selectionNodes,
    nodeParser.init,
    nodeElement => transformer.toMetaTree(nodeElement, nodeElement),
    targetNode => transformer.skeletonJSXString(targetNode, options),
    parsedSkeletonComponentString => combine(parsedSkeletonComponentString),
    transformer.beautify
  );
}
