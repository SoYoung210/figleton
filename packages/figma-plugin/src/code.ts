import walk from './actions/walk';
import { CodedError, PluginMessage } from './model';

figma.showUI(__html__);

figma.ui.onmessage = (msg: PluginMessage) => {
  const numberOfRectangles = 5;

  try {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-skeleton') {
      const nodes: SceneNode[] = [];
      console.log('@@ selection', figma.currentPage.selection);
      console.log('result: ', walk(figma.currentPage.selection));
      for (let i = 0; i < numberOfRectangles; i++) {
        const rect = figma.createRectangle();
        // rect.x = i * 150;
        // rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
        // figma.currentPage.appendChild(rect);
        // nodes.push(rect);
      }

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
