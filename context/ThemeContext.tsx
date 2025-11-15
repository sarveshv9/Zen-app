// context/ThemeContext.tsx
import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { lightThemes, Theme, ThemeName, themes } from '../constants/shared';

export interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.default,
  themeName: 'default',
  setThemeName: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>('default');

  const theme = useMemo<Theme>(() => {
    // if it's a light- variant, prefer the lightThemes entry
    if (typeof themeName === 'string' && themeName.startsWith('light-')) {
      const light = lightThemes[themeName];
      if (light) return light;
      // fallback: use heavy theme corresponding to suffix
      const suffix = themeName.replace('light-', '');
      return themes[suffix as keyof typeof themes] || themes.default;
    }
    // normal heavy theme
    return themes[themeName as keyof typeof themes] || themes.default;
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);