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
import { WorkroomChatPanel } from "../../components/features/WorkroomChatPanel";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  UploadCloud,
  FileText,
  AlertCircle,
  Users,
  ShieldCheck,
  ExternalLink,
  RotateCcw,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Wallet as WalletIcon,
  Building2,
  GraduationCap,
  Layers,
  Send,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Check,
  CircleDot,
  FileCheck2,
  MessageSquare,
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
  const [activeStageTab, setActiveStageTab] = useState("chat");

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
          await loadProjectDetails(chosen.id);
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
      setProjectProposals(propRes.data || []);
      const subs =
        subRes.data && subRes.data.id
          ? [subRes.data]
          : Array.isArray(subRes.data)
            ? subRes.data
            : [];
      setProjectSubmissions(subs);
    } catch (err) {
      console.warn("Gagal memuat rincian proyek:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [isUmkm]);

  // Handle UMKM selecting another project from left list
  const handleSelectProject = async (project) => {
    setSelectedProject(project);
    setSearchParams({ project: project.id });
    await loadProjectDetails(project.id);
    // Auto switch tab: if open/bidding with proposals, show applicants, else chat
    if (project.status === "OPEN" || project.status === "BIDDING") {
      setActiveStageTab("applicants");
    } else {
      setActiveStageTab("chat");
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
        matchFilter = isApproved;
      } else if (activeFilter === "REJECTED") {
        matchFilter = p.status === "REJECTED";
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

  const activePartnerName = isUmkm
    ? projectProposals.find((p) => p.status === "ACCEPTED")?.mhs_profile
        ?.nama_lengkap || "Mahasiswa Talenta"
    : selectedProposal?.project_umkm_nama || "Klien UMKM";

  const activePartnerRole = isUmkm ? "MHS" : "UMKM";

  const activeDeliverable = isUmkm
    ? projectSubmissions[0]
    : mhsSubmissions[selectedProposal?.project_id];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 font-sans">
      {/* 1. Header Bar: Workspace Title & Wallet Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-5 sm:p-6 rounded-3xl border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border bg-canvas text-xs font-semibold text-dark-900">
              {isUmkm ? (
                <Building2 className="w-3.5 h-3.5 text-brand-indigo" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-brand-indigo" />
              )}
              <span>
                {isUmkm ? "Ruang Kerja Klien UMKM" : "Ruang Kerja Mahasiswa"}
              </span>
            </span>
            <span className="text-[11px] text-muted">
              Pusat Kolaborasi Real-Time & Garansi Escrow
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-dark-900 tracking-tight">
            {isUmkm
              ? "Kelola Proyek & Ruang Diskusi Terpadu"
              : "Papan Proyek, Obrolan & Deliverable"}
          </h1>
          <p className="text-xs text-muted">
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
        {/* LEFT PANE: Project & Contract Navigator (4 cols on lg) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 bg-surface rounded-3xl border border-border p-4 space-y-3.5 shadow-xs">
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
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
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
                className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
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
                filteredProjects.map((proj) => {
                  const isSelected = selectedProject?.id === proj.id;
                  const isDone =
                    proj.status === "DONE" || proj.status === "COMPLETED";

                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProject(proj)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-indigo-50/40 border-brand-indigo/60 shadow-xs ring-1 ring-brand-indigo/30"
                          : "bg-canvas border-border hover:bg-surface hover:border-dark-900/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted truncate">
                          {proj.kategori}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isDone
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : proj.status === "IN_PROGRESS"
                                ? "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {isDone ? "Selesai" : formatStatus(proj.status)}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-dark-900 line-clamp-1">
                        {proj.judul}
                      </h4>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60 text-[11px] text-muted">
                        <span className="font-extrabold text-dark-900">
                          {formatCurrency(proj.budget_max)}
                        </span>
                        <span>{formatDate(proj.created_at)}</span>
                      </div>
                    </div>
                  );
                })
              )
            ) : filteredProposals.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted border border-dashed border-border rounded-2xl">
                Belum ada lamaran proyek yang sesuai filter.
              </div>
            ) : (
              filteredProposals.map((prop) => {
                const isSelected = selectedProposal?.id === prop.id;
                const isAccepted = prop.status === "ACCEPTED";
                const isDone =
                  mhsSubmissions[prop.project_id]?.status === "APPROVED" ||
                  prop.status === "COMPLETED";

                return (
                  <div
                    key={prop.id}
                    onClick={() => handleSelectProposal(prop)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "bg-indigo-50/40 border-brand-indigo/60 shadow-xs ring-1 ring-brand-indigo/30"
                        : "bg-canvas border-border hover:bg-surface hover:border-dark-900/20"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted truncate">
                        {prop.project_kategori || "Proyek UMKM"}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isDone
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : isAccepted
                              ? "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20"
                              : prop.status === "REJECTED"
                                ? "bg-rose-50 text-rose-800 border-rose-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {isDone
                          ? "Selesai"
                          : isAccepted
                            ? "Dikerjakan"
                            : formatStatus(prop.status)}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-dark-900 line-clamp-1">
                      {prop.project_judul}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60 text-[11px] text-muted">
                      <span className="font-extrabold text-dark-900">
                        {formatCurrency(prop.harga_tawar)}
                      </span>
                      <span>{prop.estimasi_hari} Hari</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANE: Unified Active Workroom Stage (8 cols on lg) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-4">
          {!activeProjectId ? (
            <div className="bg-surface rounded-3xl border border-border p-12 text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-indigo mx-auto shadow-xs">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-dark-900">
                Pilih Proyek di Sisi Kiri
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                Pilih salah satu proyek atau proposal pada daftar navigator
                untuk langsung membuka ruang obrolan, memverifikasi berkas
                kerja, dan mengelola garansi escrow.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Stage Top Bar (Project Card Summary) */}
              <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-0.5">
                      Proyek Aktif
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-dark-900 leading-snug">
                      {activeProjectTitle}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Garansi Escrow Aman</span>
                    </div>
                  </div>
                </div>

                {/* Partner Info & Quick Metas */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 flex items-center justify-center font-bold text-xs">
                      {activePartnerName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-dark-900 block leading-tight">
                        {activePartnerName}
                      </span>
                      <span className="text-[10px] text-muted">
                        {activePartnerRole === "UMKM"
                          ? "Klien Usaha UMKM"
                          : "Mahasiswa Talenta"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-muted text-[11px]">
                    <div>
                      <span className="block text-[10px]">Nilai Kontrak:</span>
                      <span className="font-extrabold text-dark-900 text-xs">
                        {formatCurrency(
                          isUmkm
                            ? selectedProject?.budget_max
                            : selectedProposal?.harga_tawar,
                        )}
                      </span>
                    </div>
                    {isUmkm && (
                      <Link
                        to={`/projects/${selectedProject?.id}`}
                        className="text-brand-indigo hover:underline flex items-center gap-1 font-bold text-[11px]"
                      >
                        <span>Lihat Brief Lengkap</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Sub-Nav Segmented Tabs for the Active Workroom */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-border overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setActiveStageTab("chat")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      activeStageTab === "chat"
                        ? "bg-brand-indigo text-white shadow-brand"
                        : "bg-canvas border border-border text-muted hover:text-dark-900"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Obrolan & Kolaborasi</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </button>

                  <button
                    onClick={() => setActiveStageTab("deliverable")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeStageTab === "deliverable"
                        ? "bg-dark-900 text-white shadow-xs"
                        : "bg-canvas border border-border text-muted hover:text-dark-900"
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Hasil Deliverable</span>
                    {activeDeliverable && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                        Ada
                      </span>
                    )}
                  </button>

                  {isUmkm && (
                    <button
                      onClick={() => setActiveStageTab("applicants")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        activeStageTab === "applicants"
                          ? "bg-dark-900 text-white shadow-xs"
                          : "bg-canvas border border-border text-muted hover:text-dark-900"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Pelamar Masuk ({projectProposals.length})</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveStageTab("brief")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      activeStageTab === "brief"
                        ? "bg-dark-900 text-white shadow-xs"
                        : "bg-canvas border border-border text-muted hover:text-dark-900"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Rincian Kontrak</span>
                  </button>
                </div>
              </div>

              {/* STAGE TAB 1: INTEGRATED REAL-TIME CHAT PANEL (NO MODAL POPUPS!) */}
              {activeStageTab === "chat" && (
                <div className="animate-in fade-in duration-200">
                  <WorkroomChatPanel
                    projectId={activeProjectId}
                    projectTitle={activeProjectTitle}
                    partnerName={activePartnerName}
                    partnerRole={activePartnerRole}
                  />
                </div>
              )}

              {/* STAGE TAB 2: DELIVERABLE SUBMISSION & REVIEW */}
              {activeStageTab === "deliverable" && (
                <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-brand-indigo" />
                      <span>Berkas Hasil Pekerjaan (Deliverable)</span>
                    </h3>
                    <span className="text-xs text-muted">
                      Garansi Escrow Cair setelah disetujui
                    </span>
                  </div>

                  {activeDeliverable ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-canvas rounded-2xl border border-border space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-bold text-dark-900">
                            Tautan Berkas Hasil Pekerjaan:
                          </span>
                          <a
                            href={activeDeliverable.url_berkas}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 text-white text-xs font-bold hover:bg-dark-800 transition-colors shadow-xs"
                          >
                            <span>Buka / Unduh Berkas Deliverable</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {activeDeliverable.catatan_pengiriman && (
                          <div className="text-xs text-dark-900/90 bg-surface p-3.5 rounded-xl border border-border">
                            <span className="font-bold text-dark-900 block mb-0.5">
                              Catatan Pengiriman Mahasiswa:
                            </span>
                            "{activeDeliverable.catatan_pengiriman}"
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[11px] text-muted">
                          <span>
                            Jumlah Revisi:{" "}
                            <b>
                              {activeDeliverable.jumlah_revisi || 0} dari 2 kali
                            </b>
                          </span>
                          <span>
                            Diserahkan:{" "}
                            {formatDate(
                              activeDeliverable.submitted_at ||
                                activeDeliverable.created_at,
                            )}
                          </span>
                        </div>
                      </div>

                      {/* UMKM Action Bar */}
                      {isUmkm &&
                        activeDeliverable.status !== "APPROVED" &&
                        activeDeliverable.status !== "COMPLETED" && (
                          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSubmissionForRevision(
                                  activeDeliverable,
                                );
                                setRevisionModalOpen(true);
                              }}
                              disabled={activeDeliverable.jumlah_revisi >= 2}
                              className="text-xs font-bold border-border text-dark-900 hover:bg-canvas"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1" />
                              {activeDeliverable.jumlah_revisi >= 2
                                ? "Batas Revisi Habis (2/2)"
                                : "Minta Revisi"}
                            </Button>

                            <Button
                              variant="brand"
                              size="sm"
                              onClick={() =>
                                handleApproveWork(activeDeliverable.id)
                              }
                              className="text-xs font-bold shadow-brand"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Setujui & Cairkan Honor Escrow
                            </Button>
                          </div>
                        )}

                      {/* Mahasiswa Update Deliverable Action */}
                      {!isUmkm &&
                        activeDeliverable.status !== "APPROVED" &&
                        activeDeliverable.status !== "COMPLETED" && (
                          <div className="pt-2 flex justify-end">
                            <Button
                              variant="brand"
                              size="sm"
                              onClick={() =>
                                handleOpenSubmission(
                                  selectedProposal.project_id,
                                )
                              }
                              className="text-xs font-bold shadow-brand"
                            >
                              <UploadCloud className="w-3.5 h-3.5 mr-1" />
                              Perbarui Berkas Deliverable
                            </Button>
                          </div>
                        )}

                      {/* Approved Completed Success Banner */}
                      {(activeDeliverable.status === "APPROVED" ||
                        activeDeliverable.status === "COMPLETED") && (
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-950">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <div>
                              <span className="font-bold block">
                                Deliverable Disetujui & Proyek Selesai!
                              </span>
                              <span className="text-[11px] text-emerald-800">
                                Dana honor escrow telah 100% diteruskan ke
                                dompet mahasiswa.
                              </span>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase">
                            Lunas & Tuntas
                          </span>
                        </div>
                      )}
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
                        <p className="text-[11px] text-muted max-w-sm mx-auto mt-1">
                          {isUmkm
                            ? "Begitu mahasiswa mengunggah tautan hasil kerja (Figma, GitHub, atau Drive), berkas akan otomatis muncul di sini untuk Anda verifikasi."
                            : "Setelah pekerjaan selesai sesuai brief, unggah tautan hasil kerja Anda agar dapat diperiksa klien dan honor escrow dicairkan."}
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

              {/* STAGE TAB 3: APPLICANTS PROPOSALS (FOR UMKM) */}
              {activeStageTab === "applicants" && isUmkm && (
                <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="text-sm font-bold text-dark-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-indigo" />
                      <span>
                        Pelamar Mahasiswa yang Masuk ({projectProposals.length})
                      </span>
                    </h3>
                    <span className="text-xs text-muted">
                      Evaluasi & pilih kandidat terbaik
                    </span>
                  </div>

                  {projectProposals.length === 0 ? (
                    <div className="p-8 text-center bg-canvas rounded-2xl border border-border space-y-1">
                      <Users className="w-8 h-8 text-muted mx-auto opacity-40" />
                      <p className="text-xs font-bold text-dark-900">
                        Belum Ada Pelamar Masuk
                      </p>
                      <p className="text-[11px] text-muted">
                        Proyek Anda sedang aktif tayang di katalog terbuka
                        mahasiswa.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projectProposals.map((prop) => {
                        const isAccepted = prop.status === "ACCEPTED";
                        const isRejected = prop.status === "REJECTED";

                        return (
                          <div
                            key={prop.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              isAccepted
                                ? "bg-emerald-50/20 border-emerald-200 shadow-xs"
                                : isRejected
                                  ? "bg-canvas border-border opacity-70"
                                  : "bg-canvas border-border hover:border-dark-900/30"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-dark-900">
                                    {prop.mhs_profile?.nama_lengkap ||
                                      "Mahasiswa Pelamar"}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                      isAccepted
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        : isRejected
                                          ? "bg-rose-50 text-rose-800 border-rose-200"
                                          : "bg-surface text-muted border-border"
                                    }`}
                                  >
                                    {isAccepted
                                      ? "Disetujui"
                                      : isRejected
                                        ? "Ditolak"
                                        : "Menunggu Seleksi"}
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted mt-0.5">
                                  {prop.mhs_profile?.asal_kampus ||
                                    "Perguruan Tinggi Terakreditasi"}{" "}
                                  • Estimasi: {prop.estimasi_hari} Hari
                                </p>
                              </div>

                              <div className="text-left sm:text-right">
                                <span className="text-sm font-extrabold text-dark-900">
                                  {formatCurrency(prop.harga_tawar)}
                                </span>
                              </div>
                            </div>

                            {(() => {
                              const parsed = parseCoverLetter(
                                prop.cover_letter,
                              );
                              return (
                                <div className="bg-surface p-3.5 rounded-xl border border-border text-xs text-dark-900/90 leading-relaxed mb-3 space-y-2">
                                  <div>
                                    <span className="font-bold text-dark-900 block mb-0.5">
                                      Rencana Pengerjaan Pelamar:
                                    </span>
                                    <p className="whitespace-pre-wrap">
                                      {parsed.text}
                                    </p>
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
                                onClick={() => setActiveStageTab("chat")}
                                className="text-xs font-bold border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/5 flex items-center gap-1.5"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Buka Obrolan</span>
                              </Button>

                              {(selectedProject.status === "OPEN" ||
                                selectedProject.status === "BIDDING") &&
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

              {/* STAGE TAB 4: CONTRACT & BRIEF DETAILS */}
              {activeStageTab === "brief" && (
                <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4 animate-in fade-in duration-200">
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-bold text-dark-900">
                      Rincian Brief & Kesepakatan Kontrak
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      Spesifikasi pengerjaan yang disepakati kedua belah pihak
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-canvas p-4 rounded-2xl border border-border space-y-1.5">
                      <span className="text-[10px] font-bold text-muted uppercase">
                        Kategori & Bidang
                      </span>
                      <p className="font-bold text-dark-900">
                        {isUmkm
                          ? selectedProject?.kategori
                          : selectedProposal?.project_kategori ||
                            "Desain Kreatif"}
                      </p>
                    </div>

                    <div className="bg-canvas p-4 rounded-2xl border border-border space-y-1.5">
                      <span className="text-[10px] font-bold text-muted uppercase">
                        Batas Honor Disepakati
                      </span>
                      <p className="font-bold text-dark-900">
                        {formatCurrency(
                          isUmkm
                            ? selectedProject?.budget_max
                            : selectedProposal?.harga_tawar,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Brief Kebutuhan Proyek dari Klien UMKM */}
                  <div className="bg-canvas p-4 rounded-2xl border border-border space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                      Brief & Kebutuhan Proyek Klien
                    </span>
                    <p className="text-dark-900 leading-relaxed whitespace-pre-wrap">
                      {isUmkm
                        ? selectedProject?.deskripsi_raw ||
                          "Rincian brief proyek UMKM."
                        : selectedProposal?.project_deskripsi ||
                          "Brief kebutuhan proyek yang telah diterbitkan oleh klien UMKM."}
                    </p>
                  </div>

                  {/* Proposal Cover Letter if Student view */}
                  {!isUmkm &&
                    selectedProposal &&
                    (() => {
                      const parsed = parseCoverLetter(
                        selectedProposal.cover_letter,
                      );
                      return (
                        <div className="bg-canvas p-4 rounded-2xl border border-border space-y-3 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                              Surat Lamaran & Rencana Pengerjaan Anda
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
                      );
                    })()}
                </div>
              )}
            </div>
          )}
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
    </div>
  );
}
