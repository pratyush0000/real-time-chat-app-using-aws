import { defaultDarkModeOverride } from '@aws-amplify/ui-react';

const brand = {
  10: { value: '#eef4ff' },
  20: { value: '#dce8fd' },
  40: { value: '#a9c4f7' },
  60: { value: '#5b8def' },
  80: { value: '#2f6fed' },
  90: { value: '#1e54c9' },
  100: { value: '#163f97' },
};

const brandDark = {
  10: { value: '#0b1220' },
  20: { value: '#12213d' },
  40: { value: '#1e3a6b' },
  60: { value: '#2f5fb0' },
  80: { value: '#5b8def' },
  90: { value: '#7ea6f2' },
  100: { value: '#a9c4f7' },
};

const theme = {
  name: 'openline-theme',
  tokens: {
    colors: {
      brand: { primary: brand },
      font: {
        interactive: { value: '{colors.brand.primary.80}' },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: '{colors.brand.primary.80}' },
          _hover: { backgroundColor: { value: '{colors.brand.primary.90}' } },
          _focus: { backgroundColor: { value: '{colors.brand.primary.90}' } },
        },
        link: {
          color: { value: '{colors.brand.primary.80}' },
        },
      },
      tabs: {
        item: {
          _active: {
            color: { value: '{colors.brand.primary.80}' },
            borderColor: { value: '{colors.brand.primary.80}' },
          },
        },
      },
      fieldcontrol: {
        _focus: {
          borderColor: { value: '{colors.brand.primary.80}' },
        },
      },
    },
  },
  overrides: [
    defaultDarkModeOverride,
    {
      colorMode: 'dark',
      tokens: {
        colors: {
          brand: { primary: brandDark },
          font: {
            primary: { value: '#eef2f8' },
            secondary: { value: '#93a1b8' },
            interactive: { value: '{colors.brand.primary.80}' },
          },
          background: {
            primary: { value: '#0a0e16' },
            secondary: { value: '#111827' },
            tertiary: { value: '#0a0e16' },
          },
          border: {
            primary: { value: '#232b3a' },
            secondary: { value: '#1a2130' },
          },
        },
      },
    },
  ],
};

export default theme;
