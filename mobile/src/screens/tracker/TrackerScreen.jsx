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
  AlertCircle,
  Briefcase,
} from "lucide-react-native";

export function TrackerScreen({ navigation }) {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

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
        return <Badge label="Proposal Diterima (Escrow Aktif)" variant="success" />;
      case "REJECTED":
        return <Badge label="Proposal Ditolak" variant="danger" />;
      case "PENDING":
      default:
        return <Badge label="Menunggu Review Klien" variant="warning" />;
    }
  };

  const filterTabs = [
    { id: "ALL", label: "Semua Lamaran" },
    { id: "PENDING", label: "Menunggu" },
    { id: "ACCEPTED", label: "Diterima" },
    { id: "REJECTED", label: "Ditolak" },
  ];

  const filteredItems = items.filter((item) => {
    if (statusFilter === "ALL") return true;
    return item.status === statusFilter;
  });

  return (
    <View style={styles.container}>
      <Header
        title={isMahasiswa ? "Workspace & Lamaran" : "Live Project Tracker"}
        subtitle={
          isMahasiswa
            ? "Pantau status proposal, proyek aktif & pencairan honor"
            : "Pantau alur escrow dan progres deliverable secara real-time"
        }
      />

      {/* Filter Tabs for Mahasiswa */}
      {isMahasiswa && (
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filterTabs}
            keyExtractor={(t) => t.id}
            renderItem={({ item: tab }) => {
              const selected = statusFilter === tab.id;
              return (
                <TouchableOpacity
                  onPress={() => setStatusFilter(tab.id)}
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
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.filterList}
          />
        </View>
      )}

      <FlatList
        data={isMahasiswa ? filteredItems : items}
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
                {isMahasiswa
                  ? "Belum Ada Lamaran Aktif"
                  : "Tidak Ada Proyek Aktif"}
              </Text>
              <Text style={styles.emptyDesc}>
                {isMahasiswa
                  ? "Jelajahi proyek di tab Eksplor dan ajukan proposal penawaran pertamamu."
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

                    <View style={styles.offerInfoRow}>
                      <Text style={styles.offerLabel}>Tawaran Anda:</Text>
                      <Text style={styles.cardBudget}>
                        {formatCurrency(item.harga_tawar)}
                      </Text>
                      <Text style={styles.offerDuration}>
                        • {item.estimasi_hari || 5} Hari Kerja
                      </Text>
                    </View>
                  </View>

                  <ArrowRight size={18} color={COLORS.brandIndigo} />
                </View>

                {item.cover_letter ? (
                  <View style={styles.coverLetterBox}>
                    <Text style={styles.coverLetterLabel}>Cover Letter:</Text>
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
  filterContainer: {
    backgroundColor: COLORS.bgSurface,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.canvasSoft,
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
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  filterTextActive: {
    color: "#FFFFFF",
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
    marginBottom: 12,
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingRight: 8,
  },
  dateText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.textDark,
    letterSpacing: -0.3,
    lineHeight: 21,
  },
  offerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  offerLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  cardBudget: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.brandIndigo,
  },
  offerDuration: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  coverLetterBox: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brandIndigo,
  },
  coverLetterLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  coverLetterText: {
    fontSize: 12,
    color: COLORS.textDark,
    fontStyle: "italic",
    lineHeight: 17,
  },
  emptyBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    paddingVertical: 50,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginTop: 20,
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
});