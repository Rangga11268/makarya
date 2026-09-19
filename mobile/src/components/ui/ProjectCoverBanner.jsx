import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
} from "react-native-svg";
import {
  Palette,
  Layout,
  Code2,
  Video,
  PenTool,
  Database,
  Briefcase,
} from "lucide-react-native";
import { FONTS } from "../../theme/fonts";

export function ProjectCoverBanner({
  src,
  category = "DESIGN",
  title = "Proyek Makarya",
  style,
  height = 200,
  children,
}) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const getCategoryConfig = (cat) => {
    const c = String(cat || "").toUpperCase();
    switch (c) {
      case "DESIGN":
      case "DESAIN":
        return {
          id: "gradDesign",
          colors: ["#2e1065", "#1e1b4b", "#0f172a"],
          orb1: "rgba(168, 85, 247, 0.18)",
          orb2: "rgba(99, 102, 241, 0.15)",
          icon: <Palette size={56} color="rgba(216, 180, 254, 0.28)" />,
          label: "Desain Grafis",
        };
      case "UIUX":
        return {
          id: "gradUiux",
          colors: ["#881337", "#4c0519", "#0f172a"],
          orb1: "rgba(244, 63, 94, 0.18)",
          orb2: "rgba(168, 85, 247, 0.15)",
          icon: <Layout size={56} color="rgba(253, 164, 175, 0.28)" />,
          label: "UI/UX Design",
        };
      case "PEMROGRAMAN":
      case "WEB":
        return {
          id: "gradCode",
          colors: ["#0c4a6e", "#032b44", "#020617"],
          orb1: "rgba(14, 165, 233, 0.18)",
          orb2: "rgba(6, 182, 212, 0.15)",
          icon: <Code2 size={56} color="rgba(125, 211, 252, 0.28)" />,
          label: "Web & Coding",
        };
      case "VIDEO":
        return {
          id: "gradVideo",
          colors: ["#78350f", "#451a03", "#0f172a"],
          orb1: "rgba(245, 158, 11, 0.18)",
          orb2: "rgba(234, 88, 12, 0.15)",
          icon: <Video size={56} color="rgba(252, 211, 77, 0.28)" />,
          label: "Video & Animasi",
        };
      case "COPYWRITING":
        return {
          id: "gradCopy",
          colors: ["#064e3b", "#022c22", "#020617"],
          orb1: "rgba(16, 185, 129, 0.18)",
          orb2: "rgba(20, 184, 166, 0.15)",
          icon: <PenTool size={56} color="rgba(110, 231, 183, 0.28)" />,
          label: "Copywriting",
        };
      case "ADMIN_DATA":
      case "ADMIN":
      default:
        return {
          id: "gradAdmin",
          colors: ["#1e1b4b", "#0f172a", "#020617"],
          orb1: "rgba(99, 102, 241, 0.18)",
          orb2: "rgba(59, 130, 246, 0.15)",
          icon: <Database size={56} color="rgba(165, 180, 252, 0.28)" />,
          label: "Admin & Data",
        };
    }
  };

  const config = getCategoryConfig(category);
  const showImage = Boolean(src) && !imgError;

  return (
    <View style={[styles.container, { height }, style]}>
      {showImage ? (
        <Image
          source={{ uri: src }}
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <View style={styles.svgFallback}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
            <Defs>
              <LinearGradient
                id={config.id}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor={config.colors[0]} />
                <Stop offset="50%" stopColor={config.colors[1]} />
                <Stop offset="100%" stopColor={config.colors[2]} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${config.id})`} />
            <Circle cx="85%" cy="20%" r="80" fill={config.orb1} />
            <Circle cx="15%" cy="80%" r="70" fill={config.orb2} />
          </Svg>

          {/* Center Watermark Category Icon */}
          <View style={styles.watermarkIconContainer}>{config.icon}</View>
        </View>
      )}

      {/* Dark Readability Bottom Gradient Overlay */}
      <View style={styles.bottomDarkOverlay} />

      {/* Category Tag Top-Left */}
      <View style={styles.categoryPill}>
        <Briefcase size={11} color="#FFFFFF" />
        <Text style={styles.categoryPillText}>
          {config.label
            ? config.label.toUpperCase()
            : String(category).toUpperCase()}
        </Text>
      </View>

      {/* Custom Children / Extra Badges */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.8)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  svgFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  watermarkIconContainer: {
    opacity: 0.85,
    transform: [{ scale: 1.2 }],
  },
  bottomDarkOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
    backgroundColor: "transparent",
  },
  categoryPill: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  categoryPillText: {
    fontSize: 10,
    fontFamily: FONTS.bodyBold,
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
