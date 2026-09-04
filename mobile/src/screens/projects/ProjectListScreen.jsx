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
import { ProjectCard } from "../../components/features/ProjectCard";
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterModal } from "../../components/features/FilterModal";
import { NotificationModal } from "../../components/features/NotificationModal";
import { CATEGORIES } from "../../constants/categories";
import { Button } from "../../components/ui/Button";
import { projectApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import {
  Plus,
  Compass,
  Bell,
  RotateCcw,
  X,
  SlidersHorizontal,
} from "lucide-react-native";

export function ProjectListScreen({ navigation, route }) {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("MATCH"); // 'MATCH' | 'RECENT' | 'NEW'
  const [categoryFilter, setCategoryFilter] = useState(
    route?.params?.category || "ALL"
  );

  // Modals
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState("ALL");

  const { getUnreadCount } = useNotificationStore();
  const unreadNotifications = getUnreadCount(user?.role);

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  useEffect(() => {
    if (route?.params?.category) {
      setCategoryFilter(route.params.category);
    }
  }, [route?.params?.category]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      if (isMahasiswa) {
        const res = await projectApi.browse({
          search: searchQuery.trim() || undefined,
        });
        const items = Array.isArray(res.data)
          ? res.data
          : res.data?.items || [];
        setProjects(items);
      } else {
        const res = await projectApi.getMyProjects();
        setProjects(Array.isArray(res.data) ? res.data : []);
      }
    } catch (e) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [searchQuery, user?.role]);

  const segmentedTabs = [
    { id: "MATCH", label: "Best Match" },
    { id: "RECENT", label: "Recent" },
    { id: "NEW", label: "New Gigs" },
  ];

  const activeFilterCount =
    (selectedStatus !== "ALL" ? 1 : 0) +
    (selectedBudgetRange !== "ALL" ? 1 : 0) +
    (categoryFilter !== "ALL" ? 1 : 0);

  const resetFilters = () => {
    setSelectedStatus("ALL");
    setSelectedBudgetRange("ALL");
    setCategoryFilter("ALL");
  };

  const filteredProjects = projects
    .filter((p) => {
      // Category Filter
      const matchesCategory =
        categoryFilter === "ALL" || p.kategori === categoryFilter;

      // Search Query
      const matchesSearch =
        !searchQuery.trim() ||
        p.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.deskripsi_raw?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kategori?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.umkm_nama?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status Filter
      const matchesStatus =
        selectedStatus === "ALL" ||
        p.status === selectedStatus ||
        (selectedStatus === "OPEN" && p.status === "BIDDING") ||
        (selectedStatus === "DONE" && p.status === "COMPLETED");

      // Budget Range Filter
      let matchesBudget = true;
      const budget = p.budget_max || 0;
      if (selectedBudgetRange === "UNDER_300K") {
        matchesBudget = budget < 300000;
      } else if (selectedBudgetRange === "300K_1M") {
        matchesBudget = budget >= 300000 && budget <= 1000000;
      } else if (selectedBudgetRange === "ABOVE_1M") {
        matchesBudget = budget > 1000000;
      }

      return matchesCategory && matchesSearch && matchesStatus && matchesBudget;
    })
    .sort((a, b) => {
      if (activeTab === "NEW") {
        return (b.budget_max || 0) - (a.budget_max || 0);
      }
      if (activeTab === "RECENT") {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      return 0;
    });

  const getCategoryLabel = (catId) => {
    const found = CATEGORIES.find((c) => c.id === catId);
    return found ? found.label : catId;
  };

  return (
    <View style={styles.container}>
      {/* 1. Header (Matching Mockup Screen 3 "Discover Jobs") */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>
            {isMahasiswa ? "Discover Jobs" : "Manage Projects"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isMahasiswa ? "Find verified micro-gigs & submit pitches" : "Track listings & recruit student talent"}
          </Text>
        </View>

        <View style={styles.headerRightGroup}>
          {!isMahasiswa ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("PostProject")}
              style={styles.postProjectBtn}
              activeOpacity={0.85}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.postProjectBtnText}>Post Job</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => setIsNotificationOpen(true)}
              activeOpacity={0.8}
            >
              <Bell size={20} color={COLORS.textDark} />
              {unreadNotifications > 0 && <View style={styles.bellRedDot} />}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. Search Bar with Filter Tuning Button */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
          placeholder="Search projects or skills..."
          showFilterBtn={true}
          onFilterPress={() => setIsFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      </View>

      {/* 3. Underline Segmented Navigation Tabs */}
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
              <Text
                style={[
                  styles.segmentedTabText,
                  isActive && styles.segmentedTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeUnderlineBar} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 4. Active Filter Tag Bar (Shown ONLY when a filter is active) */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFilterBar}>
          <Text style={styles.activeFilterLabel}>Filter Aktif:</Text>
          {categoryFilter !== "ALL" && (
            <View style={styles.activeFilterPill}>
              <Text style={styles.activeFilterPillText}>
                {getCategoryLabel(categoryFilter)}
              </Text>
              <TouchableOpacity
                onPress={() => setCategoryFilter("ALL")}
                activeOpacity={0.7}
              >
                <X size={12} color={COLORS.brandIndigo} />
              </TouchableOpacity>
            </View>
          )}
          {selectedBudgetRange !== "ALL" && (
            <View style={styles.activeFilterPill}>
              <Text style={styles.activeFilterPillText}>
                {selectedBudgetRange === "UNDER_300K"
                  ? "< Rp 300rb"
                  : selectedBudgetRange === "300K_1M"
                    ? "Rp 300rb - 1jt"
                    : "> Rp 1jt"}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedBudgetRange("ALL")}
                activeOpacity={0.7}
              >
                <X size={12} color={COLORS.brandIndigo} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={resetFilters}
            style={styles.resetFilterTextBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.resetFilterText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 5. Projects Feed List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadProjects}
            tintColor={COLORS.brandIndigo}
            colors={[COLORS.brandIndigo]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Compass size={40} color={COLORS.brandIndigo} />
              <Text style={styles.emptyTitle}>
                {searchQuery || activeFilterCount > 0
                  ? "No Projects Found"
                  : "No Projects Available"}
              </Text>
              <Text style={styles.emptyDesc}>
                {searchQuery || activeFilterCount > 0
                  ? "Coba ubah kata kunci atau atur ulang filter pencarian Anda."
                  : isMahasiswa
                    ? "Proyek UMKM baru akan segera muncul di sini."
                    : "Mulai pasang proyek pertama Anda untuk mendapatkan proposal talenta."}
              </Text>
              {activeFilterCount > 0 && (
                <Button
                  title="Reset Filters"
                  variant="secondary"
                  size="sm"
                  icon={<RotateCcw size={14} color={COLORS.textDark} />}
                  onPress={resetFilters}
                  style={styles.emptyBtn}
                />
              )}
            </View>
          )
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

  // 1. Header (Mockup Screen 3 Style)
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
  headerRightGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellRedDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  postProjectBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.brandIndigo,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  postProjectBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // 2. Search Section
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: COLORS.bgSurface,
  },

  // 3. Segmented Navigation Tabs (Underline Style)
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  segmentedTabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  segmentedTabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textMuted,
  },
  segmentedTabTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "700",
  },
  activeUnderlineBar: {
    position: "absolute",
    bottom: -1,
    left: 12,
    right: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.brandIndigo,
  },

  // 4. Active Filter Tag Bar
  activeFilterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: COLORS.canvasSoft,
    gap: 8,
    flexWrap: "wrap",
  },
  activeFilterLabel: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  activeFilterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  activeFilterPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    fontWeight: "600",
  },
  resetFilterTextBtn: {
    marginLeft: "auto",
  },
  resetFilterText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.danger,
    fontWeight: "700",
  },

  // 5. Feed List
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  projectCardWrapper: {
    marginBottom: 14,
  },

  // Empty State
  emptyState: {
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
  emptyBtn: {
    marginTop: 16,
  },
});
