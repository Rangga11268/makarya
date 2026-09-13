import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
} from "react-native-svg";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";
import {
  Briefcase,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Users,
} from "lucide-react-native";
import { PebbleButton } from "../../components/ui/PebbleButton";

import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";

const STATUSBAR_OFFSET =
  Platform.OS === "android" ? (StatusBar.currentHeight || 28) + 14 : 14;

export function RoleSelectionScreen({ navigation }) {
  const { width, height, authContainerStyle } = useResponsiveLayout();
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

      {/* Apple Soft Ambient Background (Fluentify / iOS style) */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient
              id="roleAtmosphereTop"
              cx="78%"
              cy="8%"
              rx="65%"
              ry="35%"
              fx="78%"
              fy="8%"
            >
              <Stop offset="0%" stopColor="#DBEAFE" stopOpacity="0.75" />
              <Stop offset="55%" stopColor="#E0E7FF" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient
              id="roleAtmosphereMid"
              cx="15%"
              cy="28%"
              rx="55%"
              ry="32%"
              fx="15%"
              fy="28%"
            >
              <Stop offset="0%" stopColor="#E0EAFF" stopOpacity="0.5" />
              <Stop offset="60%" stopColor="#F1F5F9" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="#F8FAFC" />
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#roleAtmosphereTop)"
          />
          <Rect
            x="0"
            y="0"
            width={width}
            height={height}
            fill="url(#roleAtmosphereMid)"
          />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, authContainerStyle]}>
          {/* Top Bar with Back Button & Official Logo */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.logoRow}>
              <Image
                source={require("../../../assets/logo-icon.webp")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>Makarya</Text>
            </View>
          </View>

          {/* Center Graphic */}
          <View style={styles.centerGraphicWrap}>
            <Svg width={170} height={150} viewBox="0 0 200 200">
              <Defs>
                <LinearGradient
                  id="starGlowMakarya"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <Stop offset="0%" stopColor="#38BDF8" />
                  <Stop offset="50%" stopColor="#6366F1" />
                  <Stop offset="100%" stopColor="#0F172A" />
                </LinearGradient>
              </Defs>
              <Path
                d="M 100,15 Q 100,100 185,100 Q 100,100 100,185 Q 100,100 15,100 Q 100,100 100,15 Z"
                fill="url(#starGlowMakarya)"
                opacity="0.88"
              />
            </Svg>
          </View>

          {/* Headline */}
          <View style={styles.headerTextBlock}>
            <Text style={styles.titleText}>Pilih Tujuan Anda</Text>
            <Text style={styles.subtitleText}>
              Tentukan bagaimana Anda ingin berkolaborasi di ekosistem Makarya
              untuk menampilkan peluang proyek yang paling relevan.
            </Text>
          </View>

          {/* 2 Choice Cards (Side by Side) */}
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
                  <CheckCircle2 size={16} color="#0F172A" />
                </View>
              )}
              <View
                style={[
                  styles.cardIconBox,
                  selectedRole === "MAHASISWA" && styles.cardIconBoxActive,
                ]}
              >
                <Briefcase
                  size={22}
                  color={selectedRole === "MAHASISWA" ? "#0F172A" : "#64748B"}
                />
              </View>
              <Text style={styles.cardTitle}>Find a job</Text>
              <Text style={styles.cardSub}>
                Cari peluang pengerjaan proyek & raih honor
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
                  <CheckCircle2 size={16} color="#0F172A" />
                </View>
              )}
              <View
                style={[
                  styles.cardIconBox,
                  selectedRole === "UMKM" && styles.cardIconBoxActive,
                ]}
              >
                <Users
                  size={22}
                  color={selectedRole === "UMKM" ? "#0F172A" : "#64748B"}
                />
              </View>
              <Text style={styles.cardTitle}>Hire talent</Text>
              <Text style={styles.cardSub}>
                Pasang proyek bisnis & rekrut talenta kampus
              </Text>
              <View style={styles.roleTagPill}>
                <Text style={styles.roleTagText}>Klien UMKM</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Continue Button (3D Glossy Pebble) */}
          <View style={styles.bottomBar}>
            <PebbleButton
              variant="midnight"
              size="lg"
              title="Lanjutkan"
              onPress={handleContinue}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: STATUSBAR_OFFSET,
    paddingBottom: 28,
    justifyContent: "space-between",
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
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
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
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
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.2,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    position: "relative",
  },
  roleCardActive: {
    borderColor: "#0F172A",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 14,
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
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardIconBoxActive: {
    backgroundColor: "#EEF2FF",
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
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  roleTagText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#475569",
    fontWeight: "600",
  },

  // Bottom Continue (Apple Pill Style)
  bottomBar: {
    marginTop: "auto",
  },
  continueBtn: {
    backgroundColor: "#0F172A", // Signature Slate 900
    height: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
});
