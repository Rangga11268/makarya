import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
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
  Building2,
  CheckCircle2,
  FileCheck,
  Clock,
  Briefcase,
  Layers,
  ArrowRight,
  Info,
  UploadCloud,
  Link2,
  FileText,
  ChevronRight,
  Check,
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

  // Submission modal for Mahasiswa
  const [submissionModal, setSubmissionModal] = useState(false);
  const [urlBerkas, setUrlBerkas] = useState("");
  const [catatanPengiriman, setCatatanPengiriman] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const { showToast } = useToastStore();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    !user?.role ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const isUmkmOwner =
    user?.role === "UMKM" ||
    (project?.umkm_id && user?.id && project.umkm_id === user.id);

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

  const handleUploadWork = async () => {
    if (!urlBerkas.trim()) {
      showToast("Tautan berkas (Figma/Drive/GitHub) wajib diisi", "danger");
      return;
    }

    try {
      setUploadLoading(true);
      await submissionApi.submitWork({
        project_id: projectId,
        url_berkas: urlBerkas.trim(),
        catatan_pengiriman: catatanPengiriman.trim() || "Hasil deliverable pengerjaan proyek",
      });
      showToast("Hasil deliverable berhasil diunggah!", "success");
      setSubmissionModal(false);
      loadDetail();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Gagal mengunggah hasil kerja",
        "danger"
      );
    } finally {
      setUploadLoading(false);
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

  const projectStatusUpper = project?.status?.toUpperCase() || "";
  const isBiddingOpen =
    projectStatusUpper === "OPEN" ||
    projectStatusUpper === "BIDDING" ||
    projectStatusUpper === "TERBUKA";

  // Check if user already submitted a proposal
  const myExistingProposal = proposals.find(
    (p) => p.user_id === user?.id || p.mahasiswa_email === user?.email
  );

  const isAcceptedProposal = myExistingProposal?.status === "ACCEPTED";
  const canApply = !isUmkmOwner && isBiddingOpen && !myExistingProposal;

  return (
    <View style={styles.container}>
      <Header
        title="Detail Proyek"
        subtitle={`Kategori: ${project.kategori || "UMKM Digital"}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Hero Summary Card */}
        <View style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <Badge label={formatStatus(project.status)} variant="brand" />
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

            <View style={styles.escrowPill}>
              <ShieldCheck size={13} color={COLORS.brandCyan} />
              <Text style={styles.escrowPillText}>Escrow Guaranteed</Text>
            </View>
          </View>
        </View>

        {/* 2. Interactive Escrow Progress Stepper */}
        <ProjectStatusBar currentStatus={project.status} />

        {/* 3. Client UMKM Profile Info */}
        <View style={styles.clientBox}>
          <View style={styles.clientAvatarBox}>
            <Building2 size={20} color={COLORS.brandIndigo} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.clientNameRow}>
              <Text style={styles.clientTitle}>
                {project.umkm_nama || "Mitra UMKM Terverifikasi"}
              </Text>
              <View style={styles.verifiedTag}>
                <Check size={10} color={COLORS.success} strokeWidth={3} />
                <Text style={styles.verifiedTagText}>Mitra Kampus</Text>
              </View>
            </View>
            <Text style={styles.clientMeta}>
              {project.lokasi || "Jakarta Selatan"} • Pembayaran Escrow Terjamin
            </Text>
          </View>
        </View>

        {/* 4. Description & Scope */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>Rincian Kebutuhan Brief</Text>
          <Text style={styles.descriptionText}>{project.deskripsi_raw}</Text>
        </View>

        {/* 5. Deliverable Upload Section (If Mahasiswa is Accepted Worker) */}
        {isMahasiswa && isAcceptedProposal && (
          <View style={styles.submissionSectionBox}>
            <View style={styles.submissionHeader}>
              <View style={styles.submissionIconBox}>
                <UploadCloud size={20} color={COLORS.brandIndigo} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.submissionHeaderTitle}>
                  Hasil Pekerjaan (Deliverable)
                </Text>
                <Text style={styles.submissionHeaderSub}>
                  {submissions.length > 0
                    ? "Berkas berhasil diunggah & sedang direview klien"
                    : "Unggah tautan Figma, GitHub, atau Google Drive hasil karyamu"}
                </Text>
              </View>
            </View>

            {submissions.length > 0 ? (
              <View style={styles.submittedFileList}>
                {submissions.map((sub, idx) => (
                  <View key={sub.id || idx} style={styles.submittedFileCard}>
                    <View style={styles.fileCardTop}>
                      <Link2 size={16} color={COLORS.brandIndigo} />
                      <Text style={styles.fileUrlText} numberOfLines={1}>
                        {sub.url_berkas || "Tautan Deliverable"}
                      </Text>
                      <View style={styles.subStatusBadge}>
                        <Text style={styles.subStatusBadgeText}>
                          {formatStatus(sub.status || "SUBMITTED")}
                        </Text>
                      </View>
                    </View>
                    {sub.catatan_pengiriman ? (
                      <Text style={styles.fileNotesText}>
                        Catatan: "{sub.catatan_pengiriman}"
                      </Text>
                    ) : null}
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.reuploadBtn}
                  onPress={() => setSubmissionModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.reuploadBtnText}>Perbarui Tautan Berkas</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadCtaBox}
                onPress={() => setSubmissionModal(true)}
                activeOpacity={0.88}
              >
                <UploadCloud size={24} color={COLORS.brandIndigo} />
                <Text style={styles.uploadCtaMain}>
                  Unggah Berkas Deliverable Sekarang
                </Text>
                <Text style={styles.uploadCtaSub}>
                  Kirim hasil pengerjaan untuk membuka pencairan dana escrow
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 6. Escrow Protection Assurance Banner */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={20} color={COLORS.success} />
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>
              Proteksi Rekening Bersama (Escrow)
            </Text>
            <Text style={styles.guaranteeDesc}>
              {isMahasiswa
                ? "Honor Anda dijamin 100% aman tersimpan di platform dan cair otomatis setelah deliverable disetujui."
                : "Dana Anda baru cair ke mahasiswa setelah hasil pengerjaan proyek disetujui."}
            </Text>
          </View>
        </View>

        {/* 7. UMKM Management Section */}
        {isUmkmOwner && (
          <View style={styles.managementSection}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setActiveTab("proposals")}
                style={[
                  styles.tabButton,
                  activeTab === "proposals" && styles.tabButtonActive,
                ]}
                activeOpacity={0.8}
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
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "submission" && styles.tabTextActive,
                  ]}
                >
                  Hasil Deliverable ({submissions.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab 1: Proposals List */}
            {activeTab === "proposals" && (
              <View style={styles.tabContent}>
                {proposals.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Briefcase size={32} color={COLORS.textDim} />
                    <Text style={styles.emptyText}>
                      Belum ada proposal masuk dari mahasiswa.
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

            {/* Tab 2: Submission Deliverable */}
            {activeTab === "submission" && (
              <View style={styles.tabContent}>
                {submissions.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <FileCheck size={32} color={COLORS.textDim} />
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
                      <TouchableOpacity
                        style={styles.submittedLinkBox}
                        activeOpacity={0.7}
                      >
                        <Link2 size={15} color={COLORS.brandIndigo} />
                        <Text style={styles.submittedLinkText} numberOfLines={1}>
                          {sub.url_berkas}
                        </Text>
                      </TouchableOpacity>
                      {sub.catatan_pengiriman ? (
                        <Text style={styles.submissionDesc}>
                          Catatan: "{sub.catatan_pengiriman}"
                        </Text>
                      ) : null}
                      <Button
                        title="Setujui & Lepas Escrow"
                        variant="brand"
                        size="md"
                        icon={<CheckCircle2 size={16} color="#FFF" />}
                        onPress={() => handleApproveSubmission(sub.id)}
                        loading={actionLoading}
                        style={{ marginTop: 12 }}
                      />
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 8. Persistent Sticky Bottom Action Bar */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.stickyPriceCol}>
          <Text style={styles.stickyPriceLabel}>Pagu Anggaran</Text>
          <Text style={styles.stickyPriceValue}>
            {formatCurrency(project.budget_max)}
          </Text>
        </View>

        <View style={styles.stickyActionCol}>
          {canApply ? (
            <TouchableOpacity
              style={styles.primaryApplyBtn}
              onPress={() => setProposalModal(true)}
              activeOpacity={0.88}
            >
              <Send size={15} color="#FFFFFF" />
              <Text style={styles.primaryApplyBtnText}>Ajukan Bid / Lamaran</Text>
            </TouchableOpacity>
          ) : isAcceptedProposal ? (
            <TouchableOpacity
              style={styles.primaryUploadBtn}
              onPress={() => setSubmissionModal(true)}
              activeOpacity={0.88}
            >
              <UploadCloud size={15} color="#FFFFFF" />
              <Text style={styles.primaryApplyBtnText}>Unggah Deliverable</Text>
            </TouchableOpacity>
          ) : myExistingProposal ? (
            <View style={styles.alreadyAppliedPill}>
              <CheckCircle2 size={14} color={COLORS.success} />
              <Text style={styles.alreadyAppliedText}>Proposal Terkirim</Text>
            </View>
          ) : isUmkmOwner ? (
            <TouchableOpacity
              style={styles.umkmManageBtn}
              onPress={() => setActiveTab("proposals")}
              activeOpacity={0.88}
            >
              <Layers size={15} color="#FFFFFF" />
              <Text style={styles.primaryApplyBtnText}>
                Pelamar ({proposals.length})
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.closedStatusPill}>
              <Info size={14} color={COLORS.textMuted} />
              <Text style={styles.closedStatusText}>Pendaftaran Ditutup</Text>
            </View>
          )}
        </View>
      </View>

      {/* Modal 1: Proposal Lamaran Sheet */}
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
              placeholder="Jelaskan keahlian relevan dan bagaimana Anda akan menyelesaikan proyek ini..."
              value={coverLetter}
              onChangeText={setCoverLetter}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalActions}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={() => setProposalModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Kirim Lamaran"
                variant="brand"
                size="md"
                onPress={handleSubmitProposal}
                loading={submitLoading}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Deliverable Upload Sheet */}
      <Modal visible={submissionModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Unggah Hasil Pekerjaan</Text>
            <Text style={styles.modalSub}>
              Sertakan link berkas proyek (Google Drive, Figma, GitHub, atau Loom video)
            </Text>

            <Input
              label="Tautan Berkas Deliverable"
              placeholder="https://figma.com/file/... atau https://drive.google.com/..."
              value={urlBerkas}
              onChangeText={setUrlBerkas}
              autoCapitalize="none"
            />

            <Input
              label="Catatan Pengiriman & Ringkasan Hasil"
              placeholder="Jelaskan apa saja yang telah selesai dikerjakan sesuai brief..."
              value={catatanPengiriman}
              onChangeText={setCatatanPengiriman}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <Button
                title="Batal"
                variant="secondary"
                size="md"
                onPress={() => setSubmissionModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Kirim Hasil Kerja"
                variant="brand"
                size="md"
                onPress={handleUploadWork}
                loading={uploadLoading}
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
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  budgetText: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.brandIndigo,
  },
  projectTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
    lineHeight: 24,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  escrowPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.brandCyanLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  escrowPillText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.brandCyan,
    fontWeight: "700",
  },

  // Client Box
  clientBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  clientAvatarBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  clientNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clientTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  verifiedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  verifiedTagText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 9,
    color: COLORS.success,
    fontWeight: "700",
  },
  clientMeta: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Description Section
  sectionBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  descriptionText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.textDark,
    lineHeight: 20,
  },

  // Submission Upload Section Box
  submissionSectionBox: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(79, 70, 229, 0.25)",
    marginBottom: 14,
  },
  submissionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  submissionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.brandIndigoLight,
    alignItems: "center",
    justifyContent: "center",
  },
  submissionHeaderTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  submissionHeaderSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  uploadCtaBox: {
    borderWidth: 1.5,
    borderColor: COLORS.brandIndigo,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.brandIndigoLight,
  },
  uploadCtaMain: {
    fontFamily: FONTS.bodyBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.brandIndigo,
    marginTop: 6,
  },
  uploadCtaSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  submittedFileList: {
    gap: 8,
  },
  submittedFileCard: {
    backgroundColor: COLORS.canvasSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  fileCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fileUrlText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    color: COLORS.brandIndigo,
    flex: 1,
  },
  subStatusBadge: {
    backgroundColor: COLORS.brandIndigoLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  subStatusBadgeText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
    color: COLORS.brandIndigo,
  },
  fileNotesText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  reuploadBtn: {
    paddingVertical: 8,
    alignItems: "center",
  },
  reuploadBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
  },

  guaranteeBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: COLORS.successBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    marginBottom: 14,
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 2,
  },
  guaranteeDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: "#047857",
    lineHeight: 16,
  },

  // Management Section
  managementSection: {
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.bgSurfaceSubtle,
    borderRadius: 14,
    padding: 3,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 11,
  },
  tabButtonActive: {
    backgroundColor: COLORS.bgSurface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textMuted,
  },
  tabTextActive: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.textDark,
    fontWeight: "700",
  },
  tabContent: {
    gap: 10,
  },
  emptyBox: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  emptyText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: "center",
  },
  submissionCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  submissionTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  submittedLinkBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.canvasSoft,
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  submittedLinkText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.brandIndigo,
    flex: 1,
  },
  submissionDesc: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // Persistent Sticky Bottom Action Bar
  stickyBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: COLORS.borderDark,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 10,
  },
  stickyPriceCol: {
    flex: 1,
  },
  stickyPriceLabel: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11,
    color: COLORS.textMuted,
  },
  stickyPriceValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.brandIndigo,
    letterSpacing: -0.3,
  },
  stickyActionCol: {
    flex: 1.4,
    alignItems: "flex-end",
  },
  primaryApplyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 999,
    width: "100%",
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryUploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigo,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 999,
    width: "100%",
    shadowColor: COLORS.brandIndigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryApplyBtnText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  alreadyAppliedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  alreadyAppliedText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    color: COLORS.success,
    fontWeight: "700",
  },
  umkmManageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.brandIndigoDark,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    width: "100%",
  },
  closedStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  closedStatusText: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // Modal Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.bgSurface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  modalTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  modalSub: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
