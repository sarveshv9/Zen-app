import { Ionicons } from '@expo/vector-icons'; // Assuming you have this for icons
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '../../context/ThemeContext';
import { getSharedStyles, Theme } from '../../styles/shared';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const sharedStyles = useMemo(() => getSharedStyles(theme), [theme]);

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[sharedStyles.heading, styles.heading]}>👤 My Profile</Text>

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
          <Pressable style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} />
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Ionicons name="color-palette-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.settingText}>Appearance</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} />
          </Pressable>
          <Pressable style={styles.settingItem}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.secondary} />
            <Text style={styles.settingText}>Account & Privacy</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondary} />
          </Pressable>
        </View>

        <Pressable style={({ pressed }) => [sharedStyles.primaryButton, styles.logoutButton, pressed && styles.buttonPressed]}>
          <Text style={sharedStyles.primaryButtonText}>Log Out</Text>
        </Pressable>

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
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",

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
      backgroundColor: '#E74C3C', // A distinct color for logout/destructive actions
    },
    buttonPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },
  });