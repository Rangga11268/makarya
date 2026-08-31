import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../theme/colors";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import { Calendar, Users } from "lucide-react-native";

export function ProjectCard({ project, onPress }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "OPEN":
      case "BIDDING":
        return <Badge label="Masa Penawaran" variant="lime" />;
      case "IN_PROGRESS":
        return <Badge label="Sedang Dikerjakan" variant="cyan" />;
      case "REVIEW":
        return <Badge label="Perlu Review" variant="warning" />;
      case "DONE":
      case "COMPLETED":
        return <Badge label="Selesai" variant="success" />;
      default:
        return <Badge label={formatStatus(status)} variant="dark" />;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        {getStatusBadge(project.status)}
        <Text style={styles.budget}>{formatCurrency(project.budget_max)}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {project.judul}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {project.deskripsi_raw}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Calendar size={13} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{formatDate(project.deadline)}</Text>
        </View>

        <View style={styles.metaItem}>
          <Users size={13} color={COLORS.brandCyan} />
          <Text
            style={[
              styles.metaText,
              { color: COLORS.brandCyan, fontWeight: "700" },
            ]}
          >
            {project.total_pelamar || 0} Pelamar
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  budget: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.brandIndigo,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
