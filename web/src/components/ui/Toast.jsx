import React from "react";
import { useToastStore } from "../../store/toastStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-surface text-dark-900 animate-in slide-in-from-bottom-5 duration-200",
            toast.type === "success" && "border-emerald-200 bg-emerald-50/50",
            toast.type === "error" && "border-rose-200 bg-rose-50/50",
            toast.type === "info" && "border-border"
          )}
        >
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
          {toast.type === "info" && <Info className="w-5 h-5 text-dark-900 shrink-0 mt-0.5" />}

          <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted hover:text-dark-900 p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
