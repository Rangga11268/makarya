import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { daysRemaining } from "../../utils/formatDate";
import { getProjectUrl } from "../../utils/slugify";
import { useAuthStore } from "../../store/authStore";
import { Clock, Tag, Building2, ArrowRight } from "lucide-react";

export function ProjectCard({ project }) {
  const { user } = useAuthStore();
  const isMhs = user?.role === "MHS";
  const daysLeft = daysRemaining(project.deadline);

  const categoryLabels = {
    DESIGN: "Desain Grafis",
    DESAIN: "Desain Grafis",
    UIUX: "UI/UX Design",
    PEMROGRAMAN: "Web & Coding",
    VIDEO: "Video & Animasi",
    COPYWRITING: "Copywriting & SEO",
    ADMIN_DATA: "Admin & Data",
  };

  return (
    <Card
      hover
      className="flex flex-col justify-between h-full group bg-surface border-border"
    >
      <div>
        {/* Top Header: UMKM Client Info & Days Left */}
        <div className="flex items-center justify-between gap-2 mb-3.5 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-brand-indigo-light text-brand-indigo flex items-center justify-center font-bold text-xs shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-dark-900 truncate font-sans">
                {project.umkm_profile?.nama_usaha || "Klien UMKM"}
              </h4>
              <p className="text-[11px] text-muted truncate font-sans">
                {project.umkm_profile?.kota || "Indonesia"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted font-medium shrink-0 bg-canvas px-2.5 py-1 rounded-full border border-border">
            <Clock className="w-3 h-3 text-brand-indigo" />
            <span>{daysLeft} hari</span>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-base font-bold text-dark-900 group-hover:text-brand-indigo transition-colors line-clamp-2 leading-snug mb-2 font-sans">
          {project.judul}
        </h3>

        {/* Project Description */}
        <p className="text-xs text-muted line-clamp-2 mb-4 leading-relaxed font-sans font-normal">
          {project.deskripsi_raw}
        </p>
      </div>

      {/* Footer Meta: Category Badge, Budget, & Action */}
      <div className="pt-3 border-t border-border-subtle mt-2 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="brand" className="text-[11px] px-2.5 py-0.5">
            <Tag className="w-3 h-3 mr-1 text-brand-indigo" />
            {categoryLabels[project.kategori] || project.kategori}
          </Badge>

          <div className="text-right">
            <span className="text-[10px] text-muted block uppercase tracking-wider font-semibold">
              Maks Budget
            </span>
            <span className="text-sm font-extrabold text-dark-900 font-sans">
              {formatCurrency(project.budget_max)}
            </span>
          </div>
        </div>

        <Link
          to={getProjectUrl(project)}
          className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-full text-xs font-bold bg-dark-900 hover:bg-brand-indigo text-white transition-all gap-1.5 shadow-xs select-none"
        >
          <span>{isMhs ? "Rincian & Lamar" : "Lihat Rincian Proyek"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
