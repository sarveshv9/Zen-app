// src/components/TaskModal.tsx
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { RoutineItem } from "../routine";
import { theme } from "../styles/shared";

interface TaskModalProps {
  visible: boolean;
  task: RoutineItem | null;
  animatedStyle: any;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  task,
  animatedStyle,
  onClose,
  onEdit,
  onDelete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!task) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.enhancedModalContent,
            animatedStyle,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                ...(animatedStyle.transform || []),
              ],
            },
          ]}
        >
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.imageContainer}>
              <View style={styles.imageGlow} />
              <Image
                source={task.image}
                style={styles.enhancedModalImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTime}>{task.time}</Text>
              <Text style={styles.enhancedModalTitle}>{task.task}</Text>
              <Text style={styles.enhancedModalDescription}>
                {task.description}
              </Text>
            </View>
            <View style={styles.enhancedModalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.editButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onEdit}
              >
                <Text style={styles.actionButtonText}>✏️ Edit</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.deleteButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={onDelete}
              >
                <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                  🗑️ Delete
                </Text>
              </Pressable>
            </View>
            <Pressable style={styles.closeArea} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  enhancedModalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 28,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 2,
    marginBottom: theme.spacing.lg,
  },
  imageContainer: {
    position: "relative",
    marginBottom: theme.spacing.lg,
  },
  imageGlow: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: `${theme.colors.primary}15`,
    borderRadius: 60,
    zIndex: 0,
  },
  enhancedModalImage: {
    width: 120,
    height: 120,
    zIndex: 1,
  },
  taskInfo: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  taskTime: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "600",
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  enhancedModalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
    lineHeight: 28,
    fontFamily: theme.fonts.bold,
  },
  enhancedModalDescription: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.9,
    fontFamily: theme.fonts.regular,
  },
  enhancedModalActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
  },
  deleteButtonText: {
    color: theme.colors.white,
  },
  closeArea: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  closeText: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: "center",
    fontWeight: "500",
    fontFamily: theme.fonts.medium,
  },
});

export default TaskModal;