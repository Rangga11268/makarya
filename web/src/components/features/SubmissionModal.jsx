import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input, TextArea } from "../ui/Input";
import { Button } from "../ui/Button";
import { submissionApi } from "../../api";
import { useToastStore } from "../../store/toastStore";

export function SubmissionModal({ isOpen, onClose, projectId, onSuccess }) {
  const [urlBerkas, setUrlBerkas] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!urlBerkas.trim()) {
      setError("Tautan hasil kerja wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      await submissionApi.submitWork({
        project_id: projectId,
        url_berkas: urlBerkas.trim(),
        catatan_pengiriman: catatan.trim() || null,
      });

      addToast("Hasil pekerjaan berhasil diserahkan ke klien UMKM!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal mengunggah hasil pekerjaan.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unggah / Serahkan Hasil Kerja">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        <Input
          label="Tautan Berkas Hasil Kerja (URL)"
          type="url"
          placeholder="https://drive.google.com/... atau https://figma.com/..."
          value={urlBerkas}
          onChange={(e) => setUrlBerkas(e.target.value)}
          helperText="Pastikan akses link dapat dibuka oleh klien UMKM (Public / Anyone with the link)"
          required
        />

        <TextArea
          label="Catatan Pengiriman (Opsional)"
          rows={3}
          placeholder="Sampaikan penjelasan ringkas mengenai file yang Anda serahkan atau instruksi khusus..."
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" size="md" type="submit" loading={loading}>
            Serahkan Pekerjaan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
