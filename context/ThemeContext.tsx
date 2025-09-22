import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { lightThemes, Theme, ThemeName, themes } from '../styles/shared';

// Define the shape of the context value
interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  changeTheme: (name: ThemeName) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: themes.default,
  themeName: 'default',
  changeTheme: () => {},
});

// Create the Provider component that will manage and supply the theme
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>('default');

  const changeTheme = useCallback((name: ThemeName) => {
    setThemeName(name);
  }, []);

  // **FIXED**: This function now correctly separates logic for light and heavy themes.
  const getTheme = (name: ThemeName): Theme => {
    if (name.startsWith('light-')) {
      const baseName = name.substring(6);
      // Look for the base name ONLY in the lightThemes object
      if (baseName in lightThemes) {
        return lightThemes[baseName];
      }
    } else {
      // Look for the name ONLY in the heavy themes object
      if (name in themes) {
        return themes[name as keyof typeof themes];
      }
    }
    // Fallback to the default theme if nothing is found
    return themes.default;
  };

  const theme = getTheme(themeName);

  const value = useMemo(() => ({
    theme,
    themeName,
    changeTheme
  }), [theme, themeName, changeTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy access to the theme
export const useTheme = () => {
  return useContext(ThemeContext);
};