import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    fontWeights: {},
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {
      sm: 4,
      half: '50%',
    },
    shadows: {},
    zIndices: {},
    transitions: {},
    colors: {
      primary: '#e3e3e3',
      emphasis: '#dedede',
    },
  },
  utils: {},
});

export const pulseKeyframe = keyframes({
  '0%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.4,
  },
  '100%': {
    opacity: 1,
  },
});

export const waveKeyframe = keyframes({
  '0%': {
    transform: 'translateX(-100%)',
  },
  '50%': {
    transform: 'translateX(100%)',
  },
  '100%': {
    transform: 'translateX(100%)',
  },
});

export type StitchesCSS = Stitches.CSS<typeof config>;
export type PropertyValue<Property extends keyof Stitches.CSSProperties> =
  Stitches.PropertyValue<Property, typeof config>;
