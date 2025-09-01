import { StyleSheet } from "react-native";

// Design tokens for consistent theming
export const theme = {
  colors: {
    background: "#E9EFEC",
    primary: "#FFC7C7",
    secondary: "#8785A2",
    accent: "#FFF6E3",
    white: "#FFFFFF",
    danger: "#FF6B6B",
  },
  fonts: {
    bold: "UbuntuBold",
    medium: "UbuntuMedium",
    regular: "UbuntuRegular",
    lightItalic: "UbuntuLightI",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  shadows: {
    soft: {
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 4,
    },
  },
};

// Shared component styles
export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    ...theme.shadows.soft,
  },
  primaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: theme.fonts.bold,
  },
  secondaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    ...theme.shadows.soft,
  },
  secondaryButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: theme.fonts.bold,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.soft,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
    ...theme.shadows.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
    fontFamily: theme.fonts.regular,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.secondary,
    textAlign: "center",
    fontFamily: theme.fonts.bold,
    marginBottom: theme.spacing.lg,
  },
});