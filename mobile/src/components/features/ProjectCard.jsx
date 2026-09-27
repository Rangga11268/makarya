import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Layers,
  Palette,
  Code,
  Video,
  FileText,
  BarChart3,
  Sparkles,
} from "lucide-react-native";
import { Avatar } from "../ui/Avatar";

const getCategoryConfig = (cat) => {
  switch (cat) {
    case "DESIGN":
    case "DESAIN":
      return {
        label: "Desain Grafis",
        bg: "#EEF2FF",
        border: "#C7D2FE",
        text: "#4338CA",
      };
    case "UIUX":
      return {
        label: "UI/UX Design",
        bg: "#F5F3FF",
        border: "#DDD6FE",
        text: "#6D28D9",
      };
    case "PEMROGRAMAN":
      return {
        label: "Web & Coding",
        bg: "#ECFEFF",
        border: "#A5F3FC",
        text: "#0E7490",
      };
    case "VIDEO":
      return {
        label: "Video & Reels",
        bg: "#FFF1F2",
        border: "#FECDD3",
        text: "#BE123C",
      };
    case "COPYWRITING":
      return {
        label: "Copywriting",
        bg: "#FFFBEB",
        border: "#FDE68A",
        text: "#B45309",
      };
    case "ADMIN_DATA":
      return {
        label: "Admin & Data",
        bg: "#ECFDF5",
        border: "#A7F3D0",
        text: "#047857",
      };
    default:
      return {
        label: cat || "Proyek Digital",
        bg: "#F8FAFC",
        border: "#E2E8F0",
        text: "#475569",
      };
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
    deadline.getDate()
  );
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: "Berakhir", isUrgent: true };
  if (diffDays === 0) return { text: "Hari ini", isUrgent: true };
  if (diffDays === 1) return { text: "Sisa 1 hr", isUrgent: true };
  if (diffDays <= 3) return { text: `Sisa ${diffDays} hr`, isUrgent: true };
  if (diffDays <= 30) return { text: `Sisa ${diffDays} hr`, isUrgent: false };
  return { text: formatDate(deadlineStr), isUrgent: false };
};

export function ProjectCard({ project, onPress }) {
  const isExpired =
    Boolean(
      project.deadline &&
        new Date(project.deadline) < new Date().setHours(0, 0, 0, 0)
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
  const clientPhoto =
    project.umkm_profile?.url_foto_usaha ||
    project.umkm_profile?.url_foto ||
    project.umkm_foto ||
    project.url_foto;
  const clientCity = project.umkm_profile?.kota || "Indonesia";
  const deadlineInfo = getRemainingDaysInfo(project.deadline);
  const catConfig = getCategoryConfig(project.kategori);

  const rawDesc = (project.deskripsi || project.deskripsi_raw || "").replace(
    /<[^>]*>?/gm,
    ""
  );

  // Extract skills/tags cleanly
  const rawSkills = Array.isArray(project.skills_required) && project.skills_required.length > 0
    ? project.skills_required
    : Array.isArray(project.skills) && project.skills.length > 0
      ? project.skills
      : [];
  const displaySkills = rawSkills.slice(0, 2);
  const remainingSkillsCount = rawSkills.length > 2 ? rawSkills.length - 2 : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.cardContainer, isExpired && styles.cardExpired]}
    >
      {/* 1. Header: Client Identity + Category Badge */}
      <View style={styles.headerRow}>
        <View style={styles.clientGroup}>
          <View style={styles.avatarWrapper}>
            <Avatar
              src={clientPhoto}
              name={clientName}
              role="UMKM"
              size={36}
              rounded={10}
            />
          </View>
          <View style={styles.clientMetaCol}>
            <View style={styles.clientNameRow}>
              <Text style={styles.clientName} numberOfLines={1}>
                {clientName}
              </Text>
              <CheckCircle2
                size={13}
                color="#2563EB"
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth={2}
                style={styles.verifiedIcon}
              />
            </View>
            <Text style={styles.clientSubMeta} numberOfLines={1}>
              {clientCity} • Mitra Terverifikasi
            </Text>
          </View>
        </View>

        {/* Category Pill */}
        <View
          style={[
            styles.categoryPill,
            { backgroundColor: catConfig.bg, borderColor: catConfig.border },
          ]}
        >
          <Text style={[styles.categoryPillText, { color: catConfig.text }]}>
            {catConfig.label}
          </Text>
        </View>
      </View>

      {/* 2. Body: Project Title & Excerpt */}
      <View style={styles.bodySection}>
        <Text style={styles.projectTitle} numberOfLines={2}>
          {project.judul}
        </Text>
        {rawDesc ? (
          <Text style={styles.descriptionSnippet} numberOfLines={2}>
            {rawDesc}
          </Text>
        ) : null}
      </View>

      {/* 3. Skill & Scope Chips */}
      <View style={styles.chipsRow}>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipText}>
            {isTeam
              ? slotsCount > 1
                ? `Tim (${slotsCount} Anggota)`
                : "Kolaborasi Tim"
              : "Individu"}
          </Text>
        </View>

        {displaySkills.map((skill, index) => (
          <View key={index} style={styles.skillChip}>
            <Text style={styles.skillChipText} numberOfLines={1}>
              {typeof skill === "string" ? skill : skill.name || skill.nama}
            </Text>
          </View>
        ))}

        {remainingSkillsCount > 0 && (
          <View style={styles.moreSkillChip}>
            <Text style={styles.moreSkillChipText}>+{remainingSkillsCount}</Text>
          </View>
        )}
      </View>

      {/* Subtle Hairline Divider */}
      <View style={styles.divider} />

      {/* 4. Footer: Structured Budget & Activity Status */}
      <View style={styles.footerRow}>
        <View style={styles.budgetCol}>
          <Text style={styles.budgetAmount}>
            {formatCurrency(project.budget_max)}
          </Text>
          <Text style={styles.budgetLabel}>Honor Proyek</Text>
        </View>

        <View style={styles.footerRightCol}>
          {deadlineInfo && (
            <View
              style={[
                styles.deadlineBadge,
                deadlineInfo.isUrgent
                  ? styles.deadlineBadgeUrgent
                  : styles.deadlineBadgeNormal,
              ]}
            >
              <Clock
                size={11}
                color={deadlineInfo.isUrgent ? "#DC2626" : "#64748B"}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.deadlineBadgeText,
                  deadlineInfo.isUrgent
                    ? styles.deadlineTextUrgent
                    : styles.deadlineTextNormal,
                ]}
              >
                {deadlineInfo.text}
              </Text>
            </View>
          )}

          <View style={styles.applicantBadge}>
            <Users size={12} color="#64748B" strokeWidth={2} />
            <Text style={styles.applicantText}>
              {project.total_pelamar || 0} pelamar
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: Platform.OS === "android" ? 1 : 2,
  },
  cardExpired: {
    opacity: 0.6,
  },

  // 1. Header Row
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  clientGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  avatarWrapper: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 11,
    overflow: "hidden",
    marginRight: 10,
    backgroundColor: "#F8FAFC",
  },
  clientMetaCol: {
    flex: 1,
  },
  clientNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0F172A",
    maxWidth: "88%",
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  clientSubMeta: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },
  categoryPill: {
    paddingHorizontal: 8.5,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    fontWeight: "700",
  },

  // 2. Body Section
  bodySection: {
    marginBottom: 10,
  },
  projectTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 15.5,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 21,
    letterSpacing: -0.25,
    marginBottom: 4,
  },
  descriptionSnippet: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12.5,
    color: "#475569",
    lineHeight: 18,
  },

  // 3. Chips Row
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  metaChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metaChipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#334155",
    fontWeight: "600",
  },
  skillChip: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  skillChipText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
  },
  moreSkillChip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6.5,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  moreSkillChipText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    color: "#64748B",
    fontWeight: "700",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginBottom: 11,
  },

  // 4. Footer Row
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  budgetCol: {
    justifyContent: "center",
  },
  budgetAmount: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  budgetLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10.5,
    color: "#94A3B8",
    marginTop: 0.5,
  },
  footerRightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deadlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  deadlineBadgeNormal: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  deadlineBadgeUrgent: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  deadlineBadgeText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    fontWeight: "600",
  },
  deadlineTextNormal: {
    color: "#64748B",
  },
  deadlineTextUrgent: {
    color: "#DC2626",
    fontWeight: "700",
  },
  applicantBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  applicantText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#64748B",
  },
});
