import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate, isExpired } from "../../../utils/formatDate";
import { formatStatus } from "../../../utils/formatStatus";
import { Avatar } from "../../../components/ui/Avatar";

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
    const overdue = proj.status === "IN_PROGRESS" && isExpired(proj.deadline);

    return (
      <div
        onClick={onClick}
        className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 ${
          isSelected
            ? "bg-slate-100/60 border-brand-indigo/60 shadow-xs ring-1 ring-brand-indigo/30"
            : "bg-canvas border-border hover:bg-surface hover:border-dark-900/20"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md ${
              isDone
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : overdue
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : proj.status === "IN_PROGRESS"
                    ? "bg-brand-indigo-light text-brand-indigo border border-brand-indigo/20"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDone
                  ? "bg-emerald-500"
                  : overdue
                    ? "bg-rose-500"
                    : proj.status === "IN_PROGRESS"
                      ? "bg-brand-indigo"
                      : "bg-amber-500"
              }`}
            />
            {isDone
              ? "Selesai"
              : overdue
                ? "Lewat Tenggat"
                : formatStatus(proj.status)}
          </span>
        </div>

        <h4 className="text-xs sm:text-sm font-bold text-dark-900 line-clamp-1">
          {proj.judul}
        </h4>

        {proj.accepted_mhs_nama && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <Avatar
              src={proj.accepted_mhs_foto}
              name={proj.accepted_mhs_nama}
              role="MHS"
              size="xs"
            />
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
          ? "bg-slate-100/60 border-brand-indigo/60 shadow-xs ring-1 ring-brand-indigo/30"
          : "bg-canvas border-border hover:bg-surface hover:border-dark-900/20"
      }`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted truncate">
          {prop.project_kategori || "Proyek UMKM"}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-md border ${
            isDone
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : isAccepted
                ? isExpired(prop.project_deadline || prop.deadline)
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20"
                : prop.status === "REJECTED"
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          <span
            className={`w-1 h-1 rounded-full ${
              isDone
                ? "bg-emerald-500"
                : isAccepted
                  ? isExpired(prop.project_deadline || prop.deadline)
                    ? "bg-rose-500"
                    : "bg-indigo-600"
                  : prop.status === "REJECTED"
                    ? "bg-rose-500"
                    : "bg-amber-500"
            }`}
          />
          {isDone
            ? "Selesai"
            : isAccepted
              ? isExpired(prop.project_deadline || prop.deadline)
                ? "Lewat Tenggat"
                : "Dikerjakan"
              : formatStatus(prop.status)}
        </span>
      </div>

      <h4 className="text-xs sm:text-sm font-bold text-dark-900 line-clamp-1">
        {prop.project_judul}
      </h4>

      <div className="flex items-center gap-1.5 mt-1.5">
        <Avatar
          src={prop.project_umkm_foto}
          name={prop.project_umkm_nama || "Klien UMKM"}
          role="UMKM"
          size="xs"
        />
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
