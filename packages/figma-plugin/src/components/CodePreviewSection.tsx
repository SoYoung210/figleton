import React, { useState, useCallback, useMemo } from 'react';
import { Button, ButtonProps, Tabs } from '@mantine/core';
import { Prism } from '@mantine/prism';
import useEventListener from '../hooks/event';
import { useClipboard } from '../hooks/clipboard';
import ResultPreviewSection from './ResultPreviewSection';
import { transformer } from '../actions/transformer';
import { SkeletonOption } from '../model';

interface CodePreviewData {
  uiCode: string;
  baseCode: string;
}

type TabCategory = 'base' | 'ui';
export default function CodePreviewSection() {
  const [activeTab, setActiveTab] = useState<TabCategory>('base');
  const [codeContent, setCodeContent] = useState<CodePreviewData>();
  const [skeletonOptions, setSkeletonOptions] = useState<
    SkeletonOption | undefined
  >();

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

  useEventListener<{
    result: CodePreviewData;
    options: SkeletonOption | undefined;
  }>(
    { type: 'preview-code' },
    ({
      data: {
        pluginMessage: { payload },
      },
    }) => {
      setCodeContent(payload.result);
      setSkeletonOptions(payload.options);
    }
  );
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
            <Prism.Tabs
              onTabChange={tabIndex => {
                setActiveTab(tabIndex === 0 ? 'base' : 'ui');
              }}
            >
              <Prism.Tab label="StyledSkeleton.tsx" language="tsx" noCopy>
                {codeContent.baseCode}
              </Prism.Tab>
              <Prism.Tab label="MySkeleton.tsx" language="tsx" noCopy>
                {previewUiCodeContent}
              </Prism.Tab>
            </Prism.Tabs>
            <CopyButton
              onClick={handleCopyClick}
              hasCopied={clipboard.hasCopied}
            />
          </Tabs.Tab>
          <Tabs.Tab label="preview">
            <ResultPreviewSection
              uiCode={codeContent.uiCode}
              options={skeletonOptions}
            />
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
