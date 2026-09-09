import React, { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate } from "../../../utils/formatDate";
import {
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  XCircle,
  ArrowRight,
  Info,
} from "lucide-react";

/**
 * Modal untuk Klien UMKM:
 * Membatalkan kontrak mahasiswa saat ini dan membuka kembali proyek ke katalog Eksplorasi
 */
export function ReopenProjectModal({
  isOpen,
  onClose,
  project,
  onConfirm,
  loading = false,
}) {
  const tomorrowStr = new Date(Date.now() + 86400000)
    .toISOString()
    .split("T")[0];

  const defaultNewDeadline = new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .split("T")[0];

  const [newDeadline, setNewDeadline] = useState(defaultNewDeadline);
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      new_deadline: newDeadline || null,
      reason: reason.trim() || null,
    });
  };

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buka Kembali Proyek ke Eksplorasi"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Ganti Mahasiswa & Buka Ulang Lowongan</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Tindakan ini akan mengakhiri penugasan mahasiswa saat ini. Seluruh
            dana penawaran mahasiswa di escrow akan{" "}
            <strong>otomatis dikembalikan ke Saldo Aktif Anda</strong>, sehingga
            Anda dapat langsung menerima pelamar baru tanpa biaya tambahan.
          </p>
        </div>

        {/* Info Escrow Refund */}
        <div className="p-3 rounded-2xl bg-canvas border border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Estimasi Pengembalian ke Saldo Aktif:</span>
          </div>
          <span className="font-extrabold text-dark-900 text-xs text-emerald-700">
            {formatCurrency(project.budget_max)}
          </span>
        </div>

        {/* Input Deadline Baru */}
        <div className="space-y-1.5">
          <label className="block font-bold text-dark-900 text-xs">
            Perbarui Tenggat Waktu (Deadline) Proyek{" "}
            <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              min={tomorrowStr}
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-dark-900 text-xs focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo transition-all"
            />
          </div>
          <p className="text-[10px] text-muted">
            Tenggat sebelumnya: {formatDate(project.deadline)}. Berikan waktu
            yang cukup bagi mahasiswa baru untuk mengerjakan tugas.
          </p>
        </div>

        {/* Input Alasan */}
        <div className="space-y-1.5">
          <label className="block font-bold text-dark-900 text-xs">
            Alasan Pembatalan Kontrak (Opsional)
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Mahasiswa melewati batas waktu dan tidak memberikan respon pembaruan..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-dark-900 text-xs placeholder:text-muted/60 focus:ring-2 focus:ring-brand-indigo focus:border-brand-indigo transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="sm"
            isLoading={loading}
            className="shadow-brand font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Buka Kembali Proyek
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/**
 * Modal untuk Klien UMKM:
 * Membatalkan proyek secara permanen saat status IN_PROGRESS dan merefund escrow
 */
export function TerminateProjectModal({
  isOpen,
  onClose,
  project,
  onConfirm,
  loading = false,
}) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ reason: reason.trim() || null });
  };

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Batalkan Proyek Permanen"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Konfirmasi Pembatalan Proyek</span>
          </div>
          <p className="text-[11px] text-rose-800 leading-relaxed">
            Proyek <strong>"{project.judul}"</strong> akan ditutup secara
            permanen (CANCELLED). Seluruh saldo yang terkunci di escrow akan
            dikembalikan ke <strong>Saldo Aktif</strong> dompet Anda.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block font-bold text-dark-900 text-xs">
            Alasan Pembatalan (Opsional)
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Rencana kebutuhan proyek berubah..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-dark-900 text-xs placeholder:text-muted/60 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Kembali
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={loading}
            className="bg-rose-600 text-white hover:bg-rose-700 font-bold"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Ya, Batalkan Proyek
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/**
 * Modal untuk Mahasiswa:
 * Mengajukan pengunduran diri dari proyek yang sedang berjalan (IN_PROGRESS)
 */
export function ResignProposalModal({
  isOpen,
  onClose,
  proposal,
  onConfirm,
  loading = false,
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 5) {
      setError("Mohon sebutkan alasan pengunduran diri minimal 5 karakter.");
      return;
    }
    setError("");
    onConfirm({ reason: reason.trim() });
  };

  if (!proposal) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengunduran Diri dari Proyek"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Perhatian Sebelum Mengundurkan Diri</span>
          </div>
          <p className="text-[11px] text-rose-800 leading-relaxed">
            Status penugasan Anda pada proyek ini akan dihentikan dan dana
            escrow dikembalikan ke klien UMKM. Proyek akan dibuka kembali agar
            klien dapat merekrut mahasiswa lain.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block font-bold text-dark-900 text-xs">
            Alasan Pengunduran Diri <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
            placeholder="Jelaskan kendala yang dialami secara jujur dan profesional (kendala hardware, beban akademik, dll)..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-dark-900 text-xs placeholder:text-muted/60 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none"
          />
          {error && (
            <p className="text-[11px] text-rose-600 font-medium">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={loading}
            className="bg-rose-600 text-white hover:bg-rose-700 font-bold"
          >
            Konfirmasi Pengunduran Diri
          </Button>
        </div>
      </form>
    </Modal>
  );
}
