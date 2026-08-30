import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Box */}
      <div
        className={cn(
          "relative w-full bg-surface rounded-2xl border border-border shadow-xl p-6 z-10 animate-in fade-in zoom-in-95 duration-200",
          maxWidth
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
          <h3 className="text-lg font-bold text-dark-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-muted hover:text-dark-900 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
