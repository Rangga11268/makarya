import React, { useState } from "react";
import {
  CategoryDesignSvg,
  CategoryUiUxSvg,
  CategoryCodeSvg,
  CategoryVideoSvg,
  CategoryCopySvg,
  CategoryDataSvg,
} from "./CategorySvgIcons";

export function ProjectCoverBanner({
  src,
  category = "DESIGN",
  title = "Proyek Makarya",
  className = "w-full h-48 sm:h-64 rounded-3xl",
  children,
  overlay = true,
}) {
  const [imgError, setImgError] = useState(false);

  const getCategoryTheme = (cat) => {
    const c = String(cat || "").toUpperCase();
    switch (c) {
      case "DESIGN":
      case "DESAIN":
        return {
          gradient: "from-purple-950 via-indigo-950 to-slate-950",
          accentColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          icon: <CategoryDesignSvg size={48} className="text-purple-400/30" />,
        };
      case "UIUX":
        return {
          gradient: "from-rose-950 via-purple-950 to-slate-950",
          accentColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          icon: <CategoryUiUxSvg size={48} className="text-rose-400/30" />,
        };
      case "PEMROGRAMAN":
      case "WEB":
        return {
          gradient: "from-blue-950 via-slate-950 to-cyan-950",
          accentColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
          icon: <CategoryCodeSvg size={48} className="text-cyan-400/30" />,
        };
      case "VIDEO":
        return {
          gradient: "from-amber-950 via-stone-950 to-slate-950",
          accentColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          icon: <CategoryVideoSvg size={48} className="text-amber-400/30" />,
        };
      case "COPYWRITING":
        return {
          gradient: "from-emerald-950 via-teal-950 to-slate-950",
          accentColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          icon: <CategoryCopySvg size={48} className="text-emerald-400/30" />,
        };
      case "ADMIN_DATA":
      case "ADMIN":
      default:
        return {
          gradient: "from-slate-900 via-indigo-950 to-slate-950",
          accentColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
          icon: <CategoryDataSvg size={48} className="text-indigo-400/30" />,
        };
    }
  };

  const theme = getCategoryTheme(category);
  const showImage = Boolean(src) && !imgError;

  return (
    <div
      className={`relative overflow-hidden border border-slate-800/80 shadow-xs select-none ${className}`}
    >
      {/* Background Layer: Real Image OR Geometric Aesthetic Mesh Canvas */}
      {showImage ? (
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center relative overflow-hidden`}
        >
          {/* Subtle Grid Accent Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Decorative Glow Orb */}
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-purple-500/10 blur-3xl" />

          {/* Center Watermark Icon */}
          <div className="transform scale-150 opacity-25">
            {theme.icon}
          </div>
        </div>
      )}

      {/* Dark Readability Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
      )}

      {/* Top & Bottom Badges / Custom Children */}
      {children}
    </div>
  );
}
