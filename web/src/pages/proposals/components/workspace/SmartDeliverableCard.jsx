import React from "react";
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  RotateCcw,
  FileCode,
  Globe,
  FolderArchive,
  Palette,
  FileText,
  Sparkles,
} from "lucide-react";
import { formatDate } from "../../../../utils/formatDate";
import { Button } from "../../../../components/ui/Button";

/**
 * Detect URL service and provide Apple-styled metadata
 */
export function getSmartLinkMeta(url) {
  if (!url) return null;
  const lower = url.toLowerCase();

  if (lower.includes("figma.com")) {
    return {
      type: "FIGMA",
      title: "Kanvas Desain Figma",
      badge: "Figma File",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      iconBg: "bg-gradient-to-tr from-purple-600 to-indigo-500 text-white",
      icon: Palette,
      actionText: "Buka Kanvas Figma",
      description: "Pratinjau antarmuka UI/UX, wireframe, dan token desain",
    };
  }
  if (lower.includes("github.com") || lower.includes("gitlab.com")) {
    return {
      type: "CODE",
      title: "Repositori Kode Sumber",
      badge: "GitHub / GitLab",
      badgeBg: "bg-slate-100 text-slate-800 border-slate-300",
      iconBg: "bg-gradient-to-tr from-slate-900 to-slate-700 text-white",
      icon: FileCode,
      actionText: "Inspeksi Source Code",
      description:
        "Repositori kode program, dokumentasi README, dan struktur branch",
    };
  }
  if (
    lower.includes("drive.google.com") ||
    lower.includes("dropbox.com") ||
    lower.includes("onedrive")
  ) {
    return {
      type: "CLOUD",
      title: "Cloud Storage Berkas Master",
      badge: "Google Drive / Cloud",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white",
      icon: FolderArchive,
      actionText: "Akses Folder Master",
      description:
        "Arsip file resolusi tinggi, aset grafis, dan berkas deliverable",
    };
  }
  if (
    lower.includes("vercel.app") ||
    lower.includes("netlify.app") ||
    lower.includes(".web.app") ||
    lower.includes("railway.app") ||
    lower.includes("http")
  ) {
    return {
      type: "LIVE_DEMO",
      title: "Live Web & Prototype Demo",
      badge: "Web Preview",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white",
      icon: Globe,
      actionText: "Uji Coba Demo Langsung",
      description: "Aplikasi langsung yang dapat dicoba dan diuji interaksinya",
    };
  }

  return {
    type: "FILE",
    title: "Tautan Berkas Deliverable",
    badge: "Berkas Lampiran",
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    iconBg: "bg-slate-800 text-white",
    icon: FileText,
    actionText: "Buka Tautan Berkas",
    description: "Tautan eksternal hasil pengerjaan proyek",
  };
}

export function SmartDeliverableCard({
  submission,
  isLatest = true,
  index = 0,
  totalSubmissions = 1,
  onApprove,
  onRequestRevision,
  isUmkm = false,
  isProjectCompleted = false,
}) {
  if (!submission) return null;

  const versionNumber = totalSubmissions - index;
  const versionLabel =
    isLatest && isProjectCompleted
      ? "Versi Final (Disetujui)"
      : `Deliverable v${versionNumber}${isLatest ? " (Terkini)" : ""}`;

  const linkMeta = getSmartLinkMeta(submission.file_url);

  // Parse notes and checklist items
  const noteLines = (submission.catatan || "").split("\n");
  const checklistItems = noteLines
    .filter((l) => l.trim().startsWith("- [ ]") || l.trim().startsWith("- [x]"))
    .map((l) => l.replace(/^-\s*\[[ x]\]\s*/i, "").trim());

  const cleanNote = noteLines
    .filter(
      (l) =>
        !l.trim().startsWith("- [ ]") &&
        !l.trim().startsWith("- [x]") &&
        !l.trim().toLowerCase().startsWith("daftar poin perbaikan"),
    )
    .join("\n")
    .trim();

  const isApproved =
    submission.status === "APPROVED" || submission.status === "COMPLETED";
  const isRevisionRequested = submission.status === "REVISION_REQUESTED";

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border transition-all ${
        isLatest
          ? "bg-white border-slate-200 shadow-[0_4px_24px_rgba(15,23,42,0.04)] p-4 sm:p-6 space-y-4"
          : "bg-slate-50/70 border-slate-200/70 p-4 space-y-3 opacity-80 hover:opacity-100"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
              isApproved
                ? "bg-emerald-600 text-white"
                : isLatest
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-700"
            }`}
          >
            {versionLabel}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {formatDate(submission.created_at)}
          </span>
        </div>

        {/* Status Indicator Pill */}
        <div>
          {isApproved ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Telah Disetujui (Lunas)
            </span>
          ) : isRevisionRequested ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              Menunggu Revisi ({submission.jumlah_revisi || 1}/2)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Siap Diverifikasi Klien
            </span>
          )}
        </div>
      </div>

      {/* Smart Link Card Feature */}
      {linkMeta && submission.file_url && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${linkMeta.iconBg}`}
            >
              <linkMeta.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {linkMeta.title}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${linkMeta.badgeBg}`}
                >
                  {linkMeta.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {linkMeta.description}
              </p>
              <span className="text-[11px] font-mono text-blue-600 truncate block">
                {submission.file_url}
              </span>
            </div>
          </div>

          <a
            href={submission.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs shrink-0 active:scale-95"
          >
            <span>{linkMeta.actionText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Clean Notes Section */}
      {cleanNote && (
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Catatan Mahasiswa:
          </span>
          <p className="text-slate-800 leading-relaxed italic">"{cleanNote}"</p>
        </div>
      )}

      {/* Revision Checklist Applied */}
      {checklistItems.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Poin Perbaikan yang Telah Diselesaikan:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5">
            {checklistItems.map((item, cIdx) => (
              <div
                key={cIdx}
                className="flex items-start gap-1.5 text-emerald-800 font-medium"
              >
                <span className="text-emerald-600 font-bold">•</span>
                <span className="text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UMKM Review Action Buttons (Only for Latest and unapproved submission) */}
      {isUmkm && isLatest && !isApproved && (
        <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRequestRevision && onRequestRevision(submission)}
            disabled={submission.jumlah_revisi >= 2}
            className="text-xs font-bold border-slate-200 text-slate-800 hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-amber-600" />
            {submission.jumlah_revisi >= 2
              ? "Batas Revisi Habis (2/2)"
              : "Minta Revisi"}
          </Button>

          <Button
            variant="brand"
            size="sm"
            onClick={() => onApprove && onApprove(submission)}
            className="text-xs font-bold shadow-brand bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Verifikasi & Cairkan Honor
          </Button>
        </div>
      )}
    </div>
  );
}
