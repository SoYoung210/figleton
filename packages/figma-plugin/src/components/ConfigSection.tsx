// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Button,
  Group,
  Radio,
  RadioGroup,
  SimpleGrid,
  LoadingOverlay,
  ColorInput,
} from '@mantine/core';
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
    startColor: 'rgba(227, 227, 227, 1)',
    endColor: 'rgba(222, 222, 222, 1)',
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
    return <LoadingOverlay visible={true} />;
  }

  return (
    <form onSubmit={onCreate} style={{ width: '100%' }}>
      <Group direction="column" spacing={24} align="start">
        <fieldset>
          <RadioGroup
            label="Animation"
            defaultValue={defaultValues.animation}
            name="animation"
          >
            <Radio value="wave">wave</Radio>
            <Radio value="pulse">pulse</Radio>
            <Radio value="unset">unset</Radio>
          </RadioGroup>
        </fieldset>
        <fieldset>
          <RadioGroup
            name="squareAs"
            label="Square as"
            defaultValue={defaultValues.squareAs}
          >
            <Radio value="text">square</Radio>
            <Radio value="circle">circle</Radio>
          </RadioGroup>
        </fieldset>
        <fieldset>
          <legend style={{ fontSize: '14px' }}>Skeleton Animation Color</legend>
          <SimpleGrid cols={2} spacing={4}>
            <ColorInput
              label="StartColor"
              name="startColor"
              format="rgba"
              placeholder="Pick base Skeleton Color"
              defaultValue={defaultValues.startColor}
            />
            <ColorInput
              label="EndColor"
              name="endColor"
              format="rgba"
              placeholder="Pick highlight Skeleton Color"
              defaultValue={defaultValues.endColor}
            />
          </SimpleGrid>
        </fieldset>
        <Group spacing={4}>
          <Button type="submit">Create</Button>
          <Button
            type="button"
            variant="outline"
            component="a"
            href="https://codesandbox.io/s/figleton-skeleton-playground-ugbht"
            target="_blank"
            leftIcon={<CodeSandboxLogoIcon />}
          >
            CodeSandbox
          </Button>
        </Group>
      </Group>
    </form>
  );
}
