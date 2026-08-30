import React from "react";
import { useToastStore } from "../../store/toastStore";
import { 
  AlertSuccessSvg, 
  AlertErrorSvg, 
  AlertWarningSvg, 
  AlertInfoSvg 
} from "./AlertIcons";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  const getToastIcon = (type) => {
    switch (type) {
      case "success":
        return <AlertSuccessSvg size={34} />;
      case "error":
        return <AlertErrorSvg size={34} />;
      case "warning":
        return <AlertWarningSvg size={34} />;
      case "info":
      default:
        return <AlertInfoSvg size={34} />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm sm:max-w-md w-[92vw] sm:w-full pointer-events-none font-sans">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl border shadow-2xl backdrop-blur-md text-dark-900 animate-in slide-in-from-top-4 fade-in duration-200",
            toast.type === "success" && "border-emerald-300 bg-white/95 text-slate-900 shadow-emerald-950/10",
            toast.type === "error" && "border-rose-300 bg-white/95 text-slate-900 shadow-rose-950/10",
            toast.type === "warning" && "border-amber-300 bg-white/95 text-slate-900 shadow-amber-950/10",
            toast.type === "info" && "border-brand-indigo/30 bg-white/95 text-slate-900 shadow-brand-indigo/10"
          )}
        >
          {/* Vector SVG Icon */}
          <div className="shrink-0 mt-0.5 select-none">
            {getToastIcon(toast.type)}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider block text-muted">
              {toast.type === "success" ? "Berhasil" : toast.type === "error" ? "Peringatan" : toast.type === "warning" ? "Perhatian" : "Informasi"}
            </span>
            <div className="text-xs font-semibold leading-relaxed text-dark-900 mt-0.5">
              {toast.message}
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-muted hover:text-dark-900 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}