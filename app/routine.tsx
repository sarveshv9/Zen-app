// src/routine.tsx
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RoutineCard from "./components/RoutineCard";
import TaskForm from "./components/TaskForm";
import TaskModal from "./components/TaskModal";
import { sharedStyles, theme } from "./styles/shared";
import { FormData, RoutineItem, sortRoutineItems } from "./utils/utils";

// Types
export { FormData, RoutineItem };

// Constants
const DEFAULT_IMAGE = require("./assets/images/pixel/breathe.png");
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const INITIAL_ROUTINE: RoutineItem[] = [
  {
    id: "1",
    time: "6:00 AM",
    task: "🌞 Wake Up Slowly",
    description: "Start your day gently with deep breaths and soft music.",
    image: require("./assets/images/pixel/wakeup.png"),
    insertionOrder: 1,
  },
  {
    id: "2",
    time: "6:30 AM",
    task: "💧 Drink Warm Water",
    description: "Rehydrate your body with a glass of warm water.",
    image: require("./assets/images/pixel/water.png"),
    insertionOrder: 2,
  },
  {
    id: "3",
    time: "7:00 AM",
    task: "🧘 Light Stretching or Yoga",
    description: "Do light stretching to wake up your body and mind.",
    image: require("./assets/images/pixel/yoga.png"),
    insertionOrder: 3,
  },
  {
    id: "4",
    time: "8:00 AM",
    task: "🍵 Herbal Tea & Journaling",
    description: "Sip calming tea and write down your morning thoughts.",
    image: require("./assets/images/pixel/tea_journal.png"),
    insertionOrder: 4,
  },
  {
    id: "5",
    time: "9:00 AM",
    task: "🥣 Healthy Breakfast",
    description: "Enjoy a nutritious breakfast to energize your day.",
    image: require("./assets/images/pixel/breakfast.png"),
    insertionOrder: 5,
  },
  {
    id: "6",
    time: "10:00 AM",
    task: "📚 Learn Something Calm",
    description: "Read or listen to something inspiring or informative.",
    image: require("./assets/images/pixel/study.png"),
    insertionOrder: 6,
  },
  {
    id: "7",
    time: "1:00 PM",
    task: "🥗 Light Lunch",
    description: "Eat a balanced lunch to keep your energy steady.",
    image: require("./assets/images/pixel/lunch.png"),
    insertionOrder: 7,
  },
  {
    id: "8",
    time: "3:00 PM",
    task: "🌿 Nature Walk or Break",
    description: "Take a peaceful walk or simply relax and breathe.",
    image: require("./assets/images/pixel/walk.png"),
    insertionOrder: 8,
  },
  {
    id: "9",
    time: "5:00 PM",
    task: "📔 Reflect on the Day",
    description: "Take a moment to write or think about your day so far.",
    image: require("./assets/images/pixel/reflect.png"),
    insertionOrder: 9,
  },
  {
    id: "10",
    time: "7:00 PM",
    task: "🍽 Light Dinner",
    description: "Have a light, comforting dinner to wind down.",
    image: require("./assets/images/pixel/dinner.png"),
    insertionOrder: 10,
  },
  {
    id: "11",
    time: "9:00 PM",
    task: "🌙 Prepare for Sleep",
    description: "Dim the lights, calm your mind, and slow down.",
    image: require("./assets/images/pixel/prepare_sleep.png"),
    insertionOrder: 11,
  },
  {
    id: "12",
    time: "10:00 PM",
    task: "🛌 Sleep Early",
    description: "Go to bed early for deep, restorative sleep.",
    image: require("./assets/images/pixel/sleep.png"),
    insertionOrder: 12,
  },
];

// Enhanced Modal Animation Hook
const useModalAnimation = () => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const translateX = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  const animatedStyle = useMemo(
    () => ({
      transform: [{ translateX }, { translateY }, { scale: scaleAnim }],
    }),
    [translateX, translateY, scaleAnim]
  );

  const openAnimation = useCallback(
    (x: number, y: number) => {
      translateX.setValue(x - SCREEN_WIDTH / 2);
      translateY.setValue(y - SCREEN_HEIGHT / 2);
      scaleAnim.setValue(0);

      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    },
    [translateX, translateY, scaleAnim]
  );

  const closeAnimation = useCallback(
    (onComplete: () => void) => {
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start(onComplete);
    },
    [scaleAnim]
  );

  return { animatedStyle, openAnimation, closeAnimation };
};

export default function RoutineScreen() {
  const [routineItems, setRoutineItems] =
    useState<RoutineItem[]>(INITIAL_ROUTINE);
  const [selectedTask, setSelectedTask] = useState<RoutineItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    time: "",
    task: "",
    description: "",
  });
  const [nextInsertionOrder, setNextInsertionOrder] = useState(13);

  const { animatedStyle, openAnimation, closeAnimation } = useModalAnimation();

  const sortedRoutineItems = useMemo(() => {
    return sortRoutineItems(routineItems);
  }, [routineItems]);

  const openModal = useCallback(
    (task: RoutineItem, x: number, y: number) => {
      setSelectedTask(task);
      setModalVisible(true);
      openAnimation(x, y);
    },
    [openAnimation]
  );

  const closeModal = useCallback(() => {
    closeAnimation(() => {
      setModalVisible(false);
      setSelectedTask(null);
    });
  }, [closeAnimation]);

  const openForm = useCallback((item?: RoutineItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        time: item.time,
        task: item.task,
        description: item.description,
      });
    } else {
      setEditingId(null);
      setFormData({ time: "", task: "", description: "" });
    }
    setFormVisible(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormVisible(false);
    setEditingId(null);
    setFormData({ time: "", task: "", description: "" });
  }, []);

  const handleSave = useCallback(() => {
    const { time, task, description } = formData;

    if (!time.trim() || !task.trim() || !description.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields to continue");
      return;
    }

    if (editingId) {
      setRoutineItems((prev) =>
        prev.map((item) => {
          if (item.id === editingId) {
            return {
              ...item,
              time: time.trim(),
              task: task.trim(),
              description: description.trim(),
            };
          }
          return item;
        })
      );
    } else {
      const newItem: RoutineItem = {
        id: Date.now().toString(),
        time: time.trim(),
        task: task.trim(),
        description: description.trim(),
        image: DEFAULT_IMAGE,
        insertionOrder: nextInsertionOrder,
      };

      setRoutineItems((prev) => [...prev, newItem]);
      setNextInsertionOrder((prev) => prev + 1);
    }

    closeForm();
  }, [formData, editingId, nextInsertionOrder, closeForm]);

  const handleDelete = useCallback(() => {
    if (!selectedTask) return;

    const taskToDelete = selectedTask;

    Alert.alert(
      "Delete Task",
      `Remove "${taskToDelete.task}" from your routine?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setRoutineItems((currentItems) =>
              currentItems.filter((item) => item.id !== taskToDelete.id)
            );
            setTimeout(() => closeModal(), 50);
          },
        },
      ],
      { cancelable: true }
    );
  }, [selectedTask, closeModal]);

  const handleEditFromModal = useCallback(() => {
    if (selectedTask) {
      closeModal();
      setTimeout(() => openForm(selectedTask), 300);
    }
  }, [selectedTask, closeModal, openForm]);

  const updateFormField = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBackHome = useCallback(() => {
    router.push("/");
  }, []);

  return (
    <View style={sharedStyles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[sharedStyles.heading, styles.heading]}>🧘 Zen Routine</Text>
        <Pressable
          style={({ pressed }) => [
            styles.enhancedAddButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={() => openForm()}
        >
          <Text style={styles.enhancedAddButtonText}>+ Add New Task</Text>
        </Pressable>
        <View style={styles.routineList}>
          {sortedRoutineItems.map((item) => (
            <RoutineCard key={item.id} item={item} onPress={openModal} />
          ))}
        </View>
        <Pressable
          style={({ pressed }) => [
            sharedStyles.primaryButton,
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={handleBackHome}
        >
          <Text style={sharedStyles.primaryButtonText}>← Back to Home</Text>
        </Pressable>
      </ScrollView>

      <TaskModal
        visible={modalVisible}
        task={selectedTask}
        animatedStyle={animatedStyle}
        onClose={closeModal}
        onEdit={handleEditFromModal}
        onDelete={handleDelete}
      />

      <TaskForm
        visible={formVisible}
        isEditing={!!editingId}
        formData={formData}
        onUpdateField={updateFormField}
        onSave={handleSave}
        onClose={closeForm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.xl,
  },
  heading: {
    marginBottom: theme.spacing.xl,
    letterSpacing: 1,
  },
  enhancedAddButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    borderStyle: "dashed",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.8,
  },
  enhancedAddButtonText: {
    fontSize: 16,
    color: theme.colors.secondary,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  routineList: {
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  backButton: {
    marginTop: theme.spacing.lg,
  },
  backButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});