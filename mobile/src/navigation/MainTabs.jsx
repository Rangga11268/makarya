import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ProjectListScreen } from "../screens/projects/ProjectListScreen";
import { TrackerScreen } from "../screens/tracker/TrackerScreen";
import { WalletScreen } from "../screens/wallet/WalletScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { COLORS } from "../theme/colors";
import { Briefcase, Search, Activity, Wallet, User } from "lucide-react-native";

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Briefcase
                size={20}
                color={focused ? COLORS.textWhite : COLORS.textMuted}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProjectsTab"
        component={ProjectListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Search
                size={20}
                color={focused ? COLORS.textWhite : COLORS.textMuted}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TrackerTab"
        component={TrackerScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Activity
                size={20}
                color={focused ? COLORS.textWhite : COLORS.textMuted}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="WalletTab"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <Wallet
                size={20}
                color={focused ? COLORS.textWhite : COLORS.textMuted}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconActive]}>
              <User
                size={20}
                color={focused ? COLORS.textWhite : COLORS.textMuted}
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
    bottom: 24,
    left: 20,
    right: 20,
    height: 64,
    backgroundColor: "rgba(15, 23, 42, 0.95)", // Web dark-900 with glass effect
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingHorizontal: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconActive: {
    backgroundColor: COLORS.brandIndigo, // Web Primary Indigo
  },
});
