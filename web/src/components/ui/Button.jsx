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
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-full select-none";

  const variants = {
    primary:
      "bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white shadow-md shadow-slate-900/25 border-t border-white/25 border-b border-slate-950/60 active:shadow-inner",
    brand:
      "bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white shadow-lg shadow-blue-600/30 border-t border-white/35 border-b border-blue-900/60 font-bold active:shadow-inner",
    gradient:
      "bg-gradient-to-b from-indigo-500 via-blue-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-t border-white/35 border-b border-indigo-900/60 font-bold active:shadow-inner",
    cyan: "bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600 hover:from-sky-300 hover:to-sky-500 text-white shadow-md shadow-sky-500/25 border-t border-white/35 border-b border-sky-800/60 font-bold",
    secondary:
      "bg-gradient-to-b from-white via-slate-50 to-slate-100 hover:from-white hover:to-slate-100 text-slate-800 border border-slate-200/90 border-t-white shadow-xs",
    outline:
      "bg-transparent hover:bg-slate-100 hover:text-dark-900 text-dark-900 border border-border",
    ghost:
      "bg-transparent hover:bg-slate-100 hover:text-dark-900 text-dark-900",
    danger:
      "bg-gradient-to-b from-rose-500 via-rose-600 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white shadow-lg shadow-rose-600/30 border-t border-white/35 border-b border-rose-900/60",
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
      className={cn(
        baseStyles,
        variants[variant] || variants.primary,
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
