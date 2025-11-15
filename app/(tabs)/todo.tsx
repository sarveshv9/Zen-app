import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSharedStyles, Theme } from "../../constants/shared";
import { useTheme } from "../../context/ThemeContext";

// Constants
const STORAGE_KEY = "@todo_tasks";

// Types
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // Changed to string for JSON serialization
  category: "today" | "later";
}

type TaskCategory = Task["category"];

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  theme: Theme;
}

interface TaskModalProps {
  visible: boolean;
  task: Task | null;
  onSave: (text: string, category: TaskCategory) => void;
  onClose: () => void;
  theme: Theme;
}

// Helper Functions
const generateTaskId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const createNewTask = (text: string, category: TaskCategory): Task => ({
  id: generateTaskId(),
  text,
  completed: false,
  createdAt: new Date().toISOString(),
  category,
});

// Storage Functions
const loadTasks = async (): Promise<Task[]> => {
  try {
    const tasksJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (tasksJson) {
      return JSON.parse(tasksJson);
    }
    return [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

// Task Item Component
const TaskItem = React.memo<TaskItemProps>(
  ({ task, onToggle, onEdit, onDelete, theme }) => {
    const styles = useMemo(() => getStyles(theme), [theme]);

    const handleDelete = useCallback(() => {
      // --- MODIFICATION ---
      // Delete directly instead of showing an alert
      onDelete(task.id);
      // --------------------
    }, [task.id, onDelete]); // No longer needs task.text

    const iconName = task.completed ? "checkmark-circle" : "ellipse-outline";
    const iconColor = task.completed
      ? theme.colors.primary
      : theme.colors.secondary;

    return (
      <View style={styles.taskItemWrapper}>
        <Pressable
          style={styles.taskItemContainer}
          onPress={() => onToggle(task.id)}
        >
          <Ionicons name={iconName} size={24} color={iconColor} />
          <Text
            style={[
              styles.taskItemText,
              task.completed && styles.taskItemTextDone,
            ]}
          >
            {task.text}
          </Text>
        </Pressable>

        <View style={styles.taskActions}>
          <Pressable
            style={styles.taskActionButton}
            onPress={() => onEdit(task)}
          >
            <Ionicons name="pencil" size={18} color={theme.colors.secondary} />
          </Pressable>
          <Pressable style={styles.taskActionButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#e57373" />
          </Pressable>
        </View>
      </View>
    );
  }
);

TaskItem.displayName = "TaskItem";

// Task Modal Component
const TaskModal = React.memo<TaskModalProps>(
  ({ visible, task, onSave, onClose, theme }) => {
    const styles = useMemo(() => getStyles(theme), [theme]);
    const [taskText, setTaskText] = useState("");
    const [category, setCategory] = useState<TaskCategory>("today");

    const isEditing = !!task;

    // Reset modal state when visibility changes
    useEffect(() => {
      if (visible) {
        if (task) {
          setTaskText(task.text);
          setCategory(task.category);
        } else {
          setTaskText("");
          setCategory("today");
        }
      }
    }, [visible, task]);

    const handleSave = useCallback(() => {
      const trimmedText = taskText.trim();
      if (!trimmedText) {
        Alert.alert("Error", "Please enter a task description");
        return;
      }
      onSave(trimmedText, category);
    }, [taskText, category, onSave]);

    const handleCategoryPress = useCallback((newCategory: TaskCategory) => {
      setCategory(newCategory);
    }, []);

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.modalOverlayPressable} onPress={onClose}>
            <Pressable
              style={styles.modalContainer}
              onPress={(e) => e.stopPropagation()}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.modalTitle}>
                  {isEditing ? "Edit Task" : "Add New Task"}
                </Text>

                <TextInput
                  style={styles.taskInput}
                  placeholder="What do you want to accomplish?"
                  placeholderTextColor={theme.colors.secondary}
                  value={taskText}
                  onChangeText={setTaskText}
                  multiline
                  autoFocus
                  maxLength={500}
                />

                <Text style={styles.categoryLabel}>Category</Text>
                <View style={styles.categoryContainer}>
                  <Pressable
                    style={[
                      styles.categoryButton,
                      category === "today" && styles.categoryButtonActive,
                    ]}
                    onPress={() => handleCategoryPress("today")}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === "today" && styles.categoryButtonTextActive,
                      ]}
                    >
                      Today's Focus
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.categoryButton,
                      category === "later" && styles.categoryButtonActive,
                    ]}
                    onPress={() => handleCategoryPress("later")}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === "later" && styles.categoryButtonTextActive,
                      ]}
                    >
                      Later
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={onClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <Text style={styles.saveButtonText}>
                      {isEditing ? "Update" : "Add Task"}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

TaskModal.displayName = "TaskModal";

// Task Section Component
const TaskSection = React.memo<{
  title: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  theme: Theme;
}>(({ title, tasks, onToggle, onEdit, onDelete, theme }) => {
  const styles = useMemo(() => getStyles(theme), [theme]);

  if (tasks.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          theme={theme}
        />
      ))}
    </View>
  );
});

TaskSection.displayName = "TaskSection";

// Empty State Component
const EmptyState = React.memo<{ styles: any }>(({ styles }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyStateText}>📋</Text>
    <Text style={styles.emptyStateTitle}>No tasks yet</Text>
    <Text style={styles.emptyStateSubtitle}>
      Tap "Add New Task" to get started with your productivity journey
    </Text>
  </View>
));

EmptyState.displayName = "EmptyState";

// Main Component
export default function TodoScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const sharedStyles = useMemo(() => getSharedStyles(theme), [theme]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load tasks on mount
  useEffect(() => {
    const initializeTasks = async () => {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
      setIsLoading(false);
    };
    initializeTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  // Computed values
  const { todayTasks, laterTasks, completedCount, totalCount } = useMemo(() => {
    const today = tasks.filter((task) => task.category === "today");
    const later = tasks.filter((task) => task.category === "later");
    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;

    return {
      todayTasks: today,
      laterTasks: later,
      completedCount: completed,
      totalCount: total,
    };
  }, [tasks]);

  // Modal handlers
  const openAddModal = useCallback(() => {
    setEditingTask(null);
    setModalVisible(true);
  }, []);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingTask(null);
  }, []);

  // Task handlers
  const handleSaveTask = useCallback(
    (text: string, category: TaskCategory) => {
      if (editingTask) {
        // Update existing task
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTask.id ? { ...task, text, category } : task
          )
        );
      } else {
        // Add new task
        setTasks((prev) => [...prev, createNewTask(text, category)]);
      }
      closeModal();
    },
    [editingTask, closeModal]
  );

  const handleToggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    // Cleaned up - no logs
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const handleClearCompleted = useCallback(() => {
    if (completedCount === 0) {
      Alert.alert(
        "No completed tasks",
        "There are no completed tasks to clear"
      );
      return;
    }

    Alert.alert(
      "Clear Completed",
      `Remove ${completedCount} completed task${
        completedCount === 1 ? "" : "s"
      }?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () =>
            setTasks((prev) => prev.filter((task) => !task.completed)),
        },
      ]
    );
  }, [completedCount]);

  const hasCompletedTasks = totalCount > 0 && completedCount > 0;

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={sharedStyles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[sharedStyles.heading, styles.heading]}>
            ✅ My Tasks
          </Text>
          {totalCount > 0 && (
            <Text style={styles.progressText}>
              {completedCount}/{totalCount} completed
            </Text>
          )}
        </View>

        {/* Add Task Button */}
        <Pressable
          style={({ pressed }) => [
            styles.enhancedAddButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={openAddModal}
        >
          <Ionicons name="add" size={24} color={theme.colors.secondary} />
          <Text style={styles.enhancedAddButtonText}>Add New Task</Text>
        </Pressable>

        {/* Clear Completed Button */}
        {hasCompletedTasks && (
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleClearCompleted}
          >
            <Text style={styles.clearButtonText}>
              Clear Completed ({completedCount})
            </Text>
          </Pressable>
        )}

        {/* Task Sections */}
        <TaskSection
          title="Today's Focus"
          tasks={todayTasks}
          onToggle={handleToggleTask}
          onEdit={openEditModal}
          onDelete={handleDeleteTask}
          theme={theme}
        />

        <TaskSection
          title="Later"
          tasks={laterTasks}
          onToggle={handleToggleTask}
          onEdit={openEditModal}
          onDelete={handleDeleteTask}
          theme={theme}
        />

        {/* Empty State */}
        {totalCount === 0 && <EmptyState styles={styles} />}
      </ScrollView>

      {/* Task Modal */}
      <TaskModal
        visible={modalVisible}
        task={editingTask}
        onSave={handleSaveTask}
        onClose={closeModal}
        theme={theme}
      />
    </SafeAreaView>
  );
}

// Styles
const getStyles = (theme: Theme) =>
  StyleSheet.create({
    scrollContainer: { flex: 1 },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: 60,
      paddingBottom: theme.spacing.xl,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.colors.secondary,
    },
    header: { marginBottom: theme.spacing.xl },
    heading: { marginBottom: theme.spacing.sm },
    progressText: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.colors.secondary,
    },
    enhancedAddButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.secondary,
      borderStyle: "dashed",
      paddingVertical: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    enhancedAddButtonText: {
      fontSize: 16,
      color: theme.colors.secondary,
      fontWeight: "600",
    },
    clearButton: {
      backgroundColor: "#ffebee",
      borderWidth: 1,
      borderColor: "#e57373",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
      alignItems: "center",
    },
    clearButtonText: {
      fontSize: 14,
      color: "#c62828",
      fontFamily: theme.fonts.medium,
    },
    buttonPressed: { transform: [{ scale: 0.98 }], opacity: 0.8 },
    sectionContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
    },
    taskItemWrapper: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    taskItemContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    taskItemText: {
      flex: 1,
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.colors.primary,
      marginLeft: theme.spacing.md,
    },
    taskItemTextDone: {
      textDecorationLine: "line-through",
      color: theme.colors.secondary,
      opacity: 0.6,
    },
    taskActions: {
      flexDirection: "row",
      gap: theme.spacing.xs,
    },
    taskActionButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: theme.spacing.xl * 2,
    },
    emptyStateText: { fontSize: 48, marginBottom: theme.spacing.lg },
    emptyStateTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    emptyStateSubtitle: {
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.colors.secondary,
      textAlign: "center",
      paddingHorizontal: theme.spacing.xl,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalOverlayPressable: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
    },
    modalContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      width: "100%",
      maxWidth: 400,
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.lg,
      textAlign: "center",
    },
    taskInput: {
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      fontFamily: theme.fonts.regular,
      color: theme.colors.primary,
      minHeight: 80,
      textAlignVertical: "top",
      marginBottom: theme.spacing.lg,
    },
    categoryLabel: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    categoryContainer: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    categoryButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
      alignItems: "center",
    },
    categoryButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryButtonText: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      color: theme.colors.secondary,
    },
    categoryButtonTextActive: { color: theme.colors.white },
    modalButtons: { flexDirection: "row", gap: theme.spacing.md },
    modalButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
    },
    saveButton: { backgroundColor: theme.colors.primary },
    cancelButtonText: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.colors.secondary,
    },
    saveButtonText: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.colors.white,
    },
  });