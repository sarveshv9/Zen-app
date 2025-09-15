import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import AiSuggestions from "./components/AiSuggestions";
import { sharedStyles, theme } from "./styles/shared";

// Types
interface RoutineItem {
  hour: number;
  task: string;
}

interface TaskImage {
  [key: string]: any;
}

// Constants
const ROUTINE: RoutineItem[] = [
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

const TASK_IMAGES: TaskImage = {
  "🌞 Wake Up Slowly": require("./assets/images/pixel/wakeup.png"),
  "💧 Drink Warm Water": require("./assets/images/pixel/water.png"),
  "🧘 Light Stretching or Yoga": require("./assets/images/pixel/yoga.png"),
  "🍵 Herbal Tea & Journaling": require("./assets/images/pixel/tea_journal.png"), 
  "🥣 Healthy Breakfast": require("./assets/images/pixel/breakfast.png"),
  "📚 Learn Something Calm": require("./assets/images/pixel/study.png"), 
  "🥗 Light Lunch": require("./assets/images/pixel/lunch.png"), 
  "🌿 Nature Walk or Break": require("./assets/images/pixel/walk.png"), 
  "📝 Reflect on the Day": require("./assets/images/pixel/reflect.png"), 
  "🍽 Light Dinner": require("./assets/images/pixel/dinner.png"),
  "🌙 Prepare for Sleep": require("./assets/images/pixel/prepare_sleep.png"), 
  "🛌 Sleep Early": require("./assets/images/pixel/sleep.png"),
};

// Sample todo tasks - replace this with your actual state management
const SAMPLE_TASKS = [
  "Complete quarterly report",
  "Call dentist for appointment",
  "Buy groceries for the week",
  "Review project proposals",
  "Exercise for 30 minutes",
];

// Utility functions
const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${formattedMinutes} ${ampm}`;
};

const getCurrentTask = (now: Date): string => {
  const currentHour = now.getHours() + (now.getMinutes() / 60);
  const task = [...ROUTINE]
    .reverse()
    .find((r) => currentHour >= r.hour)?.task;
  
  return task || "🌸 Just Breathe";
};

// Custom hook for time updates
const useCurrentTime = () => {
  const [time, setTime] = useState(() => new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return time;
};

export default function HomeScreen() {
  const router = useRouter();
  const currentTime = useCurrentTime();
  
  // Todo tasks state - replace this with your actual todo state management
  const [todoTasks, setTodoTasks] = useState<string[]>(SAMPLE_TASKS);
  
  // Memoized values
  const formattedTime = useMemo(() => formatTime(currentTime), [currentTime]);
  const currentTask = useMemo(() => getCurrentTask(currentTime), [currentTime]);
  const taskImage = useMemo(() => TASK_IMAGES[currentTask], [currentTask]);
  
  // Subtle breathing animation for the image
  const breatheScale = useSharedValue(1);
  
  useEffect(() => {
    breatheScale.value = withRepeat(
      withTiming(1.05, {
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
      }),
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
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={sharedStyles.centeredContainer}>
          <Animated.Text 
            entering={FadeIn.duration(800)}
            style={styles.time}
          >
            {formattedTime}
          </Animated.Text>
          
          <Animated.View
            entering={FadeIn.duration(600).delay(200)}
            exiting={FadeOut.duration(300)}
            style={styles.taskContainer}
          >
            <Text style={styles.taskLabel}>Current Focus</Text>
            <Text style={styles.task}>{currentTask}</Text>
          </Animated.View>
          
          <Animated.View
            entering={FadeIn.duration(800).delay(400)}
            style={[styles.imageContainer, animatedImageStyle]}
          >
            {taskImage && (
              <Animated.Image 
                source={taskImage} 
                style={styles.taskImage} 
                resizeMode="contain" 
              />
            )}
          </Animated.View>
          
          <Animated.Text 
            entering={FadeIn.duration(600).delay(600)}
            style={styles.quote}
          >
            "Start your day with calm"
          </Animated.Text>
          
          <Animated.View
            entering={FadeIn.duration(600).delay(800)}
          >
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
        
        {/* AI Suggestions Component */}
        <AiSuggestions currentTask={currentTask} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  time: {
    fontSize: 64,
    fontWeight: "300",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xxl,
    fontFamily: theme.fonts.bold,
    letterSpacing: -2,
  },
  taskContainer: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    alignItems: "center",
    maxWidth: "90%",
    ...theme.shadows.soft,
  },
  taskLabel: {
    fontSize: 14,
    color: theme.colors.secondary,
    fontFamily: theme.fonts.medium,
    marginBottom: theme.spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  task: {
    fontSize: 20,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    textAlign: "center",
  },
  imageContainer: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
  },
  taskImage: {
    width: 140,
    height: 180,
  },
  quote: {
    fontSize: 16,
    fontFamily: theme.fonts.lightItalic,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    opacity: 0.8,
  },
  startButton: {
    marginTop: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xxl,
    transform: [{ scale: 1 }],
  },
  startButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  startButtonText: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
});