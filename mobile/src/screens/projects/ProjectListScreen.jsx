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
import { COLORS } from "../../theme/colors";
import { Header } from "../../components/ui/Header";
import { ProjectCard } from "../../components/features/ProjectCard";
import { Button } from "../../components/ui/Button";
import { projectApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { Plus, Briefcase, Search, Compass, X } from "lucide-react-native";

export function ProjectListScreen({ navigation }) {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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

  const filterTabs = [
    { id: "ALL", label: "Semua" },
    { id: "OPEN", label: "Bidding" },
    { id: "IN_PROGRESS", label: "Dikerjakan" },
    { id: "REVIEW", label: "Review" },
    { id: "COMPLETED", label: "Selesai" },
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      p.status === statusFilter ||
      (statusFilter === "COMPLETED" && p.status === "DONE");

    const matchesSearch =
      !searchQuery.trim() ||
      p.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.deskripsi_raw?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategori?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
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

      {/* Search Bar for exploring */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={16} color={COLORS.textMuted} />
          <TextInput
            placeholder="Cari desain, web, video, copywriting..."
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

      {/* Filter Tabs */}
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
                activeOpacity={0.7}
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
              <Compass size={40} color={COLORS.brandIndigo} />
              <Text style={styles.emptyTitle}>
                {searchQuery
                  ? "Proyek Tidak Ditemukan"
                  : "Belum Ada Proyek Tersedia"}
              </Text>
              <Text style={styles.emptyDesc}>
                {searchQuery
                  ? "Coba gunakan kata kunci pencarian yang lain."
                  : isMahasiswa
                  ? "Proyek UMKM baru akan segera muncul di sini."
                  : "Mulai pasang proyek pertama Anda untuk mendapatkan proposal talenta."}
              </Text>
              {!isMahasiswa && (
                <Button
                  title="Pasang Proyek Pertama"
                  variant="lime"
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
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: COLORS.bgSurface,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
    paddingVertical: 2,
  },
  filterContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    backgroundColor: COLORS.bgSurface,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.canvasSoft,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.brandIndigo,
    borderColor: COLORS.brandIndigo,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  filterTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  listContent: {
    padding: 16,
    paddingBottom: 110,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
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