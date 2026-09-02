import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Header } from "../../components/ui/Header";
import { ProjectStatusBar } from "../../components/features/ProjectStatusBar";
import { projectApi, proposalApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { renderProjectCategoryVectorIcon } from "../../components/icons/CategoryIcons";
import {
  Layers,
  ArrowRight,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Building2,
  FileCheck,
  Sparkles,
} from "lucide-react-native";

export function TrackerScreen({ navigation }) {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // 'ALL' | 'ACTIVE' | 'PENDING' | 'DONE'

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const loadData = async () => {
    try {
      setLoading(true);
      if (isMahasiswa) {
        const res = await proposalApi.getMyProposals();
        setItems(Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await projectApi.getMyProjects();
        setItems(Array.isArray(res.data) ? res.data : []);
      }
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.role]);

  const activeJobsCount = items.filter((i) => i.status === "ACCEPTED").length;
  const pendingJobsCount = items.filter((i) => i.status === "PENDING").length;

  const segmentedTabs = [
    { id: "ALL", label: "Semua" },
    { id: "ACTIVE", label: "Aktif", count: activeJobsCount },
    { id: "PENDING", label: "Review", count: pendingJobsCount },
    { id: "DONE", label: "Selesai" },
  ];

  const filteredItems = items.filter((item) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVE") return item.status === "ACCEPTED";
    if (activeTab === "PENDING") return item.status === "PENDING";
    if (activeTab === "DONE")
      return item.status === "COMPLETED" || item.status === "REJECTED";
    return true;
  });

  return (
    <View style={styles.container}>
      {/* 1. Header (Matching Modern Workspace Style) */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>
            {isMahasiswa ? "Papan Kerja & Lamaran" : "Manajemen Proyek"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isMahasiswa
              ? `${activeJobsCount} Proyek Aktif • ${pendingJobsCount} Menunggu Keputusan`
              : "Pantau pesanan proyek & seleksi proposal mahasiswa"}
          </Text>
        </View>
      </View>

      {/* 2. Modern Underline Segmented Tabs (Clean Single Line) */}
      <View style={styles.segmentedContainer}>
        {segmentedTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={styles.segmentedTabItem}
              activeOpacity={0.7}
            >
              <View style={styles.tabItemContent}>
                <Text
                  style={[
                    styles.segmentedTabText,
                    isActive && styles.segmentedTabTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
                {tab.count !== undefined && tab.count > 0 && (
                  <View
                    style={[
                      styles.tabCountPill,
                      isActive && styles.tabCountPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabCountText,
                        isActive && styles.tabCountTextActive,
                      ]}
                    >
                      {tab.count}
                    </Text>
                  </View>
                )}
              </View>
              {isActive && <View style={styles.activeUnderlineBar} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 3. Modern Workspace Card Feed */}
      <FlatList
        data={isMahasiswa ? filteredItems : items}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={COLORS.brandIndigo}
            colors={[COLORS.brandIndigo]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyBox}>
              <Layers size={40} color={COLORS.brandIndigo} />
              <Text style={styles.emptyTitle}>
                {isMahasiswa
                  ? "Belum Ada Lamaran di Kategori Ini"
                  : "Tidak Ada Proyek Aktif"}
              </Text>
              <Text style={styles.emptyDesc}>
                {isMahasiswa
                  ? "Jelajahi proyek baru di tab Eksplor dan kirim penawaran pertamamu."
                  : "Mulai buat proyek baru untuk merekrut talenta mahasiswa kampus."}
              </Text>
              {isMahasiswa && (
                <TouchableOpacity
                  style={styles.exploreCtaBtn}
                  onPress={() => navigation.navigate("ProjectsTab")}
                  activeOpacity={0.85}
                >
                  <Text style={styles.exploreCtaBtnText}>
                    Jelajah Katalog Proyek
                  </Text>
                  <ArrowRight size={14} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          )
        }
        renderItem={({ item }) => {
          if (isMahasiswa) {
            const isAccepted = item.status === "ACCEPTED";
            const isPending = item.status === "PENDING";
            const isRejected = item.status === "REJECTED";

            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("ProjectDetail", {
                    id: item.project_id,
                    projectId: item.project_id,
                  })
                }
                style={[
                  styles.workspaceCard,
                  isAccepted && styles.workspaceCardActiveGlow,
                ]}
              >
                {/* Top Row: Client Info & Status Badge */}
                <View style={styles.cardTopRow}>
                  <View style={styles.clientGroup}>
                    <View
                      style={[
                        styles.clientIconBox,
                        isAccepted ? styles.clientIconBoxActive : {},
                      ]}
                    >
                      {renderProjectCategoryVectorIcon(
                        item.kategori,
                        item.project_judul,
                        22,
                        isAccepted ? COLORS.success : COLORS.brandIndigo,
                      )}
                    </View>
                    <View>
                      <Text style={styles.clientName}>
                        {item.project_umkm_nama || "Mitra UMKM Kampus"}
                      </Text>
                      <Text style={styles.createdDate}>
                        Diajukan: {formatDate(item.created_at)}
                      </Text>
                    </View>
                  </View>

                  {/* Status Indicator Pill */}
                  {isAccepted ? (
                    <View style={styles.statusPillAccepted}>
                      <View style={styles.statusDotGreen} />
                      <Text style={styles.statusTextAccepted}>
                        Escrow Aktif
                      </Text>
                    </View>
                  ) : isPending ? (
                    <View style={styles.statusPillPending}>
                      <View style={styles.statusDotAmber} />
                      <Text style={styles.statusTextPending}>
                        Menunggu Review
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.statusPillRejected}>
                      <Text style={styles.statusTextRejected}>Ditolak</Text>
                    </View>
                  )}
                </View>

                {/* Project Title */}
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.project_judul || "Pengembangan Solusi UMKM"}
                </Text>

                {/* Financial & Time Specs Grid */}
                <View style={styles.specsRow}>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Tawaran Anda</Text>
                    <Text style={styles.specBudgetValue}>
                      {formatCurrency(item.harga_tawar)}
                    </Text>
                  </View>

                  <View style={styles.specDivider} />

                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>Waktu Kerja</Text>
                    <View style={styles.specTimeWrap}>
                      <Clock size={12} color={COLORS.textMuted} />
                      <Text style={styles.specTimeValue}>
                        {item.estimasi_hari || 5} Hari
                      </Text>
                    </View>
                  </View>

                  <View style={styles.specDivider} />

                  <View style={styles.specItemRight}>
                    <Text style={styles.specLabel}>Jaminan Keamanan</Text>
                    <View style={styles.escrowSafeWrap}>
                      <ShieldCheck size={12} color={COLORS.success} />
                      <Text style={styles.escrowSafeText}>100% Escrow</Text>
                    </View>
                  </View>
                </View>

                {/* Milestone Bar (Shown on Active Project) */}
                {isAccepted && (
                  <View style={styles.milestoneProgressSection}>
                    <View style={styles.milestoneLabelRow}>
                      <Text style={styles.milestoneStageText}>
                        Tahap 2: Pengerjaan & Pengujian
                      </Text>
                      <Text style={styles.milestonePercentText}>65%</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[styles.progressBarFill, { width: "65%" }]}
                      />
                    </View>
                  </View>
                )}

                {/* Card Action Footer */}
                <View style={styles.cardFooter}>
                  <Text style={styles.actionHintText}>
                    {isAccepted
                      ? "Ketuk untuk unggah hasil atau kirim pesan"
                      : "Ketuk untuk melihat detail proposal"}
                  </Text>
                  <View style={styles.viewDetailBtn}>
                    <Text style={styles.viewDetailBtnText}>Buka</Text>
                    <ChevronRight size={13} color={COLORS.brandIndigo} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }

          // UMKM Project Card
          return (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() =>
                navigation.navigate("ProjectDetail", {
                  id: item.id,
                  projectId: item.id,
                })
              }
              style={styles.workspaceCard}
            >
              <View style={styles.cardTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientName}>Proyek Usaha Anda</Text>
                  <Text style={styles.createdDate}>
                    Dibuat: {formatDate(item.created_at)}
                  </Text>
                </View>
                <View style={styles.statusPillAccepted}>
                  <Text style={styles.statusTextAccepted}>
                    {item.status || "OPEN"}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.judul}
              </Text>

              <View style={styles.specsRow}>
                <View style={styles.specItem}>
                  <Text style={styles.specLabel}>Pagu Anggaran</Text>
                  <Text style={styles.specBudgetValue}>
                    {formatCurrency(item.budget_max)}
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <ProjectStatusBar currentStatus={item.status} />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },

  // 1. Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 54 : 44,
    paddingBottom: 12,
    backgroundColor: COLORS.bgSurface,
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // 2. Segmented Tabs (Clean Single-Line Style)
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  segmentedTabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  segmentedTabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textMuted,
    textAlign: "center",
  },
  segmentedTabTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  tabCountPill: {
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 999,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabCountPillActive: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  tabCountText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  tabCountTextActive: {
    color: COLORS.brandIndigo,
  },
  activeUnderlineBar: {
    position: "absolute",
    bottom: -1,
    left: 6,
    right: 6,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.brandIndigo,
  },

  // 3. Feed List
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // Modern Workspace Card
  workspaceCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  workspaceCardActiveGlow: {
    borderColor: "rgba(79, 70, 229, 0.3)",
    backgroundColor: "#FAFAFF",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  clientGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  clientIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  clientIconBoxActive: {
    backgroundColor: COLORS.successBg,
  },
  clientName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  createdDate: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 1,
  },

  // Status Pills
  statusPillAccepted: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
  },
  statusDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusTextAccepted: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.success,
    fontWeight: "700",
  },
  statusPillPending: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.warningBorder,
  },
  statusDotAmber: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.warning,
  },
  statusTextPending: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.warning,
    fontWeight: "700",
  },
  statusPillRejected: {
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
  },
  statusTextRejected: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.danger,
    fontWeight: "700",
  },

  // Project Title
  cardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 21,
    marginBottom: 12,
  },

  // Specs Row
  specsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  specItem: {
    flex: 1,
  },
  specItemRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  specDivider: {
    width: 1,
    height: 22,
    backgroundColor: COLORS.borderDark,
    marginHorizontal: 8,
  },
  specLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 9,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  specBudgetValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandIndigo,
  },
  specTimeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  specTimeValue: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  escrowSafeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  escrowSafeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.success,
  },

  // Milestone Bar
  milestoneProgressSection: {
    marginBottom: 12,
    paddingTop: 4,
  },
  milestoneLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  milestoneStageText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "600",
  },
  milestonePercentText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.canvasSoft,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: COLORS.brandIndigo,
  },

  // Card Footer
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  actionHintText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 10,
    color: COLORS.textMuted,
    flex: 1,
    marginRight: 8,
  },
  viewDetailBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewDetailBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },

  // Empty State
  emptyBox: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginTop: 20,
  },
  emptyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textDark,
    marginTop: 12,
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
  exploreCtaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 18,
  },
  exploreCtaBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
