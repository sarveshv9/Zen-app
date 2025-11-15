// components/profile/SettingItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getThemeColor } from './SettingsSection';

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

interface SettingItemProps {
  theme: Theme;
  iconName: IconName;
  text: string;
  onPress: () => void;
  valueText?: string;
  isLast?: boolean;
}

// --- Utility ---
const createColorWithOpacity = (color: string, opacity: string): string => {
  return `${color}${opacity}`;
};

/**
 * SettingItem Component
 * 
 * A reusable setting row item with:
 * - Icon with colored background
 * - Setting label
 * - Optional value badge (e.g., notification count)
 * - Chevron indicator
 * - Full accessibility support
 * 
 * @param theme - Theme object with color configuration
 * @param iconName - Ionicons icon name
 * @param text - Setting label text
 * @param onPress - Callback when item is pressed
 * @param valueText - Optional value to display (e.g., "3/4")
 * @param isLast - Whether this is the last item (removes bottom border)
 */
export const SettingItem = React.memo<SettingItemProps>(({
  theme,
  iconName,
  text,
  onPress,
  valueText,
  isLast = false,
}) => {
  const primaryColor = getThemeColor(theme, 'primary');
  const secondaryColor = getThemeColor(theme, 'secondary');
  const textColor = getThemeColor(theme, 'text');
  const cardColor = getThemeColor(theme, 'card');

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        !isLast && styles.settingItemBorder,
        { backgroundColor: cardColor },
      ]}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityHint={valueText ? `Current value: ${valueText}` : 'Tap to open settings'}
    >
      <View style={styles.settingItemLeft}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: createColorWithOpacity(primaryColor, '15') }
        ]}>
          <Ionicons name={iconName} size={22} color={primaryColor} />
        </View>
        <Text style={[styles.settingText, { color: textColor }]} numberOfLines={1}>
          {text}
        </Text>
      </View>

      <View style={styles.settingItemRight}>
        {valueText && (
          <View style={[
            styles.badge,
            { backgroundColor: createColorWithOpacity(primaryColor, '20') }
          ]}>
            <Text style={[styles.badgeText, { color: primaryColor }]}>
              {valueText}
            </Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={secondaryColor} />
      </View>
    </TouchableOpacity>
  );
});

SettingItem.displayName = 'SettingItem';

// --- Styles ---

const styles = StyleSheet.create({
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
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});