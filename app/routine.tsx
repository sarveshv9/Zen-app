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

interface RoutineItem {
  id: string;
  time: string;
  task: string;
  description: string;
  image: any;
}

const DEFAULT_IMAGE = require("../assets/images/pixel/breathe.png");

const INITIAL_ROUTINE: RoutineItem[] = [
  {
    id: '1',
    time: "6:00 AM",
    task: "🌞 Wake Up Slowly",
    description: "Start your day gently with deep breaths and soft music.",
    image: require("../assets/images/pixel/wakeup.png"),
  },
  {
  id: '2',
  time: "6:30 AM",
  task: "💧 Drink Warm Water",
  description: "Rehydrate your body with a glass of warm water.",
  image: require("../assets/images/pixel/water.png"),
},
{
  id: '3',
  time: "7:00 AM",
  task: "🧘 Light Stretching or Yoga",
  description: "Do light stretching to wake up your body and mind.",
  image: require("../assets/images/pixel/yoga.png"),
},
{
  id: '4',
  time: "8:00 AM",
  task: "🍵 Herbal Tea & Journaling",
  description: "Sip calming tea and write down your morning thoughts.",
  image: require("../assets/images/pixel/tea_journal.png"),
},
{
  id: '5',
  time: "9:00 AM",
  task: "🥣 Healthy Breakfast",
  description: "Enjoy a nutritious breakfast to energize your day.",
  image: require("../assets/images/pixel/breakfast.png"),
},
{
  id: '6',
  time: "10:00 AM",
  task: "📚 Learn Something Calm",
  description: "Read or listen to something inspiring or informative.",
  image: require("../assets/images/pixel/study.png"),
},
{
  id: '7',
  time: "1:00 PM",
  task: "🥗 Light Lunch",
  description: "Eat a balanced lunch to keep your energy steady.",
  image: require("../assets/images/pixel/lunch.png"),
},
{
  id: '8',
  time: "3:00 PM",
  task: "🌿 Nature Walk or Break",
  description: "Take a peaceful walk or simply relax and breathe.",
  image: require("../assets/images/pixel/walk.png"),
},
{
  id: '9',
  time: "5:00 PM",
  task: "📓 Reflect on the Day",
  description: "Take a moment to write or think about your day so far.",
  image: require("../assets/images/pixel/reflect.png"),
},
{
  id: '10',
  time: "7:00 PM",
  task: "🍵 Light Dinner",
  description: "Have a light, comforting dinner to wind down.",
  image: require("../assets/images/pixel/dinner.png"),
},
{
  id: '11',
  time: "9:00 PM",
  task: "🌙 Prepare for Sleep",
  description: "Dim the lights, calm your mind, and slow down.",
  image: require("../assets/images/pixel/prepare_sleep.png"),
},
{
  id: '12',
  time: "10:00 PM",
  task: "🛌 Sleep Early",
  description: "Go to bed early for deep, restorative sleep.",
  image: require("../assets/images/pixel/sleep.png"),
},

];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function RoutineScreen() {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>(INITIAL_ROUTINE);
  const [selectedTask, setSelectedTask] = useState<RoutineItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    time: "",
    task: "",
    description: "",
  });

  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Memoized styles
  const animatedModalStyle = useMemo(
    () => ({
      transform: [{ translateX }, { translateY }, { scale: scaleAnim }],
    }),
    [translateX, translateY, scaleAnim]
  );

  const openModal = useCallback((task: RoutineItem, x: number, y: number) => {
    setSelectedTask(task);
    setTouchPosition({ x, y });

    translateX.setValue(x - SCREEN_WIDTH / 2);
    translateY.setValue(y - SCREEN_HEIGHT / 2);
    scaleAnim.setValue(0);
    setModalVisible(true);

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, translateY, scaleAnim]);

  const closeModal = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedTask(null);
    });
  }, [scaleAnim]);

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
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const newItem: RoutineItem = {
      id: editingId || Date.now().toString(),
      time: time.trim(),
      task: task.trim(),
      description: description.trim(),
      image: DEFAULT_IMAGE,
    };

    if (editingId) {
      setRoutineItems(prev => 
        prev.map(item => item.id === editingId ? newItem : item)
      );
    } else {
      setRoutineItems(prev => [...prev, newItem]);
    }
    closeForm();
  }, [formData, editingId, closeForm]);

  const handleDelete = useCallback(() => {
    if (!selectedTask) return;
    
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setRoutineItems(prev => 
              prev.filter(item => item.id !== selectedTask.id)
            );
            closeModal();
          },
        },
      ]
    );
  }, [selectedTask, closeModal]);

  const handleEditFromModal = useCallback(() => {
    if (selectedTask) {
      closeModal();
      openForm(selectedTask);
    }
  }, [selectedTask, closeModal, openForm]);

  const updateFormField = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const renderRoutineItem = useCallback(({ item, index }: { item: RoutineItem; index: number }) => (
    <Pressable
      key={item.id}
      onPressIn={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        setTouchPosition({ x: pageX, y: pageY });
      }}
      onPress={() => openModal(item, touchPosition.x, touchPosition.y)}
      style={styles.card}
    >
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.task}>{item.task}</Text>
    </Pressable>
  ), [openModal, touchPosition]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>🧘 Zen Routine</Text>
      
      <Pressable style={styles.addButton} onPress={() => openForm()}>
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </Pressable>

      {routineItems.map((item, index) => renderRoutineItem({ item, index }))}

      <Pressable style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Back To Home</Text>
      </Pressable>

      {/* Task Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, animatedModalStyle]}>
            {selectedTask && (
              <>
                <Image
                  source={selectedTask.image}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}>{selectedTask.task}</Text>
                <Text style={styles.modalDescription}>
                  {selectedTask.description}
                </Text>
                <View style={styles.modalActions}>
                  <Pressable style={styles.modalButton} onPress={handleEditFromModal}>
                    <Text style={styles.modalButtonText}>Edit</Text>
                  </Pressable>
                  <Pressable style={styles.modalButton} onPress={handleDelete}>
                    <Text style={[styles.modalButtonText, { color: "red" }]}>
                      Delete
                    </Text>
                  </Pressable>
                  <Pressable style={styles.modalButton} onPress={closeModal}>
                    <Text style={styles.modalButtonText}>Close</Text>
                  </Pressable>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Form Modal */}
      <Modal
        visible={formVisible}
        transparent
        animationType="slide"
        onRequestClose={closeForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formContent}>
            <Text style={styles.formTitle}>
              {editingId ? "Edit Task" : "Add New Task"}
            </Text>
            
            <TextInput
              style={styles.input}
              value={formData.time}
              onChangeText={(text) => updateFormField("time", text)}
              placeholder="Time (e.g., 6:00 AM)"
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              value={formData.task}
              onChangeText={(text) => updateFormField("task", text)}
              placeholder="Task name"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => updateFormField("description", text)}
              placeholder="Task description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.formActions}>
              <Pressable style={styles.formButton} onPress={handleSave}>
                <Text style={styles.formButtonText}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.formButton, styles.cancelButton]}
                onPress={closeForm}
              >
                <Text style={[styles.formButtonText, { color: "#8785A2" }]}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E9EFEC",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8785A2",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  time: {
    fontSize: 16,
    color: "#8785A2",
    marginBottom: 4,
    fontStyle: "italic",
  },
  task: {
    fontSize: 18,
    fontWeight: "500",
    color: "#FFC7C7",
  },
  button: {
    backgroundColor: "#FFF6E3",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFC7C7",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#FFC7C7",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 20,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFC7C7",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#8785A2",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  modalButton: {
    backgroundColor: "#FFC7C7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  formContent: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 20,
    width: "90%",
    maxWidth: 400,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8785A2",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  formButton: {
    flex: 1,
    backgroundColor: "#FFC7C7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
  },
  formButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
