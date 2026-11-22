import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E8FFFB',
      100: '#B8F0E8',
      200: '#7FDFD4',
      300: '#45CCBE',
      400: '#14B8A8',
      500: '#00A89E',
      600: '#008F87',
      700: '#0B3D3A',
      800: '#08302E',
      900: '#051F1E',
    },
  },
  fonts: {
    heading: `'Outfit', system-ui, sans-serif`,
    body: `'Source Sans 3', system-ui, sans-serif`,
  },
  styles: {
    global: {
      'html, body, #root': {
        minHeight: '100%',
        width: '100%',
      },
      body: {
        margin: 0,
        overflowX: 'hidden',
        WebkitTapHighlightColor: 'transparent',
      },
      'img, video': {
        maxWidth: '100%',
        height: 'auto',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'md',
        fontWeight: '600',
      },
      sizes: {
        lg: {
          minH: '48px',
        },
        md: {
          minH: '44px',
        },
      },
    },
    Container: {
      baseStyle: {
        px: { base: 4, md: 6 },
      },
    },
  },
});

export default theme;
