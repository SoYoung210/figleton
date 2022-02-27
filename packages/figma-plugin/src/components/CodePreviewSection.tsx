import React, { useState, useCallback, useMemo } from 'react';
import { Button, ButtonProps, Tabs } from '@mantine/core';
import { Prism } from '@mantine/prism';
import useEventListener from '../hooks/event';
import { useClipboard } from '../hooks/clipboard';
import ResultPreviewSection from './ResultPreviewSection';
import { transformer } from '../actions/transformer';

interface CodePreviewData {
  uiCode: string;
  baseCode: string;
}
export default function CodePreviewSection() {
  const [activeTab, setActiveTab] = useState<'base' | 'ui'>('base');
  const [codeContent, setCodeContent] = useState<CodePreviewData>();

  const previewUiCodeContent = useMemo(() => {
    if (codeContent == null) {
      return '';
    }

    return transformer.beautify(`
    export function MySkeleton() {
      return (
        <div style={{ position: 'relative' }}>
          ${codeContent.uiCode}
        </div>
      )
    }
    `);
  }, [codeContent]);

  useEventListener<CodePreviewData>({ type: 'preview-code' }, e => {
    setCodeContent(e.data.pluginMessage.payload);
  });
  const clipboard = useClipboard();

  const handleCopyClick = useCallback(() => {
    if (codeContent == null) {
      return;
    }

    clipboard.copyText(
      activeTab === 'base' ? codeContent.baseCode : previewUiCodeContent
    );
  }, [activeTab, clipboard, codeContent, previewUiCodeContent]);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {codeContent != null ? (
        <Tabs>
          <Tabs.Tab label="code">
            <Prism.Tabs>
              <Prism.Tab
                label="StyledSkeleton.tsx"
                language="tsx"
                noCopy
                active={activeTab === 'base'}
                onClick={() => setActiveTab('base')}
              >
                {codeContent.baseCode}
              </Prism.Tab>
              <Prism.Tab
                label="MySkeleton.tsx"
                language="tsx"
                noCopy
                active={activeTab === 'ui'}
                onClick={() => setActiveTab('ui')}
              >
                {previewUiCodeContent}
              </Prism.Tab>
            </Prism.Tabs>
            <CopyButton
              onClick={handleCopyClick}
              hasCopied={clipboard.hasCopied}
            />
          </Tabs.Tab>
          <Tabs.Tab label="preview">
            <ResultPreviewSection uiCode={codeContent.uiCode} />
          </Tabs.Tab>
        </Tabs>
      ) : null}
    </div>
  );
}

function CopyButton({
  hasCopied,
  ...props
}: ButtonProps<'button'> & { hasCopied: boolean }) {
  return (
    <Button
      variant="light"
      compact
      size="xs"
      sx={{ position: 'absolute', right: 10, top: 100 }}
      color={hasCopied ? 'teal' : 'blue'}
      {...props}
    >
      {hasCopied ? 'Copied' : 'Copy'}
    </Button>
  );
}
