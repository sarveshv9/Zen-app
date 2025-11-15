// components/profile/SettingsSection.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SONG_LIST } from '../../constants/songs';

// --- Constants ---
const DEFAULT_COLORS = {
  primary: '#007AFF',
  secondary: '#8E8E93',
  text: '#000',
  card: '#fff',
  border: '#E5E5EA',
} as const;

const APPEARANCE_MODES = {
  LIGHT: 'light',
  HEAVY: 'heavy',
} as const;

// --- Types ---
type IconName = keyof typeof Ionicons.glyphMap;
type AppearanceMode = typeof APPEARANCE_MODES[keyof typeof APPEARANCE_MODES];

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

interface SettingsSectionProps {
  theme: Theme;
  isLightMode: boolean;
  isAppearanceExpanded: boolean;
  setIsAppearanceExpanded: (value: boolean) => void;
  selectThemeMode: (mode: AppearanceMode) => void;
  settings: {
    notifications: Record<string, boolean>;
  };
  setShowNotificationSettings: (value: boolean) => void;
  setShowPrivacySettings: (value: boolean) => void;
  setShowPreferencesModal: (value: boolean) => void;
  handleBackup: () => void;
  selectedSong: number;
  setSelectedSong: (index: number) => void;
  isMusicExpanded: boolean;
  setIsMusicExpanded: (value: boolean) => void;
}

interface SettingItemProps {
  theme: Theme;
  iconName: IconName;
  text: string;
  onPress: () => void;
  valueText?: string;
  isLast?: boolean;
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

interface OptionItemProps {
  theme: Theme;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

// --- Utility Functions ---
export const getThemeColor = (theme: Theme, key: keyof ThemeColors): string => {
  return theme.colors[key] || DEFAULT_COLORS[key];
};

const createColorWithOpacity = (color: string, opacity: string): string => {
  return `${color}${opacity}`;
};

// --- Sub-Components ---

/**
 * Reusable setting item component
 */
const SettingItem = React.memo<SettingItemProps>(({
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

  const handlePress = useCallback(() => {
    console.log(`SettingItem "${text}" pressed`);
    if (onPress) {
      onPress();
    } else {
      console.warn(`No onPress handler for "${text}"`);
    }
  }, [onPress, text]);

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        !isLast && styles.settingItemBorder,
        { backgroundColor: cardColor },
      ]}
      onPress={handlePress}
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

/**
 * Reusable expandable setting component
 */
const ExpandableSetting = React.memo<ExpandableSettingProps>(({
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

/**
 * Option item for expandable menus
 */
const OptionItem = React.memo<OptionItemProps>(({
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

/**
 * Music setting with song selection
 */
const MusicSetting = React.memo<{
  theme: Theme;
  selectedSong: number;
  setSelectedSong: (index: number) => void;
  isMusicExpanded: boolean;
  setIsMusicExpanded: (value: boolean) => void;
  isLast?: boolean;
}>(({
  theme,
  selectedSong,
  setSelectedSong,
  isMusicExpanded,
  setIsMusicExpanded,
  isLast = false,
}) => {
  const currentSongTitle = useMemo(() => {
    if (selectedSong === 0) return 'Off';
    const foundSong = SONG_LIST.find((s) => s.id === selectedSong);
    return foundSong?.title || 'Off';
  }, [selectedSong]);

  const handleToggle = useCallback(() => {
    setIsMusicExpanded(!isMusicExpanded);
  }, [isMusicExpanded, setIsMusicExpanded]);

  const handleSongSelect = useCallback((songId: number) => {
    setSelectedSong(songId);
  }, [setSelectedSong]);

  return (
    <ExpandableSetting
      theme={theme}
      iconName="musical-notes-outline"
      title="Music"
      currentValue={currentSongTitle}
      isExpanded={isMusicExpanded}
      onToggle={handleToggle}
      isLast={isLast}
    >
      <OptionItem
        theme={theme}
        label="Off"
        isSelected={selectedSong === 0}
        onPress={() => handleSongSelect(0)}
        isFirst
      />
      {SONG_LIST.map((song, index) => (
        <OptionItem
          key={song.id}
          theme={theme}
          label={song.title}
          isSelected={selectedSong === song.id}
          onPress={() => handleSongSelect(song.id)}
          isLast={index === SONG_LIST.length - 1}
        />
      ))}
    </ExpandableSetting>
  );
});

MusicSetting.displayName = 'MusicSetting';

/**
 * Appearance setting with theme mode selection
 */
const AppearanceSetting = React.memo<{
  theme: Theme;
  isLightMode: boolean;
  isAppearanceExpanded: boolean;
  setIsAppearanceExpanded: (value: boolean) => void;
  selectThemeMode: (mode: AppearanceMode) => void;
  isLast?: boolean;
}>(({
  theme,
  isLightMode,
  isAppearanceExpanded,
  setIsAppearanceExpanded,
  selectThemeMode,
  isLast = false,
}) => {
  const currentMode = useMemo(() => {
    return isLightMode ? 'Light' : 'Heavy';
  }, [isLightMode]);

  const handleToggle = useCallback(() => {
    setIsAppearanceExpanded(!isAppearanceExpanded);
  }, [isAppearanceExpanded, setIsAppearanceExpanded]);

  const handleModeSelect = useCallback((mode: AppearanceMode) => {
    selectThemeMode(mode);
  }, [selectThemeMode]);

  return (
    <ExpandableSetting
      theme={theme}
      iconName="color-palette-outline"
      title="Appearance"
      currentValue={currentMode}
      isExpanded={isAppearanceExpanded}
      onToggle={handleToggle}
      isLast={isLast}
    >
      <OptionItem
        theme={theme}
        label="Heavy"
        isSelected={!isLightMode}
        onPress={() => handleModeSelect(APPEARANCE_MODES.HEAVY)}
        isFirst
      />
      <OptionItem
        theme={theme}
        label="Light"
        isSelected={isLightMode}
        onPress={() => handleModeSelect(APPEARANCE_MODES.LIGHT)}
        isLast
      />
    </ExpandableSetting>
  );
});

AppearanceSetting.displayName = 'AppearanceSetting';

// --- Main Component ---

/**
 * SettingsSection Component
 * 
 * Displays a comprehensive settings interface with all interactions fully wired.
 */
export const SettingsSection: React.FC<SettingsSectionProps> = ({
  theme,
  isLightMode,
  isAppearanceExpanded,
  setIsAppearanceExpanded,
  selectThemeMode,
  settings,
  setShowNotificationSettings,
  setShowPrivacySettings,
  setShowPreferencesModal,
  handleBackup,
  selectedSong,
  setSelectedSong,
  isMusicExpanded,
  setIsMusicExpanded,
}) => {
  // Calculate notification count
  const notificationCount = useMemo(() => {
    return Object.values(settings.notifications).filter(Boolean).length;
  }, [settings.notifications]);

  // Get theme colors
  const textColor = useMemo(() => getThemeColor(theme, 'text'), [theme]);
  const cardColor = useMemo(() => getThemeColor(theme, 'card'), [theme]);

  // Event handlers - All fully functional and wired
  const handleNotificationPress = useCallback(() => {
    console.log('Notification settings pressed');
    setShowNotificationSettings(true);
  }, [setShowNotificationSettings]);

  const handlePrivacyPress = useCallback(() => {
    console.log('Privacy settings pressed');
    setShowPrivacySettings(true);
  }, [setShowPrivacySettings]);

  const handlePreferencesPress = useCallback(() => {
    console.log('Preferences pressed');
    setShowPreferencesModal(true);
  }, [setShowPreferencesModal]);

  const handleBackupPress = useCallback(() => {
    console.log('Backup pressed');
    handleBackup();
  }, [handleBackup]);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Settings
      </Text>

      <View style={[styles.settingsCard, { backgroundColor: cardColor }]}>
        <SettingItem
          theme={theme}
          iconName="notifications-outline"
          text="Notifications"
          valueText={`${notificationCount}/4`}
          onPress={handleNotificationPress}
        />

        <MusicSetting
          theme={theme}
          selectedSong={selectedSong}
          setSelectedSong={setSelectedSong}
          isMusicExpanded={isMusicExpanded}
          setIsMusicExpanded={setIsMusicExpanded}
        />

        <AppearanceSetting
          theme={theme}
          isLightMode={isLightMode}
          isAppearanceExpanded={isAppearanceExpanded}
          setIsAppearanceExpanded={setIsAppearanceExpanded}
          selectThemeMode={selectThemeMode}
        />

        <SettingItem
          theme={theme}
          iconName="lock-closed-outline"
          text="Privacy & Security"
          onPress={handlePrivacyPress}
        />

        <SettingItem
          theme={theme}
          iconName="settings-outline"
          text="Preferences"
          onPress={handlePreferencesPress}
        />

        <SettingItem
          theme={theme}
          iconName="cloud-upload-outline"
          text="Backup & Export"
          onPress={handleBackupPress}
          isLast
        />
      </View>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  settingsCard: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
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
  expandableContainer: {
    overflow: 'hidden',
  },
  expandedContent: {
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
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