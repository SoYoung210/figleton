import walk from './actions/walk';
import { CodedError, PluginMessage } from './model';

figma.showUI(__html__, { height: 250 });

figma.ui.onmessage = (msg: PluginMessage) => {
  const numberOfRectangles = 5;

  try {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-skeleton') {
      // TODO: add msg.option
      const result = walk(figma.currentPage.selection);
      figma.ui.postMessage(
        {
          type: 'preview-code',
          payload: result,
        },
        { origin: '*' }
      );

      // figma.currentPage.selection = nodes;
      // figma.viewport.scrollAndZoomIntoView(nodes);
    }
  } catch (e) {
    if (e instanceof CodedError) {
      figma.closePlugin(e.message);
    }
  }
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
