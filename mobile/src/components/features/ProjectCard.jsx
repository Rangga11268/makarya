import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { Users, Clock, ChevronRight, Check } from "lucide-react-native";

const getCategoryLabel = (cat) => {
  switch (cat) {
    case "DESIGN":
      return "Desain Grafis";
    case "UIUX":
      return "UI/UX Design";
    case "PEMROGRAMAN":
      return "Web & Coding";
    case "VIDEO":
      return "Video & Reels";
    case "COPYWRITING":
      return "Copywriting";
    case "ADMIN_DATA":
      return "Admin & Data";
    default:
      return cat || "Proyek Digital";
  }
};

const getRemainingDaysInfo = (deadlineStr) => {
  if (!deadlineStr) return null;
  const deadline = new Date(deadlineStr);
  if (isNaN(deadline.getTime())) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate(),
  );
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: "Berakhir", isUrgent: true };
  if (diffDays === 0) return { text: "Hari ini", isUrgent: true };
  if (diffDays === 1) return { text: "Sisa 1 hr", isUrgent: true };
  if (diffDays <= 5) return { text: `Sisa ${diffDays} hr`, isUrgent: true };
  if (diffDays <= 30) return { text: `Sisa ${diffDays} hr`, isUrgent: false };
  return { text: formatDate(deadlineStr), isUrgent: false };
};

export function ProjectCard({ project, onPress }) {
  const [imgError, setImgError] = useState(false);

  const isExpired =
    Boolean(
      project.deadline &&
      new Date(project.deadline) < new Date().setHours(0, 0, 0, 0),
    ) || project.status === "CANCELLED";

  const isTeam =
    project.tipe_kolaborasi === "TIM" ||
    (Array.isArray(project.slots) && project.slots.length > 1);
  const slotsCount = Array.isArray(project.slots) ? project.slots.length : 0;

  const rawClientName =
    project.umkm_nama ||
    project.umkm_profile?.nama_usaha ||
    project.client_name ||
    project.nama_usaha;
  const clientName =
    rawClientName && rawClientName.toLowerCase() !== "string"
      ? rawClientName
      : "Klien UMKM";
  const clientInitial = clientName ? clientName.charAt(0).toUpperCase() : "K";
  const clientPhoto =
    project.umkm_profile?.url_foto_usaha ||
    project.umkm_profile?.url_foto ||
    project.umkm_foto ||
    project.url_foto;

  const clientCity = project.umkm_profile?.kota;
  const deadlineInfo = getRemainingDaysInfo(project.deadline);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, isExpired && styles.cardExpired]}
    >
      {/* 1. Header: Client Info & Status Accent */}
      <View style={styles.headerRow}>
        <View style={styles.clientGroup}>
          {clientPhoto && !imgError ? (
            <Image
              source={{ uri: clientPhoto }}
              style={styles.clientAvatarImage}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={styles.clientAvatarFallback}>
              <Text style={styles.clientAvatarText}>{clientInitial}</Text>
            </View>
          )}

          <Text style={styles.clientNameText} numberOfLines={1}>
            {clientName}
          </Text>
          {clientCity ? (
            <>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.clientCityText} numberOfLines={1}>
                {clientCity}
              </Text>
            </>
          ) : null}
        </View>

        {isExpired ? (
          <View style={styles.statusExpiredPill}>
            <Text style={styles.statusExpiredText}>
              {project.status === "CANCELLED" ? "Dibatalkan" : "Berakhir"}
            </Text>
          </View>
        ) : project.match_score ? (
          <View style={styles.matchBadge}>
            <Check size={10} color="#059669" strokeWidth={2.5} />
            <Text style={styles.matchBadgeText}>{project.match_score}%</Text>
          </View>
        ) : null}
      </View>

      {/* 2. Project Title */}
      <Text style={styles.title} numberOfLines={2}>
        {project.judul}
      </Text>

      {/* 3. Metadata Inline Row (Category • Collab • Deadline) */}
      <View style={styles.metadataRow}>
        <Text style={styles.categoryText}>
          {getCategoryLabel(project.kategori)}
        </Text>

        <Text style={styles.metaDot}>•</Text>

        {isTeam ? (
          <View style={styles.inlineTeamTag}>
            <Users size={11} color="#6D28D9" />
            <Text style={styles.teamTagText}>
              {slotsCount > 1 ? `Tim (${slotsCount} peran)` : "Tim"}
            </Text>
          </View>
        ) : (
          <Text style={styles.metaSubtleText}>Individu</Text>
        )}

        {deadlineInfo ? (
          <>
            <Text style={styles.metaDot}>•</Text>
            <View style={styles.inlineDeadlineContainer}>
              <Clock
                size={11}
                color={deadlineInfo.isUrgent ? "#E11D48" : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.deadlineText,
                  deadlineInfo.isUrgent && styles.deadlineTextUrgent,
                ]}
              >
                {deadlineInfo.text}
              </Text>
            </View>
          </>
        ) : null}
      </View>

      {/* 4. Footer: Budget & Applicants */}
      <View style={styles.footerRow}>
        <Text style={styles.budgetValue}>
          {formatCurrency(project.budget_max)}
        </Text>

        <View style={styles.footerRight}>
          <Text style={styles.applicantText}>
            {project.total_pelamar || 0} pelamar
          </Text>
          <ChevronRight size={14} color={COLORS.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 13,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    marginBottom: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: Platform.OS === "android" ? 1 : 2,
  },
  cardExpired: {
    opacity: 0.75,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  clientGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  clientAvatarImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(15, 23, 42, 0.04)",
  },
  clientAvatarFallback: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  clientAvatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 9.5,
    color: COLORS.brandIndigo,
  },
  clientNameText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: COLORS.textSecondary,
    maxWidth: "55%",
  },
  clientCityText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    flexShrink: 1,
  },
  metaDot: {
    fontSize: 10,
    color: "rgba(15, 23, 42, 0.25)",
  },
  statusExpiredPill: {
    backgroundColor: "#FFF1F2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusExpiredText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 9.5,
    color: "#E11D48",
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2.5,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
  },
  matchBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9.5,
    color: "#059669",
  },
  title: {
    fontFamily: FONTS.headingBold,
    fontSize: 14.5,
    color: COLORS.textDark,
    lineHeight: 20,
    letterSpacing: -0.2,
    marginBottom: 8,
  },
  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  categoryText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.brandIndigo,
  },
  metaSubtleText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  inlineTeamTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
  },
  teamTagText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#6D28D9",
  },
  inlineDeadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  deadlineText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  deadlineTextUrgent: {
    fontFamily: FONTS.bodyMedium,
    color: "#E11D48",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: "rgba(15, 23, 42, 0.05)",
  },
  budgetValue: {
    fontFamily: FONTS.headingBold,
    fontSize: 14,
    color: COLORS.textDark,
    letterSpacing: -0.2,
    fontVariant: ["tabular-nums"],
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  applicantText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
