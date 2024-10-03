// theme.js

import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee', // Deep Purple
    accent: '#03ffc9',  // Teal
    background: '#f6f6f6',
    surface: '#ffffff',
    text: '#000000',
    error: '#B00020',
    notification: '#f50057',
  },
  roundness: 8,
  fonts: {
    regular: {
      fontFamily: 'Roboto',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: 'medium',
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: 'light',
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: 'thin',
    },
  },
};

export default theme;
