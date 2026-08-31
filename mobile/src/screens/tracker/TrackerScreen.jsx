import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { COLORS } from "../../theme/colors";
import { Header } from "../../components/ui/Header";
import { ProjectStatusBar } from "../../components/features/ProjectStatusBar";
import { projectApi } from "../../api";
import { formatCurrency } from "../../utils/formatCurrency";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react-native";

export function TrackerScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadActiveProjects = async () => {
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
    loadActiveProjects();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Live Project Tracker"
        subtitle="Pantau alur escrow dan progress deliverable secara real-time"
      />

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadActiveProjects}
            tintColor={COLORS.accentLime}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyBox}>
              <Activity size={32} color={COLORS.textDim} />
              <Text style={styles.emptyTitle}>Tidak Ada Proyek Aktif</Text>
              <Text style={styles.emptyDesc}>
                Seluruh proyek Anda telah selesai atau belum diterbitkan.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("ProjectDetail", { id: item.id })}
            style={styles.trackerCard}
          >
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.judul}
                </Text>
                <Text style={styles.cardBudget}>
                  {formatCurrency(item.budget_max)}
                </Text>
              </View>
              <ArrowRight size={18} color={COLORS.accentLime} />
            </View>

            <ProjectStatusBar currentStatus={item.status} />
          </TouchableOpacity>
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
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  trackerCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textWhite,
  },
  cardBudget: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.accentLime,
    marginTop: 2,
  },
  emptyBox: {
    padding: 60,
    alignItems: "center",
    justifyContent: "center",
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
  },
});