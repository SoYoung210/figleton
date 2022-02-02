import { NodeParser } from './node';
import { transformer } from './transformer';

import { pipe } from '@fxts/core';
import { CodedError, ERRORS } from './model';

export default function walk(selectionNodes: ReadonlyArray<SceneNode>): string {
  if (selectionNodes.length === 0) {
    throw new CodedError(
      ERRORS.NO_SELECTION,
      'Expected one or more selected frame'
    );
  }

  return pipe(
    selectionNodes,
    NodeParser.init,
    nodeElement => transformer.skeletonJSXString(nodeElement, nodeElement),
    transformer.beautify
  );
}
