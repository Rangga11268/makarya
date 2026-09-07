import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import { formatStatus } from "../../../utils/formatStatus";

export function ProposalSidebarItem({
  isUmkm,
  item,
  isSelected,
  onClick,
  mhsSubmissions = {},
}) {
  if (isUmkm) {
    const proj = item;
    const isDone = proj.status === "DONE" || proj.status === "COMPLETED";

    return (
      <div
        onClick={onClick}
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

        {proj.accepted_mhs_nama && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {proj.accepted_mhs_foto ? (
              <img
                src={proj.accepted_mhs_foto}
                alt={proj.accepted_mhs_nama}
                className="w-4 h-4 rounded-full object-cover shrink-0 border border-border"
              />
            ) : (
              <div className="w-4 h-4 rounded-full bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-[9px] shrink-0">
                {proj.accepted_mhs_nama.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-[11px] text-muted truncate">
              {proj.accepted_mhs_nama}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60 text-[11px] text-muted">
          <span className="font-extrabold text-dark-900">
            {formatCurrency(proj.budget_max)}
          </span>
          <span>{formatDate(proj.created_at)}</span>
        </div>
      </div>
    );
  }

  // Student proposal view
  const prop = item;
  const isAccepted = prop.status === "ACCEPTED";
  const isDone =
    mhsSubmissions[prop.project_id]?.status === "APPROVED" ||
    prop.status === "COMPLETED";

  return (
    <div
      onClick={onClick}
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

      <div className="flex items-center gap-1.5 mt-1.5">
        {prop.project_umkm_foto ? (
          <img
            src={prop.project_umkm_foto}
            alt={prop.project_umkm_nama || "Klien UMKM"}
            className="w-4 h-4 rounded-full object-cover shrink-0 border border-border"
          />
        ) : (
          <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[9px] shrink-0">
            {(prop.project_umkm_nama || "K").charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-[11px] text-muted truncate">
          {prop.project_umkm_nama || "Klien UMKM"}
        </span>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/60 text-[11px] text-muted">
        <span className="font-extrabold text-dark-900">
          {formatCurrency(prop.harga_tawar)}
        </span>
        <span>{prop.estimasi_hari} Hari</span>
      </div>
    </div>
  );
}
