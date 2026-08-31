import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { TextArea } from "../ui/Input";
import { Button } from "../ui/Button";
import { submissionApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { AlertCircle, RotateCcw } from "lucide-react";

export function RevisionModal({ isOpen, onClose, submissionId, currentRevisions = 0, onSuccess }) {
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToastStore();

  const maxRevisions = 2;
  const remaining = maxRevisions - currentRevisions;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!alasan.trim() || alasan.trim().length < 10) {
      setError("Mohon uraikan alasan revisi minimal 10 karakter agar jelas bagi mahasiswa.");
      return;
    }

    try {
      setLoading(true);
      await submissionApi.requestRevision(submissionId, {
        alasan_revisi: alasan.trim(),
      });

      addToast("Permintaan revisi telah berhasil dikirim ke mahasiswa!", "info");
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal mengajukan permintaan revisi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajukan Permintaan Revisi Hasil Kerja">
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-amber-900">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Kebijakan Batas Revisi Fair-Use (Maksimal 2 Kali)</span>
          </div>
          <p className="leading-relaxed">
            Untuk melindungi mahasiswa dari eksploitasi, batas maksimal revisi adalah 2 kali.
            Kesempatan revisi tersisa: <b>{remaining} kali</b>.
          </p>
        </div>

        {error && (
          <div className="p-3 font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        <TextArea
          label="Uraian Rincian Revisi yang Diinginkan"
          rows={4}
          placeholder="Tuliskan bagian mana yang perlu diperbaiki, misalnya: 'Mohon warna font diganti menjadi putih dan resolusi logo dinaikkan...'"
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          required
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
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