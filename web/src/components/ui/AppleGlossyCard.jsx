import React from "react";
import { cn } from "../../utils/cn";

/**
 * AppleGlossyCard (Web)
 * Reusable Apple-style card container with frosted glass sheen,
 * soft ambient shadow, and clean micro-border rim.
 */
export function AppleGlossyCard({
  children,
  className,
  variant = "default", // "default" | "hero" | "subtle" | "tinted"
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        // Base Apple Glassmorphism
        "relative overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-200",
        // Variant Styles
        variant === "default" &&
          "bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-white/60 ring-inset p-5 md:p-6",
        variant === "hero" &&
          "bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_40px_rgb(0,0,0,0.06)] ring-1 ring-white/80 ring-inset p-6 md:p-8",
        variant === "subtle" &&
          "bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-4 md:p-5",
        variant === "tinted" &&
          "bg-indigo-50/50 backdrop-blur-md border border-indigo-100 shadow-[0_8px_30px_rgb(79,70,229,0.04)] ring-1 ring-white/60 ring-inset p-5 md:p-6",
        // Hover State
        hover &&
          "cursor-pointer hover:shadow-[0_14px_45px_rgb(0,0,0,0.08)] hover:border-slate-300 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {/* Top Gloss Highlight Sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent opacity-70" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
