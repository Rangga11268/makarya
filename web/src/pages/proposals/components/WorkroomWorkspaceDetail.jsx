import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { Button } from "../../../components/ui/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate, isExpired } from "../../../utils/formatDate";
import { ProjectBriefVectorIcon } from "../../../components/icons/ProjectVectorIcon";
import {
  MessageSquare,
  FileCheck2,
  Users,
  FileText,
  AlertCircle,
  Maximize2,
  Minimize2,
  ArrowLeft,
  ChevronRight,
  Scale,
  Briefcase,
  Clock,
} from "lucide-react";

import { InvoiceReceiptModal } from "../../../components/features/InvoiceReceiptModal";
import { projectApi } from "../../../api";
import { WorkspaceProjectHUD } from "./workspace/WorkspaceProjectHUD";
import { AssetHandoffModal } from "./workspace/AssetHandoffModal";
import { WorkspaceActivityTimeline } from "./workspace/WorkspaceActivityTimeline";
import { WorkroomBriefTab } from "./workspace/WorkroomBriefTab";
import { WorkroomDeliverablesTab } from "./workspace/WorkroomDeliverablesTab";
import { WorkroomCollaborationTab } from "./workspace/WorkroomCollaborationTab";
import { WorkroomApplicantsTab } from "./workspace/WorkroomApplicantsTab";

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

      {/* 3. Sleek, Main Workspace Dashboard Card */}
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

            <button
              type="button"
              onClick={() => setInvoiceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas border border-border text-dark-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              title="Cetak Faktur Bukti Transaksi Escrow Resmi"
            >
              <FileText className="w-3.5 h-3.5 text-brand-indigo" />
              <span>Faktur</span>
            </button>

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

      {/* TAB 1: BRIEF */}
      {activeStageTab === "brief" && (
        <WorkroomBriefTab
          selectedProject={selectedProject}
          selectedProposal={selectedProposal}
          isUmkm={isUmkm}
          assignedRoleName={assignedRoleName}
          parseCoverLetter={parseCoverLetter}
          handleDownloadSpk={handleDownloadSpk}
          downloadingSpk={downloadingSpk}
          setInvoiceModalOpen={setInvoiceModalOpen}
          onOpenReopenModal={onOpenReopenModal}
          onOpenTerminateModal={onOpenTerminateModal}
          onOpenResignModal={onOpenResignModal}
        />
      )}

      {/* TAB 2: DELIVERABLE */}
      {activeStageTab === "deliverable" && (
        <WorkroomDeliverablesTab
          activeProjectId={activeProjectId}
          assignedRoleName={assignedRoleName}
          selectedProject={selectedProject}
          selectedProposal={selectedProposal}
          isUmkm={isUmkm}
          isProjectCompleted={isProjectCompleted}
          effectiveSubmissions={effectiveSubmissions}
          detailsLoading={detailsLoading}
          projectEscrow={projectEscrow}
          user={user}
          handleOpenSubmission={handleOpenSubmission}
          setSelectedSubmissionForRevision={setSelectedSubmissionForRevision}
          setRevisionModalOpen={setRevisionModalOpen}
          setPendingSubmissionId={setPendingSubmissionId}
          setHandoffModalOpen={setHandoffModalOpen}
        />
      )}

      {/* TAB 3: TEAM / COLLABORATION */}
      {activeStageTab === "team" && (
        <WorkroomCollaborationTab
          selectedProject={selectedProject}
          selectedProposal={selectedProposal}
          isUmkm={isUmkm}
          assignedRoleName={assignedRoleName}
          clientData={clientData}
          studentData={studentData}
          handleOpenChat={handleOpenChat}
          setPendingSubmissionId={setPendingSubmissionId}
          setHandoffModalOpen={setHandoffModalOpen}
          activeDeliverable={activeDeliverable}
        />
      )}

      {/* TAB 4: APPLICANTS (UMKM ONLY) */}
      {activeStageTab === "applicants" && isUmkm && (
        <WorkroomApplicantsTab
          projectProposals={projectProposals}
          selectedProject={selectedProject}
          activeProjectId={activeProjectId}
          parseCoverLetter={parseCoverLetter}
          handleRejectProposal={handleRejectProposal}
          handleAcceptProposal={handleAcceptProposal}
        />
      )}

      {/* TAB 5: TIMELINE */}
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
