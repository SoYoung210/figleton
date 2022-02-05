import React, { useState } from 'react';
import { getHighlighter, setCDN } from 'shiki';
import useAsyncHandler from '../hooks/async';
import useEventListener from '../hooks/event';

export default function CodePreviewSection() {
  setCDN('https://unpkg.com/shiki/');

  const [codeResult, setCodeResult] = useState('');

  const [handleData, { isPending }] = useAsyncHandler(
    async (payload: string) => {
      console.log('code?', payload);
      const highlighter = await getHighlighter({ theme: 'dark-plus' });
      console.log('highlighter', highlighter);
      setCodeResult(
        highlighter.codeToHtml(payload, {
          lang: 'jsx',
        })
      );
    }
  );

  useEventListener<string>({ type: 'preview-code' }, e => {
    console.log('code preveiw', e.data.pluginMessage.payload);
    handleData(e.data.pluginMessage.payload);
  });

  return (
    <pre
      dangerouslySetInnerHTML={{ __html: isPending ? 'pending' : codeResult }}
    />
  );
}
