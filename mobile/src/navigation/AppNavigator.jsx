import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthStack } from "./AuthStack";
import { MainTabs } from "./MainTabs";
import { PostProjectScreen } from "../screens/projects/PostProjectScreen";
import { ProjectDetailScreen } from "../screens/projects/ProjectDetailScreen";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../theme/colors";

const Stack = createStackNavigator();

export function AppNavigator() {
  const { isAuthenticated, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={COLORS.accentLime} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="PostProject" component={PostProjectScreen} />
          <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    alignItems: "center",
    justifyContent: "center",
  },
});