import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function OrganicRibbonBackground({ height = 480, style }) {
  return (
    <View
      style={[StyleSheet.absoluteFillObject, { height, overflow: "hidden" }, style]}
      pointerEvents="none"
    >
      <Svg
        width={SCREEN_WIDTH}
        height={height}
        viewBox="0 0 390 480"
        preserveAspectRatio="xMidYMin slice"
      >
        <Defs>
          {/* Subtle Makarya Royal Sapphire to Sky Cyan Fluid Gradient */}
          <LinearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2563EB" stopOpacity={0.08} />
            <Stop offset="50%" stopColor="#38BDF8" stopOpacity={0.06} />
            <Stop offset="100%" stopColor="#60A5FA" stopOpacity={0.02} />
          </LinearGradient>

          {/* Secondary Organic Accent Ribbon */}
          <LinearGradient id="ribbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#06B6D4" stopOpacity={0.07} />
            <Stop offset="60%" stopColor="#3B82F6" stopOpacity={0.04} />
            <Stop offset="100%" stopColor="#818CF8" stopOpacity={0.01} />
          </LinearGradient>

          {/* Subtle Ambient Mesh Glow */}
          <LinearGradient id="meshAura" x1="0%" y1="0%" x2="100%" y2="50%">
            <Stop offset="0%" stopColor="#DBEAFE" stopOpacity={0.4} />
            <Stop offset="40%" stopColor="#E0E7FF" stopOpacity={0.25} />
            <Stop offset="100%" stopColor="#F8FAFC" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Ambient Top Glow Aura */}
        <Path
          d="M0,0 L390,0 L390,260 C310,290 200,220 120,240 C50,260 0,300 0,300 Z"
          fill="url(#meshAura)"
        />

        {/* Fluid Organic Loop 1 (FlyHire Ribbon Art) */}
        <Path
          d="M280,-40 C340,80 320,180 220,190 C120,200 80,290 140,360 C180,410 280,420 360,390"
          fill="none"
          stroke="url(#ribbonGrad1)"
          strokeWidth={40}
          strokeLinecap="round"
        />

        {/* Fluid Organic Loop 2 (Secondary counter-curve) */}
        <Path
          d="M-30,120 C80,110 160,210 110,280 C60,350 140,430 220,440"
          fill="none"
          stroke="url(#ribbonGrad2)"
          strokeWidth={24}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
