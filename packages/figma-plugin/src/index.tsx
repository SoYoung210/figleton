// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  VStack,
  ChakraProvider,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';

function App() {
  const onCreate = useCallback(() => {
    parent.postMessage({ pluginMessage: { type: 'create-skeleton' } }, '*');
  }, []);

  return (
    <VStack justifyContent="space-between">
      <FormControl as="fieldset">
        <FormLabel as="legend">
          <RadioGroup
            defaultValue="wave"
            onChange={value => console.log('value', value)}
          >
            <HStack spacing={4}>
              <Radio value="wave">wave</Radio>
              <Radio value="pulse">pulse</Radio>
            </HStack>
          </RadioGroup>
        </FormLabel>
      </FormControl>
      <Button onClick={onCreate}>Create</Button>
    </VStack>
  );
}

ReactDOM.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById('figma-react-template')
);
