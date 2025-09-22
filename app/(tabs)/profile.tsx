import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '../../context/ThemeContext';
import { getSharedStyles, Theme, ThemeName, themes } from '../../styles/shared';

export default function ProfileScreen() {
  const { theme, themeName, changeTheme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const sharedStyles = useMemo(() => getSharedStyles(theme), [theme]);

  // State to control the visibility of the dropdown menu
  const [isAppearanceExpanded, setIsAppearanceExpanded] = useState(false);

  const isLightMode = themeName.startsWith('light-');
  
  const basePokemonName = (
    isLightMode ? themeName.substring(6) : themeName
  ) as keyof typeof themes;

  const selectThemeMode = (mode: 'light' | 'heavy') => {
    let newThemeName: ThemeName;

    if (mode === 'heavy') {
      newThemeName = basePokemonName;
    } else {
      if (basePokemonName === 'default') {
        Alert.alert("No Light Mode", "The default theme does not have a light mode.");
        return;
      }
      newThemeName = `light-${basePokemonName}`;
    }
    
    if (newThemeName !== themeName) {
      changeTheme(newThemeName);
    }
  };

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[sharedStyles.heading, styles.heading]}>🧑‍💼 My Profile</Text>

        {/* User Info Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}> Zen </Text>
          </View>
          <Text style={styles.userName}>Zen User</Text>
          <Text style={styles.userEmail}>zen.user@example.com</Text>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} />
          </TouchableOpacity>

          {/* Appearance Section - Now an expandable dropdown */}
          <View style={styles.appearanceSection}>
            <TouchableOpacity 
              style={styles.expandableHeader} 
              onPress={() => setIsAppearanceExpanded(!isAppearanceExpanded)}
              activeOpacity={0.7}
            >
              <Ionicons name="color-palette-outline" size={20} color={theme.colors.secondary} />
              <Text style={styles.settingText}>Appearance</Text>
              <Ionicons 
                name={isAppearanceExpanded ? "chevron-up" : "chevron-forward"} 
                size={20} color={theme.colors.secondary} 
              />
            </TouchableOpacity>

            {isAppearanceExpanded && (
              <View style={styles.expandableContent}>
                <TouchableOpacity 
                  style={[styles.dropdownOption, !isLightMode && styles.dropdownOptionActive]} 
                  onPress={() => selectThemeMode('heavy')}
                >
                  <Text style={[styles.dropdownOptionText, !isLightMode && styles.dropdownOptionTextActive]}>
                    Heavy
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dropdownOption, isLightMode && styles.dropdownOptionActive]} 
                  onPress={() => selectThemeMode('light')}
                >
                  <Text style={[styles.dropdownOptionText, isLightMode && styles.dropdownOptionTextActive]}>
                    Light
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.settingText}>Account & Privacy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[sharedStyles.primaryButton, styles.logoutButton]}
          activeOpacity={0.7}
        >
          <Text style={sharedStyles.primaryButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContainer: { flex: 1 },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: 60,
      paddingBottom: theme.spacing.xl,
    },
    heading: {
      marginBottom: theme.spacing.xl,
    },
    sectionContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    avatarText: {
      fontSize: 24,
      color: theme.colors.white,
      fontFamily: theme.fonts.bold,
    },
    userName: {
      fontSize: 22,
      fontFamily: theme.fonts.bold,
      color: theme.colors.primary,
    },
    userEmail: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.colors.secondary,
      marginTop: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.colors.primary,
      alignSelf: 'flex-start',
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background,
    },
    settingText: {
      flex: 1,
      marginLeft: theme.spacing.md,
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.colors.primary,
    },
    logoutButton: {
      backgroundColor: '#E74C3C',
    },
    // Expandable Appearance Section Styles
    appearanceSection: {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background,
    },
    expandableHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingVertical: theme.spacing.md,
    },
    expandableContent: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingBottom: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    dropdownOption: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 2,
      borderColor: theme.colors.secondary + '40',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdownOptionActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    dropdownOptionText: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.colors.primary,
    },
    dropdownOptionTextActive: {
      color: theme.colors.white,
      fontFamily: theme.fonts.bold,
    },
  });