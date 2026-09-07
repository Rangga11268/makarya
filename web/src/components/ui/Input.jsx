import React from "react";
import { cn } from "../../utils/cn";

export function Input({ label, error, helperText, className, ...props }) {
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
    <div className="w-full space-y-1.5 text-left">
    <div className={cn("w-full flex flex-col gap-1.5 text-left font-sans", wrapperClassName)}>
      {label && (
        <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
          {label}
        <label className="text-xs font-bold text-dark-900 tracking-tight flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}
      <input
        className={cn(
          "w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-dark-800 focus:ring-1 focus:ring-dark-800 transition-all",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
          className

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted select-none">
            {Icon}
          </div>
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted">{helperText}</p>}

        {prefix && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-muted text-xs font-bold select-none">
            {prefix}
          </div>
        )}

        <input
          className={cn(
            "w-full rounded-2xl border bg-surface py-2.5 text-sm font-semibold text-dark-900 placeholder:text-muted/50 transition-all font-sans focus:outline-none focus:ring-2 focus:ring-brand-indigo/15 shadow-2xs",
            Icon ? "pl-10 pr-4" : prefix ? "pl-11 pr-4" : "px-4",
            suffix
              ? typeof suffix === "string" && suffix.length > 4
                ? "pr-24"
                : "pr-12"
              : "",
            error
              ? "border-rose-300 focus:border-rose-500 bg-rose-50/20"
              : "border-border focus:border-brand-indigo",
            className
          )}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-muted text-xs select-none">
            {suffix}
          </div>
        )}
      </div>

      {error && <span className="text-xs font-medium text-rose-600 pl-1">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-muted font-normal leading-snug pl-1">{helperText}</span>
      )}
    </div>
  );
}

export function TextArea({ label, error, helperText, className, rows = 4, ...props }) {
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
    <div className="w-full space-y-1.5 text-left">
    <div className="w-full flex flex-col gap-1.5 text-left font-sans">
      {label && (
        <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
          {label}
        <label className="text-xs font-bold text-dark-900 tracking-tight flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <textarea
        rows={rows}
        className={cn(
          "w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-dark-800 focus:ring-1 focus:ring-dark-800 transition-all resize-none",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
          "w-full px-4 py-2.5 text-sm font-medium bg-surface border border-border rounded-2xl text-dark-900 placeholder:text-muted/50 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/15 transition-all resize-none shadow-2xs leading-relaxed",
          error && "border-rose-300 focus:border-rose-500 bg-rose-50/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted">{helperText}</p>}

      {error && <span className="text-xs font-medium text-rose-600 pl-1">{error}</span>}
      {helperText && !error && (
        <span className="text-[11px] text-muted font-normal leading-snug pl-1">{helperText}</span>
      )}
    </div>
  );
}
