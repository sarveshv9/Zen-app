// components/profile/ExpandableSetting.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- Constants ---
const DEFAULT_COLORS = {
  primary: '#007AFF',
  secondary: '#8E8E93',
  text: '#000',
  card: '#fff',
  border: '#E5E5EA',
} as const;

// --- Types ---
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

// --- Utility Functions ---
const getThemeColor = (theme: Theme, key: keyof ThemeColors): string => {
  return theme.colors[key] || DEFAULT_COLORS[key];
};

const createColorWithOpacity = (color: string, opacity: string): string => {
  return `${color}${opacity}`;
};

/**
 * ExpandableSetting Component
 * 
 * A reusable expandable setting row that can show/hide child options:
 * - Icon with colored background
 * - Setting title
 * - Current selected value
 * - Chevron indicator (down when expanded, forward when collapsed)
 * - Expandable content area for child options
 * - Full accessibility support with expanded state
 * 
 * @param theme - Theme object with color configuration
 * @param iconName - Ionicons icon name
 * @param title - Setting title (e.g., "Music", "Appearance")
 * @param currentValue - Current selected value to display
 * @param isExpanded - Whether the setting is currently expanded
 * @param onToggle - Callback to toggle expansion state
 * @param isLast - Whether this is the last item (removes bottom border)
 * @param children - Child option items to display when expanded
 */
export const ExpandableSetting = React.memo<ExpandableSettingProps>(({
  theme,
  iconName,
  title,
  currentValue,
  isExpanded,
  onToggle,
  isLast = false,
  children,
}) => {
  const primaryColor = getThemeColor(theme, 'primary');
  const secondaryColor = getThemeColor(theme, 'secondary');
  const textColor = getThemeColor(theme, 'text');
  const cardColor = getThemeColor(theme, 'card');
  const borderColor = getThemeColor(theme, 'border');

  return (
    <View style={[
      styles.expandableContainer,
      !isLast && styles.settingItemBorder,
      { backgroundColor: cardColor },
    ]}>
      {/* Main Touchable Header */}
      <TouchableOpacity
        style={styles.settingItem}
        onPress={onToggle}
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel={`${title} setting`}
        accessibilityState={{ expanded: isExpanded }}
        accessibilityHint={`Current value: ${currentValue}. Tap to ${isExpanded ? 'collapse' : 'expand'} options`}
      >
        <View style={styles.settingItemLeft}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: createColorWithOpacity(primaryColor, '15') }
          ]}>
            <Ionicons name={iconName} size={22} color={primaryColor} />
          </View>
          <Text style={[styles.settingText, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.settingItemRight}>
          <Text style={[styles.valueText, { color: secondaryColor }]} numberOfLines={1}>
            {currentValue}
          </Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-forward'}
            size={20}
            color={secondaryColor}
          />
        </View>
      </TouchableOpacity>

      {/* Expandable Content Area */}
      {isExpanded && (
        <View 
          style={[styles.expandedContent, { borderTopColor: borderColor }]}
          accessibilityRole="list"
        >
          {children}
        </View>
      )}
    </View>
  );
});

ExpandableSetting.displayName = 'ExpandableSetting';

// --- Styles ---

const styles = StyleSheet.create({
  expandableContainer: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  settingItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
    marginRight: 8,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
    flexShrink: 1,
  },
  valueText: {
    fontSize: 15,
    fontWeight: '400',
    maxWidth: 120,
  },
  expandedContent: {
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});