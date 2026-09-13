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
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { TrackerCardSkeleton } from "../../components/ui/Skeleton";
import { PebbleButton } from "../../components/ui/PebbleButton";
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
  User,
  CheckCircle2,
} from "lucide-react-native";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";

export function TrackerScreen({ navigation }) {
  const { user } = useAuthStore();
  const { responsiveContainerStyle, contentMaxWidth } = useResponsiveLayout();
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

  // Single-row 4-column Segmented Control (Non-sliding, non-stacking)
  const segmentedTabs = isMahasiswa
    ? [
        { id: "ALL", label: "Semua", count: items.length },
        { id: "ACTIVE", label: "Aktif", count: activeJobsCount },
        { id: "PENDING", label: "Seleksi", count: pendingJobsCount },
        { id: "DONE", label: "Selesai", count: doneJobsCount },
      ]
    : [
        { id: "ALL", label: "Semua", count: items.length },
        { id: "ACTIVE", label: "Aktif", count: activeJobsCount },
        { id: "PENDING", label: "Pelamar", count: pendingJobsCount },
        { id: "DONE", label: "Selesai", count: doneJobsCount },
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
      <OrganicRibbonBackground height={340} />
      {/* 1. Header */}
      <Header
        category="WORKSPACE"
        title="Ruang Kerja & Proyek"
        subtitle={`${activeJobsCount} sedang berjalan • ${items.length} total proyek`}
        rightAction={
          !isMahasiswa ? (
            <PebbleButton
              variant="sapphire"
              size="xs"
              label="Proyek Baru"
              icon={Plus}
              onPress={() => navigation.navigate("PostProject")}
            />
          ) : null
        }
      />

      {/* 2. Unified 4-Column Segmented Tab (Fits 100% Screen Width without Sliding/Stacking) */}
      <View style={styles.segmentedWrapper}>
      <View style={[styles.segmentedWrapper, responsiveContainerStyle]}>
        <View style={styles.segmentedContainer}>
          {segmentedTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.segmentedItem,
                  isActive && styles.segmentedItemActive,
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.segmentedLabel,
                    isActive && styles.segmentedLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                  {tab.count > 0 ? ` (${tab.count})` : ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 3. Feed List */}
      {loading && items.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.listContent}
          contentContainerStyle={[
            styles.listContent,
            { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" },
          ]}
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
          contentContainerStyle={[
            styles.listContent,
            { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyBox}>
                <View style={styles.emptyIconCircle}>
                  <Briefcase size={28} color={COLORS.brandIndigo} />
                </View>
                <Text style={styles.emptyTitle}>
                  Tidak ada proyek di tab ini
                </Text>
                <Text style={styles.emptyDesc}>
                  {isMahasiswa
                    ? "Jelajahi tawaran proyek UMKM terverifikasi dan ajukan proposal terbaik Anda."
                    : "Pasang proyek pertama Anda untuk terhubung dengan mahasiswa bertalenta kampus."}
                </Text>
                {isMahasiswa ? (
                  <PebbleButton
                    variant="pearl"
                    size="sm"
                    label="Jelajahi Proyek"
                    icon={ArrowRight}
                    onPress={() => navigation.navigate("ProjectsTab")}
                    style={{ marginTop: 16 }}
                  />
                ) : (
                  <PebbleButton
                    variant="sapphire"
                    size="sm"
                    label="Pasang Proyek Baru"
                    icon={Plus}
                    onPress={() => navigation.navigate("PostProject")}
                    style={{ marginTop: 16 }}
                  />
                )}
              </View>
            )
          }
          renderItem={({ item }) => {
            const projectId = isMahasiswa ? item.project_id : item.id;
            const projectTitle = isMahasiswa ? item.project_judul : item.judul;
            const category = isMahasiswa
              ? item.project_kategori || item.kategori || "UMKM"
              : item.kategori || "UMKM";
            const createdAt = item.created_at;

            // Status Logic
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

            const canChat = isAccepted || isReview;

            // Team or Individual Avatars
            const isTeamProject = item.tipe_kolaborasi === "TIM";
            const slots = Array.isArray(item.slots) ? item.slots : [];
            const filledSlots = slots.filter(
              (s) => s.status === "TAKEN" || s.accepted_mhs_id,
            );

            // Partner details for Mahasiswa (Client UMKM)
            const clientName = isMahasiswa
              ? item.project_umkm_nama || item.umkm_nama || "Klien UMKM"
              ? item.project_umkm_nama || item.umkm_nama || item.umkm_profile?.nama_usaha || "Klien Mitra UMKM"
              : null;
            const clientPhoto = isMahasiswa
              ? item.project_umkm_foto || item.umkm_foto
              ? item.project_umkm_foto || item.umkm_foto || item.umkm_profile?.url_foto_usaha
              : null;

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
                {/* 1. Card Top: Category Icon + Category Label + Status Pill */}
                <View style={styles.cardHeader}>
                  <View style={styles.categoryBadgeRow}>
                    <View
                      style={[
                        styles.categoryIconBox,
                        isAccepted && styles.categoryIconBoxActive,
                      ]}
                    >
                      {renderProjectCategoryVectorIcon(
                        category,
                        projectTitle,
                        16,
                        isAccepted ? COLORS.success : COLORS.brandIndigo,
                      )}
                    </View>
                    <View>
                      <Text style={styles.categoryLabelText}>{category}</Text>
                      <Text style={styles.cardDateText}>
                        {isMahasiswa ? "Dilamar " : "Dibuat "}
                        {formatDate(createdAt)}
                      </Text>
                    </View>
                  </View>

                  {/* Clean Accurate Status Pill */}
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

                {/* 2. Main Title: Project Assignment */}
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {projectTitle || "Penugasan Proyek"}
                </Text>

                {/* 3. Reason Banner if Cancelled or Withdrawn */}
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
                      "
                      {item.cancel_reason ||
                        "Tenggat waktu pengerjaan telah berakhir."}
                      "
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
                    <Text
                      style={styles.reasonCardTextWithdrawn}
                      numberOfLines={2}
                    >
                      "
                      {item.withdraw_reason ||
                        "Mahasiswa menarik kembali proposal lamaran ini."}
                      "
                    </Text>
                  </View>
                )}

                {/* 4. Student or Team Avatar Section */}
                {!isMahasiswa ? (
                  // UMKM View: Show assigned student avatar(s) or team avatar cluster
                  <View style={styles.talentAvatarRow}>
                    {isTeamProject ? (
                      // Team Collaboration Avatar Stack
                      <View style={styles.teamCluster}>
                        <View style={styles.avatarStack}>
                          {filledSlots.length > 0 ? (
                            filledSlots.slice(0, 3).map((slot, sIdx) => (
                              <View
                                key={slot.id || sIdx}
                                style={[
                                  styles.stackedAvatar,
                                  {
                                    zIndex: 10 - sIdx,
                                    marginLeft: sIdx > 0 ? -8 : 0,
                                  },
                                ]}
                              >
                                <Text style={styles.stackedAvatarText}>
                                  {(slot.accepted_mhs_nama || "T")
                                    .charAt(0)
                                    .toUpperCase()}
                                </Text>
                              </View>
                            ))
                          ) : (
                            <View style={styles.emptySlotPlaceholder}>
                              <Users size={12} color={COLORS.brandIndigo} />
                            </View>
                          )}
                        </View>
                        <Text style={styles.talentSubText}>
                          {filledSlots.length > 0
                            ? `Tim: ${filledSlots.length}/${slots.length || 2} Peran Terisi`
                            : `Proyek Tim (${slots.length || 2} Formasi)`}
                        </Text>
                      </View>
                    ) : // Individual Project Student Avatar
                    item.accepted_mhs_nama ? (
                      <View style={styles.singleTalentRow}>
                        {item.accepted_mhs_foto ? (
                          <Image
                            source={{ uri: item.accepted_mhs_foto }}
                            style={styles.talentAvatarImg}
                            resizeMode="cover"
                          />
                        ) : (
                          <View style={styles.talentAvatarCircle}>
                            <Text style={styles.talentAvatarText}>
                              {item.accepted_mhs_nama.charAt(0).toUpperCase()}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.talentNameText} numberOfLines={1}>
                          {item.accepted_mhs_nama}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.openApplicantStatus}>
                        <Users size={12} color={COLORS.textMuted} />
                        <Text style={styles.talentSubText}>
                          {item.total_pelamar && item.total_pelamar > 0
                            ? `${item.total_pelamar} proposal masuk`
                            : "Belum ada pelamar masuk"}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : (
                  // Mahasiswa View: Show Client UMKM Avatar & Name
                  <View style={styles.talentAvatarRow}>
                    <View style={styles.singleTalentRow}>
                      {clientPhoto ? (
                        <Image
                          source={{ uri: clientPhoto }}
                          style={styles.talentAvatarImg}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.clientAvatarCircle}>
                          <Text style={styles.clientAvatarText}>
                            {(clientName || "K").charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.talentNameText} numberOfLines={1}>
                        {clientName}
                      </Text>
                    </View>
                  </View>
                )}

                {/* 5. Bottom Row: Metadata (Budget, Timeline, Escrow) & Chat Action */}
                <View style={styles.cardBottomRow}>
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
                          : isTeamProject
                            ? `${slots.length} posisi`
                            : `${item.total_pelamar || 0} pelamar`}
                      </Text>
                    </View>
                    <Text style={styles.metaDivider}>•</Text>
                    <View style={styles.metaIconText}>
                      <ShieldCheck size={11} color={COLORS.success} />
                      <Text style={styles.escrowLabel}>Escrow</Text>
                    </View>
                  </View>

                  {/* Quick Action: Direct Chat & Chevron */}
                  <View style={styles.actionGroup}>
                    {canChat && (
                      <TouchableOpacity
                        style={styles.quickChatBtn}
                        onPress={(e) => {
                          e.stopPropagation();
                          navigation.navigate("Chat", {
                            projectId: projectId,
                            projectTitle: projectTitle,
                            partnerPhoto: isMahasiswa
                              ? clientPhoto
                              : item.accepted_mhs_foto,
                            partnerName: isMahasiswa
                              ? clientName
                              : item.accepted_mhs_nama || "Talenta Kampus",
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

  // 4-Column Balanced Segmented Bar
  segmentedWrapper: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor:
      Platform.OS === "android" ? "#F1F5F9" : "rgba(15, 23, 42, 0.05)",
    padding: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(15, 23, 42, 0.06)",
  },
  segmentedItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 11,
  },
  segmentedItemActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: Platform.OS === "android" ? 0 : 2,
  },
  segmentedLabel: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  segmentedLabelActive: {
    color: "#2563EB",
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

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    paddingBottom: 110,
  },

  projectCard: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.92)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    elevation: Platform.OS === "android" ? 0 : 2,
  },
  projectCardActive: {
    borderColor: "rgba(79, 70, 229, 0.35)",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  categoryIconBox: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconBoxActive: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  categoryLabelText: {
    fontFamily: FONTS.displayBold,
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textDark,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  cardDateText: {
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

  // Title
  cardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 20,
    marginBottom: 6,
  },

  // Reason Callouts
  reasonCardBox: {
    backgroundColor: "#FEF2F2",
    padding: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
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

  // Student / Team Avatar Row
  talentAvatarRow: {
    marginVertical: 4,
  },
  singleTalentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  talentAvatarImg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  talentAvatarCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
  },
  talentAvatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  clientAvatarCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  clientAvatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 10,
    color: "#92400E",
    fontWeight: "700",
  },
  talentNameText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  openApplicantStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  talentSubText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  teamCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  stackedAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  stackedAvatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  emptySlotPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.brandIndigo,
  },

  // Bottom Metadata
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    marginTop: 6,
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

  emptyBox: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.90)",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.90)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.95)",
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    marginTop: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    elevation: Platform.OS === "android" ? 0 : 2,
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
