import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Badge } from "../ui/Badge";
import { getCategorySkills } from "../../constants/categories";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import {
  Calendar,
  Users,
  ShieldCheck,
  Building2,
  Clock,
  Briefcase,
} from "lucide-react-native";

export function ProjectCard({ project, onPress }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "OPEN":
      case "BIDDING":
        return <Badge label="Bidding Terbuka" variant="brand" />;
      case "IN_PROGRESS":
        return <Badge label="Sedang Dikerjakan" variant="cyan" />;
      case "REVIEW":
        return <Badge label="Review Hasil" variant="warning" />;
      case "DONE":
      case "COMPLETED":
        return <Badge label="Selesai" variant="success" />;
      default:
        return <Badge label={formatStatus(status)} variant="dark" />;
    }
  };

  const skillPills = getCategorySkills(project.kategori);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      {/* 1. Client Header: Avatar + Client Name + Time ago */}
      <View style={styles.clientHeader}>
        <View style={styles.clientAvatar}>
          <Text style={styles.clientAvatarText}>
            {project.umkm_nama ? project.umkm_nama.charAt(0) : "K"}
          </Text>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>
            {project.umkm_nama || "Klien UMKM Terverifikasi"}
          </Text>
          <Text style={styles.postedTime}>
            Tenggat: {formatDate(project.deadline)}
          </Text>
        </View>

        <View style={styles.escrowChip}>
          <ShieldCheck size={12} color={COLORS.brandCyan} />
          <Text style={styles.escrowText}>Escrow</Text>
        </View>
      </View>

      {/* 2. Project Title */}
      <Text style={styles.title} numberOfLines={2}>
        {project.judul}
      </Text>

      {/* 3. Two-Column Specs Grid (Budget & Level) */}
      <View style={styles.specsGrid}>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Pagu Anggaran</Text>
          <Text style={styles.specBudgetValue}>
            {formatCurrency(project.budget_max)}
          </Text>
        </View>

        <View style={styles.specItemRight}>
          <Text style={styles.specLabel}>Pelamar Aktif</Text>
          <View style={styles.applicantRow}>
            <Users size={12} color={COLORS.textMuted} />
            <Text style={styles.specLevelValue}>
              {project.total_pelamar || 0} Mahasiswa
            </Text>
          </View>
        </View>
      </View>

      {/* 4. Skill Tags Pills */}
      <View style={styles.skillsRow}>
        {skillPills.map((skill, idx) => (
          <View key={idx} style={styles.skillPill}>
            <Text style={styles.skillPillText}>{skill}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  clientHeader: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  clientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  clientAvatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  postedTime: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  escrowChip: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.brandCyanLight,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  escrowText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.brandCyan,
  },
  title: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.3,
    lineHeight: 21,
    marginBottom: 12,
  },
  specsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  specItem: {
    flex: 1,
  },
  specItemRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  specLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    fontWeight: "600",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  specBudgetValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  applicantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specLevelValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillPill: {
    fontFamily: FONTS.bodyRegular,
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  skillPillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
});
