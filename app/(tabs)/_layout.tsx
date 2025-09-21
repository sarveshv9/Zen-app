import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getSharedStyles } from '../../styles/shared';

export default function TabLayout() {
  const { theme } = useTheme();
  const styles = getSharedStyles(theme);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          backgroundColor: theme.colors.white,
          borderRadius: 15,
          height: 60,
          borderTopWidth: 0,
          paddingHorizontal: 10,
          flexDirection: 'row',
          paddingTop: 12,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? theme.colors.primary + '20' : 'transparent',
              padding: 6,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? theme.colors.primary + '20' : 'transparent',
              padding: 6,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons
                name={focused ? "checkmark-done-circle" : "checkmark-done-circle-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? theme.colors.primary + '20' : 'transparent',
              padding: 6,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}