import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';

export const PaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    tertiary: '#ec4899',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f9fafb',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onTertiary: '#ffffff',
    onError: '#ffffff',
    onBackground: '#1f2937',
    onSurface: '#1f2937',
  },
};

export const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60a5fa',
    secondary: '#a78bfa',
    tertiary: '#f472b6',
    error: '#f87171',
    background: '#111827',
    surface: '#1f2937',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onTertiary: '#ffffff',
    onError: '#ffffff',
    onBackground: '#f9fafb',
    onSurface: '#f9fafb',
  },
};

// Keep for backward compatibility
export const PaperTheme = PaperLightTheme;
