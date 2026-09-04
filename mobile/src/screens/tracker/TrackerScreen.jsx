import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { projectApi, proposalApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { renderProjectCategoryVectorIcon } from "../../components/icons/CategoryIcons";
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

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [isMahasiswa]),
  );

  const activeJobsCount = isMahasiswa
    ? items.filter((i) => i.status === "ACCEPTED").length
    : items.filter((i) => i.status === "IN_PROGRESS").length;

  const pendingJobsCount = isMahasiswa
    ? items.filter((i) => i.status === "PENDING").length
    : items.filter((i) => ["OPEN", "BIDDING", "REVIEW"].includes(i.status))
        .length;

  const doneJobsCount = isMahasiswa
    ? items.filter((i) =>
        ["REJECTED", "WITHDRAWN", "COMPLETED", "DONE"].includes(i.status),
      ).length
    : items.filter((i) => ["DONE", "CANCELLED", "COMPLETED"].includes(i.status))
        .length;

  const segmentedTabs = [
    { id: "ALL", label: "All", count: items.length },
    { id: "ACTIVE", label: "Active", count: activeJobsCount },
    {
      id: "PENDING",
      label: isMahasiswa ? "In Review" : "Proposals",
      count: pendingJobsCount,
    },
    { id: "DONE", label: "Completed", count: doneJobsCount },
  ];

  const filteredItems = items.filter((item) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "ACTIVE") {
      return isMahasiswa
        ? item.status === "ACCEPTED"
        : item.status === "IN_PROGRESS";
    }
    if (activeTab === "PENDING") {
      return isMahasiswa
        ? item.status === "PENDING"
        : ["OPEN", "BIDDING", "REVIEW"].includes(item.status);
    }
    if (activeTab === "DONE") {
      return isMahasiswa
        ? ["REJECTED", "WITHDRAWN", "COMPLETED", "DONE"].includes(item.status)
        : ["DONE", "CANCELLED", "COMPLETED"].includes(item.status);
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* 1. Sleek, Uncluttered Header */}
      <View style={styles.header}>
        <View style={styles.headerMainRow}>
          <View>
            <Text style={styles.headerTitle}>Workspace</Text>
            <Text style={styles.headerSubtitle}>
              {activeJobsCount} in progress • {items.length} total
            </Text>
          </View>

          {!isMahasiswa && (
            <TouchableOpacity
              style={styles.newProjectBtn}
              onPress={() => navigation.navigate("PostProject")}
              activeOpacity={0.85}
            >
              <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.newProjectBtnText}>New Project</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 2. Clean Segmented Pill Tabs */}
        <View style={styles.tabBar}>
          {segmentedTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
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
        </View>
      </View>

      {/* 3. Breathable Project Feed */}
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
              <Text style={styles.emptyTitle}>No projects in this tab</Text>
              <Text style={styles.emptyDesc}>
                {isMahasiswa
                  ? "Explore verified micro-gigs and submit your offer to get started."
                  : "Post your first project listing to connect with top campus talents."}
              </Text>
              {isMahasiswa ? (
                <TouchableOpacity
                  style={styles.emptyCtaBtn}
                  onPress={() => navigation.navigate("ProjectsTab")}
                  activeOpacity={0.85}
                >
                  <Text style={styles.emptyCtaBtnText}>Explore Projects</Text>
                  <ArrowRight size={14} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.emptyCtaBtn}
                  onPress={() => navigation.navigate("PostProject")}
                  activeOpacity={0.85}
                >
                  <Text style={styles.emptyCtaBtnText}>+ Post New Project</Text>
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
            ? item.project_umkm_nama || "Campus UMKM Client"
            : "Your Business Listing";
          const category = item.kategori;
          const createdAt = item.created_at;

          // Status & Chat Logic
          const isAccepted = isMahasiswa
            ? item.status === "ACCEPTED"
            : item.status === "IN_PROGRESS";
          const isPending = isMahasiswa
            ? item.status === "PENDING"
            : item.status === "OPEN" || item.status === "BIDDING";
          const isReview = !isMahasiswa && item.status === "REVIEW";
          const isDone =
            item.status === "DONE" ||
            item.status === "COMPLETED" ||
            item.status === "SELESAI";
          const isDeclined =
            item.status === "REJECTED" || item.status === "CANCELLED";

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
                  <View style={{ flex: 1 }}>
                    <Text style={styles.partnerName} numberOfLines={1}>
                      {partnerName}
                    </Text>
                    <Text style={styles.postDate}>
                      {isMahasiswa ? "Applied " : "Posted "}
                      {formatDate(createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Clean Status Pill */}
                {isAccepted ? (
                  <View style={styles.statusPillActive}>
                    <View style={styles.pulseDotGreen} />
                    <Text style={styles.statusTextActive}>In Progress</Text>
                  </View>
                ) : isReview ? (
                  <View style={styles.statusPillReview}>
                    <View style={styles.pulseDotPurple} />
                    <Text style={styles.statusTextReview}>Delivered</Text>
                  </View>
                ) : isPending ? (
                  <View style={styles.statusPillPending}>
                    <Text style={styles.statusTextPending}>
                      {isMahasiswa
                        ? "Under Review"
                        : `${item.total_pelamar || 0} Proposals`}
                    </Text>
                  </View>
                ) : isDone ? (
                  <View style={styles.statusPillDone}>
                    <Text style={styles.statusTextDone}>Completed</Text>
                  </View>
                ) : (
                  <View style={styles.statusPillDeclined}>
                    <Text style={styles.statusTextDeclined}>
                      {isDeclined ? "Declined" : item.status}
                    </Text>
                  </View>
                )}
              </View>

              {/* Project Title */}
              <Text style={styles.cardTitle} numberOfLines={2}>
                {projectTitle || "Project Assignment"}
              </Text>

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
                        ? `${item.estimasi_hari || 5}d`
                        : `${item.total_pelamar || 0} bids`}
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
                          partnerName: isMahasiswa
                            ? item.project_umkm_nama || "Client"
                            : "Talent",
                          partnerRole: isMahasiswa ? "UMKM" : "MHS",
                        });
                      }}
                      activeOpacity={0.8}
                    >
                      <MessageSquare size={12} color={COLORS.brandIndigo} />
                      <Text style={styles.quickChatBtnText}>Chat</Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.chevronBox}>
                    <ChevronRight size={14} color={COLORS.textMuted} />
                  </View>
                </View>
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
    backgroundColor: "#F8FAFC", // Clean, bright backdrop
  },

  // 1. Header
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "ios" ? 54 : 44,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    ...SHADOWS.sm,
  },
  headerMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
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

  // 2. Segmented Pill Tabs
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    padding: 3,
    borderRadius: 12,
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    borderRadius: 9,
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: "#FFFFFF",
    ...SHADOWS.sm,
  },
  tabLabel: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  tabBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.08)",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 999,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBadgeActive: {
    backgroundColor: COLORS.brandIndigoLight,
  },
  tabBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  tabBadgeTextActive: {
    color: COLORS.brandIndigo,
  },

  // 3. Feed List
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  // 4. Streamlined Card
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
  categoryBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBoxActive: {
    backgroundColor: COLORS.successBg,
  },
  partnerName: {
    fontFamily: FONTS.bodyBold,
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

  // Status Badges
  statusPillActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pulseDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  statusTextActive: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.success,
  },
  statusPillReview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  pulseDotPurple: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9333EA",
  },
  statusTextReview: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
    color: "#9333EA",
  },
  statusPillPending: {
    backgroundColor: COLORS.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusTextPending: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.warning,
  },
  statusPillDone: {
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusTextDone: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  statusPillDeclined: {
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusTextDeclined: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.danger,
  },

  // Title
  cardTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 20,
    marginBottom: 10,
  },

  // Bottom Row
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
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
