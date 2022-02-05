import walk from './actions/walk';
import { CodedError, PluginMessage } from './model';

figma.showUI(__html__, { width: 450, height: 550 });

figma.ui.onmessage = (msg: PluginMessage) => {
  try {
    if (msg.type === 'create-skeleton') {
      const result = walk(figma.currentPage.selection, msg.option);

      figma.ui.postMessage(
        {
          type: 'preview-code',
          payload: result,
        },
        { origin: '*' }
      );
    }
  } catch (e) {
    if (e instanceof CodedError) {
      return figma.notify(e.message);
    }

    console.log('e', e);
    figma.closePlugin('Unexpected Error');
  }
};
