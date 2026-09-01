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
import { Header } from "../../components/ui/Header";
import { ProjectCard } from "../../components/features/ProjectCard";
import { Button } from "../../components/ui/Button";
import { projectApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import {
  Plus,
  Search,
  Compass,
  X,
  SlidersHorizontal,
  Sparkles,
  Palette,
  Smartphone,
  Code2,
  Video,
  PenTool,
  FileSpreadsheet,
} from "lucide-react-native";

export function ProjectListScreen({ navigation }) {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
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

  const categories = [
    { id: "ALL", label: "Semua", Icon: Sparkles },
    { id: "DESIGN", label: "Desain & Logo", Icon: Palette },
    { id: "UIUX", label: "UI/UX App", Icon: Smartphone },
    { id: "PEMROGRAMAN", label: "Web & Coding", Icon: Code2 },
    { id: "VIDEO", label: "Video Reels", Icon: Video },
    { id: "COPYWRITING", label: "Copywriting", Icon: PenTool },
    { id: "ADMIN_DATA", label: "Admin Data", Icon: FileSpreadsheet },
  ];

  const filterTabs = [
    { id: "ALL", label: "Semua Status" },
    { id: "OPEN", label: "Bidding Terbuka" },
    { id: "IN_PROGRESS", label: "Dikerjakan" },
    { id: "REVIEW", label: "Review" },
    { id: "COMPLETED", label: "Selesai" },
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      p.status === statusFilter ||
      (statusFilter === "COMPLETED" && p.status === "DONE");

    const matchesCategory =
      categoryFilter === "ALL" || p.kategori === categoryFilter;

    const matchesSearch =
      !searchQuery.trim() ||
      p.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.deskripsi_raw?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategori?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Header
        title={isMahasiswa ? "Eksplor Proyek UMKM" : "Daftar Proyek Saya"}
        subtitle={
          isMahasiswa
            ? "Temukan proyek digital & ajukan proposal terbaikmu"
            : "Kelola pesanan dan seleksi proposal mahasiswa"
        }
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

      {/* Search Input Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={16} color={COLORS.brandIndigo} />
          <TextInput
            placeholder="Cari desain logo, website, video..."
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
      </View>

      {/* Category Pills Slider */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const selected = categoryFilter === item.id;
            const IconComp = item.Icon;
            return (
              <TouchableOpacity
                onPress={() => setCategoryFilter(item.id)}
                style={[
                  styles.categoryChip,
                  selected && styles.categoryChipActive,
                ]}
                activeOpacity={0.75}
              >
                <IconComp
                  size={13}
                  color={selected ? COLORS.brandIndigo : COLORS.textMuted}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categoryTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Status Filter Tabs */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterTabs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const selected = statusFilter === item.id;
            return (
              <TouchableOpacity
                onPress={() => setStatusFilter(item.id)}
                style={[
                  styles.filterChip,
                  selected && styles.filterChipActive,
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterText,
                    selected && styles.filterTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Results Header Count */}
      <View style={styles.resultsInfoRow}>
        <Text style={styles.resultsCountText}>
          Menampilkan {filteredProjects.length} proyek ditemukan
        </Text>
      </View>

      {/* Projects List */}
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
  fabHeader: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandIndigo,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.brandGlow,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: COLORS.bgSurface,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
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
  categoryContainer: {
    backgroundColor: COLORS.bgSurface,
    paddingVertical: 8,
  },
  categoryList: {
    paddingHorizontal: 16,
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
  filterContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    backgroundColor: COLORS.bgSurface,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 4,
  },
  filterChipActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  filterText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  filterTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  resultsInfoRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCountText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
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