import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Star, Briefcase, ShieldCheck, CheckCircle2, Heart, MessageSquare } from "lucide-react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { PebbleButton } from "../ui/PebbleButton";

export function TalentDeckCard({
  talent,
  onPress,
  onChat,
  onBookmark,
  isBookmarked = false,
}) {
  if (!talent) return null;

  const displayName =
    talent.nama_lengkap ||
    talent.nama ||
    talent.name ||
    talent.user?.name ||
    "Mahasiswa Berprestasi";

  const avatarUrl = talent.url_foto || talent.user?.url_foto;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "M";

  const prodiText = talent.prodi || "Sistem Informasi";
  const university =
    talent.universitas || "Universitas Bina Sarana Informatika";

  const rating =
    talent.rating_avg != null
      ? Number(talent.rating_avg).toFixed(1)
      : talent.rating != null
        ? Number(talent.rating).toFixed(1)
        : "5.0";

  const completedProjects =
    talent.total_proyek_selesai != null
      ? talent.total_proyek_selesai
      : talent.totalJobs || 0;

  const skillsList =
    Array.isArray(talent.skills) && talent.skills.length > 0
      ? talent.skills
      : ["UI/UX Design", "Mobile App", "Web Coding"];

  const specialty = skillsList.slice(0, 2).join(" • ");

  return (
    <View style={styles.deckContainer}>
      {/* 1. Perspective Background Deck Layers (The Signature FlyHire Stacked Aesthetic) */}
      <View style={[styles.deckLayer, styles.deckLayer2]} pointerEvents="none" />
      <View style={[styles.deckLayer, styles.deckLayer1]} pointerEvents="none" />

      {/* 2. Top Interactive Card */}
      <TouchableOpacity
        style={styles.mainCard}
        onPress={onPress}
        activeOpacity={0.92}
      >
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.avatarGroup}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarInitialWrap}>
                <Text style={styles.avatarInitialText}>{initial}</Text>
              </View>
            )}
            <View style={styles.verifiedDot}>
              <CheckCircle2 size={13} color="#FFFFFF" fill="#059669" />
            </View>
          </View>

          {/* Quick Action Pills on Top Right */}
          <View style={styles.topActionsRow}>
            {onChat && (
              <TouchableOpacity
                style={styles.topIconCircle}
                onPress={onChat}
                activeOpacity={0.75}
              >
                <MessageSquare size={15} color="#334155" />
              </TouchableOpacity>
            )}
            {onBookmark && (
              <TouchableOpacity
                style={[
                  styles.topIconCircle,
                  isBookmarked && { backgroundColor: "#FEE2E2", borderColor: "#FECACA" },
                ]}
                onPress={onBookmark}
                activeOpacity={0.75}
              >
                <Heart
                  size={15}
                  color={isBookmarked ? "#EF4444" : "#334155"}
                  fill={isBookmarked ? "#EF4444" : "none"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Talent Identity & Title */}
        <View style={styles.nameBlock}>
          <Text style={styles.talentName} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.talentUniversity} numberOfLines={1}>
            {prodiText} • {university}
          </Text>
        </View>

        {/* Ergonomic Pill Tags Row (FlyHire Metatags Concept) */}
        <View style={styles.pillChipsRow}>
          <View style={styles.pillChip}>
            <Star size={12} color="#D97706" fill="#F59E0B" />
            <Text style={styles.pillChipText}>{rating}</Text>
          </View>

          <View style={styles.pillChip}>
            <Briefcase size={11} color="#475569" />
            <Text style={styles.pillChipText}>
              {completedProjects} Proyek Tuntas
            </Text>
          </View>

          <View style={styles.pillChip}>
            <ShieldCheck size={12} color="#0284C7" />
            <Text style={[styles.pillChipText, { color: "#0284C7" }]}>
              Escrow Siap
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.cardDivider} />

        {/* Bottom Section: Specialty, Status & Action Button */}
        <View style={styles.bottomSection}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.specialtyLabel} numberOfLines={1}>
              {specialty}
            </Text>
            <Text style={styles.statusSubtext}>
              Siap Kolaborasi UMKM
            </Text>
          </View>

          <PebbleButton
            variant="sapphire"
            size="sm"
            label="Lihat Profil"
            onPress={onPress}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  deckContainer: {
    width: "100%",
    marginVertical: 8,
    alignItems: "center",
    position: "relative",
  },
  deckLayer: {
    position: "absolute",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
  },
  deckLayer2: {
    width: "90%",
    height: "100%",
    bottom: -10,
    backgroundColor: "#E2E8F0",
    opacity: 0.45,
    zIndex: 1,
  },
  deckLayer1: {
    width: "95%",
    height: "100%",
    bottom: -5,
    backgroundColor: "#F1F5F9",
    opacity: 0.75,
    zIndex: 2,
  },
  mainCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.2,
    borderColor: "rgba(226, 232, 240, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    zIndex: 3,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  avatarGroup: {
    position: "relative",
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E2E8F0",
  },
  avatarInitialWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
    borderColor: "#BFDBFE",
  },
  avatarInitialText: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  verifiedDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  topActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  topIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  nameBlock: {
    marginBottom: 12,
  },
  talentName: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  talentUniversity: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  pillChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  pillChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pillChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 14,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  specialtyLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusSubtext: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
});
