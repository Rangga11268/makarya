import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { FONTS } from "../../../../theme/fonts";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { formatDate } from "../../../../utils/formatDate";
import { AppleGlossyCard } from "../../../../components/ui/AppleGlossyCard";
import { PebbleButton } from "../../../../components/ui/PebbleButton";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Share2,
  Palette,
  FileCode,
  FolderArchive,
  FileText,
} from "lucide-react-native";

const DEFAULT_SHARED_RESOURCES = [
  {
    id: "sr-1",
    title: "Design System & Figma Tokens",
    type: "FIGMA",
    uploaderRole: "UI/UX Designer",
    url: "https://figma.com/@makarya/tokens",
    note: "Komponen dasar button, typography scale, dan warna primer.",
  },
  {
    id: "sr-2",
    title: "Dokumentasi API & JSON Contract",
    type: "CODE",
    uploaderRole: "Backend Dev",
    url: "https://github.com/makarya/api-spec",
    note: "Kontrak response JSON auth dan katalog produk.",
  },
];

export function MobileTeamMatrix({
  project,
  isUmkmOwner = false,
  onApproveSlot,
}) {
  const slots = project?.slots || [];
  const totalSlots = slots.length;
  const filledSlots = slots.filter(
    (s) => s.status === "IN_PROGRESS" || s.status === "COMPLETED",
  ).length;
  const completedSlots = slots.filter((s) => s.status === "COMPLETED").length;
  const teamProgressPercent =
    totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  const getRoleColors = (roleName = "") => {
    const lower = roleName.toLowerCase();
    if (
      lower.includes("ui") ||
      lower.includes("ux") ||
      lower.includes("desain")
    ) {
      return { bg: "#F3E8FF", border: "#D8B4FE", text: "#6B21A8" };
    }
    if (
      lower.includes("front") ||
      lower.includes("web") ||
      lower.includes("mobile")
    ) {
      return { bg: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" };
    }
    if (lower.includes("back") || lower.includes("api")) {
      return { bg: "#EEF2FF", border: "#C7D2FE", text: "#4338CA" };
    }
    return { bg: "#F1F5F9", border: "#E2E8F0", text: "#334155" };
  };

  return (
    <View style={styles.container}>
      {/* 1. Barometer Card */}
      <AppleGlossyCard style={styles.barometerCard}>
        <View style={styles.barometerHeader}>
          <View style={styles.iconWrap}>
            <Users size={18} color="#4F46E5" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.barometerSubtitle}>
              FORMASI TIM MULTI-TALENTA
            </Text>
            <Text style={styles.barometerTitle}>
              {totalSlots} Peran Kolaborasi Mahasiswa
            </Text>
          </View>
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>
              {completedSlots}/{totalSlots} Selesai
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>Progres Tim Keseluruhan</Text>
            <Text style={styles.progressPercent}>{teamProgressPercent}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${teamProgressPercent}%` },
              ]}
            />
          </View>
        </View>
      </AppleGlossyCard>

      {/* 2. Slot Role List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Matriks Pembagian Peran Kerja</Text>
        <Text style={styles.sectionSub}>Escrow dicairkan per-peran</Text>
      </View>

      {slots.map((slot, sIdx) => {
        const isFilled =
          slot.status === "IN_PROGRESS" || slot.status === "COMPLETED";
        const isCompleted = slot.status === "COMPLETED";
        const roleColors = getRoleColors(slot.nama_peran);

        return (
          <AppleGlossyCard key={slot.id || sIdx} style={styles.slotCard}>
            <View style={styles.slotTopRow}>
              <View
                style={[
                  styles.roleBadge,
                  {
                    backgroundColor: roleColors.bg,
                    borderColor: roleColors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.roleBadgeText, { color: roleColors.text }]}
                >
                  {slot.nama_peran}
                </Text>
              </View>

              <Text style={styles.budgetAmount}>
                Rp {formatCurrency(slot.alokasi_budget)}
              </Text>
            </View>

            {slot.deskripsi_tugas ? (
              <Text style={styles.taskDesc} numberOfLines={2}>
                {slot.deskripsi_tugas}
              </Text>
            ) : null}

            {/* Student Profile Row */}
            <View style={styles.studentRow}>
              {isFilled ? (
                <>
                  <View style={styles.studentAvatar}>
                    <Text style={styles.studentAvatarText}>
                      {slot.accepted_mhs_nama
                        ? slot.accepted_mhs_nama.charAt(0).toUpperCase()
                        : "M"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentName} numberOfLines={1}>
                      {slot.accepted_mhs_nama || "Mahasiswa Pelaksana"}
                    </Text>
                    <Text style={styles.studentRoleTag}>Talenta Terpilih</Text>
                  </View>
                </>
              ) : (
                <View style={styles.emptySlotRow}>
                  <Users size={14} color="#94A3B8" />
                  <Text style={styles.emptySlotText}>Menunggu pelamar...</Text>
                </View>
              )}

              {isCompleted ? (
                <View style={styles.donePill}>
                  <CheckCircle2 size={11} color="#059669" />
                  <Text style={styles.donePillText}>Lunas</Text>
                </View>
              ) : isFilled ? (
                <View style={styles.activePill}>
                  <Clock size={11} color="#2563EB" />
                  <Text style={styles.activePillText}>Aktif</Text>
                </View>
              ) : null}
            </View>

            {/* UMKM Per-Slot Approval Action */}
            {isUmkmOwner && isFilled && !isCompleted && onApproveSlot && (
              <View style={styles.slotActionRow}>
                <PebbleButton
                  variant="emerald"
                  size="sm"
                  label={`Cairkan Honor Slot (Rp ${formatCurrency(slot.alokasi_budget)})`}
                  icon={CheckCircle2}
                  onPress={() => onApproveSlot(slot)}
                  style={{ width: "100%" }}
                />
              </View>
            )}
          </AppleGlossyCard>
        );
      })}

      {/* 3. Estafet Berkas / Shared Resources */}
      <AppleGlossyCard style={styles.sharedCard}>
        <View style={styles.sharedHeader}>
          <Share2 size={16} color="#7C3AED" />
          <Text style={styles.sharedTitle}>Papan Estafet Aset Tim</Text>
        </View>
        <Text style={styles.sharedSubtitle}>
          Berkas internal yang dibagikan antar-rekan tim (token desain, API doc)
        </Text>

        <View style={styles.sharedList}>
          {DEFAULT_SHARED_RESOURCES.map((res) => (
            <TouchableOpacity
              key={res.id}
              style={styles.resourceItem}
              onPress={() => Linking.openURL(res.url).catch(() => {})}
              activeOpacity={0.8}
            >
              <View style={styles.resourceIconWrap}>
                {res.type === "FIGMA" ? (
                  <Palette size={16} color="#7C3AED" />
                ) : (
                  <FileCode size={16} color="#2563EB" />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.resourceTitle} numberOfLines={1}>
                  {res.title}
                </Text>
                <Text style={styles.resourceDesc} numberOfLines={1}>
                  {res.note}
                </Text>
              </View>
              <ExternalLink size={13} color="#2563EB" />
            </TouchableOpacity>
          ))}
        </View>
      </AppleGlossyCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  barometerCard: {
    padding: 16,
    gap: 12,
  },
  barometerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  barometerSubtitle: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: "#4F46E5",
    letterSpacing: 0.5,
  },
  barometerTitle: {
    fontSize: 13.5,
    fontFamily: FONTS.bold,
    color: "#0F172A",
    marginTop: 1,
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  completedBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: "#065F46",
  },
  progressWrap: {
    gap: 4,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 10.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  progressPercent: {
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F1F5F9",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#4F46E5",
  },
  sectionHeader: {
    paddingHorizontal: 2,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  sectionSub: {
    fontSize: 10.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  slotCard: {
    padding: 14,
    gap: 10,
  },
  slotTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontFamily: FONTS.bold,
  },
  budgetAmount: {
    fontSize: 12.5,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  taskDesc: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#475569",
    lineHeight: 16,
  },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.6)",
  },
  studentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },
  studentAvatarText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  studentName: {
    fontSize: 11.5,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  studentRoleTag: {
    fontSize: 9.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  emptySlotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  emptySlotText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  donePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
  },
  donePillText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: "#065F46",
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },
  activePillText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: "#1E40AF",
  },
  slotActionRow: {
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.6)",
  },
  sharedCard: {
    padding: 16,
    gap: 8,
  },
  sharedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sharedTitle: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  sharedSubtitle: {
    fontSize: 10.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginBottom: 4,
  },
  sharedList: {
    gap: 8,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  resourceIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  resourceTitle: {
    fontSize: 11.5,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  resourceDesc: {
    fontSize: 10,
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginTop: 1,
  },
});
