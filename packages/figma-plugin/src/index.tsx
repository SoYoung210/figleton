// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { Box } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom';

import CodePreviewSection from './components/CodePreviewSection';
import ConfigSection from './components/ConfigSection';

function App() {
  return (
    <Box sx={{ padding: '16px' }}>
      <ConfigSection />
      <CodePreviewSection />
    </Box>
  );
}

ReactDOM.render(<App />, document.getElementById('figma-react-template'));
