import React from "react";
import { cn } from "../../utils/cn";
import { 
  Palette, 
  Code2, 
  Video, 
  PenTool, 
  Layout, 
  Database, 
  ArrowUpRight 
} from "lucide-react";

export function CategoryCard({
  code,
  title,
  projectCount = 0,
  active = false,
  onClick,
}) {
  const iconMap = {
    DESIGN: Palette,
    DESAIN: Palette,
    UIUX: Layout,
    PEMROGRAMAN: Code2,
    VIDEO: Video,
    COPYWRITING: PenTool,
    ADMIN_DATA: Database,
  };

  const IconComponent = iconMap[code] || Palette;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-5 rounded-card border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none",
        active
          ? "bg-brand-indigo text-white border-brand-indigo-dark shadow-brand"
          : "bg-surface hover:bg-brand-indigo-light/30 border-border text-dark-900 shadow-xs"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            active
              ? "bg-white/20 text-white"
              : "bg-canvas text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white"
          )}
        >
          <IconComponent className="w-5 h-5 stroke-[1.75]" />
        </div>
        <ArrowUpRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5", active ? "text-white" : "text-muted group-hover:text-brand-indigo")} />
      </div>

      <div>
        <h3 className="text-sm font-bold tracking-tight font-sans mb-1">
          {title}
        </h3>
        <span
          className={cn(
            "text-xs font-semibold",
            active ? "text-white/80" : "text-muted"
          )}
        >
          {projectCount} Proyek Aktif
        </span>
      </div>
    </div>
  );
}