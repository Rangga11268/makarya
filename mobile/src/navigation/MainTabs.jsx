import React from "react";
import { StyleSheet, Platform } from "react-native";
import { FONTS } from "../theme/fonts";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ProjectListScreen } from "../screens/projects/ProjectListScreen";
import { TrackerScreen } from "../screens/tracker/TrackerScreen";
import { WalletScreen } from "../screens/wallet/WalletScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { COLORS } from "../theme/colors";
import {
  HomeTabIcon,
  ExploreTabIcon,
  WorkspaceTabIcon,
  WalletTabIcon,
  ProfileTabIcon,
} from "../components/icons/TabIcons";

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
            <HomeTabIcon focused={focused} size={22} color={COLORS.brandIndigo} />
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
            <ExploreTabIcon focused={focused} size={22} color={COLORS.brandIndigo} />
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
            <WorkspaceTabIcon focused={focused} size={22} color={COLORS.brandIndigo} />
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
            <WalletTabIcon focused={focused} size={22} color={COLORS.brandIndigo} />
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
            <ProfileTabIcon focused={focused} size={22} color={COLORS.brandIndigo} />
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
    height: Platform.OS === "ios" ? 86 : 68,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.8)",
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 26 : 8,
    elevation: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  tabItem: {
    paddingVertical: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
