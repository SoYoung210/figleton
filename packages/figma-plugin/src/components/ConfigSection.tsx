// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { PluginMessage, SkeletonOption } from '../model';

export default function ConfigSection() {
  const [animation, setAnimation] =
    useState<NonNullable<SkeletonOption['animation']>>('wave');
  const [squareAs, setSquareAs] =
    useState<NonNullable<SkeletonOption['squareAs']>>('text');

  const onCreate = useCallback(() => {
    const pluginMessage: PluginMessage = {
      type: 'create-skeleton',
      option: {
        animation,
        squareAs,
      },
    };

    parent.postMessage({ pluginMessage }, '*');
  }, [animation, squareAs]);

  return (
    <>
      <FormControl as="fieldset">
        <FormLabel as="legend">Animation</FormLabel>
        <RadioGroup
          value={animation}
          onChange={animationValue =>
            setAnimation(
              animationValue as NonNullable<SkeletonOption['animation']>
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
        <RadioGroup
          value={squareAs}
          onChange={squareAsValue =>
            setSquareAs(
              squareAsValue as NonNullable<SkeletonOption['squareAs']>
            )
          }
        >
          <HStack spacing={4}>
            <Radio value="text">square</Radio>
            <Radio value="circle">circle</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
      <Button onClick={onCreate}>Create</Button>
    </>
  );
}
