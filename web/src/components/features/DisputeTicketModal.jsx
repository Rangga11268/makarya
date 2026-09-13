import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { TextArea } from "../ui/Input";
import { Button } from "../ui/Button";
import { disputeApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export function DisputeTicketModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  onSuccess,
}) {
  const [alasan, setAlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = alasan.trim();
    if (trimmed.length < 20) {
      setError("Uraikan alasan sengketa secara rinci (minimal 20 karakter).");
      return;
    }

    try {
      setLoading(true);
      await disputeApi.fileDispute({
        project_id: projectId,
        alasan: trimmed,
      });

      addToast(
        "Tiket sengketa berhasil diajukan. Tim mediasi Makarya akan segera meninjau.",
        "success",
      );
      setAlasan("");
      onSuccess?.();
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail
            .map((d) =>
              typeof d === "object" ? d.msg || JSON.stringify(d) : String(d),
            )
            .join(", ")
        : typeof detail === "object" && detail !== null
          ? detail.msg || JSON.stringify(detail)
          : detail || "Gagal mengajukan tiket sengketa.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajukan Mediasi & Sengketa Proyek"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Prosedur Mediasi Escrow Makarya</p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Tiket ini akan mengunci pencairan dana sementara dan memanggil tim
              mediasi admin untuk memeriksa riwayat ruang kerja pada proyek{" "}
              <b>{projectTitle || "ini"}</b>.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        <TextArea
          label="Deskripsi Masalah / Alasan Sengketa (Min. 20 Karakter)"
          placeholder="Jelaskan secara jelas kendala yang dihadapi (misal: pekerjaan tidak sesuai kesepakatan brief, permintaan revisi berulang di luar lingkup, atau partner tidak dapat dihubungi)..."
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          rows={4}
          required
        />

        <div className="flex items-center justify-between text-[11px] text-muted">
          <span>Karakter: {alasan.trim().length}/1000</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            Terlindungi Escrow
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="danger"
            size="sm"
            loading={loading}
            className="font-bold"
          >
            Kirim Tiket Sengketa
          </Button>
        </div>
      </form>
    </Modal>
  );
}

