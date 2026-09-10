import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { proposalApi, projectApi, submissionApi, walletApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { useAlertStore } from "../../store/alertStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SubmissionModal } from "../../components/features/SubmissionModal";
import { RatingModal } from "../../components/features/RatingModal";
import { RevisionModal } from "../../components/features/RevisionModal";
import {
  ReopenProjectModal,
  TerminateProjectModal,
  ResignProposalModal,
} from "./components/ContractActionModals";
import { ProposalSidebarItem } from "./components/ProposalSidebarItem";
import { WorkroomWorkspaceDetail } from "./components/WorkroomWorkspaceDetail";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import {
  ArrowRight,
  Search,
  Wallet as WalletIcon,
  Building2,
  GraduationCap,
} from "lucide-react";

function parseCoverLetter(rawText) {
  if (!rawText) return { text: "", tools: [], portfolio: null };

  let text = rawText;
  let tools = [];
  let portfolio = null;

  // Extract tools
  const toolsMatch = text.match(/\[Tools & Keahlian:\s*([^\]]+)\]/i);
  if (toolsMatch) {
    tools = toolsMatch[1]
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    text = text.replace(toolsMatch[0], "").trim();
  }

  // Extract portfolio
  const portMatch = text.match(/\[Tautan Portofolio Pendukung:\s*([^\]]+)\]/i);
  if (portMatch) {
    portfolio = portMatch[1].trim();
    text = text.replace(portMatch[0], "").trim();
  }

  return { text, tools, portfolio };
}

export function ProposalBoardPage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const { showConfirm, showSuccess, showError } = useAlertStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const isUmkm = user?.role === "UMKM";

  // Data states
  const [proposals, setMyProposals] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [projectProposals, setProjectProposals] = useState([]);
  const [projectSubmissions, setProjectSubmissions] = useState([]);
  const [mhsSubmissions, setMhsSubmissions] = useState({});
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Stage Sub-tab: 'chat' | 'deliverable' | 'brief' | 'applicants'
  const [activeStageTab, setActiveStageTab] = useState("brief");
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Modals
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedSubmissionForRevision, setSelectedSubmissionForRevision] =
    useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [resignModalOpen, setResignModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Initial Data Loading
  const loadData = async () => {
    try {
      setLoading(true);

      // Load wallet data
      walletApi
        .getMe()
        .then((res) => setWallet(res.data))
        .catch(() => {});

      const targetProjectId = searchParams.get("project");

      if (isUmkm) {
        const res = await projectApi.getMyProjects();
        setMyProjects(res.data);

        if (res.data.length > 0) {
          let chosen = res.data[0];
          if (targetProjectId) {
            const found = res.data.find((p) => p.id === targetProjectId);
            if (found) chosen = found;
          }
          setSelectedProject(chosen);
          const details = await loadProjectDetails(chosen.id);
          const hasAccepted = details.proposals.some(
            (p) => p.status === "ACCEPTED",
          );
          if (hasAccepted) {
            setActiveStageTab("chat");
          } else if (details.proposals.length > 0) {
            setActiveStageTab("applicants");
          } else {
            setActiveStageTab("brief");
          }
        }
      } else {
        const res = await proposalApi.getMyProposals();
        setMyProposals(res.data);

        // Load submission for accepted proposals
        const accepted = res.data.filter((p) => p.status === "ACCEPTED");
        const subMap = {};
        await Promise.all(
          accepted.map(async (p) => {
            try {
              const subRes = await submissionApi.getByProject(p.project_id);
              if (subRes.data) {
                subMap[p.project_id] = subRes.data;
              }
            } catch (e) {
              // Not submitted yet
            }
          }),
        );
        setMhsSubmissions(subMap);

        if (res.data.length > 0) {
          let chosen = res.data[0];
          if (targetProjectId) {
            const found = res.data.find(
              (p) => p.project_id === targetProjectId,
            );
            if (found) chosen = found;
          }
          setSelectedProposal(chosen);
          if (chosen.status === "ACCEPTED") {
            setActiveStageTab("chat");
          } else {
            setActiveStageTab("brief");
          }
        }
      }
    } catch (err) {
      console.error("Gagal memuat papan kerja:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async (projectId) => {
    try {
      const [propRes, subRes] = await Promise.all([
        proposalApi.getByProject(projectId).catch(() => ({ data: [] })),
        submissionApi.getByProject(projectId).catch(() => ({ data: null })),
      ]);
      const props = Array.isArray(propRes.data) ? propRes.data : [];
      setProjectProposals(props);
      const subs =
        subRes.data && subRes.data.id
          ? [subRes.data]
          : Array.isArray(subRes.data)
            ? subRes.data
            : [];
      setProjectSubmissions(subs);
      return { proposals: props, submissions: subs };
    } catch (err) {
      console.warn("Gagal memuat rincian proyek:", err);
      return { proposals: [], submissions: [] };
    }
  };

  useEffect(() => {
    loadData();
  }, [isUmkm]);

  // Handle UMKM selecting another project from left list
  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setSearchParams({ project: project.id });
    const details = await loadProjectDetails(project.id);
    const hasAccepted = details.proposals.some(
      (p) => p.status === "ACCEPTED",
    );
    if (hasAccepted) {
      setActiveStageTab("chat");
    } else if (details.proposals.length > 0) {
      setActiveStageTab("applicants");
    } else {
      setActiveStageTab("brief");
    }
  };

  // Handle Mahasiswa selecting another proposal from left list
  const handleSelectProposal = (proposal) => {
    setSelectedProposal(proposal);
    setSearchParams({ project: proposal.project_id });
    setActiveStageTab("chat");
  };

  // UMKM: Accept Proposal Action
  const handleAcceptProposal = (proposal) => {
    showConfirm(
      "Terima Proposal & Kunci Escrow?",
      `Anda akan memilih tawaran ${formatCurrency(
        proposal.harga_tawar,
      )}. Saldo escrow Anda akan diamankan untuk proyek ini hingga mahasiswa menyelesaikan tugas.`,
      async () => {
        try {
          await proposalApi.accept(proposal.id);
          showSuccess(
            "Proposal Berhasil Diterima!",
            "Proyek kini beralih ke status Dalam Pengerjaan (IN_PROGRESS).",
          );
          await loadData();
          setActiveStageTab("chat");
        } catch (err) {
          const msg = err.response?.data?.detail || "Gagal menerima proposal.";
          showError("Gagal Menerima Proposal", msg);
        }
      },
    );
  };

  // UMKM: Reject Proposal Action
  const handleRejectProposal = (proposal) => {
    showConfirm(
      "Tolak Proposal Ini?",
      "Proposal yang ditolak tidak dapat diubah kembali.",
      async () => {
        try {
          await proposalApi.reject(proposal.id);
          addToast("Proposal pelamar telah ditolak.", "info");
          await loadData();
        } catch (err) {
          addToast("Gagal menolak proposal.", "error");
        }
      },
      null,
      true,
    );
  };

  // UMKM: Approve Work & Release Escrow
  const handleApproveWork = (submissionId) => {
    showConfirm(
      "Setujui Hasil Kerja & Cairkan Honor?",
      "Setelah disetujui, dana escrow akan otomatis dicairkan ke dompet saldo mahasiswa.",
      async () => {
        try {
          await submissionApi.approve(submissionId);
          showSuccess(
            "Pekerjaan Disetujui!",
            "Honor kerja telah dicairkan ke saldo mahasiswa.",
          );
          setRatingModalOpen(true);
          await loadData();
        } catch (err) {
          showError(
            "Gagal Menyetujui",
            err.response?.data?.detail || "Gagal menyetujui hasil kerja.",
          );
        }
      },
    );
  };

  // MHS: Open Submission Modal
  const handleOpenSubmission = (projectId) => {
    setSelectedProjectId(projectId);
    setSubmissionModalOpen(true);
  };

  // UMKM: Reopen Project (Cancel Contract & Re-open to Explore)
  const handleReopenProject = async (payload) => {
    if (!selectedProject) return;
    try {
      setActionLoading(true);
      await projectApi.reopen(selectedProject.id, payload);
      setReopenModalOpen(false);
      showSuccess(
        "Proyek Berhasil Dibuka Kembali!",
        "Kontrak dengan mahasiswa telah dibatalkan dan saldo escrow telah dikembalikan ke Saldo Aktif Anda. Proyek kini dapat dilamar kembali di eksplorasi.",
      );
      await loadData();
      setActiveStageTab("applicants");
    } catch (err) {
      showError(
        "Gagal Membuka Kembali Proyek",
        err.response?.data?.detail ||
          "Terjadi kesalahan saat membuka kembali proyek.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // UMKM: Terminate and Cancel Project (Permanent Cancellation)
  const handleTerminateProject = async (payload) => {
    if (!selectedProject) return;
    try {
      setActionLoading(true);
      await projectApi.terminateAndCancel(selectedProject.id, payload);
      setTerminateModalOpen(false);
      showSuccess(
        "Proyek Berhasil Dibatalkan",
        "Proyek telah ditutup secara permanen dan saldo escrow telah dikembalikan ke Saldo Aktif Anda.",
      );
      await loadData();
    } catch (err) {
      showError(
        "Gagal Membatalkan Proyek",
        err.response?.data?.detail ||
          "Terjadi kesalahan saat membatalkan proyek.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // MHS: Resign from Project
  const handleResignProposal = async (payload) => {
    if (!selectedProposal) return;
    try {
      setActionLoading(true);
      await proposalApi.resign(selectedProposal.id, payload);
      setResignModalOpen(false);
      showSuccess(
        "Pengunduran Diri Berhasil",
        "Anda telah resmi mengundurkan diri dari proyek ini. Dana escrow telah dikembalikan ke klien UMKM.",
      );
      await loadData();
    } catch (err) {
      showError(
        "Gagal Mengundurkan Diri",
        err.response?.data?.detail ||
          "Terjadi kesalahan saat mengajukan pengunduran diri.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered lists for left navigator
  const filteredProjects = useMemo(() => {
    return myProjects.filter((p) => {
      const matchSearch =
        p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kategori.toLowerCase().includes(searchQuery.toLowerCase());

      const matchFilter =
        activeFilter === "ALL" ||
        (activeFilter === "IN_PROGRESS" && p.status === "IN_PROGRESS") ||
        (activeFilter === "COMPLETED" &&
          (p.status === "DONE" || p.status === "COMPLETED")) ||
        (activeFilter === "OPEN" &&
          (p.status === "OPEN" || p.status === "BIDDING"));

      return matchSearch && matchFilter;
    });
  }, [myProjects, searchQuery, activeFilter]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const matchSearch =
        (p.cover_letter &&
          p.cover_letter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.project_judul &&
          p.project_judul.toLowerCase().includes(searchQuery.toLowerCase()));

      const sub = mhsSubmissions[p.project_id];
      const isApproved = sub?.status === "APPROVED" || p.status === "COMPLETED";

      let matchFilter = true;
      if (activeFilter === "PENDING") {
        matchFilter = p.status === "PENDING";
      } else if (activeFilter === "IN_PROGRESS") {
        matchFilter = p.status === "ACCEPTED" && !isApproved;
      } else if (activeFilter === "COMPLETED") {
        matchFilter =
          isApproved || p.status === "WITHDRAWN" || p.status === "REJECTED";
      } else if (activeFilter === "REJECTED") {
        matchFilter = p.status === "REJECTED" || p.status === "WITHDRAWN";
      }

      return matchSearch && matchFilter;
    });
  }, [proposals, searchQuery, activeFilter, mhsSubmissions]);

  // Current active entity details
  const activeProjectId = isUmkm
    ? selectedProject?.id
    : selectedProposal?.project_id;

  const activeProjectTitle = isUmkm
    ? selectedProject?.judul
    : selectedProposal?.project_judul || "Proyek Kolaborasi";

  const acceptedApplicant = isUmkm
    ? projectProposals.find((p) => p.status === "ACCEPTED")
    : selectedProposal?.status === "ACCEPTED"
      ? selectedProposal
      : null;

  const hasAcceptedApplicant = Boolean(acceptedApplicant);

  const activePartnerName = isUmkm
    ? acceptedApplicant?.mhs_profile?.nama_lengkap || null
    : selectedProposal?.project_umkm_nama || "Klien UMKM";

  const activePartnerPhoto = isUmkm
    ? acceptedApplicant?.mhs_profile?.url_foto || null
    : selectedProposal?.project_umkm_foto ||
      selectedProposal?.umkm_foto ||
      selectedProject?.umkm_profile?.url_foto_usaha;

  const activePartnerRole = isUmkm ? "MHS" : "UMKM";

  const activeDeliverable = isUmkm
    ? projectSubmissions[0]
    : mhsSubmissions[selectedProposal?.project_id];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 font-sans">
      {/* 1. Header Bar: Workspace Title & Wallet Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-6 sm:p-8 rounded-3xl border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans flex items-center gap-1.5">
              {isUmkm ? (
                <Building2 className="w-3.5 h-3.5 text-brand-indigo" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-brand-indigo" />
              )}
              <span>
                {isUmkm ? "Ruang Kerja Klien UMKM" : "Ruang Kerja Mahasiswa"}
              </span>
            </span>
            <span className="text-muted/60 text-xs">•</span>
            <span className="text-xs text-muted font-sans font-normal">
              Pusat Kolaborasi Real-Time & Garansi Escrow
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 tracking-tight leading-tight mt-1">
            {isUmkm
              ? "Kelola Proyek & Ruang Diskusi Terpadu"
              : "Papan Proyek, Obrolan & Deliverable"}
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans mt-1">
            {isUmkm
              ? "Bahas brief secara langsung, evaluasi tawaran pelamar, dan rilis honor saat pekerjaan tuntas."
              : "Berdiskusi langsung dengan klien, bagikan tautan Figma/Drive, dan serahkan hasil deliverable."}
          </p>
        </div>

        {/* Quick Balance Chip */}
        <div className="flex items-center gap-3 bg-canvas p-3 rounded-2xl border border-border shrink-0 self-start md:self-auto">
          <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-dark-900">
            <WalletIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted uppercase block">
              {isUmkm ? "Dana Escrow Aktif" : "Saldo Dompet Anda"}
            </span>
            <span className="text-xs sm:text-sm font-black text-dark-900">
              {wallet
                ? formatCurrency(
                    isUmkm ? wallet.saldo_escrow : wallet.saldo_aktif,
                  )
                : "Rp 0"}
            </span>
          </div>
          <Link to="/wallet">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold border-border text-dark-900 hover:bg-surface ml-1 px-2.5 py-1"
            >
              <span>Dompet</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Unified 2-Pane Workroom Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT PANE: Project & Contract Navigator (4 cols on lg, hidden in focus mode) */}
        {/* ========================================================================= */}
        {!isFocusMode && (
          <div className="lg:col-span-4 bg-surface rounded-3xl border border-border p-4 space-y-3.5 shadow-xs animate-in fade-in duration-200">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  isUmkm ? "Cari judul proyek..." : "Cari lamaran & proyek..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand-indigo font-sans"
              />
            </div>

            {/* Filter Pills */}
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center gap-1.5 text-[11px]">
              {(isUmkm
                ? [
                    { key: "ALL", label: "Semua" },
                    { key: "IN_PROGRESS", label: "Aktif" },
                    { key: "OPEN", label: "Pelamar" },
                    { key: "COMPLETED", label: "Selesai" },
                  ]
                : [
                    { key: "ALL", label: "Semua" },
                    { key: "IN_PROGRESS", label: "Dikerjakan" },
                    { key: "PENDING", label: "Seleksi" },
                    { key: "COMPLETED", label: "Selesai" },
                  ]
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`py-1.5 px-2 rounded-xl font-bold transition-all text-center justify-center flex items-center ${
                    activeFilter === tab.key
                      ? "bg-dark-900 text-white shadow-xs"
                      : "bg-canvas text-muted hover:text-dark-900 border border-border"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {loading ? (
                <div className="p-8 text-center text-xs text-muted">
                  <div className="w-5 h-5 border-2 border-brand-indigo border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Memuat daftar pengerjaan...
                </div>
              ) : isUmkm ? (
                filteredProjects.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted border border-dashed border-border rounded-2xl">
                    Tidak ada proyek yang sesuai filter.
                  </div>
                ) : (
                  filteredProjects.map((proj) => (
                    <ProposalSidebarItem
                      key={proj.id}
                      isUmkm={true}
                      item={proj}
                      isSelected={selectedProject?.id === proj.id}
                      onClick={() => handleSelectProject(proj)}
                    />
                  ))
                )
              ) : filteredProposals.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted border border-dashed border-border rounded-2xl">
                  Belum ada lamaran proyek yang sesuai filter.
                </div>
              ) : (
                filteredProposals.map((prop) => (
                  <ProposalSidebarItem
                    key={prop.id}
                    isUmkm={false}
                    item={prop}
                    isSelected={selectedProposal?.id === prop.id}
                    onClick={() => handleSelectProposal(prop)}
                    mhsSubmissions={mhsSubmissions}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* RIGHT PANE: Unified Active Workroom Stage (12 cols in focus mode, 8 cols otherwise) */}
        {/* ========================================================================= */}
        <div
          className={`${
            isFocusMode ? "lg:col-span-12" : "lg:col-span-8"
          } space-y-4 transition-all duration-300`}
        >
          <WorkroomWorkspaceDetail
            activeProjectId={activeProjectId}
            activeProjectTitle={activeProjectTitle}
            activePartnerName={activePartnerName}
            activePartnerRole={activePartnerRole}
            activePartnerPhoto={activePartnerPhoto}
            hasAcceptedApplicant={hasAcceptedApplicant}
            isFocusMode={isFocusMode}
            setIsFocusMode={setIsFocusMode}
            allProjects={myProjects}
            onSelectProject={handleSelectProject}
            isUmkm={isUmkm}
            selectedProject={selectedProject}
            selectedProposal={selectedProposal}
            activeStageTab={activeStageTab}
            setActiveStageTab={setActiveStageTab}
            activeDeliverable={activeDeliverable}
            projectProposals={projectProposals}
            handleOpenSubmission={handleOpenSubmission}
            handleApproveWork={handleApproveWork}
            setSelectedSubmissionForRevision={setSelectedSubmissionForRevision}
            setRevisionModalOpen={setRevisionModalOpen}
            handleRejectProposal={handleRejectProposal}
            handleAcceptProposal={handleAcceptProposal}
            parseCoverLetter={parseCoverLetter}
            onOpenReopenModal={() => setReopenModalOpen(true)}
            onOpenTerminateModal={() => setTerminateModalOpen(true)}
            onOpenResignModal={() => setResignModalOpen(true)}
          />
        </div>
      </div>

      {/* Modals for Deliverables & Reviews */}
      <SubmissionModal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        projectId={selectedProjectId}
        onSuccess={() => loadData()}
      />

      <RevisionModal
        isOpen={revisionModalOpen}
        onClose={() => {
          setRevisionModalOpen(false);
          setSelectedSubmissionForRevision(null);
        }}
        submission={selectedSubmissionForRevision}
        onSuccess={() => loadData()}
      />

      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        projectId={selectedProject?.id || selectedProjectId}
        onSuccess={() => loadData()}
      />

      {/* Contract & Escrow Action Modals */}
      <ReopenProjectModal
        isOpen={reopenModalOpen}
        onClose={() => setReopenModalOpen(false)}
        project={selectedProject}
        onConfirm={handleReopenProject}
        loading={actionLoading}
      />

      <TerminateProjectModal
        isOpen={terminateModalOpen}
        onClose={() => setTerminateModalOpen(false)}
        project={selectedProject}
        onConfirm={handleTerminateProject}
        loading={actionLoading}
      />

      <ResignProposalModal
        isOpen={resignModalOpen}
        onClose={() => setResignModalOpen(false)}
        proposal={selectedProposal}
        onConfirm={handleResignProposal}
        loading={actionLoading}
      />
    </div>
  );
}
