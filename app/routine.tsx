import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";


const routineItems = [
  { time: "6:00 AM", task: "🌞 Wake up slowly" },
  { time: "6:30 AM", task: "💧 Drink warm water" },
  { time: "7:00 AM", task: "🧘‍♀️ Light stretching or yoga" },
  { time: "8:00 AM", task: "🍵 Herbal tea & journaling" },
  { time: "9:00 AM", task: "🥣 Healthy breakfast" },
  { time: "10:00 AM", task: "📚 Learn something calm & useful" },
  { time: "1:00 PM", task: "🥗 Light lunch with focus" },
  { time: "3:00 PM", task: "🌿 Nature walk or quiet break" },
  { time: "5:00 PM", task: "📓 Reflect on the day" },
  { time: "7:00 PM", task: "🍵 Light dinner" },
  { time: "9:00 PM", task: "🌙 Prepare for sleep" },
  { time: "10:00 PM", task: "🛌 Sleep early" },
];

export default function RoutineScreen() {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>🧘 Zen Routine</Text>
            {routineItems.map((item, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.time}>{item.time}</Text>
                    <Text style={styles.task}>{item.task}</Text>
                </View>
            ))}
            <Pressable style={styles.button} onPress={() => router.push("/")}>
                  <Text style={styles.buttonText}>Back To Home</Text>
            </Pressable>
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
});