import React from "react";
import { cn } from "../../utils/cn";

export function Input({ label, error, helperText, className, ...props }) {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-dark-800 focus:ring-1 focus:ring-dark-800 transition-all",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted">{helperText}</p>}
    </div>
  );
}

export function TextArea({ label, error, helperText, className, rows = 4, ...props }) {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-dark-800 focus:ring-1 focus:ring-dark-800 transition-all resize-none",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-muted">{helperText}</p>}
    </div>
  );
}
