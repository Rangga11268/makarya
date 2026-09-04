import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthStack } from "./AuthStack";
import { MainTabs } from "./MainTabs";
import { PostProjectScreen } from "../screens/projects/PostProjectScreen";
import { ProjectDetailScreen } from "../screens/projects/ProjectDetailScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { ChatScreen } from "../screens/chat/ChatScreen";
import { SplashScreen } from "../screens/onboarding/SplashScreen";
import { CustomDialog } from "../components/ui/CustomDialog";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../theme/colors";

const Stack = createStackNavigator();

export function AppNavigator() {
  const { isAuthenticated, loading, initializeAuth } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  if (loading || showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
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
