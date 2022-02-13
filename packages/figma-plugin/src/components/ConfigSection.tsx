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
} from '@chakra-ui/react';
import React, { FormEvent, useCallback } from 'react';
import { PluginMessage, SkeletonOption } from '../model';

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
export default function ConfigSection() {
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

  return (
    <form onSubmit={onCreate} style={{ width: '100%' }}>
      <VStack spacing="24px" align="start">
        <FormControl as="fieldset">
          <FormLabel as="legend">Animation</FormLabel>
          <RadioGroup defaultValue="wave" name="animation">
            <HStack spacing={4}>
              <Radio value="wave">wave</Radio>
              <Radio value="pulse">pulse</Radio>
              <Radio value="unset">unset</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl as="fieldset">
          <FormLabel as="legend">Square as</FormLabel>
          <RadioGroup name="squareAs" defaultValue="text">
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
                defaultValue="#e3e3e3"
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
                defaultValue="#dedede"
                type="color"
              />
            </VStack>
          </SimpleGrid>
        </FormControl>
        <Button type="submit">Create</Button>
      </VStack>
    </form>
  );
}
