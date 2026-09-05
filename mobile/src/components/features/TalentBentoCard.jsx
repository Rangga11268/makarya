import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FONTS } from "../../theme/fonts";
import { COLORS } from "../../theme/colors";
import { Star, ArrowUpRight } from "lucide-react-native";

export function TalentBentoCard({ talent, onPress, variant = "dark" }) {
  const isFeatured = variant === "lime" || variant === "featured";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        isFeatured ? styles.cardFeatured : styles.cardStandard,
      ]}
    >
      {/* Top row: Avatar + Name + Rating */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.avatarPlaceholder,
            isFeatured ? styles.avatarFeatured : styles.avatarStandard,
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              isFeatured
                ? styles.avatarTextFeatured
                : styles.avatarTextStandard,
            ]}
          >
            {talent.name ? talent.name.charAt(0) : "M"}
          </Text>
        </View>

        <View style={styles.info}>
          <Text
            style={[
              styles.name,
              isFeatured ? styles.textWhite : styles.textDark,
            ]}
            numberOfLines={1}
          >
            {talent.name}
          </Text>
          <Text
            style={[
              styles.prodi,
              isFeatured ? styles.textMutedFeatured : styles.textMuted,
            ]}
          >
            {talent.prodi}
          </Text>
        </View>

        <View
          style={[
            styles.ratingBadge,
            isFeatured
              ? styles.ratingBadgeFeatured
              : styles.ratingBadgeStandard,
          ]}
        >
          <Star
            size={12}
            color={isFeatured ? "#F59E0B" : "#F59E0B"}
            fill={isFeatured ? "#F59E0B" : "#F59E0B"}
          />
          <Text
            style={[
              styles.ratingText,
              isFeatured
                ? styles.ratingTextFeatured
                : styles.ratingTextStandard,
            ]}
          >
            {talent.rating?.toFixed(1) || "5.0"}
          </Text>
        </View>
      </View>

      {/* Role / Expertise */}
      <View style={styles.roleContainer}>
        <Text
          style={[
            styles.roleLabel,
            isFeatured ? styles.roleLabelFeatured : styles.roleLabelStandard,
          ]}
        >
          Keahlian Utama
        </Text>
        <Text
          style={[
            styles.roleValue,
            isFeatured ? styles.textWhite : styles.textDark,
          ]}
        >
          {talent.skills?.[0] || "Desain Grafis & Web"}
        </Text>
      </View>

      {/* Skills Chips */}
      <View style={styles.skillsRow}>
        {(talent.skills || []).slice(0, 3).map((s, idx) => (
          <View
            key={idx}
            style={[
              styles.skillChip,
              isFeatured ? styles.skillChipFeatured : styles.skillChipStandard,
            ]}
          >
            <Text
              style={[
                styles.skillText,
                isFeatured
                  ? styles.skillTextFeatured
                  : styles.skillTextStandard,
              ]}
            >
              {s}
            </Text>
          </View>
        ))}
      </View>

      {/* Bottom Row: Stats & Action */}
      <View
        style={[
          styles.bottomRow,
          isFeatured ? styles.bottomRowFeatured : styles.bottomRowStandard,
        ]}
      >
        <View>
          <Text
            style={[
              styles.statLabel,
              isFeatured ? styles.statLabelFeatured : styles.statLabelStandard,
            ]}
          >
            Proyek Selesai
          </Text>
          <Text
            style={[
              styles.statValue,
              isFeatured ? styles.textWhite : styles.textDark,
            ]}
          >
            {talent.totalJobs || 0} Proyek
          </Text>
        </View>

        <View
          style={[
            styles.actionBtn,
            isFeatured ? styles.actionBtnFeatured : styles.actionBtnStandard,
          ]}
        >
          <Text
            style={[
              styles.actionText,
              isFeatured
                ? styles.actionTextFeatured
                : styles.actionTextStandard,
            ]}
          >
            Lihat Profil
          </Text>
          <ArrowUpRight
            size={14}
            color={isFeatured ? COLORS.brandIndigo : "#FFFFFF"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
  },
  cardFeatured: {
    backgroundColor: COLORS.brandIndigo, // Deep Brand Indigo card
  },
  cardStandard: {
    backgroundColor: COLORS.bgSurface, // Crisp white card
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarFeatured: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  avatarStandard: {
    backgroundColor: COLORS.canvasSoft,
  },
  avatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
  },
  avatarTextFeatured: {
    color: "#FFFFFF",
  },
  avatarTextStandard: {
    color: COLORS.textDark,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    letterSpacing: -0.3,
  },
  prodi: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    marginTop: 2,
  },
  textWhite: {
    color: "#FFFFFF",
  },
  textDark: {
    color: COLORS.textDark,
  },
  textMutedFeatured: {
    color: "rgba(255, 255, 255, 0.75)",
  },
  textMuted: {
    color: COLORS.textMuted,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  ratingBadgeFeatured: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  ratingBadgeStandard: {
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  ratingText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
  },
  ratingTextFeatured: {
    color: "#FFFFFF",
  },
  ratingTextStandard: {
    color: COLORS.textDark,
  },
  roleContainer: {
    marginVertical: 4,
  },
  roleLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  roleLabelFeatured: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  roleLabelStandard: {
    color: COLORS.textMuted,
  },
  roleValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginVertical: 10,
  },
  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  skillChipFeatured: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  skillChipStandard: {
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  skillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
  },
  skillTextFeatured: {
    color: "#FFFFFF",
  },
  skillTextStandard: {
    color: COLORS.textDark,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  bottomRowFeatured: {
    borderTopColor: "rgba(255, 255, 255, 0.15)",
  },
  bottomRowStandard: {
    borderTopColor: COLORS.borderDark,
  },
  statLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
  },
  statLabelFeatured: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  statLabelStandard: {
    color: COLORS.textMuted,
  },
  statValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    marginTop: 1,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  actionBtnFeatured: {
    backgroundColor: "#FFFFFF", // Crisp white pill button inside featured indigo card
  },
  actionBtnStandard: {
    backgroundColor: COLORS.brandIndigo, // Brand Indigo pill button inside white card
  },
  actionText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
  },
  actionTextFeatured: {
    color: COLORS.brandIndigo, // Indigo text on white button
  },
  actionTextStandard: {
    color: "#FFFFFF", // Pure white text on Indigo button
  },
});
