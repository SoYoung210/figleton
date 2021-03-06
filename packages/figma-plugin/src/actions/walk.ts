import { nodeParser } from './node';
import { transformer } from './transformer';
import { html_beautify } from 'js-beautify';
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

  const rootNode = nodeParser.init(selectionNodes);
  const toMetaTree = transformer.toMetaTree(rootNode);

  return pipe(
    rootNode,
    toMetaTree,
    targetNode => transformer.skeletonJSXString(targetNode, options),
    parsedSkeletonComponentString => ({
      uiCode: html_beautify(parsedSkeletonComponentString, {
        indent_size: 2,
      }),
      baseCode: transformer.beautify(transformer.baseComponentString(options)),
    })
  );
}
