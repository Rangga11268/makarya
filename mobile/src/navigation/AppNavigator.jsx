import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthStack } from "./AuthStack";
import { MainTabs } from "./MainTabs";
import { PostProjectScreen } from "../screens/projects/PostProjectScreen";
import { ProjectDetailScreen } from "../screens/projects/ProjectDetailScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { ChatScreen } from "../screens/chat/ChatScreen";
import { HelpScreen } from "../screens/help/HelpScreen";
import { SplashScreen } from "../screens/onboarding/SplashScreen";
import { CustomDialog } from "../components/ui/CustomDialog";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../theme/colors";

const Stack = createStackNavigator();

// Guard level modul: memastikan splash screen hanya muncul SATU KALI saat app pertama kali dibuka
let hasShownSplash = false;

const isWebSessionSplashShown = () => {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      return window.sessionStorage.getItem("makarya_splash_seen") === "true";
    }
  } catch (_) {}
  return false;
};

export function AppNavigator() {
  const { isAuthenticated, loading, initializeAuth } = useAuthStore();
  const alreadySeen = hasShownSplash || isWebSessionSplashShown();
  const [showSplash, setShowSplash] = useState(!alreadySeen);

  useEffect(() => {
    initializeAuth();
  }, []);

  const handleFinishSplash = () => {
    hasShownSplash = true;
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        window.sessionStorage.setItem("makarya_splash_seen", "true");
      }
    } catch (_) {}
    setShowSplash(false);
  };

  // Hanya tampilkan SplashScreen SATU KALI saat cold-start pertama
  if (!hasShownSplash && !isWebSessionSplashShown() && (showSplash || loading)) {
    return <SplashScreen onFinish={handleFinishSplash} />;
  }

  // Jika auth masih membaca storage setelah splash selesai, tampilkan canvas netral tanpa memunculkan splash screen lagi
  if (loading) {
    return <View style={{ flex: 1, backgroundColor: COLORS.bgDark }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="PostProject" component={PostProjectScreen} />
            <Stack.Screen
              name="ProjectDetail"
              component={ProjectDetailScreen}
            />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>

      {/* Global Custom Alert & Confirm Dialog */}
      <CustomDialog />
    </View>
  );
}
