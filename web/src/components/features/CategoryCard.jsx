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
  CategoryDesignSvg,
  CategoryUiUxSvg,
  CategoryCodeSvg,
  CategoryVideoSvg,
  CategoryCopySvg,
  CategoryDataSvg
} from "../ui/CategorySvgIcons";
import { ArrowUpRight } from "lucide-react";

export function CategoryCard({
  code,
  title,
  projectCount = 0,
  active = false,
  onClick,
  className
}) {
  const categoryConfig = {
    DESIGN: {
      icon: Palette,
      bgClass: "bg-indigo-50/70 hover:bg-indigo-100/80 border-indigo-100/80",
      iconBg: "bg-indigo-600 text-white",
      textColor: "text-indigo-950",
    },
    DESAIN: {
      icon: Palette,
      bgClass: "bg-indigo-50/70 hover:bg-indigo-100/80 border-indigo-100/80",
      iconBg: "bg-indigo-600 text-white",
      textColor: "text-indigo-950",
    },
    UIUX: {
      icon: Layout,
      bgClass: "bg-sky-50/70 hover:bg-sky-100/80 border-sky-100/80",
      iconBg: "bg-sky-500 text-white",
      textColor: "text-sky-950",
    },
    PEMROGRAMAN: {
      icon: Code2,
      bgClass: "bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-100/80",
      iconBg: "bg-emerald-600 text-white",
      textColor: "text-emerald-950",
    },
    VIDEO: {
      icon: Video,
      bgClass: "bg-rose-50/70 hover:bg-rose-100/80 border-rose-100/80",
      iconBg: "bg-rose-500 text-white",
      textColor: "text-rose-950",
    },
    COPYWRITING: {
      icon: PenTool,
      bgClass: "bg-amber-50/70 hover:bg-amber-100/80 border-amber-100/80",
      iconBg: "bg-amber-500 text-white",
      textColor: "text-amber-950",
    },
    ADMIN_DATA: {
      icon: Database,
      bgClass: "bg-slate-100/70 hover:bg-slate-200/80 border-slate-200/80",
      iconBg: "bg-slate-700 text-white",
      textColor: "text-slate-950",
    },
  const getCategoryIcon = (categoryCode) => {
    switch (categoryCode) {
      case "DESIGN":
      case "DESAIN":
        return <CategoryDesignSvg size={46} />;
      case "UIUX":
        return <CategoryUiUxSvg size={46} />;
      case "PEMROGRAMAN":
      case "WEB":
        return <CategoryCodeSvg size={46} />;
      case "VIDEO":
        return <CategoryVideoSvg size={46} />;
      case "COPYWRITING":
        return <CategoryCopySvg size={46} />;
      case "ADMIN_DATA":
      case "ADMIN":
      default:
        return <CategoryDataSvg size={46} />;
    }
  };

  const config = categoryConfig[code] || categoryConfig.DESIGN;
  const IconComponent = config.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none shadow-xs hover:shadow-sm",
        "group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none shadow-xs hover:shadow-md hover:-translate-y-0.5",
        active
          ? "bg-dark-900 text-white border-dark-900 shadow-md"
          : cn(config.bgClass, config.textColor),
          : "bg-surface border-border hover:border-brand-indigo/40 text-dark-900",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        {/* Rich Vector SVG Icon */}
        <div className="transition-transform duration-300 group-hover:scale-110 select-none">
          {getCategoryIcon(code)}
        </div>

        {/* Action Arrow Bubble */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs",
            active ? "bg-white/20 text-white" : config.iconBg
            "w-7 h-7 rounded-full flex items-center justify-center transition-all",
            active 
              ? "bg-white/10 text-white" 
              : "bg-canvas text-muted group-hover:bg-brand-indigo-light group-hover:text-brand-indigo border border-border"
          )}
        >
          <IconComponent className="w-5 h-5 stroke-[2]" />
        </div>
        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center transition-all", active ? "bg-white/10 text-white" : "bg-white/60 text-dark-900 group-hover:bg-white")}>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div>
        <h3 className={cn("text-sm font-bold tracking-tight font-sans mb-1 line-clamp-1", active ? "text-white" : config.textColor)}>
        <h3
          className={cn(
            "text-sm font-bold tracking-tight font-sans mb-1 line-clamp-1",
            active ? "text-white" : "text-dark-900"
          )}
        >
          {title}
        </h3>
        <span
          className={cn(
            "text-xs font-semibold block",
            active ? "text-white/80" : "text-muted"
          )}
        >
          {projectCount} Proyek Aktif
        </span>
      </div>
    </div>
  );
}