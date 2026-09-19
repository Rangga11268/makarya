import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { TextArea } from "../ui/Input";
import { Button } from "../ui/Button";
import { ratingApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { Star } from "lucide-react";

export function RatingModal({
  isOpen,
  onClose,
  projectId,
  keUserId,
  mhsId,
  recipientName,
  onSuccess,
}) {
  const targetUserId = keUserId || mhsId;
  const [skorKualitas, setSkorKualitas] = useState(5);
  const [skorWaktu, setSkorWaktu] = useState(5);
  const [skorKomunikasi, setSkorKomunikasi] = useState(5);
  const [ulasan, setUlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToastStore();

  const avgSkor = Math.round((skorKualitas + skorWaktu + skorKomunikasi) / 3);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!targetUserId) {
      setError("Penerima ulasan tidak valid atau belum ditentukan.");
      return;
    }

    try {
      setLoading(true);
      await ratingApi.giveRating({
        project_id: projectId,
        ke_user_id: targetUserId,
        skor: avgSkor,
        skor_kualitas: skorKualitas,
        skor_waktu: skorWaktu,
        skor_komunikasi: skorKomunikasi,
        ulasan: ulasan.trim() || null,
      });

      addToast("Ulasan dan rating Anda berhasil disimpan!", "success");
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
          : detail || "Gagal memberikan ulasan.";

      if (
        typeof msg === "string" &&
        msg.toLowerCase().includes("sudah memberikan rating")
      ) {
        addToast("Ulasan dan rating Anda sudah tersimpan.", "success");
        onSuccess?.();
        onClose();
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderStarSelector = (label, currentVal, setVal) => (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setVal(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
          >
            <Star
              className={`w-5 h-5 ${
                star <= currentVal
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-100 text-gray-300 dark:fill-slate-800 dark:text-slate-700"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Beri Ulasan untuk ${recipientName || "Mitra Kerja"}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Multi-Criteria Rating Cards */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Kriteria Penilaian
            </span>
            <span className="text-xs font-bold text-brand-indigo flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Skor Rata-Rata: {avgSkor} / 5
            </span>
          </div>

          {renderStarSelector(
            "1. Kualitas Hasil Deliverable",
            skorKualitas,
            setSkorKualitas,
          )}
          {renderStarSelector(
            "2. Ketepatan Waktu & Deadline",
            skorWaktu,
            setSkorWaktu,
          )}
          {renderStarSelector(
            "3. Komunikasi & Koordinasi",
            skorKomunikasi,
            setSkorKomunikasi,
          )}
        </div>

        <TextArea
          label="Tuliskan Ulasan Anda"
          rows={3}
          placeholder="Bagikan testimoni kerja sama, transparansi revisi, dan keandalan..."
          value={ulasan}
          onChange={(e) => setUlasan(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button variant="primary" size="md" type="submit" loading={loading}>
            Simpan Ulasan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
