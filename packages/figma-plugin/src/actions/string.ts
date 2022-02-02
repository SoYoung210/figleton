import prettier from 'prettier';
import path from 'path';
import { NodeElement } from '../model';

function toHtmlString(node: NodeElement): string {
  return `<Skeleton>${(node.children ?? [])
    .map(toHtmlString)
    .join()}</Skeleton>`;
}

function beautify(rawHtml: string): string {
  const prettierOptions = prettier.resolveConfig.sync(
    path.resolve(__dirname, '.prettierrc')
  );
  return prettier.format(rawHtml, { ...prettierOptions, parser: 'html' });
}

export const StringFormatter = {
  toHtmlString,
  beautify,
};
