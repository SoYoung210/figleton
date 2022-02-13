// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  Radio,
  RadioGroup,
  SimpleGrid,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import React, { FormEvent, useCallback, useState } from 'react';
import { PluginMessage, SkeletonOption } from '../model';
import { CodeSandboxLogoIcon } from '@radix-ui/react-icons';
import useEventListener from '../hooks/event';

interface FormValue {
  animation: {
    value: NonNullable<SkeletonOption['animation']>;
  };
  squareAs: {
    value: NonNullable<SkeletonOption['squareAs']>;
  };
  startColor: {
    value: string;
  };
  endColor: {
    value: string;
  };
}

interface OptionValue {
  animation: NonNullable<SkeletonOption['animation']>;
  squareAs: NonNullable<SkeletonOption['squareAs']>;
  startColor: string;
  endColor: string;
}

export default function ConfigSection() {
  const [loadingState, setLoadingState] = useState<'loading' | 'idle'>(
    'loading'
  );
  const [defaultValues, setDefaultValues] = useState<OptionValue>({
    animation: 'wave',
    squareAs: 'text',
    startColor: '#e3e3e3',
    endColor: '#dedede',
  });
  const onCreate = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formTarget = e.target as unknown as FormValue;

    const pluginMessage: PluginMessage = {
      type: 'create-skeleton',
      option: {
        animation: formTarget.animation.value,
        squareAs: formTarget.squareAs.value,
        startColor: formTarget.startColor.value,
        endColor: formTarget.endColor.value,
      },
    };

    parent.postMessage({ pluginMessage }, '*');
  }, []);

  useEventListener<OptionValue | undefined>(
    { type: 'sync-storage-config-value' },
    e => {
      if (e.data.pluginMessage.payload != null) {
        setDefaultValues(e.data.pluginMessage.payload);
      }
      setLoadingState('idle');
    }
  );

  if (loadingState == 'loading') {
    return <Spinner />;
  }

  return (
    <form onSubmit={onCreate} style={{ width: '100%' }}>
      <VStack spacing="24px" align="start">
        <FormControl as="fieldset">
          <FormLabel as="legend">Animation</FormLabel>
          <RadioGroup defaultValue={defaultValues.animation} name="animation">
            <HStack spacing={4}>
              <Radio value="wave">wave</Radio>
              <Radio value="pulse">pulse</Radio>
              <Radio value="unset">unset</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl as="fieldset">
          <FormLabel as="legend">Square as</FormLabel>
          <RadioGroup name="squareAs" defaultValue={defaultValues.squareAs}>
            <HStack spacing={4}>
              <Radio value="text">square</Radio>
              <Radio value="circle">circle</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
        <FormControl as="fieldset">
          <FormLabel as="label">Skeleton Animation Color</FormLabel>
          <SimpleGrid columns={2} spacing={4}>
            <VStack spacing="4px" align="start">
              <FormLabel>
                <Text fontSize="sm" color="gray.600">
                  StartColor
                </Text>
              </FormLabel>
              <Input
                name="startColor"
                placeholder="startColor"
                defaultValue={defaultValues.startColor}
                type="color"
              />
            </VStack>
            <VStack spacing="4px" align="start">
              <FormLabel>
                <Text fontSize="sm" color="gray.600">
                  EndColor
                </Text>
              </FormLabel>
              <Input
                name="endColor"
                placeholder="endColor"
                defaultValue={defaultValues.endColor}
                type="color"
              />
            </VStack>
          </SimpleGrid>
        </FormControl>
        <HStack spacing={4}>
          <Button type="submit">Create</Button>
          <Button
            type="button"
            variant="outline"
            as="a"
            href="https://codesandbox.io/s/figleton-skeleton-playground-ugbht"
            target="_blank"
            leftIcon={<CodeSandboxLogoIcon />}
          >
            CodeSandbox
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}
