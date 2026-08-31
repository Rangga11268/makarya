import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { Header } from "../../components/ui/Header";
import { ProjectStatusBar } from "../../components/features/ProjectStatusBar";
import { Badge } from "../../components/ui/Badge";
import { projectApi, proposalApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import {
  Activity,
  ArrowRight,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react-native";

export function TrackerScreen({ navigation }) {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadData();
  }, [user?.role]);

  const getProposalBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <Badge label="Diterima" variant="success" />;
      case "REJECTED":
        return <Badge label="Ditolak" variant="danger" />;
      case "PENDING":
      default:
        return <Badge label="Menunggu Review" variant="warning" />;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={isMahasiswa ? "Workspace & Lamaran" : "Live Project Tracker"}
        subtitle={
          isMahasiswa
            ? "Pantau status proposal dan pengerjaan proyek aktif"
            : "Pantau alur escrow dan progress deliverable secara real-time"
        }
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadData}
            tintColor={COLORS.brandIndigo}
            colors={[COLORS.brandIndigo]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyBox}>
              <Layers size={40} color={COLORS.brandIndigo} />
              <Text style={styles.emptyTitle}>
                {isMahasiswa ? "Belum Ada Lamaran Aktif" : "Tidak Ada Proyek Aktif"}
              </Text>
              <Text style={styles.emptyDesc}>
                {isMahasiswa
                  ? "Jelajahi proyek di tab Eksplor dan ajukan proposal pertamamu."
                  : "Seluruh proyek Anda telah selesai atau belum diterbitkan."}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          if (isMahasiswa) {
            return (
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate("ProjectDetail", {
                    id: item.project_id,
                    projectId: item.project_id,
                  })
                }
                style={styles.trackerCard}
              >
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.badgeRow}>
                      {getProposalBadge(item.status)}
                      <Text style={styles.dateText}>
                        {formatDate(item.created_at)}
                      </Text>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.project_judul || "Proyek Digital UMKM"}
                    </Text>
                    <Text style={styles.cardBudget}>
                      Tawaran: {formatCurrency(item.harga_tawar)}
                    </Text>
                  </View>
                  <ArrowRight size={18} color={COLORS.brandIndigo} />
                </View>

                {item.cover_letter ? (
                  <View style={styles.coverLetterBox}>
                    <Text style={styles.coverLetterText} numberOfLines={2}>
                      "{item.cover_letter}"
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() =>
                navigation.navigate("ProjectDetail", {
                  id: item.id,
                  projectId: item.id,
                })
              }
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
                <ArrowRight size={18} color={COLORS.brandIndigo} />
              </View>

              <ProjectStatusBar currentStatus={item.status} />
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
    backgroundColor: COLORS.bgDark,
  },
  listContent: {
    padding: 16,
    paddingBottom: 110,
  },
  trackerCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.2,
  },
  cardBudget: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandIndigo,
    marginTop: 4,
  },
  coverLetterBox: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brandIndigo,
  },
  coverLetterText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: "italic",
    lineHeight: 16,
  },
  emptyBox: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
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
});