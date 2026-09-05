import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { Toast } from "./src/components/ui/Toast";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Satoshi-Bold": require("./assets/fonts/Satoshi-Bold.ttf"),
    "Satoshi-Medium": require("./assets/fonts/Satoshi-Medium.ttf"),
    "Satoshi-Regular": require("./assets/fonts/Satoshi-Regular.ttf"),
    "GeneralSans-Bold": require("./assets/fonts/GeneralSans-Bold.ttf"),
    "GeneralSans-Medium": require("./assets/fonts/GeneralSans-Medium.ttf"),
    "GeneralSans-Regular": require("./assets/fonts/GeneralSans-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <AppNavigator />
        <Toast />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
