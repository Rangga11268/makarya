import React from "react";
import { StyleSheet, Platform } from "react-native";
import { FONTS } from "../theme/fonts";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ProjectListScreen } from "../screens/projects/ProjectListScreen";
import { TalentListScreen } from "../screens/talents/TalentListScreen";
import { TrackerScreen } from "../screens/tracker/TrackerScreen";
import { WalletScreen } from "../screens/wallet/WalletScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../theme/colors";
import {
  HomeTabIcon,
  ExploreTabIcon,
  WorkspaceTabIcon,
  WalletTabIcon,
  ProfileTabIcon,
} from "../components/icons/TabIcons";

import { useResponsiveLayout } from "../hooks/useResponsiveLayout";

const Tab = createBottomTabNavigator();

export function MainTabs() {
  const { user } = useAuthStore();
  const { width, height, isTablet, isLandscape, isLandscapePhone } =
    useResponsiveLayout();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const tabWidth =
    isTablet || isLandscape ? Math.min(width - 32, 600) : width - 32;
  const tabHorizontalOffset = Math.max(16, (width - tabWidth) / 2);

  const dynamicTabBarStyle = [
    styles.tabBar,
    {
      left: tabHorizontalOffset,
      right: tabHorizontalOffset,
      ...(isLandscapePhone ? { height: 52, bottom: 6, paddingTop: 3 } : {}),
    },
  ];

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: dynamicTabBarStyle,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#94A3B8",
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
            <HomeTabIcon focused={focused} size={22} />
          ),
        }}
      />

      {/* 2. Explore Tab: Projects for Mahasiswa, Talenta Mahasiswa for Client/UMKM */}
      <Tab.Screen
        name="ProjectsTab"
        component={isMahasiswa ? ProjectListScreen : TalentListScreen}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ focused }) => (
            <ExploreTabIcon focused={focused} size={22} />
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
            <WorkspaceTabIcon focused={focused} size={22} />
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
            <WalletTabIcon focused={focused} size={22} />
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
            <ProfileTabIcon focused={focused} size={22} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 22 : 12,
    left: 16,
    right: 16,
    height: Platform.OS === "ios" ? 68 : 64,
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.94)",
    borderRadius: 32,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 8 : 6,
    elevation: 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  tabItem: {
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 10,
    marginTop: 1,
    letterSpacing: 0.1,
  },
});
