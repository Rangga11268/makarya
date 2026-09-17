import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { ProjectCard } from "../../components/features/ProjectCard";
import { ProjectCardSkeleton } from "../../components/ui/Skeleton";
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterModal } from "../../components/features/FilterModal";
import { NotificationModal } from "../../components/features/NotificationModal";
import { CATEGORIES } from "../../constants/categories";
import { PebbleButton } from "../../components/ui/PebbleButton";
import { projectApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import {
  Compass,
  RotateCcw,
  X,
  ChevronUp,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react-native";
import { TalentListScreen } from "../talents/TalentListScreen";
import { Header } from "../../components/ui/Header";
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";

export function ProjectListScreen({ navigation, route }) {
  const { user } = useAuthStore();
  const { responsiveContainerStyle, contentMaxWidth } = useResponsiveLayout();
  const flatListRef = useRef(null);

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("MATCH");
  const [categoryFilter, setCategoryFilter] = useState(
    route?.params?.category || "ALL",
  );
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Modals
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("OPEN");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState("ALL");

  // Debounce ref for search
  const searchDebounceRef = useRef(null);

  const { getUnreadCount } = useNotificationStore();
  const unreadNotifications = getUnreadCount(user?.role);

  useEffect(() => {
    if (route?.params?.category) {
      setCategoryFilter(route.params.category);
    }
  }, [route?.params?.category]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isMahasiswa) {
        const params = { keyword: searchQuery.trim() || undefined };
        if (selectedStatus !== "ALL") params.status = selectedStatus;
        const res = await projectApi.browse(params);
        const items = Array.isArray(res.data)
          ? res.data
          : res.data?.items || [];
        setProjects(items);
      } else {
        const res = await projectApi.getMyProjects();
        setProjects(Array.isArray(res.data) ? res.data : []);
      }
    } catch (e) {
      console.error("Gagal memuat proyek:", e);
      setError("Gagal memuat proyek. Periksa koneksi dan coba lagi.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search → API (400ms)
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      loadProjects();
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchQuery, user?.role, selectedStatus]);

  // UMKM redirect — AFTER all hooks
  if (!isMahasiswa) {
    return <TalentListScreen navigation={navigation} route={route} />;
  }

  const segmentedTabs = [
    { id: "MATCH", label: "Terbaik" },
    { id: "RECENT", label: "Terbaru" },
    { id: "NEW", label: "Nilai Tertinggi" },
  ];

  const activeFilterCount =
    (selectedStatus !== "OPEN" ? 1 : 0) +
    (selectedBudgetRange !== "ALL" ? 1 : 0) +
    (categoryFilter !== "ALL" ? 1 : 0);

  const resetFilters = () => {
    setSelectedStatus("OPEN");
    setSelectedBudgetRange("ALL");
    setCategoryFilter("ALL");
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const filteredProjects = projects
    .filter((p) => {
      const matchesCategory =
        categoryFilter === "ALL" || p.kategori === categoryFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        p.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.deskripsi_raw?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kategori?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.umkm_nama?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "ALL" ||
        p.status === selectedStatus ||
        (selectedStatus === "OPEN" && p.status === "BIDDING") ||
        (selectedStatus === "DONE" && p.status === "COMPLETED");
      let matchesBudget = true;
      const budget = p.budget_max || 0;
      if (selectedBudgetRange === "UNDER_300K") matchesBudget = budget < 300000;
      else if (selectedBudgetRange === "300K_1M")
        matchesBudget = budget >= 300000 && budget <= 1000000;
      else if (selectedBudgetRange === "ABOVE_1M")
        matchesBudget = budget > 1000000;
      return matchesCategory && matchesSearch && matchesStatus && matchesBudget;
    })
    .sort((a, b) => {
      if (activeTab === "MATCH")
        return (b.match_score || 0) - (a.match_score || 0);
      if (activeTab === "NEW") return (b.budget_max || 0) - (a.budget_max || 0);
      if (activeTab === "RECENT")
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      return 0;
    });

  const getCategoryLabel = (catId) => {
    const found = CATEGORIES.find((c) => c.id === catId);
    return found ? found.label : catId;
  };

  return (
    <View style={styles.container}>
      <OrganicRibbonBackground height={320} />

      {/* Header (Standar Desain Makarya Mobile) */}
      <Header
        category="KATALOG PROYEK"
        title="Jelajah Proyek"
        subtitle="100% Terverifikasi UMKM"
        showBell={true}
        showChat={true}
        onBellPress={() => setIsNotificationOpen(true)}
        unreadCount={unreadNotifications}
      />

      {/* Search Bar */}
      <View style={[styles.searchSection, responsiveContainerStyle]}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
          placeholder="Cari proyek atau keahlian..."
          showFilterBtn={true}
          onFilterPress={() => setIsFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      </View>

      {/* Controls & Segmented Tabs Row */}
      <View style={[styles.controlsSection, responsiveContainerStyle]}>
        {/* Segmented Tabs */}
        <View style={styles.segmentedContainer}>
          {segmentedTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.segmentedTabItem,
                  isActive && styles.segmentedTabItemActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentedTabText,
                    isActive && styles.segmentedTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Counter Summary */}
        <View style={styles.summaryCountRow}>
          <Text style={styles.summaryCountText}>
            Menampilkan{" "}
            <Text style={styles.summaryCountNumber}>
              {filteredProjects.length}
            </Text>{" "}
            proyek aktif
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity
              onPress={resetFilters}
              style={styles.resetInlineBtn}
              activeOpacity={0.7}
            >
              <RotateCcw size={10} color="#BE123C" />
              <Text style={styles.resetInlineText}>Reset Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error state */}
      {error && !loading && (
        <View style={[styles.errorCard, responsiveContainerStyle]}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={loadProjects}
            style={styles.retryBtn}
            activeOpacity={0.7}
          >
            <RotateCcw size={14} color="#FFFFFF" />
            <Text style={styles.retryBtnText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Projects Feed */}
      {loading && projects.length === 0 ? (
        <ScrollView
          contentContainerStyle={[
            styles.listContent,
            { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </ScrollView>
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredProjects}
          keyExtractor={(item) => item.id}
          onScroll={(e) => {
            const offsetY = e.nativeEvent.contentOffset.y;
            setShowScrollTop(offsetY > 360);
          }}
          scrollEventThrottle={16}
          initialNumToRender={5}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews={Platform.OS === "android"}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadProjects}
              tintColor={COLORS.brandIndigo}
              colors={[COLORS.brandIndigo]}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            { maxWidth: contentMaxWidth, width: "100%", alignSelf: "center" },
          ]}
          ListEmptyComponent={
            !loading &&
            !error && (
              <View style={styles.emptyState}>
                <Compass size={40} color={COLORS.brandIndigo} />
                <Text style={styles.emptyTitle}>
                  {searchQuery || activeFilterCount > 0
                    ? "Tidak Ada Proyek Ditemukan"
                    : "Belum Ada Proyek"}
                </Text>
                <Text style={styles.emptyDesc}>
                  {searchQuery || activeFilterCount > 0
                    ? "Coba ubah kata kunci atau atur ulang filter pencarian Anda."
                    : "Proyek UMKM baru akan segera muncul di sini."}
                </Text>
                {activeFilterCount > 0 && (
                  <PebbleButton
                    variant="ice"
                    size="sm"
                    label="Reset Filter"
                    icon={RotateCcw}
                    onPress={resetFilters}
                    style={styles.emptyBtn}
                  />
                )}
              </View>
            )
          }
          ListFooterComponent={
            filteredProjects.length > 0 ? (
              <View style={styles.feedFooter}>
                <View style={styles.feedFooterDivider} />
                <View style={styles.feedFooterContent}>
                  <CheckCircle2 size={15} color="#059669" />
                  <Text style={styles.feedFooterText}>
                    Semua {filteredProjects.length} proyek telah ditampilkan
                  </Text>
                  <TouchableOpacity
                    onPress={scrollToTop}
                    style={styles.feedFooterTopBtn}
                    activeOpacity={0.7}
                  >
                    <ChevronUp size={13} color="#2563EB" />
                    <Text style={styles.feedFooterTopBtnText}>
                      Kembali ke Atas
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.projectCardWrapper}>
              <ProjectCard
                project={item}
                onPress={() =>
                  navigation.navigate("ProjectDetail", {
                    id: item.id,
                    projectId: item.id,
                  })
                }
              />
            </View>
          )}
        />
      )}

      {/* Floating Scroll to Top FAB */}
      {showScrollTop && (
        <TouchableOpacity
          style={styles.floatingTopFab}
          onPress={scrollToTop}
          activeOpacity={0.88}
        >
          <ChevronUp size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.floatingTopFabText}>Atas</Text>
        </TouchableOpacity>
      )}

      {/* Filter Bottom Sheet Modal */}
      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategory={categoryFilter}
        onSelectCategory={setCategoryFilter}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        selectedBudgetRange={selectedBudgetRange}
        onSelectBudgetRange={setSelectedBudgetRange}
        onReset={resetFilters}
        categories={CATEGORIES}
      />

      {/* Notification Center Modal */}
      <NotificationModal
        visible={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "transparent",
  },

  // Controls & Segmented Tabs
  controlsSection: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 6,
  },
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor:
      Platform.OS === "android" ? "#F1F5F9" : "rgba(15, 23, 42, 0.05)",
    borderRadius: 14,
    padding: 3.5,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(15, 23, 42, 0.06)",
  },
  segmentedTabItem: {
    flex: 1,
    paddingVertical: 7.5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  segmentedTabItemActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: Platform.OS === "android" ? 1 : 2,
  },
  segmentedTabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  segmentedTabTextActive: {
    fontFamily: FONTS.displaySemiBold,
    color: "#2563EB",
    fontWeight: "700",
  },

  // Summary Row
  summaryCountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 2,
  },
  summaryCountText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#64748B",
  },
  summaryCountNumber: {
    fontFamily: FONTS.bodyBold,
    color: "#0F172A",
    fontWeight: "800",
  },
  resetInlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF1F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  resetInlineText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10.5,
    color: "#BE123C",
    fontWeight: "700",
  },

  // Error Card
  errorCard: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 16,
    backgroundColor:
      Platform.OS === "android" ? "#FFF1F2" : "rgba(255, 241, 242, 0.95)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(254, 202, 202, 0.8)",
    alignItems: "center",
    gap: 10,
  },
  errorText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    color: "#BE123C",
    textAlign: "center",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  retryBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // Feed List
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 110,
  },
  projectCardWrapper: {
    marginBottom: 10,
  },

  // Feed Footer
  feedFooter: {
    paddingVertical: 24,
    alignItems: "center",
  },
  feedFooterDivider: {
    height: 1,
    width: "60%",
    backgroundColor: "rgba(226, 232, 240, 0.8)",
    marginBottom: 14,
  },
  feedFooterContent: {
    alignItems: "center",
    gap: 8,
  },
  feedFooterText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#94A3B8",
    textAlign: "center",
  },
  feedFooterTopBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  feedFooterTopBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "700",
  },

  // Floating FAB
  floatingTopFab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#0F172A",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  floatingTopFabText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // Empty State
  emptyState: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      Platform.OS === "android" ? "#FFFFFF" : "rgba(255, 255, 255, 0.90)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor:
      Platform.OS === "android"
        ? "rgba(226, 232, 240, 0.9)"
        : "rgba(255, 255, 255, 0.95)",
    marginTop: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: Platform.OS === "android" ? 0 : 2,
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
  emptyBtn: {
    marginTop: 16,
  },
});
