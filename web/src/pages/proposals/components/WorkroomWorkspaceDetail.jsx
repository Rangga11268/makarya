import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { Button } from "../../../components/ui/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate, isExpired } from "../../../utils/formatDate";
import { ProjectBriefVectorIcon } from "../../../components/icons/ProjectVectorIcon";
import {
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  FileCheck2,
  Users,
  FileText,
  RotateCcw,
  CheckCircle2,
  UploadCloud,
  Clock,
  AlertCircle,
  XCircle,
  ListChecks,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ChevronRight,
  Star,
  Scale,
  Briefcase,
  Layers,
  Sparkles,
  Link2,
  Share2,
  Shield,
  FileCode,
  FolderArchive,
  Palette,
  Check,
  Building2,
  GraduationCap,
  MapPin,
  Mail,
  Send,
  HelpCircle,
  Coins,
} from "lucide-react";

import { InvoiceReceiptModal } from "../../../components/features/InvoiceReceiptModal";
import { projectApi } from "../../../api";
import { Avatar } from "../../../components/ui/Avatar";
import { WorkspaceProjectHUD } from "./workspace/WorkspaceProjectHUD";
import { SmartDeliverableCard } from "./workspace/SmartDeliverableCard";
import { AssetHandoffModal } from "./workspace/AssetHandoffModal";
import { WorkspaceActivityTimeline } from "./workspace/WorkspaceActivityTimeline";
import { TeamWorkspaceMatrix } from "./workspace/TeamWorkspaceMatrix";
import { RoleMilestoneTracker } from "./workspace/RoleMilestoneTracker";

export function WorkroomWorkspaceDetail({
  onBack,
  activeProjectId,
  activeProjectTitle,
  activePartnerId,
  activePartnerName,
  activePartnerRole,
  activePartnerPhoto,
  hasAcceptedApplicant = false,
  isFocusMode = false,
  setIsFocusMode,
  allProjects = [],
  onSelectProject,
  isUmkm,
  selectedProject,
  selectedProposal,
  projectEscrow,
  detailsLoading = false,
  activeStageTab = "brief",
  setActiveStageTab,
  activeDeliverable,
  projectSubmissions = [],
  projectProposals = [],
  handleOpenSubmission,
  handleApproveWork,
  setSelectedSubmissionForRevision,
  setRevisionModalOpen,
  handleRejectProposal,
  handleAcceptProposal,
  parseCoverLetter,
  onOpenReopenModal,
  onOpenTerminateModal,
  onOpenResignModal,
  onOpenRatingModal,
  onOpenFileDisputeModal,
}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [invoiceModalOpen, setInvoiceModalOpen] = React.useState(false);
  const [handoffModalOpen, setHandoffModalOpen] = React.useState(false);
  const [pendingSubmissionId, setPendingSubmissionId] = React.useState(null);
  const [approvalLoading, setApprovalLoading] = React.useState(false);
  const [downloadingSpk, setDownloadingSpk] = React.useState(false);

  const handleDownloadSpk = async () => {
    const targetProjId =
      activeProjectId || selectedProject?.id || selectedProposal?.project_id;
    if (!targetProjId) return;
    try {
      setDownloadingSpk(true);
      const res = await projectApi.getContractPdf(targetProjId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `SPK_Makarya_${String(targetProjId).slice(0, 8).toUpperCase()}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengunduh SPK PDF:", err);
    } finally {
      setDownloadingSpk(false);
    }
  };

  const effectiveSubmissions = React.useMemo(() => {
    if (projectSubmissions && projectSubmissions.length > 0) {
      return projectSubmissions;
    }
    if (activeDeliverable) {
      return [activeDeliverable];
    }
    return [];
  }, [projectSubmissions, activeDeliverable]);

  const isProjectCompleted = Boolean(
    selectedProject?.status === "DONE" ||
    selectedProject?.status === "COMPLETED" ||
    selectedProposal?.status === "COMPLETED" ||
    selectedProposal?.project_status === "DONE" ||
    selectedProposal?.project_status === "COMPLETED" ||
    activeDeliverable?.status === "APPROVED" ||
    activeDeliverable?.status === "COMPLETED",
  );

  const assignedRoleName = React.useMemo(() => {
    if (selectedProposal?.slot_nama_peran) {
      return selectedProposal.slot_nama_peran;
    }
    const slots = selectedProject?.slots || [];
    if (selectedProposal?.slot_id) {
      const match = slots.find((s) => s.id === selectedProposal.slot_id);
      if (match) return match.nama_peran;
    }
    if (selectedProposal?.mhs_id) {
      const match = slots.find(
        (s) => s.accepted_mhs_id === selectedProposal.mhs_id,
      );
      if (match) return match.nama_peran;
    }
    if (!isUmkm) {
      const match = slots.find(
        (s) =>
          s.accepted_mhs_nama?.toLowerCase().includes("darell") ||
          s.status === "IN_PROGRESS",
      );
      if (match) return match.nama_peran;
    }
    return null;
  }, [selectedProposal, selectedProject, isUmkm]);

  // Client UMKM profile data resolver
  const clientData = React.useMemo(() => {
    const umkmProfile =
      selectedProject?.umkm_profile ||
      selectedProposal?.umkm_profile ||
      selectedProposal?.project?.umkm_profile ||
      {};
    const namaUsaha =
      umkmProfile.nama_usaha ||
      selectedProposal?.project_umkm_nama ||
      selectedProposal?.umkm_nama ||
      (isUmkm ? user?.nama : "Klien UMKM Terdaftar");
    const fotoUsaha =
      umkmProfile.url_foto_usaha ||
      umkmProfile.url_foto ||
      (isUmkm ? user?.url_foto : activePartnerPhoto) ||
      null;
    const kota = umkmProfile.kota || "Indonesia";
    const bidang =
      umkmProfile.bidang_industri ||
      selectedProject?.kategori ||
      "Usaha Mandiri / UMKM";
    const deskripsi =
      umkmProfile.deskripsi_usaha ||
      "Unit usaha mitra UMKM terverifikasi di platform Makarya.";

    return {
      namaUsaha,
      fotoUsaha,
      kota,
      bidang,
      deskripsi,
    };
  }, [selectedProject, selectedProposal, isUmkm, user, activePartnerPhoto]);

  // Student Mahasiswa profile data resolver
  const studentData = React.useMemo(() => {
    const mhsProfile =
      selectedProposal?.mhs_profile ||
      projectProposals.find((p) => p.status === "ACCEPTED")?.mhs_profile ||
      {};
    const parsed = parseCoverLetter
      ? parseCoverLetter(selectedProposal?.cover_letter || "")
      : { tools: [], portfolio: null, text: "" };

    const namaLengkap = isUmkm
      ? mhsProfile.nama_lengkap ||
        selectedProject?.accepted_mhs_nama ||
        activePartnerName ||
        "Mahasiswa Talenta"
      : user?.nama || "Anda (Mahasiswa Pelaksana)";
    const foto = isUmkm
      ? mhsProfile.url_foto ||
        selectedProject?.accepted_mhs_foto ||
        activePartnerPhoto
      : user?.url_foto || null;
    const kampus = mhsProfile.asal_kampus || "Perguruan Tinggi Terakreditasi";
    const prodi = mhsProfile.program_studi || "Talenta Digital";
    const tools =
      parsed.tools.length > 0
        ? parsed.tools
        : ["Figma", "React", "UI/UX", "Tailwind CSS"];
    const portfolio = parsed.portfolio || null;
    const estimasiHari =
      selectedProposal?.estimasi_hari || selectedProject?.estimasi_hari || 14;

    return {
      namaLengkap,
      foto,
      kampus,
      prodi,
      tools,
      portfolio,
      estimasiHari,
    };
  }, [
    selectedProject,
    selectedProposal,
    projectProposals,
    isUmkm,
    user,
    activePartnerName,
    activePartnerPhoto,
    parseCoverLetter,
  ]);

  if (!activeProjectId) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-12 text-center space-y-3 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-indigo mx-auto shadow-xs">
          <ProjectBriefVectorIcon
            size={28}
            className="w-7 h-7 text-brand-indigo"
          />
        </div>
        <h3 className="text-base font-bold text-dark-900">
          Pilih Proyek di Sisi Kiri
        </h3>
        <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
          Pilih salah satu proyek pada daftar navigator untuk membuka ruang
          kerja proyek, memverifikasi berkas deliverable, dan mengelola garansi
          escrow.
        </p>
      </div>
    );
  }

  const handleOpenChat = () => {
    navigate(`/chat/${activeProjectId}`);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/proposals");
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Dedicated Top Navigation & Breadcrumbs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        {/* Left: Mini Navigasi / Breadcrumbs & Tombol Kembali */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted min-w-0">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface border border-border text-dark-900 font-bold hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-brand-indigo font-bold shrink-0">
            {selectedProject?.kategori ||
              selectedProposal?.project_kategori ||
              "Papan Kerja"}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
          <span className="text-slate-600 truncate max-w-[200px] sm:max-w-md hidden sm:inline">
            {activeProjectTitle}
          </span>
        </div>

        {/* Right: Project Switcher Dropdown (If multiple projects) */}
        {allProjects.length > 1 && (
          <div className="relative max-w-full sm:max-w-xs">
            <select
              value={activeProjectId || ""}
              onChange={(e) => {
                const proj = allProjects.find(
                  (p) =>
                    String(p.id) === e.target.value ||
                    String(p.project_id) === e.target.value,
                );
                if (proj && onSelectProject) onSelectProject(proj);
              }}
              className="w-full text-xs font-bold py-1.5 px-3 rounded-xl bg-surface border border-border text-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-indigo truncate shadow-2xs cursor-pointer"
            >
              {allProjects.map((p) => {
                const optVal = p.project_id || p.id;
                const optTitle = p.judul || p.project_judul || "Proyek";
                return (
                  <option key={p.id} value={optVal}>
                    {optTitle}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>

      {/* 2. Real-time Project Health & Pipeline HUD */}
      <WorkspaceProjectHUD
        project={selectedProject || selectedProposal}
        projectEscrow={projectEscrow}
        activeDeliverable={activeDeliverable}
        isUmkm={isUmkm}
        onPingProgress={handleOpenChat}
        isProjectCompleted={isProjectCompleted}
      />

      {/* 3. Sleek, Apple-inspired Main Workspace Dashboard Card */}
      <div className="bg-surface rounded-3xl border border-border p-4 sm:p-6 shadow-xs space-y-4">
        {/* Row 1: Clean Project Title & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          {/* Left: Project Title & Contextual Meta */}
          <div className="space-y-1 min-w-0">
            <h2 className="text-base sm:text-xl font-extrabold text-dark-900 leading-snug break-words">
              {activeProjectTitle}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted flex-wrap">
              <span className="font-bold text-dark-900">
                {clientData.namaUsaha}
              </span>
              <span className="text-slate-300">/</span>
              <span className="font-extrabold text-emerald-700">
                {formatCurrency(
                  isUmkm
                    ? selectedProject?.budget_max
                    : selectedProposal?.harga_tawar ||
                        selectedProject?.budget_max,
                )}
              </span>
              <span className="text-slate-300">/</span>
              <span>
                {selectedProject?.tipe_kolaborasi === "TIM" ||
                (selectedProject?.slots && selectedProject.slots.length > 0)
                  ? `Tim (${selectedProject?.slots?.length || 0} Peran)`
                  : "Individu"}
              </span>
              {isProjectCompleted && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="font-bold text-emerald-700">
                    Lunas & Selesai
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: Primary Chat CTA & Secondary Actions */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            {/* Direct Obrolan Button */}
            <Button
              variant="brand"
              size="sm"
              onClick={handleOpenChat}
              className="text-xs font-bold shadow-brand py-1.5 px-3.5 flex items-center gap-2"
              title="Buka Ruang Obrolan Realtime Proyek"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Buka Obrolan</span>
            </Button>

            {/* Faktur Escrow */}
            <button
              type="button"
              onClick={() => setInvoiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas border border-border text-dark-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              title="Cetak Faktur Bukti Transaksi Escrow Resmi"
            >
              <FileText className="w-3.5 h-3.5 text-brand-indigo" />
              <span>Faktur</span>
            </button>

            {/* Mediasi Sengketa */}
            {onOpenFileDisputeModal &&
              hasAcceptedApplicant &&
              !isProjectCompleted && (
                <button
                  type="button"
                  onClick={onOpenFileDisputeModal}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-canvas border border-border text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Laporkan Kendala ke Mediasi Makarya"
                >
                  <Scale className="w-3.5 h-3.5" />
                </button>
              )}

            {/* Mode Fokus */}
            {setIsFocusMode && (
              <button
                type="button"
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border text-xs font-bold transition-all ${
                  isFocusMode
                    ? "bg-dark-900 text-white border-dark-900 shadow-xs"
                    : "bg-canvas border-border text-dark-900 hover:bg-slate-100"
                }`}
                title={
                  isFocusMode ? "Keluar Mode Fokus" : "Mode Fokus Layar Penuh"
                }
              >
                {isFocusMode ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Overdue Warning Callout */}
        {!isProjectCompleted &&
          selectedProject?.deadline &&
          isExpired(selectedProject.deadline) && (
            <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs flex flex-col gap-2 text-rose-900">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <span className="font-bold block">
                    Peringatan Tenggat Waktu (
                    {formatDate(selectedProject.deadline)})
                  </span>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    {isUmkm
                      ? "Pengerjaan proyek oleh mahasiswa telah melewati batas tenggat waktu. Anda dapat berdiskusi via obrolan atau membatalkan penugasan."
                      : "Batas waktu pengerjaan telah terlewati. Harap segera serahkan berkas deliverable Anda."}
                  </p>
                </div>
              </div>
            </div>
          )}

        {/* Row 2: Modern Compact Segmented Stage Tabs Capsule */}
        <div className="bg-slate-100/90 p-1 rounded-2xl grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center gap-1 w-full">
          {/* Tab 1: Brief */}
          <button
            type="button"
            onClick={() => setActiveStageTab("brief")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStageTab === "brief"
                ? "bg-white text-dark-900 shadow-2xs"
                : "text-slate-600 hover:text-dark-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Spesifikasi & Brief</span>
          </button>

          {/* Tab 2: Deliverable */}
          <button
            type="button"
            onClick={() => setActiveStageTab("deliverable")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStageTab === "deliverable"
                ? "bg-white text-dark-900 shadow-2xs"
                : "text-slate-600 hover:text-dark-900"
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Deliverable</span>
            {activeDeliverable && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Tab 3: Team / Collaboration */}
          <button
            type="button"
            onClick={() => setActiveStageTab("team")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStageTab === "team"
                ? "bg-white text-dark-900 shadow-2xs"
                : "text-slate-600 hover:text-dark-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              {selectedProject?.tipe_kolaborasi === "TIM" ||
              (selectedProject?.slots && selectedProject.slots.length > 0)
                ? `Formasi Tim (${selectedProject?.slots?.length || 0})`
                : "Profil Kolaborasi"}
            </span>
          </button>

          {/* Tab 4: Applicants (For UMKM) */}
          {isUmkm && (
            <button
              type="button"
              onClick={() => setActiveStageTab("applicants")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeStageTab === "applicants"
                  ? "bg-white text-dark-900 shadow-2xs"
                  : "text-slate-600 hover:text-dark-900"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Pelamar ({projectProposals.length})</span>
            </button>
          )}

          {/* Tab 5: Audit Timeline */}
          <button
            type="button"
            onClick={() => setActiveStageTab("timeline")}
            className={`col-span-2 sm:col-span-1 px-3 py-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStageTab === "timeline"
                ? "bg-white text-dark-900 shadow-2xs"
                : "text-slate-600 hover:text-dark-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Linimasa Audit</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STAGE TAB: BRIEF & SPESIFIKASI PROYEK */}
      {/* ========================================================================= */}
      {activeStageTab === "brief" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Metric Summary Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-surface p-4 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Kategori & Bidang
                </span>
                <Layers className="w-4 h-4 text-brand-indigo" />
              </div>
              <p className="font-bold text-dark-900 text-sm truncate">
                {selectedProject?.kategori ||
                  selectedProposal?.project_kategori ||
                  "Desain Kreatif"}
              </p>
              <span className="text-[10px] text-muted block">
                Target industri UMKM
              </span>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Posisi Kontrak
                </span>
                <Briefcase className="w-4 h-4 text-brand-indigo" />
              </div>
              <p className="font-bold text-brand-indigo text-sm truncate">
                {assignedRoleName ||
                  (selectedProject?.tipe_kolaborasi === "TIM"
                    ? "Anggota Tim Proyek"
                    : "Pelaksana Utama")}
              </p>
              <span className="text-[10px] text-muted block">
                {selectedProject?.tipe_kolaborasi === "TIM"
                  ? "Multi-Talenta Tim"
                  : "Pengerjaan Individu"}
              </span>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Garansi Escrow
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="font-extrabold text-dark-900 text-sm">
                {formatCurrency(
                  isUmkm
                    ? selectedProject?.budget_max
                    : selectedProposal?.harga_tawar ||
                        selectedProject?.budget_max,
                )}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                100% Saldo Diamankan
              </span>
            </div>

            <div className="bg-surface p-4 rounded-2xl border border-border shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Tenggat Pengerjaan
                </span>
                <Clock className="w-4 h-4 text-brand-indigo" />
              </div>
              <p className="font-bold text-dark-900 text-sm">
                {selectedProject?.deadline
                  ? formatDate(selectedProject.deadline)
                  : "Ditentukan Klien"}
              </p>
              <span className="text-[10px] text-muted block">
                Durasi waktu kerja
              </span>
            </div>
          </div>

          {/* Full Project Brief Requirements */}
          <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-indigo" />
                  <span>Brief & Spesifikasi Kebutuhan Klien UMKM</span>
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Panduan acuan pengerjaan yang disepakati untuk deliverable
                  proyek
                </p>
              </div>
              {isUmkm && (
                <Link
                  to={`/projects/${selectedProject?.id}`}
                  className="text-xs font-bold text-brand-indigo hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Halaman Eksplorasi</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-border space-y-3">
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                Deskripsi Lengkap Kebutuhan
              </span>
              <p className="text-xs text-dark-900 leading-relaxed whitespace-pre-wrap">
                {selectedProject?.deskripsi_raw ||
                  selectedProposal?.project_deskripsi ||
                  "Brief kebutuhan proyek resmi yang diterbitkan oleh klien UMKM."}
              </p>
            </div>

            {/* Formasi Peran & Alokasi Pagu Anggaran Awal Klien */}
            {selectedProject?.tipe_kolaborasi === "TIM" ||
            (selectedProject?.slots && selectedProject.slots.length > 0) ? (
              <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-border space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-indigo" />
                    <div>
                      <h4 className="text-xs font-bold text-dark-900">
                        Alokasi Pagu & Honor Formasi Tim Awal Klien
                      </h4>
                      <p className="text-[10px] text-muted">
                        Pembagian honor dan tanggung jawab spesifik per talenta
                        sesuai rancangan awal proyek oleh Klien UMKM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted uppercase">
                      Total Pagu:
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                      {formatCurrency(
                        selectedProject?.budget_max ||
                          selectedProposal?.project_budget_max ||
                          0,
                      )}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {(selectedProject?.slots || []).map((slot, sIdx) => {
                    const isMySlot =
                      !isUmkm &&
                      ((selectedProposal?.slot_id &&
                        slot.id === selectedProposal.slot_id) ||
                        (assignedRoleName &&
                          slot.nama_peran?.toLowerCase() ===
                            assignedRoleName?.toLowerCase()));
                    const isCompleted = slot.status === "COMPLETED";
                    const isFilled =
                      slot.status === "IN_PROGRESS" ||
                      slot.status === "COMPLETED" ||
                      slot.accepted_mhs_id;

                    return (
                      <div
                        key={slot.id || sIdx}
                        className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                          isMySlot
                            ? "bg-brand-indigo/5 border-brand-indigo/40 ring-1 ring-brand-indigo/20"
                            : "bg-surface border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${isCompleted ? "bg-emerald-500" : isFilled ? "bg-blue-500" : "bg-slate-300"}`}
                            />
                            <span className="text-xs font-bold text-dark-900 truncate">
                              {slot.nama_peran}
                            </span>
                            {isMySlot && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-brand-indigo text-white shrink-0">
                                Peran Anda
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-extrabold text-emerald-700 font-mono shrink-0">
                            {formatCurrency(slot.alokasi_budget)}
                          </span>
                        </div>

                        {slot.deskripsi_tugas && (
                          <p className="text-[11px] text-muted leading-relaxed line-clamp-2">
                            {slot.deskripsi_tugas}
                          </p>
                        )}

                        <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[10px] text-slate-500">
                          <span>
                            {slot.accepted_mhs_nama ? (
                              <strong className="text-dark-900 font-semibold">
                                {slot.accepted_mhs_nama}
                              </strong>
                            ) : isFilled ? (
                              "Talenta Terpilih"
                            ) : (
                              "Menunggu Pelamar"
                            )}
                          </span>
                          <span
                            className={`font-semibold ${isCompleted ? "text-emerald-700" : isFilled ? "text-blue-700" : "text-slate-400"}`}
                          >
                            {isCompleted
                              ? "Selesai & Lunas"
                              : isFilled
                                ? "Pengerjaan Aktif"
                                : "Slot Terbuka"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-canvas p-4 sm:p-5 rounded-2xl border border-border space-y-2">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-dark-900">
                      Pagu Anggaran & Honor Pelaksana Proyek
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                    {formatCurrency(
                      isUmkm
                        ? selectedProject?.budget_max
                        : selectedProposal?.harga_tawar ||
                            selectedProject?.budget_max ||
                            0,
                    )}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Pengerjaan proyek berbasis individu dengan pagu kompensasi
                  tunggal yang telah disetujui bersama antara Klien UMKM dan
                  Mahasiswa Pelaksana.
                </p>
              </div>
            )}

            {/* Quality Standard & Intellectual Property Protection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-canvas border border-border space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-dark-900">
                    Peralihan Hak Cipta (IP Transfer)
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Seluruh hak cipta dan kepemilikan intelektual atas deliverable
                  karya beralih secara penuh dan eksklusif kepada Klien UMKM
                  setelah pelunasan dana escrow disetujui.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-canvas border border-border space-y-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-brand-indigo shrink-0" />
                  <span className="text-xs font-bold text-dark-900">
                    Ketentuan Garansi & Revisi
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Klien berhak mengajukan revisi terstruktur sesuai brief awal.
                  Jika klien tidak memberikan tinjauan dalam 7 hari setelah
                  submisi, escrow akan otomatis dicairkan sistem demi kepastian
                  talenta.
                </p>
              </div>
            </div>
          </div>

          {/* Proposal Cover Letter if Student view */}
          {!isUmkm &&
            selectedProposal &&
            (() => {
              const parsed = parseCoverLetter(selectedProposal.cover_letter);
              return (
                <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-3.5">
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-indigo" />
                      <span>Surat Lamaran & Rencana Pengerjaan Anda</span>
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      Proposal penawaran yang telah disetujui oleh Klien UMKM
                    </p>
                  </div>

                  <div className="bg-canvas p-4 rounded-2xl border border-border space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                        Penjelasan Pendekatan Pengerjaan
                      </span>
                      <p className="text-dark-900/90 whitespace-pre-wrap leading-relaxed">
                        {parsed.text}
                      </p>
                    </div>

                    {parsed.tools.length > 0 && (
                      <div className="pt-2 border-t border-border/60">
                        <span className="text-[10px] font-bold text-muted uppercase block mb-1.5">
                          Perangkat & Keahlian yang Diajukan:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {parsed.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-2.5 py-0.5 rounded-lg bg-brand-indigo/10 text-brand-indigo font-bold text-[10px] border border-brand-indigo/20"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.portfolio && (
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted uppercase">
                          Tautan Portofolio Pendukung:
                        </span>
                        <a
                          href={parsed.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-xs text-brand-indigo hover:underline"
                        >
                          <span>Buka Tautan Portofolio</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

          {/* Contract & Escrow Management Actions */}
          <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-dark-900">
                  Manajemen Kontrak & Garansi Escrow
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Dokumen legalitas kesepakatan kerja dan jaminan saldo escrow
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            {/* Official SPK Contract & Receipt Downloads */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-indigo-950 dark:text-indigo-200 block text-xs mb-0.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-indigo" />
                  <span>Surat Perjanjian Kerja Sama (SPK) Digital</span>
                </span>
                <p className="text-[11px] text-indigo-900/70 dark:text-indigo-300/80 leading-relaxed">
                  Dokumen resmi ber-watermark Makarya yang memuat butir
                  kesepakatan, batasan revisi maksimal 2x, garansi escrow, dan
                  tanda tangan sistem.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDownloadSpk}
                  loading={downloadingSpk}
                  className="text-xs font-bold shadow-xs bg-brand-indigo hover:bg-brand-indigo/90 text-white"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Unduh SPK (PDF)
                </Button>
                {isUmkm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInvoiceModalOpen(true)}
                    className="text-xs font-bold border-indigo-200 text-indigo-900 dark:text-indigo-200 dark:border-indigo-800"
                  >
                    <Coins className="w-3.5 h-3.5 mr-1.5" />
                    Resi Escrow
                  </Button>
                )}
              </div>
            </div>

            {isUmkm && selectedProject?.status === "IN_PROGRESS" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-canvas border border-border flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-bold text-dark-900 block text-xs mb-1">
                      Ganti Mahasiswa (Buka ke Eksplorasi)
                    </span>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Jika mahasiswa tidak merespons atau berhalangan
                      melanjutkan, batalkan penugasan ini. Dana escrow otomatis
                      kembali ke Saldo Aktif Anda dan proyek dibuka kembali
                      untuk pelamar baru.
                    </p>
                  </div>
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={onOpenReopenModal}
                    className="text-xs font-bold w-full shadow-brand"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Buka Kembali ke Eksplorasi
                  </Button>
                </div>

                <div className="p-4 rounded-2xl bg-canvas border border-border flex flex-col justify-between gap-3">
                  <div>
                    <span className="font-bold text-dark-900 block text-xs mb-1">
                      Batalkan Proyek Permanen
                    </span>
                    <p className="text-[11px] text-muted leading-relaxed">
                      Hentikan seluruh pengerjaan proyek. Status proyek akan
                      menjadi Dibatalkan (CANCELLED) dan 100% saldo escrow
                      dikembalikan ke Saldo Aktif Anda.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenTerminateModal}
                    className="text-xs font-bold w-full text-rose-600 border-rose-200 hover:bg-rose-50"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Batalkan Proyek
                  </Button>
                </div>
              </div>
            )}

            {!isUmkm && selectedProposal?.status === "ACCEPTED" && (
              <div className="p-4 rounded-2xl bg-canvas border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-dark-900 block text-xs mb-0.5">
                    Ajukan Pengunduran Diri dari Proyek
                  </span>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Jika Anda menghadapi kendala tak terduga yang menghalangi
                    penyelesaian proyek, Anda dapat mengajukan pengunduran diri
                    secara resmi. Dana escrow akan dikembalikan utuh ke klien
                    UMKM.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenResignModal}
                  className="text-xs font-bold shrink-0 text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1.5" />
                  Pengunduran Diri
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE TAB: DELIVERABLE & BERKAS HASIL KERJA */}
      {/* ========================================================================= */}
      {activeStageTab === "deliverable" && (
        <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-brand-indigo" />
                <span>Pusat Deliverable & Submisi Hasil Kerja</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Tinjau berkas pengerjaan, beri catatan revisi, atau setujui
                untuk mencairkan honor escrow
              </p>
            </div>
            {!isUmkm && !isProjectCompleted && (
              <Button
                variant="brand"
                size="sm"
                onClick={() =>
                  handleOpenSubmission(selectedProposal?.project_id)
                }
                className="text-xs font-bold shadow-brand"
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                <span>
                  {effectiveSubmissions.some(
                    (s) =>
                      s.proposal_id === selectedProposal?.id ||
                      s.submitter_name === user?.nama,
                  )
                    ? `Perbarui Berkas (${assignedRoleName || "Saya"})`
                    : `Unggah Deliverable (${assignedRoleName || "Saya"})`}
                </span>
              </Button>
            )}
          </div>

          {/* Interactive Role Milestone Tracker */}
          <RoleMilestoneTracker
            projectId={activeProjectId}
            roleName={assignedRoleName}
            slots={selectedProject?.slots || []}
            category={
              selectedProject?.kategori || selectedProposal?.project_kategori
            }
            isUmkm={isUmkm}
            isProjectCompleted={isProjectCompleted}
          />

          {effectiveSubmissions.length > 0 ? (
            <div className="space-y-4">
              {effectiveSubmissions.map((sub, idx) => (
                <SmartDeliverableCard
                  key={sub.id || idx}
                  submission={sub}
                  escrow={projectEscrow}
                  isUmkm={isUmkm}
                  isProjectCompleted={isProjectCompleted}
                  onRequestRevision={(item) => {
                    setSelectedSubmissionForRevision(item || sub);
                    setRevisionModalOpen(true);
                  }}
                  onApprove={(item) => {
                    setPendingSubmissionId(item?.id || sub?.id);
                    setHandoffModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : detailsLoading ? (
            <div className="p-8 text-center bg-canvas rounded-2xl border border-border space-y-3 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-slate-200 mx-auto" />
              <div className="h-4 bg-slate-200 rounded w-48 mx-auto" />
              <div className="h-3 bg-slate-200 rounded w-64 mx-auto" />
            </div>
          ) : isProjectCompleted ? (
            <div className="p-8 text-center bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-emerald-950">
                Deliverable Telah Disetujui & Proyek Selesai!
              </h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto leading-relaxed">
                Pekerjaan pada proyek ini telah selesai dan honor 100% telah
                dicairkan ke dompet mahasiswa.
              </p>
            </div>
          ) : (
            <div className="p-8 text-center bg-canvas rounded-2xl border border-border space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-muted mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-dark-900">
                  {isUmkm
                    ? "Mahasiswa Sedang Mengerjakan Proyek"
                    : "Belum Ada Berkas Deliverable"}
                </h4>
                <p className="text-[11px] text-muted max-w-sm mx-auto mt-1 leading-relaxed">
                  {isUmkm
                    ? "Begitu mahasiswa mengunggah tautan hasil kerja (Figma, GitHub, atau Google Drive), berkas akan otomatis muncul di sini untuk Anda verifikasi."
                    : "Setelah pengerjaan selesai sesuai brief, serahkan tautan hasil kerja Anda agar dapat diperiksa klien dan honor escrow dicairkan."}
                </p>
              </div>

              {!isUmkm && (
                <Button
                  variant="brand"
                  size="sm"
                  onClick={() =>
                    handleOpenSubmission(selectedProposal.project_id)
                  }
                  className="text-xs font-bold shadow-brand mt-2"
                >
                  <UploadCloud className="w-3.5 h-3.5 mr-1" />
                  Serahkan Berkas Deliverable Sekarang
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE TAB: PROFIL KOLABORASI & FORMASI TIM */}
      {/* ========================================================================= */}
      {activeStageTab === "team" && (
        <div className="animate-in fade-in duration-200">
          {selectedProject?.tipe_kolaborasi === "TIM" ||
          (selectedProject?.slots && selectedProject.slots.length > 0) ? (
            <TeamWorkspaceMatrix
              project={selectedProject}
              isUmkm={isUmkm}
              onApproveSlot={(slot) => {
                setPendingSubmissionId(activeDeliverable?.id);
                setHandoffModalOpen(true);
              }}
            />
          ) : (
            /* Comprehensive Duo Collaboration View (UMKM Client + Student Talent) */
            <div className="space-y-4">
              {/* Header Card */}
              <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-indigo" />
                      <span>Formasi Kemitraan Proyek (Duo Kolaborasi)</span>
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      Rincian identitas dan peran kerja antara Klien Pemberi
                      Kerja dan Mahasiswa Pelaksana
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kolaborasi Terproteksi Escrow</span>
                  </div>
                </div>

                {/* Two Rich Profile Cards (Client & Student) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Card 1: Klien Pemberi Kerja (UMKM) */}
                  <div className="p-5 rounded-2xl bg-canvas border border-border space-y-4 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                          Pemberi Kerja / Klien Usaha
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Klien Terverifikasi
                        </span>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <Avatar
                          src={clientData.fotoUsaha}
                          name={clientData.namaUsaha}
                          role="UMKM"
                          size="xl"
                          className="rounded-2xl"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-extrabold text-dark-900 text-sm sm:text-base leading-tight">
                            {clientData.namaUsaha}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{clientData.bidang}</span>
                            </span>
                            <span className="text-slate-300">/</span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{clientData.kota}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted leading-relaxed line-clamp-2 bg-surface p-3 rounded-xl border border-border/70">
                        {clientData.deskripsi}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px]">
                        <span className="text-muted block">
                          Peran dalam Proyek:
                        </span>
                        <span className="font-bold text-dark-900">
                          Penanggung Jawab Brief & Owner
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleOpenChat}
                        className="text-xs font-bold border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/5 flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Kirim Pesan</span>
                      </Button>
                    </div>
                  </div>

                  {/* Card 2: Mahasiswa Pelaksana (Talenta) */}
                  <div className="p-5 rounded-2xl bg-canvas border border-border space-y-4 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                          Pelaksana Kerja Terpilih
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Talenta Ditugaskan
                        </span>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <Avatar
                          src={studentData.foto}
                          name={studentData.namaLengkap}
                          role="MHS"
                          size="xl"
                          className="rounded-2xl"
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-dark-900 text-sm sm:text-base leading-tight">
                              {studentData.namaLengkap}
                            </h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
                            <span className="inline-flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{studentData.kampus}</span>
                            </span>
                            <span className="text-slate-300">/</span>
                            <span className="font-medium text-brand-indigo">
                              {studentData.prodi}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Keahlian & Tools */}
                      <div className="space-y-1.5 bg-surface p-3 rounded-xl border border-border/70">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                          Posisi:{" "}
                          <strong className="text-dark-900">
                            {assignedRoleName || "Pelaksana Utama"}
                          </strong>
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {studentData.tools.map((tool, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-brand-indigo/10 text-brand-indigo font-bold text-[10.5px] border border-brand-indigo/20"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px]">
                        <span className="text-muted block">Honor & Waktu:</span>
                        <span className="font-extrabold text-emerald-700">
                          {formatCurrency(
                            isUmkm
                              ? selectedProject?.budget_max
                              : selectedProposal?.harga_tawar,
                          )}
                          <span className="text-muted font-normal">
                            {" "}
                            ({studentData.estimasiHari} Hari)
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {studentData.portfolio && (
                          <a
                            href={studentData.portfolio}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border text-dark-900 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs"
                          >
                            <span>Portofolio</span>
                            <ExternalLink className="w-3 h-3 text-muted" />
                          </a>
                        )}
                        <Button
                          variant="brand"
                          size="sm"
                          onClick={handleOpenChat}
                          className="text-xs font-bold shadow-brand flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Buka Chat</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hub Saluran Kolaborasi & Aset Bersama */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                        Saluran Kolaborasi & Tautan Kerja Bersama
                      </h4>
                      <p className="text-[11px] text-muted">
                        Akses repositori, kanvas desain, dan folder berkas
                        proyek
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Figma */}
                    <div className="p-4 rounded-2xl bg-canvas border border-border hover:border-purple-300 transition-colors space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                          <Palette className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          Desain UI/UX
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-dark-900 block text-xs">
                          Kanvas Figma Proyek
                        </span>
                        <p className="text-[11px] text-muted line-clamp-1">
                          File mockups, wireframe & aset desain
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenChat}
                        className="text-[11px] font-bold text-brand-indigo hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <span>Minta Tautan di Chat</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {/* GitHub Repo */}
                    <div className="p-4 rounded-2xl bg-canvas border border-border hover:border-blue-300 transition-colors space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                          <FileCode className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Source Code
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-dark-900 block text-xs">
                          GitHub / Codebase
                        </span>
                        <p className="text-[11px] text-muted line-clamp-1">
                          Repositori kode sumber & pull request
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenChat}
                        className="text-[11px] font-bold text-brand-indigo hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <span>Minta Tautan di Chat</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Google Drive */}
                    <div className="p-4 rounded-2xl bg-canvas border border-border hover:border-amber-300 transition-colors space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                          <FolderArchive className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Penyimpanan
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-dark-900 block text-xs">
                          Google Drive Assets
                        </span>
                        <p className="text-[11px] text-muted line-clamp-1">
                          Logo resolusi tinggi & materi mentah
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenChat}
                        className="text-[11px] font-bold text-brand-indigo hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <span>Minta Tautan di Chat</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Standar Respon & Komunikasi */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-dark-900 block">
                        Standar Kerja Sama & Garansi Keamanan
                      </span>
                      <span className="text-[11px] text-muted">
                        Kedua belah pihak wajib merespons pesan dalam 1x24 jam
                        kerja dan transaksi diawasi oleh sistem Escrow Makarya.
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="brand"
                    size="sm"
                    onClick={handleOpenChat}
                    className="text-xs font-bold shrink-0 shadow-brand"
                  >
                    Mulai Diskusi di Chat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE TAB: PELAMAR MASUK (KHUSUS UMKM) */}
      {/* ========================================================================= */}
      {activeStageTab === "applicants" && isUmkm && (
        <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-indigo" />
                <span>
                  Pelamar Mahasiswa yang Masuk ({projectProposals.length})
                </span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Tinjau penawaran harga, estimasi waktu, dan portofolio kandidat
                mahasiswa
              </p>
            </div>
            <span className="text-xs text-muted">
              Escrow dikunci setelah memilih kandidat
            </span>
          </div>

          {projectProposals.length === 0 ? (
            <div className="p-8 text-center bg-canvas rounded-2xl border border-border space-y-2">
              <Users className="w-8 h-8 text-muted mx-auto opacity-40" />
              <p className="text-xs font-bold text-dark-900">
                Belum Ada Pelamar Masuk
              </p>
              <p className="text-[11px] text-muted max-w-xs mx-auto">
                Proyek Anda sedang tayang di katalog eksplorasi terbuka untuk
                mahasiswa.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectProposals.map((prop) => {
                const isAccepted = prop.status === "ACCEPTED";
                const isRejected = prop.status === "REJECTED";
                const isWithdrawn = prop.status === "WITHDRAWN";

                return (
                  <div
                    key={prop.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isAccepted
                        ? "bg-emerald-50/20 border-emerald-200 shadow-xs"
                        : isRejected || isWithdrawn
                          ? "bg-canvas border-border opacity-80"
                          : "bg-canvas border-border hover:border-dark-900/30"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={prop.mhs_profile?.url_foto}
                            name={prop.mhs_profile?.nama_lengkap || "Mahasiswa"}
                            role="MHS"
                            size="xs"
                            className="border border-border shadow-xs"
                          />
                          <span className="text-xs font-bold text-dark-900">
                            {prop.mhs_profile?.nama_lengkap ||
                              "Mahasiswa Pelamar"}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2 py-0.5 rounded-md border ${
                              isAccepted
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : isRejected
                                  ? "bg-rose-50 text-rose-800 border-rose-200"
                                  : isWithdrawn
                                    ? "bg-slate-100 text-slate-700 border-slate-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isAccepted
                                  ? "bg-emerald-500"
                                  : isRejected
                                    ? "bg-rose-500"
                                    : isWithdrawn
                                      ? "bg-slate-400"
                                      : "bg-amber-500"
                              }`}
                            />
                            {isAccepted
                              ? "Disetujui"
                              : isRejected
                                ? "Ditolak"
                                : isWithdrawn
                                  ? "Proposal Ditarik"
                                  : "Menunggu Seleksi"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[11px] text-muted font-medium">
                            {prop.mhs_profile?.asal_kampus ||
                              "Perguruan Tinggi Terakreditasi"}
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-[10.5px] font-medium text-slate-700">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            {prop.estimasi_hari} Hari Kerja
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-sm font-extrabold text-dark-900">
                          {formatCurrency(prop.harga_tawar)}
                        </span>
                      </div>
                    </div>

                    {(() => {
                      const parsed = parseCoverLetter(prop.cover_letter);
                      return (
                        <div className="bg-surface p-3.5 rounded-xl border border-border text-xs text-dark-900/90 leading-relaxed mb-3 space-y-2">
                          <div>
                            <span className="font-bold text-dark-900 block mb-0.5">
                              Rencana Pengerjaan Pelamar:
                            </span>
                            <p className="whitespace-pre-wrap">{parsed.text}</p>
                          </div>

                          {parsed.tools.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
                              <span className="text-[10px] font-bold text-muted uppercase">
                                Keahlian:
                              </span>
                              {parsed.tools.map((tool) => (
                                <span
                                  key={tool}
                                  className="px-2 py-0.5 rounded-md bg-brand-indigo/10 text-brand-indigo font-bold text-[10px] border border-brand-indigo/20"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          )}

                          {parsed.portfolio && (
                            <div className="pt-1.5 border-t border-border/60">
                              <a
                                href={parsed.portfolio}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-brand-indigo hover:underline font-bold text-[11px]"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Lihat Portofolio Pelamar</span>
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-border/60">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/chat?talent=${prop.mhs_id}&project=${activeProjectId}`,
                          )
                        }
                        className="text-xs font-bold border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/5 flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Kirim Pesan</span>
                      </Button>

                      {(selectedProject?.status === "OPEN" ||
                        selectedProject?.status === "BIDDING") &&
                        prop.status === "PENDING" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectProposal(prop)}
                              className="text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                            >
                              Tolak
                            </Button>
                            <Button
                              variant="brand"
                              size="sm"
                              onClick={() => handleAcceptProposal(prop)}
                              className="text-xs font-bold shadow-brand"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                              Terima & Kunci Escrow
                            </Button>
                          </>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STAGE TAB: LINIMASA AUDIT & MILESTONES */}
      {/* ========================================================================= */}
      {activeStageTab === "timeline" && (
        <div className="animate-in fade-in duration-200">
          <WorkspaceActivityTimeline
            project={selectedProject || selectedProposal}
            submissions={effectiveSubmissions}
            selectedProposal={selectedProposal}
            isUmkm={isUmkm}
          />
        </div>
      )}

      {/* Official Escrow Invoice Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        project={selectedProject}
        proposal={selectedProposal}
        umkmName={isUmkm ? undefined : activePartnerName}
        mhsName={isUmkm ? activePartnerName : undefined}
      />

      {/* Official Asset Handoff Protocol Modal (Before Escrow Payout) */}
      {(() => {
        const targetSub = effectiveSubmissions.find(
          (s) => s.id === pendingSubmissionId,
        );
        const resolvedRole = targetSub?.role_name || assignedRoleName;
        const resolvedSubmitter =
          targetSub?.submitter_name || (isUmkm ? activePartnerName : undefined);

        let resolvedBudget = 0;
        if (targetSub?.honor_amount || targetSub?.slot_budget) {
          resolvedBudget = targetSub.honor_amount || targetSub.slot_budget;
        } else if (resolvedRole && selectedProject?.slots) {
          const matchedSlot = selectedProject.slots.find(
            (s) => s.nama_peran?.toLowerCase() === resolvedRole?.toLowerCase(),
          );
          if (matchedSlot?.alokasi_budget) {
            resolvedBudget = matchedSlot.alokasi_budget;
          }
        }

        if (!resolvedBudget) {
          if (isUmkm) {
            if (
              selectedProject?.tipe_kolaborasi === "TIM" &&
              selectedProject?.slots?.length > 0
            ) {
              resolvedBudget = selectedProject.slots[0].alokasi_budget;
            } else {
              resolvedBudget = selectedProject?.budget_max || 0;
            }
          } else {
            resolvedBudget =
              selectedProposal?.harga_tawar || selectedProject?.budget_max || 0;
          }
        }

        return (
          <AssetHandoffModal
            isOpen={handoffModalOpen}
            onClose={() => setHandoffModalOpen(false)}
            onConfirm={async () => {
              try {
                setApprovalLoading(true);
                if (handleApproveWork && pendingSubmissionId) {
                  await handleApproveWork(pendingSubmissionId);
                }
                setHandoffModalOpen(false);
              } finally {
                setApprovalLoading(false);
              }
            }}
            projectTitle={activeProjectTitle}
            roleName={resolvedRole}
            submitterName={resolvedSubmitter}
            budgetAmount={resolvedBudget}
            loading={approvalLoading}
          />
        );
      })()}
    </div>
  );
}
