import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import { daysRemaining, isExpired } from "../../utils/formatDate";
import { getProjectUrl } from "../../utils/slugify";
import { useAuthStore } from "../../store/authStore";
import {
  Clock,
  Building2,
  AlertCircle,
  CheckCircle2,
  Users,
  ChevronRight,
} from "lucide-react";

export function ProjectCard({ project }) {
  const { user } = useAuthStore();
  const [imgError, setImgError] = React.useState(false);
  const isMhs = user?.role === "MHS";
  const daysLeft = daysRemaining(project.deadline);
  const expired = isExpired(project.deadline) || project.status === "CANCELLED";

  const categoryLabels = {
    DESIGN: "Desain Grafis",
    DESAIN: "Desain Grafis",
    UIUX: "UI/UX Design",
    PEMROGRAMAN: "Web & Coding",
    VIDEO: "Video & Animasi",
    COPYWRITING: "Copywriting & SEO",
    ADMIN_DATA: "Admin & Data",
  };

  const clientPhoto =
    project.umkm_profile?.url_foto_usaha ||
    project.umkm_profile?.url_foto ||
    project.umkm_foto;
  const clientName = project.umkm_profile?.nama_usaha || "Klien UMKM";
  const clientCity = project.umkm_profile?.kota;

  const isTeam =
    project.tipe_kolaborasi === "TIM" ||
    (Array.isArray(project.slots) && project.slots.length > 1);
  const openSlotsCount = Array.isArray(project.slots)
    ? project.slots.filter((s) => s.status === "OPEN").length
    : 0;

  return (
    <Link
      to={getProjectUrl(project)}
      className={`group block bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full ${
        expired ? "opacity-75" : ""
      }`}
    >
      <div>
        {/* 1. Header: Klien UMKM & Deadline Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {clientPhoto && !imgError ? (
              <img
                src={clientPhoto}
                alt={clientName}
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="text-xs font-medium text-slate-600 truncate">
              {clientName}
            </span>
            {clientCity && (
              <>
                <span className="text-[10px] text-slate-300">•</span>
                <span className="text-xs text-slate-400 truncate">
                  {clientCity}
                </span>
              </>
            )}
          </div>

          {expired ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-medium shrink-0 bg-rose-50 px-2 py-0.5 rounded-md">
              <AlertCircle className="w-3 h-3 text-rose-500" />
              <span>Kedaluwarsa</span>
            </span>
          ) : daysLeft !== null ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-normal shrink-0">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{daysLeft === 0 ? "Hari Ini" : `Sisa ${daysLeft} hr`}</span>
            </span>
          ) : null}
        </div>

        {/* 2. Project Title */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-3">
          {project.judul}
        </h3>

        {/* 3. Metadata Inline Row (Category • Collab • Match) */}
        <div className="flex items-center flex-wrap gap-2 text-xs mb-4">
          <span className="font-medium text-indigo-600">
            {categoryLabels[project.kategori] ||
              project.kategori ||
              "Proyek Digital"}
          </span>

          <span className="text-[10px] text-slate-300">•</span>

          {isTeam ? (
            <span className="inline-flex items-center gap-1 text-purple-700 font-medium">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>
                Tim {openSlotsCount > 0 ? `(${openSlotsCount} peran buka)` : ""}
              </span>
            </span>
          ) : (
            <span className="text-slate-500">Individu</span>
          )}

          {project.match_score && isMhs ? (
            <>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{project.match_score}% cocok</span>
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* 4. Footer: Budget & Action Indicator */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            {formatCurrency(project.budget_max)}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-600 transition-colors text-xs">
          <span>{project.total_pelamar || 0} pelamar</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
