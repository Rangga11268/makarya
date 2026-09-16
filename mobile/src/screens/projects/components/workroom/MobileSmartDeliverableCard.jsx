import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from "react-native";
import { FONTS } from "../../../../theme/fonts";
import { formatDate } from "../../../../utils/formatDate";
import { AppleGlossyCard } from "../../../../components/ui/AppleGlossyCard";
import { formatCurrency } from "../../../../utils/formatCurrency";
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
  Coins,
} from "lucide-react-native";

export function getMobileSmartLinkMeta(url) {
  if (!url) return null;
  const lower = url.toLowerCase();

  if (lower.includes("figma.com")) {
    return {
      type: "FIGMA",
      title: "Kanvas Desain Figma",
      badge: "Figma",
      badgeBg: "#F3E8FF",
      badgeBorder: "#D8B4FE",
      badgeColor: "#6B21A8",
      icon: Palette,
      iconColor: "#7C3AED",
      iconBg: "#EDE9FE",
      actionText: "Buka Figma",
      description: "Pratinjau antarmuka UI/UX dan token desain",
    };
  }
  if (lower.includes("github.com") || lower.includes("gitlab.com")) {
    return {
      type: "CODE",
      title: "Repositori Kode Sumber",
      badge: "GitHub",
      badgeBg: "#F1F5F9",
      badgeBorder: "#CBD5E1",
      badgeColor: "#1E293B",
      icon: FileCode,
      iconColor: "#0F172A",
      iconBg: "#E2E8F0",
      actionText: "Lihat Kode",
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
      badge: "Cloud Drive",
      badgeBg: "#EFF6FF",
      badgeBorder: "#BFDBFE",
      badgeColor: "#1D4ED8",
      icon: FolderArchive,
      iconColor: "#2563EB",
      iconBg: "#DBEAFE",
      actionText: "Buka Folder",
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
      badge: "Web Demo",
      badgeBg: "#ECFDF5",
      badgeBorder: "#A7F3D0",
      badgeColor: "#065F46",
      icon: Globe,
      iconColor: "#059669",
      iconBg: "#D1FAE5",
      actionText: "Coba Demo",
      description: "Aplikasi langsung yang dapat diuji interaksinya",
    };
  }

  return {
    type: "FILE",
    title: "Tautan Berkas Pengerjaan",
    badge: "Berkas",
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
  onApprove,
  onRequestRevision,
  isUmkmOwner = false,
  isProjectCompleted = false,
}) {
  if (!submission) return null;

  const fileUrl = submission.url_berkas || submission.file_url || "";
  const sourceUrl = submission.url_source_file || null;
  const rawNotes = submission.catatan_pengiriman || submission.catatan || "";
  const dateSubmitted = submission.submitted_at || submission.created_at;

  const submitterName = submission.submitter_name || "Mahasiswa Pelaksana";
  const submitterPhoto = submission.submitter_photo || null;
  const submitterKampus = submission.submitter_kampus || "Perguruan Tinggi";
  const submitterProdi = submission.submitter_prodi || "Talenta Digital";
  const roleName = submission.role_name || "Pelaksana Slot";

  const isApproved =
    submission.status === "APPROVED" || submission.status === "COMPLETED";
  const isRevisionRequested = submission.status === "REVISION_REQUESTED";

  const statusSubtext = isApproved
    ? "Disetujui"
    : isRevisionRequested
      ? `Revisi ke-${submission.jumlah_revisi || 1}`
      : "Menunggu Review";

  const linkMeta = getMobileSmartLinkMeta(fileUrl);
  const sourceLinkMeta = sourceUrl ? getMobileSmartLinkMeta(sourceUrl) : null;

  // Parse notes and checklist items
  const noteLines = (rawNotes || "").split("\n");
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

  const handleOpenLink = (url) => {
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <AppleGlossyCard style={styles.cardContainer}>
      {/* 1. Integrated Clean Header: Submitter + Role + Status */}
      <View style={styles.topHeader}>
        <View style={styles.submitterIdentity}>
          {submitterPhoto ? (
            <Image
              source={{ uri: submitterPhoto }}
              style={styles.submitterAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.submitterAvatarFallback}>
              <Text style={styles.submitterAvatarInitial}>
                {submitterName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.submitterInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.submitterName} numberOfLines={1}>
                {submitterName}
              </Text>
              <View style={styles.rolePill}>
                <Text style={styles.rolePillText}>{roleName}</Text>
              </View>
            </View>
            <Text style={styles.campusText} numberOfLines={1}>
              {submitterKampus} / {submitterProdi}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 2,
              }}
            >
              <Text style={styles.metaSubtext}>
                {statusSubtext} ({formatDate(dateSubmitted)})
              </Text>
              {submission.honor_amount || submission.slot_budget ? (
                <View
                  style={{
                    backgroundColor: "#ECFDF5",
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: "#A7F3D0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontFamily: FONTS.displayBold,
                      color: "#047857",
                    }}
                  >
                    {formatCurrency(
                      submission.honor_amount || submission.slot_budget,
                    )}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Status Pill on the Right */}
        <View style={styles.statusWrap}>
          {isApproved ? (
            <View style={styles.statusBadgeApproved}>
              <CheckCircle2 size={11} color="#059669" />
              <Text style={styles.statusTextApproved}>Lunas</Text>
            </View>
          ) : isRevisionRequested ? (
            <View style={styles.statusBadgeRevision}>
              <RotateCcw size={11} color="#B45309" />
              <Text style={styles.statusTextRevision}>
                Revisi ({submission.jumlah_revisi || 1}/2)
              </Text>
            </View>
          ) : (
            <View style={styles.statusBadgeReview}>
              <Clock size={11} color="#2563EB" />
              <Text style={styles.statusTextReview}>Menunggu</Text>
            </View>
          )}
        </View>
      </View>

      {/* 2. Smart Link Deliverable Preview Box */}
      {linkMeta && fileUrl ? (
        <TouchableOpacity
          style={styles.linkBox}
          onPress={() => handleOpenLink(fileUrl)}
          activeOpacity={0.82}
        >
          <View style={styles.linkMainRow}>
            <View
              style={[
                styles.linkIconWrap,
                { backgroundColor: linkMeta.iconBg },
              ]}
            >
              <linkMeta.icon size={18} color={linkMeta.iconColor} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
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
              <Text style={styles.linkUrlText} numberOfLines={1}>
                {fileUrl}
              </Text>
            </View>
          </View>

          <View style={styles.linkActionRow}>
            <Text style={styles.linkActionText}>{linkMeta.actionText}</Text>
            <ExternalLink size={12} color="#2563EB" />
          </View>
        </TouchableOpacity>
      ) : null}

      {/* 3. Secondary Source File Link (if present) */}
      {sourceUrl && sourceLinkMeta ? (
        <TouchableOpacity
          style={styles.sourceBox}
          onPress={() => handleOpenLink(sourceUrl)}
          activeOpacity={0.82}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              flex: 1,
            }}
          >
            <FileCode size={15} color="#475569" />
            <Text style={styles.sourceTitleText} numberOfLines={1}>
              Source Code / Berkas Tambahan
            </Text>
          </View>
          <ExternalLink size={12} color="#64748B" />
        </TouchableOpacity>
      ) : null}

      {/* 4. Notes Section */}
      {cleanNote ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Catatan Pengiriman:</Text>
          <Text style={styles.noteText}>"{cleanNote}"</Text>
        </View>
      ) : null}

      {/* 5. Checklist Items */}
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

      {/* 6. UMKM Review Action Buttons (Available for any unapproved submission) */}
      {isUmkmOwner && !isApproved && (
        <View style={styles.actionsRow}>
          <PebbleButton
            variant="glass"
            size="sm"
            title={
              submission.jumlah_revisi >= 2 ? "Batas Habis" : "Minta Revisi"
            }
            icon={RotateCcw}
            onPress={() => onRequestRevision && onRequestRevision(submission)}
            disabled={submission.jumlah_revisi >= 2}
            style={{ flex: 1 }}
          />

          <PebbleButton
            variant="sapphire"
            size="sm"
            title={`Setujui (${roleName})`}
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
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.6)",
    paddingBottom: 10,
    gap: 8,
  },
  submitterIdentity: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  submitterAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    marginTop: 1,
  },
  submitterAvatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginTop: 1,
  },
  submitterAvatarInitial: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: "#1D4ED8",
  },
  submitterInfo: {
    flex: 1,
    gap: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  submitterName: {
    fontSize: 12.5,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  rolePillText: {
    fontSize: 9.5,
    fontFamily: FONTS.bold,
    color: "#1D4ED8",
  },
  campusText: {
    fontSize: 10.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
  },
  metaSubtext: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: "#94A3B8",
    marginTop: 1,
  },
  statusWrap: {
    alignItems: "flex-end",
    marginTop: 1,
  },
  statusBadgeApproved: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  statusTextApproved: {
    fontSize: 9.5,
    fontFamily: FONTS.bold,
    color: "#065F46",
  },
  statusBadgeRevision: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  statusTextRevision: {
    fontSize: 9.5,
    fontFamily: FONTS.bold,
    color: "#92400E",
  },
  statusBadgeReview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3.5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  statusTextReview: {
    fontSize: 9.5,
    fontFamily: FONTS.bold,
    color: "#1E40AF",
  },
  linkBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    gap: 8,
  },
  linkMainRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  linkIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
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
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: "#0F172A",
    flexShrink: 1,
  },
  linkMiniBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
  },
  linkMiniBadgeText: {
    fontSize: 8.5,
    fontFamily: FONTS.bold,
  },
  linkUrlText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: "#2563EB",
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
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: "#2563EB",
  },
  sourceBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceTitleText: {
    fontSize: 10.5,
    fontFamily: FONTS.medium,
    color: "#334155",
  },
  noteBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  noteLabel: {
    fontSize: 9.5,
    fontFamily: FONTS.bold,
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  noteText: {
    fontSize: 11.5,
    fontFamily: FONTS.regular,
    color: "#1E293B",
    fontStyle: "italic",
    lineHeight: 16,
  },
  checklistCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 4,
  },
  checklistTitle: {
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: "#065F46",
    marginBottom: 2,
  },
  checklistItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
  },
  checklistItemText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: "#047857",
    flex: 1,
    lineHeight: 15,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
});
