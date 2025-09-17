import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Theme, ThemeName, themes } from '../styles/shared';

// Define the shape of the context value
interface ThemeContextType {
  theme: Theme;
  changeTheme: (name: ThemeName) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: themes.default,
  changeTheme: () => {},
});

// Create the Provider component that will manage and supply the theme
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>('default');

  const changeTheme = (name: ThemeName) => {
    setThemeName(name);
  };

  // Get the current theme object, falling back to default if the name is invalid
  const theme = themes[themeName] || themes.default;

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook for easy access to the theme in any component
export const useTheme = () => useContext(ThemeContext);