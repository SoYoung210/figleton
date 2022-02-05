import { ComponentProps } from '@stitches/react';
import { PropsWithChildren } from 'react';
import { pulseKeyframe, styled, theme, waveKeyframe } from '../stitches.config';

export interface Props extends ComponentProps<typeof SkeletonRoot> {
  animation?: 'pulse' | 'wave' | 'unset';
  variant?: 'circle' | 'text';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  children,
  animation = 'unset',
  variant = 'text',
  height,
  width,
  style,
  ...props
}: PropsWithChildren<Props>) {
  const hasChildren = Boolean(children);

  return (
    <SkeletonRoot
      animation={animation}
      variant={variant}
      hasChildren={hasChildren}
      style={{ height, width, ...style }}
      {...props}
    />
  );
}

const SkeletonRoot = styled('span', {
  display: 'block',
  backgroundColor: '$primary',

  variants: {
    animation: {
      pulse: {
        animation: `${pulseKeyframe} 1.5s ease-in-out 0.5s infinite`,
      },
      wave: {
        position: 'relative',
        overflow: 'hidden',

        '&:after': {
          animation: `${waveKeyframe} 1.6s linear 0.5s infinite`,
          background: 'linear-gradient(90deg, transparent, $weak, transparent)',
          content: '',
          position: 'absolute',
          transform: 'translateX(-100%)',
          inset: 0,
        },
      },
      unset: {},
    },
    variant: {
      text: {
        borderRadius: `${theme.radii.sm.value}px / ${Math.round(
          ((Number(theme.radii.sm.value) / 0.6) * 10) / 10
        )}px`,
        height: 'auto',
        '&:empty:before': {
          content: '"\\00a0"',
        },
      },
      circle: {
        borderRadius: '$half',
      },
    },
    hasChildren: {
      true: {
        '& > *': {
          visibility: 'hidden',
        },
        height: 'auto',
        maxWidth: 'fit-content',
      },
    },
  },
});
