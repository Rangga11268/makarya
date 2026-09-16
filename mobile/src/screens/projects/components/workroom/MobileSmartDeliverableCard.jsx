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
  User,
} from "lucide-react-native";

export function getMobileSmartLinkMeta(url) {
  if (!url) return null;
  const lower = url.toLowerCase();

  if (lower.includes("figma.com")) {
    return {
      type: "FIGMA",
      title: "Kanvas Desain Figma",
      badge: "Figma File",
      badge: "Figma",
      badgeBg: "#F3E8FF",
      badgeBorder: "#D8B4FE",
      badgeColor: "#6B21A8",
      icon: Palette,
      iconColor: "#7C3AED",
      iconBg: "#EDE9FE",
      actionText: "Buka Kanvas Figma",
      actionText: "Buka Figma",
      description: "Pratinjau antarmuka UI/UX dan token desain",
    };
  }
  if (lower.includes("github.com") || lower.includes("gitlab.com")) {
    return {
      type: "CODE",
      title: "Repositori Kode Sumber",
      badge: "GitHub / GitLab",
      badge: "GitHub",
      badgeBg: "#F1F5F9",
      badgeBorder: "#CBD5E1",
      badgeColor: "#1E293B",
      icon: FileCode,
      iconColor: "#0F172A",
      iconBg: "#E2E8F0",
      actionText: "Inspeksi Source Code",
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
      badge: "Google Drive / Cloud",
      badge: "Cloud Drive",
      badgeBg: "#EFF6FF",
      badgeBorder: "#BFDBFE",
      badgeColor: "#1D4ED8",
      icon: FolderArchive,
      iconColor: "#2563EB",
      iconBg: "#DBEAFE",
      actionText: "Akses Folder Master",
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
      badge: "Web Preview",
      badge: "Web Demo",
      badgeBg: "#ECFDF5",
      badgeBorder: "#A7F3D0",
      badgeColor: "#065F46",
      icon: Globe,
      iconColor: "#059669",
      iconBg: "#D1FAE5",
      actionText: "Uji Demo Langsung",
      actionText: "Coba Demo",
      description: "Aplikasi langsung yang dapat diuji interaksinya",
    };
  }

  return {
    type: "FILE",
    title: "Tautan Berkas Pengerjaan",
    badge: "Berkas Lampiran",
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
  isLatest = true,
  index = 0,
  totalSubmissions = 1,
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
  const roleName = submission.role_name || "Pelaksana Proyek";
  const roleName = submission.role_name || "Pelaksana";

  const versionNumber = totalSubmissions - index;
  const versionLabel =
  const versionText =
    isLatest && isProjectCompleted
      ? "Versi Final (Disetujui)"
      : `Deliverable v${versionNumber}${isLatest ? " (Terkini)" : ""}`;
      ? "Versi Final (Selesai)"
      : `Versi ${versionNumber}${isLatest ? " (Terkini)" : ""}`;

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

  const isApproved =
    submission.status === "APPROVED" || submission.status === "COMPLETED";
  const isRevisionRequested = submission.status === "REVISION_REQUESTED";

  const handleOpenLink = (url) => {
    if (url) {
      Linking.openURL(url).catch(() => {});
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
          <Text style={styles.dateText}>{formatDate(dateSubmitted)}</Text>
        </View>
      {/* 1. Integrated Clean Header: Submitter + Status (No crowded double badges) */}
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
          </View>
        ) : (
          <View style={styles.statusReviewBadge}>
            <Clock size={11} color="#2563EB" />
            <Text style={styles.statusReviewText}>Menunggu Review</Text>
          </View>
        )}
      </View>

      {/* Submitter & Team Role Identity Banner */}
      <View style={styles.submitterBox}>
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
            <Text style={styles.metaSubtext}>
              {versionText} ({formatDate(dateSubmitted)})
            </Text>
          </View>
        )}
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.submitterNameRow}>
            <Text style={styles.submitterNameText} numberOfLines={1}>
              {submitterName}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{roleName}</Text>
        {/* Status Pill on the Right */}
        <View style={styles.statusWrap}>
          {isApproved ? (
            <View style={styles.statusBadgeApproved}>
              <CheckCircle2 size={11} color="#059669" />
              <Text style={styles.statusTextApproved}>Disetujui</Text>
            </View>
          </View>
          <Text style={styles.submitterEduText} numberOfLines={1}>
            {submitterKampus} • {submitterProdi}
          </Text>
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

      {/* Smart Link Feature Inset */}
      {/* 2. Smart Link Deliverable Preview Box */}
      {linkMeta && fileUrl ? (
        <TouchableOpacity
          style={styles.linkBox}
          onPress={() => handleOpenLink(fileUrl)}
          activeOpacity={0.82}
        >
          <View style={styles.linkLeftRow}>
          <View style={styles.linkMainRow}>
            <View
              style={[
                styles.linkIconWrap,
                { backgroundColor: linkMeta.iconBg },
              ]}
            >
              <linkMeta.icon size={20} color={linkMeta.iconColor} />
              <linkMeta.icon size={18} color={linkMeta.iconColor} />
            </View>
            <View style={{ flex: 1 }}>
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
              <Text style={styles.linkDescText} numberOfLines={1}>
                {linkMeta.description}
              </Text>
              <Text style={styles.linkUrlText} numberOfLines={1}>
                {fileUrl}
              </Text>
            </View>
          </View>

          <View style={styles.linkActionRow}>
            <Text style={styles.linkActionText}>{linkMeta.actionText}</Text>
            <ExternalLink size={13} color="#2563EB" />
            <ExternalLink size={12} color="#2563EB" />
          </View>
        </TouchableOpacity>
      ) : null}

      {/* Secondary Source Link (if present) */}
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
            <FileCode size={16} color="#475569" />
            <View style={{ flex: 1 }}>
              <Text style={styles.sourceTitleText} numberOfLines={1}>
                Berkas Source / Lampiran
              </Text>
              <Text style={styles.sourceUrlText} numberOfLines={1}>
                {sourceUrl}
              </Text>
            </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
            <FileCode size={15} color="#475569" />
            <Text style={styles.sourceTitleText} numberOfLines={1}>
              Source Code / Berkas Tambahan
            </Text>
          </View>
          <ExternalLink size={12} color="#64748B" />
        </TouchableOpacity>
      ) : null}

      {/* Clean Note Box */}
      {/* 4. Notes Section */}
      {cleanNote ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteLabel}>Catatan Pengiriman:</Text>
          <Text style={styles.noteText}>"{cleanNote}"</Text>
        </View>
      ) : null}

      {/* Checklist Items */}
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

      {/* Actions for UMKM */}
      {/* 6. UMKM Review Action Buttons */}
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
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  headerRow: {
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    alignItems: "flex-start",
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
  submitterIdentity: {
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
  submitterBox: {
    flexDirection: "row",
    alignItems: "center",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
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
  submitterNameRow: {
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
  submitterNameText: {
  submitterName: {
    fontSize: 12.5,
    fontFamily: FONTS.bold,
    color: "#0F172A",
  },
  roleBadge: {
  rolePill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  roleBadgeText: {
  rolePillText: {
    fontSize: 9.5,
    fontFamily: FONTS.bold,
    color: "#1D4ED8",
  },
  submitterEduText: {
  campusText: {
    fontSize: 10.5,
    fontFamily: FONTS.regular,
    color: "#64748B",
    marginTop: 2,
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
    borderRadius: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    padding: 10,
    gap: 8,
  },
  linkLeftRow: {
  linkMainRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  linkIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
    fontSize: 12.5,
    fontSize: 12,
    fontFamily: FONTS.bold,
    color: "#0F172A",
    flexShrink: 1,
  },
  linkMiniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
  },
  linkMiniBadgeText: {
    fontSize: 9,
    fontSize: 8.5,
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
    fontSize: 10,
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
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: "#2563EB",
  },
  sourceBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sourceTitleText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    fontSize: 10.5,
    fontFamily: FONTS.medium,
    color: "#334155",
  },
  sourceUrlText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: "#64748B",
  },
  noteBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 10,
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  noteLabel: {
    fontSize: 10,
    fontSize: 9.5,
    fontFamily: FONTS.bold,
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  noteText: {
    fontSize: 12,
    fontSize: 11.5,
    fontFamily: FONTS.regular,
    color: "#1E293B",
    fontStyle: "italic",
    lineHeight: 18,
    lineHeight: 16,
  },
  checklistCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    padding: 10,
    borderRadius: 12,
    padding: 9,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    gap: 4,
  },
  checklistTitle: {
    fontSize: 11,
    fontSize: 10.5,
    fontFamily: FONTS.bold,
    color: "#065F46",
    marginBottom: 2,
  },
  checklistItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    gap: 5,
  },
  checklistItemText: {
    fontSize: 11.5,
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: "#047857",
    flex: 1,
    lineHeight: 16,
    lineHeight: 15,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    marginTop: 2,
  },
});
