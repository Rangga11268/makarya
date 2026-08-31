import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from "react-native";
import { COLORS } from "../../theme/colors";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { ProjectStatusBar } from "../../components/features/ProjectStatusBar";
import { ProposalCard } from "../../components/features/ProposalCard";
import { projectApi, proposalApi, submissionApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { ShieldCheck, Calendar, FileText, CheckCircle2, ExternalLink, RefreshCw } from "lucide-react-native";

export function ProjectDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("proposals"); // 'proposals' | 'submission'
  const [actionLoading, setActionLoading] = useState(false);

  const { showToast } = useToastStore();

  const loadDetail = async () => {
    try {
      setLoading(true);
      const [pRes, propRes, subRes] = await Promise.all([
        projectApi.getDetail(id),
        proposalApi.getByProject(id).catch(() => ({ data: [] })),
        submissionApi.getByProject(id).catch(() => ({ data: [] })),
      ]);
      setProject(pRes.data);
      setProposals(propRes.data);
      setSubmissions(subRes.data);
    } catch (err) {
      showToast("Gagal memuat rincian proyek", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  const handleAcceptProposal = async (proposalId) => {
    Alert.alert(
      "Konfirmasi Penerimaan",
      "Apakah Anda yakin menyetujui proposal ini? Dana proyek akan otomatis dikunci di rekening bersama (Escrow).",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya, Setujui & Kunci Escrow",
          onPress: async () => {
            try {
              setActionLoading(true);
              await proposalApi.accept(proposalId);
              showToast("Proposal disetujui! Proyek kini berstatus IN_PROGRESS.", "success");
              loadDetail();
            } catch (err) {
              showToast(err.response?.data?.detail || "Gagal menyetujui proposal", "danger");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      setActionLoading(true);
      await proposalApi.reject(proposalId);
      showToast("Proposal ditolak", "info");
      loadDetail();
    } catch (err) {
      showToast("Gagal menolak proposal", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveSubmission = async (submissionId) => {
    Alert.alert(
      "Penyelesaian Proyek",
      "Apakah Anda puas dengan hasil kerja ini? Dana escrow akan dicairkan 100% ke saldo mahasiswa.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Setujui & Lepas Escrow",
          onPress: async () => {
            try {
              setActionLoading(true);
              await submissionApi.approve(submissionId);
              showToast("Proyek selesai & dana escrow berhasil dicairkan!", "success");
              loadDetail();
            } catch (err) {
              showToast(err.response?.data?.detail || "Gagal menyetujui hasil kerja", "danger");
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!project) return null;

  return (
    <View style={styles.container}>
      <Header
        title="Detail Proyek"
        subtitle={`ID: #${project.id?.substring(0, 8)}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Project Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <Badge label={project.status} variant="lime" />
            <Text style={styles.budgetText}>{formatCurrency(project.budget_max)}</Text>
          </View>

          <Text style={styles.projectTitle}>{project.judul}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={13} color={COLORS.textMuted} />
              <Text style={styles.metaText}>Deadline: {formatDate(project.deadline)}</Text>
            </View>
            <View style={styles.metaItem}>
              <ShieldCheck size={13} color={COLORS.accentCyan} />
              <Text style={[styles.metaText, { color: COLORS.accentCyan, fontWeight: "700" }]}>
                Escrow Protected
              </Text>
            </View>
          </View>
        </View>

        {/* 4-Step Escrow Status Bar */}
        <ProjectStatusBar currentStatus={project.status} />

        {/* Description */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Deskripsi Kebutuhan</Text>
          <Text style={styles.descriptionText}>{project.deskripsi_raw}</Text>
        </View>

        {/* Tab Selector: Proposals vs Submissions */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("proposals")}
            style={[styles.tabButton, activeTab === "proposals" && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, activeTab === "proposals" && styles.tabTextActive]}>
              Proposal Masuk ({proposals.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("submission")}
            style={[styles.tabButton, activeTab === "submission" && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, activeTab === "submission" && styles.tabTextActive]}>
              Hasil Deliverable
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Tab 1: Proposals */}
        {activeTab === "proposals" && (
          <View style={styles.tabContent}>
            {proposals.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Belum ada proposal dari mahasiswa.</Text>
              </View>
            ) : (
              proposals.map((prop) => (
                <ProposalCard
                  key={prop.id}
                  proposal={prop}
                  onAccept={() => handleAcceptProposal(prop.id)}
                  onReject={() => handleRejectProposal(prop.id)}
                  loadingAccept={actionLoading}
                  loadingReject={actionLoading}
                />
              ))
            )}
          </View>
        )}

        {/* Content Tab 2: Submission */}
        {activeTab === "submission" && (
          <View style={styles.tabContent}>
            {submissions.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Mahasiswa belum mengunggah hasil deliverable.</Text>
              </View>
            ) : (
              submissions.map((sub) => (
                <View key={sub.id} style={styles.submissionCard}>
                  <View style={styles.subHeader}>
                    <Badge label={`Revisi Ke-${sub.jumlah_revisi || 0}`} variant="cyan" />
                    <Text style={styles.subDate}>{formatDate(sub.created_at)}</Text>
                  </View>

                  <Text style={styles.subLabel}>Link Berkas Deliverable:</Text>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(sub.url_berkas)}
                    style={styles.linkRow}
                  >
                    <ExternalLink size={14} color={COLORS.accentLime} />
                    <Text style={styles.linkText} numberOfLines={1}>
                      {sub.url_berkas}
                    </Text>
                  </TouchableOpacity>

                  {sub.catatan_pengiriman && (
                    <View style={styles.notesBox}>
                      <Text style={styles.notesLabel}>Catatan Mahasiswa:</Text>
                      <Text style={styles.notesText}>"{sub.catatan_pengiriman}"</Text>
                    </View>
                  )}

                  {project.status !== "COMPLETED" && (
                    <Button
                      title="Setujui Hasil & Lepas Escrow"
                      variant="lime"
                      size="md"
                      onPress={() => handleApproveSubmission(sub.id)}
                      loading={actionLoading}
                      style={{ marginTop: 12 }}
                    />
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  heroCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.accentLime,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.textWhite,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  sectionBox: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.textWhite,
    lineHeight: 19,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.cardDark,
    borderRadius: 999,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 999,
  },
  tabButtonActive: {
    backgroundColor: COLORS.accentLime,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.textDark,
  },
  tabContent: {
    marginBottom: 20,
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.cardDark,
    borderRadius: 20,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  submissionCard: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 12,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  subLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.bgDark,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 12,
    color: COLORS.accentLime,
    fontWeight: "600",
    flex: 1,
  },
  notesBox: {
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 10,
    borderRadius: 12,
  },
  notesLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  notesText: {
    fontSize: 12,
    color: COLORS.textWhite,
    fontStyle: "italic",
    marginTop: 2,
  },
});