import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";
import { AuthLandingScreen } from "../screens/auth/AuthLandingScreen";
import { RoleSelectionScreen } from "../screens/auth/RoleSelectionScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { VerificationScreen } from "../screens/auth/VerificationScreen";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";

const Stack = createStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}