import { router } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type RoutineItem = {
  time: string;
  task: string;
  description: string;
  image: any;   
};

const routineItems: RoutineItem[] = [
  {
    time: "6:00 AM",
    task: "🌞 Wake Up Slowly",
    description: "Start your day gently with deep breaths and soft music.",
    image: require("../assets/images/pixel/wakeup.png"),
  },
  {
    time: "6:30 AM",
    task: "💧 Drink Warm Water",
    description: "Rehydrate your body with a glass of warm water.",
    image: require("../assets/images/pixel/water.png"),
  },
  {
    time: "7:00 AM",
    task: "🧘 Light Stretching or Yoga",
    description: "Do light stretching to wake up your body and mind.",
    image: require("../assets/images/pixel/yoga.png"),
  },
  {
    time: "8:00 AM",
    task: "🍵 Herbal Tea & Journaling",
    description: "Sip calming tea and write down your morning thoughts.",
    image: require("../assets/images/pixel/tea_journal.png"),
  },
  {
    time: "9:00 AM",
    task: "🥣 Healthy Breakfast",
    description: "Enjoy a nutritious breakfast to energize your day.",
    image: require("../assets/images/pixel/breakfast.png"),
  },
  {
    time: "10:00 AM",
    task: "📚 Learn Something Calm",
    description: "Read or listen to something inspiring or informative.",
    image: require("../assets/images/pixel/study.png"),
  },
  {
    time: "1:00 PM",
    task: "🥗 Light Lunch",
    description: "Eat a balanced lunch to keep your energy steady.",
    image: require("../assets/images/pixel/lunch.png"),
  },
  {
    time: "3:00 PM",
    task: "🌿 Nature Walk or Break",
    description: "Take a peaceful walk or simply relax and breathe.",
    image: require("../assets/images/pixel/walk.png"),
  },
  {
    time: "5:00 PM",
    task: "📓 Reflect on the Day",
    description: "Take a moment to write or think about your day so far.",
    image: require("../assets/images/pixel/reflect.png"),
  },
  {
    time: "7:00 PM",
    task: "🍵 Light Dinner",
    description: "Have a light, comforting dinner to wind down.",
    image: require("../assets/images/pixel/dinner.png"),
  },
  {
    time: "9:00 PM",
    task: "🌙 Prepare for Sleep",
    description: "Dim the lights, calm your mind, and slow down.",
    image: require("../assets/images/pixel/prepare_sleep.png"),
  },
  {
    time: "10:00 PM",
    task: "🛌 Sleep Early",
    description: "Go to bed early for deep, restorative sleep.",
    image: require("../assets/images/pixel/sleep.png"),
  },
];



export default function RoutineScreen() {
  const [selectedTask, setSelectedTask] = useState<RoutineItem | null>(null);
  const [modalVisible, setModalVisibal] = useState(false);

  const openModal = (task: RoutineItem) => {
    setSelectedTask(task);
    setModalVisibal(true);
  };

  const closeModal = () => {
    setModalVisibal(false);
    setSelectedTask(null);
  };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>🧘 Zen Routine</Text>
            {routineItems.map((item, index) => (
                <Pressable key={index} onPress={() => openModal(item)}>
                  <View style={styles.card}>
                    <Text style={styles.time}>{item.time}</Text>
                    <Text style={styles.task}>{item.task}</Text>
                  </View>  
                </Pressable>
            ))}
            <Pressable style={styles.button} onPress={() => router.push("/")}>
                  <Text style={styles.buttonText}>Back To Home</Text>
            </Pressable>

            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  {selectedTask && ( <>
                  <Image source={selectedTask.image} style={styles.modalImage} resizeMode="contain"/>
                  <Text style={styles.modalTitle}>{selectedTask.task}</Text>
                  <Text style={styles.modalDescription}>{selectedTask.description}</Text>
                  <Pressable style={styles.modalButton} onPress={closeModal}>
                    <Text style={styles.modalButtonText}>Close</Text>
                  </Pressable>
                  </>)}
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
    backgroundColor: "#FFF6E3",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  time: {
    fontSize: 16,
    color: "#8785A2",
    marginBottom: 4,
    fontStyle: "italic",
    fontFamily: "UbuntuLightI",
  },
  task: {
    fontSize: 18,
    fontWeight: "100",
    color: "#FFC7C7",
    fontFamily: "UbuntuMedium",
  },
  button: {
    backgroundColor: "#FFF6E3",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 50,
    flex: 1,
    alignItems: "center"
  },
  buttonText: {
    color: "#FFC7C7",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "UbuntuBold",
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
  width: "80%",
  alignItems: "center",
},
modalImage: {
  width: 120,
  height: 120,
  marginBottom: 16,
},
modalTitle: {
  fontSize: 22,
  fontFamily: "UbuntuBold",
  color: "#FFC7C7",
  marginBottom: 10,
  textAlign: "center",
},
modalDescription: {
  fontSize: 16,
  fontFamily: "UbuntuLightI",
  color: "#8785A2",
  marginBottom: 20,
  textAlign: "center",
},
modalButton: {
  backgroundColor: "#FFC7C7",
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 12,
},
modalButtonText: {
  color: "#fff",
  fontFamily: "UbuntuBold",
  fontSize: 16,
},
});