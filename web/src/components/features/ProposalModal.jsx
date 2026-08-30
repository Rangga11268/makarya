import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Input, TextArea } from "../ui/Input";
import { CurrencyInput } from "../ui/CurrencyInput";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { proposalApi } from "../../api";
import { useToastStore } from "../../store/toastStore";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  Sparkles,
  Clock,
  ShieldCheck,
  Briefcase,
  Wrench,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function ProposalModal({ isOpen, onClose, project, onSuccess }) {
  const [hargaTawar, setHargaTawar] = useState("");
  const [estimasiHari, setEstimasiHari] = useState("3");
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [selectedTools, setSelectedTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToast } = useToastStore();

  useEffect(() => {
    if (project && isOpen) {
      setHargaTawar(project.budget_max || "");
      setError(null);
    }
  }, [project, isOpen]);

  const toolOptions = [
    "Figma",
    "Adobe Illustrator",
    "Photoshop",
    "Canva",
    "React.js",
    "Tailwind CSS",
    "Next.js",
    "Python / FastAPI",
    "CapCut / Premiere",
    "SEO Writing",
    "Microsoft Excel",
  ];

  const toggleTool = (tool) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter((t) => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const applyTemplate = (type) => {
    if (type === "design") {
      setCoverLetter(
        `Halo Klien UMKM, saya mahasiswa Desain & TI yang siap merealisasikan brief ${project?.judul || "ini"}. Saya akan membuat 2 konsep visual awal dengan layout responsif, warna brand terkurasi, dan aset siap pakai (SVG/WebP). Siap revisi hingga sesuai kebutuhan usaha Anda!`,
      );
    } else if (type === "dev") {
      setCoverLetter(
        `Halo Klien UMKM, saya memiliki keahlian teknis untuk mengerjakan ${project?.judul || "proyek ini"}. Saya akan membangun solusi yang rapi, cepat, responsive di HP/Laptop, serta mudah digunakan. Kode bersih dan bergaransi bebas error.`,
      );
    } else {
      setCoverLetter(
        `Halo Klien UMKM, saya tertarik untuk membantu pengerjaan ${project?.judul || "kebutuhan ini"}. Dengan pengalaman tugas kuliah dan project nyata, saya menjamin pengerjaan tuntas tepat waktu dengan kualitas terbaik.`,
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const nominal = parseFloat(hargaTawar);
    if (!nominal || nominal <= 0) {
      setError("Harga penawaran wajib diisi dan lebih dari Rp 0");
      return;
    }
    if (nominal > parseFloat(project.budget_max)) {
      setError(
        `Penawaran tidak boleh melebihi batas budget klien (${formatCurrency(project.budget_max)})`,
      );
      return;
    }
    if (coverLetter.trim().length < 20) {
      setError("Surat lamaran / pesan strategi kerja minimal 20 karakter");
      return;
    }

    // Build comprehensive cover letter with tools & portfolio attachment
    let fullPitch = coverLetter.trim();
    if (selectedTools.length > 0) {
      fullPitch += `\n\n[Tools & Keahlian: ${selectedTools.join(", ")}]`;
    }
    if (portfolioLink.trim()) {
      fullPitch += `\n[Tautan Portofolio Pendukung: ${portfolioLink.trim()}]`;
    }

    try {
      setLoading(true);
      await proposalApi.submit({
        project_id: project.id,
        harga_tawar: nominal,
        estimasi_hari: parseInt(estimasiHari, 10),
        cover_letter: fullPitch,
      });

      addToast(
        "Proposal penawaran profesional Anda berhasil dikirim ke klien UMKM!",
        "success",
      );
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal mengirim proposal.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const parsedNominal = parseFloat(hargaTawar) || 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajukan Proposal Penawaran">
      <form onSubmit={handleSubmit} className="space-y-5 font-sans">
        {error && (
          <div className="p-3.5 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Project Target Brief */}
        <div className="bg-canvas border border-border p-4 rounded-2xl text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Target Proyek UMKM
            </span>
            <Badge variant="brand">{project?.kategori || "Umum"}</Badge>
          </div>
          <p className="font-bold text-sm text-dark-900 line-clamp-1">
            {project?.judul}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-border text-[11px]">
            <span className="text-muted">Batas Anggaran Klien:</span>
            <span className="font-bold text-dark-900">
              {formatCurrency(project?.budget_max)}
            </span>
          </div>
        </div>

        {/* Financial & Time Estimates */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-dark-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
            Penawaran Harga & Estimasi Kerja
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <CurrencyInput
              label="Harga Tawar Anda"
              placeholder="750.000"
              value={hargaTawar}
              onChange={(val) => setHargaTawar(val)}
              helperText="Maksimal seharga budget klien"
              required
            />

            <div>
              <Input
                label="Estimasi Selesai (Hari)"
                type="number"
                min="1"
                max="90"
                placeholder="Contoh: 3"
                value={estimasiHari}
                onChange={(e) => setEstimasiHari(e.target.value)}
                required
              />
              <div className="flex items-center gap-1.5 mt-1.5">
                {[1, 3, 5, 7, 14].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setEstimasiHari(String(d))}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                      estimasiHari === String(d)
                        ? "bg-dark-900 text-white border-dark-900"
                        : "bg-surface text-muted border-border hover:border-dark-900"
                    }`}
                  >
                    {d}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Income Calculator Breakdown */}
          <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs">
            <span className="text-indigo-950 font-medium">
              Honor Bersih Diterima Mahasiswa:
            </span>
            <span className="text-sm font-black text-brand-indigo">
              {formatCurrency(parsedNominal)}{" "}
              <span className="text-[10px] font-normal text-emerald-700">
                (0% Fee Mahasiswa)
              </span>
            </span>
          </div>
        </div>

        {/* Strategy Pitch & Cover Letter */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-dark-900">
              Pesan Pitching & Rencana Eksekusi{" "}
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted hidden sm:inline">
                Templat Cepat:
              </span>
              <button
                type="button"
                onClick={() => applyTemplate("design")}
                className="text-[10px] font-bold text-brand-indigo hover:underline"
              >
                🎨 Desain
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("dev")}
                className="text-[10px] font-bold text-brand-indigo hover:underline"
              >
                💻 Web/TI
              </button>
            </div>
          </div>

          <TextArea
            placeholder="Jelaskan secara rinci bagaimana Anda akan menyelesaikan proyek ini, tools yang akan dipakai, serta pengalaman relevan Anda..."
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            helperText={`${coverLetter.length}/20 karakter minimum`}
            required
          />
        </div>

        {/* Tools / Software Chips */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-brand-indigo" />
            Software / Alat yang Digunakan (Opsional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {toolOptions.map((tool) => {
              const isSelected = selectedTools.includes(tool);
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-brand-indigo text-white border-brand-indigo shadow-xs"
                      : "bg-surface text-slate-700 border-border hover:border-slate-400"
                  }`}
                >
                  {tool}
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Link Attachment */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-brand-indigo" />
            Tautan Portofolio / Contoh Karya (Opsional)
          </label>
          <Input
            placeholder="https://behance.net/karya atau https://github.com/projek"
            value={portfolioLink}
            onChange={(e) => setPortfolioLink(e.target.value)}
          />
        </div>

        {/* Escrow Guarantee Badge */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <b>Proteksi Escrow Makarya:</b> Jika proposal diterima, klien UMKM
            wajib mengunci 100% dana di escrow sebelum Anda mulai mengerjakan.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            className="text-xs font-bold"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="md"
            loading={loading}
            className="text-xs font-bold shadow-brand"
          >
            Kirim Proposal Sekarang 🚀
          </Button>
        </div>
      </form>
    </Modal>
  );
}
