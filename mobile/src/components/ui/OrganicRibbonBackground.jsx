import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
} from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * OrganicRibbonBackground (Global App Canvas)
 * Latar belakang atmosferik khas Apple HIG & Ethereal Glass Depth
 * Digunakan secara konsisten di seluruh layar aplikasi Makarya (Home, Explore, Workspace, Wallet, Profile)
 * agar seluruh aplikasi memiliki kedalaman visual yang hidup, tidak polos kaku, dan tetap elegan.
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
          {/* 1. Primary Top-Right Luminous Sapphire Aura */}
          <RadialGradient
            id="appleSapphireAura"
            cx="88%"
            cy="10%"
            rx="75%"
            ry="55%"
            fx="88%"
            fy="10%"
          >
            <Stop offset="0%" stopColor="#93C5FD" stopOpacity={0.65} />
            <Stop offset="35%" stopColor="#C7D2FE" stopOpacity={0.45} />
            <Stop offset="70%" stopColor="#E0E7FF" stopOpacity={0.2} />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity={0} />
          </RadialGradient>

          {/* 2. Secondary Mid-Left Soft Indigo/Sky Aura */}
          <RadialGradient
            id="appleIndigoSkyAura"
            cx="8%"
            cy="32%"
            rx="65%"
            ry="45%"
            fx="8%"
            fy="32%"
          >
            <Stop offset="0%" stopColor="#BAE6FD" stopOpacity={0.55} />
            <Stop offset="40%" stopColor="#DDD6FE" stopOpacity={0.3} />
            <Stop offset="75%" stopColor="#EEF2FF" stopOpacity={0.12} />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity={0} />
          </RadialGradient>

          {/* 3. Subtle Center Ambient Warmth */}
          <RadialGradient
            id="appleCenterWarmth"
            cx="50%"
            cy="0%"
            rx="60%"
            ry="30%"
            fx="50%"
            fy="0%"
          >
            <Stop offset="0%" stopColor="#E0EAFF" stopOpacity={0.4} />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity={0} />
          </RadialGradient>

          {/* 4. Bottom Horizon Smooth Fade to Clean Ground Canvas */}
          <LinearGradient
            id="appleCanvasHorizonFade"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#F8FAFC" stopOpacity={0} />
            <Stop offset="65%" stopColor="#F8FAFC" stopOpacity={0.6} />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity={1} />
          </LinearGradient>
        </Defs>

        {/* Base Solid Clean Canvas */}
        <Rect x="0" y="0" width={SCREEN_WIDTH} height={height} fill="#F8FAFC" />

        {/* Center Top Ambient Wash */}
        <Rect
          x="0"
          y="0"
          width={SCREEN_WIDTH}
          height={height}
          fill="url(#appleCenterWarmth)"
        />

        {/* Top-Right Luminous Sapphire Aura */}
        <Rect
          x="0"
          y="0"
          width={SCREEN_WIDTH}
          height={height}
          fill="url(#appleSapphireAura)"
        />

        {/* Mid-Left Supporting Indigo Aura */}
        <Rect
          x="0"
          y="0"
          width={SCREEN_WIDTH}
          height={height}
          fill="url(#appleIndigoSkyAura)"
        />

        {/* Horizon Soft Fade */}
        <Rect
          x="0"
          y={height * 0.45}
          width={SCREEN_WIDTH}
          height={height * 0.55}
          fill="url(#appleCanvasHorizonFade)"
        />
      </Svg>
    </View>
  );
}
