import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

/* ----------------------------- Android Animation ---------------------------- */
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ---------------------------------- Types ---------------------------------- */
type IconName = keyof typeof Ionicons.glyphMap;

interface ThemeColors {
  primary?: string;
  secondary?: string;
  text?: string;
  card?: string;
  border?: string;
}

interface Theme {
  colors: ThemeColors;
}

interface ExpandableSettingProps {
  theme: Theme;
  iconName: IconName;
  title: string;
  currentValue: string;
  isExpanded: boolean;
  onToggle: () => void;
  isLast?: boolean;
  children: React.ReactNode;
}

/* ------------------------------ Default Colors ------------------------------ */
const DEFAULT_COLORS = {
  primary: "#007AFF",
  secondary: "#8E8E93",
  text: "#000000",
  card: "#FFFFFF",
  border: "#E5E5EA",
} as const;

/* ------------------------------ Helper Functions ----------------------------- */
const getColor = (theme: Theme, key: keyof ThemeColors) =>
  theme.colors[key] ?? DEFAULT_COLORS[key];

const withOpacity = (hexColor: string, opacityHex: string) =>
  `${hexColor}${opacityHex}`;

/* -------------------------------------------------------------------------- */
/*                               Main Component                                */
/* -------------------------------------------------------------------------- */

export const ExpandableSetting = memo<ExpandableSettingProps>(
  ({ theme, iconName, title, currentValue, isExpanded, onToggle, isLast = false, children }) => {
    const colors = {
      primary: getColor(theme, "primary"),
      secondary: getColor(theme, "secondary"),
      text: getColor(theme, "text"),
      card: getColor(theme, "card"),
      border: getColor(theme, "border"),
    };

    const handleToggle = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onToggle();
    };

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.card },
          !isLast && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
        ]}
      >
        <Pressable
          onPress={handleToggle}
          hitSlop={8}
          style={({ pressed }) => [
            styles.header,
            pressed && styles.headerPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${title} setting`}
          accessibilityState={{ expanded: isExpanded }}
        >
          {/* Left Group: Icon + Title */}
          <View style={styles.leftGroup}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: withOpacity(colors.primary, "1A") },
              ]}
            >
              <Ionicons name={iconName} size={20} color={colors.primary} />
            </View>

            <Text
              style={[styles.title, { color: colors.text }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          {/* Right Group: Current Value + Chevron */}
          <View style={styles.rightGroup}>
            <Text
              style={[styles.value, { color: colors.secondary }]}
              numberOfLines={1}
            >
              {currentValue}
            </Text>

            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-forward"}
              size={20}
              color={colors.secondary}
            />
          </View>
        </Pressable>

        {/* Expandable Section */}
        {isExpanded && (
          <View style={[styles.expandedSection, { borderTopColor: colors.border }]}>
            {children}
          </View>
        )}
      </View>
    );
  }
);

ExpandableSetting.displayName = "ExpandableSetting";

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: "hidden",
  },

  /* Header Row */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  headerPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  /* Left Side: Icon + Title */
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
    flexShrink: 1,
  },

  /* Right Side: Value + Chevron */
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    maxWidth: 120,
    opacity: 0.9,
  },

  /* Expandable Section */
  expandedSection: {
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});