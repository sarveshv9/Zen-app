import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { ThemeProvider } from "../context/ThemeContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    UbuntuLightI: require("./assets/fonts/Ubuntu-LightItalic.ttf"),
    UbuntuBold: require("./assets/fonts/Ubuntu-Bold.ttf"),
    UbuntuRegular: require("./assets/fonts/Ubuntu-Regular.ttf"),
    UbuntuMedium: require("./assets/fonts/Ubuntu-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#F5F5F7" }} />;
  }

  return (
    <ThemeProvider>
      <StatusBar style="dark" />
      <Stack 
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}