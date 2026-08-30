import React, { useState } from "react";
import { projectApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { Modal } from "../ui/Modal";
import { Input, TextArea } from "../ui/Input";
import { CurrencyInput } from "../ui/CurrencyInput";
import { Button } from "../ui/Button";
import { 
  Sparkles, 
  PlusCircle, 
  Tag, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  FileText 
} from "lucide-react";

export function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "DESIGN",
    budget_max: "500000",
    deadline: "",
    deskripsi_raw: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToastStore();

  const categories = [
    { id: "DESIGN", label: "Desain Grafis & Logo" },
    { id: "UIUX", label: "UI/UX Design (Figma)" },
    { id: "PEMROGRAMAN", label: "Pemrograman Web / Coding" },
    { id: "VIDEO", label: "Video Promosi & Reels/TikTok" },
    { id: "COPYWRITING", label: "Copywriting Iklan & SEO" },
    { id: "ADMIN_DATA", label: "Admin & Entry Data Excel" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const budgetNum = parseFloat(formData.budget_max);
    if (isNaN(budgetNum) || budgetNum < 50000 || budgetNum > 2000000) {
      setError("Budget maksimal proyek berkisar antara Rp 50.000 hingga Rp 2.000.000 (Standar micro-freelancing).");
      return;
    }

    if (!formData.deadline) {
      setError("Harap tentukan tenggat waktu (deadline) proyek.");
      return;
    }

    if (formData.deskripsi_raw.trim().length < 15) {
      setError("Deskripsi kebutuhan proyek minimal 15 karakter agar mudah dipahami pelamar mahasiswa.");
      return;
    }

    try {
      setLoading(true);
      const res = await projectApi.create({
        judul: formData.judul.trim(),
        kategori: formData.kategori,
        budget_max: budgetNum,
        deadline: formData.deadline,
        deskripsi_raw: formData.deskripsi_raw.trim(),
      });

      addToast("Proyek berhasil diterbitkan! Mahasiswa siap melamar.", "success");
      if (onProjectCreated) onProjectCreated(res.data);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal menerbitkan proyek baru.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pasang Proyek UMKM Baru"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-xl animate-in fade-in">
            {error}
          </div>
        )}

        <Input
          label="Judul Proyek Kebutuhan UMKM"
          name="judul"
          placeholder="Contoh: Desain Menu Digital & Banner Standee Kedai Kopi"
          value={formData.judul}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
              Kategori Proyek
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all font-sans"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Maksimal Budget (Rp)"
            type="number"
            name="budget_max"
            min="50000"
            max="2000000"
            step="10000"
            placeholder="500000"
          <CurrencyInput
            label="Maksimal Budget"
            placeholder="500.000"
            value={formData.budget_max}
            onChange={handleChange}
            helperText="Maksimal Rp 2.000.000"
            onChange={(val) => setFormData({ ...formData, budget_max: val })}
            helperText="Batas wajar: Maksimal Rp 2.000.000"
            required
          />
        </div>

        <Input
          label="Tenggat Waktu Selesai (Deadline)"
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          required
        />

        <TextArea
          label="Deskripsi Lengkap & Kebutuhan Pekerjaan"
          name="deskripsi_raw"
          rows={4}
          placeholder="Jelaskan kebutuhan spesifik Anda (ukuran banner, referensi gaya desain, fitur halaman web, atau materi yang sudah disiapkan)..."
          value={formData.deskripsi_raw}
          onChange={handleChange}
          required
        />

        {/* Escrow Guarantee Callout */}
        <div className="p-3 bg-brand-indigo-light/30 border border-brand-indigo/20 rounded-xl flex items-start gap-2.5 text-xs text-brand-indigo">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <b>Jaminan Keamanan Escrow:</b> Dana proyek Anda aman. Anda baru membayarkan honor setelah memeriksa dan menyetujui hasil deliverable dari mahasiswa.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button variant="secondary" size="md" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="brand" size="md" type="submit" loading={loading} className="font-bold">
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Terbitkan Proyek Sekarang
          </Button>
        </div>
      </form>
    </Modal>
  );
}