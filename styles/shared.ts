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
// Pikachu: Bright yellow primary, soft light red secondary
 pikachu: { ...baseTheme, colors: { primary: "#F6D02F", secondary: "#FFB3B3", background: "#FFF9E6", white: "#FFFFFF" } } as Theme,
// Squirtle: Light blue primary, lighter blue secondary
 squirtle: { ...baseTheme, colors: { primary: "#66B2FF", secondary: "#7DB8E8", background: "#EAF6FF", white: "#FFFFFF" } } as Theme,
// Dragonite: Warm orange primary, light mint secondary
 dragonite: { ...baseTheme, colors: { primary: "#FF9A6B", secondary: "#C4E8DD", background: "#FFF6EC", white: "#FFFFFF" } } as Theme,
// Mew: Soft pink primary, lighter pink secondary
 mew: { ...baseTheme, colors: { primary: "#FFC0E6", secondary: "#FFD1EA", background: "#FFF6FB", white: "#FFFFFF" } } as Theme,
// Slowpoke: Pastel pink primary, light cream secondary
 slowpoke: { ...baseTheme, colors: { primary: "#FFB6C1", secondary: "#FFF8E7", background: "#FFF6F8", white: "#FFFFFF" } } as Theme,
// Psyduck: Golden yellow primary, light gold secondary
 psyduck: { ...baseTheme, colors: { primary: "#FFD54A", secondary: "#E8C266", background: "#FFFBE6", white: "#FFFFFF" } } as Theme,
// Charizard: Fiery orange primary, light blue secondary
 charizard: { ...baseTheme, colors: { primary: "#FF6A3D", secondary: "#7BA3CA", background: "#FFF4E9", white: "#FFFFFF" } } as Theme,
// Bulbasaur: Green primary, light green secondary
 bulbasaur: { ...baseTheme, colors: { primary: "#78C850", secondary: "#7BA070", background: "#F0FFF6", white: "#FFFFFF" } } as Theme,
// Meowth: Warm cream primary, light brown secondary
 meowth: { ...baseTheme, colors: { primary: "#F6E3B4", secondary: "#D4A574", background: "#FFFBF2", white: "#FFFFFF" } } as Theme,
// Jigglypuff: Soft pink primary, light blue secondary
 jigglypuff: { ...baseTheme, colors: { primary: "#FFB6E0", secondary: "#9BC7FF", background: "#FFF6FB", white: "#FFFFFF" } } as Theme,
// Gengar: Moody purple primary, light red secondary
 gengar: { ...baseTheme, colors: { primary: "#5B3E99", secondary: "#F19A95", background: "#F7F2FF", white: "#FFFFFF" } } as Theme,
// Snorlax: Deep teal-blue primary, light cream secondary
 snorlax: { ...baseTheme, colors: { primary: "#2E5E64", secondary: "#F5F1DC", background: "#F3FBFF", white: "#FFFFFF" } } as Theme,
};

export type ThemeName = keyof typeof themes;

// Function to generate shared styles dynamically based on the current theme
export const getSharedStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl },
    heading: { fontSize: 28, fontFamily: theme.fonts.bold, color: theme.colors.primary, textAlign: 'center' },
    primaryButton: { backgroundColor: theme.colors.primary, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl, borderRadius: theme.borderRadius.lg },
    primaryButtonText: { color: theme.colors.white, fontSize: 16, fontFamily: theme.fonts.bold, textAlign: 'center' },
  });
};