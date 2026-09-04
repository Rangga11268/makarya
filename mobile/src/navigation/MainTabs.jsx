import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { FONTS } from "../theme/fonts";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ProjectListScreen } from "../screens/projects/ProjectListScreen";
import { TrackerScreen } from "../screens/tracker/TrackerScreen";
import { WalletScreen } from "../screens/wallet/WalletScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { COLORS } from "../theme/colors";
import { LayoutGrid, Compass, Layers, Wallet, User } from "lucide-react-native";

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
      {/* 1. Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <LayoutGrid
                size={21}
                color={focused ? COLORS.brandIndigo : COLORS.textMuted}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 2. Explore Projects */}
      <Tab.Screen
        name="ProjectsTab"
        component={ProjectListScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Compass
                size={21}
                color={focused ? COLORS.brandIndigo : COLORS.textMuted}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 3. Workspace */}
      <Tab.Screen
        name="TrackerTab"
        component={TrackerScreen}
        options={{
          tabBarLabel: "Workspace",
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Layers
                size={21}
                color={focused ? COLORS.brandIndigo : COLORS.textMuted}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 4. Wallet */}
      <Tab.Screen
        name="WalletTab"
        component={WalletScreen}
        options={{
          tabBarLabel: "Wallet",
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Wallet
                size={21}
                color={focused ? COLORS.brandIndigo : COLORS.textMuted}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 5. Profile */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <User
                size={21}
                color={focused ? COLORS.brandIndigo : COLORS.textMuted}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 84 : 66,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    elevation: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  activeIconContainer: {
    transform: [{ scale: 1.05 }],
  },
});
