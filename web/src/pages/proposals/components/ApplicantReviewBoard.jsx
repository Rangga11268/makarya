import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate, isExpired } from "../../../utils/formatDate";
import {
  ArrowLeft,
  Briefcase,
  Users,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Search,
  Building2,
  Sparkles,
} from "lucide-react";

export function ApplicantReviewBoard({
  project,
  proposals = [],
  onBack,
  onAcceptProposal,
  onRejectProposal,
  parseCoverLetter,
  allProjects = [],
  onSelectProject,
}) {
  const [briefExpanded, setBriefExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL"); // 'ALL' | 'PENDING' | 'REJECTED'
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    return {
      all: proposals.length,
      pending: proposals.filter((p) => p.status === "PENDING").length,
      rejected: proposals.filter(
        (p) => p.status === "REJECTED" || p.status === "WITHDRAWN",
      ).length,
    };
  }, [proposals]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const mhsName = p.mhs_profile?.nama_lengkap || "";
      const campus = p.mhs_profile?.asal_kampus || "";
      const cover = p.cover_letter || "";

      const matchSearch =
        mhsName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cover.toLowerCase().includes(searchQuery.toLowerCase());

      const matchFilter =
        statusFilter === "ALL" ||
        (statusFilter === "PENDING" && p.status === "PENDING") ||
        (statusFilter === "REJECTED" &&
          (p.status === "REJECTED" || p.status === "WITHDRAWN"));

      return matchSearch && matchFilter;
    });
  }, [proposals, searchQuery, statusFilter]);

  const isProjectExpired = project?.deadline && isExpired(project.deadline);

  return (
    <div className="space-y-5 font-sans animate-in fade-in duration-200">
      {/* 1. Header Navigation & Project Quick Switcher */}
      <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="text-xs font-bold text-dark-900 border-border hover:bg-slate-100 flex items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Semua Proyek</span>
            </Button>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Tahap Seleksi Pelamar
              </span>
            </div>
          </div>

          {/* Quick Switcher if UMKM has multiple projects */}
          {allProjects.length > 1 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-muted text-[11px] font-bold uppercase tracking-wider hidden md:inline">
                Pindah Proyek:
              </span>
              <select
                value={project?.id || ""}
                onChange={(e) => {
                  const found = allProjects.find(
                    (p) => p.id === e.target.value,
                  );
                  if (found && onSelectProject) onSelectProject(found);
                }}
                className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-canvas border border-border text-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-indigo max-w-[200px] sm:max-w-xs truncate"
              >
                {allProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.judul}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Project Title & Key Metrics Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                {project?.kategori || "UMKM DIGITAL"}
              </span>
              <span className="text-muted/60 text-xs">•</span>
              <span className="text-[11px] text-muted">
                Dibuat {formatDate(project?.created_at)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark-900 leading-tight">
              {project?.judul}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="bg-canvas border border-border px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted uppercase block">
                Pagu Anggaran:
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-dark-900">
                {formatCurrency(project?.budget_max)}
              </span>
            </div>

            <div className="bg-canvas border border-border px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted" />
              <span className="text-xs font-semibold text-dark-900">
                Tenggat: {formatDate(project?.deadline)}
              </span>
            </div>

            <Link
              to={`/projects/${project?.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-canvas border border-border text-brand-indigo font-bold text-xs hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <span>Lihat Detail Katalog</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 2. Collapsible Project Brief Accordion */}
        <div className="border-t border-border pt-3">
          <button
            type="button"
            onClick={() => setBriefExpanded(!briefExpanded)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-canvas hover:bg-slate-100/80 transition-colors text-xs font-bold text-dark-900"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-indigo" />
              <span>Ringkasan Brief Proyek & Kriteria yang Anda Pasang</span>
            </div>
            <div className="flex items-center gap-1 text-muted text-[11px] font-semibold">
              <span>
                {briefExpanded ? "Tutup Brief" : "Buka Brief Lengkap"}
              </span>
              {briefExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {briefExpanded && (
            <div className="mt-3 p-4 bg-canvas rounded-2xl border border-border text-xs text-dark-900 space-y-3 animate-in fade-in duration-150">
              <div>
                <span className="font-bold text-muted text-[10px] uppercase block mb-1">
                  Deskripsi Kebutuhan Pekerjaan:
                </span>
                <p className="whitespace-pre-wrap leading-relaxed text-dark-900/90 font-medium">
                  {project?.deskripsi_raw ||
                    project?.deskripsi ||
                    "Tidak ada deskripsi detail tambahan."}
                </p>
              </div>

              {project?.tipe_kolaborasi === "TIM" &&
                project?.slots?.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <span className="font-bold text-muted text-[10px] uppercase block mb-2">
                      Formasi Peran Tim ({project.slots.length} Posisi):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {project.slots.map((s) => (
                        <div
                          key={s.id}
                          className="p-2.5 rounded-xl bg-surface border border-border text-[11px]"
                        >
                          <span className="font-bold text-dark-900 block">
                            {s.nama_peran}
                          </span>
                          <span className="text-muted text-[10px] block">
                            Alokasi: {formatCurrency(s.alokasi_budget)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Applicant Filter & Screening Workspace */}
      <div className="space-y-4">
        {/* Search & Tabs Bar */}
        <div className="bg-surface rounded-3xl border border-border p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama mahasiswa, kampus, atau cover letter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-canvas border border-border rounded-2xl text-dark-900 placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand-indigo font-sans transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`py-1.5 px-3 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                statusFilter === "ALL"
                  ? "bg-dark-900 text-white shadow-xs"
                  : "bg-canvas border border-border text-muted hover:text-dark-900"
              }`}
            >
              <span>Semua Pelamar</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`py-1.5 px-3 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                statusFilter === "PENDING"
                  ? "bg-dark-900 text-white shadow-xs"
                  : "bg-canvas border border-border text-muted hover:text-dark-900"
              }`}
            >
              <span>Menunggu Seleksi</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                {counts.pending}
              </span>
            </button>

            {counts.rejected > 0 && (
              <button
                onClick={() => setStatusFilter("REJECTED")}
                className={`py-1.5 px-3 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                  statusFilter === "REJECTED"
                    ? "bg-dark-900 text-white shadow-xs"
                    : "bg-canvas border border-border text-muted hover:text-dark-900"
                }`}
              >
                <span>Ditolak / Ditarik</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                  {counts.rejected}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* List of Applicant Proposals */}
        {filteredProposals.length === 0 ? (
          <div className="bg-surface rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-canvas border border-border flex items-center justify-center text-muted mx-auto">
              <Users className="w-7 h-7 text-brand-indigo" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-dark-900">
                {proposals.length === 0
                  ? "Belum Ada Proposal Masuk"
                  : "Tidak Ada Pelamar yang Sesuai Filter"}
              </h3>
              <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                {proposals.length === 0
                  ? "Proyek Anda telah aktif di katalog terbuka mahasiswa. Saat mahasiswa kampus mengajukan tawaran, portofolio dan surat pengantar mereka akan tampil di sini untuk Anda evaluasi."
                  : "Coba ganti kata kunci pencarian atau ubah tab status untuk melihat pelamar lainnya."}
              </p>
            </div>
            {proposals.length === 0 && (
              <div className="pt-2">
                <Link to={`/projects/${project?.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold"
                  >
                    <span>Lihat Tayangan Proyek</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredProposals.map((prop) => {
              const isAccepted = prop.status === "ACCEPTED";
              const isRejected = prop.status === "REJECTED";
              const isWithdrawn = prop.status === "WITHDRAWN";
              const isPending = prop.status === "PENDING";
              const parsed = parseCoverLetter
                ? parseCoverLetter(prop.cover_letter)
                : { text: prop.cover_letter, tools: [], portfolio: null };

              return (
                <div
                  key={prop.id}
                  className={`bg-surface rounded-3xl border p-5 sm:p-6 shadow-xs transition-all ${
                    isAccepted
                      ? "border-emerald-300 bg-emerald-50/15"
                      : isRejected || isWithdrawn
                        ? "border-border opacity-70 bg-canvas/60"
                        : "border-border hover:border-dark-900/30"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Candidate Identity & Credentials */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {prop.mhs_profile?.url_foto ? (
                        <img
                          src={prop.mhs_profile.url_foto}
                          alt={prop.mhs_profile?.nama_lengkap || "Mahasiswa"}
                          className="w-12 h-12 rounded-2xl object-cover border border-border shadow-xs shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 flex items-center justify-center font-bold text-base shrink-0">
                          {(prop.mhs_profile?.nama_lengkap || "M")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-dark-900 truncate">
                            {prop.mhs_profile?.nama_lengkap ||
                              "Mahasiswa Talenta"}
                          </h3>
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              isAccepted
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : isRejected
                                  ? "bg-rose-50 text-rose-800 border-rose-200"
                                  : isWithdrawn
                                    ? "bg-amber-50 text-amber-800 border-amber-200"
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                            }`}
                          >
                            {isAccepted
                              ? "Disetujui"
                              : isRejected
                                ? "Ditolak"
                                : isWithdrawn
                                  ? "Proposal Ditarik"
                                  : "Menunggu Keputusan"}
                          </span>
                        </div>

                        <p className="text-xs text-muted flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-dark-900/80">
                            {prop.mhs_profile?.asal_kampus ||
                              "Perguruan Tinggi Terakreditasi"}
                          </span>
                          <span>•</span>
                          <span>
                            {prop.mhs_profile?.jurusan ||
                              "Program Studi Mahasiswa"}
                          </span>
                          {prop.mhs_profile?.semester && (
                            <>
                              <span>•</span>
                              <span>Semester {prop.mhs_profile.semester}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Offer Highlights: Price & Timeline */}
                    <div className="bg-canvas border border-border p-3.5 rounded-2xl flex items-center gap-5 shrink-0 self-start md:self-auto">
                      <div>
                        <span className="text-[10px] font-bold text-muted uppercase block">
                          Tawaran Biaya:
                        </span>
                        <span className="text-base sm:text-lg font-black text-dark-900">
                          {formatCurrency(prop.harga_tawar)}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div>
                        <span className="text-[10px] font-bold text-muted uppercase block">
                          Estimasi Kerja:
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-dark-900 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-muted" />
                          <span>{prop.estimasi_hari || 5} Hari</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proposal Pitch & Cover Letter */}
                  <div className="mt-4 p-4 rounded-2xl bg-canvas border border-border text-xs space-y-2.5 text-dark-900">
                    <span className="font-bold text-muted text-[10px] uppercase block">
                      Rencana & Penjelasan Mahasiswa:
                    </span>
                    <p className="whitespace-pre-wrap leading-relaxed font-medium text-dark-900/90">
                      {parsed.text}
                    </p>

                    {parsed.tools.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/70">
                        <span className="text-[10px] font-bold text-muted uppercase mr-1">
                          Keahlian:
                        </span>
                        {parsed.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-0.5 rounded-lg bg-brand-indigo/10 text-brand-indigo font-bold text-[10px] border border-brand-indigo/20"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}

                    {parsed.portfolio && (
                      <div className="pt-2 border-t border-border/70 flex items-center justify-between">
                        <a
                          href={parsed.portfolio}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-brand-indigo hover:underline font-bold text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Buka Tautan Portofolio Pendukung</span>
                        </a>
                        <span className="text-[10px] text-muted font-medium">
                          Tinjau karya sebelum menerima
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Withdrawn Notice */}
                  {isWithdrawn && (
                    <div className="mt-3 p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <FileText className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">
                          Mahasiswa Menarik Kembali Proposal:
                        </span>
                        <p className="text-[11px] italic font-medium mt-0.5">
                          "
                          {prop.withdraw_reason ||
                            "Mahasiswa membatalkan pengajuan proposal ini."}
                          "
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Row */}
                  {isPending && (
                    <div className="mt-4 pt-3.5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>
                          Menerima proposal akan otomatis mengunci dana di
                          Escrow dan membuka ruang obrolan kerja.
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRejectProposal(prop)}
                          className="text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50"
                        >
                          Tolak
                        </Button>
                        <Button
                          variant="brand"
                          size="sm"
                          onClick={() => onAcceptProposal(prop)}
                          className="text-xs font-bold shadow-brand"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                          Terima & Kunci Escrow
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
