import React, { useState, useEffect, useMemo } from "react";
import {
  Link,
  useSearchParams,
  useParams,
  useNavigate,
} from "react-router-dom";
import { proposalApi, projectApi, submissionApi, walletApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { useAlertStore } from "../../store/alertStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SubmissionModal } from "../../components/features/SubmissionModal";
import { RatingModal } from "../../components/features/RatingModal";
import { DisputeTicketModal } from "../../components/features/DisputeTicketModal";
import { RevisionModal } from "../../components/features/RevisionModal";
import {
  ReopenProjectModal,
  TerminateProjectModal,
  ResignProposalModal,
} from "./components/ContractActionModals";
import { WorkroomWorkspaceDetail } from "./components/WorkroomWorkspaceDetail";
import { WorkspaceHubGrid } from "./components/WorkspaceHubGrid";
import { ApplicantReviewBoard } from "./components/ApplicantReviewBoard";
import { PendingProposalView } from "./components/PendingProposalView";
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
  const { projectId: routeProjectId } = useParams();
  const navigate = useNavigate();
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
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Active Stage Sub-tab: 'chat' | 'deliverable' | 'brief' | 'applicants'
  const [activeStageTab, setActiveStageTab] = useState("brief");
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Modals
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedSubmissionForRevision, setSelectedSubmissionForRevision] =
    useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [resignModalOpen, setResignModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Target project id from route param or query string
  const targetProjectId = routeProjectId || searchParams.get("project");

  // 1. Initial Data Loading
  const loadData = async () => {
    try {
      setLoading(true);

      // Load wallet data
      walletApi
        .getMe()
        .then((res) => setWallet(res.data))
        .catch(() => {});

      if (isUmkm) {
        const res = await projectApi.getMyProjects();
        const projectList = Array.isArray(res.data) ? res.data : [];
        setMyProjects(projectList);

        if (targetProjectId) {
          const found = projectList.find((p) => p.id === targetProjectId);
          if (found) {
            setSelectedProject(found);
            const isCompleted =
              found.status === "DONE" || found.status === "COMPLETED";
            if (isCompleted) {
              setActiveStageTab("deliverable");
            }
            setDetailsLoading(true);
            const details = await loadProjectDetails(found.id);
            setDetailsLoading(false);
            const hasAccepted = details.proposals.some(
              (p) => p.status === "ACCEPTED",
            );
            if (isCompleted) {
              setActiveStageTab("deliverable");
            } else if (hasAccepted) {
              setActiveStageTab("chat");
            } else if (details.proposals.length > 0) {
              setActiveStageTab("applicants");
            } else {
              setActiveStageTab("brief");
            }
          } else {
            setSelectedProject(null);
          }
        } else {
          setSelectedProject(null);
        }
      } else {
        const res = await proposalApi.getMyProposals();
        const propList = Array.isArray(res.data) ? res.data : [];
        setMyProposals(propList);

        // Load submission for accepted proposals
        const accepted = propList.filter((p) => p.status === "ACCEPTED");
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

        if (targetProjectId) {
          const found = propList.find(
            (p) => p.project_id === targetProjectId || p.id === targetProjectId,
          );
          if (found) {
            setSelectedProposal(found);
            const isCompleted =
              found.status === "COMPLETED" ||
              subMap[found.project_id]?.status === "APPROVED" ||
              found.project_status === "DONE" ||
              found.project_status === "COMPLETED";
            if (isCompleted) {
              setActiveStageTab("deliverable");
            } else if (found.status === "ACCEPTED") {
              setActiveStageTab("chat");
            } else {
              setActiveStageTab("brief");
            }
          } else {
            setSelectedProposal(null);
          }
        } else {
          setSelectedProposal(null);
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
  }, [isUmkm, targetProjectId]);

  // Handle UMKM selecting a project to open dedicated workspace
  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setSearchParams({ project: project.id });
    window.scrollTo({ top: 0, behavior: "smooth" });

    const isCompleted =
      project.status === "DONE" || project.status === "COMPLETED";
    if (isCompleted) {
      setActiveStageTab("deliverable");
    }

    setDetailsLoading(true);
    const details = await loadProjectDetails(project.id);
    setDetailsLoading(false);

    const hasAccepted = details.proposals.some((p) => p.status === "ACCEPTED");
    if (isCompleted) {
      setActiveStageTab("deliverable");
    } else if (hasAccepted) {
      setActiveStageTab("chat");
    } else if (details.proposals.length > 0) {
      setActiveStageTab("applicants");
    } else {
      setActiveStageTab("brief");
    }
  };

  // Handle Mahasiswa selecting a proposal to open dedicated workspace
  const handleSelectProposal = (proposal) => {
    setSelectedProposal(proposal);
    setSearchParams({ project: proposal.project_id });
    window.scrollTo({ top: 0, behavior: "smooth" });

    const isCompleted =
      proposal.status === "COMPLETED" ||
      mhsSubmissions[proposal.project_id]?.status === "APPROVED" ||
      proposal.project_status === "DONE" ||
      proposal.project_status === "COMPLETED";

    if (isCompleted) {
      setActiveStageTab("deliverable");
    } else if (proposal.status === "ACCEPTED") {
      setActiveStageTab("chat");
    } else {
      setActiveStageTab("brief");
    }
  };

  // Return from dedicated workspace back to Hub
  const handleBackToHub = () => {
    setSelectedProject(null);
    setSelectedProposal(null);
    setSearchParams({});
    navigate("/proposals");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const hasAcceptedApplicant = Boolean(
    acceptedApplicant ||
    (isUmkm && selectedProject?.accepted_mhs_nama) ||
    (!isUmkm && selectedProposal?.status === "ACCEPTED"),
  );

  const activePartnerName = isUmkm
    ? acceptedApplicant?.mhs_profile?.nama_lengkap ||
      selectedProject?.accepted_mhs_nama ||
      projectProposals.find((p) => p.status === "ACCEPTED")?.mhs_profile
        ?.nama_lengkap ||
      "Mahasiswa Pelaksana"
    : selectedProposal?.project_umkm_nama ||
      selectedProposal?.umkm_nama ||
      selectedProposal?.umkm_profile?.nama_usaha ||
      selectedProject?.umkm_profile?.nama_usaha ||
      selectedProject?.umkm_nama ||
      "Klien Mitra UMKM";

  const activePartnerPhoto = isUmkm
    ? acceptedApplicant?.mhs_profile?.url_foto ||
      selectedProject?.accepted_mhs_foto ||
      projectProposals.find((p) => p.status === "ACCEPTED")?.mhs_profile
        ?.url_foto ||
      null
    : selectedProposal?.project_umkm_foto ||
      selectedProposal?.umkm_foto ||
      selectedProposal?.umkm_profile?.url_foto_usaha ||
      selectedProject?.umkm_profile?.url_foto_usaha ||
      selectedProject?.umkm_foto ||
      null;

  const activePartnerRole = isUmkm ? "MHS" : "UMKM";

  const activeDeliverable = isUmkm
    ? projectSubmissions[0]
    : mhsSubmissions[selectedProposal?.project_id];

  // Determine role & lifecycle mode:
  const isSelectingProject = Boolean(
    isUmkm ? selectedProject : selectedProposal,
  );

  const isApplicantReviewBoardMode = Boolean(
    isUmkm &&
    selectedProject &&
    (selectedProject.status === "OPEN" || selectedProject.status === "BIDDING"),
  );

  const isPendingProposalMode = Boolean(
    !isUmkm &&
    selectedProposal &&
    (selectedProposal.status === "PENDING" ||
      selectedProposal.status === "REJECTED" ||
      selectedProposal.status === "WITHDRAWN"),
  );

  const isDedicatedWorkroomMode = Boolean(
    isSelectingProject && !isApplicantReviewBoardMode && !isPendingProposalMode,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 font-sans">
      {/* 1. Hub View: Header Bar & Catalog Grid (Only shown when browsing projects) */}
      {!isSelectingProject && (
        <>
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
                    {isUmkm
                      ? "Ruang Kerja Klien UMKM"
                      : "Ruang Kerja Mahasiswa"}
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

          <WorkspaceHubGrid
            isUmkm={isUmkm}
            projects={myProjects}
            proposals={proposals}
            mhsSubmissions={mhsSubmissions}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onSelectProject={handleSelectProject}
            onSelectProposal={handleSelectProposal}
          />
        </>
      )}

      {/* 2. UMKM Applicant Review Board (Dedicated for OPEN/BIDDING projects) */}
      {isApplicantReviewBoardMode && (
        <ApplicantReviewBoard
          project={selectedProject}
          proposals={projectProposals}
          onBack={handleBackToHub}
          onAcceptProposal={handleAcceptProposal}
          onRejectProposal={handleRejectProposal}
          parseCoverLetter={parseCoverLetter}
          allProjects={myProjects}
          onSelectProject={handleSelectProject}
        />
      )}

      {/* 3. Mahasiswa Pending / Under Review Application View */}
      {isPendingProposalMode && (
        <PendingProposalView
          proposal={selectedProposal}
          onBack={handleBackToHub}
          onOpenResignModal={() => setResignModalOpen(true)}
          parseCoverLetter={parseCoverLetter}
          allProposals={proposals}
          onSelectProposal={handleSelectProposal}
        />
      )}

      {/* 4. Dedicated Active Workroom Workspace (IN_PROGRESS, REVIEW, DONE, COMPLETED) */}
      {isDedicatedWorkroomMode && (
        <WorkroomWorkspaceDetail
          onBack={handleBackToHub}
          activeProjectId={activeProjectId}
          activeProjectTitle={activeProjectTitle}
          activePartnerName={activePartnerName}
          activePartnerRole={activePartnerRole}
          activePartnerPhoto={activePartnerPhoto}
          hasAcceptedApplicant={hasAcceptedApplicant}
          isFocusMode={true}
          setIsFocusMode={setIsFocusMode}
          allProjects={isUmkm ? myProjects : proposals}
          onSelectProject={isUmkm ? handleSelectProject : handleSelectProposal}
          isUmkm={isUmkm}
          selectedProject={selectedProject}
          selectedProposal={selectedProposal}
          detailsLoading={detailsLoading}
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
          onOpenRatingModal={() => setRatingModalOpen(true)}
          onOpenFileDisputeModal={() => setDisputeModalOpen(true)}
        />
      )}

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
        keUserId={
          isUmkm
            ? selectedProject?.accepted_mhs_id ||
              projectProposals.find((p) => p.status === "ACCEPTED")?.mhs_id
            : selectedProposal?.umkm_id || selectedProject?.umkm_id
        }
        recipientName={
          isUmkm
            ? selectedProject?.accepted_mhs_nama ||
              projectProposals.find((p) => p.status === "ACCEPTED")?.mhs_nama ||
              "Mahasiswa"
            : selectedProposal?.umkm_nama ||
              selectedProject?.umkm_nama ||
              "Klien UMKM"
        }
        onSuccess={() => loadData()}
      />

      <DisputeTicketModal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        projectId={selectedProject?.id || selectedProjectId}
        projectTitle={selectedProject?.judul || selectedProposal?.project_judul}
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
