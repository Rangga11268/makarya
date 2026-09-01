import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { ProjectCard } from "../../components/features/ProjectCard";
import { CategoryChip } from "../../components/ui/CategoryChip";
import { CATEGORIES } from "../../constants/categories";
import { Button } from "../../components/ui/Button";
import { projectApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import {
  Plus,
  Search,
  Compass,
  X,
  SlidersHorizontal,
  Bell,
} from "lucide-react-native";

export function ProjectListScreen({ navigation }) {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("MATCH"); // 'MATCH' | 'RECENT' | 'BUDGET'
  const [categoryFilter, setCategoryFilter] = useState("ALL");

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

  const filteredProjects = projects
    .filter((p) => {
      const matchesCategory =
        categoryFilter === "ALL" || p.kategori === categoryFilter;

      const matchesSearch =
        !searchQuery.trim() ||
        p.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.deskripsi_raw?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kategori?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (activeTab === "BUDGET") {
        return (b.budget_max || 0) - (a.budget_max || 0);
      }
      return 0;
    });

  return (
    <View style={styles.container}>
      {/* 1. Header Bar: Discover Jobs + Bell */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.headerTitle}>
            {isMahasiswa ? "Discover Jobs" : "Daftar Proyek"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isMahasiswa
              ? "Temukan ribuan proyek digital UMKM terverifikasi"
              : "Kelola pesanan & seleksi proposal mahasiswa"}
          </Text>
        </View>

        {!isMahasiswa ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("PostProject")}
            style={styles.fabHeader}
            activeOpacity={0.8}
          >
            <Plus size={18} color="#FFFFFF" strokeWidth={3} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.bellBtn}
            activeOpacity={0.75}
          >
            <Bell size={20} color={COLORS.textDark} />
            <View style={styles.unreadDot} />
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Search Bar + Filter Settings Button */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={16} color={COLORS.brandIndigo} />
          <TextInput
            placeholder="Search for jobs, design, web..."
            placeholderTextColor={COLORS.textDim}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.filterSettingsBtn} activeOpacity={0.8}>
          <SlidersHorizontal size={18} color={COLORS.textDark} />
        </TouchableOpacity>
      </View>

      {/* 3. Segmented Navigation Tabs (Matching Reference Underline Tabs) */}
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
                {searchQuery
                  ? "Proyek Tidak Ditemukan"
                  : "Belum Ada Proyek Tersedia"}
              </Text>
              <Text style={styles.emptyDesc}>
                {searchQuery
                  ? "Coba gunakan kata kunci pencarian atau filter kategori yang lain."
                  : isMahasiswa
                    ? "Proyek UMKM baru akan segera muncul di sini."
                    : "Mulai pasang proyek pertama Anda untuk mendapatkan proposal talenta."}
              </Text>
              {!isMahasiswa && (
                <Button
                  title="Pasang Proyek Pertama"
                  variant="brand"
                  size="md"
                  icon={<Plus size={16} color="#FFF" />}
                  onPress={() => navigation.navigate("PostProject")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: COLORS.bgSurface,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  fabHeader: {
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
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: COLORS.bgSurface,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
    paddingVertical: 2,
    fontWeight: "500",
  },
  filterSettingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: COLORS.canvasSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
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
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  segmentedTabTextActive: {
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
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 4,
  },
  categoryChipActive: {
    backgroundColor: COLORS.brandIndigoLight,
    borderColor: "rgba(79, 70, 229, 0.2)",
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.brandIndigo,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
  },
  emptyState: {
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
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginTop: 12,
  },
  emptyDesc: {
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
