import React, { useState } from 'react';
import { Button } from '@mantine/core';
import { Prism } from '@mantine/prism';
import useEventListener from '../hooks/event';
import { useClipboard } from '../hooks/clipboard';

export default function CodePreviewSection() {
  const [codeContent, setCodeContent] = useState('');

  useEventListener<string>({ type: 'preview-code' }, e => {
    setCodeContent(e.data.pluginMessage.payload);
  });
  const clipboard = useClipboard();

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {codeContent !== '' ? (
        <>
          <Prism noCopy language="tsx">
            {codeContent}
          </Prism>
          <Button
            variant="light"
            compact
            size="xs"
            onClick={() => {
              clipboard.copyText(codeContent);
            }}
            sx={{ position: 'absolute', right: 10, top: 10 }}
            color={clipboard.hasCopied ? 'teal' : 'blue'}
          >
            {clipboard.hasCopied ? 'Copied' : 'Copy'}
          </Button>
        </>
      ) : null}
    </div>
  );
}
