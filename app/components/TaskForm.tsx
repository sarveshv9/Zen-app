// src/components/TaskForm.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { FormData } from "../routine";
import { theme } from "../styles/shared";
import AppleTimePicker from "./AppleTimePicker";

interface TaskFormProps {
  visible: boolean;
  isEditing: boolean;
  formData: FormData;
  onUpdateField: (field: keyof FormData, value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  isEditing,
  formData,
  onUpdateField,
  onSave,
  onClose,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleTimeSelect = useCallback(
    (time: string) => {
      onUpdateField("time", time);
      setShowTimePicker(false);
    },
    [onUpdateField]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.formModalOverlay}>
        <Animated.View
          style={[styles.enhancedFormContent, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.formHandle} />
          <View style={styles.formHeader}>
            <Pressable onPress={onClose} style={styles.formCancelButton}>
              <Text style={styles.formCancelText}>Cancel</Text>
            </Pressable>
            <Text style={styles.enhancedFormTitle}>
              {isEditing ? "Edit Task" : "New Task"}
            </Text>
            <Pressable onPress={onSave} style={styles.formSaveButton}>
              <Text style={styles.formSaveText}>Save</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Time</Text>
              <Pressable
                style={styles.timeInput}
                onPress={() => setShowTimePicker(true)}
              >
                <Text
                  style={[
                    styles.timeInputText,
                    !formData.time && styles.placeholderText,
                  ]}
                >
                  {formData.time || "Select time"}
                </Text>
                <Text style={styles.timeInputIcon}>🕐</Text>
              </Pressable>
            </View>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Task Name</Text>
              <TextInput
                style={styles.enhancedInput}
                value={formData.task}
                onChangeText={(text) => onUpdateField("task", text)}
                placeholder="Add emoji + task name"
                placeholderTextColor="rgba(60, 60, 67, 0.3)"
                multiline
              />
            </View>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.enhancedInput, styles.descriptionInput]}
                value={formData.description}
                onChangeText={(text) => onUpdateField("description", text)}
                placeholder="Describe this activity..."
                placeholderTextColor="rgba(60, 60, 67, 0.3)"
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>
        </Animated.View>
        <Modal
          visible={showTimePicker}
          transparent
          animationType="slide"
        >
          <View style={styles.timePickerModalOverlay}>
            <View style={styles.timePickerModal}>
              <AppleTimePicker
                selectedTime={formData.time}
                onTimeChange={handleTimeSelect}
              />
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  formModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  enhancedFormContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: theme.spacing.sm,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  formHandle: {
    width: 36,
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: theme.spacing.md,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    marginBottom: theme.spacing.lg,
  },
  formCancelButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  formCancelText: {
    fontSize: 16,
    color: theme.colors.secondary,
    fontWeight: "500",
    fontFamily: theme.fonts.medium,
  },
  enhancedFormTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },
  formSaveButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  formSaveText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "600",
    fontFamily: theme.fonts.bold,
  },
  formScrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  inputSection: {
    marginBottom: theme.spacing.xl,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
    fontFamily: theme.fonts.bold,
  },
  enhancedInput: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    fontSize: 16,
    color: theme.colors.primary,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    minHeight: 50,
    fontFamily: theme.fonts.regular,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: theme.spacing.md,
  },
  timeInput: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 50,
  },
  timeInputText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
  },
  placeholderText: {
    color: theme.colors.secondary,
    opacity: 0.6,
  },
  timeInputIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  timePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerModal: {
    backgroundColor: theme.colors.white,
    borderRadius: 28,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    width: '90%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
});

export default TaskForm;