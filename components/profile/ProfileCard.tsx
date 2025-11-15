// components/profile/ProfileCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export const ProfileCard = ({
  styles,
  sharedStyles,
  theme,
  userProfile,
  isEditingProfile,
  setUserProfile,
  setIsEditingProfile,
  handleSaveProfile,
}: any) => (
  <View style={styles.sectionContainer}>
    <TouchableOpacity
      style={styles.editButton}
      onPress={() => setIsEditingProfile(!isEditingProfile)}
    >
      <Ionicons
        name={isEditingProfile ? 'checkmark' : 'pencil'}
        size={20}
        color={theme.colors.white}
      />
    </TouchableOpacity>

    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{userProfile.avatar}</Text>
    </View>

    {isEditingProfile ? (
      <View style={styles.editingContainer}>
        <TextInput
          style={styles.editInput}
          value={userProfile.name}
          onChangeText={(text) => setUserProfile((prev: any) => ({ ...prev, name: text }))}
          placeholder="Your Name"
          placeholderTextColor={theme.colors.secondary}
        />
        <TextInput
          style={styles.editInput}
          value={userProfile.email}
          onChangeText={(text) => setUserProfile((prev: any) => ({ ...prev, email: text }))}
          placeholder="Email"
          placeholderTextColor={theme.colors.secondary}
        />
        <TextInput
          style={[styles.editInput, styles.bioInput]}
          value={userProfile.bio}
          onChangeText={(text) => setUserProfile((prev: any) => ({ ...prev, bio: text }))}
          placeholder="Bio"
          placeholderTextColor={theme.colors.secondary}
          multiline
        />
        <TouchableOpacity
          style={[sharedStyles.primaryButton, styles.saveButton]}
          onPress={handleSaveProfile}
        >
          <Text style={sharedStyles.primaryButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <>
        <Text style={styles.userName}>{userProfile.name}</Text>
        <Text style={styles.userEmail}>{userProfile.email}</Text>
        <Text style={styles.userBio}>{userProfile.bio}</Text>
      </>
    )}
  </View>
);