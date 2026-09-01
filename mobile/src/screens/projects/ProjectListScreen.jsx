import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Header } from "../../components/ui/Header";
import { ProjectCard } from "../../components/features/ProjectCard";
import { CategoryChip } from "../../components/ui/CategoryChip";
import { SearchBar } from "../../components/ui/SearchBar";
import { FilterModal } from "../../components/features/FilterModal";
import { NotificationModal } from "../../components/features/NotificationModal";
import { CATEGORIES } from "../../constants/categories";
import { Button } from "../../components/ui/Button";
import { projectApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { Plus, Compass, Bell, RotateCcw } from "lucide-react-native";

export function ProjectListScreen({ navigation }) {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("MATCH"); // 'MATCH' | 'RECENT' | 'BUDGET'
  const [categoryFilter, setCategoryFilter] = useState("ALL");

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
    { id: "MATCH", label: "Paling Cocok" },
    { id: "RECENT", label: "Terbaru" },
    { id: "BUDGET", label: "Anggaran Tertinggi" },
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
      if (activeTab === "BUDGET") {
        return (b.budget_max || 0) - (a.budget_max || 0);
      }
      if (activeTab === "RECENT") {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      return 0;
    });

  return (
    <View style={styles.container}>
      {/* 1. Universal Header Bar */}
      <Header
        title={isMahasiswa ? "Eksplor Proyek UMKM" : "Kelola Proyek"}
        subtitle={
          isMahasiswa
            ? "Temukan peluang proyek digital dan kirim proposalmu"
            : "Pantau pesanan proyek & seleksi proposal mahasiswa"
        }
        showBell={isMahasiswa}
        onBellPress={() => setIsNotificationOpen(true)}
        unreadCount={unreadNotifications}
        rightAction={
          !isMahasiswa ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("PostProject")}
              style={styles.fabHeader}
              activeOpacity={0.8}
            >
              <Plus size={18} color="#FFFFFF" strokeWidth={3} />
            </TouchableOpacity>
          ) : null
        }
      />

      {/* 2. Reusable SearchBar Component with Filter Button */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
          placeholder="Cari desain logo, website, video..."
          showFilterBtn={true}
          onFilterPress={() => setIsFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      </View>

      {/* 3. Segmented Navigation Tabs */}
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

      {/* 4. Category Pills Slider */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryChip
              category={item}
              isSelected={categoryFilter === item.id}
              onPress={() => setCategoryFilter(item.id)}
              variant="soft"
            />
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* 5. Projects List */}
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
              <Compass size={44} color={COLORS.brandIndigo} />
              <Text style={styles.emptyTitle}>
                {searchQuery || activeFilterCount > 0
                  ? "Proyek Tidak Ditemukan"
                  : "Belum Ada Proyek Tersedia"}
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
                  title="Atur Ulang Filter"
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
          <ProjectCard
            project={item}
            onPress={() =>
              navigation.navigate("ProjectDetail", {
                id: item.id,
                projectId: item.id,
              })
            }
          />
        )}
      />

      {/* 6. Reusable FilterModal Component */}
      <FilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        selectedBudgetRange={selectedBudgetRange}
        onSelectBudgetRange={setSelectedBudgetRange}
        onReset={resetFilters}
      />

      {/* 7. Working Notification Modal */}
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
  topHeader: {
    fontFamily: FONTS.bodyRegular,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: COLORS.bgSurface,
  },
  headerTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  fabHeader: {
    fontFamily: FONTS.bodyRegular,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.brandGlow,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F43F5E",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  searchContainer: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: COLORS.bgSurface,
  },
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSurface,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  segmentedTabItem: {
    marginRight: 24,
    paddingVertical: 12,
    position: "relative",
  },
  segmentedTabText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  segmentedTabTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.brandIndigo,
    fontWeight: "900",
  },
  activeUnderlineBar: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.brandIndigo,
    borderRadius: 2,
  },
  categoryContainer: {
    backgroundColor: COLORS.bgSurface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  categoryList: {
    paddingHorizontal: 18,
    gap: 6,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
  },
  emptyState: {
    fontFamily: FONTS.bodyRegular,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 36,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    ...SHADOWS.sm,
  },
  emptyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginTop: 12,
  },
  emptyDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 260,
    lineHeight: 18,
  },
  emptyBtn: {
    marginTop: 18,
  },
});
