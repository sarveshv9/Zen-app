// app/(tabs)/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfileCard } from '../../components/profile/ProfileCard';
import { SettingModal } from '../../components/profile/SettingModal';
import { SettingsSection } from '../../components/profile/SettingsSection';
import { StatCard } from '../../components/profile/StatCard';
import { useAudio } from '../../context/AudioContext';
import { useTheme } from '../../context/ThemeContext';

import {
  getSharedStyles,
  lightThemes,
  Theme,
  ThemeName,
  themes,
} from '../../constants/shared';

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    // --- ProfileScreen specific ---
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 20,
      color: theme.colors.primary,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    },

    // --- Styles for ProfileCard ---
    sectionContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.lg,
      alignItems: 'center',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      elevation: 3,
      position: 'relative',
    },
    editButton: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      backgroundColor: theme.colors.primary,
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      borderWidth: 3,
      borderColor: theme.colors.background,
    },
    avatarText: {
      fontSize: 48,
      color: theme.colors.white,
    },
    userName: {
      fontFamily: theme.fonts.bold,
      fontSize: 24,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    userEmail: {
      fontFamily: theme.fonts.regular,
      fontSize: 16,
      color: theme.colors.secondary,
      marginBottom: theme.spacing.md,
    },
    userBio: {
      fontFamily: theme.fonts.regular,
      fontSize: 14,
      color: theme.colors.secondary,
      textAlign: 'center',
    },
    editingContainer: {
      width: '100%',
      alignItems: 'center',
    },
    editInput: {
      fontFamily: theme.fonts.regular,
      fontSize: 16,
      color: theme.colors.primary,
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      width: '100%',
      borderWidth: 1,
      borderColor: theme.colors.secondary,
    },
    bioInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    saveButton: {
      marginTop: theme.spacing.md,
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      maxWidth: 500,
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.secondary,
    },
    modalTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 22,
      color: theme.colors.primary,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    modalBody: {
      marginBottom: theme.spacing.lg,
    },
    notificationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.secondary,
    },
    notificationLabel: {
      fontFamily: theme.fonts.medium,
      fontSize: 16,
      color: theme.colors.primary,
      flex: 1,
    },
    privacySection: {
      marginBottom: theme.spacing.lg,
    },
    privacySectionTitle: {
      fontFamily: theme.fonts.bold,
      fontSize: 18,
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
    },
    privacyItem: {
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.secondary,
    },
    privacyItemText: {
      fontFamily: theme.fonts.regular,
      fontSize: 16,
      color: theme.colors.primary,
    },
    preferencesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.secondary,
    },
    preferencesLabel: {
      fontFamily: theme.fonts.medium,
      fontSize: 16,
      color: theme.colors.primary,
    },
    preferencesValue: {
      fontFamily: theme.fonts.regular,
      fontSize: 14,
      color: theme.colors.secondary,
    },
  });

export default function ProfileScreen() {
  const { themeName, setThemeName } = useTheme();
  const { selectedSong, setSelectedSong } = useAudio();

  // --- Theme resolving and styles ---
  const isLightMode = useMemo(
    () => typeof themeName === 'string' && themeName.startsWith('light-'),
    [themeName]
  );
  const baseThemeName = useMemo(() => {
    if (isLightMode) return themeName.substring(6);
    return themeName;
  }, [isLightMode, themeName]);

  const theme: Theme = useMemo(() => {
    if (isLightMode) {
      const lt = lightThemes[themeName];
      if (lt) return lt;
      return themes[baseThemeName as keyof typeof themes] || themes.default;
    }
    return themes[themeName as keyof typeof themes] || themes.default;
  }, [themeName, isLightMode, baseThemeName]);

  const styles = useMemo(() => getStyles(theme), [theme]);
  const sharedStyles = useMemo(() => getSharedStyles(theme), [theme]);

  // --- State for Modals ---
  const [modalVisible, setModalVisible] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // --- State for ProfileCard ---
  const [user, setUser] = useState({
    name: 'Ash Ketchum',
    avatar: 'A',
    role: 'Pokémon Trainer',
    stats: {
      followers: 25,
      following: 3,
      projects: 12,
    },
    email: 'ash@palette.town',
    bio: 'Pokémon Trainer from Palette Town.',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Profile Saved:', user);
  };

  // --- State for SettingsSection ---
  const [isAppearanceExpanded, setIsAppearanceExpanded] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      taskReminders: true,
      dailySummary: true,
      achievements: false,
      news: false,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      allowMessages: true,
    },
    preferences: {
      language: 'English',
      timezone: 'UTC-5',
      autoSave: true,
    },
  });

  // --- State for MusicSetting ---
  const [isMusicExpanded, setIsMusicExpanded] = useState(false);

  // --- Handlers for SettingsSection ---
  const selectThemeMode = (mode: 'light' | 'heavy') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (mode === 'light') {
      if (baseThemeName === 'default') {
        setThemeName('light-default' as ThemeName);
      } else {
        setThemeName(`light-${baseThemeName}` as ThemeName);
      }
    } else {
      setThemeName(baseThemeName as ThemeName);
    }
  };

  const handleBackup = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Backup', 'Your data is being backed up.', [
      {
        text: 'OK',
        onPress: () => console.log('Backup started'),
      },
    ]);
  };

  // --- Handlers for MusicSetting ---
  const handleSelectSong = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSong(index);
    console.log('Selected Song:', index);
  };

  // --- Notification Settings Handlers ---
  const toggleNotification = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications],
      },
    }));
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => console.log('User logged out') },
    ]);
  };

  return (
    <SafeAreaView style={sharedStyles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Profile Card */}
        <ProfileCard
          styles={styles}
          sharedStyles={sharedStyles}
          theme={theme}
          userProfile={user}
          isEditingProfile={isEditingProfile}
          setUserProfile={setUser}
          setIsEditingProfile={setIsEditingProfile}
          handleSaveProfile={handleSaveProfile}
        />

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard label="Completed" value={user.stats.followers} theme={theme} />
          <StatCard label="Active" value={user.stats.following} theme={theme} />
          <StatCard label="Streak" value={user.stats.projects} theme={theme} />
        </View>

        {/* Settings section */}
        <SettingsSection
          theme={theme}
          isLightMode={isLightMode}
          isAppearanceExpanded={isAppearanceExpanded}
          setIsAppearanceExpanded={setIsAppearanceExpanded}
          selectThemeMode={selectThemeMode}
          settings={settings}
          setShowNotificationSettings={setShowNotificationSettings}
          setShowPrivacySettings={setShowPrivacySettings}
          setShowPreferencesModal={setShowPreferencesModal}
          handleBackup={handleBackup}
          selectedSong={selectedSong}
          setSelectedSong={handleSelectSong}
          isMusicExpanded={isMusicExpanded}
          setIsMusicExpanded={setIsMusicExpanded}
        />

        {/* Logout button */}
        <TouchableOpacity
          style={[sharedStyles.primaryButton, { margin: theme.spacing.md }]}
          onPress={handleLogout}
        >
          <Text style={sharedStyles.primaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Original Setting Modal */}
      <SettingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        theme={theme}
        user={user}
        setUser={setUser}
      />

      {/* Notification Settings Modal */}
      <Modal
        visible={showNotificationSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotificationSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Settings</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowNotificationSettings(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.notificationRow}>
                <Text style={styles.notificationLabel}>Task Reminders</Text>
                <Switch
                  value={settings.notifications.taskReminders}
                  onValueChange={() => toggleNotification('taskReminders')}
                  trackColor={{
                    false: theme.colors.secondary,
                    true: theme.colors.primary,
                  }}
                  thumbColor={theme.colors.white}
                />
              </View>

              <View style={styles.notificationRow}>
                <Text style={styles.notificationLabel}>Daily Summary</Text>
                <Switch
                  value={settings.notifications.dailySummary}
                  onValueChange={() => toggleNotification('dailySummary')}
                  trackColor={{
                    false: theme.colors.secondary,
                    true: theme.colors.primary,
                  }}
                  thumbColor={theme.colors.white}
                />
              </View>

              <View style={styles.notificationRow}>
                <Text style={styles.notificationLabel}>Achievements</Text>
                <Switch
                  value={settings.notifications.achievements}
                  onValueChange={() => toggleNotification('achievements')}
                  trackColor={{
                    false: theme.colors.secondary,
                    true: theme.colors.primary,
                  }}
                  thumbColor={theme.colors.white}
                />
              </View>

              <View style={[styles.notificationRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.notificationLabel}>News & Updates</Text>
                <Switch
                  value={settings.notifications.news}
                  onValueChange={() => toggleNotification('news')}
                  trackColor={{
                    false: theme.colors.secondary,
                    true: theme.colors.primary,
                  }}
                  thumbColor={theme.colors.white}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        visible={showPrivacySettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPrivacySettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy & Security</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPrivacySettings(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>Account Privacy</Text>
                <TouchableOpacity
                  style={styles.privacyItem}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Privacy', 'Profile visibility settings');
                  }}
                >
                  <Text style={styles.privacyItemText}>
                    Profile Visibility: {settings.privacy.profileVisibility}
                  </Text>
                </TouchableOpacity>
                <View style={styles.notificationRow}>
                  <Text style={styles.notificationLabel}>Show Email</Text>
                  <Switch
                    value={settings.privacy.showEmail}
                    onValueChange={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSettings((prev) => ({
                        ...prev,
                        privacy: {
                          ...prev.privacy,
                          showEmail: !prev.privacy.showEmail,
                        },
                      }));
                    }}
                    trackColor={{
                      false: theme.colors.secondary,
                      true: theme.colors.primary,
                    }}
                    thumbColor={theme.colors.white}
                  />
                </View>
                <View style={[styles.notificationRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.notificationLabel}>Allow Messages</Text>
                  <Switch
                    value={settings.privacy.allowMessages}
                    onValueChange={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSettings((prev) => ({
                        ...prev,
                        privacy: {
                          ...prev.privacy,
                          allowMessages: !prev.privacy.allowMessages,
                        },
                      }));
                    }}
                    trackColor={{
                      false: theme.colors.secondary,
                      true: theme.colors.primary,
                    }}
                    thumbColor={theme.colors.white}
                  />
                </View>
              </View>

              <View style={styles.privacySection}>
                <Text style={styles.privacySectionTitle}>Security</Text>
                <TouchableOpacity
                  style={styles.privacyItem}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Security', 'Change password');
                  }}
                >
                  <Text style={styles.privacyItemText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.privacyItem, { borderBottomWidth: 0 }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Security', 'Two-factor authentication settings');
                  }}
                >
                  <Text style={styles.privacyItemText}>Two-Factor Authentication</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Preferences Modal */}
      <Modal
        visible={showPreferencesModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreferencesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Preferences</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPreferencesModal(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TouchableOpacity
                style={styles.preferencesRow}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert('Preferences', 'Language selection');
                }}
              >
                <Text style={styles.preferencesLabel}>Language</Text>
                <Text style={styles.preferencesValue}>{settings.preferences.language}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.preferencesRow}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Alert.alert('Preferences', 'Timezone selection');
                }}
              >
                <Text style={styles.preferencesLabel}>Timezone</Text>
                <Text style={styles.preferencesValue}>{settings.preferences.timezone}</Text>
              </TouchableOpacity>

              <View style={[styles.notificationRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.notificationLabel}>Auto-Save</Text>
                <Switch
                  value={settings.preferences.autoSave}
                  onValueChange={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSettings((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        autoSave: !prev.preferences.autoSave,
                      },
                    }));
                  }}
                  trackColor={{
                    false: theme.colors.secondary,
                    true: theme.colors.primary,
                  }}
                  thumbColor={theme.colors.white}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}