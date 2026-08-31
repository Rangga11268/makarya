import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { COLORS } from "../../theme/colors";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { ProjectStatusBar } from "../../components/features/ProjectStatusBar";
import { ProposalCard } from "../../components/features/ProposalCard";
import { projectApi, proposalApi, submissionApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import {
  ShieldCheck,
  Calendar,
  Send,
  ExternalLink,
} from "lucide-react-native";

export function ProjectDetailScreen({ route, navigation }) {
  const { user } = useAuthStore();
  const projectId = route.params?.id || route.params?.projectId;

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("proposals");
  const [actionLoading, setActionLoading] = useState(false);

  // Proposal modal for Mahasiswa
  const [proposalModal, setProposalModal] = useState(false);
  const [hargaTawar, setHargaTawar] = useState("");
  const [estimasiHari, setEstimasiHari] = useState("5");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const { showToast } = useToastStore();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const loadDetail = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const [pRes, propRes, subRes] = await Promise.all([
        projectApi.getDetail(projectId),
        proposalApi.getByProject(projectId).catch(() => ({ data: [] })),
        submissionApi.getByProject(projectId).catch(() => ({ data: [] })),
      ]);
      setProject(pRes.data);
      setProposals(Array.isArray(propRes.data) ? propRes.data : []);
      setSubmissions(Array.isArray(subRes.data) ? subRes.data : []);
      if (pRes.data?.budget_max) {
        setHargaTawar(String(pRes.data.budget_max));
      }
    } catch (err) {
      showToast("Gagal memuat rincian proyek", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [projectId]);

  const handleSubmitProposal = async () => {
    if (!hargaTawar || !coverLetter.trim()) {
      showToast("Harga tawar dan cover letter wajib diisi", "danger");
      return;
    }

    const harga = parseInt(hargaTawar, 10);
    if (harga > (project?.budget_max || 0)) {
      showToast(
        `Harga tawar tidak boleh melebihi budget max (${formatCurrency(
          project.budget_max
        )})`,
        "danger"
      );
      return;
    }

    try {
      setSubmitLoading(true);
      await proposalApi.submit({
        project_id: projectId,
        harga_tawar: harga,
        estimasi_hari: parseInt(estimasiHari, 10) || 5,
        cover_letter: coverLetter.trim(),
      });
      showToast("Proposal lamaran berhasil dikirim!", "success");
      setProposalModal(false);
      loadDetail();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Gagal mengirim proposal",
        "danger"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

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
              showToast(
                "Proposal disetujui! Proyek kini sedang dikerjakan.",
                "success"
              );
              loadDetail();
            } catch (err) {
              showToast(
                err.response?.data?.detail || "Gagal menyetujui proposal",
                "danger"
              );
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
      "Apakah Anda puas dengan hasil kerja ini? Dana escrow akan dicairkan 100% ke saldo honor mahasiswa.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Setujui & Lepas Escrow",
          onPress: async () => {
            try {
              setActionLoading(true);
              await submissionApi.approve(submissionId);
              showToast(
                "Proyek selesai & dana escrow berhasil dicairkan!",
                "success"
              );
              loadDetail();
            } catch (err) {
              showToast(
                err.response?.data?.detail || "Gagal menyetujui hasil kerja",
                "danger"
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!project) return null;

  const canApply =
    isMahasiswa &&
    (project.status === "OPEN" || project.status === "BIDDING");

  return (
    <View style={styles.container}>
      <Header
        title="Detail Proyek"
        subtitle={`Kategori: ${project.kategori || "UMKM Digital"}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Project Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <Badge label={formatStatus(project.status)} variant="lime" />
            <Text style={styles.budgetText}>
              {formatCurrency(project.budget_max)}
            </Text>
          </View>

          <Text style={styles.projectTitle}>{project.judul}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={13} color={COLORS.textMuted} />
              <Text style={styles.metaText}>
                Deadline: {formatDate(project.deadline)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <ShieldCheck size={13} color={COLORS.brandCyan} />
              <Text style={[styles.metaText, { color: COLORS.brandCyan, fontWeight: "700" }]}>
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

        {/* Action Button for Mahasiswa to submit proposal */}
        {canApply && (
          <Button
            title="Ajukan Proposal Lamaran"
            variant="lime"
            size="lg"
            icon={<Send size={18} color="#FFF" />}
            onPress={() => setProposalModal(true)}
            style={styles.applyBtn}
          />
        )}

        {/* Tab Selector: Proposals vs Submissions (for UMKM or Mahasiswa) */}
        {!isMahasiswa && (
          <>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setActiveTab("proposals")}
                style={[
                  styles.tabButton,
                  activeTab === "proposals" && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "proposals" && styles.tabTextActive,
                  ]}
                >
                  Proposal Masuk ({proposals.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("submission")}
                style={[
                  styles.tabButton,
                  activeTab === "submission" && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "submission" && styles.tabTextActive,
                  ]}
                >
                  Hasil Deliverable
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content Tab 1: Proposals */}
            {activeTab === "proposals" && (
              <View style={styles.tabContent}>
                {proposals.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                      Belum ada proposal dari mahasiswa.
                    </Text>
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
                    <Text style={styles.emptyText}>
                      Mahasiswa belum mengunggah hasil deliverable.
                    </Text>
                  </View>
                ) : (
                  submissions.map((sub) => (
                    <View key={sub.id} style={styles.submissionCard}>
                      <Text style={styles.submissionTitle}>
                        File Deliverable Proyek
                      </Text>
                      <Text style={styles.submissionDesc}>{sub.catatan}</Text>
                      <Button
                        title="Setujui & Lepas Escrow"
                        variant="lime"
                        size="md"
                        onPress={() => handleApproveSubmission(sub.id)}
                        loading={actionLoading}
                        style={{ marginTop: 12 }}
                      />
                    </View>
                  ))
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Modal Submit Proposal Mahasiswa */}
      <Modal visible={proposalModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Kirim Proposal Lamaran</Text>
            <Text style={styles.modalSub}>
              Tawarkan harga dan rencana kerja terbaik Anda untuk proyek ini
            </Text>

            <Input
              label="Tawaran Honor (Rp)"
              placeholder={String(project.budget_max)}
              value={hargaTawar}
              onChangeText={setHargaTawar}
              keyboardType="numeric"
            />

            <Input
              label="Estimasi Waktu Pengerjaan (Hari)"
              placeholder="5"
              value={estimasiHari}
              onChangeText={setEstimasiHari}
              keyboardType="numeric"
            />

            <Input
              label="Cover Letter / Rencana Kerja"
              placeholder="Jelaskan pengalaman Anda, portofolio yang relevan, dan bagaimana Anda akan menyelesaikan proyek ini..."
              value={coverLetter}
              onChangeText={setCoverLetter}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalActions}>
              <Button
                title="Batal"
                variant="dark"
                size="md"
                onPress={() => setProposalModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Kirim Lamaran"
                variant="lime"
                size="md"
                onPress={handleSubmitProposal}
                loading={submitLoading}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  heroCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  budgetText: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.brandIndigo,
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingTop: 12,
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
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 16,
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  applyBtn: {
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 16,
    padding: 4,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: COLORS.bgSurface,
    elevation: 1,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.textDark,
    fontWeight: "800",
  },
  tabContent: {
    marginTop: 4,
  },
  emptyBox: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  submissionCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 12,
  },
  submissionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  submissionDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.textDark,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
});
