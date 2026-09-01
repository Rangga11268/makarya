import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import {
  Calendar,
  Users,
  ShieldCheck,
  ArrowRight,
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

  const getCategoryLabel = (kategori) => {
    switch (kategori) {
      case "DESIGN":
        return "Desain & Logo";
      case "UIUX":
        return "UI/UX App";
      case "PEMROGRAMAN":
        return "Web & Coding";
      case "VIDEO":
        return "Video Reels";
      case "COPYWRITING":
        return "Copywriting";
      case "ADMIN_DATA":
        return "Admin & Data";
      default:
        return kategori || "Digital UMKM";
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      {/* Top row: Status Badge & Escrow Seal */}
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          {getStatusBadge(project.status)}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>
              {getCategoryLabel(project.kategori)}
            </Text>
          </View>
        </View>

        <View style={styles.escrowChip}>
          <ShieldCheck size={12} color={COLORS.brandCyan} />
          <Text style={styles.escrowText}>Escrow</Text>
        </View>
      </View>

      {/* Project Title */}
      <Text style={styles.title} numberOfLines={2}>
        {project.judul}
      </Text>

      {/* Description Snippet */}
      {project.deskripsi_raw ? (
        <Text style={styles.description} numberOfLines={2}>
          {project.deskripsi_raw}
        </Text>
      ) : null}

      {/* Footer Info: Budget + Applicants & Deadline */}
      <View style={styles.footerRow}>
        <View>
          <Text style={styles.budgetLabel}>Pagu Anggaran</Text>
          <Text style={styles.budget}>{formatCurrency(project.budget_max)}</Text>
        </View>

        <View style={styles.rightMeta}>
          <View style={styles.metaItem}>
            <Users size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}>
              {project.total_pelamar || 0} Pelamar
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Calendar size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{formatDate(project.deadline)}</Text>
          </View>
        </View>
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  categoryPill: {
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  escrowChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.brandCyanLight,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  escrowText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.brandCyan,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
    lineHeight: 21,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    paddingTop: 10,
  },
  budgetLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  budget: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.brandIndigo,
    letterSpacing: -0.3,
    marginTop: 1,
  },
  rightMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
});
