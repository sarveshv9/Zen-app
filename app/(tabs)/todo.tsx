import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getSharedStyles, Theme } from '../../styles/shared';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category: 'today' | 'later';
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onEdit, onDelete }: TaskItemProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const handleLongPress = useCallback(() => {
    Alert.alert(
      'Task Options',
      `What would you like to do with "${task.text}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => onEdit(task) },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            console.log('Delete pressed for task:', task.id);
            onDelete(task.id);
          }
        },
      ]
    );
  }, [task, onEdit, onDelete]);

  return (
    <Pressable 
      style={styles.taskItemContainer}
      onPress={() => onToggle(task.id)}
      onLongPress={handleLongPress}
    >
      <Ionicons
        name={task.completed ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={task.completed ? theme.colors.primary : theme.colors.secondary}
      />
      <Text style={[styles.taskItemText, task.completed && styles.taskItemTextDone]}>
        {task.text}
      </Text>
      <Pressable 
        style={styles.taskOptionsButton}
        onPress={() => {
          console.log('Options button pressed for task:', task.id);
          handleLongPress();
        }}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.secondary} />
      </Pressable>
    </Pressable>
  );
};

interface TaskModalProps {
  visible: boolean;
  task: Task | null;
  isEditing: boolean;
  onSave: (text: string, category: 'today' | 'later') => void;
  onClose: () => void;
}

const TaskModal = ({ visible, task, isEditing, onSave, onClose }: TaskModalProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  
  const [taskText, setTaskText] = useState('');
  const [category, setCategory] = useState<'today' | 'later'>('today');

  React.useEffect(() => {
    if (visible) {
      if (isEditing && task) {
        setTaskText(task.text);
        setCategory(task.category);
      } else {
        setTaskText('');
        setCategory('today');
      }
    }
  }, [visible, isEditing, task]);

  const handleSave = useCallback(() => {
    const trimmedText = taskText.trim();
    if (!trimmedText) {
      Alert.alert('Error', 'Please enter a task description');
      return;
    }
    onSave(trimmedText, category);
    onClose();
  }, [taskText, category, onSave, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </Text>
          
          <TextInput
            style={styles.taskInput}
            placeholder="What do you want to accomplish?"
            value={taskText}
            onChangeText={setTaskText}
            multiline
            autoFocus
          />

          <Text style={styles.categoryLabel}>Category</Text>
          <View style={styles.categoryContainer}>
            <Pressable
              style={[
                styles.categoryButton,
                category === 'today' && styles.categoryButtonActive
              ]}
              onPress={() => setCategory('today')}
            >
              <Text style={[
                styles.categoryButtonText,
                category === 'today' && styles.categoryButtonTextActive
              ]}>
                Today's Focus
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.categoryButton,
                category === 'later' && styles.categoryButtonActive
              ]}
              onPress={() => setCategory('later')}
            >
              <Text style={[
                styles.categoryButtonText,
                category === 'later' && styles.categoryButtonTextActive
              ]}>
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
                {isEditing ? 'Update' : 'Add Task'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function TodoScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const sharedStyles = useMemo(() => getSharedStyles(theme), [theme]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const todayTasks = useMemo(() => 
    tasks.filter(task => task.category === 'today'), [tasks]
  );
  
  const laterTasks = useMemo(() => 
    tasks.filter(task => task.category === 'later'), [tasks]
  );

  const completedCount = useMemo(() => 
    tasks.filter(task => task.completed).length, [tasks]
  );

  const totalCount = tasks.length;

  const handleAddTask = useCallback(() => {
    setEditingTask(null);
    setModalVisible(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  }, []);

  const handleSaveTask = useCallback((text: string, category: 'today' | 'later') => {
    console.log('handleSaveTask called:', { text, category, isEditing: !!editingTask });
    
    if (editingTask) {
      // Edit existing task
      console.log('Editing task:', editingTask.id);
      setTasks(prev => {
        const updatedTasks = prev.map(task => 
          task.id === editingTask.id 
            ? { ...task, text, category }
            : task
        );
        console.log('Updated tasks:', updatedTasks.map(t => ({ id: t.id, text: t.text })));
        return updatedTasks;
      });
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text,
        completed: false,
        createdAt: new Date(),
        category,
      };
      console.log('Adding new task:', newTask);
      setTasks(prev => {
        const newTasks = [...prev, newTask];
        console.log('All tasks after add:', newTasks.map(t => ({ id: t.id, text: t.text })));
        return newTasks;
      });
    }
    
    // Clear editing state
    setEditingTask(null);
  }, [editingTask]);

  const handleToggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    console.log('handleDeleteTask called with id:', id);
    console.log('Current tasks:', tasks.map(t => ({ id: t.id, text: t.text })));
    
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) {
      console.log('Task not found for deletion');
      return;
    }

    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${taskToDelete.text}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting task with id:', id);
            setTasks(prev => {
              const newTasks = prev.filter(task => task.id !== id);
              console.log('Tasks after deletion:', newTasks.map(t => ({ id: t.id, text: t.text })));
              return newTasks;
            });
          },
        },
      ]
    );
  }, [tasks]);

  const handleClearCompleted = useCallback(() => {
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length === 0) {
      Alert.alert('No completed tasks', 'There are no completed tasks to clear');
      return;
    }

    Alert.alert(
      'Clear Completed',
      `Remove ${completedTasks.length} completed task${completedTasks.length === 1 ? '' : 's'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setTasks(prev => prev.filter(task => !task.completed)),
        },
      ]
    );
  }, [tasks]);

  return (
    <SafeAreaView style={sharedStyles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[sharedStyles.heading, styles.heading]}>✅ My Tasks</Text>
          {totalCount > 0 && (
            <Text style={styles.progressText}>
              {completedCount}/{totalCount} completed
            </Text>
          )}
        </View>

        <Pressable 
          style={({ pressed }) => [styles.enhancedAddButton, pressed && styles.buttonPressed]}
          onPress={handleAddTask}
        >
          <Ionicons name="add" size={24} color={theme.colors.secondary} />
          <Text style={styles.enhancedAddButtonText}>Add New Task</Text>
        </Pressable>

        {totalCount > 0 && completedCount > 0 && (
          <Pressable 
            style={({ pressed }) => [styles.clearButton, pressed && styles.buttonPressed]}
            onPress={handleClearCompleted}
          >
            <Text style={styles.clearButtonText}>Clear Completed ({completedCount})</Text>
          </Pressable>
        )}

        {todayTasks.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today's Focus</Text>
            {todayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </View>
        )}

        {laterTasks.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Later</Text>
            {laterTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </View>
        )}

        {totalCount === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>📝</Text>
            <Text style={styles.emptyStateTitle}>No tasks yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Tap "Add New Task" to get started with your productivity journey
            </Text>
          </View>
        )}
      </ScrollView>

      <TaskModal
        visible={modalVisible}
        task={editingTask}
        isEditing={!!editingTask}
        onSave={handleSaveTask}
        onClose={() => {
          console.log('Modal closing');
          setModalVisible(false);
          setEditingTask(null);
        }}
      />
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
    header: {
      marginBottom: theme.spacing.xl,
    },
    heading: {
      marginBottom: theme.spacing.sm,
    },
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
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    enhancedAddButtonText: {
      fontSize: 16,
      color: theme.colors.secondary,
      fontWeight: "600",
    },
    clearButton: {
      backgroundColor: '#ffebee',
      borderWidth: 1,
      borderColor: '#e57373',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
      alignItems: 'center',
    },
    clearButtonText: {
      fontSize: 14,
      color: '#c62828',
      fontFamily: theme.fonts.medium,
    },
    buttonPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.8
    },
    sectionContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: theme.fonts.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
    },
    taskItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
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
      textDecorationLine: 'line-through',
      color: theme.colors.secondary,
      opacity: 0.6,
    },
    taskOptionsButton: {
      padding: theme.spacing.sm,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl * 2,
    },
    emptyStateText: {
      fontSize: 48,
      marginBottom: theme.spacing.lg,
    },
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
      textAlign: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    modalContainer: {
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: theme.fonts.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
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
      textAlignVertical: 'top',
      marginBottom: theme.spacing.lg,
    },
    categoryLabel: {
      fontSize: 16,
      fontFamily: theme.fonts.medium,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
    categoryContainer: {
      flexDirection: 'row',
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
      alignItems: 'center',
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
    categoryButtonTextActive: {
      color: theme.colors.white,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
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