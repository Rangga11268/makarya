import React, { useState, useEffect } from "react";
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
import { Avatar } from "../ui/Avatar";

export const getCategoryBanner = (cat) => {
  switch (cat) {
    case "DESIGN":
    case "DESAIN":
      return "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000&auto=format&fit=crop&q=80";
    case "UIUX":
      return "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80";
    case "PEMROGRAMAN":
      return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80";
    case "VIDEO":
      return "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80";
    case "COPYWRITING":
      return "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop&q=80";
    case "ADMIN_DATA":
      return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80";
    default:
      return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80";
  }
};

const getCategoryLabel = (cat) => {
  switch (cat) {
    case "DESIGN":
    case "DESAIN":
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
  const [bannerError, setBannerError] = useState(false);

  const clientUploadedBanner =
    project.banner_url ||
    project.url_banner ||
    project.thumbnail_url ||
    project.umkm_profile?.banner_url ||
    project.umkm_profile?.url_foto_usaha;

  useEffect(() => {
    setBannerError(false);
  }, [project?.id, clientUploadedBanner]);

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

  const bannerUri =
    !bannerError &&
    (clientUploadedBanner || getCategoryBanner(project.kategori));

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, isExpired && styles.cardExpired]}
    >
      {/* 1. Cover Banner 16:9 Image with Overlays */}
      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: bannerUri || getCategoryBanner(project.kategori) }}
          style={styles.bannerImage}
          resizeMode="cover"
          onError={() => setBannerError(true)}
        />
        <View style={styles.bannerGradientOverlay} />

        {/* Top-left: Category Pill */}
        <View style={styles.bannerCategoryPill}>
          <Text style={styles.bannerCategoryText}>
            {getCategoryLabel(project.kategori)}
          </Text>
        </View>

        {/* Top-right: Status or Match score */}
        {isExpired ? (
          <View style={styles.bannerStatusExpiredPill}>
            <Text style={styles.bannerStatusExpiredText}>
              {project.status === "CANCELLED" ? "Dibatalkan" : "Berakhir"}
            </Text>
          </View>
        ) : project.match_score ? (
          <View style={styles.bannerMatchBadge}>
            <Check size={11} color="#059669" strokeWidth={2.5} />
            <Text style={styles.bannerMatchBadgeText}>
              {project.match_score}% Cocok
            </Text>
          </View>
        ) : null}

        {/* Bottom-right on Banner: Deadline Pill */}
        {deadlineInfo && !isExpired ? (
          <View
            style={[
              styles.bannerDeadlinePill,
              deadlineInfo.isUrgent && styles.bannerDeadlinePillUrgent,
            ]}
          >
            <Clock
              size={10.5}
              color={deadlineInfo.isUrgent ? "#E11D48" : "#FFFFFF"}
            />
            <Text
              style={[
                styles.bannerDeadlineText,
                deadlineInfo.isUrgent && styles.bannerDeadlineTextUrgent,
              ]}
            >
              {deadlineInfo.text}
            </Text>
          </View>
        ) : null}
      </View>

      {/* 2. Card Content Body */}
      <View style={styles.cardBody}>
        {/* Client Row */}
        <View style={styles.clientRow}>
          <Avatar
            src={clientPhoto}
            name={clientName}
            role="UMKM"
            size={22}
            style={{ marginRight: 6 }}
          />

          <Text style={styles.clientNameText} numberOfLines={1}>
            {clientName}
          </Text>
          {clientCity ? (
            <>
              <Text style={styles.metaSlash}>/</Text>
              <Text style={styles.clientCityText} numberOfLines={1}>
                {clientCity}
              </Text>
            </>
          ) : null}
        </View>

        {/* Project Title */}
        <Text style={styles.title} numberOfLines={2}>
          {project.judul}
        </Text>

        {/* Spec Chips (Team/Individu, Escrow) */}
        <View style={styles.metadataRow}>
          {isTeam ? (
            <View style={styles.teamChip}>
              <Users size={11} color="#6D28D9" />
              <Text style={styles.teamTagText}>
                {slotsCount > 1 ? `Tim (${slotsCount} peran)` : "Tim"}
              </Text>
            </View>
          ) : (
            <View style={styles.individuChip}>
              <Text style={styles.metaSubtleText}>Individu</Text>
            </View>
          )}

          <View style={styles.escrowChip}>
            <Text style={styles.escrowChipText}>100% Escrow</Text>
          </View>
        </View>

        {/* Footer: Budget & Applicants */}
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.budgetLabel}>ANGGARAN</Text>
            <Text style={styles.budgetValue}>
              {formatCurrency(project.budget_max)}
            </Text>
          </View>

          <View style={styles.footerRight}>
            <Text style={styles.applicantText}>
              {project.total_pelamar || 0} pelamar
            </Text>
            <ChevronRight size={14} color={COLORS.textMuted} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: Platform.OS === "android" ? 1 : 3,
  },
  cardExpired: {
    opacity: 0.75,
  },

  // 1. Cover Banner
  bannerContainer: {
    width: "100%",
    height: 132,
    position: "relative",
    backgroundColor: "#0F172A",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.22)",
  },
  bannerCategoryPill: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  bannerCategoryText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  bannerStatusExpiredPill: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(225, 29, 72, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  bannerStatusExpiredText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  bannerMatchBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bannerMatchBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#059669",
    fontWeight: "800",
  },
  bannerDeadlinePill: {
    position: "absolute",
    bottom: 8,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  bannerDeadlinePillUrgent: {
    backgroundColor: "rgba(255, 241, 242, 0.95)",
    borderColor: "#FFE4E6",
  },
  bannerDeadlineText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 9.5,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  bannerDeadlineTextUrgent: {
    color: "#E11D48",
    fontWeight: "700",
  },

  // 2. Card Content Body
  cardBody: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  metaSlash: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: "#CBD5E1",
    marginHorizontal: 2,
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
  teamChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EDE9FE",
  },
  teamTagText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    color: "#6D28D9",
  },
  individuChip: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metaSubtleText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: COLORS.textMuted,
  },
  escrowChip: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  escrowChipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    color: "#059669",
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(15, 23, 42, 0.06)",
  },
  budgetLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: "#94A3B8",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  budgetValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    color: COLORS.textDark,
    letterSpacing: -0.3,
    fontWeight: "800",
    marginTop: 1,
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
