import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { sharedStyles, theme } from "./styles/shared";

// Types
interface RoutineItem {
  id: string;
  time: string;
  task: string;
  description: string;
  image: any;
  insertionOrder?: number; // For maintaining order when times are identical
}

interface FormData {
  time: string;
  task: string;
  description: string;
}

// Constants
const DEFAULT_IMAGE = require("../assets/images/pixel/breathe.png");
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const INITIAL_ROUTINE: RoutineItem[] = [
  {
    id: '1',
    time: "6:00 AM",
    task: "🌞 Wake Up Slowly",
    description: "Start your day gently with deep breaths and soft music.",
    image: require("../assets/images/pixel/wakeup.png"),
    insertionOrder: 1,
  },
  {
    id: '2',
    time: "6:30 AM", 
    task: "💧 Drink Warm Water",
    description: "Rehydrate your body with a glass of warm water.",
    image: require("../assets/images/pixel/water.png"),
    insertionOrder: 2,
  },
  {
    id: '3',
    time: "7:00 AM",
    task: "🧘 Light Stretching or Yoga",
    description: "Do light stretching to wake up your body and mind.",
    image: require("../assets/images/pixel/yoga.png"),
    insertionOrder: 3,
  },
  {
    id: '4',
    time: "8:00 AM",
    task: "🍵 Herbal Tea & Journaling",
    description: "Sip calming tea and write down your morning thoughts.",
    image: require("../assets/images/pixel/tea_journal.png"),
    insertionOrder: 4,
  },
  {
    id: '5',
    time: "9:00 AM",
    task: "🥣 Healthy Breakfast",
    description: "Enjoy a nutritious breakfast to energize your day.",
    image: require("../assets/images/pixel/breakfast.png"),
    insertionOrder: 5,
  },
  {
    id: '6',
    time: "10:00 AM",
    task: "📚 Learn Something Calm",
    description: "Read or listen to something inspiring or informative.",
    image: require("../assets/images/pixel/study.png"),
    insertionOrder: 6,
  },
  {
    id: '7',
    time: "1:00 PM",
    task: "🥗 Light Lunch",
    description: "Eat a balanced lunch to keep your energy steady.",
    image: require("../assets/images/pixel/lunch.png"),
    insertionOrder: 7,
  },
  {
    id: '8',
    time: "3:00 PM",
    task: "🌿 Nature Walk or Break",
    description: "Take a peaceful walk or simply relax and breathe.",
    image: require("../assets/images/pixel/walk.png"),
    insertionOrder: 8,
  },
  {
    id: '9',
    time: "5:00 PM",
    task: "📔 Reflect on the Day",
    description: "Take a moment to write or think about your day so far.",
    image: require("../assets/images/pixel/reflect.png"),
    insertionOrder: 9,
  },
  {
    id: '10',
    time: "7:00 PM",
    task: "🍽 Light Dinner",
    description: "Have a light, comforting dinner to wind down.",
    image: require("../assets/images/pixel/dinner.png"),
    insertionOrder: 10,
  },
  {
    id: '11',
    time: "9:00 PM",
    task: "🌙 Prepare for Sleep",
    description: "Dim the lights, calm your mind, and slow down.",
    image: require("../assets/images/pixel/prepare_sleep.png"),
    insertionOrder: 11,
  },
  {
    id: '12',
    time: "10:00 PM",
    task: "🛌 Sleep Early",
    description: "Go to bed early for deep, restorative sleep.",
    image: require("../assets/images/pixel/sleep.png"),
    insertionOrder: 12,
  },
];

// Utility functions for time sorting
const parseTime = (timeStr: string): { hours: number; minutes: number; isValid: boolean } => {
  if (!timeStr || typeof timeStr !== 'string') {
    return { hours: 0, minutes: 0, isValid: false };
  }

  // Remove extra whitespace and normalize
  const cleanTime = timeStr.trim().toUpperCase();
  
  // Match various time formats
  // Examples: "6:00 AM", "06:00", "6 AM", "18:00", "6:30 PM"
  const timeRegex = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/;
  const match = cleanTime.match(timeRegex);
  
  if (!match) {
    return { hours: 0, minutes: 0, isValid: false };
  }
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2] || '0', 10);
  const ampm = match[3];
  
  // Validate basic ranges
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return { hours: 0, minutes: 0, isValid: false };
  }
  
  // Handle 12-hour format conversion
  if (ampm) {
    if (hours < 1 || hours > 12) {
      return { hours: 0, minutes: 0, isValid: false };
    }
    
    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
  }
  
  return { hours, minutes, isValid: true };
};

const timeToMinutes = (timeStr: string): number => {
  const { hours, minutes, isValid } = parseTime(timeStr);
  if (!isValid) {
    return Number.MAX_SAFE_INTEGER; // Invalid times go to the end
  }
  return hours * 60 + minutes;
};

const sortRoutineItems = (items: RoutineItem[]): RoutineItem[] => {
  return [...items].sort((a, b) => {
    const timeA = timeToMinutes(a.time);
    const timeB = timeToMinutes(b.time);
    
    // If times are different, sort by time
    if (timeA !== timeB) {
      return timeA - timeB;
    }
    
    // If times are the same (or both invalid), sort by insertion order
    const orderA = a.insertionOrder || 0;
    const orderB = b.insertionOrder || 0;
    return orderA - orderB;
  });
};

// Custom hooks
const useModalAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const animatedStyle = useMemo(
    () => ({
      transform: [{ translateX }, { translateY }, { scale: scaleAnim }],
    }),
    [translateX, translateY, scaleAnim]
  );

  const openAnimation = useCallback((x: number, y: number) => {
    translateX.setValue(x - SCREEN_WIDTH / 2);
    translateY.setValue(y - SCREEN_HEIGHT / 2);
    scaleAnim.setValue(0);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, translateY, scaleAnim]);

  const closeAnimation = useCallback((onComplete: () => void) => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.back(1.2)),
      useNativeDriver: true,
    }).start(onComplete);
  }, [scaleAnim]);

  return { animatedStyle, openAnimation, closeAnimation };
};

// Components
const RoutineCard: React.FC<{
  item: RoutineItem;
  onPress: (item: RoutineItem, x: number, y: number) => void;
}> = ({ item, onPress }) => {
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });

  return (
    <Pressable
      onPressIn={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        setTouchPosition({ x: pageX, y: pageY });
      }}
      onPress={() => onPress(item, touchPosition.x, touchPosition.y)}
      style={({ pressed }) => [
        sharedStyles.card,
        styles.routineCard,
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardTime}>{item.time}</Text>
          <Text style={styles.cardTask}>{item.task}</Text>
        </View>
        <View style={styles.cardIndicator} />
      </View>
    </Pressable>
  );
};

const TaskModal: React.FC<{
  visible: boolean;
  task: RoutineItem | null;
  animatedStyle: any;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ visible, task, animatedStyle, onClose, onEdit, onDelete }) => {
  if (!task) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={sharedStyles.modalOverlay}>
        <Animated.View style={[sharedStyles.modalContent, animatedStyle]}>
          <Image
            source={task.image}
            style={styles.modalImage}
            resizeMode="contain"
          />
          <Text style={styles.modalTitle}>{task.task}</Text>
          <Text style={styles.modalDescription}>{task.description}</Text>
          
          <View style={styles.modalActions}>
            <Pressable style={styles.modalButton} onPress={onEdit}>
              <Text style={styles.modalButtonText}>Edit</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.deleteButton]} onPress={onDelete}>
              <Text style={[styles.modalButtonText, styles.deleteButtonText]}>Delete</Text>
            </Pressable>
          </View>
          
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const TaskForm: React.FC<{
  visible: boolean;
  isEditing: boolean;
  formData: FormData;
  onUpdateField: (field: keyof FormData, value: string) => void;
  onSave: () => void;
  onClose: () => void;
}> = ({ visible, isEditing, formData, onUpdateField, onSave, onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={sharedStyles.modalOverlay}>
      <View style={[sharedStyles.modalContent, styles.formContent]}>
        <Text style={styles.formTitle}>
          {isEditing ? "Edit Task" : "Add New Task"}
        </Text>
        
        <TextInput
          style={sharedStyles.input}
          value={formData.time}
          onChangeText={(text) => onUpdateField("time", text)}
          placeholder="Time (e.g., 6:00 AM)"
          placeholderTextColor="#999"
        />
        <TextInput
          style={sharedStyles.input}
          value={formData.task}
          onChangeText={(text) => onUpdateField("task", text)}
          placeholder="Task name (with emoji)"
          placeholderTextColor="#999"
        />
        <TextInput
          style={[sharedStyles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => onUpdateField("description", text)}
          placeholder="Task description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
        
        <View style={styles.formActions}>
          <Pressable style={sharedStyles.secondaryButton} onPress={onSave}>
            <Text style={sharedStyles.secondaryButtonText}>Save</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

// Main component
export default function RoutineScreen() {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>(INITIAL_ROUTINE);
  const [selectedTask, setSelectedTask] = useState<RoutineItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    time: "",
    task: "",
    description: "",
  });
  const [nextInsertionOrder, setNextInsertionOrder] = useState(13); // Start after initial items

  const { animatedStyle, openAnimation, closeAnimation } = useModalAnimation();

  // Memoized sorted routine items
  const sortedRoutineItems = useMemo(() => {
    return sortRoutineItems(routineItems);
  }, [routineItems]);

  // Modal handlers
  const openModal = useCallback((task: RoutineItem, x: number, y: number) => {
    setSelectedTask(task);
    setModalVisible(true);
    openAnimation(x, y);
  }, [openAnimation]);

  const closeModal = useCallback(() => {
    closeAnimation(() => {
      setModalVisible(false);
      setSelectedTask(null);
    });
  }, [closeAnimation]);

  // Form handlers
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
      // Editing existing task
      setRoutineItems(prev => 
        prev.map(item => {
          if (item.id === editingId) {
            return {
              ...item,
              time: time.trim(),
              task: task.trim(),
              description: description.trim(),
              // Keep original insertion order when editing
            };
          }
          return item;
        })
      );
    } else {
      // Adding new task
      const newItem: RoutineItem = {
        id: Date.now().toString(),
        time: time.trim(),
        task: task.trim(),
        description: description.trim(),
        image: DEFAULT_IMAGE,
        insertionOrder: nextInsertionOrder,
      };
      
      setRoutineItems(prev => [...prev, newItem]);
      setNextInsertionOrder(prev => prev + 1);
    }
    
    closeForm();
  }, [formData, editingId, nextInsertionOrder, closeForm]);

  const handleDelete = useCallback(() => {
    if (!selectedTask) {
      console.log("No selected task for deletion");
      return;
    }
    
    const taskToDelete = selectedTask; // Capture the task reference
    console.log("Attempting to delete task:", taskToDelete.id, taskToDelete.task);
    
    Alert.alert(
      "Delete Task",
      `Are you sure you want to remove "${taskToDelete.task}" from your routine?`,
      [
        { 
          text: "Cancel", 
          style: "cancel",
          onPress: () => console.log("Delete cancelled")
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Delete confirmed for task:", taskToDelete.id);
            
            // Update state immediately with explicit filtering
            setRoutineItems(currentItems => {
              console.log("Current items before filter:", currentItems.map(item => `${item.id}: ${item.task}`));
              
              const filteredItems = currentItems.filter(item => {
                const shouldKeep = item.id !== taskToDelete.id;
                console.log(`Item ${item.id} (${item.task}): ${shouldKeep ? 'KEEP' : 'DELETE'}`);
                return shouldKeep;
              });
              
              console.log("Items after deletion:", filteredItems.length);
              console.log("Remaining items:", filteredItems.map(item => `${item.id}: ${item.task}`));
              
              return filteredItems;
            });
            
            // Close modal after state update
            setTimeout(() => {
              closeModal();
            }, 50);
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
    setFormData(prev => ({ ...prev, [field]: value }));
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
            sharedStyles.secondaryButton,
            styles.addButton,
            pressed && styles.addButtonPressed
          ]} 
          onPress={() => openForm()}
        >
          <Text style={[sharedStyles.secondaryButtonText, styles.addButtonText]}>
            + Add New Task
          </Text>
        </Pressable>

        <View style={styles.routineList}>
          {sortedRoutineItems.map((item, index) => (
            <RoutineCard
              key={item.id}
              item={item}
              onPress={openModal}
            />
          ))}
        </View>

        <Pressable 
          style={({ pressed }) => [
            sharedStyles.primaryButton,
            styles.backButton,
            pressed && styles.backButtonPressed
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
  addButton: {
    marginBottom: theme.spacing.xl,
    transform: [{ scale: 1 }],
  },
  addButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  addButtonText: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  routineList: {
    marginBottom: theme.spacing.xl,
  },
  routineCard: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    transform: [{ scale: 1 }],
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flex: 1,
  },
  cardTime: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.fonts.medium,
    opacity: 0.8,
  },
  cardTask: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },
  cardIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    opacity: 0.6,
  },
  backButton: {
    marginTop: theme.spacing.lg,
    transform: [{ scale: 1 }],
  },
  backButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    fontFamily: theme.fonts.bold,
  },
  modalDescription: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
    lineHeight: 24,
    fontFamily: theme.fonts.regular,
    opacity: 0.9,
  },
  modalActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
  },
  modalButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: theme.fonts.bold,
  },
  deleteButtonText: {
    color: theme.colors.white,
  },
  closeButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  closeButtonText: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
  },
  formContent: {
    width: "90%",
    maxWidth: 400,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xl,
    textAlign: "center",
    fontFamily: theme.fonts.bold,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: theme.fonts.medium,
  },
});