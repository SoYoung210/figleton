import walk from './actions/walk';
import { CodedError, PluginMessage } from './model';

const STORAGE_KEY = '__FIGLETON_CONFIGURATION_KEY';

figma.clientStorage.getAsync(STORAGE_KEY).then(existConfig => {
  figma.showUI(__html__, { width: 600, height: 800 });
  figma.ui.postMessage({
    type: 'sync-storage-config-value',
    payload: existConfig != null ? JSON.parse(existConfig) : undefined,
  });
});

figma.ui.onmessage = (msg: PluginMessage) => {
  try {
    if (msg.type === 'create-skeleton') {
      figma.clientStorage.setAsync(STORAGE_KEY, JSON.stringify(msg.option));

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
