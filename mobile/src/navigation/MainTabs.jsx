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
import { ChatListScreen } from "../screens/chat/ChatListScreen";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../theme/colors";
import {
  HomeTabIcon,
  ExploreTabIcon,
  WorkspaceTabIcon,
  WalletTabIcon,
  ProfileTabIcon,
  ChatTabIcon,
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
      {/* 1. Beranda */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Beranda",
          tabBarIcon: ({ focused }) => (
            <HomeTabIcon focused={focused} size={21} />
          ),
        }}
      />

      {/* 2. Eksplor: Projects for Mahasiswa, Talenta Mahasiswa for Client/UMKM */}
      <Tab.Screen
        name="ProjectsTab"
        component={isMahasiswa ? ProjectListScreen : TalentListScreen}
        options={{
          tabBarLabel: "Eksplor",
          tabBarIcon: ({ focused }) => (
            <ExploreTabIcon focused={focused} size={21} />
          ),
        }}
      />

      {/* 3. Chat & Diskusi */}
      <Tab.Screen
        name="ChatTab"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ focused }) => (
            <ChatTabIcon focused={focused} size={21} />
          ),
        }}
      />

      {/* 4. Ruang Kerja */}
      <Tab.Screen
        name="TrackerTab"
        component={TrackerScreen}
        options={{
          tabBarLabel: "Kerja",
          tabBarIcon: ({ focused }) => (
            <WorkspaceTabIcon focused={focused} size={21} />
          ),
        }}
      />

      {/* 5. Dompet Escrow */}
      <Tab.Screen
        name="WalletTab"
        component={WalletScreen}
        options={{
          tabBarLabel: "Dompet",
          tabBarIcon: ({ focused }) => (
            <WalletTabIcon focused={focused} size={21} />
          ),
        }}
      />

      {/* 6. Profil */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profil",
          tabBarIcon: ({ focused }) => (
            <ProfileTabIcon focused={focused} size={21} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 20 : 10,
    left: 14,
    right: 14,
    height: Platform.OS === "ios" ? 64 : 58,
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.95)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
    paddingTop: 4,
    paddingBottom: Platform.OS === "ios" ? 6 : 4,
    elevation: 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
  },
  tabItem: {
    paddingVertical: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontFamily: FONTS.displaySemiBold,
    fontSize: 9.5,
    marginTop: 1,
    letterSpacing: -0.2,
  },
});
