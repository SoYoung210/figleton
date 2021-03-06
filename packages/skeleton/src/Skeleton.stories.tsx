import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Skeleton from './Skeleton';

export default {
  title: 'Example/Skeleton',
  component: Skeleton,
  argTypes: {
    width: { control: 'number' },
    height: { control: 'number' },
  },
} as ComponentMeta<typeof Skeleton>;

const Template: ComponentStory<typeof Skeleton> = args => {
  return (
    <div style={{ fontSize: '16px', lineHeight: 1.5 }}>
      <h2>Control Example</h2>
      <Skeleton {...args} />
      <h2>Variants</h2>
      <h3>Text</h3>
      <Skeleton variant="text" />
      <h3>Circle</h3>
      <Skeleton variant="circle" height={40} width={40} />
      <h3>Animation</h3>
      <div style={{ display: 'flex', columnGap: 10 }}>
        pulse: <Skeleton variant="text" animation="pulse" width="200px" />
        wave: <Skeleton variant="text" animation="wave" width="200px" />
      </div>
      <h3>Custom Animation Color</h3>
      <Skeleton
        variant="text"
        startColor="#D53F8C"
        endColor="#DD6B20"
        animation="wave"
      />
    </div>
  );
};
export const Basic = Template.bind({});
Basic.args = {
  variant: 'text',
};
