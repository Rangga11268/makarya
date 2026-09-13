import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  FileCheck2,
  UploadCloud,
  MessageSquare,
  Sparkles,
  Calendar,
} from "lucide-react";
import { formatDate } from "../../../../utils/formatDate";
import { formatCurrency } from "../../../../utils/formatCurrency";

export function WorkspaceActivityTimeline({
  project,
  submissions = [],
  selectedProposal,
  isUmkm = false,
}) {
  if (!project) return null;

  // Build Chronological Events
  const events = [];

  // 1. Kickoff Event
  if (project.created_at) {
    events.push({
      id: "kickoff",
      title: "Kontrak Resmi Dimulai & Escrow Diamankan",
      description: `Klien mendanai saldo garansi escrow sebesar Rp ${formatCurrency(project.budget_max || 0)} ke rekening bersama Makarya.`,
      date: project.created_at,
      icon: ShieldCheck,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      badge: "Escrow Aktif",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    });
  }

  // 2. Proposal Accepted
  const proposalDate = selectedProposal?.created_at || project.created_at;
  events.push({
    id: "assignment",
    title: "Mahasiswa Ditugaskan Menjadi Pelaksana",
    description: `Kontrak kerja sama disepakati. Batas waktu pengerjaan ditetapkan hingga ${formatDate(project.deadline)}.`,
    date: proposalDate,
    icon: FileCheck2,
    iconBg: "bg-blue-50 text-blue-600 border-blue-200",
    badge: "Pengerjaan Dimulai",
    badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
  });

  // 3. Submissions (Sorted chronologically)
  const sortedSubs = [...submissions].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at),
  );

  sortedSubs.forEach((sub, idx) => {
    const vNum = idx + 1;
    const isApproved = sub.status === "APPROVED" || sub.status === "COMPLETED";
    const isRevision = sub.status === "REVISION_REQUESTED";

    events.push({
      id: `sub-${sub.id || idx}`,
      title: `Deliverable v${vNum} Diunggah oleh Mahasiswa`,
      description:
        sub.catatan && sub.catatan.length > 10
          ? `Catatan: "${sub.catatan.slice(0, 120)}${sub.catatan.length > 120 ? "..." : ""}"`
          : "Tautan berkas pengerjaan diserahkan untuk proses verifikasi oleh klien.",
      date: sub.created_at,
      icon: UploadCloud,
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-200",
      badge: `Versi ${vNum}`,
      badgeBg: "bg-indigo-50 text-indigo-800 border-indigo-200",
    });

    if (isRevision) {
      events.push({
        id: `rev-${sub.id || idx}`,
        title: `Klien Mengajukan Permintaan Revisi`,
        description:
          "Klien meminta penyempurnaan pada hasil kerja. Mahasiswa menerima checklist poin perbaikan.",
        date: sub.updated_at || sub.created_at,
        icon: RotateCcw,
        iconBg: "bg-amber-50 text-amber-600 border-amber-200",
        badge: `Revisi #${sub.jumlah_revisi || 1}`,
        badgeBg: "bg-amber-50 text-amber-900 border-amber-200",
      });
    }

    if (isApproved) {
      events.push({
        id: `appr-${sub.id || idx}`,
        title: "Pekerjaan Disetujui & Honor Escrow Dicairkan",
        description: `Seluruh deliverable telah diverifikasi. Dana garansi escrow Rp ${formatCurrency(project.budget_max || 0)} diteruskan ke dompet mahasiswa.`,
        date: sub.updated_at || sub.created_at,
        icon: CheckCircle2,
        iconBg: "bg-emerald-600 text-white border-emerald-600",
        badge: "Selesai 100%",
        badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
      });
    }
  });

  // Sort newest first
  const displayEvents = events.reverse();

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Linimasa Audit Aktivitas Kontrak
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">
          {displayEvents.length} Peristiwa Tercatat
        </span>
      </div>

      {/* Timeline track */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {displayEvents.map((evt, idx) => (
          <div key={evt.id || idx} className="relative group">
            {/* Timeline Node Dot */}
            <div
              className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-7 h-6 sm:h-7 rounded-full border flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${evt.iconBg}`}
            >
              <evt.icon className="w-3.5 h-3.5" />
            </div>

            {/* Event Content Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-1.5 transition-colors hover:bg-slate-50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {evt.title}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${evt.badgeBg}`}
                >
                  {evt.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {evt.description}
              </p>
              <span className="text-[10px] font-medium text-slate-500 block pt-0.5">
                {formatDate(evt.date)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
