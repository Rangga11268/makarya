import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { TextArea } from "../ui/Input";
import { Button } from "../ui/Button";
import { submissionApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { AlertCircle, RotateCcw, Plus, X, ListChecks } from "lucide-react";

export function RevisionModal({
  isOpen,
  onClose,
  submissionId,
  currentRevisions = 0,
  onSuccess,
}) {
  const [alasan, setAlasan] = useState("");
  const [checklist, setChecklist] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToastStore();

  const maxRevisions = 2;
  const remaining = maxRevisions - currentRevisions;

  const addChecklistItem = () => {
    setChecklist((prev) => [...prev, ""]);
  };

  const updateChecklistItem = (index, val) => {
    setChecklist((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const removeChecklistItem = (index) => {
    setChecklist((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!alasan.trim() || alasan.trim().length < 10) {
      setError(
        "Mohon uraikan alasan revisi minimal 10 karakter agar jelas bagi mahasiswa.",
      );
      return;
    }

    const validChecklist = checklist.map((c) => c.trim()).filter(Boolean);

    try {
      setLoading(true);
      await submissionApi.requestRevision(submissionId, {
        alasan_revisi: alasan.trim(),
        checklist_items: validChecklist.length > 0 ? validChecklist : undefined,
      });

      addToast(
        "Permintaan revisi dan daftar periksa telah berhasil dikirim ke mahasiswa!",
        "info",
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Gagal mengajukan permintaan revisi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajukan Permintaan Revisi Hasil Kerja"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-amber-900">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Kebijakan Batas Revisi Fair-Use (Maksimal 2 Kali)</span>
          </div>
          <p className="leading-relaxed">
            Untuk melindungi mahasiswa dari eksploitasi, batas maksimal revisi
            adalah 2 kali. Kesempatan revisi tersisa: <b>{remaining} kali</b>.
          </p>
        </div>

        {error && (
          <div className="p-3 font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        <TextArea
          label="Ringkasan Catatan Revisi"
          rows={3}
          placeholder="Tuliskan gambaran umum bagian yang perlu diperbaiki..."
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          required
        />

        {/* Structured Checklist Items */}
        <div className="space-y-2 pt-1 border-t border-border">
          <div className="flex items-center justify-between">
            <label className="font-bold text-dark-900 flex items-center gap-1.5 text-xs">
              <ListChecks className="w-4 h-4 text-brand-indigo" />
              <span>Daftar Poin Perbaikan Spesifik (Opsional)</span>
            </label>
            <span className="text-[11px] text-muted">
              Akan muncul sebagai checklist bagi mahasiswa
            </span>
          </div>

          <div className="space-y-2">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted font-bold text-[11px] w-4 text-right">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateChecklistItem(index, e.target.value)}
                  placeholder="Misal: Perbaiki kontras warna tombol sesuai WCAG"
                  className="flex-1 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs text-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-indigo"
                />
                {checklist.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(index)}
                    className="p-1 rounded-lg text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addChecklistItem}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-indigo hover:text-brand-indigo-dark transition-colors pt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Poin Perbaikan</span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button variant="brand" size="md" type="submit" loading={loading}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Kirim Catatan Revisi
          </Button>
        </div>
      </form>
    </Modal>
  );
}
