import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  Clock,
  MapPin,
  Users,
  User,
  ArrowUpRight,
  Layers,
  ShieldCheck,
  Check,
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
        IconComponent: Palette,
      };
    case "UIUX":
      return {
        label: "UI/UX Design",
        bg: "#F5F3FF",
        border: "#DDD6FE",
        text: "#6D28D9",
        IconComponent: Layers,
      };
    case "PEMROGRAMAN":
      return {
        label: "Web & Coding",
        bg: "#ECFEFF",
        border: "#A5F3FC",
        text: "#0E7490",
        IconComponent: Code,
      };
    case "VIDEO":
      return {
        label: "Video & Reels",
        bg: "#FFF1F2",
        border: "#FECDD3",
        text: "#BE123C",
        IconComponent: Video,
      };
    case "COPYWRITING":
      return {
        label: "Copywriting",
        bg: "#FFFBEB",
        border: "#FDE68A",
        text: "#B45309",
        IconComponent: FileText,
      };
    case "ADMIN_DATA":
      return {
        label: "Admin & Data",
        bg: "#ECFDF5",
        border: "#A7F3D0",
        text: "#047857",
        IconComponent: BarChart3,
      };
    default:
      return {
        label: cat || "Proyek",
        bg: "#F8FAFC",
        border: "#E2E8F0",
        text: "#475569",
        IconComponent: Sparkles,
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
    deadline.getDate(),
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
  const [cardWidth, setCardWidth] = useState(0);
  const [topHeight, setTopHeight] = useState(0);

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
  const clientPhoto =
    project.umkm_profile?.url_foto_usaha ||
    project.umkm_profile?.url_foto ||
    project.umkm_foto ||
    project.url_foto;
  const clientCity = project.umkm_profile?.kota || "Indonesia";
  const deadlineInfo = getRemainingDaysInfo(project.deadline);
  const catConfig = getCategoryConfig(project.kategori);
  const CatIcon = catConfig.IconComponent;

  const rawDesc = (project.deskripsi || project.deskripsi_raw || "").replace(
    /<[^>]*>?/gm,
    "",
  );

  // Exact Curved Tab Notch Geometry
  const W = cardWidth;
  const H = topHeight;
  const r = 24; // Smooth top-left radius
  const notchW = 90; // Notch width
  const notchH = 44; // Notch height
  const fillet = 14; // Smooth transition fillet

  // White Card SVG Path with Scooped Notch
  const curvedCardPath =
    W > 0 && H > 0
      ? `M 0,${r} 
         A ${r} ${r} 0 0 1 ${r},0 
         L ${W - notchW - fillet},0 
         A ${fillet} ${fillet} 0 0 1 ${W - notchW},${fillet} 
         L ${W - notchW},${notchH - fillet} 
         A ${fillet} ${fillet} 0 0 0 ${W - notchW + fillet},${notchH} 
         L ${W},${notchH} 
         L ${W},${H} 
         L 0,${H} 
         Z`
      : "";

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
      style={[styles.cardOuter, isExpired && styles.cardExpired]}
    >
      {/* 1. TOP SECTION (CURVED NOTCHED TAB) */}
      <View
        style={styles.topCurvedSection}
        onLayout={(e) => setTopHeight(e.nativeEvent.layout.height)}
      >
        {/* Solid SVG Background */}
        {W > 0 && H > 0 && (
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <Svg width={W} height={H}>
              <Rect width={W} height={H} fill="#F8FAFC" />
              <Path
                d={curvedCardPath}
                fill="#FFFFFF"
                stroke="rgba(15, 23, 42, 0.08)"
                strokeWidth={1}
              />
            </Svg>
          </View>
        )}

        {/* Fallback solid background while measuring layout */}
        {W === 0 && (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              },
            ]}
          />
        )}

        {/* Glossy Apple-style Detail Button nestled cleanly inside the notch */}
        <View style={styles.appleButtonSlot}>
          <View style={styles.applePillBtn}>
            <Text style={styles.applePillBtnText}>Detail</Text>
            <View style={styles.applePillIconWrapper}>
              <ArrowUpRight size={11} color="#FFFFFF" strokeWidth={2.6} />
            </View>
          </View>
        </View>

        {/* Header Row: Elevated UMKM Avatar + Verified Badge + Title & Company */}
        <View style={styles.headerRow}>
          {/* Glossy Avatar Container with Verified Shield */}
          <View style={styles.avatarGlossyWrapper}>
            <Avatar
              src={clientPhoto}
              name={clientName}
              role="UMKM"
              size={40}
              rounded={12}
            />
            <View style={styles.umkmVerifiedBadge}>
              <Check size={8.5} color="#FFFFFF" strokeWidth={3.5} />
            </View>
          </View>

          {/* Client Meta & Job Title */}
          <View style={styles.titleColumn}>
            <View style={styles.clientMetaRow}>
              <Text style={styles.companyName} numberOfLines={1}>
                {clientName}
              </Text>
              <View style={styles.verifiedPill}>
                <ShieldCheck size={10} color="#4F46E5" strokeWidth={2.4} />
                <Text style={styles.verifiedPillText}>UMKM</Text>
              </View>
            </View>

            <Text style={styles.jobTitle} numberOfLines={1}>
              {project.judul}
            </Text>
          </View>
        </View>

        {/* Themed Dynamic Chips Row */}
        <View style={styles.chipsRow}>
          {/* Category Chip */}
          <View
            style={[
              styles.chip,
              {
                backgroundColor: catConfig.bg,
                borderColor: catConfig.border,
              },
            ]}
          >
            <CatIcon size={10.5} color={catConfig.text} strokeWidth={2.2} />
            <Text
              style={[
                styles.chipText,
                { color: catConfig.text, fontWeight: "700" },
              ]}
            >
              {catConfig.label}
            </Text>
          </View>

          {/* Location Chip */}
          <View style={styles.chip}>
            <MapPin size={10.5} color="#64748B" strokeWidth={2.2} />
            <Text style={styles.chipText} numberOfLines={1}>
              {clientCity}
            </Text>
          </View>

          {/* Collaboration Type Chip */}
          <View
            style={[
              styles.chip,
              isTeam && {
                backgroundColor: "#FAF5FF",
                borderColor: "#E9D5FF",
              },
            ]}
          >
            {isTeam ? (
              <Users size={10.5} color="#7E22CE" strokeWidth={2.2} />
            ) : (
              <User size={10.5} color="#64748B" strokeWidth={2.2} />
            )}
            <Text
              style={[
                styles.chipText,
                isTeam && { color: "#7E22CE", fontWeight: "700" },
              ]}
            >
              {isTeam
                ? slotsCount > 1
                  ? `Tim (${slotsCount})`
                  : "Tim"
                : "Individu"}
            </Text>
          </View>
        </View>

        {/* Description Snippet */}
        {rawDesc ? (
          <Text style={styles.descriptionSnippet} numberOfLines={2}>
            {rawDesc}
          </Text>
        ) : null}
      </View>

      {/* 2. ATTACHED BOTTOM GLOSSY WHITE PANEL */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomMetaRow}>
          {/* Deadline badge with glowing dot */}
          <View
            style={[
              styles.deadlineBadge,
              deadlineInfo?.isUrgent
                ? styles.deadlineUrgent
                : styles.deadlineNormal,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: deadlineInfo?.isUrgent
                    ? "#EF4444"
                    : "#10B981",
                },
              ]}
            />
            <Text
              style={[
                styles.deadlineText,
                {
                  color: deadlineInfo?.isUrgent ? "#B91C1C" : "#047857",
                },
              ]}
            >
              {deadlineInfo ? deadlineInfo.text : "Aktif"}
            </Text>
          </View>

          {/* Total applicants count */}
          <View style={styles.applicantBadge}>
            <Users size={11} color="#64748B" strokeWidth={2.2} />
            <Text style={styles.applicantText}>
              {project.total_pelamar || 0} pelamar
            </Text>
          </View>
        </View>

        {/* Formatted Budget Amount */}
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetPrefix}>Honor s/d</Text>
          <Text style={styles.budgetText}>
            {formatCurrency(project.budget_max)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 24,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: Platform.OS === "android" ? 2 : 3,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  cardExpired: {
    opacity: 0.65,
  },

  // 1. Top Curved Section
  topCurvedSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 13,
    minHeight: 142,
    position: "relative",
  },
  appleButtonSlot: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 10,
  },
  applePillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4.5,
    backgroundColor: "#0F172A",
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 3,
  },
  applePillBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  applePillIconWrapper: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Header Content
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
    paddingRight: 84, // Reserve space for the top-right notched button
  },
  avatarGlossyWrapper: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    padding: 1.5,
    borderWidth: 1.5,
    borderColor: "#EEF2FF",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  umkmVerifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#4F46E5",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 2,
  },
  titleColumn: {
    flex: 1,
    justifyContent: "center",
  },
  clientMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 2,
  },
  companyName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#64748B",
    fontWeight: "600",
    maxWidth: "80%",
  },
  verifiedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2.5,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingHorizontal: 4.5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  verifiedPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 8.5,
    color: "#4338CA",
    fontWeight: "800",
  },
  jobTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 14.5,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
    lineHeight: 18,
  },

  // Chips Row
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5.5,
    marginBottom: 9,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 8.5,
    paddingVertical: 3.5,
    borderRadius: 14,
  },
  chipText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    color: "#475569",
    fontWeight: "600",
  },

  // Description Snippet
  descriptionSnippet: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#64748B",
    lineHeight: 16.5,
  },

  // 2. Bottom Attached Panel
  bottomBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: 1,
    borderTopWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    borderTopColor: "rgba(15, 23, 42, 0.06)",
  },
  bottomMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  deadlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4.5,
    paddingHorizontal: 7.5,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  deadlineNormal: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  deadlineUrgent: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  statusDot: {
    width: 5.5,
    height: 5.5,
    borderRadius: 3,
  },
  deadlineText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10.5,
    fontWeight: "700",
  },
  applicantBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
  },
  applicantText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: "#64748B",
  },
  budgetContainer: {
    alignItems: "flex-end",
  },
  budgetPrefix: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9.5,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: -1,
  },
  budgetText: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "800",
    letterSpacing: -0.3,
  },
});
