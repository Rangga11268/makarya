import React from "react";
import { cn } from "../../utils/cn";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-surface text-dark-900 border-border",
    lime: "bg-lime-soft text-dark-900 border-lime-dark/30 font-bold",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    dark: "bg-dark-900 text-white border-dark-900",
    outline: "bg-transparent text-muted border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-tight",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}