import { ComponentProps } from '@stitches/react';
import { PropsWithChildren } from 'react';
import {
  PropertyValue,
  pulseKeyframe,
  styled,
  theme,
  waveKeyframe,
} from '../stitches.config';

export interface Props extends ComponentProps<typeof SkeletonRoot> {
  animation?: 'pulse' | 'wave' | 'unset';
  variant?: 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  startColor?: PropertyValue<'backgroundColor'>;
  endColor?: PropertyValue<'backgroundColor'>;
}

export default function Skeleton({
  children,
  animation = 'unset',
  variant = 'text',
  height,
  width,
  style,
  startColor = '$primary',
  endColor = '$weak',
  ...props
}: PropsWithChildren<Props>) {
  const hasChildren = Boolean(children);
  const animationProps =
    animation === 'wave'
      ? {
          '&:after': {
            background: `linear-gradient(90deg, transparent, ${endColor}, transparent)`,
          },
        }
      : undefined;

  return (
    <SkeletonRoot
      animation={animation}
      variant={variant}
      hasChildren={hasChildren}
      css={{
        backgroundColor: startColor,
        ...animationProps,
      }}
      style={{ height, width, ...style }}
      {...props}
    />
  );
}

const SkeletonRoot = styled('span', {
  display: 'block',

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
