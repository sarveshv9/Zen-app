import { StyleSheet } from 'react-native';

// Define the structure of a theme
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    white: string; // Note: This might be a dark color for text on light themes
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
    lg: 16,
  },
  shadows: {
    soft: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
};

// Expanded themes with pastel colors for every Pokémon on your list
export const themes = {
  default: { ...baseTheme, colors: { primary: "#A0AEC0", secondary: "#CBD5E0", background: "#F7FAFC", white: "#FFFFFF" } } as Theme,
  pikachu: { ...baseTheme, colors: { primary: "#FDECB6", secondary: "#FAB4B4", background: "#FFFBEB", white: "#4A5568" } } as Theme,
  squirtle: { ...baseTheme, colors: { primary: "#AEC6F5", secondary: "#E3C9B4", background: "#F0F5FF", white: "#FFFFFF" } } as Theme,
  dragonite: { ...baseTheme, colors: { primary: "#FDD8B4", secondary: "#A8E6CF", background: "#FFF8F0", white: "#FFFFFF" } } as Theme,
  mew: { ...baseTheme, colors: { primary: "#FAD0E0", secondary: "#DCDCF0", background: "#FEF6F8", white: "#FFFFFF" } } as Theme,
  slowpoke: { ...baseTheme, colors: { primary: "#FBC8D4", secondary: "#FDF2B5", background: "#FEF3F5", white: "#4A5568" } } as Theme,
  psyduck: { ...baseTheme, colors: { primary: "#FDECB6", secondary: "#D4D4B8", background: "#FFFBEB", white: "#4A5568" } } as Theme,
  charizard: { ...baseTheme, colors: { primary: "#FAD0B0", secondary: "#AEC6F5", background: "#FEF1EB", white: "#FFFFFF" } } as Theme,
  bulbasaur: { ...baseTheme, colors: { primary: "#B4E29E", secondary: "#9ED5E5", background: "#F1F9EE", white: "#FFFFFF" } } as Theme,
  meowth: { ...baseTheme, colors: { primary: "#F0E6C0", secondary: "#D4C4B8", background: "#FCFAF1", white: "#4A5568" } } as Theme,
  jigglypuff: { ...baseTheme, colors: { primary: "#FDD4E2", secondary: "#A8E6CF", background: "#FEF6F8", white: "#FFFFFF" } } as Theme,
  gengar: { ...baseTheme, colors: { primary: "#D6C7F9", secondary: "#F5B8B4", background: "#F5F2FC", white: "#5A5266" } } as Theme,
  snorlax: { ...baseTheme, colors: { primary: "#94C3C8", secondary: "#FDF9E9", background: "#EFF8F9", white: "#4A5568" } } as Theme,
};

export type ThemeName = keyof typeof themes;

// Function to generate shared styles dynamically based on the current theme
export const getSharedStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
    heading: { fontSize: 28, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center' },
    primaryButton: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl, borderRadius: theme.borderRadius.lg },
    primaryButtonText: { color: theme.colors.white, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  });
};