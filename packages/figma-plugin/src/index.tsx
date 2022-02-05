// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VStack, ChakraProvider, Box } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import CodePreviewSection from './components/CodePreviewSection';
import ConfigSection from './components/ConfigSection';

function App() {
  return (
    <Box p={4}>
      <VStack spacing="24px" align="start">
        <ConfigSection />
        <CodePreviewSection />
      </VStack>
    </Box>
  );
}

ReactDOM.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById('figma-react-template')
);
