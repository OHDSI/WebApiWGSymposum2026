import React from 'react';

// --- AtlasTheme Interface ---

export interface AtlasThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  error: string;
  success: string;
  warning: string;
}

export interface AtlasThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface AtlasThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    bold: number;
  };
}

export interface AtlasThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
}

export interface AtlasTheme {
  colors: AtlasThemeColors;
  spacing: AtlasThemeSpacing;
  typography: AtlasThemeTypography;
  borderRadius: AtlasThemeBorderRadius;
}


// --- Default Theme ---

export const defaultTheme: AtlasTheme = {
  colors: {
    primary: '#1976d2',
    secondary: '#9c27b0',
    background: '#ffffff',
    text: '#212121',
    error: '#d32f2f',
    success: '#2e7d32',
    warning: '#ed6c02',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
};

// --- Theme Context ---

const ThemeContext = React.createContext<AtlasTheme>(defaultTheme);

// --- ThemeProvider ---

export interface ThemeProviderProps {
  theme?: AtlasTheme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme = defaultTheme, children }: ThemeProviderProps): React.JSX.Element {
  return React.createElement(ThemeContext.Provider, { value: theme }, children);
}

// --- useTheme Hook ---

export function useTheme(): AtlasTheme {
  return React.useContext(ThemeContext);
}
