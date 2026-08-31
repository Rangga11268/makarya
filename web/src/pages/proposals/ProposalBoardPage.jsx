import React, { useState, useEffect } from "react";
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
} from "lucide-react";

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

  // Search, Filter & Accordion states
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCard = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
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

  const statusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return <Badge variant="success">Disetujui • Sedang Dikerjakan</Badge>;
      case "PENDING":
        return <Badge variant="warning">Menunggu Keputusan</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Ditolak</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="brand">Sedang Dikerjakan</Badge>;
      case "REVIEW":
        return <Badge variant="warning">Dalam Peninjauan</Badge>;
      case "DONE":
      case "COMPLETED":
        return <Badge variant="success">Selesai</Badge>;
      default:
        return <Badge variant="default">{formatStatus(status)}</Badge>;
    }
  };

  // Filtered lists
  const filteredProjects = myProjects.filter((p) => {
    const matchSearch =
      p.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab =
      activeTab === "ALL" ||
      (activeTab === "IN_PROGRESS" && p.status === "IN_PROGRESS") ||
      (activeTab === "DONE" && (p.status === "DONE" || p.status === "COMPLETED")) ||
      (activeTab === "OPEN" && (p.status === "OPEN" || p.status === "BIDDING"));
    return matchSearch && matchTab;
  });

  const filteredProposals = proposals.filter((p) => {
    const matchSearch =
      (p.cover_letter && p.cover_letter.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.project_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === "ALL" || p.status === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 font-sans">
      {/* 1. Header & Quick Wallet Balance Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-5 sm:p-6 rounded-3xl border border-border shadow-xs">
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-indigo font-sans">
            {isUmkm ? "Pusat Kendali Proyek UMKM" : "Papan Pelamar & Pekerjaan Mahasiswa"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-dark-900 tracking-tight leading-tight">
            {isUmkm ? "Manajemen Proyek & Hasil Kerja" : "Proposal & Status Pengerjaan"}
          </h1>
          <p className="text-xs text-muted">
            {isUmkm
              ? "Kelola penawaran mahasiswa, periksa hasil kerja (deliverable), dan cairkan honor escrow."
              : "Pantau status pengajuan proposal, serahkan deliverable proyek, dan nikmati pencairan dana instan."}
          </p>
        </div>

        {/* Quick Wallet Card */}
        <div className="flex items-center gap-3 bg-canvas p-3.5 rounded-2xl border border-border shrink-0">
          <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
            <WalletIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted uppercase block">
              {isUmkm ? "Saldo Escrow Aktif" : "Saldo Siap Tarik"}
            </span>
            <span className="text-sm font-black text-dark-900">
              {wallet ? formatCurrency(isUmkm ? wallet.saldo_escrow : wallet.saldo_aktif) : "Rp 0"}
            </span>
          </div>
          <Link to="/wallet">
            <Button variant="brand" size="sm" className="text-xs font-bold shadow-brand ml-2">
              {isUmkm ? "Dompet" : "Tarik Dana"}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-muted block">
            {isUmkm ? "Total Proyek" : "Total Dilamar"}
          </span>
          <span className="text-xl sm:text-2xl font-black text-dark-900">
            {isUmkm ? myProjects.length : proposals.length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-amber-900 block">Sedang Berjalan</span>
          <span className="text-xl sm:text-2xl font-black text-amber-950">
            {isUmkm
              ? myProjects.filter((p) => p.status === "IN_PROGRESS").length
              : proposals.filter((p) => p.status === "ACCEPTED").length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-900 block">Selesai / Cair</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-950">
            {isUmkm
              ? myProjects.filter((p) => p.status === "DONE" || p.status === "COMPLETED").length
              : proposals.filter((p) => mhsSubmissions[p.project_id]?.status === "APPROVED").length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-700 block">
            {isUmkm ? "Masa Penawaran" : "Menunggu Review"}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-900">
            {isUmkm
              ? myProjects.filter((p) => p.status === "OPEN" || p.status === "BIDDING").length
              : proposals.filter((p) => p.status === "PENDING").length}
          </span>
        </div>
      </div>

      {/* 3. Search Bar & Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isUmkm
                ? "Cari berdasarkan judul proyek atau kategori..."
                : "Cari proposal atau pesan pengerjaan..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted focus:outline-none focus:border-brand-indigo"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(isUmkm
            ? [
                { key: "ALL", label: "Semua" },
                { key: "IN_PROGRESS", label: "Sedang Dikerjakan" },
                { key: "OPEN", label: "Penawaran" },
                { key: "DONE", label: "Selesai" },
              ]
            : [
                { key: "ALL", label: "Semua" },
                { key: "ACCEPTED", label: "Disetujui / Berjalan" },
                { key: "PENDING", label: "Menunggu" },
                { key: "REJECTED", label: "Ditolak" },
              ]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-dark-900 text-white shadow-xs"
                  : "bg-canvas text-muted hover:text-dark-900 border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. UMKM VIEW (Manage Projects, Incoming Proposals, & Deliverables) */}
      {/* ========================================================================= */}
      {isUmkm ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Project Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-900">
              Pilih Proyek Usaha Anda ({myProjects.length})
            </h3>

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
            ) : (
              <div className="space-y-2.5">
                {myProjects.map((proj) => {
                  const isSelected = selectedProject?.id === proj.id;
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
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-canvas text-muted border border-border"}`}
                        >
                          {proj.kategori}
                        </span>
                        <span
                          className={`text-[11px] font-bold ${isSelected ? "text-emerald-400" : "text-emerald-700"}`}
                        >
                          {formatStatus(proj.status)}
                        </span>
                      </div>
                      <h4
                        className={`text-xs sm:text-sm font-bold truncate ${isSelected ? "text-white" : "text-dark-900"}`}
                      >
                        {proj.judul}
                      </h4>
                      <div
                        className={`text-xs font-semibold mt-1 ${isSelected ? "text-slate-300" : "text-muted"}`}
                      >
                        Budget: {formatCurrency(proj.budget_max)}
                      </div>
                    </div>
                  );
                })}
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
                            selectedProject.status === "IN_PROGRESS" ||
                            selectedProject.status === "DONE" ||
                            selectedProject.status === "COMPLETED"
                              ? "success"
                              : "warning"
                          }
                        >
                          {formatStatus(selectedProject.status)}
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
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Berkas Hasil Kerja (Deliverable) dari Mahasiswa
                        </span>
                        <Badge variant="success">
                          {projectSubmissions[0].status === "APPROVED" ||
                          projectSubmissions[0].status === "ACCEPTED"
                            ? "Telah Disetujui & Selesai"
                            : projectSubmissions[0].status ===
                                "REVISION_REQUESTED"
                              ? `Permintaan Revisi (Ke-${projectSubmissions[0].jumlah_revisi}/2)`
                              : "Telah Diserahkan • Siap Direview"}
                        </Badge>
                      </div>

                      {projectSubmissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white p-4 rounded-xl border border-emerald-200 space-y-3 shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-xs font-bold text-dark-900">
                              Tautan Berkas Hasil Pekerjaan:
                            </span>
                            <a
                              href={sub.url_berkas}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                            >
                              Buka / Unduh Berkas Deliverable
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          {sub.catatan_pengiriman && (
                            <div className="text-xs text-dark-900/90 bg-canvas p-3 rounded-lg border border-border">
                              <span className="font-bold text-dark-900 block mb-0.5">
                                Catatan Pengiriman Mahasiswa:
                              </span>
                              "{sub.catatan_pengiriman}"
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 text-[11px] text-muted">
                            <span>
                              Jumlah Revisi Digunakan:{" "}
                              <b>{sub.jumlah_revisi || 0} dari 2 kali</b>
                            </span>
                            <span>
                              Diserahkan:{" "}
                              {formatDate(sub.submitted_at || sub.created_at)}
                            </span>
                          </div>

                          {selectedProject.status === "IN_PROGRESS" && (
                            <div className="pt-3 border-t border-border flex flex-col sm:flex-row justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedSubmissionForRevision(sub);
                                  setRevisionModalOpen(true);
                                }}
                                disabled={sub.jumlah_revisi >= 2}
                                className="text-xs font-bold border-amber-300 text-amber-900 hover:bg-amber-50"
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
                        </div>
                      ))}
                    </div>
                  ) : selectedProject.status === "IN_PROGRESS" ? (
                    <div className="p-4 bg-canvas border border-border rounded-2xl flex items-center gap-3">
                      <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                      <div className="text-xs text-dark-900">
                        <span className="font-bold block">
                          Pekerjaan Sedang Dikerjakan
                        </span>
                        Mahasiswa sedang menyelesaikan proyek ini. Tautan berkas
                        deliverable akan otomatis tampil di sini segera setelah
                        mahasiswa menyerahkan hasil pekerjaannya.
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
                          Proyek Anda sedang tayang di katalog terbuka
                          mahasiswa.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {projectProposals.map((prop) => {
                          const isExpanded = expandedCards[prop.id];
                          return (
                            <div
                              key={prop.id}
                              className="p-3.5 rounded-2xl bg-canvas border border-border space-y-2.5 transition-all"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-dark-900">
                                    {prop.mhs_profile?.nama_lengkap ||
                                      "Mahasiswa Pelamar"}
                                  </h5>
                                  <Badge
                                    variant={
                                      prop.status === "ACCEPTED"
                                        ? "success"
                                        : prop.status === "PENDING"
                                          ? "warning"
                                          : "danger"
                                    }
                                  >
                                    {formatStatus(prop.status)}
                                  </Badge>
                                  <span className="text-[11px] text-muted hidden sm:inline">
                                    • Estimasi: {prop.estimasi_hari} Hari
                                  </span>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3">
                                  <span className="text-xs sm:text-sm font-black text-dark-900">
                                    {formatCurrency(prop.harga_tawar)}
                                  </span>
                                  <button
                                    onClick={() => toggleCard(prop.id)}
                                    className="text-[11px] font-bold text-brand-indigo flex items-center gap-0.5 hover:underline"
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

                              {/* Collapsible Details */}
                              {isExpanded && (
                                <div className="space-y-2.5 pt-2 border-t border-border/70 text-xs">
                                  <div className="bg-surface p-3 rounded-xl border border-border text-dark-900/90 leading-relaxed">
                                    <span className="font-bold text-dark-900 block mb-0.5">
                                      Rencana Kerja:
                                    </span>
                                    "{prop.cover_letter}"
                                  </div>

                                  {selectedProject.status === "OPEN" &&
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
              <Card className="p-12 text-center text-muted">
                Pilih salah satu proyek di sebelah kiri untuk melihat rincian
                pelamar.
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. MAHASISWA VIEW (My Submitted Proposals & Work Submissions) */
        /* ========================================================================= */
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-24 bg-surface rounded-2xl border border-border animate-pulse"
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
                Silakan jelajahi katalog proyek UMKM yang terbuka untuk mulai
                mengajukan penawaran.
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
            <div className="space-y-3">
              {filteredProposals.map((proposal) => {
                const isExpanded = expandedCards[proposal.id];
                const sub = mhsSubmissions[proposal.project_id];
                const isDone = sub?.status === "APPROVED";

                return (
                  <Card
                    key={proposal.id}
                    className="p-4 sm:p-5 space-y-3 bg-surface border-border shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {statusBadge(proposal.status)}
                          <span className="text-[11px] text-muted">
                            Dikirim: {formatDate(proposal.created_at)}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-dark-900">
                          Lamaran Proyek #{proposal.project_id.slice(0, 8)}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-muted uppercase font-semibold block">
                            Harga Tawar
                          </span>
                          <span className="text-sm sm:text-base font-black text-dark-900">
                            {formatCurrency(proposal.harga_tawar)}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleCard(proposal.id)}
                          className="px-3 py-1.5 rounded-xl bg-canvas border border-border text-xs font-bold text-dark-900 flex items-center gap-1 hover:bg-slate-100"
                        >
                          {isExpanded ? "Sembunyikan" : "Buka Detail"}
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Accordion Body */}
                    {isExpanded && (
                      <div className="space-y-3 pt-3 border-t border-border text-xs">
                        <div className="bg-canvas border border-border p-3 rounded-xl text-dark-900/90 leading-relaxed">
                          <span className="font-bold text-dark-900 block mb-0.5">
                            Pesan Penawaran Anda:
                          </span>
                          "{proposal.cover_letter}"
                        </div>

                        {proposal.status === "ACCEPTED" && (
                          <div className="space-y-2.5">
                            {sub ? (
                              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-2.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {sub.status === "APPROVED" ||
                                    sub.status === "ACCEPTED"
                                      ? "Hasil Kerja Disetujui • Selesai"
                                      : sub.status === "REVISION_REQUESTED"
                                        ? `Permintaan Revisi (Ke-${sub.jumlah_revisi}/2)`
                                        : "Deliverable Terkirim • Menunggu Review"}
                                  </span>
                                  <span className="text-[11px] text-muted">
                                    Diserahkan:{" "}
                                    {formatDate(
                                      sub.submitted_at || sub.created_at,
                                    )}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 p-2.5 bg-white border border-emerald-100 rounded-lg text-xs">
                                  <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <a
                                    href={sub.url_berkas}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-emerald-700 hover:underline truncate"
                                  >
                                    {sub.url_berkas}
                                  </a>
                                </div>

                                {sub.catatan_pengiriman && (
                                  <p className="text-xs text-dark-900/80 italic bg-canvas/60 p-2 rounded border border-border/50">
                                    "{sub.catatan_pengiriman}"
                                  </p>
                                )}

                                {isDone && (
                                  <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl flex items-center justify-between gap-2">
                                    <span className="font-bold text-emerald-950">
                                      Honor{" "}
                                      {formatCurrency(proposal.harga_tawar)}{" "}
                                      telah masuk ke saldo aktif dompet Anda!
                                    </span>
                                    <Link to="/wallet">
                                      <Button
                                        variant="brand"
                                        size="sm"
                                        className="text-xs font-bold shadow-brand shrink-0"
                                      >
                                        Tarik Saldo
                                      </Button>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>
                                  Dana escrow sebesar{" "}
                                  <b>{formatCurrency(proposal.harga_tawar)}</b>{" "}
                                  telah dikunci aman oleh klien. Silakan unggah
                                  berkas hasil kerja saat sudah selesai.
                                </span>
                              </div>
                            )}

                            {!isDone && (
                              <div className="flex justify-end pt-1">
                                <Button
                                  variant="brand"
                                  size="sm"
                                  onClick={() =>
                                    handleOpenSubmission(proposal.project_id)
                                  }
                                  className="w-full sm:w-auto text-xs font-bold shadow-brand"
                                >
                                  <UploadCloud className="w-3.5 h-3.5 mr-1" />
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
                  </Card>
                );
              })}
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
          mhsId={selectedProject.mhs_id || user.id}
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
