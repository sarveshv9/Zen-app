import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const routine = [
  { hour: 6, task: "🌞 Wake Up Slowly" },
  { hour: 8, task: "💧 Drink Warm Water" },
  { hour: 9, task: "🧘 Morning Yoga" },
  { hour: 10, task: "🍳 Healthy Breakfast" },
  { hour: 12, task: "📚 Study or Work" },
  { hour: 14, task: "☕ Break Time" },
  { hour: 18, task: "🍽 Dinner" },
  { hour: 21, task: "🌙 Wind Down & Sleep" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [currentTask, setCurrentTask] = useState("");

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    
    setCurrentTime(`${hours}:${minutes}`);

    const task = [...routine]
    .reverse()
    .find((r) => hours >= r.hour)?.task || "🌸 Just Breathe";

    setCurrentTask(task);
  },
[]);

return (
  <View style={styles.container}>
    <Text style={styles.time}>{currentTime}</Text>
    <Text style={styles.task}>Task: {currentTask}</Text>
    <Text style={styles.quote}>"Start your day with calm"</Text>
    <Pressable style={styles.button} onPress={() => router.push("/routine")}>
      <Text style={styles.buttonText}>Start My Day</Text>
    </Pressable>
  </View>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EFEC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  time: {
    fontSize: 48,
    fontWeight: "600",
    color: "#16423C",
    marginBottom: 10,
  },
  task: {
    fontSize: 20,
    color: "#6A9C89",
    marginBottom: 20,
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#6A9C89",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#6A9C89",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


