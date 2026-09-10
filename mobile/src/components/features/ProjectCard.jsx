import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Badge } from "../ui/Badge";
import { getCategorySkills } from "../../constants/categories";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import { renderProjectCategoryVectorIcon } from "../icons/CategoryIcons";
import {
  Users,
  User,
  ShieldCheck,
  Clock,
  Check,
  ArrowRight,
} from "lucide-react-native";

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
  if (diffDays === 1) return { text: "Sisa 1 hari", isUrgent: true };
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

  const skillPills = getCategorySkills(project.kategori);
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
  const clientIndustry = project.umkm_profile?.bidang_industri;
  const clientSubtext =
    [clientIndustry, clientCity].filter(Boolean).join(" • ") ||
    "UMKM Terverifikasi";

  const deadlineInfo = getRemainingDaysInfo(project.deadline);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
    >
      {/* 1. Header Meta Bar: Category Icon & Label + Collaboration Pill + Status/Escrow */}
      <View style={styles.headerMetaRow}>
        <View style={styles.categoryPill}>
          {renderProjectCategoryVectorIcon(
            project.kategori,
            project.judul,
            12,
            COLORS.brandIndigo,
          )}
          <Text style={styles.categoryPillText} numberOfLines={1}>
            {getCategoryLabel(project.kategori)}
          </Text>
        </View>

        <View style={styles.headerMetaRight}>
          {isTeam ? (
            <View style={styles.teamTagPill}>
              <Users size={11} color="#6D28D9" />
              <Text style={styles.teamTagText}>
                {slotsCount > 1 ? `Tim (${slotsCount})` : "Tim"}
              </Text>
            </View>
          ) : (
            <View style={styles.individualTagPill}>
              <User size={11} color="#475569" />
              <Text style={styles.individualTagText}>Individu</Text>
            </View>
          )}

          {isExpired ? (
            <Badge
              label={project.status === "CANCELLED" ? "Dibatalkan" : "Berakhir"}
              variant="danger"
            />
          ) : project.match_score ? (
            <View style={styles.matchScorePill}>
              <Check size={10} color="#065F46" strokeWidth={2.5} />
              <Text style={styles.matchScorePillText}>
                {project.match_score}%
              </Text>
            </View>
          ) : (
            <View style={styles.escrowChip}>
              <ShieldCheck size={11} color="#166534" />
              <Text style={styles.escrowText}>Escrow</Text>
            </View>
          )}
        </View>
      </View>

      {/* 2. Project Title */}
      <Text style={styles.title} numberOfLines={2}>
        {project.judul}
      </Text>

      {/* 3. Description Preview Snippet */}
      {project.deskripsi_raw ? (
        <Text style={styles.descriptionSnippet} numberOfLines={2}>
          {project.deskripsi_raw.trim()}
        </Text>
      ) : null}

      {/* 4. UMKM Profile & Deadline Row */}
      <View style={styles.umkmRow}>
        {clientPhoto && !imgError ? (
          <Image
            source={{ uri: clientPhoto }}
            style={styles.clientAvatarImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.clientAvatar}>
            <Text style={styles.clientAvatarText}>{clientInitial}</Text>
          </View>
        )}

        <View style={styles.clientInfoCol}>
          <Text style={styles.clientName} numberOfLines={1}>
            {clientName}
          </Text>
          <Text style={styles.clientSubtext} numberOfLines={1}>
            {clientSubtext}
          </Text>
        </View>

        {deadlineInfo && (
          <View
            style={[
              styles.deadlinePill,
              deadlineInfo.isUrgent && styles.deadlinePillUrgent,
            ]}
          >
            <Clock
              size={10.5}
              color={deadlineInfo.isUrgent ? "#E11D48" : COLORS.textMuted}
            />
            <Text
              style={[
                styles.deadlinePillText,
                deadlineInfo.isUrgent && styles.deadlinePillTextUrgent,
              ]}
            >
              {deadlineInfo.text}
            </Text>
          </View>
        )}
      </View>

      {/* 5. Team Roles or Skill Pills */}
      {isTeam && slotsCount > 0 ? (
        <View style={styles.skillsRow}>
          {project.slots.slice(0, 3).map((slot, idx) => (
            <View key={slot.id || idx} style={styles.teamRolePill}>
              <Text style={styles.teamRolePillText} numberOfLines={1}>
                {slot.nama_peran}
              </Text>
            </View>
          ))}
          {slotsCount > 3 && (
            <View style={styles.morePill}>
              <Text style={styles.morePillText}>+{slotsCount - 3}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.skillsRow}>
          {skillPills.slice(0, 3).map((skill, idx) => (
            <View key={idx} style={styles.skillPill}>
              <Text style={styles.skillPillText}>{skill}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 6. Footer: Pagu Anggaran + Pelamar Count + CTA */}
      <View style={styles.footerRow}>
        <View style={styles.budgetCol}>
          <Text style={styles.budgetLabel}>PAGU ANGGARAN</Text>
          <Text style={styles.budgetValue}>
            {formatCurrency(project.budget_max)}
          </Text>
        </View>

        <View style={styles.footerRight}>
          <View style={styles.applicantBadge}>
            <Users size={11} color={COLORS.textSecondary} />
            <Text style={styles.applicantText}>
              {project.total_pelamar || 0} Pelamar
            </Text>
          </View>

          <View style={styles.detailCta}>
            <Text style={styles.detailCtaText}>Detail</Text>
            <ArrowRight
              size={11}
              color={COLORS.brandIndigo}
              strokeWidth={2.5}
            />
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
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  headerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    maxWidth: "52%",
  },
  categoryPillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    color: COLORS.brandIndigo,
  },
  headerMetaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  teamTagPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#DDD6FE",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  teamTagText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#6D28D9",
  },
  individualTagPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  individualTagText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: "#475569",
  },
  matchScorePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matchScorePillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: "#065F46",
  },
  escrowChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  escrowText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: "#166534",
  },
  title: {
    fontFamily: FONTS.headingBold,
    fontSize: 14.5,
    color: COLORS.textDark,
    letterSpacing: -0.25,
    lineHeight: 20,
    marginBottom: 5,
  },
  descriptionSnippet: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: COLORS.textSecondary,
    lineHeight: 16.5,
    marginBottom: 10,
  },
  umkmRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 10,
    gap: 8,
  },
  clientAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  clientAvatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  clientAvatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11.5,
    color: COLORS.brandIndigo,
  },
  clientInfoCol: {
    flex: 1,
  },
  clientName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: COLORS.textDark,
  },
  clientSubtext: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9.5,
    color: COLORS.textMuted,
    marginTop: 0.5,
  },
  deadlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deadlinePillUrgent: {
    backgroundColor: "#FFF1F2",
    borderColor: "#FECDD3",
  },
  deadlinePillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 9.5,
    color: COLORS.textSecondary,
  },
  deadlinePillTextUrgent: {
    color: "#E11D48",
    fontFamily: FONTS.bodyBold,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 12,
  },
  skillPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillPillText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  teamRolePill: {
    backgroundColor: "#F5F3FF",
    borderWidth: 0.8,
    borderColor: "#E9D5FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  teamRolePillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: "#7C3AED",
  },
  morePill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  morePillText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
  },
  budgetCol: {
    flex: 1,
  },
  budgetLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  budgetValue: {
    fontFamily: FONTS.headingBold,
    fontSize: 14,
    color: COLORS.brandIndigo,
    marginTop: 1,
    fontVariant: ["tabular-nums"],
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  applicantBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  applicantText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    color: COLORS.textSecondary,
  },
  detailCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 8,
  },
  detailCtaText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    color: COLORS.brandIndigo,
  },
});
