import React from "react";
import { cn } from "../../utils/cn";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  pill = true,
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none";

  const radiusStyle = pill ? "rounded-full" : "rounded-xl";

  const variants = {
    primary:
      "bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md shadow-slate-900/10 border border-transparent",
    secondary:
      "bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-300 shadow-2xs hover:shadow-sm",
    accent:
      "bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/20 border border-transparent",
    brand:
      "bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 border border-transparent",
    gradient:
      "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-md shadow-cyan-600/20",
    cyan: "bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/20",
    success:
      "bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20 border border-transparent",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20 border border-transparent",
    outline:
      "bg-transparent hover:bg-slate-100 text-slate-800 border border-slate-300",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700",
    chip:
      "bg-white hover:bg-slate-900 hover:text-white text-slate-700 font-semibold border border-slate-200 shadow-2xs active:scale-95",
  };

  const sizes = {
    xs: "px-3 py-1.5 min-h-[32px] text-xs gap-1.5",
    sm: "px-4 py-2 min-h-[36px] text-xs gap-1.5",
    md: "px-6 py-3 min-h-[44px] text-xs sm:text-sm gap-2",
    lg: "px-7 py-3.5 min-h-[48px] text-sm sm:text-base gap-2.5",
    icon: "p-2 min-h-[36px] min-w-[36px]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        baseStyles,
        radiusStyle,
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
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
