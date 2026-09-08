import React from "react";
import { cn } from "../../utils/cn";
import {
  CategoryDesignSvg,
  CategoryUiUxSvg,
  CategoryCodeSvg,
  CategoryVideoSvg,
  CategoryCopySvg,
  CategoryDataSvg,
} from "../ui/CategorySvgIcons";
import { ArrowUpRight } from "lucide-react";

export function CategoryCard({
  code,
  title,
  projectCount = 0,
  active = false,
  image,
  onClick,
  className,
}) {
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

  if (image) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "group relative rounded-2xl overflow-hidden border border-border bg-surface transition-all duration-300 cursor-pointer flex flex-col justify-between select-none shadow-xs hover:shadow-lg hover:-translate-y-1",
          active && "ring-2 ring-brand-indigo border-brand-indigo",
          className,
        )}
      >
        {/* Visual Thumbnail */}
        <div className="relative w-full h-40 sm:h-44 overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-dark-900 flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Card Meta */}
        <div className="p-4 bg-surface flex flex-col justify-between flex-1">
          <h3 className="text-sm sm:text-base font-bold text-dark-900 font-sans line-clamp-1 group-hover:text-brand-indigo transition-colors">
            {title}
          </h3>
          <span className="text-xs font-semibold text-muted mt-1">
            {projectCount} Proyek Aktif
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between select-none shadow-xs hover:shadow-md hover:-translate-y-0.5",
        active
          ? "bg-dark-900 text-white border-dark-900 shadow-md"
          : "bg-surface border-border hover:border-brand-indigo/40 text-dark-900",
        className,
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
            "w-7 h-7 rounded-full flex items-center justify-center transition-all",
            active
              ? "bg-white/10 text-white"
              : "bg-canvas text-muted group-hover:bg-brand-indigo-light group-hover:text-brand-indigo border border-border",
          )}
        >
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div>
        <h3
          className={cn(
            "text-sm font-bold tracking-tight font-sans mb-1 line-clamp-1",
            active ? "text-white" : "text-dark-900",
          )}
        >
          {title}
        </h3>
        <span
          className={cn(
            "text-xs font-semibold block",
            active ? "text-white/80" : "text-muted",
          )}
        >
          {projectCount} Proyek Aktif
        </span>
      </div>
    </div>
  );
}
