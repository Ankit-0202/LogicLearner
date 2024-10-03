// contexts/ThemeContext.js

import React, { createContext, useState, useMemo } from 'react';
import { DefaultTheme as PaperDefaultTheme, MD3DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

// Create a Theme Context
export const ThemeContext = createContext();

// Combine React Native Paper and React Navigation themes for light mode
const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f2f2f2',
    surface: '#ffffff',
    text: '#000000',
    error: '#B00020',
  },
};

// Combine React Native Paper and React Navigation themes for dark mode
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
    primary: '#bb86fc',
    accent: '#03dac6',
    background: '#121212',
    surface: '#1f1f1f',
    text: '#ffffff',
    error: '#cf6679',
  },
};

// ThemeProvider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Toggle Theme Function
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Memoize the theme to optimize performance
  const theme = useMemo(() => (isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme), [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
