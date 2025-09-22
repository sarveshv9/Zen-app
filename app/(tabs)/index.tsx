import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AiSuggestions from "../../components/AiSuggestions";
import { useTheme } from "../../context/ThemeContext";
// **FIXED**: Make sure ThemeName is imported from shared.ts
import { getSharedStyles, Theme, ThemeName, themes } from "../../styles/shared";

const ROUTINE = [
  { hour: 6, task: "🌞 Wake Up Slowly" },
  { hour: 6.5, task: "💧 Drink Warm Water" },
  { hour: 7, task: "🧘 Light Stretching or Yoga" },
  { hour: 8, task: "🍵 Herbal Tea & Journaling" },
  { hour: 9, task: "🥣 Healthy Breakfast" },
  { hour: 10, task: "📚 Learn Something Calm" },
  { hour: 13, task: "🥗 Light Lunch" },
  { hour: 15, task: "🌿 Nature Walk or Break" },
  { hour: 17, task: "📝 Reflect on the Day" },
  { hour: 19, task: "🍽 Light Dinner" },
  { hour: 21, task: "🌙 Prepare for Sleep" },
  { hour: 22, task: "🛌 Sleep Early" },
];

const REVERSED_ROUTINE = [...ROUTINE].reverse();

const TASK_IMAGES: Record<string, ImageSourcePropType> = {
  "🌞 Wake Up Slowly": require("../assets/images/pixel/wakeup.png"),
  "💧 Drink Warm Water": require("../assets/images/pixel/water.png"),
  "🧘 Light Stretching or Yoga": require("../assets/images/pixel/yoga.png"),
  "🍵 Herbal Tea & Journaling": require("../assets/images/pixel/tea_journal.png"),
  "🥣 Healthy Breakfast": require("../assets/images/pixel/breakfast.png"),
  "📚 Learn Something Calm": require("../assets/images/pixel/study.png"),
  "🥗 Light Lunch": require("../assets/images/pixel/lunch.png"),
  "🌿 Nature Walk or Break": require("../assets/images/pixel/walk.png"),
  "📝 Reflect on the Day": require("../assets/images/pixel/reflect.png"),
  "🍽 Light Dinner": require("../assets/images/pixel/dinner.png"),
  "🌙 Prepare for Sleep": require("../assets/images/pixel/prepare_sleep.png"),
  "🛌 Sleep Early": require("../assets/images/pixel/sleep.png"),
};

// **FIXED**: Simplified the type to ensure this map only contains base theme names.
const TASK_THEME_MAP: Record<string, keyof typeof themes> = {
  "🌞 Wake Up Slowly": "pikachu",
  "💧 Drink Warm Water": "squirtle",
  "🧘 Light Stretching or Yoga": "dragonite",
  "🍵 Herbal Tea & Journaling": "mew",
  "🥣 Healthy Breakfast": "slowpoke",
  "📚 Learn Something Calm": "psyduck",
  "🥗 Light Lunch": "charizard",
  "🌿 Nature Walk or Break": "bulbasaur",
  "📝 Reflect on the Day": "meowth",
  "🍽 Light Dinner": "jigglypuff",
  "🌙 Prepare for Sleep": "gengar",
  "🛌 Sleep Early": "snorlax",
};

// ... rest of the file is unchanged ...
const useCurrentTime = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return time;
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const getCurrentTask = (now: Date): string => {
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const currentTask = REVERSED_ROUTINE.find(r => currentHour >= r.hour)?.task;
  return currentTask || "🌸 Just Breathe";
};

const getStyles = (theme: Theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  time: {
    fontSize: 64,
    color: theme.colors.primary,
    marginBottom: 24,
    fontFamily: theme.fonts.bold,
    letterSpacing: -2
  },
  taskContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  taskLabel: {
    fontSize: 14,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.medium,
    marginBottom: theme.spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  task: {
    fontSize: 20,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    textAlign: "center"
  },
  imageContainer: {
    marginBottom: theme.spacing.xl
  },
  taskImage: {
    width: 140,
    height: 180
  },
  quote: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    fontStyle: 'italic',
    color: theme.colors.secondary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    opacity: 0.8
  },
  startButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: 24
  },
  startButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9
  },
  startButtonText: {
    fontSize: 18,
    letterSpacing: 0.5
  },
});

function HomeScreen() {
  const router = useRouter();
  const currentTime = useCurrentTime();
  const { theme, themeName, changeTheme } = useTheme();

  const formattedTime = useMemo(() => formatTime(currentTime), [currentTime]);
  const currentTask = useMemo(() => getCurrentTask(currentTime), [currentTime]);
  const taskImage = useMemo(() => TASK_IMAGES[currentTask], [currentTask]);
  const styles = useMemo(() => getStyles(theme), [theme]);
  const sharedStyles = useMemo(() => getSharedStyles(theme), [theme]);

  useEffect(() => {
    const isLightMode = themeName.startsWith('light-');
    const newBaseTheme = TASK_THEME_MAP[currentTask] || 'default';

    let newThemeName: ThemeName = newBaseTheme;
    if (isLightMode && newBaseTheme !== 'default') {
      newThemeName = `light-${newBaseTheme}`;
    }

    const currentBaseTheme = isLightMode ? themeName.substring(6) : themeName;
    if (newBaseTheme !== currentBaseTheme) {
      changeTheme(newThemeName);
    }
  }, [currentTask, themeName, changeTheme]);

  const breatheScale = useSharedValue(1);

  useEffect(() => {
    breatheScale.value = withRepeat(
      withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [breatheScale]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breatheScale.value }],
  }));

  const handleStartDay = useCallback(() => {
    router.push("/routine");
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={sharedStyles.centeredContainer}>
          <Animated.Text entering={FadeIn.duration(800)} style={styles.time}>
            {formattedTime}
          </Animated.Text>

          <Animated.View entering={FadeIn.duration(600).delay(200)} style={styles.taskContainer}>
            <Text style={styles.taskLabel}>Current Focus</Text>
            <Text style={styles.task}>{currentTask}</Text>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(800).delay(400)} style={[styles.imageContainer, animatedImageStyle]}>
            {taskImage && (
              <Animated.Image
                source={taskImage}
                style={styles.taskImage}
                resizeMode="contain"
              />
            )}
          </Animated.View>

          <Animated.Text entering={FadeIn.duration(600).delay(600)} style={styles.quote}>
            "Start your day with calm"
          </Animated.Text>

          <Animated.View entering={FadeIn.duration(600).delay(800)}>
            <Pressable
              style={({ pressed }) => [
                sharedStyles.primaryButton,
                styles.startButton,
                pressed && styles.startButtonPressed
              ]}
              onPress={handleStartDay}
            >
              <Text style={[sharedStyles.primaryButtonText, styles.startButtonText]}>
                Start My Day
              </Text>
            </Pressable>
          </Animated.View>
        </View>
        
        <AiSuggestions currentTask={currentTask} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;