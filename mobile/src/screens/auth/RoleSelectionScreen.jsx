import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
} from "react-native-svg";
import { FONTS } from "../../theme/fonts";
import { Briefcase, Users, ArrowLeft, CheckCircle2 } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export function RoleSelectionScreen({ navigation }) {
  // 'MAHASISWA' (Find a job) | 'UMKM' (Hire talent)
  const [selectedRole, setSelectedRole] = useState("MAHASISWA");

  const handleContinue = () => {
    navigation.navigate("Register", { role: selectedRole });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Background Soft Pastel Glow Graphic */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient
              id="bgGlowRole"
              cx="50%"
              cy="25%"
              rx="60%"
              ry="40%"
              fx="50%"
              fy="25%"
            >
              <Stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.4" />
              <Stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#FAFAFA" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="#FAFAFA" />
          <Rect x="0" y="0" width={width} height={height} fill="url(#bgGlowRole)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Top Bar with Back & Logo */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <View style={styles.logoInnerDot} />
              </View>
              <Text style={styles.logoText}>Makarya</Text>
            </View>
          </View>

          {/* Center Graphic */}
          <View style={styles.centerGraphicWrap}>
            <Svg width={180} height={160} viewBox="0 0 200 200">
              <Defs>
                <LinearGradient id="starGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#38BDF8" />
                  <Stop offset="50%" stopColor="#818CF8" />
                  <Stop offset="100%" stopColor="#EC4899" />
                </LinearGradient>
              </Defs>
              <Path
                d="M 100,15 Q 100,100 185,100 Q 100,100 100,185 Q 100,100 15,100 Q 100,100 100,15 Z"
                fill="url(#starGlow)"
                opacity="0.85"
              />
            </Svg>
          </View>

          {/* Headline */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.titleText}>What's your goal?</Text>
            <Text style={styles.subtitleText}>
              Choose your path so we can show you the most relevant opportunities.
            </Text>
          </View>

          {/* 2 Choice Cards (Side by Side / Two columns) */}
          <View style={styles.cardsRow}>
            {/* Card 1: Find a job (Mahasiswa) */}
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === "MAHASISWA" && styles.roleCardActive,
              ]}
              onPress={() => setSelectedRole("MAHASISWA")}
              activeOpacity={0.85}
            >
              {selectedRole === "MAHASISWA" && (
                <View style={styles.activeCheckBadge}>
                  <CheckCircle2 size={14} color="#6366F1" />
                </View>
              )}
              <View style={styles.cardIconBox}>
                <Briefcase size={24} color="#6366F1" />
              </View>
              <Text style={styles.cardTitle}>Find a job</Text>
              <Text style={styles.cardSub}>
                Find your next opportunity & earn honors
              </Text>
              <View style={styles.roleTagPill}>
                <Text style={styles.roleTagText}>Mahasiswa</Text>
              </View>
            </TouchableOpacity>

            {/* Card 2: Hire talent (UMKM) */}
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === "UMKM" && styles.roleCardActive,
              ]}
              onPress={() => setSelectedRole("UMKM")}
              activeOpacity={0.85}
            >
              {selectedRole === "UMKM" && (
                <View style={styles.activeCheckBadge}>
                  <CheckCircle2 size={14} color="#6366F1" />
                </View>
              )}
              <View style={styles.cardIconBox}>
                <Users size={24} color="#6366F1" />
              </View>
              <Text style={styles.cardTitle}>Hire talent</Text>
              <Text style={styles.cardSub}>
                Post an opening to find verified talent
              </Text>
              <View style={styles.roleTagPill}>
                <Text style={styles.roleTagText}>Klien UMKM</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleContinue}
              activeOpacity={0.88}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: "space-between",
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  logoInnerDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#6366F1",
  },
  logoText: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
  },

  centerGraphicWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },

  // Header Text
  headerTextBlock: {
    marginBottom: 16,
  },
  titleText: {
    fontFamily: FONTS.displayBold,
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitleText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: "#64748B",
    lineHeight: 19,
  },

  // Cards Row
  cardsRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: "relative",
  },
  roleCardActive: {
    borderColor: "#6366F1",
    backgroundColor: "#F5F3FF", // Soft violet active tint
    shadowColor: "#6366F1",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  activeCheckBadge: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  cardSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    lineHeight: 16,
    marginBottom: 10,
  },
  roleTagPill: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleTagText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: "#475569",
    fontWeight: "600",
  },

  // Bottom Continue
  bottomBar: {
    marginTop: "auto",
  },
  continueBtn: {
    backgroundColor: "#6366F1",
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  continueBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
