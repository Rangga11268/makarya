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
  ArrowUpRight,
  Layers,
} from "lucide-react-native";
import { Avatar } from "../ui/Avatar";

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

  const rawDesc = (project.deskripsi || project.deskripsi_raw || "").replace(
    /<[^>]*>?/gm,
    "",
  );

  // Exact Curved Tab Notch Geometry
  const W = cardWidth;
  const H = topHeight;
  const r = 22; // Top-left corner radius
  const notchW = 86; // Notch width for button
  const notchH = 42; // Notch height
  const fillet = 14; // Smooth fillet radius

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
        {/* Solid SVG Background: Fill canvas color (#F8FAFC) first, then white curved path */}
        {W > 0 && H > 0 && (
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <Svg width={W} height={H}>
              {/* Solid Canvas background behind the notch to prevent Android elevation grey box */}
              <Rect width={W} height={H} fill="#F8FAFC" />
              {/* White Curved Card Body */}
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
                borderTopLeftRadius: 22,
                borderTopRightRadius: 22,
              },
            ]}
          />
        )}

        {/* Apple Style Detail Button nestled cleanly inside the notch */}
        <View style={styles.appleButtonSlot}>
          <View style={styles.applePillBtn}>
            <Text style={styles.applePillBtnText}>Detail</Text>
            <ArrowUpRight size={12.5} color="#FFFFFF" strokeWidth={2.4} />
          </View>
        </View>

        {/* Header Content: Avatar + Title + UMKM Name */}
        <View style={styles.headerRow}>
          {/* Square Rounded Logo */}
          <View style={styles.logoSquare}>
            <Avatar
              src={clientPhoto}
              name={clientName}
              role="UMKM"
              size={38}
              style={styles.avatarImg}
            />
          </View>

          {/* Title & Subtitle */}
          <View style={styles.titleColumn}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {project.judul}
            </Text>
            <Text style={styles.companyName} numberOfLines={1}>
              {clientName}
            </Text>
          </View>
        </View>

        {/* Chips Row */}
        <View style={styles.chipsRow}>
          <View style={styles.chip}>
            <MapPin size={10} color="#64748B" />
            <Text style={styles.chipText} numberOfLines={1}>
              {clientCity}
            </Text>
          </View>

          <View style={styles.chip}>
            <Layers size={10} color="#64748B" />
            <Text style={styles.chipText}>
              {getCategoryLabel(project.kategori)}
            </Text>
          </View>

          <View style={styles.chip}>
            <Users size={10} color="#64748B" />
            <Text style={styles.chipText}>
              {isTeam
                ? slotsCount > 1
                  ? `Tim (${slotsCount})`
                  : "Tim"
                : "Individu"}
            </Text>
          </View>
        </View>

        {/* Description Snippet (2 Lines) */}
        {rawDesc ? (
          <Text style={styles.descriptionSnippet} numberOfLines={2}>
            {rawDesc}
          </Text>
        ) : null}
      </View>

      {/* 2. ATTACHED BOTTOM WHITE PANEL */}
      <View style={styles.bottomBar}>
        <View style={styles.postedRow}>
          <Clock size={12} color="#64748B" />
          <Text style={styles.postedText}>
            {deadlineInfo ? deadlineInfo.text : "Aktif"} ·{" "}
            {project.total_pelamar || 0} pelamar
          </Text>
        </View>

        <Text style={styles.budgetText}>
          {formatCurrency(project.budget_max)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: 22,
    marginBottom: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: Platform.OS === "android" ? 1 : 2,
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
    minHeight: 140,
    position: "relative",
  },
  appleButtonSlot: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 10,
  },
  applePillBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    backgroundColor: "#0F172A", // Apple Solid Dark Slate Pill
    paddingHorizontal: 11,
    paddingVertical: 5.5,
    borderRadius: 14,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  applePillBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11.5,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
    paddingRight: 80, // Reserve space for top-right curved notch
  },
  logoSquare: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    overflow: "hidden",
  },
  avatarImg: {
    borderRadius: 10,
  },
  titleColumn: {
    flex: 1,
    justifyContent: "center",
  },
  jobTitle: {
    fontFamily: FONTS.headingBold,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  companyName: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: "#64748B",
  },

  // Chips
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
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

  // Description
  descriptionSnippet: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
  },

  // 2. Bottom Attached Panel
  bottomBar: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderWidth: 1,
    borderTopWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.08)",
    borderTopColor: "rgba(15, 23, 42, 0.06)",
  },
  postedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  postedText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11.5,
    color: "#64748B",
  },
  budgetText: {
    fontFamily: FONTS.displayBold,
    fontSize: 15.5,
    color: "#0F172A",
    fontWeight: "800",
    letterSpacing: -0.3,
  },
});
