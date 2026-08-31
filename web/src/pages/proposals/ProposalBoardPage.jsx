import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

export function ProposalBoardPage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const { showConfirm, showSuccess, showError } = useAlertStore();
  const isUmkm = user?.role === "UMKM";

  // State for MHS
  const [proposals, setMyProposals] = useState([]);
  // State for UMKM
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectProposals, setProjectProposals] = useState([]);
  const [projectSubmissions, setProjectSubmissions] = useState([]);
  const [mhsSubmissions, setMhsSubmissions] = useState({});

  // Quick Wallet State
  const [wallet, setWallet] = useState(null);

  // Search, Filter, Pagination & Accordion states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [loading, setLoading] = useState(true);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [selectedSubmissionForRevision, setSelectedSubmissionForRevision] =
    useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load wallet data for quick overview
      walletApi
        .getMe()
        .then((res) => setWallet(res.data))
        .catch(() => {});

      if (isUmkm) {
        const res = await projectApi.getMyProjects();
        setMyProjects(res.data);
        if (res.data.length > 0) {
          const defaultProj = selectedProject || res.data[0];
          setSelectedProject(defaultProj);
          await loadProjectDetails(defaultProj.id);
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
      }
    } catch (err) {
      console.error("Gagal memuat papan proposal:", err);
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
      // Fallback
    }
  };

  useEffect(() => {
    loadData();
  }, [isUmkm]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleSelectProject = async (proj) => {
    setSelectedProject(proj);
    await loadProjectDetails(proj.id);
  };

  // UMKM: Accept Proposal Action
  const handleAcceptProposal = (proposal) => {
    showConfirm(
      "Terima Proposal Mahasiswa?",
      `Anda akan menerima proposal dari mahasiswa ini seharga ${formatCurrency(proposal.harga_tawar)}. Dana akan dikunci aman di Escrow Makarya hingga hasil kerja selesai.`,
      async () => {
        try {
          await proposalApi.accept(proposal.id);
          showSuccess(
            "Proposal Diterima!",
            "Status proyek kini sedang dikerjakan dan dana escrow telah dikunci aman.",
          );
          await loadData();
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
      "Setelah disetujui, dana escrow akan otomatis diteruskan ke saldo dompet mahasiswa.",
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

  // MHS: Open Submission
  const handleOpenSubmission = (projectId) => {
    setSelectedProjectId(projectId);
    setSubmissionModalOpen(true);
  };

  // Filtered lists
  const filteredProjects = useMemo(() => {
    return myProjects.filter((p) => {
      const matchSearch =
        p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kategori.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab =
        activeTab === "ALL" ||
        (activeTab === "IN_PROGRESS" && p.status === "IN_PROGRESS") ||
        (activeTab === "COMPLETED" &&
          (p.status === "DONE" || p.status === "COMPLETED")) ||
        (activeTab === "OPEN" && (p.status === "OPEN" || p.status === "BIDDING"));
      return matchSearch && matchTab;
    });
  }, [myProjects, searchQuery, activeTab]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const matchSearch =
        (p.cover_letter &&
          p.cover_letter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.project_judul &&
          p.project_judul.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.project_id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const sub = mhsSubmissions[p.project_id];
      const isApproved = sub?.status === "APPROVED" || p.status === "COMPLETED";

      let matchTab = true;
      if (activeTab === "PENDING") {
        matchTab = p.status === "PENDING";
      } else if (activeTab === "IN_PROGRESS") {
        matchTab = p.status === "ACCEPTED" && !isApproved;
      } else if (activeTab === "COMPLETED") {
        matchTab = isApproved;
      } else if (activeTab === "REJECTED") {
        matchTab = p.status === "REJECTED";
      }

      return matchSearch && matchTab;
    });
  }, [proposals, searchQuery, activeTab, mhsSubmissions]);

  // Paginated Slices
  const totalProjectPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalProposalPages = Math.ceil(filteredProposals.length / ITEMS_PER_PAGE) || 1;
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Counts for tabs
  const projectCounts = {
    all: myProjects.length,
    open: myProjects.filter((p) => p.status === "OPEN" || p.status === "BIDDING").length,
    inProgress: myProjects.filter((p) => p.status === "IN_PROGRESS").length,
    completed: myProjects.filter((p) => p.status === "DONE" || p.status === "COMPLETED").length,
  };

  const proposalCounts = {
    all: proposals.length,
    pending: proposals.filter((p) => p.status === "PENDING").length,
    inProgress: proposals.filter((p) => p.status === "ACCEPTED" && mhsSubmissions[p.project_id]?.status !== "APPROVED").length,
    completed: proposals.filter((p) => mhsSubmissions[p.project_id]?.status === "APPROVED" || p.status === "COMPLETED").length,
    rejected: proposals.filter((p) => p.status === "REJECTED").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans">
      {/* 1. Header & Quick Wallet Balance Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-5 sm:p-6 rounded-3xl border border-border shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-canvas text-xs font-semibold text-dark-900">
              {isUmkm ? (
                <Building2 className="w-3.5 h-3.5 text-muted" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-muted" />
              )}
              <span>
                {isUmkm ? "Portal Klien UMKM" : "Portal Mahasiswa Freelancer"}
              </span>
            </div>
            <span className="text-[11px] font-mono text-muted">
              {isUmkm ? "Pusat Proyek & Escrow" : "Papan Lamaran & Deliverable"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif text-dark-900 tracking-tight leading-tight">
            {isUmkm
              ? "Kelola Proyek & Verifikasi Deliverable"
              : "Papan Proposal & Penyerahan Hasil"}
          </h1>
          <p className="text-xs text-muted">
            {isUmkm
              ? "Tinjau proposal masuk dari mahasiswa, kunci dana aman di rekening bersama, dan setujui berkas kerja."
              : "Pantau status penerimaan proposal, serahkan deliverable proyek yang disetujui, dan cairkan honor."}
          </p>
        </div>

        {/* Quick Wallet Card */}
        <div className="flex items-center gap-3 bg-canvas p-3.5 rounded-2xl border border-border shrink-0">
          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-dark-900">
            <WalletIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted uppercase block">
              {isUmkm ? "Saldo Escrow" : "Saldo Aktif"}
            </span>
            <span className="text-sm font-black text-dark-900">
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
              className="text-xs font-bold border-border text-dark-900 hover:bg-surface ml-2"
            >
              {isUmkm
                ? "Dompet"
                : Number(wallet?.saldo_aktif || 0) > 0
                  ? "Tarik Dana"
                  : "Lihat Dompet"}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Visual Step-by-Step Workflow Guide */}
      <div className="bg-canvas p-4 rounded-2xl border border-border">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-brand-indigo" />
          <span className="text-xs font-bold uppercase tracking-wider text-dark-900">
            {isUmkm ? "Alur Kerja Klien UMKM" : "Alur Kerja Mahasiswa"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {isUmkm ? (
            <>
              <div className="bg-surface p-3 rounded-xl border border-border flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-dark-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  1
                </div>
                <div>
                  <span className="text-xs font-bold text-dark-900 block">Pilih Pelamar & Kunci Escrow</span>
                  <span className="text-[11px] text-muted leading-tight block mt-0.5">
                    Review proposal masuk, klik terima untuk mengunci dana aman di rekening bersama.
                  </span>
                </div>
              </div>

              <div className="bg-surface p-3 rounded-xl border border-border flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-dark-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  2
                </div>
                <div>
                  <span className="text-xs font-bold text-dark-900 block">Pantau Pengerjaan & Deliverable</span>
                  <span className="text-[11px] text-muted leading-tight block mt-0.5">
                    Mahasiswa mengerjakan tugas sesuai tenggat dan mengunggah berkas hasil kerja.
                  </span>
                </div>
              </div>

              <div className="bg-surface p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  3
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Setujui & Rilis Dana</span>
                  <span className="text-[11px] text-emerald-800/80 leading-tight block mt-0.5">
                    Periksa berkas, minta revisi jika perlu, atau setujui untuk mencairkan honor ke mahasiswa.
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-surface p-3 rounded-xl border border-border flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-dark-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  1
                </div>
                <div>
                  <span className="text-xs font-bold text-dark-900 block">Ajukan Penawaran</span>
                  <span className="text-[11px] text-muted leading-tight block mt-0.5">
                    Kirim pesan penawaran dan harga tawar realistis di katalog proyek UMKM.
                  </span>
                </div>
              </div>

              <div className="bg-surface p-3 rounded-xl border border-border flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-dark-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  2
                </div>
                <div>
                  <span className="text-xs font-bold text-dark-900 block">Kerjakan & Serahkan Hasil</span>
                  <span className="text-[11px] text-muted leading-tight block mt-0.5">
                    Saat diterima, dana escrow terkunci. Kerjakan proyek lalu unggah berkas hasil deliverable.
                  </span>
                </div>
              </div>

              <div className="bg-surface p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  3
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Persetujuan & Honor Cair</span>
                  <span className="text-[11px] text-emerald-800/80 leading-tight block mt-0.5">
                    Klien menyetujui berkas dan honor 100% otomatis masuk ke saldo dompet Anda untuk ditarik.
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-dark-900/30 transition-all duration-200 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
              {isUmkm ? "Total Proyek" : "Total Dilamar"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-canvas border border-border/80 flex items-center justify-center text-dark-900">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-dark-900 font-sans tracking-tight">
              {isUmkm ? myProjects.length : proposals.length}
            </span>
            <p className="text-[11px] text-muted mt-0.5">
              {isUmkm ? "Inisiatif terdaftar" : "Lamaran terkirim"}
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-dark-900/30 transition-all duration-200 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
              Sedang Berjalan
            </span>
            <div className="w-7 h-7 rounded-lg bg-canvas border border-border/80 flex items-center justify-center text-brand-indigo">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-dark-900 font-sans tracking-tight">
              {isUmkm ? projectCounts.inProgress : proposalCounts.inProgress}
            </span>
            <p className="text-[11px] text-muted mt-0.5">
              {isUmkm ? "Proses pengerjaan mhs" : "Proyek aktif Anda"}
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-emerald-200 hover:border-emerald-400 transition-all duration-200 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Selesai & Lunas
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <CheckCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-sans tracking-tight">
              {isUmkm ? projectCounts.completed : proposalCounts.completed}
            </span>
            <p className="text-[11px] text-emerald-700/80 mt-0.5 font-medium">
              {isUmkm ? "Deliverable disetujui" : "Honor masuk dompet"}
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-dark-900/30 transition-all duration-200 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block">
              {isUmkm ? "Masa Penawaran" : "Menunggu Seleksi"}
            </span>
            <div className="w-7 h-7 rounded-lg bg-canvas border border-border/80 flex items-center justify-center text-dark-900">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-dark-900 font-sans tracking-tight">
              {isUmkm ? projectCounts.open : proposalCounts.pending}
            </span>
            <p className="text-[11px] text-muted mt-0.5">
              {isUmkm ? "Terbuka untuk pelamar" : "Evaluasi klien"}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Search Bar & Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isUmkm
                ? "Cari judul proyek atau kategori..."
                : "Cari judul proyek, pesan penawaran..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted focus:outline-none focus:border-dark-900 font-sans"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(isUmkm
            ? [
                { key: "ALL", label: "Semua Proyek", count: projectCounts.all },
                { key: "OPEN", label: "Penawaran Masuk", count: projectCounts.open },
                { key: "IN_PROGRESS", label: "Sedang Berjalan", count: projectCounts.inProgress },
                { key: "COMPLETED", label: "Selesai", count: projectCounts.completed, isGreen: true },
              ]
            : [
                { key: "ALL", label: "Semua Lamaran", count: proposalCounts.all },
                { key: "PENDING", label: "Menunggu Seleksi", count: proposalCounts.pending },
                { key: "IN_PROGRESS", label: "Sedang Dikerjakan", count: proposalCounts.inProgress },
                { key: "COMPLETED", label: "Selesai", count: proposalCounts.completed, isGreen: true },
                { key: "REJECTED", label: "Ditolak", count: proposalCounts.rejected },
              ]
          ).map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                  isActive
                    ? "bg-dark-900 text-white border-dark-900 shadow-xs"
                    : tab.isGreen
                      ? "bg-surface text-emerald-800 border-border hover:border-emerald-300"
                      : "bg-surface text-muted hover:text-dark-900 border-border"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-canvas text-muted border border-border"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. UMKM VIEW (Manage Projects, Incoming Proposals, & Deliverables) */}
      {/* ========================================================================= */}
      {isUmkm ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Project Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-dark-900">
                Pilih Proyek ({filteredProjects.length})
              </h3>
              <span className="text-[11px] text-muted">
                Hal {currentPage} dari {totalProjectPages}
              </span>
            </div>

            {loading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-20 bg-surface rounded-2xl border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : myProjects.length === 0 ? (
              <Card className="p-6 text-center space-y-3 bg-surface border-border">
                <Briefcase className="w-8 h-8 text-muted mx-auto opacity-40" />
                <h4 className="text-xs font-bold text-dark-900">
                  Belum Ada Proyek
                </h4>
                <p className="text-[11px] text-muted">
                  Pasang proyek usaha Anda untuk menerima proposal.
                </p>
                <Link to="/projects/new">
                  <Button
                    variant="brand"
                    size="sm"
                    className="w-full text-xs font-bold shadow-brand"
                  >
                    Pasang Proyek
                  </Button>
                </Link>
              </Card>
            ) : filteredProjects.length === 0 ? (
              <Card className="p-6 text-center space-y-2 bg-surface border-border">
                <p className="text-xs font-bold text-dark-900">
                  Tidak Ada Proyek pada Filter Ini
                </p>
                <p className="text-[11px] text-muted">
                  Coba ubah tab filter atau kata kunci pencarian Anda.
                </p>
              </Card>
            ) : (
              <div className="space-y-2.5">
                {paginatedProjects.map((proj) => {
                  const isSelected = selectedProject?.id === proj.id;
                  const isDone = proj.status === "DONE" || proj.status === "COMPLETED";

                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProject(proj)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        isSelected
                          ? "bg-dark-900 text-white border-dark-900 shadow-md"
                          : "bg-surface hover:bg-slate-50 border-border text-dark-900"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-canvas text-muted border border-border"
                          }`}
                        >
                          {proj.kategori}
                        </span>

                        <span
                          className={`text-[11px] font-extrabold flex items-center gap-1 ${
                            isSelected
                              ? "text-emerald-400"
                              : isDone
                                ? "text-emerald-700"
                                : "text-dark-900"
                          }`}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Selesai & Lunas
                            </>
                          ) : (
                            formatStatus(proj.status)
                          )}
                        </span>
                      </div>

                      <h4
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isSelected ? "text-white" : "text-dark-900"
                        }`}
                      >
                        {proj.judul}
                      </h4>

                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span
                          className={`font-semibold ${
                            isSelected ? "text-slate-300" : "text-muted"
                          }`}
                        >
                          Budget: {formatCurrency(proj.budget_max)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Left Column Pagination Controls */}
                {totalProjectPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="text-xs px-2.5 py-1 h-auto border-border"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
                      Prev
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalProjectPages }, (_, i) => i + 1).map((pg) => (
                        <button
                          key={pg}
                          onClick={() => setCurrentPage(pg)}
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                            currentPage === pg
                              ? "bg-dark-900 text-white"
                              : "bg-surface text-muted hover:text-dark-900 border border-border"
                          }`}
                        >
                          {pg}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalProjectPages, p + 1))}
                      disabled={currentPage === totalProjectPages}
                      className="text-xs px-2.5 py-1 h-auto border-border"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Project Inspection & Proposals List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {selectedProject ? (
              <div className="space-y-6">
                {/* Active Project Summary Card */}
                <Card className="p-6 space-y-4 bg-surface border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="brand">
                          {selectedProject.kategori}
                        </Badge>
                        <Badge
                          variant={
                            selectedProject.status === "DONE" || selectedProject.status === "COMPLETED"
                              ? "success"
                              : selectedProject.status === "IN_PROGRESS"
                                ? "brand"
                                : "warning"
                          }
                        >
                          {selectedProject.status === "DONE" || selectedProject.status === "COMPLETED"
                            ? "Selesai & Lunas"
                            : formatStatus(selectedProject.status)}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-dark-900 mt-1">
                        {selectedProject.judul}
                      </h3>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-muted block">
                        Batas Anggaran
                      </span>
                      <span className="text-lg font-black text-dark-900">
                        {formatCurrency(selectedProject.budget_max)}
                      </span>
                    </div>
                  </div>

                  {/* Submissions Section if in progress or completed */}
                  {projectSubmissions.length > 0 ? (
                    <div className="p-4 bg-surface border border-border border-l-4 border-l-dark-900 rounded-2xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              projectSubmissions[0].status === "APPROVED"
                                ? "text-emerald-600"
                                : "text-dark-900"
                            }`}
                          />
                          Berkas Hasil Kerja (Deliverable) Mahasiswa
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            projectSubmissions[0].status === "APPROVED" ||
                            projectSubmissions[0].status === "ACCEPTED"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : projectSubmissions[0].status === "REVISION_REQUESTED"
                                ? "border-amber-200 bg-amber-50 text-amber-900"
                                : "border-border bg-canvas text-dark-900"
                          }`}
                        >
                          {projectSubmissions[0].status === "APPROVED" ||
                          projectSubmissions[0].status === "ACCEPTED"
                            ? "Telah Disetujui & Selesai"
                            : projectSubmissions[0].status === "REVISION_REQUESTED"
                              ? `Permintaan Revisi (Ke-${projectSubmissions[0].jumlah_revisi}/2)`
                              : "Telah Diserahkan • Siap Direview"}
                        </span>
                      </div>

                      {projectSubmissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-canvas p-4 rounded-xl border border-border space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs font-bold text-dark-900">
                              Tautan Berkas Hasil Pekerjaan:
                            </span>
                            <a
                              href={sub.url_berkas}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 text-white text-xs font-bold hover:bg-dark-800 transition-colors shadow-xs"
                            >
                              Buka / Unduh Berkas Deliverable
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          {sub.catatan_pengiriman && (
                            <div className="text-xs text-dark-900/90 bg-surface p-3 rounded-lg border border-border">
                              <span className="font-bold text-dark-900 block mb-0.5">
                                Catatan Pengiriman Mahasiswa:
                              </span>
                              "{sub.catatan_pengiriman}"
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 text-[11px] text-muted">
                            <span>
                              Jumlah Revisi:{" "}
                              <b>{sub.jumlah_revisi || 0} dari 2 kali</b>
                            </span>
                            <span>
                              Diserahkan:{" "}
                              {formatDate(sub.submitted_at || sub.created_at)}
                            </span>
                          </div>

                          {/* Approval and Revision Actions (ONLY if IN_PROGRESS and NOT yet approved) */}
                          {selectedProject.status === "IN_PROGRESS" &&
                          sub.status !== "APPROVED" &&
                          sub.status !== "COMPLETED" && (
                            <div className="pt-3 border-t border-border flex flex-col sm:flex-row justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedSubmissionForRevision(sub);
                                  setRevisionModalOpen(true);
                                }}
                                disabled={sub.jumlah_revisi >= 2}
                                className="text-xs font-bold border-border text-dark-900 hover:bg-surface"
                              >
                                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                {sub.jumlah_revisi >= 2
                                  ? "Batas Revisi Habis (2/2)"
                                  : "Minta Revisi"}
                              </Button>
                              <Button
                                variant="brand"
                                size="sm"
                                onClick={() => handleApproveWork(sub.id)}
                                className="text-xs font-bold shadow-brand"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Setujui & Cairkan Honor Escrow
                              </Button>
                            </div>
                          )}

                          {/* Completed Success Banner */}
                          {(sub.status === "APPROVED" ||
                            sub.status === "COMPLETED" ||
                            selectedProject.status === "COMPLETED" ||
                            selectedProject.status === "DONE") && (
                            <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-900 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <div>
                                  <span className="font-bold block">
                                    Hasil pekerjaan disetujui & Proyek Selesai!
                                  </span>
                                  <span className="text-[11px] text-emerald-800">
                                    Dana honor escrow telah 100% diteruskan ke saldo dompet mahasiswa.
                                  </span>
                                </div>
                              </div>
                              <span className="font-extrabold uppercase text-[10px] px-2.5 py-1 rounded-full bg-emerald-600 text-white shrink-0 self-start sm:self-auto shadow-xs">
                                Lunas & Tuntas
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : selectedProject.status === "IN_PROGRESS" ? (
                    <div className="p-4 bg-canvas border border-border rounded-2xl flex items-center gap-3 shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-dark-900 shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-dark-900">
                        <span className="font-bold block">
                          Pengerjaan Sedang Berjalan
                        </span>
                        Mahasiswa sedang menyelesaikan proyek. Berkas deliverable akan muncul di sini begitu mahasiswa menyerahkannya.
                      </div>
                    </div>
                  ) : null}

                  {/* Incoming Proposals List */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-dark-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-brand-indigo" />
                      Pelamar Mahasiswa yang Masuk ({projectProposals.length})
                    </h4>

                    {projectProposals.length === 0 ? (
                      <div className="p-8 text-center bg-canvas rounded-2xl border border-border space-y-1">
                        <Users className="w-8 h-8 text-muted mx-auto opacity-40" />
                        <p className="text-xs font-bold text-dark-900">
                          Belum Ada Pelamar
                        </p>
                        <p className="text-[11px] text-muted">
                          Proyek Anda sedang tayang di katalog terbuka mahasiswa.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {projectProposals.map((prop) => {
                          const isAccepted = prop.status === "ACCEPTED";
                          const isRejected = prop.status === "REJECTED";
                          const isExpanded = expandedCards[prop.id];

                          return (
                            <div
                              key={prop.id}
                              className={`p-4 rounded-xl border transition-all ${
                                isAccepted
                                  ? "bg-emerald-50/20 border-emerald-200 shadow-xs"
                                  : isRejected
                                    ? "bg-canvas border-border opacity-70"
                                    : "bg-canvas border-border hover:border-dark-900/30"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="space-y-0.5">
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
                                    <span className="text-[11px] text-muted hidden sm:inline">
                                      • Estimasi: {prop.estimasi_hari} Hari
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-muted">
                                    {prop.mhs_profile?.asal_kampus ||
                                      "Perguruan Tinggi"}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                  <div className="text-left sm:text-right">
                                    <span className="text-sm font-extrabold text-dark-900">
                                      {formatCurrency(prop.harga_tawar)}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => toggleCard(prop.id)}
                                    className="text-xs font-bold text-dark-900 hover:underline flex items-center gap-0.5"
                                  >
                                    {isExpanded ? "Tutup" : "Rincian"}
                                    {isExpanded ? (
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="space-y-3 pt-3 mt-3 border-t border-border text-xs">
                                  <div className="bg-surface p-3 rounded-xl border border-border text-dark-900/90 leading-relaxed">
                                    <span className="font-bold text-dark-900 block mb-0.5">
                                      Rencana Kerja:
                                    </span>
                                    "{prop.cover_letter}"
                                  </div>

                                  {(selectedProject.status === "OPEN" ||
                                    selectedProject.status === "BIDDING") &&
                                    prop.status === "PENDING" && (
                                      <div className="flex justify-end gap-2 pt-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleRejectProposal(prop)
                                          }
                                          className="text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                                        >
                                          Tolak
                                        </Button>
                                        <Button
                                          variant="brand"
                                          size="sm"
                                          onClick={() =>
                                            handleAcceptProposal(prop)
                                          }
                                          className="text-xs font-bold shadow-brand"
                                        >
                                          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                          Terima & Kunci Escrow
                                        </Button>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 text-center text-muted bg-surface border-border">
                Pilih salah satu proyek di sebelah kiri untuk melihat rincian pelamar.
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 6. MAHASISWA VIEW (Linear-Style Modern Data List)                         */
        /* ========================================================================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-900">
              Daftar Lamaran Proposal ({filteredProposals.length})
            </h3>
            {totalProposalPages > 1 && (
              <span className="text-[11px] text-muted">
                Halaman {currentPage} dari {totalProposalPages}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-16 bg-surface rounded-2xl border border-border animate-pulse"
                />
              ))}
            </div>
          ) : filteredProposals.length === 0 ? (
            <Card className="text-center py-12 space-y-3 bg-surface border-border">
              <Briefcase className="w-10 h-10 text-muted mx-auto opacity-40" />
              <h3 className="text-sm font-bold text-dark-900">
                Belum Ada Lamaran Proposal pada Filter Ini
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Silakan jelajahi katalog proyek UMKM yang terbuka untuk mulai mengajukan penawaran.
              </p>
              <Link to="/projects">
                <Button
                  variant="brand"
                  size="sm"
                  className="mt-1 text-xs font-bold shadow-brand"
                >
                  Jelajah Proyek Terbuka
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs divide-y divide-border">
              {paginatedProposals.map((proposal) => {
                const isExpanded = expandedCards[proposal.id];
                const sub = mhsSubmissions[proposal.project_id];
                const isDone = sub?.status === "APPROVED" || proposal.status === "COMPLETED";

                const clientName = proposal.project_umkm_nama || "Mitra UMKM";
                const clientInitials = clientName
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "UM";

                return (
                  <div
                    key={proposal.id}
                    className={`transition-colors duration-150 ${
                      isExpanded ? "bg-canvas/60" : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Linear-Style Row */}
                    <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Client Avatar + Project Title & Details */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 border ${
                            isDone
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : proposal.status === "ACCEPTED"
                                ? "bg-dark-900 text-white border-dark-900"
                                : "bg-canvas text-dark-900 border-border"
                          }`}
                        >
                          {clientInitials}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {proposal.project_kategori && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-canvas border border-border text-dark-900 tracking-wider">
                                {proposal.project_kategori}
                              </span>
                            )}
                            <h4 className="text-sm font-bold text-dark-900 truncate">
                              {proposal.project_judul ||
                                `Lamaran Proyek #${proposal.project_id.slice(0, 8)}`}
                            </h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-muted">
                            <span>
                              Klien: <b className="text-dark-900 font-semibold">{clientName}</b>
                            </span>
                            <span>•</span>
                            <span>
                              Estimasi: <b className="text-dark-900">{proposal.estimasi_hari} Hari</b>
                            </span>
                            <span>•</span>
                            <span>Dikirim: {formatDate(proposal.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Micro Workflow Stepper (Linear-Style Tracker) */}
                      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-canvas border border-border text-[11px] font-semibold text-muted shrink-0 select-none">
                        <span className="flex items-center gap-1 text-dark-900 font-bold">
                          <CircleDot className="w-3 h-3 text-dark-900" />
                          1. Dilamar
                        </span>
                        <span className="text-muted/40 font-mono">→</span>
                        <span
                          className={`flex items-center gap-1 ${
                            proposal.status === "ACCEPTED" || isDone
                              ? "text-dark-900 font-bold"
                              : "opacity-40"
                          }`}
                        >
                          <CircleDot
                            className={`w-3 h-3 ${
                              proposal.status === "ACCEPTED" || isDone
                                ? "text-dark-900"
                                : "text-muted"
                            }`}
                          />
                          2. Pengerjaan
                        </span>
                        <span className="text-muted/40 font-mono">→</span>
                        <span
                          className={`flex items-center gap-1 ${
                            isDone ? "text-emerald-700 font-extrabold" : "opacity-40"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3 h-3 ${
                              isDone ? "text-emerald-600" : "text-muted"
                            }`}
                          />
                          3. Honor Cair
                        </span>
                      </div>

                      {/* Right: Nominal Honor + Status Pill + Expand Button */}
                      <div className="flex items-center justify-between lg:justify-end gap-3.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                            Harga Tawar
                          </span>
                          <span
                            className={`text-base sm:text-lg font-extrabold font-sans tracking-tight ${
                              isDone ? "text-emerald-700" : "text-dark-900"
                            }`}
                          >
                            {formatCurrency(proposal.harga_tawar)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Modern Status Badge with Dot Indicator */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              isDone
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : proposal.status === "ACCEPTED"
                                  ? "bg-dark-900 text-white border-dark-900"
                                  : proposal.status === "REJECTED"
                                    ? "bg-rose-50 text-rose-800 border-rose-200"
                                    : "bg-canvas text-dark-900 border-border"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isDone
                                  ? "bg-emerald-500"
                                  : proposal.status === "ACCEPTED"
                                    ? "bg-emerald-400"
                                    : proposal.status === "REJECTED"
                                      ? "bg-rose-500"
                                      : "bg-amber-500"
                              }`}
                            />
                            {isDone
                              ? "Selesai & Cair"
                              : proposal.status === "ACCEPTED"
                                ? "Sedang Dikerjakan"
                                : formatStatus(proposal.status)}
                          </span>

                          <button
                            onClick={() => toggleCard(proposal.id)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                              isExpanded
                                ? "bg-dark-900 text-white border-dark-900"
                                : "bg-canvas border-border text-dark-900 hover:bg-surface"
                            }`}
                          >
                            {isExpanded ? "Tutup" : "Rincian"}
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Inline Detail Panel */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-border/80 bg-canvas/40 space-y-3.5 text-xs">
                        <div className="bg-surface p-4 rounded-xl border border-border space-y-1">
                          <span className="font-bold text-dark-900 block text-xs">
                            Pesan Penawaran & Rencana Kerja Anda:
                          </span>
                          <p className="text-dark-900/90 leading-relaxed">
                            "{proposal.cover_letter}"
                          </p>
                        </div>

                        {proposal.status === "ACCEPTED" && (
                          <div className="space-y-3">
                            {sub ? (
                              <div className="p-4 rounded-xl border border-border bg-surface space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-dark-900">
                                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                                    {isDone
                                      ? "Hasil Pekerjaan Disetujui • Selesai"
                                      : sub.status === "REVISION_REQUESTED"
                                        ? `Permintaan Revisi dari Klien (Ke-${sub.jumlah_revisi}/2)`
                                        : "Berkas Deliverable Terkirim • Menunggu Review"}
                                  </span>
                                  <span className="text-[11px] text-muted">
                                    Diserahkan: {formatDate(sub.submitted_at || sub.created_at)}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-2 p-3 bg-canvas border border-border rounded-lg text-xs">
                                  <div className="flex items-center gap-2 truncate">
                                    <ExternalLink className="w-4 h-4 text-dark-900 shrink-0" />
                                    <a
                                      href={sub.url_berkas}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="font-semibold text-dark-900 hover:underline truncate"
                                    >
                                      {sub.url_berkas}
                                    </a>
                                  </div>
                                  <a
                                    href={sub.url_berkas}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded-md bg-dark-900 text-white text-[11px] font-bold hover:bg-dark-800 shrink-0"
                                  >
                                    Buka
                                  </a>
                                </div>

                                {sub.catatan_pengiriman && (
                                  <p className="text-xs text-dark-900/80 italic bg-canvas p-3 rounded-lg border border-border">
                                    "{sub.catatan_pengiriman}"
                                  </p>
                                )}

                                {isDone && (
                                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                      <div>
                                        <span className="font-extrabold text-emerald-950 text-xs block">
                                          Proyek Selesai! Honor {formatCurrency(proposal.harga_tawar)} Telah Cair.
                                        </span>
                                        <span className="text-[11px] text-emerald-800">
                                          Dana telah masuk 100% ke saldo dompet aktif Anda dan dapat langsung ditarik.
                                        </span>
                                      </div>
                                    </div>
                                    <Link to="/wallet" className="shrink-0 self-start sm:self-auto">
                                      <Button
                                        variant="brand"
                                        size="sm"
                                        className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white"
                                      >
                                        Buka Dompet
                                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                      </Button>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2.5 text-xs text-dark-900 font-medium p-3.5 bg-surface rounded-xl border border-border">
                                <ShieldCheck className="w-5 h-5 text-dark-900 shrink-0" />
                                <span>
                                  Dana escrow sebesar{" "}
                                  <b>{formatCurrency(proposal.harga_tawar)}</b>{" "}
                                  telah dikunci aman oleh klien. Silakan unggah berkas hasil kerja saat sudah selesai.
                                </span>
                              </div>
                            )}

                            {!isDone && (
                              <div className="flex justify-end pt-1">
                                <Button
                                  variant="brand"
                                  size="sm"
                                  onClick={() => handleOpenSubmission(proposal.project_id)}
                                  className="w-full sm:w-auto text-xs font-bold shadow-brand"
                                >
                                  <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                                  {sub
                                    ? sub.status === "REVISION_REQUESTED"
                                      ? "Kirim Revisi Hasil Kerja"
                                      : "Perbarui / Kirim Ulang Deliverable"
                                    : "Unggah / Serahkan Hasil Kerja"}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mahasiswa Proposal List Pagination Controls */}
          {totalProposalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-border bg-surface p-4 rounded-2xl">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-xs font-bold border-border"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Sebelumnya
              </Button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalProposalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                      currentPage === pg
                        ? "bg-dark-900 text-white shadow-xs"
                        : "bg-canvas text-muted hover:text-dark-900 border border-border"
                    }`}
                  >
                    {pg}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalProposalPages, p + 1))}
                disabled={currentPage === totalProposalPages}
                className="text-xs font-bold border-border"
              >
                Berikutnya
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Submission Modal for Student */}
      {selectedProjectId && (
        <SubmissionModal
          isOpen={submissionModalOpen}
          onClose={() => setSubmissionModalOpen(false)}
          projectId={selectedProjectId}
          onSuccess={loadData}
        />
      )}

      {/* Rating Modal for UMKM */}
      {selectedProject && (
        <RatingModal
          isOpen={ratingModalOpen}
          onClose={() => setRatingModalOpen(false)}
          projectId={selectedProject.id}
          keUserId={
            projectProposals.find((p) => p.status === "ACCEPTED")?.mhs_id
          }
          recipientName={
            projectProposals.find((p) => p.status === "ACCEPTED")?.mhs_profile
              ?.nama_lengkap || "Mahasiswa Pelaksana"
          }
          onSuccess={loadData}
        />
      )}

      {/* Revision Modal for UMKM */}
      {selectedSubmissionForRevision && (
        <RevisionModal
          isOpen={revisionModalOpen}
          onClose={() => {
            setRevisionModalOpen(false);
            setSelectedSubmissionForRevision(null);
          }}
          submissionId={selectedSubmissionForRevision.id}
          currentRevisions={selectedSubmissionForRevision.jumlah_revisi || 0}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
