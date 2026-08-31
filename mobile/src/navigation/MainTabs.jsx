import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ProjectListScreen } from "../screens/projects/ProjectListScreen";
import { TrackerScreen } from "../screens/tracker/TrackerScreen";
import { WalletScreen } from "../screens/wallet/WalletScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../theme/colors";
import {
  LayoutGrid,
  Compass,
  Layers,
  Wallet,
  User,
  Plus,
  Zap,
} from "lucide-react-native";

const Tab = createBottomTabNavigator();

// Empty component for center action tab button
function EmptyScreen() {
  return null;
}

export function MainTabs({ navigation }) {
  const { user } = useAuthStore();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

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
      {/* 1. Beranda */}
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

      {/* 2. Eksplor */}
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

      {/* 3. Center Raised Action Button (Pasang Proyek UMKM / Cari Kilat Mahasiswa) */}
      <Tab.Screen
        name="CenterAction"
        component={EmptyScreen}
        options={{
          tabBarLabel: () => null,
          tabBarButton: () => (
            <View style={styles.centerFabWrapper}>
              <TouchableOpacity
                onPress={() => {
                  if (isMahasiswa) {
                    navigation.navigate("ProjectsTab");
                  } else {
                    navigation.navigate("PostProject");
                  }
                }}
                activeOpacity={0.85}
                style={styles.centerFabButton}
              >
                {isMahasiswa ? (
                  <Zap size={22} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Plus size={24} color="#FFFFFF" strokeWidth={3} />
                )}
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* 4. Workspace */}
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

      {/* 5. Dompet & Profil */}
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
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 84 : 68,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
    elevation: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.1,
    marginTop: 3,
  },
  centerFabWrapper: {
    top: -20,
    justifyContent: "center",
    alignItems: "center",
  },
  centerFabButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.brandIndigo,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
});
