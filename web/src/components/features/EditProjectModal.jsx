import React, { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Calendar,
  DollarSign,
  Tag,
  UploadCloud,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { ProjectCoverBanner } from "../ui/ProjectCoverBanner";
import { formatCurrency } from "../../utils/formatCurrency";

const CATEGORIES = [
  { id: "DESIGN", label: "Desain Grafis" },
  { id: "UIUX", label: "UI/UX Design" },
  { id: "PEMROGRAMAN", label: "Web & Coding" },
  { id: "VIDEO", label: "Video & Animasi" },
  { id: "COPYWRITING", label: "Copywriting & SEO" },
  { id: "ADMIN_DATA", label: "Admin & Data" },
];

const PRESETS = [
  {
    label: "Modern Tech",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
  },
  {
    label: "Creative Design",
    url: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&q=80",
  },
  {
    label: "Studio Brand",
    url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
  },
  {
    label: "Bakery / Kuliner",
    url: "https://images.unsplash.com/photo-1556742049-0a67e557b6f3?w=800&q=80",
  },
];

export function EditProjectModal({
  isOpen,
  onClose,
  project,
  onConfirmUpdate,
}) {
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "DESIGN",
    deskripsi_raw: "",
    budget_min: "",
    budget_max: "",
    deadline: "",
    banner_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (project) {
      setFormData({
        judul: project.judul || "",
        kategori: project.kategori || "DESIGN",
        deskripsi_raw: project.deskripsi_raw || project.deskripsi || "",
        budget_min: project.budget_min ? String(project.budget_min) : "",
        budget_max: project.budget_max ? String(project.budget_max) : "",
        deadline: project.deadline ? String(project.deadline).split("T")[0] : "",
        banner_url: project.banner_url || "",
      });
      setErrorMsg("");
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judul || formData.judul.trim().length < 5) {
      setErrorMsg("Judul proyek minimal 5 karakter");
      return;
    }
    if (!formData.deskripsi_raw || formData.deskripsi_raw.trim().length < 15) {
      setErrorMsg("Deskripsi kebutuhan brief minimal 15 karakter");
      return;
    }
    const numMax = parseFloat(formData.budget_max) || 0;
    if (numMax <= 0 || numMax > 2000000) {
      setErrorMsg("Anggaran maksimal harus di antara Rp 50.000 s/d Rp 2.000.000");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        judul: formData.judul.trim(),
        kategori: formData.kategori,
        deskripsi_raw: formData.deskripsi_raw.trim(),
        budget_max: numMax,
        budget_min: formData.budget_min ? parseFloat(formData.budget_min) : undefined,
        deadline: formData.deadline,
        banner_url: formData.banner_url ? formData.banner_url.trim() : null,
      };

      await onConfirmUpdate(project.id, payload);
      onClose();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail ||
          "Gagal memperbarui proyek. Periksa kembali form input Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden font-sans my-8 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-dark-900">
                Edit Kebutuhan Proyek UMKM
              </h3>
              <p className="text-[11px] text-muted">
                Perbarui detail brief, anggaran, tenggat waktu, atau cover banner proyek.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg)}</span>
            </div>
          )}

          {/* Judul */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-dark-900 uppercase tracking-wider block">
              Judul Proyek
            </label>
            <input
              type="text"
              value={formData.judul}
              onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
              placeholder="Contoh: Desain Menu Resto & Feed Instagram"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-dark-900 focus:bg-white focus:outline-none focus:border-brand-indigo transition-all font-medium"
              required
            />
          </div>

          {/* Kategori & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-dark-900 uppercase tracking-wider block">
                Kategori Keahlian
              </label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-dark-900 focus:bg-white focus:outline-none focus:border-brand-indigo transition-all font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-dark-900 uppercase tracking-wider block">
                Tenggat Waktu (Deadline)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-dark-900 focus:bg-white focus:outline-none focus:border-brand-indigo transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-dark-900 uppercase tracking-wider block">
                Anggaran Maksimal (Rp)
              </label>
              <input
                type="number"
                value={formData.budget_max}
                onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                min="50000"
                max="2000000"
                step="25000"
                placeholder="Contoh: 500000"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-dark-900 focus:bg-white focus:outline-none focus:border-brand-indigo transition-all font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-dark-900 uppercase tracking-wider block">
                Anggaran Minimal (Opsional)
              </label>
              <input
                type="number"
                value={formData.budget_min}
                onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                min="50000"
                max="2000000"
                step="25000"
                placeholder="Contoh: 200000"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-dark-900 focus:bg-white focus:outline-none focus:border-brand-indigo transition-all font-medium"
              />
            </div>
          </div>

          {/* Deskripsi Brief */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-dark-900 uppercase tracking-wider block">
              Deskripsi Kebutuhan & Deliverable
            </label>
            <textarea
              rows={4}
              value={formData.deskripsi_raw}
              onChange={(e) => setFormData({ ...formData, deskripsi_raw: e.target.value })}
              placeholder="Jelaskan kebutuhan spesifik, preferensi referensi, dan hasil kerja yang diharapkan..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-dark-900 focus:bg-white focus:outline-none focus:border-brand-indigo transition-all leading-relaxed"
              required
            />
          </div>

          {/* Banner Section */}
          <div className="space-y-2 text-left pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-dark-900 uppercase tracking-wider block">
                Cover Banner Proyek
              </label>
              {formData.banner_url && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, banner_url: "" })}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  Hapus Banner
                </button>
              )}
            </div>

            {/* Live Banner Preview */}
            <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200">
              <ProjectCoverBanner
                src={formData.banner_url}
                category={formData.kategori}
                title={formData.judul}
                className="w-full h-full"
              />
            </div>

            {/* Upload & Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Unggah Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData({
                          ...formData,
                          banner_url: reader.result,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              <div className="flex items-center gap-1 text-[11px] text-muted overflow-x-auto py-1">
                <span className="font-medium mr-1">Preset:</span>
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, banner_url: p.url })}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                      formData.banner_url === p.url
                        ? "bg-brand-indigo/10 border-brand-indigo text-brand-indigo font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
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
              type="submit"
              variant="brand"
              size="md"
              loading={loading}
              className="text-xs font-bold rounded-xl shadow-brand"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>Simpan Perubahan</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

