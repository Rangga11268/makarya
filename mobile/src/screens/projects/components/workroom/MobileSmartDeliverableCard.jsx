import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { FONTS } from "../../../../theme/fonts";
import { formatDate } from "../../../../utils/formatDate";
import { AppleGlossyCard } from "../../../../components/ui/AppleGlossyCard";
import { PebbleButton } from "../../../../components/ui/PebbleButton";
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  RotateCcw,
  FileCode,
  Globe,
  FolderArchive,
  Palette,
  FileText,
  Check,
} from "lucide-react-native";

export function getMobileSmartLinkMeta(url) {
  if (!url) return null;
  const lower = url.toLowerCase();

  if (lower.includes("figma.com")) {
    return {
      type: "FIGMA",
      title: "Kanvas Desain Figma",
      badge: "Figma File",
      badgeBg: "#F3E8FF",
      badgeBorder: "#D8B4FE",
      badgeColor: "#6B21A8",
      icon: Palette,
      iconColor: "#7C3AED",
      iconBg: "#EDE9FE",
      actionText: "Buka Kanvas Figma",
      description: "Pratinjau antarmuka UI/UX dan token desain",
    };
  }
  if (lower.includes("github.com") || lower.includes("gitlab.com")) {
    return {
      type: "CODE",
      title: "Repositori Kode Sumber",
      badge: "GitHub / GitLab",
      badgeBg: "#F1F5F9",
      badgeBorder: "#CBD5E1",
      badgeColor: "#1E293B",
      icon: FileCode,
      iconColor: "#0F172A",
      iconBg: "#E2E8F0",
      actionText: "Inspeksi Source Code",
      description: "Kode program dan dokumentasi proyek",
    };
  }
  if (
    lower.includes("drive.google.com") ||
    lower.includes("dropbox.com") ||
    lower.includes("onedrive")
  ) {
    return {
      type: "CLOUD",
      title: "Cloud Berkas Master",
      badge: "Google Drive / Cloud",
      badgeBg: "#EFF6FF",
      badgeBorder: "#BFDBFE",
      badgeColor: "#1D4ED8",
      icon: FolderArchive,
      iconColor: "#2563EB",
      iconBg: "#DBEAFE",
      actionText: "Akses Folder Master",
      description: "Arsip file resolusi tinggi dan aset grafis",
    };
  }
  if (
    lower.includes("vercel.app") ||
    lower.includes("netlify.app") ||
    lower.includes(".web.app") ||
    lower.includes("http")
  ) {
    return {
      type: "LIVE_DEMO",
      title: "Live Prototype Demo",
      badge: "Web Preview",
      badgeBg: "#ECFDF5",
      badgeBorder: "#A7F3D0",
      badgeColor: "#065F46",
      icon: Globe,
      iconColor: "#059669",
      iconBg: "#D1FAE5",
      actionText: "Uji Demo Langsung",
      description: "Aplikasi langsung yang dapat diuji interaksinya",
    };
  }

  return {
    type: "FILE",
    title: "Tautan Berkas Pengerjaan",
    badge: "Berkas Lampiran",
    badgeBg: "#F1F5F9",
    badgeBorder: "#E2E8F0",
    badgeColor: "#334155",
    icon: FileText,
    iconColor: "#475569",
    iconBg: "#E2E8F0",
    actionText: "Buka Berkas",
    description: "Tautan eksternal hasil pengerjaan",
  };
}

export function MobileSmartDeliverableCard({
  submission,
  isLatest = true,
  index = 0,
  totalSubmissions = 1,
  onApprove,
  onRequestRevision,
  isUmkmOwner = false,
  isProjectCompleted = false,
}) {
  if (!submission) return null;

  const versionNumber = totalSubmissions - index;
  const versionLabel =
    isLatest && isProjectCompleted
      ? "Versi Final (Disetujui)"
      : `Deliverable v${versionNumber}${isLatest ? " (Terkini)" : ""}`;

  const linkMeta = getMobileSmartLinkMeta(submission.file_url);

  // Parse notes and checklist items
  const noteLines = (submission.catatan || "").split("\n");
  const checklistItems = noteLines
    .filter((l) => l.trim().startsWith("- [ ]") || l.trim().startsWith("- [x]"))
    .map((l) => l.replace(/^-\s*\[[ x]\]\s*/i, "").trim());

  const cleanNote = noteLines
    .filter(
      (l) =>
        !l.trim().startsWith("- [ ]") &&
        !l.trim().startsWith("- [x]") &&
        !l.trim().toLowerCase().startsWith("daftar poin perbaikan"),
    )
    .join("\n")
    .trim();

  const isApproved =
    submission.status === "APPROVED" || submission.status === "COMPLETED";
  const isRevisionRequested = submission.status === "REVISION_REQUESTED";

  const handleOpenLink = () => {
    if (submission.file_url) {
      Linking.openURL(submission.file_url).catch(() => {});
    }
  };

  return (
    <AppleGlossyCard style={styles.cardContainer}>
      {/* Card Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.versionRow}>
          <View
            style={[
              styles.versionBadge,
              isApproved && styles.versionBadgeApproved,
              !isLatest && styles.versionBadgeOld,
            ]}
          >
            <Text
              style={[
                styles.versionBadgeText,
                isApproved && { color: "#FFFFFF" },
                !isLatest && { color: "#475569" },
              ]}
            >
              {versionLabel}
            </Text>
          </View>
          <Text style={styles.dateText}>
            {formatDate(submission.created_at)}
          </Text>
        </View>

        {isApproved ? (
          <View style={styles.statusApprovedBadge}>
            <CheckCircle2 size={11} color="#059669" />
            <Text style={styles.statusApprovedText}>Disetujui</Text>
          </View>
        ) : isRevisionRequested ? (
          <View style={styles.statusRevisionBadge}>
            <RotateCcw size={11} color="#B45309" />
            <Text style={styles.statusRevisionText}>
              Revisi ({submission.jumlah_revisi || 1}/2)
            </Text>
          </View>
        ) : (
          <View style={styles.statusReviewBadge}>
            <Clock size={11} color="#2563EB" />
            <Text style={styles.statusReviewText}>Menunggu Review</Text>
          </View>
        )}
      </View>

      {/* Smart Link Feature Inset */}
      {linkMeta && submission.file_url && (
        <TouchableOpacity
          style={styles.linkBox}
          onPress={handleOpenLink}
          activeOpacity={0.82}
        >
          <View style={styles.linkLeftRow}>
            <View
              style={[
                styles.linkIconWrap,
                { backgroundColor: linkMeta.iconBg },
              ]}
            >
              <linkMeta.icon size={20} color={linkMeta.iconColor} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.linkTitleRow}>
                <Text style={styles.linkTitleText} numberOfLines={1}>
                  {linkMeta.title}
                </Text>
                <View
                  style={[
                    styles.linkMiniBadge,
                    {
                      backgroundColor: linkMeta.badgeBg,
                      borderColor: linkMeta.badgeBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.linkMiniBadgeText,
                      { color: linkMeta.badgeColor },
                    ]}
                  >
                    {linkMeta.badge}
                  </Text>
                </View>
              </View>
              <Text style={styles.linkDescText} numberOfLines={1}>
                {linkMeta.description}
              </Text>
              <Text style={styles.linkUrlText} numberOfLines={1}>
                {submission.file_url}
              </Text>
            </View>
          </View>

          <View style={styles.linkActionRow}>
            <Text style={styles.linkActionText}>{linkMeta.actionText}</Text>
            <ExternalLink size={13} color="#2563EB" />
          </View>
        </TouchableOpacity>
      )}

      {/* Clean Note Box */}
      {cleanNote ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Catatan Pengiriman:</Text>
          <Text style={styles.noteText}>"{cleanNote}"</Text>
        </View>
      ) : null}

      {/* Checklist Items */}
      {checklistItems.length > 0 && (
        <View style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>
            Poin Perbaikan yang Dikerjakan:
          </Text>
          {checklistItems.map((it, cIdx) => (
            <View key={cIdx} style={styles.checklistItemRow}>
              <Check
                size={12}
                color="#059669"
                strokeWidth={2.5}
                style={{ marginTop: 2 }}
              />
              <Text style={styles.checklistItemText}>{it}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions for UMKM */}
      {isUmkmOwner && isLatest && !isApproved && (
        <View style={styles.actionsRow}>
          <PebbleButton
            variant="glass"
            size="sm"
            title={
              submission.jumlah_revisi >= 2
                ? "Batas Habis (2/2)"
                : "Minta Revisi"
            }
            icon={RotateCcw}
            onPress={() => onRequestRevision && onRequestRevision(submission)}
            disabled={submission.jumlah_revisi >= 2}
            style={{ flex: 1 }}
          />

          <PebbleButton
            variant="sapphire"
            size="sm"
            title="Setujui & Cairkan"
            icon={CheckCircle2}
            onPress={() => onApprove && onApprove(submission)}
            style={{ flex: 1.4 }}
          />
        </View>
      )}
    </AppleGlossyCard>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    marginBottom: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.6)",
    paddingBottom: 10,
  },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    backgroundColor: "#2563EB",
  },
  versionBadgeApproved: {
    backgroundColor: "#059669",
  },
  versionBadgeOld: {
    backgroundColor: "#E2E8F0",
  },
  versionBadgeText: {
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: "#FFFFFF",
  },
  dateText: {
    fontSize: 10.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  statusApprovedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  statusApprovedText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: "#065F46",
  },
  statusRevisionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  statusRevisionText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: "#92400E",
  },
  statusReviewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  statusReviewText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: "#1E40AF",
  },
  linkBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 8,
  },
  linkLeftRow: {
    flexDirection: "row",
    gap: 10,
  },
  linkIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  linkTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  linkTitleText: {
    fontSize: 12.5,
    fontFamily: FONTS.bold,
    color: "#0F172A",
    flexShrink: 1,
  },
  linkMiniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    borderWidth: 1,
  },
  linkMiniBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
  },
  linkDescText: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginTop: 1,
  },
  linkUrlText: {
    fontSize: 10.5,
    fontFamily: FONTS.medium,
    color: "#2563EB",
    marginTop: 2,
  },
  linkActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.7)",
  },
  linkActionText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: "#2563EB",
  },
  noteBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  noteLabel: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  noteText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: "#1E293B",
    fontStyle: "italic",
    lineHeight: 18,
  },
  checklistCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 4,
  },
  checklistTitle: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: "#065F46",
    marginBottom: 2,
  },
  checklistItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  checklistItemText: {
    fontSize: 11.5,
    fontFamily: FONTS.medium,
    color: "#047857",
    flex: 1,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
});
