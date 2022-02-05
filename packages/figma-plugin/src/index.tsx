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
  Box,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { MessageOption, PluginMessage } from './model';

function App() {
  const [animation, setAnimation] =
    useState<NonNullable<MessageOption['animation']>>('wave');
  const [squareAs, setSquareAs] = useState('square');

  const onCreate = useCallback(() => {
    const pluginMessage: PluginMessage = {
      type: 'create-skeleton',
      option: {
        animation,
      },
    };

    parent.postMessage({ pluginMessage: { type: 'create-skeleton' } }, '*');
  }, [animation]);

  return (
    <Box p={4}>
      <VStack spacing="24px" align="start">
        <FormControl as="fieldset">
          <FormLabel as="legend">Animation</FormLabel>
          <RadioGroup
            value={animation}
            onChange={animationValue =>
              setAnimation(
                animationValue as NonNullable<MessageOption['animation']>
              )
            }
          >
            <HStack spacing={4}>
              <Radio value="wave">wave</Radio>
              <Radio value="pulse">pulse</Radio>
              <Radio value="unset">unset</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl as="fieldset">
          <FormLabel as="legend">Square as</FormLabel>
          <RadioGroup value={squareAs} onChange={setSquareAs}>
            <HStack spacing={4}>
              <Radio value="square">square</Radio>
              <Radio value="circle">circle</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
        <Button onClick={onCreate}>Create</Button>
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
