import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { proposalApi, projectApi, submissionApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { useAlertStore } from "../../store/alertStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SubmissionModal } from "../../components/features/SubmissionModal";
import { RatingModal } from "../../components/features/RatingModal";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
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

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
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
        submissionApi.getByProject(projectId).catch(() => ({ data: [] })),
      ]);
      setProjectProposals(propRes.data);
      setProjectSubmissions(subRes.data);
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
            "Status proyek kini menjadi IN_PROGRESS dan dana escrow telah dikunci.",
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
        return <Badge variant="success">Disetujui • Proyek Berjalan</Badge>;
      case "PENDING":
        return <Badge variant="warning">Menunggu Keputusan</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Ditolak</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
            {isUmkm
              ? "Pusat Manajemen Proyek UMKM"
              : "Papan Pelamar & Pengerjaan"}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-1">
            {isUmkm
              ? "Kelola Proyek & Pelamar Masuk"
              : "Proposal & Pengerjaan Proyek"}
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans mt-1">
            {isUmkm
              ? "Evaluasi proposal masuk dari mahasiswa, setujui penawaran untuk mengunci dana escrow, dan periksa berkas deliverable."
              : "Pantau status lamaran kerja, penawaran harga, dan serahkan hasil deliverable untuk pencairan honor escrow."}
          </p>
        </div>

        {isUmkm && (
          <Link to="/projects/new">
            <Button
              variant="brand"
              size="md"
              className="shadow-brand text-xs font-bold shrink-0"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Pasang Proyek Baru
            </Button>
          </Link>
        )}
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
                          {proj.status}
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
                            selectedProject.status === "IN_PROGRESS"
                              ? "success"
                              : "warning"
                          }
                        >
                          Status: {selectedProject.status}
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
                  {projectSubmissions.length > 0 && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Berkas Deliverable Masuk dari Mahasiswa
                        </span>
                        <Badge variant="success">Telah Diserahkan</Badge>
                      </div>

                      {projectSubmissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted">
                              Tautan Berkas:
                            </span>
                            <a
                              href={sub.url_berkas}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-brand-indigo hover:underline flex items-center gap-1"
                            >
                              Buka File Deliverable{" "}
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          {sub.catatan_pengiriman && (
                            <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg italic">
                              "{sub.catatan_pengiriman}"
                            </p>
                          )}

                          {selectedProject.status === "IN_PROGRESS" && (
                            <div className="pt-2 flex justify-end gap-2">
                              <Button
                                variant="brand"
                                size="sm"
                                onClick={() => handleApproveWork(sub.id)}
                                className="text-xs font-bold shadow-brand"
                              >
                                Setujui & Cairkan Honor Escrow
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

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
                      <div className="space-y-3">
                        {projectProposals.map((prop) => (
                          <div
                            key={prop.id}
                            className="p-4 rounded-2xl bg-canvas border border-border space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
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
                                    {prop.status}
                                  </Badge>
                                </div>
                                <span className="text-[11px] text-muted">
                                  NIM: {prop.mhs_profile?.nim || "1221xxxx"} •
                                  Estimasi: {prop.estimasi_hari} Hari
                                </span>
                              </div>

                              <div className="text-left sm:text-right">
                                <span className="text-sm font-black text-dark-900">
                                  {formatCurrency(prop.harga_tawar)}
                                </span>
                              </div>
                            </div>

                            <div className="bg-surface p-3 rounded-xl border border-border text-xs text-slate-700 leading-relaxed font-normal">
                              "{prop.cover_letter}"
                            </div>

                            {prop.status === "PENDING" &&
                              (selectedProject.status === "OPEN" ||
                                selectedProject.status === "BIDDING") && (
                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRejectProposal(prop)}
                                    className="text-xs font-bold text-rose-600 border-rose-200"
                                  >
                                    Tolak
                                  </Button>
                                  <Button
                                    variant="brand"
                                    size="sm"
                                    onClick={() => handleAcceptProposal(prop)}
                                    className="text-xs font-bold shadow-brand"
                                  >
                                    Terima & Kunci Escrow
                                  </Button>
                                </div>
                              )}
                          </div>
                        ))}
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
        <div className="space-y-6">
          {/* Tabs Filter */}
          <div className="flex items-center gap-2 border-b border-border pb-3">
            {[
              { key: "ALL", label: `Semua (${proposals.length})` },
              {
                key: "ACCEPTED",
                label: `Disetujui / Berjalan (${proposals.filter((p) => p.status === "ACCEPTED").length})`,
              },
              {
                key: "PENDING",
                label: `Menunggu (${proposals.filter((p) => p.status === "PENDING").length})`,
              },
              {
                key: "REJECTED",
                label: `Ditolak (${proposals.filter((p) => p.status === "REJECTED").length})`,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-dark-900 text-white"
                    : "text-muted hover:text-dark-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-32 bg-surface rounded-card border border-border animate-pulse"
                />
              ))}
            </div>
          ) : proposals.filter(
              (p) => activeTab === "ALL" || p.status === activeTab,
            ).length === 0 ? (
            <Card className="text-center py-16 space-y-3 bg-surface border-border">
              <Briefcase className="w-12 h-12 text-muted mx-auto opacity-40" />
              <h3 className="text-base font-bold text-dark-900">
                Belum Ada Proposal pada Kategori Ini
              </h3>
              <p className="text-xs text-muted max-w-sm mx-auto">
                Silakan jelajahi katalog proyek UMKM yang terbuka dan kirimkan
                proposal penawaran Anda.
              </p>
              <Link to="/projects">
                <Button
                  variant="brand"
                  size="sm"
                  className="mt-2 text-xs font-bold shadow-brand"
                >
                  Jelajah Proyek Terbuka
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {proposals
                .filter((p) => activeTab === "ALL" || p.status === activeTab)
                .map((proposal) => (
                  <Card
                    key={proposal.id}
                    className="p-5 sm:p-6 space-y-4 bg-surface border-border"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {statusBadge(proposal.status)}
                          <span className="text-xs text-muted">
                            Dikirim: {formatDate(proposal.created_at)}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-dark-900">
                          Penawaran Proyek #{proposal.project_id.slice(0, 8)}
                        </h3>
                      </div>

                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-1 text-right">
                        <span className="text-xs text-muted uppercase tracking-wider font-semibold">
                          Harga Tawar
                        </span>
                        <span className="text-lg font-black text-dark-900">
                          {formatCurrency(proposal.harga_tawar)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-canvas border border-border p-3.5 rounded-xl text-xs text-dark-900/90 leading-relaxed font-normal">
                      <span className="font-bold text-dark-900 block mb-1">
                        Pesan & Rencana Kerja:
                      </span>
                      "{proposal.cover_letter}"
                    </div>

                    {proposal.status === "ACCEPTED" && (
                      <div className="pt-3 border-t border-border space-y-3">
                        {mhsSubmissions[proposal.project_id] ? (
                          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {mhsSubmissions[proposal.project_id]
                                    .status === "ACCEPTED"
                                    ? "Hasil Kerja Disetujui • Selesai"
                                    : mhsSubmissions[proposal.project_id]
                                          .status === "REVISION_REQUESTED"
                                      ? `Permintaan Revisi (Ke-${mhsSubmissions[proposal.project_id].jumlah_revisi})`
                                      : "Hasil Kerja Terkirim • Menunggu Review"}
                                </span>
                              </div>
                              <span className="text-[11px] text-muted">
                                Diserahkan:{" "}
                                {formatDate(
                                  mhsSubmissions[proposal.project_id]
                                    .submitted_at ||
                                    mhsSubmissions[proposal.project_id]
                                      .created_at,
                                )}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 p-2.5 bg-white border border-emerald-100 rounded-lg text-xs">
                              <ExternalLink className="w-4 h-4 text-emerald-600 shrink-0" />
                              <a
                                href={
                                  mhsSubmissions[proposal.project_id].url_berkas
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-emerald-700 hover:underline truncate max-w-full"
                              >
                                {mhsSubmissions[proposal.project_id].url_berkas}
                              </a>
                            </div>

                            {mhsSubmissions[proposal.project_id]
                              .catatan_pengiriman && (
                              <p className="text-xs text-dark-900/80 italic bg-canvas/60 p-2 rounded border border-border/50">
                                "
                                {
                                  mhsSubmissions[proposal.project_id]
                                    .catatan_pengiriman
                                }
                                "
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              Dana escrow sebesar{" "}
                              <b>{formatCurrency(proposal.harga_tawar)}</b>{" "}
                              sudah dikunci aman oleh klien.
                            </span>
                          </div>
                        )}

                        <div className="flex justify-end">
                          <Button
                            variant="brand"
                            size="sm"
                            onClick={() =>
                              handleOpenSubmission(proposal.project_id)
                            }
                            className="w-full sm:w-auto text-xs font-bold shadow-brand"
                          >
                            <UploadCloud className="w-3.5 h-3.5 mr-1" />
                            {mhsSubmissions[proposal.project_id]
                              ? mhsSubmissions[proposal.project_id].status ===
                                "REVISION_REQUESTED"
                                ? "Kirim Revisi Hasil Kerja"
                                : "Perbarui / Kirim Ulang Hasil Kerja"
                              : "Unggah / Serahkan Hasil Kerja"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
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
    </div>
  );
}
