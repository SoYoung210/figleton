import { useCallback, useEffect } from 'react';
import { MessageType, PluginEvent } from '../model';

interface Params {
  type: MessageType;
}
export default function useFigmaEventListener<T>(
  { type }: Params,
  cb: (event: PluginEvent<T>) => unknown
) {
  const handleEvent = useCallback(
    (event: PluginEvent<T>) => {
      if (event.data.pluginMessage.type === type) {
        cb(event);
      }
    },
    [cb, type]
  );
  // https://blog.rememberlenny.com/2020/09/02/react-figma-plugin-how-to-get-data-from-the-canvas-to-your-app/
  useEffect(() => {
    window.addEventListener('message', handleEvent);
    return () => {
      window.removeEventListener('message', handleEvent);
    };
  }, [handleEvent, type]);
}
