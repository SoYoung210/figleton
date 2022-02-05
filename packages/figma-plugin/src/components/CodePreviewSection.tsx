import {
  Box,
  Button,
  useClipboard,
  Spinner,
  Stack,
  Skeleton,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { getHighlighter, setCDN } from 'shiki';
import styled from '@emotion/styled';
import useAsyncHandler from '../hooks/async';
import useEventListener from '../hooks/event';

export default function CodePreviewSection() {
  setCDN('https://unpkg.com/shiki/');

  const [highlightText, setHighlightText] = useState('');
  const originDataRef = useRef<string>('');
  const { onCopy, hasCopied } = useClipboard(originDataRef.current);

  const highlighter = getHighlighter({ theme: 'dark-plus' });

  const [handleData, { isPending }] = useAsyncHandler(
    async (payload: string) => {
      setHighlightText(
        (await highlighter).codeToHtml(payload, {
          lang: 'jsx',
        })
      );
    }
  );

  useEventListener<string>({ type: 'preview-code' }, e => {
    originDataRef.current = e.data.pluginMessage.payload;
    handleData(e.data.pluginMessage.payload);
  });

  return (
    <Box position="relative" w="100%">
      {highlightText !== '' ? (
        <Button
          size="xs"
          onClick={onCopy}
          position="absolute"
          top="10px"
          right="10px"
        >
          {hasCopied ? 'COPIED' : 'COPY'}
        </Button>
      ) : null}
      {isPending ? (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <Pre
          dangerouslySetInnerHTML={{
            __html: highlightText,
          }}
        />
      )}
    </Box>
  );
}

const Pre = styled.pre`
  pre.shiki {
    padding: 10px;
    overflow: auto;
  }
`;
