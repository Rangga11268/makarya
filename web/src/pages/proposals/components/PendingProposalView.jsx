import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import {
  ArrowLeft,
  Clock,
  Building2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

export function PendingProposalView({
  proposal,
  onBack,
  onOpenResignModal,
  parseCoverLetter,
  allProposals = [],
  onSelectProposal,
}) {
  const isPending = proposal.status === "PENDING";
  const isRejected = proposal.status === "REJECTED";
  const isWithdrawn = proposal.status === "WITHDRAWN";

  const parsed = parseCoverLetter
    ? parseCoverLetter(proposal.cover_letter)
    : { text: proposal.cover_letter, tools: [], portfolio: null };

  return (
    <div className="space-y-5 font-sans animate-in fade-in duration-200">
      {/* 1. Header Navigation & Proposal Quick Switcher */}
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
              <span>Semua Lamaran</span>
            </Button>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                  isPending
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : isRejected
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : "bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                {isPending && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                )}
                {isPending
                  ? "Menunggu Seleksi Klien"
                  : isRejected
                    ? "Lamaran Tidak Terpilih"
                    : "Lamaran Ditarik"}
              </span>
            </div>
          </div>

          {/* Quick Switcher for multiple applications */}
          {allProposals.length > 1 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-muted text-[11px] font-bold uppercase tracking-wider hidden md:inline">
                Pindah Lamaran:
              </span>
              <select
                value={proposal?.id || ""}
                onChange={(e) => {
                  const found = allProposals.find(
                    (p) => p.id === e.target.value,
                  );
                  if (found && onSelectProposal) onSelectProposal(found);
                }}
                className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-canvas border border-border text-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-indigo max-w-[200px] sm:max-w-xs truncate"
              >
                {allProposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_judul || "Proyek Kolaborasi"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Title & Micro Information */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                {proposal.project_kategori || "KOLABORASI KAMPUS"}
              </span>
              <span className="text-muted/60 text-xs">•</span>
              <span className="text-[11px] text-muted">
                Diajukan {formatDate(proposal.created_at)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark-900 leading-tight">
              {proposal.project_judul || "Proyek UMKM"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="bg-canvas border border-border px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted uppercase block">
                Tawaran Anda:
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-dark-900">
                {formatCurrency(proposal.harga_tawar)}
              </span>
            </div>

            <div className="bg-canvas border border-border px-3.5 py-1.5 rounded-2xl flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-muted" />
              <span className="text-xs font-semibold text-dark-900">
                {proposal.estimasi_hari || 5} Hari Pengerjaan
              </span>
            </div>

            {proposal.project_id && (
              <Link
                to={`/projects/${proposal.project_id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-canvas border border-border text-brand-indigo font-bold text-xs hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <span>Lihat Halaman Proyek</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* 2. Lifecycle Status Stepper */}
        <div className="p-4 bg-canvas rounded-2xl border border-border mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-dark-900 block">
                  1. Lamaran Diajukan
                </span>
                <span className="text-[10px] text-muted">
                  Proposal telah masuk ke sistem
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isPending
                    ? "bg-amber-100 text-amber-800 border-2 border-amber-300"
                    : isRejected
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-200 text-slate-700"
                }`}
              >
                {isPending ? (
                  <Clock className="w-4 h-4 text-amber-700 animate-spin" />
                ) : isRejected ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-dark-900 block">
                  {isPending
                    ? "2. Peninjauan Klien UMKM"
                    : isRejected
                      ? "2. Evaluasi Selesai (Ditolak)"
                      : "2. Proposal Ditarik"}
                </span>
                <span className="text-[10px] text-muted">
                  {isPending
                    ? "Klien sedang mengevaluasi proposal"
                    : isRejected
                      ? "Klien memilih kandidat lain"
                      : "Anda telah membatalkan lamaran"}
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-slate-100 text-muted border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                3
              </div>
              <div>
                <span className="text-xs font-bold text-muted block">
                  3. Ruang Kerja & Obrolan
                </span>
                <span className="text-[10px] text-muted">
                  Aktif otomatis setelah disetujui
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Split Content: Left Proposal Detail, Right Client & Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: 2 Spans - Your Submitted Proposal */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface rounded-3xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-indigo" />
                <h3 className="text-sm font-bold text-dark-900">
                  Rincian Proposal yang Anda Kirimkan
                </h3>
              </div>
              <span className="text-[11px] font-bold text-dark-900 bg-canvas px-3 py-1 rounded-full border border-border">
                Tawaran: {formatCurrency(proposal.harga_tawar)}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-muted uppercase block mb-1">
                  Surat Pengantar & Pendekatan Pengerjaan:
                </span>
                <div className="p-4 bg-canvas rounded-2xl border border-border text-xs text-dark-900 leading-relaxed font-medium whitespace-pre-wrap">
                  {parsed.text}
                </div>
              </div>

              {parsed.tools.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-muted uppercase block mb-1.5">
                    Keahlian & Perangkat Terlampir:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {parsed.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 rounded-xl bg-brand-indigo/10 text-brand-indigo font-bold text-xs border border-brand-indigo/20"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {parsed.portfolio && (
                <div className="pt-2 border-t border-border">
                  <span className="text-[10px] font-bold text-muted uppercase block mb-1">
                    Portofolio Pendukung:
                  </span>
                  <a
                    href={parsed.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-canvas border border-border text-brand-indigo font-bold text-xs hover:bg-slate-100 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{parsed.portfolio}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Withdrawn Notice */}
            {isWithdrawn && (
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">
                  Anda telah menarik kembali proposal ini:
                </span>
                <p className="italic text-[11px] text-amber-950 font-medium">
                  "{proposal.withdraw_reason || "Tidak ada alasan tertulis."}"
                </p>
              </div>
            )}

            {/* Withdraw Action (if still PENDING) */}
            {isPending && onOpenResignModal && (
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] text-muted leading-relaxed">
                  Ingin mengubah tawaran atau berhalangan mengerjakan? Anda
                  dapat menarik kembali proposal sebelum klien menyetujui.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenResignModal}
                  className="text-xs font-bold text-amber-800 border-amber-300 hover:bg-amber-50 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  <span>Tarik Proposal</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 1 Span - Client Profile & Brief Snapshot */}
        <div className="space-y-4">
          <div className="bg-surface rounded-3xl border border-border p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Profil Klien UMKM
            </h3>

            <div className="flex items-center gap-3 p-3 bg-canvas rounded-2xl border border-border">
              {proposal.project_umkm_foto || proposal.umkm_foto ? (
                <img
                  src={proposal.project_umkm_foto || proposal.umkm_foto}
                  alt="Klien"
                  className="w-10 h-10 rounded-xl object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-dark-900 shrink-0">
                  <Building2 className="w-5 h-5 text-brand-indigo" />
                </div>
              )}
              <div className="min-w-0">
                <span className="font-bold text-dark-900 text-sm block truncate">
                  {proposal.project_umkm_nama ||
                    proposal.umkm_nama ||
                    proposal.umkm_profile?.nama_usaha ||
                    "Klien Mitra UMKM"}
                </span>
                <span className="text-[10px] text-muted block">
                  Pemberi Pekerjaan Resmi
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-canvas rounded-xl border border-border">
                <span className="text-[10px] font-bold text-muted uppercase block">
                  Pagu Anggaran Maksimal:
                </span>
                <span className="text-sm font-black text-dark-900">
                  {formatCurrency(proposal.project_budget_max)}
                </span>
              </div>

              <div className="p-3 bg-canvas rounded-xl border border-border flex items-start gap-2 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] font-medium leading-relaxed">
                  Proyek ini dilindungi rekening Escrow Makarya. Dana proyek
                  dijamin aman dan siap dicairkan setelah hasil kerja Anda
                  disetujui.
                </span>
              </div>
            </div>

            {proposal.project_deskripsi && (
              <div className="pt-2 border-t border-border">
                <span className="text-[10px] font-bold text-muted uppercase block mb-1">
                  Ringkasan Kebutuhan Proyek:
                </span>
                <p className="text-xs text-muted leading-relaxed line-clamp-4 font-medium">
                  {proposal.project_deskripsi}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
