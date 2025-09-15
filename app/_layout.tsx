import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    UbuntuLightI: require("./assets/fonts/Ubuntu-LightItalic.ttf"),
    UbuntuBold: require("./assets/fonts/Ubuntu-Bold.ttf"),
    UbuntuRegular: require("./assets/fonts/Ubuntu-Regular.ttf"),
    UbuntuMedium: require("./assets/fonts/Ubuntu-Medium.ttf"),
  });

  // Don't render anything until fonts are loaded to prevent text flash
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#E9EFEC" }} />;
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor="#E9EFEC" />
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#E9EFEC" },
        }}
      />
    </>
  );
}