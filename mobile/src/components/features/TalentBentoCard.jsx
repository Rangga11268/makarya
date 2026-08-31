import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../theme/colors";
import { Badge } from "../ui/Badge";
import { Star, GraduationCap, ArrowUpRight } from "lucide-react-native";
import { formatCurrency } from "../../utils/formatCurrency";

export function TalentBentoCard({ talent, onPress, variant = "lime" }) {
  const isLime = variant === "lime";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        isLime ? styles.cardLime : styles.cardDark,
      ]}
    >
      {/* Top row: Avatar + Name + Rating */}
      <View style={styles.topRow}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {talent.name ? talent.name.charAt(0) : "M"}
          </Text>
        </View>
        <View style={styles.info}>
          <Text
            style={[styles.name, isLime ? styles.textDark : styles.textWhite]}
            numberOfLines={1}
          >
            {talent.name}
          </Text>
          <Text style={[styles.prodi, isLime ? styles.textDim : styles.textMuted]}>
            {talent.prodi}
          </Text>
        </View>
        <View style={styles.ratingBadge}>
          <Star size={12} color="#000" fill="#000" />
          <Text style={styles.ratingText}>{talent.rating?.toFixed(1) || "5.0"}</Text>
        </View>
      </View>

      {/* Role / Expertise */}
      <View style={styles.roleContainer}>
        <Text style={[styles.roleLabel, isLime ? styles.textDim : styles.textMuted]}>
          Keahlian Utama
        </Text>
        <Text style={[styles.roleValue, isLime ? styles.textDark : styles.textWhite]}>
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
              isLime ? styles.skillChipLime : styles.skillChipDark,
            ]}
          >
            <Text style={[styles.skillText, isLime ? styles.textDark : styles.textWhite]}>
              {s}
            </Text>
          </View>
        ))}
      </View>

      {/* Bottom Row: Stats & Action */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={[styles.statLabel, isLime ? styles.textDim : styles.textMuted]}>
            Proyek Selesai
          </Text>
          <Text style={[styles.statValue, isLime ? styles.textDark : styles.textWhite]}>
            {talent.totalJobs || 0} Proyek
          </Text>
        </View>

        <View style={[styles.actionBtn, isLime ? styles.actionBtnDark : styles.actionBtnLime]}>
          <Text style={[styles.actionText, isLime ? styles.textWhite : styles.textDark]}>
            Lihat Profil
          </Text>
          <ArrowUpRight size={14} color={isLime ? COLORS.textWhite : COLORS.textDark} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    padding: 18,
    marginBottom: 14,
  },
  cardLime: {
    backgroundColor: COLORS.accentLime,
  },
  cardDark: {
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
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
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  prodi: {
    fontSize: 11,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000",
  },
  roleContainer: {
    marginVertical: 6,
  },
  roleLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  roleValue: {
    fontSize: 18,
    fontWeight: "900",
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
  skillChipLime: {
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  skillChipDark: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  skillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 13,
    fontWeight: "800",
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
  actionBtnDark: {
    backgroundColor: COLORS.bgDark,
  },
  actionBtnLime: {
    backgroundColor: COLORS.accentLime,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "800",
  },
  textWhite: {
    color: COLORS.textWhite,
  },
  textDark: {
    color: COLORS.textDark,
  },
  textMuted: {
    color: COLORS.textMuted,
  },
  textDim: {
    color: "rgba(0,0,0,0.6)",
  },
});