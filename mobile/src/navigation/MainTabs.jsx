import React from "react";
import { StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ProjectListScreen } from "../screens/projects/ProjectListScreen";
import { TrackerScreen } from "../screens/tracker/TrackerScreen";
import { WalletScreen } from "../screens/wallet/WalletScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { COLORS } from "../theme/colors";
import {
  LayoutGrid,
  Compass,
  Layers,
  Wallet,
  User,
} from "lucide-react-native";

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.brandIndigo,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Beranda",
          tabBarIcon: ({ focused }) => (
            <LayoutGrid
              size={20}
              color={focused ? COLORS.brandIndigo : COLORS.textMuted}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProjectsTab"
        component={ProjectListScreen}
        options={{
          tabBarLabel: "Eksplor",
          tabBarIcon: ({ focused }) => (
            <Compass
              size={20}
              color={focused ? COLORS.brandIndigo : COLORS.textMuted}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TrackerTab"
        component={TrackerScreen}
        options={{
          tabBarLabel: "Workspace",
          tabBarIcon: ({ focused }) => (
            <Layers
              size={20}
              color={focused ? COLORS.brandIndigo : COLORS.textMuted}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
      <Tab.Screen
        name="WalletTab"
        component={WalletScreen}
        options={{
          tabBarLabel: "Dompet",
          tabBarIcon: ({ focused }) => (
            <Wallet
              size={20}
              color={focused ? COLORS.brandIndigo : COLORS.textMuted}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ focused }) => (
            <User
              size={20}
              color={focused ? COLORS.brandIndigo : COLORS.textMuted}
              strokeWidth={focused ? 2.5 : 1.8}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    height: 66,
    backgroundColor: "rgba(255, 255, 255, 0.98)", // Crisp white floating bar
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingTop: 6,
    paddingBottom: 8,
    elevation: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.1,
    marginTop: 2,
  },
});
