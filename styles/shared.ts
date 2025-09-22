import { StyleSheet } from 'react-native';

// Define the structure of a theme
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    white: string;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Base theme with shared styles for fonts, spacing, etc.
const baseTheme = {
  fonts: {
    regular: "UbuntuRegular",
    medium: "UbuntuMedium",
    bold: "UbuntuBold",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
};

export const themes = {
 default: { ...baseTheme, colors: { primary: "#6C757D", secondary: "#C8CDD0", background: "#F8F9FA", white: "#FFFFFF" } } as Theme,
 pikachu: { ...baseTheme, colors: { primary: "#F6D02F", secondary: "#FFB3B3", background: "#FFF9E6", white: "#FFFFFF" } } as Theme,
 squirtle: { ...baseTheme, colors: { primary: "#66B2FF", secondary: "#7DB8E8", background: "#EAF6FF", white: "#FFFFFF" } } as Theme,
 dragonite: { ...baseTheme, colors: { primary: "#FF9A6B", secondary: "#C4E8DD", background: "#FFF6EC", white: "#FFFFFF" } } as Theme,
 mew: { ...baseTheme, colors: { primary: "#FFC0E6", secondary: "#FFD1EA", background: "#FFF6FB", white: "#FFFFFF" } } as Theme,
 slowpoke: { ...baseTheme, colors: { primary: "#FFB6C1", secondary: "#FFF8E7", background: "#FFF6F8", white: "#FFFFFF" } } as Theme,
 psyduck: { ...baseTheme, colors: { primary: "#FFD54A", secondary: "#E8C266", background: "#FFFBE6", white: "#FFFFFF" } } as Theme,
 charizard: { ...baseTheme, colors: { primary: "#FF6A3D", secondary: "#7BA3CA", background: "#FFF4E9", white: "#FFFFFF" } } as Theme,
 bulbasaur: { ...baseTheme, colors: { primary: "#78C850", secondary: "#7BA070", background: "#F0FFF6", white: "#FFFFFF" } } as Theme,
 meowth: { ...baseTheme, colors: { primary: "#F6E3B4", secondary: "#D4A574", background: "#FFFBF2", white: "#FFFFFF" } } as Theme,
 jigglypuff: { ...baseTheme, colors: { primary: "#FFB6E0", secondary: "#9BC7FF", background: "#FFF6FB", white: "#FFFFFF" } } as Theme,
 gengar: { ...baseTheme, colors: { primary: "#5B3E99", secondary: "#F19A95", background: "#F7F2FF", white: "#FFFFFF" } } as Theme,
 snorlax: { ...baseTheme, colors: { primary: "#2E5E64", secondary: "#F5F1DC", background: "#F3FBFF", white: "#FFFFFF" } } as Theme,
};

export const lightThemes: Record<string, Theme> = {};

const lightBackground = "#F8F9FA";
const lightSecondary = "#6C757D";

Object.keys(themes).forEach(themeKey => {
  if (themeKey !== 'default') {
    const heavyTheme = themes[themeKey as keyof typeof themes];
    lightThemes[themeKey] = {
      ...baseTheme,
      colors: {
        primary: heavyTheme.colors.primary,
        secondary: lightSecondary,
        background: lightBackground,
        white: "#FFFFFF",
      },
    };
  }
});

// --- UPDATED TYPE DEFINITIONS ---
// Base names like "pikachu", "squirtle", etc.
type HeavyThemeName = keyof typeof themes;
// Light variations like "light-pikachu", "light-squirtle", etc.
type LightThemeName = `light-${Exclude<HeavyThemeName, 'default'>}`;
// A single, comprehensive type for all possible theme names.
export type ThemeName = HeavyThemeName | LightThemeName;


// This function remains unchanged and works with any theme object you pass it
export const getSharedStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
    heading: { fontSize: 28, fontFamily: theme.fonts.bold, color: theme.colors.primary, textAlign: 'center' },
    primaryButton: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl, borderRadius: theme.borderRadius.lg },
    primaryButtonText: { color: theme.colors.white, fontSize: 16, fontFamily: theme.fonts.bold, textAlign: 'center' },
  });
};