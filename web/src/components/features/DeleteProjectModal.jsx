import React, { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "../ui/Button";

export function DeleteProjectModal({
  isOpen,
  onClose,
  project,
  onConfirmDelete,
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !project) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      await onConfirmDelete(project.id);
      onClose();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail ||
          "Gagal menghapus proyek. Pastikan proyek belum berjalan.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 text-left font-sans animate-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <Trash2 className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-dark-900">
            Hapus Proyek Kebutuhan UMKM?
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Anda akan menghapus proyek{" "}
            <span className="font-semibold text-dark-900 font-medium">
              "{project.judul}"
            </span>
            . Tindakan ini bersifat permanen dan seluruh lamaran proposal yang
            masuk akan dibatalkan.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={loading}
            className="text-xs font-bold rounded-xl"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleDelete}
            loading={loading}
            className="text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            <span>Hapus Proyek</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

