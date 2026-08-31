import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { COLORS } from "../../theme/colors";
import { Header } from "../../components/ui/Header";
import { ProjectCard } from "../../components/features/ProjectCard";
import { Button } from "../../components/ui/Button";
import { projectApi } from "../../api";
import { Plus, Briefcase } from "lucide-react-native";

export function ProjectListScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await projectApi.getMyProjects();
      setProjects(res.data);
    } catch (e) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filterTabs = [
    { id: "ALL", label: "Semua" },
    { id: "OPEN", label: "Bidding" },
    { id: "IN_PROGRESS", label: "Dikerjakan" },
    { id: "REVIEW", label: "Review" },
    { id: "COMPLETED", label: "Selesai" },
  ];

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === "ALL") return true;
    return p.status === statusFilter;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Daftar Proyek UMKM"
        subtitle="Kelola pesanan dan pantau proposal mahasiswa yang masuk"
        rightAction={
          <TouchableOpacity
            onPress={() => navigation.navigate("PostProject")}
            style={styles.fabHeader}
          >
            <Plus size={18} color="#000" strokeWidth={3} />
          </TouchableOpacity>
        }
      />

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
                style={[styles.filterChip, selected && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, selected && styles.filterTextActive]}>
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
            tintColor={COLORS.accentLime}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Briefcase size={36} color={COLORS.textDim} />
              <Text style={styles.emptyTitle}>Belum Ada Proyek</Text>
              <Text style={styles.emptyDesc}>
                {statusFilter === "ALL"
                  ? "Anda belum menerbitkan proyek apapun."
                  : `Tidak ada proyek dengan status ${statusFilter}.`}
              </Text>
              <Button
                title="Pasang Proyek Pertama"
                variant="lime"
                size="md"
                onPress={() => navigation.navigate("PostProject")}
                style={styles.emptyBtn}
              />
            </View>
          )
        }
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate("ProjectDetail", { id: item.id })}
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
    backgroundColor: COLORS.accentLime,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
    backgroundColor: COLORS.bgDark,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.cardDark,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.accentLime,
    borderColor: COLORS.accentLime,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
  filterTextActive: {
    color: COLORS.textDark,
    fontWeight: "800",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textWhite,
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
    maxWidth: 240,
  },
  emptyBtn: {
    marginTop: 20,
  },
});