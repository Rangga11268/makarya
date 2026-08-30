import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { projectApi, proposalApi } from "../../api";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { useAlertStore } from "../../store/alertStore";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input, TextArea } from "../../components/ui/Input";
import { CurrencyInput } from "../../components/ui/CurrencyInput";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { extractIdFromSlug } from "../../utils/slugify";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  Send,
  Sparkles,
  Wrench,
  Link as LinkIcon,
  ShieldCheck,
  Building2,
  Calendar,
  Palette,
  Code2,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function ApplyProposalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const { showSuccess, showError } = useAlertStore();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [hargaTawar, setHargaTawar] = useState("");
  const [estimasiHari, setEstimasiHari] = useState("3");
  const [coverLetter, setCoverLetter] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [selectedTools, setSelectedTools] = useState([]);

  const toolOptions = [
    "Figma",
    "Adobe Illustrator",
    "Photoshop",
    "Canva",
    "React.js",
    "Tailwind CSS",
    "Next.js",
    "FastAPI / Python",
    "CapCut / Premiere",
    "SEO Writing",
    "Microsoft Excel",
  ];

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        const projectId = extractIdFromSlug(id);
        const res = await projectApi.getDetail(projectId);
        setProject(res.data);
        setHargaTawar(res.data.budget_max || "");
      } catch (err) {
        console.error("Gagal memuat detail proyek:", err);
        setError("Proyek tidak ditemukan atau telah ditutup.");
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

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
        `Halo Klien UMKM, saya mahasiswa Desain & TI yang siap merealisasikan brief ${project?.judul || "ini"}. Saya akan membuat 2 konsep visual awal dengan layout responsif, palet warna brand terkurasi, serta aset siap pakai (SVG/WebP). Siap revisi hingga sesuai kebutuhan usaha Anda!`,
      );
    } else if (type === "dev") {
      setCoverLetter(
        `Halo Klien UMKM, saya memiliki keahlian teknis untuk mengerjakan ${project?.judul || "proyek ini"}. Saya akan membangun solusi yang rapi, cepat, responsive di HP maupun Laptop, serta mudah dirawat. Kode bersih dan bergaransi bebas error.`,
      );
    } else {
      setCoverLetter(
        `Halo Klien UMKM, saya tertarik untuk membantu penulisan konten dan optimasi promosi untuk ${project?.judul || "kebutuhan ini"}. Mengedepankan struktur persuasif yang tepat sasaran bagi calon pelanggan usaha Anda.`,
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
      setError("Surat lamaran / rencana eksekusi minimal 20 karakter");
      return;
    }

    let fullPitch = coverLetter.trim();
    if (selectedTools.length > 0) {
      fullPitch += `\n\n[Tools & Keahlian: ${selectedTools.join(", ")}]`;
    }
    if (portfolioLink.trim()) {
      fullPitch += `\n[Tautan Portofolio Pendukung: ${portfolioLink.trim()}]`;
    }

    try {
      setSubmitting(true);
      await proposalApi.submit({
        project_id: project.id,
        harga_tawar: nominal,
        estimasi_hari: parseInt(estimasiHari, 10),
        cover_letter: fullPitch,
      });

      showSuccess(
        "Proposal Berhasil Dikirim!",
        `Penawaran profesional Anda sebesar ${formatCurrency(nominal)} telah diajukan ke klien UMKM. Anda dapat memantau status lamaran di menu Proposal Saya.`,
        () => navigate("/proposals"),
      );
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Gagal mengirim proposal lamaran.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 font-sans">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-96 bg-surface rounded-3xl border border-border animate-pulse" />
          <div className="lg:col-span-8 h-[500px] bg-surface rounded-3xl border border-border animate-pulse" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center font-sans space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-dark-900">
          Proyek Tidak Ditemukan
        </h2>
        <p className="text-xs text-muted">
          Proyek ini mungkin sudah ditutup atau tidak menerima proposal lagi.
        </p>
        <Link to="/projects">
          <Button variant="brand" size="sm">
            Kembali ke Katalog Proyek
          </Button>
        </Link>
      </div>
    );
  }

  const parsedNominal = parseFloat(hargaTawar) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* Back Link & Header */}
      <div className="space-y-3">
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-dark-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Rincian Proyek
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
            Formulir Lamaran Resmi Mahasiswa
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-dark-900 tracking-tight leading-tight mt-1">
            Ajukan Proposal & Penawaran Kerja
          </h1>
          <p className="text-xs sm:text-sm text-muted font-sans mt-1">
            Rangkai penawaran harga, estimasi waktu, metodologi kerja, dan
            portofolio Anda untuk meyakinkan klien UMKM.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Project Target Summary & Escrow Protection (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="p-6 space-y-5 bg-surface border-border rounded-3xl shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand">{project.kategori}</Badge>
                <Badge
                  variant={project.status === "OPEN" ? "success" : "warning"}
                >
                  {project.status}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-dark-900 leading-snug">
                {project.judul}
              </h3>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-border text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted">Batas Anggaran Klien:</span>
                <span className="font-bold text-dark-900">
                  {formatCurrency(project.budget_max)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Tenggat Waktu:</span>
                <span className="font-semibold text-dark-900">
                  {formatDate(project.deadline)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Pemberi Kerja:</span>
                <span className="font-semibold text-dark-900">
                  {project.umkm_profile?.nama_usaha || "Klien UMKM"}
                </span>
              </div>
            </div>

            {/* Brief Excerpt */}
            <div className="p-3.5 bg-canvas rounded-2xl border border-border text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-dark-900 block mb-1">
                Deskripsi Singkat Brief:
              </span>
              <p className="line-clamp-4 font-normal">
                {project.deskripsi_raw}
              </p>
            </div>

            {/* Escrow Guarantee Box */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Jaminan Escrow Holding 100%</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed font-normal">
                Jika proposal Anda diterima, klien UMKM wajib mengunci seluruh
                dana honor di escrow Makarya sebelum pengerjaan dimulai.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: Comprehensive Proposal Pitching Form (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="p-6 sm:p-8 space-y-6 bg-surface border-border rounded-3xl shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
              {error && (
                <div className="p-4 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Section 1: Financial & Duration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2.5">
                  <Sparkles className="w-4 h-4 text-brand-indigo" />
                  <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider">
                    1. Penawaran Finansial & Durasi Pengerjaan
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CurrencyInput
                    label="Harga Penawaran Anda"
                    placeholder="750.000"
                    value={hargaTawar}
                    onChange={(val) => setHargaTawar(val)}
                    helperText={`Maksimal sesuai batas budget proyek: ${formatCurrency(project.budget_max)}`}
                    required
                  />

                  <div>
                    <Input
                      label="Estimasi Waktu Selesai (Hari)"
                      type="number"
                      min="1"
                      max="90"
                      placeholder="Contoh: 3"
                      value={estimasiHari}
                      onChange={(e) => setEstimasiHari(e.target.value)}
                      required
                    />
                    <div className="flex items-center gap-1.5 mt-2">
                      {[1, 3, 5, 7, 14].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setEstimasiHari(String(d))}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                            estimasiHari === String(d)
                              ? "bg-dark-900 text-white border-dark-900 shadow-xs"
                              : "bg-canvas text-muted border-border hover:border-dark-900"
                          }`}
                        >
                          {d} Hari
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Net Income Calculation */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-indigo-950 block">
                      Honor Bersih Diterima Mahasiswa:
                    </span>
                    <span className="text-[11px] text-indigo-800">
                      Bebas potongan platform (0% Biaya Komisi Mahasiswa UBSI).
                    </span>
                  </div>
                  <span className="text-lg font-black text-brand-indigo font-sans">
                    {formatCurrency(parsedNominal)}
                  </span>
                </div>
              </div>

              {/* Section 2: Strategy Pitch & Cover Letter */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-indigo" />
                    <h3 className="text-sm font-bold text-dark-900 uppercase tracking-wider">
                      2. Pesan Strategi Kerja & Rencana Eksekusi
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted hidden sm:inline">
                      Pilih Templat:
                    </span>
                    <button
                      type="button"
                      onClick={() => applyTemplate("design")}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-indigo hover:underline px-2 py-1 bg-brand-indigo-light rounded-md border border-brand-indigo/15"
                    >
                      <Palette className="w-3 h-3" /> Desain
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTemplate("dev")}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-indigo hover:underline px-2 py-1 bg-brand-indigo-light rounded-md border border-brand-indigo/15"
                    >
                      <Code2 className="w-3 h-3" /> Web / TI
                    </button>
                  </div>
                </div>

                <TextArea
                  placeholder="Jelaskan secara terstruktur bagaimana Anda akan menyelesaikan brief ini, metodologi yang digunakan, serta nilai tambah yang Anda tawarkan kepada klien UMKM..."
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  helperText={`${coverLetter.length} / 20 karakter minimum`}
                  required
                />
              </div>

              {/* Section 3: Tools / Software Chips */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Wrench className="w-4 h-4 text-brand-indigo" />
                  3. Software & Keahlian yang Digunakan (Opsional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {toolOptions.map((tool) => {
                    const isSelected = selectedTools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleTool(tool)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-brand-indigo text-white border-brand-indigo shadow-xs"
                            : "bg-canvas text-slate-700 border-border hover:border-slate-400"
                        }`}
                      >
                        {tool}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: External Portfolio Attachment */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <LinkIcon className="w-4 h-4 text-brand-indigo" />
                  4. Tautan Portofolio Pendukung (Opsional)
                </label>
                <Input
                  placeholder="https://behance.net/karya atau https://github.com/projek"
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                <Link to={`/projects/${project.id}`}>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="text-xs font-bold"
                  >
                    Batal
                  </Button>
                </Link>

                <Button
                  type="submit"
                  variant="brand"
                  size="lg"
                  loading={submitting}
                  className="text-xs sm:text-sm font-bold shadow-brand"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Proposal Lamaran
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
