import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input, TextArea } from "../ui/Input";
import { CurrencyInput } from "../ui/CurrencyInput";
import { Button } from "../ui/Button";
import { proposalApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { formatCurrency } from "../../utils/formatCurrency";

export function ProposalModal({ isOpen, onClose, project, onSuccess }) {
  const [hargaTawar, setHargaTawar] = useState("");
  const [estimasiHari, setEstimasiHari] = useState("3");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToastStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const nominal = parseFloat(hargaTawar);
    if (!nominal || nominal <= 0) {
      setError("Harga penawaran wajib diisi dan lebih dari Rp 0");
      return;
    }
    if (nominal > parseFloat(project.budget_max)) {
      setError(`Penawaran tidak boleh melebihi batas budget klien (${formatCurrency(project.budget_max)})`);
      return;
    }
    if (coverLetter.trim().length < 20) {
      setError("Surat lamaran / deskripsi keahlian minimal 20 karakter");
      return;
    }

    try {
      setLoading(true);
      await proposalApi.submit({
        project_id: project.id,
        harga_tawar: nominal,
        estimasi_hari: parseInt(estimasiHari, 10),
        cover_letter: coverLetter.trim(),
      });

      addToast("Proposal lamaran Anda berhasil dikirim ke UMKM!", "success");
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal mengirim proposal.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kirim Proposal Lamaran">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-medium bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="bg-gray-50 border border-border p-3.5 rounded-xl text-xs space-y-1">
          <p className="text-muted">Target Proyek:</p>
          <p className="font-bold text-dark-900">{project?.judul}</p>
          <p className="text-muted font-medium">Budget Maksimal Klien: <b className="text-dark-900">{formatCurrency(project?.budget_max)}</b></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Harga Tawar (Rp)"
            type="number"
            placeholder="Contoh: 750000"
          <CurrencyInput
            label="Harga Tawar"
            placeholder="750.000"
            value={hargaTawar}
            onChange={(e) => setHargaTawar(e.target.value)}
            helperText="Maksimal seharga budget proyek"
            onChange={(val) => setHargaTawar(val)}
            helperText="Maksimal seharga batas budget proyek"
            required
          />

          <Input
            label="Estimasi Pengerjaan (Hari)"
            type="number"
            min="1"
            max="90"
            placeholder="Contoh: 5"
            value={estimasiHari}
            onChange={(e) => setEstimasiHari(e.target.value)}
            required
          />
        </div>

        <TextArea
          label="Surat Lamaran & Rencana Kerja"
          rows={4}
          placeholder="Jelaskan pengalaman relevan, portofolio singkat, dan cara Anda akan menyelesaikan proyek ini..."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" size="md" type="submit" loading={loading}>
            Kirim Proposal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
