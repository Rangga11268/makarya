import React from "react";
import { cn } from "../../utils/cn";

export function Input({
  label,
  error,
  helperText,
  required = false,
  icon: Icon,
  prefix,
  suffix,
  className,
  wrapperClassName,
  ...props
}) {
  return (
    <div
      className={cn(
        "w-full flex flex-col gap-1.5 text-left font-sans",
        wrapperClassName,
      )}
    >
      {label && (
        <label className="text-xs font-bold text-dark-900 tracking-tight flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted select-none">
            {Icon}
          </div>
        )}

        {prefix && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted text-xs font-bold select-none">
            {prefix}
          </div>
        )}

        <input
          className={cn(
            "w-full rounded-2xl border bg-surface py-2.5 text-sm font-semibold text-dark-900 placeholder:text-muted/50 transition-all font-sans focus:outline-none focus:ring-2 focus:ring-brand-indigo/15 shadow-2xs",
            "w-full rounded-2xl border bg-surface py-2.5 text-base sm:text-sm font-semibold text-dark-900 placeholder:text-muted/50 transition-all font-sans focus:outline-none focus:ring-2 focus:ring-brand-indigo/15 shadow-2xs",
            Icon ? "pl-10 pr-4" : prefix ? "pl-11 pr-4" : "px-4",
            suffix
              ? typeof suffix === "string" && suffix.length > 4
                ? "pr-24"
                : "pr-12"
              : "",
            error
              ? "border-rose-300 focus:border-rose-500 bg-rose-50/20"
              : "border-border focus:border-brand-indigo",
            className,
          )}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-muted text-xs select-none">
            {suffix}
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs font-medium text-rose-600 pl-1">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-[11px] text-muted font-normal leading-snug pl-1">
          {helperText}
        </span>
      )}
    </div>
  );
}

export function TextArea({
  label,
  error,
  helperText,
  required = false,
  className,
  rows = 4,
  ...props
}) {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left font-sans">
      {label && (
        <label className="text-xs font-bold text-dark-900 tracking-tight flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <textarea
        rows={rows}
        className={cn(
          "w-full px-4 py-2.5 text-sm font-medium bg-surface border border-border rounded-2xl text-dark-900 placeholder:text-muted/50 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/15 transition-all resize-none shadow-2xs leading-relaxed",
          "w-full px-4 py-2.5 text-base sm:text-sm font-medium bg-surface border border-border rounded-2xl text-dark-900 placeholder:text-muted/50 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/15 transition-all resize-none shadow-2xs leading-relaxed",
          error && "border-rose-300 focus:border-rose-500 bg-rose-50/20",
          className,
        )}
        {...props}
      />

      {error && (
        <span className="text-xs font-medium text-rose-600 pl-1">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-[11px] text-muted font-normal leading-snug pl-1">
          {helperText}
        </span>
      )}
    </div>
  );
}
