import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";
import {
  Star,
  ArrowUpRight,
  CheckCircle2,
  Award,
  ShieldCheck,
  Briefcase,
} from "lucide-react-native";

export function TalentBentoCard({
  talent = {},
  onPress,
  variant = "standard",
}) {
  const [imgError, setImgError] = useState(false);
  const isFeatured = variant === "featured" || variant === "lime";

  const talentName = talent.nama_lengkap || talent.name || "Talenta Mahasiswa";
  const initial = talentName ? talentName.charAt(0).toUpperCase() : "M";
  const prodiText = talent.prodi || "Sistem Informasi";
  const ratingScore =
    talent.rating_avg != null
      ? Number(talent.rating_avg).toFixed(1)
      : talent.rating?.toFixed(1) || "5.0";
  const completedJobs =
    talent.total_proyek_selesai != null
      ? talent.total_proyek_selesai
      : talent.totalJobs || 0;
  const skillsList =
    Array.isArray(talent.skills) && talent.skills.length > 0
      ? talent.skills
      : ["Digital Solution", "Figma", "UI/UX"];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        isFeatured ? styles.cardFeatured : styles.cardStandard,
      ]}
    >
      {/* Top Banner Tag for Featured Talent */}
      {isFeatured && (
        <View style={styles.featuredBadgeRow}>
          <View style={styles.featuredBadgePill}>
            <Award size={11} color="#B45309" />
            <Text style={styles.featuredBadgeText}>TALENTA UNGGULAN</Text>
          </View>
          <View style={styles.escrowTrustTag}>
            <ShieldCheck size={11} color={COLORS.brandIndigo} />
            <Text style={styles.escrowTrustText}>100% Escrow Sukses</Text>
          </View>
        </View>
      )}

      {/* Profile Info Header */}
      <View style={styles.headerRow}>
        <View style={styles.avatarContainer}>
          {talent.url_foto && !imgError ? (
            <Image
              source={{ uri: talent.url_foto }}
              style={styles.avatarImage}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitialText}>{initial}</Text>
            </View>
          )}
          <View style={styles.verifiedDotBadge}>
            <CheckCircle2 size={12} color="#FFFFFF" fill={COLORS.success} />
          </View>
        </View>

        <View style={styles.headerMetaCol}>
          <Text style={styles.talentName} numberOfLines={1}>
            {talentName}
          </Text>
          <Text style={styles.prodiText} numberOfLines={1}>
            {prodiText}
          </Text>
        </View>

        <View style={styles.ratingPill}>
          <Star size={11} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingScoreText}>{ratingScore}</Text>
        </View>
      </View>

      {/* Bio snippet if available */}
      {talent.bio ? (
        <Text style={styles.bioSnippet} numberOfLines={2}>
          {talent.bio}
        </Text>
      ) : null}

      {/* Skills Chips */}
      <View style={styles.skillsRow}>
        {skillsList.slice(0, 3).map((skill, idx) => (
          <View key={idx} style={styles.skillPill}>
            <Text style={styles.skillPillText} numberOfLines={1}>
              {skill}
            </Text>
          </View>
        ))}
        {skillsList.length > 3 && (
          <View style={styles.skillMorePill}>
            <Text style={styles.skillMoreText}>+{skillsList.length - 3}</Text>
          </View>
        )}
      </View>

      {/* Bottom Row: Metric + Action Button */}
      <View style={styles.bottomRow}>
        <View style={styles.statsCol}>
          <View style={styles.statItemRow}>
            <Briefcase size={12} color={COLORS.textMuted} />
            <Text style={styles.statItemText}>
              <Text style={styles.statItemNumber}>{completedJobs}</Text> Proyek
              Tuntas
            </Text>
          </View>
        </View>

        <View style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Portofolio</Text>
          <ArrowUpRight size={13} color="#FFFFFF" strokeWidth={2.5} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardFeatured: {
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },
  cardStandard: {
    borderWidth: 1.2,
    borderColor: "rgba(226, 232, 240, 0.9)",
  },
  featuredBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  featuredBadgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  featuredBadgeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 9.5,
    color: "#92400E",
    letterSpacing: 0.5,
  },
  escrowTrustTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  escrowTrustText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.brandIndigo,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitialText: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    color: COLORS.brandIndigo,
  },
  verifiedDotBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
  },
  headerMetaCol: {
    flex: 1,
    marginRight: 8,
  },
  talentName: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  prodiText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  ratingScoreText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#B45309",
    fontVariant: ["tabular-nums"],
  },
  bioSnippet: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#475569",
    lineHeight: 16.5,
    marginBottom: 10,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  skillPill: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  skillPillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    color: "#334155",
  },
  skillMorePill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  skillMoreText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.brandIndigo,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  statsCol: {
    flex: 1,
  },
  statItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statItemText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  statItemNumber: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 12,
    paddingVertical: 6.5,
    borderRadius: 14,
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
  },
  actionBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11.5,
    color: "#FFFFFF",
  },
});
