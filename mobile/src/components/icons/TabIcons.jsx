import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { COLORS } from "../../theme/colors";

// 1. Minimalist Architectural Home Icon
export function HomeTabIcon({ focused, size = 22 }) {
  const activeColor = "#2563EB"; // Makarya Royal Sapphire
  const inactiveColor = "#94A3B8"; // Slate 400
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={styles.iconWrapper}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 10.5L11.2 3.6C11.66 3.22 12.34 3.22 12.8 3.6L21 10.5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V10.5Z"
          fill={focused ? "rgba(37, 99, 235, 0.10)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.6"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9.5 21V13.5C9.5 12.95 9.95 12.5 10.5 12.5H13.5C14.05 12.5 14.5 12.95 14.5 13.5V21"
          fill={focused ? activeColor : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "1.8" : "1.5"}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// 2. Precision Minimalist Navigation Compass (Explore)
export function ExploreTabIcon({ focused, size = 22 }) {
  const activeColor = "#2563EB";
  const inactiveColor = "#94A3B8";
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={styles.iconWrapper}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="12"
          r="9.25"
          fill={focused ? "rgba(37, 99, 235, 0.10)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.6"}
        />
        <Path
          d="M14.8 9.2L11 13L9.2 14.8L13 11L14.8 9.2Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
        <Path
          d="M14.8 9.2L12.5 15L11 13L14.8 9.2Z"
          fill={focused ? activeColor : inactiveColor}
        />
        <Circle
          cx="12"
          cy="12"
          r="1.5"
          fill={focused ? "#FFFFFF" : strokeColor}
        />
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// 3. Layered Task / Project Desk Icon (Workspace)
export function WorkspaceTabIcon({ focused, size = 22 }) {
  const activeColor = "#2563EB";
  const inactiveColor = "#94A3B8";
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={styles.iconWrapper}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="3"
          fill={focused ? "rgba(37, 99, 235, 0.10)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.6"}
        />
        <Path
          d="M3 9.5H21"
          stroke={strokeColor}
          strokeWidth={focused ? "1.8" : "1.5"}
          strokeLinecap="round"
        />
        <Rect
          x="6.5"
          y="12"
          width="4.5"
          height="5"
          rx="1"
          fill={focused ? activeColor : strokeColor}
        />
        <Rect
          x="13"
          y="12"
          width="4.5"
          height="3"
          rx="1"
          fill={focused ? "#93C5FD" : "rgba(148, 163, 184, 0.5)"}
        />
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// 4. Tactile Smart Wallet & Escrow Vault Icon (Wallet)
export function WalletTabIcon({ focused, size = 22 }) {
  const activeColor = "#2563EB";
  const inactiveColor = "#94A3B8";
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={styles.iconWrapper}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x="2.5"
          y="5.5"
          width="19"
          height="13"
          rx="3"
          fill={focused ? "rgba(37, 99, 235, 0.10)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.6"}
        />
        <Path
          d="M15.5 9.5H21V14.5H15.5C14.12 14.5 13 13.38 13 12C13 10.62 14.12 9.5 15.5 9.5Z"
          fill={focused ? activeColor : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "1.8" : "1.5"}
        />
        <Circle
          cx="16.5"
          cy="12"
          r="1.2"
          fill={focused ? "#FFFFFF" : strokeColor}
        />
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// 5. Clean Profile Icon (Profile)
export function ProfileTabIcon({ focused, size = 22 }) {
  const activeColor = "#2563EB";
  const inactiveColor = "#94A3B8";
  const strokeColor = focused ? activeColor : inactiveColor;

  return (
    <View style={styles.iconWrapper}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle
          cx="12"
          cy="7.5"
          r="4"
          fill={focused ? "rgba(37, 99, 235, 0.10)" : "none"}
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.6"}
        />
        <Path
          d="M4.5 19.5C4.5 16.5 7.86 14.5 12 14.5C16.14 14.5 19.5 16.5 19.5 19.5"
          stroke={strokeColor}
          strokeWidth={focused ? "2" : "1.6"}
          strokeLinecap="round"
        />
      </Svg>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

// 6. Minimalist Speech Bubble & Chat Icon (Chat / Diskusi)
export function ChatTabIcon({ focused, size = 22, hasUnread = false, unreadCount = 0 }) {
  const activeColor = "#2563EB";
  const inactiveColor = "#94A3B8";
  const strokeColor = focused ? activeColor : inactiveColor;
  const showDot = hasUnread || unreadCount > 0;

  return (
    <View style={styles.iconWrapper}>
      <View style={{ position: "relative" }}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.115 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91569 21 11V11.5Z"
            fill={focused ? "rgba(37, 99, 235, 0.10)" : "none"}
            stroke={strokeColor}
            strokeWidth={focused ? "2" : "1.6"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx="8.5"
            cy="11.5"
            r="1.2"
            fill={focused ? activeColor : inactiveColor}
          />
          <Circle
            cx="12.5"
            cy="11.5"
            r="1.2"
            fill={focused ? activeColor : inactiveColor}
          />
          <Circle
            cx="16.5"
            cy="11.5"
            r="1.2"
            fill={focused ? activeColor : inactiveColor}
          />
        </Svg>
        {showDot && <View style={styles.unreadBadgeDot} />}
      </View>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2563EB",
    marginTop: 3,
  },
  unreadBadgeDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});
