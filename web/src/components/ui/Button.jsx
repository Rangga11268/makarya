import React from "react";
import { cn } from "../../utils/cn";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-full select-none";

  const variants = {
    primary: "bg-dark-900 hover:bg-dark-800 text-white shadow-xs",
    brand: "bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-brand font-bold",
    gradient: "bg-gradient-to-r from-brand-cyan to-brand-indigo hover:opacity-95 text-white shadow-brand font-bold",
    cyan: "bg-brand-cyan hover:bg-sky-600 text-white shadow-xs font-bold",
    secondary: "bg-surface hover:bg-slate-100 text-dark-900 border border-border shadow-xs",
    outline: "bg-transparent hover:bg-slate-100 hover:text-dark-900 text-dark-900 border border-border",
    ghost: "bg-transparent hover:bg-slate-100 hover:text-dark-900 text-dark-900",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-xs",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-xs sm:text-sm gap-2",
    lg: "px-6 py-3 text-sm sm:text-base gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant] || variants.primary, sizes[size], className)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}