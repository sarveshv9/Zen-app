// components/profile/OptionItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { getThemeColor } from './SettingsSection';

// --- Types ---
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

interface OptionItemProps {
  theme: Theme;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

/**
 * OptionItem Component
 * 
 * A selectable option item for expandable menus:
 * - Option label text
 * - Visual indication of selection (text color + checkmark)
 * - Proper spacing for first/last items
 * - Full accessibility with radio button semantics
 * 
 * Used within expandable settings like Music and Appearance.
 * 
 * @param theme - Theme object with color configuration
 * @param label - Option label text
 * @param isSelected - Whether this option is currently selected
 * @param onPress - Callback when option is pressed
 * @param isFirst - Whether this is the first option (adds top padding)
 * @param isLast - Whether this is the last option (adds bottom padding)
 */
export const OptionItem = React.memo<OptionItemProps>(({
  theme,
  label,
  isSelected,
  onPress,
  isFirst = false,
  isLast = false,
}) => {
  const primaryColor = getThemeColor(theme, 'primary');
  const textColor = getThemeColor(theme, 'text');

  return (
    <TouchableOpacity
      style={[
        styles.optionItem,
        isFirst && styles.optionItemFirst,
        isLast && styles.optionItemLast,
      ]}
      onPress={onPress}
      activeOpacity={0.6}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
      accessibilityLabel={label}
      accessibilityHint={isSelected ? 'Currently selected' : 'Tap to select this option'}
    >
      <Text
        style={[
          styles.optionText,
          { color: textColor },
          isSelected && { 
            color: primaryColor, 
            fontWeight: '600' 
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {isSelected && (
        <Ionicons 
          name="checkmark" 
          size={20} 
          color={primaryColor}
          accessibilityLabel="Selected" 
        />
      )}
    </TouchableOpacity>
  );
});

OptionItem.displayName = 'OptionItem';

// --- Styles ---

const styles = StyleSheet.create({
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 52,
    minHeight: 48,
  },
  optionItemFirst: {
    paddingTop: 8,
  },
  optionItemLast: {
    paddingBottom: 8,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.2,
    flex: 1,
  },
});