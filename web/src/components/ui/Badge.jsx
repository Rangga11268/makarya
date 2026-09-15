import React from "react";
import { cn } from "../../utils/cn";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-surface text-slate-800 border-border",
    lime: "bg-lime-50 text-lime-900 border-lime-300 font-bold",
    success: "bg-emerald-50/80 text-emerald-800 border-emerald-200/80",
    warning: "bg-amber-50/90 text-amber-900 border-amber-300/80",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    dark: "bg-slate-900 text-white border-slate-900",
    outline: "bg-transparent text-slate-600 border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border tracking-tight",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
