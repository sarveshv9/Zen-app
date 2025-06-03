import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const routine = [
  { hour: 6, task: "🌞 Wake Up Slowly" },
  { hour: 6.5, task: "💧 Drink Warm Water" },
  { hour: 7, task: "🧘 Light Stretching or Yoga" },
  { hour: 8, task: "🍵 Herbal Tea & Journaling" },
  { hour: 9, task: "🥣 Healthy Breakfast" },
  { hour: 10, task: "📚 Learn Something Calm" },
  { hour: 13, task: "🥗 Light Lunch" },
  { hour: 15, task: "🌿 Nature Walk or Break" },
  { hour: 17, task: "📓 Reflect on the Day" },
  { hour: 19, task: "🍵 Light Dinner" },
  { hour: 21, task: "🌙 Prepare for Sleep" },
  { hour: 22, task: "🛌 Sleep Early" },
];

const taskImages = {
  "🌞 Wake Up Slowly": require("../assets/images/pixel/wakeup.png"),
  "💧 Drink Warm Water": require("../assets/images/pixel/water.png"),
  "🧘 Light Stretching or Yoga": require("../assets/images/pixel/yoga.png"),
  "🍵 Herbal Tea & Journaling": require("../assets/images/pixel/tea_journal.png"), //no done
  "🥣 Healthy Breakfast": require("../assets/images/pixel/breakfast.png"),
  "📚 Learn Something Calm": require("../assets/images/pixel/learn.png"), //no done
  "🥗 Light Lunch": require("../assets/images/pixel/lunch.png"), //no done
  "🌿 Nature Walk or Break": require("../assets/images/pixel/walk.png"), //no done
  "📓 Reflect on the Day": require("../assets/images/pixel/reflect.png"), //no done
  "🍵 Light Dinner": require("../assets/images/pixel/dinner.png"),
  "🌙 Prepare for Sleep": require("../assets/images/pixel/prepare_sleep.png"), //no done
  "🛌 Sleep Early": require("../assets/images/pixel/sleep.png"),
};


export default function HomeScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState("");
  const [currentTask, setCurrentTask] = useState("");

  useEffect(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;

    setCurrentTime(formattedTime);

    const task = [...routine]
      .reverse()
      .find((r) => now.getHours() >= r.hour)?.task || "🌸 Just Breathe";

    setCurrentTask(task);
  },
    []);

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{currentTime}</Text>
      <Text style={styles.task}>Task: {currentTask}</Text>
      <Image source={taskImages[currentTask as keyof typeof taskImages]} style={styles.taskImage} resizeMode="contain" />
      <Text style={styles.quote}>"Start your day with calm" </Text>
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
    fontSize: 60,
    fontWeight: "600",
    color: "#FFC7C7",
    marginBottom: 70,
  },
  taskImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  task: {
    fontSize: 22,
    color: "#FFC7C7",
    marginBottom: 20,
    backgroundColor: "#FFF6E3",
    borderRadius: 20,
    padding: 15,
    fontFamily: "UbuntuBold",
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    fontFamily: "UbuntuLightI",
    color: "#8785A2",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FFF6E3",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 50,
  },
  buttonText: {
    color: "#FFC7C7",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "UbuntuBold",
  },
});


