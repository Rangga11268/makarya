import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, SHADOWS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";
import { Header } from "../../components/ui/Header";
import { ProjectDetailSkeleton } from "../../components/ui/Skeleton";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ProposalSubmitModal } from "../../components/features/projects/ProposalSubmitModal";
import { DeliverableUploadModal } from "../../components/features/projects/DeliverableUploadModal";
import {
  ReopenProjectModal,
  TerminateProjectModal,
  ResignProposalModal,
  AcceptProposalModal,
  ApproveSubmissionModal,
} from "../../components/features/projects/ContractActionModals";
import { InvoiceReceiptModal } from "../../components/features/projects/InvoiceReceiptModal";
import { Badge } from "../../components/ui/Badge";
import { PebbleButton } from "../../components/ui/PebbleButton";
import { OrganicRibbonBackground } from "../../components/ui/OrganicRibbonBackground";
import { ProjectStatusBar } from "../../components/features/ProjectStatusBar";
import { ProposalCard } from "../../components/features/ProposalCard";
import { WorkroomActiveView } from "./components/WorkroomActiveView";
import { ApplicantReviewBoardView } from "./components/ApplicantReviewBoardView";
import { ProjectExploreDetailView } from "./components/ProjectExploreDetailView";
import { projectApi, proposalApi, submissionApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { useResponsiveLayout } from "../../hooks/useResponsiveLayout";
import { showConfirm } from "../../store/dialogStore";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, isExpired } from "../../utils/formatDate";
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
  ChevronDown,
  ChevronUp,
  Check,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Users,
  Palette,
  Smartphone,
} from "lucide-react-native";

export function ProjectDetailScreen({ route, navigation }) {
  const { user } = useAuthStore();
  const projectId = route.params?.id || route.params?.projectId;

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [myExistingProposal, setMyExistingProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    route.params?.initialTab || "proposals",
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [isBriefExpanded, setIsBriefExpanded] = useState(false);

  // Proposal modal for Mahasiswa
  const [proposalModal, setProposalModal] = useState(false);
  const [hargaTawar, setHargaTawar] = useState("");
  const [estimasiHari, setEstimasiHari] = useState("5");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Submission modal for Mahasiswa
  const [submissionModal, setSubmissionModal] = useState(false);
  const [urlBerkas, setUrlBerkas] = useState("");
  const [catatanPengiriman, setCatatanPengiriman] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  // Contract & Escrow Action Modals
  const [reopenModal, setReopenModal] = useState(false);
  const [terminateModal, setTerminateModal] = useState(false);
  const [resignModal, setResignModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [acceptProposalModal, setAcceptProposalModal] = useState(false);
  const [selectedProposalToAccept, setSelectedProposalToAccept] =
    useState(null);
  const [approveSubmissionModal, setApproveSubmissionModal] = useState(false);
  const [selectedSubmissionToApprove, setSelectedSubmissionToApprove] =
    useState(null);

  const { showToast } = useToastStore();
  const { responsiveContainerStyle, isCompact, isLandscape } =
    useResponsiveLayout();

  const isMahasiswa =
    user?.role === "MHS" ||
    user?.role === "MAHASISWA" ||
    (user?.email && user.email.includes(".ac.id")) ||
    user?.email === "darell@ubsi.ac.id";

  const isUmkmOwner = Boolean(
    user?.id && project?.umkm_id && String(user.id) === String(project.umkm_id),
  );

  const loadDetail = async () => {
    if (!projectId) return;
    try {
      setLoading(true);

      // 1. Ambil detail proyek terlebih dahulu (terbuka untuk publik/semua user terautentikasi)
      const pRes = await projectApi.getDetail(projectId);
      if (!pRes?.data) {
        showToast("Proyek tidak ditemukan", "danger");
        setLoading(false);
        return;
      }

      const isProjectOwner = Boolean(
        user?.id &&
        pRes.data?.umkm_id &&
        String(user.id) === String(pRes.data.umkm_id),
      );

      // 2. Fetch proposal & submission secara terkontrol sesuai role & izin
      const promises = [];

      // Hanya pemilik proyek yang boleh melihat seluruh daftar proposal masuk
      if (isProjectOwner) {
        promises.push(
          proposalApi.getByProject(projectId).catch(() => ({ data: [] })),
        );
      } else {
        promises.push(Promise.resolve({ data: [] }));
      }

      // Submission hasil kerja
      promises.push(
        submissionApi.getByProject(projectId).catch(() => ({ data: [] })),
      );

      // Mahasiswa melihat proposal milik diri sendiri
      if (isMahasiswa) {
        promises.push(proposalApi.getMyProposals().catch(() => ({ data: [] })));
      } else {
        promises.push(Promise.resolve({ data: [] }));
      }

      const [propRes, subRes, myPropsRes] = await Promise.all(promises);

      setProject(pRes.data);
      setProposals(Array.isArray(propRes.data) ? propRes.data : []);
      setSubmissions(
        Array.isArray(subRes.data)
          ? subRes.data
          : subRes.data && subRes.data.id
            ? [subRes.data]
            : [],
      );

      let foundProp = null;
      if (myPropsRes && Array.isArray(myPropsRes.data)) {
        foundProp = myPropsRes.data.find(
          (p) => String(p.project_id) === String(projectId),
        );
      }
      if (!foundProp && Array.isArray(propRes.data)) {
        foundProp = propRes.data.find(
          (p) =>
            String(p.mhs_id || p.user_id) === String(user?.id) ||
            (user?.email && p.mahasiswa_email === user?.email),
        );
      }
      setMyExistingProposal(foundProp || null);

      if (
        pRes.data?.tipe_kolaborasi === "TIM" &&
        Array.isArray(pRes.data?.slots) &&
        pRes.data.slots.length > 0
      ) {
        const firstOpenSlot =
          pRes.data.slots.find((s) => s.status === "OPEN") ||
          pRes.data.slots[0];
        setSelectedSlot(firstOpenSlot);
        if (firstOpenSlot?.alokasi_budget) {
          setHargaTawar(String(firstOpenSlot.alokasi_budget));
        }
      } else if (pRes.data?.budget_max) {
        setHargaTawar(String(pRes.data.budget_max));
      }
    } catch (err) {
      console.warn(
        "Gagal memuat detail proyek:",
        err?.response?.data || err?.message,
      );
      showToast("Gagal memuat rincian proyek", "danger");
    } finally {
      setLoading(false);
    }
  };

  const isProjectExpired =
    Boolean(project?.deadline && isExpired(project.deadline)) ||
    project?.status === "CANCELLED";
  const isAcceptedProposal = myExistingProposal?.status === "ACCEPTED";
  const isOpenForApply =
    (project?.status === "OPEN" || project?.status === "BIDDING") &&
    !isProjectExpired;
  const canApply =
    isMahasiswa && isOpenForApply && !myExistingProposal && !isUmkmOwner;

  const acceptedProposal = proposals.find((p) => p.status === "ACCEPTED");
  const hasAcceptedStudent = Boolean(
    project?.accepted_mhs_nama ||
    acceptedProposal ||
    (isUmkmOwner &&
      ["IN_PROGRESS", "REVIEW", "DONE", "COMPLETED"].includes(
        project?.status,
      )) ||
    (!isUmkmOwner && isAcceptedProposal),
  );

  const clientDisplayName =
    (project?.umkm_nama && project.umkm_nama.toLowerCase() !== "string"
      ? project.umkm_nama
      : null) ||
    (project?.umkm_profile?.nama_usaha &&
    project.umkm_profile.nama_usaha.toLowerCase() !== "string"
      ? project.umkm_profile.nama_usaha
      : null) ||
    myExistingProposal?.project_umkm_nama ||
    (project?.umkm?.profile_umkm?.nama_usaha &&
    project.umkm.profile_umkm.nama_usaha.toLowerCase() !== "string"
      ? project.umkm.profile_umkm.nama_usaha
      : null) ||
    (project?.client_name && project.client_name.toLowerCase() !== "string"
      ? project.client_name
      : null) ||
    (project?.nama_usaha && project.nama_usaha.toLowerCase() !== "string"
      ? project.nama_usaha
      : null) ||
    "Klien Mitra UMKM";

  const clientPhoto =
    project?.umkm_profile?.url_foto_usaha ||
    project?.umkm_profile?.url_foto ||
    project?.umkm_foto ||
    project?.project_umkm_foto ||
    myExistingProposal?.project_umkm_foto ||
    project?.umkm?.profile_umkm?.url_foto_usaha ||
    project?.url_foto ||
    null;

  const activePartnerName = isUmkmOwner
    ? project?.accepted_mhs_nama ||
      acceptedProposal?.mhs_profile?.nama_lengkap ||
      acceptedProposal?.mahasiswa_nama ||
      myExistingProposal?.mhs_profile?.nama_lengkap ||
      "Mahasiswa Pelaksana"
    : clientDisplayName;

  const activePartnerPhoto = isUmkmOwner
    ? project?.accepted_mhs_foto ||
      acceptedProposal?.mhs_profile?.url_foto ||
      acceptedProposal?.mahasiswa_foto ||
      null
    : clientPhoto;

  // 1. Mode Ruang Kerja Terdedikasi: Kontrak sedang berjalan untuk pihak terlibat (Mahasiswa / UMKM pemilik)
  const isDedicatedWorkroom = Boolean(
    ["IN_PROGRESS", "REVIEW", "DONE", "COMPLETED"].includes(project?.status) &&
    (isUmkmOwner || isAcceptedProposal),
  );

  // 2. Mode Board Seleksi Pelamar: Khusus Klien UMKM pada proyek tahap OPEN/BIDDING
  const isApplicantBoardMode = Boolean(
    (project?.status === "OPEN" || project?.status === "BIDDING") &&
    isUmkmOwner,
  );

  useFocusEffect(
    useCallback(() => {
      if (route.params?.initialTab) {
        setActiveTab(route.params.initialTab);
      }
      loadDetail();
    }, [projectId, route.params?.initialTab]),
  );

  const handleSubmitProposal = async () => {
    if (!hargaTawar || !coverLetter.trim()) {
      showToast("Harga tawar dan cover letter wajib diisi", "danger");
      return;
    }

    if (
      project?.tipe_kolaborasi === "TIM" &&
      project.slots?.length > 0 &&
      !selectedSlot
    ) {
      showToast("Pilih salah satu peran tim yang ingin Anda lamar", "danger");
      return;
    }

    const harga = parseInt(hargaTawar, 10);
    const maxBudget = selectedSlot
      ? selectedSlot.alokasi_budget
      : project?.budget_max || 0;
    if (harga > maxBudget) {
      showToast(
        `Harga tawar tidak boleh melebihi pagu peran (${formatCurrency(maxBudget)})`,
        "danger",
      );
      return;
    }

    try {
      setSubmitLoading(true);
      await proposalApi.submit({
        project_id: projectId,
        slot_id: selectedSlot?.id || undefined,
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
        "danger",
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
        catatan_pengiriman:
          catatanPengiriman.trim() || "Hasil deliverable pengerjaan proyek",
      });
      showToast("Hasil deliverable berhasil diunggah!", "success");
      setSubmissionModal(false);
      loadDetail();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Gagal mengunggah hasil kerja",
        "danger",
      );
    } finally {
      setUploadLoading(false);
    }
  };

  const handleOpenAcceptModal = (proposal) => {
    setSelectedProposalToAccept(proposal);
    setAcceptProposalModal(true);
  };

  const handleConfirmAcceptProposal = () => {
    if (!selectedProposalToAccept) return;
    const targetProp = selectedProposalToAccept;
    setAcceptProposalModal(false);
    showConfirm({
      title: "Kunci Rekening Escrow?",
      message: `Kunci dana penawaran sebesar ${formatCurrency(targetProp.harga_tawar)} di rekening escrow Makarya untuk mengamankan pengerjaan?`,
      type: "confirm",
      confirmText: "Kunci & Mulai",
      cancelText: "Batal",
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await proposalApi.accept(targetProp.id);
          setSelectedProposalToAccept(null);
          showToast(
            "Proposal disetujui! Dana berhasil dikunci di rekening Escrow.",
            "success",
          );
          loadDetail();
        } catch (err) {
          showToast(
            err.response?.data?.detail || "Gagal menyetujui proposal",
            "danger",
          );
        } finally {
          setActionLoading(false);
        }
      },
      onCancel: () => {
        setSelectedProposalToAccept(null);
      },
    });
  };

  const handleRejectProposal = (proposalId) => {
    showConfirm({
      title: "Tolak Proposal?",
      message:
        "Proposal mahasiswa ini akan ditolak. Tindakan ini tidak dapat dibatalkan.",
      type: "danger",
      isDestructive: true,
      confirmText: "Tolak",
      cancelText: "Batal",
      onConfirm: async () => {
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
      },
    });
  };

  const handleOpenApproveModal = (submission) => {
    setSelectedSubmissionToApprove(submission);
    setApproveSubmissionModal(true);
  };

  const handleConfirmApproveSubmission = () => {
    if (!selectedSubmissionToApprove) return;
    const targetSub = selectedSubmissionToApprove;
    setApproveSubmissionModal(false);
    showConfirm({
      title: "Cairkan Dana Escrow?",
      message:
        "Hasil pekerjaan resmi disetujui dan dana escrow akan dicairkan ke saldo mahasiswa.",
      type: "success",
      confirmText: "Cairkan Dana",
      cancelText: "Batal",
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await submissionApi.approve(targetSub.id);
          setSelectedSubmissionToApprove(null);
          showToast(
            "Proyek selesai & dana escrow berhasil dicairkan!",
            "success",
          );
          loadDetail();
        } catch (err) {
          showToast(
            err.response?.data?.detail || "Gagal menyetujui hasil kerja",
            "danger",
          );
        } finally {
          setActionLoading(false);
        }
      },
      onCancel: () => {
        setSelectedSubmissionToApprove(null);
      },
    });
  };

  const handleReopenProject = async ({ new_deadline, reason }) => {
    try {
      setActionLoading(true);
      await projectApi.reopen(projectId, {
        new_deadline,
        reason,
      });
      showToast(
        "Proyek dibuka kembali & escrow dikembalikan ke Saldo Aktif!",
        "success",
      );
      setReopenModal(false);
      loadDetail();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Gagal membuka kembali proyek",
        "danger",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleTerminateProject = async ({ reason }) => {
    try {
      setActionLoading(true);
      await projectApi.terminateAndCancel(projectId, { reason });
      showToast(
        "Proyek berhasil dibatalkan & escrow dikembalikan ke Saldo Aktif.",
        "success",
      );
      setTerminateModal(false);
      loadDetail();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Gagal membatalkan proyek",
        "danger",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleResignProposal = async ({ reason }) => {
    if (!myExistingProposal) return;
    try {
      setActionLoading(true);
      await proposalApi.resign(myExistingProposal.id, { reason });
      showToast("Pengunduran diri berhasil diajukan.", "success");
      setResignModal(false);
      loadDetail();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Gagal mengajukan pengunduran diri",
        "danger",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !project) {
    return (
      <View style={styles.container}>
        <Header
          title="Detail Proyek"
          subtitle="Memuat spesifikasi proyek..."
          onBack={() => {
            if (navigation?.canGoBack && navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("Main");
            }
          }}
        />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <ProjectDetailSkeleton />
        </ScrollView>
      </View>
    );
  }

  const projectStatusUpper = project?.status?.toUpperCase() || "";
  const isBiddingOpen =
    projectStatusUpper === "OPEN" ||
    projectStatusUpper === "BIDDING" ||
    projectStatusUpper === "TERBUKA";

  const renderSubmissionNote = (note) => {
    if (!note) return null;
    const lines = note.split("\n");
    const checklistItems = lines
      .filter(
        (l) => l.trim().startsWith("- [ ]") || l.trim().startsWith("- [x]"),
      )
      .map((l) => l.replace(/^-\s*\[[ x]\]\s*/i, "").trim());
    const generalNote = lines
      .filter(
        (l) =>
          !l.trim().startsWith("- [ ]") &&
          !l.trim().startsWith("- [x]") &&
          !l.trim().toLowerCase().startsWith("daftar poin perbaikan"),
      )
      .join("\n")
      .trim();

    return (
      <View style={{ marginTop: 6, gap: 6 }}>
        {generalNote ? (
          <Text style={styles.fileNotesText}>Catatan: "{generalNote}"</Text>
        ) : null}
        {checklistItems.length > 0 ? (
          <View style={styles.mobileChecklistCard}>
            <Text style={styles.mobileChecklistTitle}>
              Daftar Poin Perbaikan:
            </Text>
            {checklistItems.map((it, cIdx) => (
              <View key={cIdx} style={styles.mobileChecklistItemRow}>
                <Check
                  size={12}
                  color="#059669"
                  strokeWidth={2.5}
                  style={{ marginTop: 2 }}
                />
                <Text style={styles.mobileChecklistItemText}>{it}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        !isDedicatedWorkroom &&
          !isApplicantBoardMode && { backgroundColor: "#FFFFFF" },
      ]}
    >
      <Header
        title={
          isDedicatedWorkroom
            ? "Ruang Kerja Proyek"
            : isApplicantBoardMode
              ? "Seleksi Pelamar"
              : "Detail Proyek"
        }
        subtitle={
          isDedicatedWorkroom || isApplicantBoardMode
            ? project.judul
            : project.kategori
              ? `Kategori: ${project.kategori}`
              : undefined
        }
        onBack={() => {
          if (navigation?.canGoBack && navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate("Main");
          }
        }}
        rightAction={
          hasAcceptedStudent && !isDedicatedWorkroom ? (
            <TouchableOpacity
              style={styles.headerChatBtn}
              onPress={() =>
                navigation.navigate("Chat", {
                  projectId: project.id,
                  projectTitle: project.judul,
                  partnerName: activePartnerName,
                  partnerPhoto: activePartnerPhoto,
                  partnerRole: isUmkmOwner ? "MHS" : "UMKM",
                })
              }
              activeOpacity={0.7}
            >
              <MessageSquare size={18} color={COLORS.brandIndigo} />
            </TouchableOpacity>
          ) : null
        }
      />

      {isDedicatedWorkroom || isApplicantBoardMode ? (
        <OrganicRibbonBackground height={360} />
      ) : null}

      {isDedicatedWorkroom ? (
        <WorkroomActiveView
          project={project}
          isUmkmOwner={isUmkmOwner}
          isMahasiswa={isMahasiswa}
          submissions={submissions}
          myExistingProposal={myExistingProposal}
          activePartnerName={activePartnerName}
          activePartnerPhoto={activePartnerPhoto}
          navigation={navigation}
          onOpenSubmissionModal={() => setSubmissionModal(true)}
          onOpenApproveModal={handleOpenApproveModal}
          onOpenInvoiceModal={() => setInvoiceModal(true)}
          onOpenReopenModal={() => setReopenModal(true)}
          onOpenTerminateModal={() => setTerminateModal(true)}
          onOpenResignModal={() => setResignModal(true)}
          actionLoading={actionLoading}
          selectedSubmissionToApprove={selectedSubmissionToApprove}
        />
      ) : isApplicantBoardMode ? (
        <ApplicantReviewBoardView
          project={project}
          proposals={proposals}
          onAcceptProposal={handleOpenAcceptModal}
          onRejectProposal={handleRejectProposal}
          actionLoading={actionLoading}
          selectedProposalToAccept={selectedProposalToAccept}
        />
      ) : (
        <ProjectExploreDetailView
          project={project}
          user={user}
          isMahasiswa={isMahasiswa}
          isUmkmOwner={isUmkmOwner}
          clientPhoto={clientPhoto}
          clientDisplayName={clientDisplayName}
          hasAcceptedStudent={hasAcceptedStudent}
          activePartnerName={activePartnerName}
          activePartnerPhoto={activePartnerPhoto}
          isBriefExpanded={isBriefExpanded}
          setIsBriefExpanded={setIsBriefExpanded}
          submissions={submissions}
          proposals={proposals}
          myExistingProposal={myExistingProposal}
          isAcceptedProposal={isAcceptedProposal}
          isProjectExpired={isProjectExpired}
          actionLoading={actionLoading}
          selectedProposalToAccept={selectedProposalToAccept}
          selectedSubmissionToApprove={selectedSubmissionToApprove}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          responsiveContainerStyle={responsiveContainerStyle}
          isCompact={isCompact}
          isLandscape={isLandscape}
          canApply={canApply}
          navigation={navigation}
          showConfirm={showConfirm}
          setInvoiceModal={setInvoiceModal}
          setSubmissionModal={setSubmissionModal}
          setProposalModal={setProposalModal}
          setReopenModal={setReopenModal}
          setTerminateModal={setTerminateModal}
          setResignModal={setResignModal}
          handleOpenAcceptModal={handleOpenAcceptModal}
          handleRejectProposal={handleRejectProposal}
          handleOpenApproveModal={handleOpenApproveModal}
          renderSubmissionNote={renderSubmissionNote}
        />
      )}

      {/* Modal 1: Proposal Lamaran Sheet */}
      <ProposalSubmitModal
        visible={proposalModal}
        onClose={() => setProposalModal(false)}
        hargaTawar={hargaTawar}
        setHargaTawar={setHargaTawar}
        estimasiHari={estimasiHari}
        setEstimasiHari={setEstimasiHari}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        budgetMax={
          selectedSlot ? selectedSlot.alokasi_budget : project.budget_max
        }
        onSubmit={handleSubmitProposal}
        loading={submitLoading}
        slots={project.tipe_kolaborasi === "TIM" ? project.slots : []}
        selectedSlotId={selectedSlot?.id}
        onSelectSlot={(slot) => {
          setSelectedSlot(slot);
          setHargaTawar(String(slot.alokasi_budget));
        }}
      />

      {/* Modal 2: Deliverable Upload Sheet */}
      <DeliverableUploadModal
        visible={submissionModal}
        onClose={() => setSubmissionModal(false)}
        urlBerkas={urlBerkas}
        setUrlBerkas={setUrlBerkas}
        catatanPengiriman={catatanPengiriman}
        setCatatanPengiriman={setCatatanPengiriman}
        onSubmit={handleUploadWork}
        loading={uploadLoading}
      />

      {/* Modal 3: Reopen Project Modal (UMKM) */}
      <ReopenProjectModal
        visible={reopenModal}
        onClose={() => setReopenModal(false)}
        project={project}
        onConfirm={handleReopenProject}
        loading={actionLoading}
      />

      {/* Modal 4: Terminate Project Modal (UMKM) */}
      <TerminateProjectModal
        visible={terminateModal}
        onClose={() => setTerminateModal(false)}
        project={project}
        onConfirm={handleTerminateProject}
        loading={actionLoading}
      />

      {/* Modal 5: Resign Proposal Modal (Mahasiswa) */}
      <ResignProposalModal
        visible={resignModal}
        onClose={() => setResignModal(false)}
        proposal={myExistingProposal}
        onConfirm={handleResignProposal}
        loading={actionLoading}
      />

      {/* Modal 6: Official Escrow Invoice Receipt */}
      <InvoiceReceiptModal
        visible={invoiceModal}
        onClose={() => setInvoiceModal(false)}
        project={project}
        proposal={myExistingProposal || (proposals && proposals[0])}
        clientName={clientDisplayName}
        mhsName={
          isAcceptedProposal
            ? user?.nama || user?.nama_lengkap
            : (proposals && proposals[0]?.mhs_nama) || undefined
        }
      />

      {/* Modal 7: Custom Accept Proposal & Lock Escrow Modal */}
      <AcceptProposalModal
        visible={acceptProposalModal}
        onClose={() => {
          setAcceptProposalModal(false);
          setSelectedProposalToAccept(null);
        }}
        proposal={selectedProposalToAccept}
        project={project}
        onConfirm={handleConfirmAcceptProposal}
        loading={actionLoading}
      />

      {/* Modal 8: Custom Approve Submission & Release Escrow Modal */}
      <ApproveSubmissionModal
        visible={approveSubmissionModal}
        onClose={() => {
          setApproveSubmissionModal(false);
          setSelectedSubmissionToApprove(null);
        }}
        submission={selectedSubmissionToApprove}
        project={project}
        onConfirm={handleConfirmApproveSubmission}
        loading={actionLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  headerChatBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  fileNotesText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
    fontStyle: "italic",
  },
  mobileChecklistCard: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  mobileChecklistTitle: {
    fontFamily: FONTS.bodyBold,
    fontSize: 11,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 6,
  },
  mobileChecklistItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 4,
  },
  mobileChecklistItemText: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 11.5,
    color: "#15803D",
    flex: 1,
    lineHeight: 16,
  },
});
