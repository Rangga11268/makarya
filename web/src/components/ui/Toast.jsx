import React from "react";
import { useToastStore } from "../../store/toastStore";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, Sparkles } from "lucide-react";
import { cn } from "../../utils/cn";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
    <div className="fixed top-5 right-5 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-float bg-surface text-dark-900 animate-in slide-in-from-bottom-5 duration-200",
            toast.type === "success" && "border-emerald-200 bg-emerald-50/90 text-emerald-950",
            toast.type === "error" && "border-rose-200 bg-rose-50/90 text-rose-950",
            toast.type === "warning" && "border-amber-200 bg-amber-50/90 text-amber-950",
            toast.type === "info" && "border-border bg-surface text-dark-900"
            "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md text-dark-900 animate-in slide-in-from-top-4 fade-in duration-200",
            toast.type === "success" && "border-emerald-300 bg-emerald-50/95 text-emerald-950 shadow-emerald-900/10",
            toast.type === "error" && "border-rose-300 bg-rose-50/95 text-rose-950 shadow-rose-900/10",
            toast.type === "warning" && "border-amber-300 bg-amber-50/95 text-amber-950 shadow-amber-900/10",
            toast.type === "info" && "border-brand-indigo/30 bg-surface/95 text-dark-900 shadow-brand-indigo/10"
          )}
        >
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
          {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
          {toast.type === "info" && <Sparkles className="w-5 h-5 text-brand-indigo shrink-0 mt-0.5" />}

          <div className="flex-1 text-xs font-semibold leading-relaxed">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted hover:text-dark-900 p-0.5 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}