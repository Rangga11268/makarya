import React, { useState } from "react";
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
  ShieldCheck,
} from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { ProjectCoverBanner } from "../ui/ProjectCoverBanner";

export const getCategoryBanner = (cat) => {
  switch (cat) {
    case "DESIGN":
    case "DESAIN":
      return "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000&auto=format&fit=crop&q=80";
    case "UIUX":
      return "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1000&auto=format&fit=crop&q=80";
    case "PEMROGRAMAN":
      return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80";
    case "VIDEO":
      return "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80";
    case "COPYWRITING":
      return "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&auto=format&fit=crop&q=80";
    case "ADMIN_DATA":
      return "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80";
    default:
      return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80";
  }
};

export function ProjectCard({ project }) {
  const { user } = useAuthStore();
  const [imgError, setImgError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

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

  const bannerUri =
    !bannerError &&
    (project.banner_url ||
      project.url_banner ||
      project.umkm_profile?.banner_url ||
      getCategoryBanner(project.kategori));

  return (
    <Link
      to={getProjectUrl(project)}
      className={`group block bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full overflow-hidden ${
        expired ? "opacity-75" : ""
      }`}
    >
      <div>
        {/* 1. Cover Banner 16:9 Image */}
        <ProjectCoverBanner
          src={
            project.banner_url ||
            project.url_banner ||
            project.thumbnail_url ||
            project.umkm_profile?.banner_url ||
            project.umkm_profile?.url_foto_usaha
          }
          category={project.kategori}
          title={project.judul}
          className="w-full h-36"
        >
          {/* Category Badge on Banner Top-Left */}
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white font-medium text-[11px] border border-white/15 shadow-xs">
              {categoryLabels[project.kategori] ||
                project.kategori ||
                "Proyek Digital"}
            </span>
          </div>

          {/* Status / Match Badge on Banner Top-Right */}
          <div className="absolute top-2.5 right-2.5">
            {expired ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-white font-semibold bg-rose-600/90 backdrop-blur-xs px-2 py-0.5 rounded-lg">
                <AlertCircle className="w-3 h-3" />
                <span>Kedaluwarsa</span>
              </span>
            ) : project.match_score && isMhs ? (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg shadow-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{project.match_score}% cocok</span>
              </span>
            ) : null}
          </div>

          {/* Deadline Pill on Banner Bottom-Right */}
          {daysLeft !== null && !expired && (
            <div className="absolute bottom-2 right-2.5">
              <span className="inline-flex items-center gap-1 text-[10.5px] text-white/90 font-medium bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
                <Clock className="w-2.5 h-2.5 text-white/80" />
                <span>
                  {daysLeft === 0 ? "Hari Ini" : `Sisa ${daysLeft} hr`}
                </span>
              </span>
            </div>
          )}
        </ProjectCoverBanner>

        {/* 2. Card Body */}
        <div className="p-4">
          {/* Client Header */}
          <div className="flex items-center gap-2 mb-2 min-w-0">
            <Avatar src={clientPhoto} name={clientName} role="UMKM" size="xs" />
            <span className="text-xs font-medium text-slate-600 truncate">
              {clientName}
            </span>
            {clientCity && (
              <>
                <span className="text-[10px] text-slate-300 font-normal">
                  /
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {clientCity}
                </span>
              </>
            )}
          </div>

          {/* Project Title */}
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-3">
            {project.judul}
          </h3>

          {/* Spec Tag (Only shown if team) */}
          {isTeam && (
            <div className="flex items-center gap-1.5 text-xs mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px] border border-slate-200/60">
                <Users className="w-3 h-3 text-slate-500" />
                <span>
                  Tim {openSlotsCount > 0 ? `(${openSlotsCount} buka)` : ""}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer: Budget & Action Indicator */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between mt-auto bg-slate-50/40">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Anggaran
          </span>
          <span className="text-sm font-black text-slate-900 tracking-tight">
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
