import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "../../../../theme/fonts";
import { formatDate } from "../../../../utils/formatDate";
import { formatCurrency } from "../../../../utils/formatCurrency";
import { AppleGlossyCard } from "../../../../components/ui/AppleGlossyCard";
import {
  ShieldCheck,
  CheckCircle2,
  UploadCloud,
  RotateCcw,
  FileCheck2,
  Calendar,
} from "lucide-react-native";

export function MobileActivityTimeline({
  project,
  submissions = [],
  myExistingProposal,
  isUmkmOwner = false,
}) {
  if (!project) return null;

  const events = [];

  // 1. Kickoff
  if (project.created_at) {
    events.push({
      id: "kickoff",
      title: "Kontrak Dimulai & Escrow Diamankan",
      description: `Dana garansi escrow Rp ${formatCurrency(project.budget_max || 0)} diamankan di rekening bersama Makarya.`,
      date: project.created_at,
      icon: ShieldCheck,
      iconBg: "#ECFDF5",
      iconColor: "#059669",
      badge: "Escrow 100%",
      badgeBg: "#D1FAE5",
      badgeColor: "#065F46",
    });
  }

  // 2. Assignment
  const proposalDate = myExistingProposal?.created_at || project.created_at;
  events.push({
    id: "assignment",
    title: "Mahasiswa Ditugaskan",
    description: `Kesepakatan kerja aktif. Tenggat pengerjaan: ${formatDate(project.deadline)}.`,
    date: proposalDate,
    icon: FileCheck2,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    badge: "Pengerjaan",
    badgeBg: "#DBEAFE",
    badgeColor: "#1E40AF",
  });

  // 3. Submissions
  const sortedSubs = [...submissions].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  sortedSubs.forEach((sub, idx) => {
    const vNum = idx + 1;
    const isApproved = sub.status === "APPROVED" || sub.status === "COMPLETED";
    const isRevision = sub.status === "REVISION_REQUESTED";

    events.push({
      id: `sub-${sub.id || idx}`,
      title: `Deliverable v${vNum} Diserahkan`,
      description:
        sub.catatan && sub.catatan.length > 5
          ? `Catatan: "${sub.catatan.slice(0, 80)}${sub.catatan.length > 80 ? "..." : ""}"`
          : "Berkas hasil pengerjaan diserahkan untuk proses review klien.",
      date: sub.created_at,
      icon: UploadCloud,
      iconBg: "#EEF2FF",
      iconColor: "#4F46E5",
      badge: `Versi ${vNum}`,
      badgeBg: "#E0E7FF",
      badgeColor: "#3730A3",
    });

    if (isRevision) {
      events.push({
        id: `rev-${sub.id || idx}`,
        title: "Permintaan Revisi Diajukan",
        description:
          "Klien mengajukan permintaan perbaikan dengan checklist rincian tugas revisi.",
        date: sub.updated_at || sub.created_at,
        icon: RotateCcw,
        iconBg: "#FEF3C7",
        iconColor: "#D97706",
        badge: `Revisi #${sub.jumlah_revisi || 1}`,
        badgeBg: "#FDE68A",
        badgeColor: "#92400E",
      });
    }

    if (isApproved) {
      events.push({
        id: `appr-${sub.id || idx}`,
        title: "Hasil Disetujui & Honor Cair",
        description: `Deliverable disetujui. Dana escrow Rp ${formatCurrency(project.budget_max || 0)} diteruskan ke dompet mahasiswa.`,
        date: sub.updated_at || sub.created_at,
        icon: CheckCircle2,
        iconBg: "#ECFDF5",
        iconColor: "#059669",
        badge: "Selesai",
        badgeBg: "#A7F3D0",
        badgeColor: "#065F46",
      });
    }
  });

  const displayEvents = events.reverse();

  return (
    <AppleGlossyCard style={styles.container}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Calendar size={16} color="#4F46E5" />
          <Text style={styles.title}>Linimasa Audit Aktivitas</Text>
        </View>
        <Text style={styles.countText}>{displayEvents.length} Peristiwa</Text>
      </View>

      <View style={styles.timelineList}>
        {displayEvents.map((evt, idx) => (
          <View key={evt.id || idx} style={styles.timelineItem}>
            {/* Left Track Column */}
            <View style={styles.trackCol}>
              <View
                style={[styles.nodeCircle, { backgroundColor: evt.iconBg }]}
              >
                <evt.icon size={13} color={evt.iconColor} />
              </View>
              {idx < displayEvents.length - 1 && (
                <View style={styles.verticalLine} />
              )}
            </View>

            {/* Right Content Card */}
            <View style={styles.contentCol}>
              <View style={styles.contentTopRow}>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {evt.title}
                </Text>
                <View
                  style={[styles.eventBadge, { backgroundColor: evt.badgeBg }]}
                >
                  <Text
                    style={[styles.eventBadgeText, { color: evt.badgeColor }]}
                  >
                    {evt.badge}
                  </Text>
                </View>
              </View>
              <Text style={styles.eventDesc}>{evt.description}</Text>
              <Text style={styles.eventDate}>{formatDate(evt.date)}</Text>
            </View>
          </View>
        ))}
      </View>
    </AppleGlossyCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 14,
    gap: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.7)",
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 13.5,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  countText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: "#64748B",
  },
  timelineList: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 10,
    minHeight: 64,
  },
  trackCol: {
    alignItems: "center",
    width: 26,
  },
  nodeCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
  },
  contentCol: {
    flex: 1,
    paddingBottom: 14,
  },
  contentTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  eventTitle: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: "#0F172A",
    flex: 1,
  },
  eventBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  eventBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
  },
  eventDesc: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#475569",
    marginTop: 2,
    lineHeight: 15,
  },
  eventDate: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: "#94A3B8",
    marginTop: 3,
  },
});
