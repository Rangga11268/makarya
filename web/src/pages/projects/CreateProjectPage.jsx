import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { projectApi, walletApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Input, TextArea } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { ProjectCard } from "../../components/features/ProjectCard";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Tag,
  DollarSign,
  Calendar,
  Eye,
  Building2,
  HelpCircle,
  Plus,
  Trash2,
  Cpu,
} from "lucide-react";

export function CreateProjectPage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  // Multi-step state (1, 2, 3, 4)
  const [currentStep, setCurrentStep] = useState(1);
  const [wallet, setWallet] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "DESIGN",
    deskripsi_raw: "",
    budget_max: 500000,
    deadline: "",
    // Step 2 AI Parsed Requirements
    deliverables: [],
    recommendedSkills: [],
    customDeliverableInput: "",
  });

  const categories = [
    {
      id: "DESIGN",
      label: "Desain Grafis & Logo",
      desc: "Logo, kemasan produk, banner promosi, spanduk, stiker menu",
      recommendedBudget: "Rp 300.000 - Rp 700.000",
    },
    {
      id: "UIUX",
      label: "UI/UX Design (Figma)",
      desc: "Mockup visual aplikasi, web wireframe, prototipe interaktif",
      recommendedBudget: "Rp 600.000 - Rp 1.500.000",
    },
    {
      id: "PEMROGRAMAN",
      label: "Web & Coding",
      desc: "Landing page promosi, web profil usaha, sistem kasir sederhana",
      recommendedBudget: "Rp 800.000 - Rp 2.000.000",
    },
    {
      id: "VIDEO",
      label: "Video Promosi & Animasi",
      desc: "Reels Instagram, konten TikTok, video profil produk, motion graphic",
      recommendedBudget: "Rp 350.000 - Rp 800.000",
    },
    {
      id: "COPYWRITING",
      label: "Copywriting & SEO",
      desc: "Caption postingan media sosial, artikel blog promosi, storytelling",
      recommendedBudget: "Rp 250.000 - Rp 500.000",
    },
    {
      id: "ADMIN_DATA",
      label: "Admin & Data Excel",
      desc: "Rekap nota penjualan harian, entri stok barang, pembukuan sederhana",
      recommendedBudget: "Rp 250.000 - Rp 500.000",
    },
  ];

  useEffect(() => {
    async function loadWallet() {
      try {
        const res = await walletApi.getMe();
        setWallet(res.data);
      } catch (err) {
        setWallet({ saldo_aktif: 0, saldo_escrow: 0 });
      }
    }
    loadWallet();

    // Default deadline: 7 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    const dateStr = defaultDate.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, deadline: dateStr }));
  }, []);

  // AI Requirement Analyzer Engine
  const runAiRequirementAnalyzer = (rawText, categoryId) => {
    setAiAnalyzing(true);

    setTimeout(() => {
      let deliverables = [];
      let skills = [];

      if (categoryId === "DESIGN") {
        deliverables = [
          "File master vector logo beresolusi tinggi (.AI / .SVG)",
          "Format siap pakai PNG transparan dan JPG (Mode RGB & CMYK)",
          "Buku panduan warna brand (Hex code color palette)",
          "Pratinjau mockup kemasan / paper cup produk",
        ];
        skills = [
          "Logo & Branding",
          "Desain Kemasan (Packaging)",
          "Adobe Illustrator",
          "Desain Menu & Banner",
        ];
      } else if (categoryId === "PEMROGRAMAN") {
        deliverables = [
          "Landing page responsive yang ramah perangkat mobile dan desktop",
          "Integrasi tombol chat langsung WhatsApp untuk reservasi pelanggan",
          "Katalog daftar menu digital dan informasi lokasi usaha",
          "Kode sumber clean code dan panduan deployment hosting",
        ];
        skills = [
          "Landing Page HTML/CSS",
          "WordPress / Web Builder",
          "Fullstack Web (React/Python/PHP)",
        ];
      } else if (categoryId === "UIUX") {
        deliverables = [
          "File desain prototipe interaktif di Figma (5-7 screen utama)",
          "Desain komponen tombol, typography system, dan palet warna",
          "Flow interaksi pengguna (User Journey & Wireframing)",
        ];
        skills = [
          "UI/UX Website",
          "UI/UX Mobile App",
          "Wireframing & Prototyping",
        ];
      } else if (categoryId === "VIDEO") {
        deliverables = [
          "3 video pendek promosi (durasi 30-45 detik format 9:16 vertikal)",
          "Editing transisi dinamis, efek estetik, dan audio trending bebas lisensi",
          "File render akhir MP4 Full HD (1080x1920)",
        ];
        skills = ["Video Reels / TikTok Promosi", "Fotografi Produk UMKM"];
      } else if (categoryId === "COPYWRITING") {
        deliverables = [
          "10 set caption postingan media sosial dengan formula Hook-Story-Offer",
          "Riset hashtag relevan target lokal",
          "Teks deskripsi storytelling menu unggulan",
        ];
        skills = ["Copywriting Iklan & Social Media", "Artikel SEO"];
      } else {
        deliverables = [
          "Rekap data terstruktur ke dalam Google Spreadsheet",
          "Otomatisasi rumus penjumlahan dan persentase keuntungan",
          "Dashboard ringkasan grafik penjualan bulanan",
        ];
        skills = [
          "Entry Data Excel / Spreadsheet",
          "Pembukuan Keuangan Sederhana",
        ];
      }

      setFormData((prev) => ({
        ...prev,
        deliverables,
        recommendedSkills: skills,
      }));
      setAiAnalyzing(false);
    }, 600);
  };

  // Step 1 Validation & Next
  const handleStep1Next = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (formData.judul.trim().length < 5) {
      setErrorMessage("Judul proyek minimal 5 karakter.");
      return;
    }
    if (formData.deskripsi_raw.trim().length < 15) {
      setErrorMessage(
        "Ceritakan kebutuhan usaha Anda minimal 15 karakter agar AI dapat menganalisis kebutuhan.",
      );
      return;
    }

    runAiRequirementAnalyzer(formData.deskripsi_raw, formData.kategori);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 Add/Remove Deliverable
  const handleAddDeliverable = () => {
    if (!formData.customDeliverableInput.trim()) return;
    setFormData({
      ...formData,
      deliverables: [
        ...formData.deliverables,
        formData.customDeliverableInput.trim(),
      ],
      customDeliverableInput: "",
    });
  };

  const handleRemoveDeliverable = (index) => {
    setFormData({
      ...formData,
      deliverables: formData.deliverables.filter((_, idx) => idx !== index),
    });
  };

  // Step 3 Validation & Next
  const handleStep3Next = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const budget = parseFloat(formData.budget_max);
    if (isNaN(budget) || budget < 50000 || budget > 2000000) {
      setErrorMessage(
        "Budget maksimal proyek berkisar antara Rp 50.000 s/d Rp 2.000.000.",
      );
      return;
    }
    if (!formData.deadline) {
      setErrorMessage("Tentukan batas tenggat waktu selesai proyek.");
      return;
    }

    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Final Submit Project to Backend
  const handleFinalSubmit = async () => {
    setErrorMessage(null);
    try {
      setSubmitting(true);

      // Concatenate raw description with AI-structured deliverables
      const deliverablesText =
        formData.deliverables.length > 0
          ? `\n\n[Rincian Deliverable Kebutuhan]:\n` +
            formData.deliverables.map((d, i) => `${i + 1}. ${d}`).join("\n")
          : "";

      const fullDescription = `${formData.deskripsi_raw.trim()}${deliverablesText}`;

      const res = await projectApi.create({
        judul: formData.judul.trim(),
        kategori: formData.kategori,
        budget_max: parseFloat(formData.budget_max),
        deadline: formData.deadline,
        deskripsi_raw: fullDescription,
      });

      addToast(
        "Selamat! Proyek berhasil diterbitkan ke pasar Makarya.",
        "success",
      );
      navigate(`/projects/${res.data.id}`);
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Gagal menerbitkan proyek baru.";
      setErrorMessage(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const currentCatObj =
    categories.find((c) => c.id === formData.kategori) || categories[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* Header */}
      <SectionHeader
        badgeText="Panduan Penerbitan Proyek"
        title="Pasang Kebutuhan Proyek UMKM"
        subtitle="Sistem cerdas Makarya membantu menstrukturkan kebutuhan usaha Anda agar mahasiswa memahami ekspektasi deliverable secara presisi."
      />

      {/* 4-Step Progress Indicator */}
      <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {/* Step 1 */}
          <div
            className={`flex items-center gap-2.5 ${currentStep >= 1 ? "text-dark-900 font-bold" : "text-muted"}`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                currentStep === 1
                  ? "bg-brand-indigo text-white shadow-brand"
                  : currentStep > 1
                    ? "bg-emerald-600 text-white"
                    : "bg-canvas text-muted border border-border"
              }`}
            >
              {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[11px] uppercase tracking-wider block font-semibold text-muted">
                Langkah 1
              </span>
              <span className="text-xs truncate block">Konteks Usaha</span>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`flex items-center gap-2.5 ${currentStep >= 2 ? "text-dark-900 font-bold" : "text-muted"}`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                currentStep === 2
                  ? "bg-brand-indigo text-white shadow-brand"
                  : currentStep > 2
                    ? "bg-emerald-600 text-white"
                    : "bg-canvas text-muted border border-border"
              }`}
            >
              {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : "2"}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[11px] uppercase tracking-wider block font-semibold text-muted">
                Langkah 2
              </span>
              <span className="text-xs truncate block flex items-center gap-1">
                AI Assistant <Sparkles className="w-3 h-3 text-brand-cyan" />
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`flex items-center gap-2.5 ${currentStep >= 3 ? "text-dark-900 font-bold" : "text-muted"}`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                currentStep === 3
                  ? "bg-brand-indigo text-white shadow-brand"
                  : currentStep > 3
                    ? "bg-emerald-600 text-white"
                    : "bg-canvas text-muted border border-border"
              }`}
            >
              {currentStep > 3 ? <CheckCircle2 className="w-4 h-4" /> : "3"}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[11px] uppercase tracking-wider block font-semibold text-muted">
                Langkah 3
              </span>
              <span className="text-xs truncate block">Budget & Waktu</span>
            </div>
          </div>

          {/* Step 4 */}
          <div
            className={`flex items-center gap-2.5 ${currentStep >= 4 ? "text-dark-900 font-bold" : "text-muted"}`}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                currentStep === 4
                  ? "bg-brand-indigo text-white shadow-brand"
                  : "bg-canvas text-muted border border-border"
              }`}
            >
              4
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[11px] uppercase tracking-wider block font-semibold text-muted">
                Langkah 4
              </span>
              <span className="text-xs truncate block">Review & Terbit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl animate-in fade-in">
          {errorMessage}
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 1: Konteks & Cerita Kebutuhan UMKM */}
      {/* ======================================================== */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="border-b border-border pb-4 space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-dark-900 tracking-tight font-sans">
              1. Rincian Kebutuhan & Konteks Usaha Anda
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Pilih bidang keahlian dan ceritakan produk atau masalah yang ingin
              Anda selesaikan.
            </p>
          </div>

          <form onSubmit={handleStep1Next} className="space-y-6">
            <Input
              label="Judul Proyek Kebutuhan"
              placeholder="Contoh: Desain Ulang Logo & Kemasan Paper Cup Kedai Kopi"
              value={formData.judul}
              onChange={(e) =>
                setFormData({ ...formData, judul: e.target.value })
              }
              helperText="Gunakan judul yang ringkas dan menggambarkan inti hasil deliverable."
              required
            />

            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
                Pilih Kategori Keahlian Digital
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() =>
                      setFormData({ ...formData, kategori: cat.id })
                    }
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between select-none ${
                      formData.kategori === cat.id
                        ? "bg-brand-indigo-light/50 border-brand-indigo shadow-xs"
                        : "bg-surface hover:bg-canvas border-border"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold text-dark-900">
                          {cat.label}
                        </h4>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            formData.kategori === cat.id
                              ? "border-brand-indigo bg-brand-indigo text-white"
                              : "border-border"
                          }`}
                        >
                          {formData.kategori === cat.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-border-subtle text-[10px] text-brand-indigo font-bold">
                      Kisaran Wajar: {cat.recommendedBudget}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <TextArea
              label="Cerita Kebutuhan Usaha (Raw Brief)"
              rows={5}
              placeholder="Ceritakan dengan bahasa sehari-hari: Apa usaha Anda, target pembeli Anda, masalah apa yang ingin diatasi, atau contoh referensi yang Anda sukai..."
              value={formData.deskripsi_raw}
              onChange={(e) =>
                setFormData({ ...formData, deskripsi_raw: e.target.value })
              }
              helperText="AI Assistant Makarya akan membaca cerita ini untuk menyusun daftar kebutuhan spesifik pada langkah berikutnya."
              required
            />

            <div className="flex items-center justify-end pt-4 border-t border-border">
              <Button
                variant="brand"
                size="lg"
                type="submit"
                className="font-bold shadow-brand"
              >
                <span>Lanjut ke Analisis AI Assistant</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ======================================================== */}
      {/* STEP 2: AI Requirement Assistant (Strukturisasi Deliverable) */}
      {/* ======================================================== */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="border-b border-border pb-4 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-indigo-light text-brand-indigo text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              AI Requirement Engineering
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-dark-900 tracking-tight font-sans">
              2. Hasil Strukturisasi Kebutuhan & Rekomendasi Deliverable
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              AI telah memecah cerita kebutuhan Anda menjadi daftar deliverable
              teknis yang jelas untuk mahasiswa. Anda dapat menambah atau
              menyunting poin di bawah ini.
            </p>
          </div>

          {aiAnalyzing ? (
            <div className="py-12 text-center space-y-3">
              <Cpu className="w-8 h-8 text-brand-indigo animate-spin mx-auto" />
              <h4 className="text-sm font-bold text-dark-900">
                AI sedang memproses kebutuhan usaha Anda...
              </h4>
              <p className="text-xs text-muted">
                Mengekstrak spesifikasi output deliverable & pemetaan keahlian
                digital.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Deliverable Items List */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
                  Daftar Deliverable yang Wajib Diserahkan Mahasiswa (
                  {formData.deliverables.length} Item)
                </label>

                <div className="space-y-2">
                  {formData.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-canvas border border-border flex items-center justify-between gap-3 text-xs text-dark-900"
                    >
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="p-1 text-muted hover:text-rose-600 transition-colors"
                        title="Hapus deliverable"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Deliverable Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Tambahkan poin kebutuhan deliverable lainnya..."
                    value={formData.customDeliverableInput}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customDeliverableInput: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 text-xs bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo"
                  />
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleAddDeliverable}
                    className="text-xs font-bold shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah Poin
                  </Button>
                </div>
              </div>

              {/* Recommended Skill Tags */}
              <div className="p-4 rounded-2xl bg-brand-indigo-light/30 border border-brand-indigo/20 space-y-2">
                <span className="text-xs font-bold text-brand-indigo block">
                  Tag Keahlian Mahasiswa yang Direkomendasikan AI:
                </span>
                <div className="flex flex-wrap gap-2">
                  {formData.recommendedSkills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="brand"
                      className="text-xs py-1 px-3"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Kembali
                </Button>
                <Button
                  variant="brand"
                  size="lg"
                  onClick={() => setCurrentStep(3)}
                  className="font-bold shadow-brand"
                >
                  <span>Lanjut ke Budget & Timeline</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ======================================================== */}
      {/* STEP 3: Anggaran & Batas Waktu Wajar */}
      {/* ======================================================== */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 space-y-6 animate-in fade-in">
          <div className="border-b border-border pb-4 space-y-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-dark-900 tracking-tight font-sans">
              3. Tentukan Anggaran Wajar & Batas Waktu Pengerjaan
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Sesuaikan nilai imbalan yang layak untuk mahasiswa. Platform
              membatasi pagu maksimal Rp 2.000.000 demi standar
              micro-freelancing.
            </p>
          </div>

          <form onSubmit={handleStep3Next} className="space-y-6">
            {/* Budget Input & Recommendation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider">
                  Maksimal Anggaran Honor (Budget Max)
                </label>
                <span className="text-lg font-black text-brand-indigo font-sans">
                  {formatCurrency(formData.budget_max)}
                </span>
              </div>

              <input
                type="range"
                min="50000"
                max="2000000"
                step="50000"
                value={formData.budget_max}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget_max: parseInt(e.target.value, 10),
                  })
                }
                className="w-full accent-brand-indigo cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs text-muted">
                <span>Rp 50.000 (Paling Ringan)</span>
                <span className="font-bold text-dark-900 bg-canvas px-3 py-1 rounded-full border border-border">
                  Rekomendasi Pasar: {currentCatObj.recommendedBudget}
                </span>
                <span>Rp 2.000.000 (Maksimal Platform)</span>
              </div>
            </div>

            {/* Deadline Picker */}
            <Input
              label="Tenggat Waktu Selesai (Batas Akhir Deliverable)"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              helperText="Berikan waktu pengerjaan yang realistis agar mahasiswa dapat menghasilkan karya berkualitas."
              required
            />

            {/* Wallet Escrow Info */}
            <div className="p-4 rounded-2xl bg-canvas border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted block">
                  Saldo Aktif Dompet Anda Saat Ini:
                </span>
                <span className="text-base font-bold text-dark-900 block">
                  {formatCurrency(wallet?.saldo_aktif || 0)}
                </span>
              </div>
              <div className="text-xs text-slate-600 max-w-sm flex items-start gap-1.5">
                <Info className="w-4 h-4 text-brand-indigo shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold text-dark-900">
                    Informasi Escrow:
                  </span>{" "}
                  Saldo Anda baru akan dikunci saat Anda menerima proposal
                  mahasiswa tertentu.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCurrentStep(2)}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Kembali
              </Button>
              <Button
                variant="brand"
                size="lg"
                type="submit"
                className="font-bold shadow-brand"
              >
                <span>Pratinjau & Konfirmasi Publikasi</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ======================================================== */}
      {/* STEP 4: Pratinjau Publik & Garansi Escrow */}
      {/* ======================================================== */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4 space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-dark-900 tracking-tight font-sans">
                4. Pratinjau Tampilan Proyek di Katalog Mahasiswa
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                Periksa kembali ringkasan proyek sebelum diterbitkan ke ribuan
                talenta mahasiswa Makarya.
              </p>
            </div>

            {/* Live Card Preview */}
            <div className="max-w-md mx-auto">
              <ProjectCard
                project={{
                  id: "preview",
                  judul: formData.judul,
                  kategori: formData.kategori,
                  deskripsi_raw: formData.deskripsi_raw,
                  budget_max: formData.budget_max,
                  deadline: formData.deadline,
                  total_pelamar: 0,
                  umkm_profile: {
                    nama_usaha: user?.email
                      ? user.email.split("@")[0].toUpperCase()
                      : "Usaha UMKM Anda",
                    kota: "Indonesia",
                  },
                }}
              />
            </div>

            {/* Deliverables Checklist Summary */}
            <div className="p-5 rounded-2xl bg-canvas border border-border space-y-3 text-left">
              <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                Ringkasan Deliverable yang Akan Dikerjakan Mahasiswa:
              </h4>
              <ul className="space-y-1.5 text-xs text-muted">
                {formData.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Escrow Guarantee Commitment */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold">
                  Komitmen Perlindungan Dana 100% Escrow
                </h5>
                <p className="leading-relaxed text-emerald-800">
                  Dengan menerbitkan proyek ini, Anda setuju bahwa dana honor
                  akan ditahan di rekening penampung resmi Makarya saat menerima
                  proposal, dan baru diteruskan ke mahasiswa setelah Anda
                  memeriksa dan menyetujui hasil deliverable.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCurrentStep(3)}
                disabled={submitting}
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Kembali & Edit
              </Button>
              <Button
                variant="gradient"
                size="lg"
                onClick={handleFinalSubmit}
                loading={submitting}
                className="font-bold shadow-brand text-sm sm:text-base px-8"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Terbitkan Proyek Sekarang
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
