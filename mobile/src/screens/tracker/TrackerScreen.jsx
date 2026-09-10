import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { projectApi, proposalApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import { renderProjectCategoryVectorIcon } from "../../components/icons/CategoryIcons";
import { Header } from "../../components/ui/Header";
import { TrackerCardSkeleton } from "../../components/ui/Skeleton";
import {
  Layers,
  ArrowRight,
  Clock,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Users,
  Plus,
  Briefcase,
  FileText,
  AlertCircle,
} from "lucide-react-native";

export function TrackerScreen({ navigation }) {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // 'ALL' | 'ACTIVE' | 'PENDING' | 'DONE'

  const role = user?.role ? String(user.role).toUpperCase() : "";
  const email = user?.email ? String(user.email).toLowerCase() : "";
  const isMahasiswa =
    role === "MHS" ||
    role === "MAHASISWA" ||
    email.includes(".ac.id") ||
    email === "darell@ubsi.ac.id" ||
    (!user && true); // Default to MHS to prevent 403 on UMKM endpoint before hydration

  const loadData = async () => {
    try {
      setLoading(true);
      if (isMahasiswa) {
        const res = await proposalApi.getMyProposals();
        const raw = res?.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.items)
              ? raw.items
              : [];
        setItems(list);
      } else {
        const res = await projectApi.getMyProjects();
        const raw = res?.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.items)
              ? raw.items
              : [];
        setItems(list);
      }
    } catch (e) {
      console.warn("Tracker loadData error:", e.response?.data || e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [isMahasiswa, user?.id, user?.role]),
  );

  const activeJobsCount = isMahasiswa
    ? items.filter(
        (i) =>
          i.status === "ACCEPTED" &&
          i.project_status !== "DONE" &&
          i.project_status !== "COMPLETED",
      ).length
    : items.filter((i) => i.status === "IN_PROGRESS" || i.status === "REVIEW")
        .length;

  const pendingJobsCount = isMahasiswa
    ? items.filter((i) => i.status === "PENDING").length
    : items.filter((i) => ["OPEN", "BIDDING"].includes(i.status)).length;

  const doneJobsCount = isMahasiswa
    ? items.filter(
        (i) =>
          i.project_status === "DONE" ||
          i.project_status === "COMPLETED" ||
          ["REJECTED", "WITHDRAWN", "COMPLETED", "DONE", "SELESAI"].includes(
            i.status,
          ),
      ).length
    : items.filter((i) =>
        ["DONE", "CANCELLED", "COMPLETED", "SELESAI"].includes(i.status),
      ).length;

  // Role-tailored tabs in clean Bahasa Indonesia
  const segmentedTabs = isMahasiswa
    ? [
        { id: "ALL", label: "Semua", count: items.length },
        { id: "ACTIVE", label: "Dikerjakan", count: activeJobsCount },
        { id: "PENDING", label: "Dalam Seleksi", count: pendingJobsCount },
        { id: "DONE", label: "Riwayat", count: doneJobsCount },
      ]
    : [
        { id: "ALL", label: "Semua", count: items.length },
        { id: "ACTIVE", label: "Sedang Berjalan", count: activeJobsCount },
        { id: "PENDING", label: "Seleksi Pelamar", count: pendingJobsCount },
        { id: "DONE", label: "Selesai & Batal", count: doneJobsCount },
      ];

  const filteredItems = items.filter((item) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVE") {
      return isMahasiswa
        ? item.status === "ACCEPTED" &&
            item.project_status !== "DONE" &&
            item.project_status !== "COMPLETED"
        : item.status === "IN_PROGRESS" || item.status === "REVIEW";
    }
    if (activeTab === "PENDING") {
      return isMahasiswa
        ? item.status === "PENDING"
        : ["OPEN", "BIDDING"].includes(item.status);
    }
    if (activeTab === "DONE") {
      return isMahasiswa
        ? item.project_status === "DONE" ||
            item.project_status === "COMPLETED" ||
            ["REJECTED", "WITHDRAWN", "COMPLETED", "DONE", "SELESAI"].includes(
              item.status,
            )
        : ["DONE", "CANCELLED", "COMPLETED", "SELESAI"].includes(item.status);
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* 1. Standardized Unified Header */}
      <Header
        category="WORKSPACE"
        title="Ruang Kerja & Proyek"
        subtitle={`${activeJobsCount} sedang berjalan • ${items.length} total proyek`}
        rightAction={
          !isMahasiswa ? (
            <TouchableOpacity
              style={styles.newProjectBtn}
              onPress={() => navigation.navigate("PostProject")}
              activeOpacity={0.85}
            >
              <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.newProjectBtnText}>Proyek Baru</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* 2. Responsive Horizontal Pill Tabs (Never Offside/Clipped) */}
      <View style={styles.tabBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarScroll}
        >
          {segmentedTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabPill, isActive && styles.tabPillActive]}
                activeOpacity={0.75}
              >
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View
                    style={[styles.tabBadge, isActive && styles.tabBadgeActive]}
                  >
                    <Text
                      style={[
                        styles.tabBadgeText,
                        isActive && styles.tabBadgeTextActive,
                      ]}
                    >
                      {tab.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Breathable Project Feed */}
      {loading && items.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <TrackerCardSkeleton />
          <TrackerCardSkeleton />
          <TrackerCardSkeleton />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadData}
              tintColor={COLORS.brandIndigo}
              colors={[COLORS.brandIndigo]}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyBox}>
                <View style={styles.emptyIconCircle}>
                  <Briefcase size={28} color={COLORS.brandIndigo} />
                </View>
                <Text style={styles.emptyTitle}>Tidak ada proyek di tab ini</Text>
                <Text style={styles.emptyDesc}>
                  {isMahasiswa
                    ? "Jelajahi tawaran proyek UMKM terverifikasi dan ajukan proposal terbaik Anda."
                    : "Pasang proyek pertama Anda untuk terhubung dengan mahasiswa bertalenta kampus."}
                </Text>
                {isMahasiswa ? (
                  <TouchableOpacity
                    style={styles.emptyCtaBtn}
                    onPress={() => navigation.navigate("ProjectsTab")}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.emptyCtaBtnText}>Jelajahi Proyek</Text>
                    <ArrowRight size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.emptyCtaBtn}
                    onPress={() => navigation.navigate("PostProject")}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.emptyCtaBtnText}>
                      + Pasang Proyek Baru
                    </Text>
                    <ArrowRight size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
            )
          }
          renderItem={({ item }) => {
            // Determine roles & properties
            const projectId = isMahasiswa ? item.project_id : item.id;
            const projectTitle = isMahasiswa ? item.project_judul : item.judul;
            const partnerName = isMahasiswa
              ? item.project_umkm_nama || "Mitra UMKM Kampus"
              : item.accepted_mhs_nama || "Daftar Proyek Anda";
            const partnerPhoto = isMahasiswa
              ? item.project_umkm_foto ||
                item.umkm_foto ||
                item.project?.umkm_profile?.url_foto_usaha
              : item.accepted_mhs_foto ||
                item.mhs_profile?.url_foto ||
                item.mhs_foto;
            const category = isMahasiswa
              ? item.project_kategori || item.kategori || "UMKM"
              : item.kategori || "UMKM";
            const createdAt = item.created_at;

            // Status & Chat Logic
            const isDone = isMahasiswa
              ? item.project_status === "DONE" ||
                item.project_status === "COMPLETED" ||
                ["DONE", "COMPLETED", "SELESAI"].includes(item.status)
              : ["DONE", "COMPLETED", "SELESAI"].includes(item.status);

            const isAccepted = isMahasiswa
              ? item.status === "ACCEPTED" && !isDone
              : item.status === "IN_PROGRESS";

            const isPending = isMahasiswa
              ? item.status === "PENDING"
              : item.status === "OPEN" || item.status === "BIDDING";

            const isReview = !isMahasiswa && item.status === "REVIEW";

            const isWithdrawn = item.status === "WITHDRAWN";
            const isCancelled = item.status === "CANCELLED";
            const isRejected = item.status === "REJECTED";

            // Chat is relevant when work is active or in review!
            const canChat = isAccepted || isReview;

            return (
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate("ProjectDetail", {
                    id: projectId,
                    projectId: projectId,
                  })
                }
                style={[
                  styles.projectCard,
                  isAccepted && styles.projectCardActive,
                ]}
              >
                {/* Card Header: Category Icon + Partner Info + Status Badge */}
                <View style={styles.cardHeader}>
                  <View style={styles.partnerRow}>
                    {partnerPhoto ? (
                      <Image
                        source={{ uri: partnerPhoto }}
                        style={styles.partnerAvatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[
                          styles.categoryBox,
                          isAccepted && styles.categoryBoxActive,
                        ]}
                      >
                        {renderProjectCategoryVectorIcon(
                          category,
                          projectTitle,
                          18,
                          isAccepted ? COLORS.success : COLORS.brandIndigo,
                        )}
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={styles.partnerName} numberOfLines={1}>
                        {partnerName}
                      </Text>
                      <Text style={styles.postDate}>
                        {isMahasiswa ? "Dilamar " : "Dibuat "}
                        {formatDate(createdAt)}
                      </Text>
                    </View>
                  </View>

                  {/* Clean Status Pill (Indonesian, Accurate) */}
                  {isAccepted ? (
                    <View style={styles.statusPillActive}>
                      <View style={styles.pulseDotGreen} />
                      <Text style={styles.statusTextActive}>Dikerjakan</Text>
                    </View>
                  ) : isReview ? (
                    <View style={styles.statusPillReview}>
                      <View style={styles.pulseDotPurple} />
                      <Text style={styles.statusTextReview}>Pemeriksaan</Text>
                    </View>
                  ) : isPending ? (
                    <View style={styles.statusPillPending}>
                      <Text style={styles.statusTextPending}>
                        {isMahasiswa
                          ? "Dalam Seleksi"
                          : `${item.total_pelamar || 0} Pelamar`}
                      </Text>
                    </View>
                  ) : isDone ? (
                    <View style={styles.statusPillDone}>
                      <Text style={styles.statusTextDone}>Selesai</Text>
                    </View>
                  ) : isWithdrawn ? (
                    <View style={styles.statusPillWithdrawn}>
                      <Text style={styles.statusTextWithdrawn}>Ditarik</Text>
                    </View>
                  ) : isCancelled ? (
                    <View style={styles.statusPillCancelled}>
                      <Text style={styles.statusTextCancelled}>
                        {item.cancelled_by_role === "SYSTEM_EXPIRED"
                          ? "Kedaluwarsa"
                          : "Dibatalkan"}
                      </Text>
                    </View>
                  ) : isRejected ? (
                    <View style={styles.statusPillRejected}>
                      <Text style={styles.statusTextRejected}>Ditolak</Text>
                    </View>
                  ) : (
                    <View style={styles.statusPillDefault}>
                      <Text style={styles.statusTextDefault}>
                        {formatStatus(item.status)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Project Title */}
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {projectTitle || "Penugasan Proyek"}
                </Text>

                {/* Detailed Cancellation / Withdrawal Reason Box */}
                {isCancelled && (
                  <View style={styles.reasonCardBox}>
                    <View style={styles.reasonHeaderRow}>
                      <AlertCircle size={12} color="#B91C1C" />
                      <Text style={styles.reasonCardTitle}>
                        {item.cancelled_by_role === "SYSTEM_EXPIRED"
                          ? "Kedaluwarsa Otomatis:"
                          : item.cancelled_by_role === "MAHASISWA"
                            ? "Dibatalkan oleh Mahasiswa:"
                            : "Dibatalkan oleh Klien:"}
                      </Text>
                    </View>
                    <Text style={styles.reasonCardText} numberOfLines={2}>
                      "{item.cancel_reason || "Tenggat waktu pengerjaan telah berakhir."}"
                    </Text>
                  </View>
                )}

                {isWithdrawn && (
                  <View style={styles.reasonCardBoxWithdrawn}>
                    <View style={styles.reasonHeaderRow}>
                      <FileText size={12} color="#92400E" />
                      <Text style={styles.reasonCardTitleWithdrawn}>
                        Proposal Ditarik Mahasiswa:
                      </Text>
                    </View>
                    <Text style={styles.reasonCardTextWithdrawn} numberOfLines={2}>
                      "{item.withdraw_reason || "Mahasiswa menarik kembali proposal lamaran ini."}"
                    </Text>
                  </View>
                )}

                {/* Bottom Row: Metadata & Quick Actions */}
                <View style={styles.cardBottomRow}>
                  {/* Meta info: Budget, Timeline, Escrow */}
                  <View style={styles.metaInfo}>
                    <Text style={styles.budgetHighlight}>
                      {formatCurrency(
                        isMahasiswa ? item.harga_tawar : item.budget_max,
                      )}
                    </Text>
                    <Text style={styles.metaDivider}>•</Text>
                    <View style={styles.metaIconText}>
                      <Clock size={11} color={COLORS.textMuted} />
                      <Text style={styles.metaLabel}>
                        {isMahasiswa
                          ? `${item.estimasi_hari || 5} hari`
                          : `${item.total_pelamar || 0} pelamar`}
                      </Text>
                    </View>
                    <Text style={styles.metaDivider}>•</Text>
                    <View style={styles.metaIconText}>
                      <ShieldCheck size={11} color={COLORS.success} />
                      <Text style={styles.escrowLabel}>Escrow</Text>
                    </View>
                  </View>

                  {/* Quick Action: Direct Chat & View */}
                  <View style={styles.actionGroup}>
                    {canChat && (
                      <TouchableOpacity
                        style={styles.quickChatBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          navigation.navigate("Chat", {
                            projectId: projectId,
                            projectTitle: projectTitle,
                            partnerPhoto: partnerPhoto,
                            partnerName: isMahasiswa
                              ? (item.project_umkm_nama &&
                                item.project_umkm_nama.toLowerCase() !==
                                  "string"
                                  ? item.project_umkm_nama
                                  : null) ||
                                (item.umkm_nama &&
                                item.umkm_nama.toLowerCase() !== "string"
                                  ? item.umkm_nama
                                  : null) ||
                                "Mitra UMKM"
                              : (item.mahasiswa_nama &&
                                item.mahasiswa_nama.toLowerCase() !== "string"
                                  ? item.mahasiswa_nama
                                  : null) ||
                                (item.accepted_mhs_nama &&
                                item.accepted_mhs_nama.toLowerCase() !==
                                  "string"
                                  ? item.accepted_mhs_nama
                                  : null) ||
                                "Talenta Kampus",
                          });
                        }}
                        activeOpacity={0.8}
                      >
                        <MessageSquare
                          size={12}
                          color={COLORS.brandIndigo}
                          strokeWidth={2.5}
                        />
                        <Text style={styles.quickChatBtnText}>Chat</Text>
                      </TouchableOpacity>
                    )}
                    <View style={styles.chevronBox}>
                      <ChevronRight size={16} color={COLORS.textMuted} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  tabBarWrapper: {
    backgroundColor: COLORS.bgSurface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  tabBarScroll: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tabPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  tabPillActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
    ...SHADOWS.sm,
  },
  tabLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: "#FFFFFF",
  },
  tabBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.08)",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 999,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  tabBadgeText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  tabBadgeTextActive: {
    color: "#FFFFFF",
  },

  newProjectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  newProjectBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Feed List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  // Streamlined Card
  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.sm,
  },
  projectCardActive: {
    borderColor: "rgba(79, 70, 229, 0.35)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  partnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flex: 1,
    marginRight: 8,
  },
  partnerAvatarImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  categoryBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.bgDark,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  categoryBoxActive: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.3)",
  },
  partnerName: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  postDate: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },

  // Status Pills
  statusPillActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  pulseDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#059669",
  },
  statusTextActive: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
  },

  statusPillReview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  pulseDotPurple: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brandIndigo,
  },
  statusTextReview: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },

  statusPillPending: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  statusTextPending: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#D97706",
  },

  statusPillDone: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statusTextDone: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },

  statusPillWithdrawn: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  statusTextWithdrawn: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#92400E",
  },

  statusPillCancelled: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  statusTextCancelled: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#DC2626",
  },

  statusPillRejected: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  statusTextRejected: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#DC2626",
  },

  statusPillDefault: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  statusTextDefault: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
  },

  // Reason Callout Boxes
  reasonCardBox: {
    backgroundColor: "#FEF2F2",
    padding: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: 4,
    marginBottom: 8,
  },
  reasonHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  reasonCardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    color: "#B91C1C",
    fontWeight: "700",
  },
  reasonCardText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#991B1B",
    fontStyle: "italic",
    lineHeight: 15,
  },

  reasonCardBoxWithdrawn: {
    backgroundColor: "#FEF3C7",
    padding: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginTop: 4,
    marginBottom: 8,
  },
  reasonCardTitleWithdrawn: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    color: "#92400E",
    fontWeight: "700",
  },
  reasonCardTextWithdrawn: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#78350F",
    fontStyle: "italic",
    lineHeight: 15,
  },

  // Title
  cardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 20,
    marginBottom: 4,
  },

  // Bottom Row
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    marginTop: 4,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  budgetHighlight: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  metaDivider: {
    fontFamily: FONTS.bodyRegular,
    color: COLORS.borderDark,
    fontSize: 11,
  },
  metaIconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  escrowLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.success,
    fontWeight: "700",
  },

  // Action Buttons
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quickChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quickChatBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  chevronBox: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty State
  emptyBox: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginTop: 20,
    ...SHADOWS.sm,
  },
  emptyIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
  },
  emptyDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
    maxWidth: 260,
  },
  emptyCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginTop: 16,
  },
  emptyCtaBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
