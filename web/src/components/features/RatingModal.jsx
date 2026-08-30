import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { TextArea } from "../ui/Input";
import { Button } from "../ui/Button";
import { ratingApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { Star } from "lucide-react";

export function RatingModal({ isOpen, onClose, projectId, keUserId, recipientName, onSuccess }) {
  const [skor, setSkor] = useState(5);
  const [ulasan, setUlasan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await ratingApi.giveRating({
        project_id: projectId,
        ke_user_id: keUserId,
        skor: parseInt(skor, 10),
        ulasan: ulasan.trim() || null,
      });

      addToast("Ulasan dan rating Anda berhasil disimpan!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal memberikan ulasan.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Beri Ulasan untuk ${recipientName || "Partner"}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Star Selection */}
        <div className="space-y-1 text-center py-2">
          <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
            Tingkat Kepuasan (1 - 5 Bintang)
          </label>
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSkor(star)}
                className="p-1.5 focus:outline-none transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= skor
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-100 text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted font-medium pt-1">
            {skor === 5 ? "Sangat Memuaskan ⭐⭐⭐⭐⭐" : skor === 4 ? "Bagus ⭐⭐⭐⭐" : skor === 3 ? "Cukup ⭐⭐⭐" : skor === 2 ? "Kurang ⭐⭐" : "Kecewa ⭐"}
          </p>
        </div>

        <TextArea
          label="Tuliskan Ulasan Anda"
          rows={3}
          placeholder="Bagikan pengalaman kerja sama, ketepatan waktu, dan kualitas komunikasi..."
          value={ulasan}
          onChange={(e) => setUlasan(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" size="md" type="submit" loading={loading}>
            Kirim Ulasan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
