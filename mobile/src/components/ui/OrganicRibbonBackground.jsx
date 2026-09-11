import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
  Path,
} from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * Apple Atmospheric Mesh & Ambient Aura Background
 * Menggantikan bentuk pita acak dengan gradien radial atmosferik khas Apple HIG
 * yang memberikan kedalaman frosted glass mewah di belakang header dan kartu.
 */
export function OrganicRibbonBackground({ height = 480, style }) {
  return (
    <View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height,
          overflow: "hidden",
        },
        style,
      ]}
      pointerEvents="none"
    >
      <Svg
        pointerEvents="none"
        width={SCREEN_WIDTH}
        height={height}
        viewBox={`0 0 ${SCREEN_WIDTH} ${height}`}
      >
        <Defs>
          {/* 1. Primary Top-Right Ambient Sapphire Aura */}
          <RadialGradient
            id="appleAtmosphereTopRight"
            cx="85%"
            cy="6%"
            rx="75%"
            ry="45%"
            fx="85%"
            fy="6%"
          >
            <Stop offset="0%" stopColor="#DBEAFE" stopOpacity={0.8} />
            <Stop offset="45%" stopColor="#E0E7FF" stopOpacity={0.45} />
            <Stop offset="80%" stopColor="#F1F5F9" stopOpacity={0.15} />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity={0} />
          </RadialGradient>

          {/* 2. Secondary Mid-Left Soft Indigo Aura */}
          <RadialGradient
            id="appleAtmosphereMidLeft"
            cx="12%"
            cy="28%"
            rx="65%"
            ry="38%"
            fx="12%"
            fy="28%"
          >
            <Stop offset="0%" stopColor="#E0EAFF" stopOpacity={0.6} />
            <Stop offset="50%" stopColor="#EEF2FF" stopOpacity={0.3} />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity={0} />
          </RadialGradient>

          {/* 3. Soft Bottom Horizon Fade */}
          <LinearGradient
            id="appleHorizonFade"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#F8FAFC" stopOpacity={0} />
            <Stop offset="75%" stopColor="#F8FAFC" stopOpacity={0.65} />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity={1} />
          </LinearGradient>
        </Defs>

        {/* Base Clean Canvas */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={height} fill="#F8FAFC" />

        {/* Top-Right Luminous Cloud */}
        <Rect
          x="0"
          y="0"
          width={SCREEN_WIDTH}
          height={height}
          fill="url(#appleAtmosphereTopRight)"
        />

        {/* Mid-Left Supporting Cloud */}
        <Rect
          x="0"
          y="0"
          width={SCREEN_WIDTH}
          height={height}
          fill="url(#appleAtmosphereMidLeft)"
        />

        {/* Smooth Transition Fade to Lower Page */}
        <Rect
          x="0"
          y="0"
          width={SCREEN_WIDTH}
          height={height}
          fill="url(#appleHorizonFade)"
        />
      </Svg>
    </View>
  );
}
