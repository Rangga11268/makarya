import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi, talentApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { CategoryCard } from "../../components/features/CategoryCard";
import { HowItWorksStep } from "../../components/features/HowItWorksStep";
import { ProjectCard } from "../../components/features/ProjectCard";
import { TalentCard } from "../../components/features/TalentCard";
import {
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Compass,
  ShieldCheck,
  Search,
  ArrowUpRight,
  CheckCircle2,
  Users,
  ChevronDown,
  HelpCircle,
  Briefcase,
  GraduationCap,
  Building2,
  GraduationCap,
  Lock,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  Award,
  ChevronDown,
  HelpCircle,
  X,
  Star,
  Zap,
  Layers,
} from "lucide-react";

export function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [latestProjects, setLatestProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTalents, setLoadingTalents] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [openFaq, setOpenFaq] = useState(0);
  const [talents, setTalents] = useState([]);

  useEffect(() => {
    async function loadPublicData() {
      try {
        setLoading(true);
        const res = await projectApi.browse({ limit: 6, status: "OPEN" });
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        setLatestProjects(list);
      } catch (err) {
        setLatestProjects([]);
      } finally {
        setLoading(false);
      }

      try {
        setLoadingTalents(true);
        const tRes = await talentApi.getTalents({ limit: 4 });
        const tList = Array.isArray(tRes?.data)
          ? tRes.data
          : Array.isArray(tRes)
            ? tRes
            : [];
        setTalents(tList);
      } catch (tErr) {
        console.warn("Gagal memuat talenta riil dari API:", tErr);
        setTalents([]);
      } finally {
        setLoadingTalents(false);
      }
    }
    loadPublicData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/projects?keyword=${encodeURIComponent(searchKeyword)}`);
    if (searchKeyword.trim()) {
      navigate(`/projects?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate("/projects");
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/projects?keyword=${encodeURIComponent(tag)}`);
  };

  const categories = [
    { code: "DESIGN", title: "Desain Grafis & Kemasan" },
    { code: "UIUX", title: "UI/UX & Desain Aplikasi" },
    { code: "PEMROGRAMAN", title: "Website & Pemrograman" },
    { code: "VIDEO", title: "Video Reels & Promosi" },
    { code: "COPYWRITING", title: "Copywriting & Artikel SEO" },
    { code: "ADMIN_DATA", title: "Admin & Pengolahan Data" },
    {
      code: "DESIGN",
      title: "Desain Grafis & Kemasan",
      startingPrice: "Rp 100.000",
      image: "/images/categories/cat_design.jpg",
    },
    {
      code: "UIUX",
      title: "UI/UX & Desain Aplikasi",
      startingPrice: "Rp 200.000",
      image: "/images/categories/cat_uiux.jpg",
    },
    {
      code: "PEMROGRAMAN",
      title: "Website & Pemrograman",
      startingPrice: "Rp 250.000",
      image: "/images/categories/cat_web.jpg",
    },
    {
      code: "VIDEO",
      title: "Video Reels & Promosi",
      startingPrice: "Rp 150.000",
      image: "/images/categories/cat_video.jpg",
    },
    {
      code: "COPYWRITING",
      title: "Copywriting & Artikel SEO",
      startingPrice: "Rp 75.000",
      image: "/images/categories/cat_copywriting.jpg",
    },
    {
      code: "ADMIN_DATA",
      title: "Admin & Pengolahan Data",
      startingPrice: "Rp 100.000",
      image: "/images/categories/cat_data.jpg",
    },
  ];

  const getCategoryCount = (code) => {
    return latestProjects.filter((p) => p.kategori === code).length;
  };

  const popularTags = [
    "Desain Logo",
    "Landing Page UMKM",
    "Video TikTok/Reels",
    "UI/UX Figma",
    "Katalog Produk",
    "Input Data Excel",
  ];

  const faqs = [
    {
      q: "Bagaimana sistem Rekening Bersama (Escrow) melindungi dana saya?",
      a: "Setiap dana pembayaran proyek disimpan sementara di rekening escrow resmi Makarya. Dana HANYA akan diteruskan ke mahasiswa setelah UMKM meninjau hasil pekerjaan dan menyetujui penyelesaian.",
    },
    {
      q: "Siapa saja yang boleh mendaftar dan mengerjakan proyek?",
      a: "Hanya mahasiswa aktif dengan verifikasi identitas kampus (.ac.id atau KTM resmi) yang dapat mengajukan proposal. Ini menjamin akuntabilitas dan dedikasi akademis tinggi.",
    },
    {
      q: "Apakah ada biaya komisi tersembunyi bagi mahasiswa?",
      a: "Tidak ada. Makarya menerapkan sistem komisi 0% bagi mahasiswa freelancer, sehingga imbalan yang disepakati diterima utuh tanpa potongan platform.",
    },
    {
      q: "Berapa batas pagu anggaran untuk proyek di Makarya?",
      a: "Maksimal Rp 2.000.000 per proyek. Batasan ini menjamin ruang lingkup micro-freelancing tetap terukur, cepat selesai, dan terjangkau bagi pelaku UMKM.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 font-sans">
      {/* 1. HERO SECTION */}
      <section className="bg-dark-900 text-white pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-border">
        {/* Background Visual Element (Slight ambient gradient) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-indigo/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-cyan/20 rounded-full blur-[100px]" />
    <div className="space-y-16 sm:space-y-24 pb-20 font-sans text-dark-900 bg-[#FAFAFC]">
      {/* 1. HERO SECTION - Search-First & High Credibility (Fiverr & Dribbble Benchmark) */}
      <section className="relative bg-[#0F172A] text-white pt-20 pb-24 sm:pt-28 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-800">
        {/* Ambient Studio Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-40 right-1/4 w-96 h-96 bg-brand-indigo/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-brand-cyan/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-bold tracking-wider uppercase text-brand-cyan">
            <ShieldCheck className="w-4 h-4" />
            Platform Micro-Freelancing Kampus Resmi
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
          {/* Official Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold tracking-wide text-brand-cyan backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0" />
            <span>Platform Micro-Freelancing Kampus Resmi & Terpercaya</span>
          </div>

          <div className="max-w-4xl space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white">
              Kerjakan Proyek Nyata.<br className="hidden sm:block" /> Bangun Pengalamanmu.
          {/* Core Value Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
              Solusi Digital Cepat untuk UMKM, <br className="hidden sm:inline" />
              Dikerjakan Mahasiswa Berbakat.
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
              Makarya menghubungkan mahasiswa berbakat dengan UMKM yang membutuhkan solusi digital. Aman dengan rekening bersama, dan jadikan setiap proyek sebagai langkah awal karirmu.
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Temukan talenta terverifikasi dari kampus ternama untuk desain grafis, website, video, hingga data. Aman dengan sistem Escrow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md mx-auto">
            <Link to="/projects" className="w-full sm:w-auto">
              <Button
                variant="brand"
                size="lg"
                className="w-full sm:w-auto text-sm font-bold shadow-brand justify-center rounded-full"
              >
                Mulai Cari Proyek
              </Button>
            </Link>
          {/* Search-First Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl shadow-2xl border border-slate-200"
          >
            <div className="flex items-center gap-3 px-3 py-2 sm:py-0 w-full">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari keahlian: logo, website, video reels, UI/UX..."
                className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:ring-0"
              />
            </div>
            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm shrink-0 shadow-brand hover:brightness-105"
            >
              Cari Solusi
            </Button>
          </form>

            <Link to="/login" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-sm font-bold justify-center rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 shadow-none"
          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 pt-1">
            <span className="font-medium text-slate-400">Paling dicari:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer text-xs"
              >
                Butuh Freelancer UMKM?
              </Button>
            </Link>
                {tag}
              </button>
            ))}
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Proyek Terstruktur
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pembayaran Escrow Aman
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Khusus Kampus & UMKM
            </span>
          {/* 3 Pillars Trust Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto border-t border-slate-800/80">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Escrow 100% (Dana Terproteksi)</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
              <span>Mahasiswa Terverifikasi Kampus</span>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-2.5 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>0% Potongan Komisi Freelancer</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & SOCIAL PROOF */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-surface rounded-3xl border border-border shadow-float p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="w-full sm:w-auto pt-4 sm:pt-0 px-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-dark-900 tracking-tight">500+</span>
            <span className="block text-xs font-semibold text-muted uppercase tracking-wider mt-1">Mahasiswa Terverifikasi</span>
      {/* 2. STATS BAR COUNTER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="pt-2 sm:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">500+</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Mahasiswa Terverifikasi</div>
          </div>
          <div className="w-full sm:w-auto pt-4 sm:pt-0 px-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-brand-indigo tracking-tight">250+</span>
            <span className="block text-xs font-semibold text-muted uppercase tracking-wider mt-1">Proyek Terselesaikan</span>
          <div className="pt-2 sm:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-indigo tracking-tight">250+</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Proyek Selesai</div>
          </div>
          <div className="w-full sm:w-auto pt-4 sm:pt-0 px-4">
            <span className="text-3xl sm:text-4xl font-extrabold text-dark-900 tracking-tight">100+</span>
            <span className="block text-xs font-semibold text-muted uppercase tracking-wider mt-1">UMKM Terbantu</span>
          <div className="pt-2 sm:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">100+</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Mitra UMKM Aktif</div>
          </div>
          <div className="pt-2 sm:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">100%</div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Jaminan Dana Aman</div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM & SOLUTION SECTION (2 Columns) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 pt-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-dark-900 tracking-tight">
            Mencari pengalaman tidak harus menunggu lulus.
          </h2>
          <p className="text-muted text-base sm:text-lg">
            Makarya mempertemukan talenta muda yang butuh portofolio dengan pelaku usaha mikro yang butuh solusi digital terjangkau.
          </p>
      {/* 3. VISUAL CATEGORIES SHOWCASE (Dribbble & Fiverr Gallery Standard) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-indigo mb-2">
              <Layers className="w-4 h-4" />
              Katalog Layanan Unggulan
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Eksplorasi Layanan Digital Terpopuler
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Pilih spesialisasi yang sesuai dengan kebutuhan peningkatan bisnis Anda.
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-indigo hover:text-brand-indigo/80 transition-colors"
          >
            <span>Semua Kategori</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* MHS Box */}
          <div className="bg-canvas border border-border rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-indigo/5 rounded-full blur-3xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-white border border-border shadow-xs flex items-center justify-center text-dark-900 mb-6">
              <GraduationCap className="w-6 h-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.code}
              category={cat}
              projectCount={getCategoryCount(cat.code)}
              image={cat.image}
              startingPrice={cat.startingPrice}
            />
          ))}
        </div>
      </section>

      {/* 4. INTERACTIVE SHOWCASE TABS (Live Projects vs Talent Directory) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
          {/* Header with Switcher Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Peluang Nyata & Talenta Terpilih
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Jelajahi tawaran kerja yang sedang buka atau temukan mahasiswa berbakat untuk bisnis Anda.
              </p>
            </div>
            <h3 className="text-2xl font-bold text-dark-900">Mahasiswa kesulitan...</h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Mendapatkan pengalaman kerja nyata yang dibayar adil.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Mencari proyek freelance yang aman tanpa takut penipuan.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>Membangun portofolio riil sebelum wisuda.</span>
              </li>
            </ul>
          </div>

          {/* UMKM Box */}
          <div className="bg-dark-900 text-white border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs relative overflow-hidden">
             <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-6">
              <Building2 className="w-6 h-6" />
            {/* Pill Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "projects"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="w-4 h-4 text-brand-indigo" />
                <span>Proyek Terbuka ({latestProjects.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("talents")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "talents"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Star className="w-4 h-4 text-amber-500" />
                <span>Direktori Talenta ({talents.length})</span>
              </button>
            </div>
            <h3 className="text-2xl font-bold text-white">UMKM kesulitan...</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>Menyewa agency digital profesional karena budget terbatas.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>Menemukan freelancer mandiri yang terpercaya dan terverifikasi.</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>Mendeskripsikan kebutuhan digital (logo, web, admin) dengan tepat.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Minimalist Timeline) */}
      <section
        id="cara-kerja"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 pt-10"
      >
        <div className="bg-surface border border-border rounded-3xl p-8 sm:p-12 shadow-xs space-y-12">
          <SectionHeader
            centered
            badgeText="Alur Transaksi Tanpa Cemas"
            title="Bagaimana Makarya Melindungi UMKM & Mahasiswa?"
            subtitle="Sistem rekening bersama otomatis menjamin keamanan dana klien dan kepastian pembayaran honor bagi mahasiswa."
          />
          {/* Tab Content: Projects */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-56 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : latestProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestProjects.slice(0, 6).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Belum ada proyek terbuka saat ini</p>
                  <p className="text-xs text-slate-500 mt-1">Jadilah yang pertama memasang kebutuhan pekerjaan digital.</p>
                  <Link to="/login" className="inline-block mt-4">
                    <Button variant="brand" size="sm">Pasang Proyek Pertama</Button>
                  </Link>
                </div>
              )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowItWorksStep
              stepNumber={1}
              iconName="escrow"
              isHighlight={true}
              title="Pasang Brief & Kunci Dana"
              description="Klien UMKM menentukan kebutuhan dan anggaran. Saat proposal mahasiswa disetujui, dana otomatis diamankan di rekening penampung resmi Makarya."
            />
            <HowItWorksStep
              stepNumber={2}
              iconName="work"
              title="Mahasiswa Mengerjakan Karya"
              description="Mahasiswa mengerjakan pesanan dengan tenang karena honor sudah terjamin di awal, sesuai batas waktu dan instruksi brief."
            />
            <HowItWorksStep
              stepNumber={3}
              iconName="complete"
              title="Periksa Hasil & Cairkan Honor"
              description="Klien menerima dan memeriksa berkas pengerjaan. Setelah disetujui, dana langsung dicairkan utuh ke dompet saldo mahasiswa."
            />
          </div>
              <div className="text-center pt-4">
                <Link to="/projects">
                  <Button variant="outline" size="md" className="font-bold">
                    <span>Lihat Semua Proyek Terbuka</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Tab Content: Talents */}
          {activeTab === "talents" && (
            <div className="space-y-6">
              {loadingTalents ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-64 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : talents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {talents.map((talent) => (
                    <TalentCard key={talent.id} talent={talent} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">Mahasiswa sedang mempersiapkan portofolio</p>
                  <p className="text-xs text-slate-500 mt-1">Daftarkan dirimu sebagai talenta terverifikasi kampus sekarang.</p>
                  <Link to="/register" className="inline-block mt-4">
                    <Button variant="brand" size="sm">Daftar Jadi Freelancer</Button>
                  </Link>
                </div>
              )}

              <div className="text-center pt-4">
                <Link to="/talents">
                  <Button variant="outline" size="md" className="font-bold">
                    <span>Jelajahi Seluruh Direktori Talenta</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. LATEST LIVE PROJECTS PREVIEW */}
      <section
        id="proyek"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <SectionHeader
          badgeText="Peluang Terbaru"
          title="Proyek UMKM Siap Dikerjakan"
          subtitle="Tinjau kebutuhan digital terbaru dari pemilik usaha lokal dan ajukan penawaran terbaik Anda."
          action={
            <Link to="/projects">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold rounded-full border-slate-300"
              >
                Lihat Semua Proyek
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 bg-surface rounded-card border border-border animate-pulse"
              />
            ))}
      {/* 5. ESCROW STANDARD - Solid Security Architecture (Anti-Slop, No Whining Box) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-14 border border-slate-700 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              Sistem Escrow Terlindungi
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Standar Transaksi Aman Tanpa Rasa Khawatir
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Kami memutus rantai penipuan freelancer dan keterlambatan bayar dengan sistem Rekening Bersama resmi Makarya.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* 6. TALENT SHOWCASE */}
      <section
        id="talenta"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <SectionHeader
          badgeText="Talenta Kampus Teruji"
          title="Mahasiswa Berprestasi & Terverifikasi"
          subtitle="Profil talenta muda dengan rekam jejak deliverable memuaskan dan portofolio karya nyata."
        />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/20 border border-brand-indigo/40 flex items-center justify-center font-extrabold text-brand-cyan text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-white">UMKM Deposit Dana ke Escrow</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sebelum mahasiswa mulai bekerja, UMKM menyetor nilai kontrak ke rekening bersama Makarya. Mahasiswa tenang karena dana sudah pasti ada.
              </p>
            </div>

        {loadingTalents ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-56 bg-surface rounded-2xl border border-border animate-pulse"
              />
            ))}
            {/* Step 2 */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center font-extrabold text-brand-cyan text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Pengerjaan & Progres Transparan</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Mahasiswa mengunggah draft berkala di workspace Makarya. UMKM dapat mereview revisi dan memberi masukan secara langsung.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-extrabold text-emerald-400 text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Puas Baru Cair 100% Utuh</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Setelah hasil akhir disetujui, dana langsung dicairkan ke rekening mahasiswa secara penuh tanpa pemotongan komisi platform.
              </p>
            </div>
          </div>
        ) : talents.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-2xl border border-border">
            <p className="text-sm font-semibold text-muted">
              Belum ada data talenta yang dimuat saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {talents.map((talent, idx) => (
              <TalentCard
                key={talent.id || idx}
                name={talent.nama_lengkap}
                prodi={talent.prodi}
                rating={Number(talent.rating_avg) || 5.0}
                totalJobs={talent.total_proyek_selesai || 0}
                skills={talent.skills || []}
                avatarUrl={talent.url_foto}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/talents">
            <Button
              variant="outline"
              size="md"
              className="rounded-full text-xs font-bold gap-2 hover:bg-dark-900 hover:text-white transition-all shadow-xs"
            >
              <span>Jelajah Seluruh Direktori Talenta Berprestasi</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. PERTANYAAN UMUM (FAQ) */}
      <section
        id="faq"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24"
      >
        <SectionHeader
          centered
          badgeText="Pusat Informasi & Bantuan"
          title="Pertanyaan yang Sering Diajukan"
          subtitle="Pelajari bagaimana sistem rekening bersama (Escrow) dan standar mutu Makarya melindungi Anda."
        />
      {/* 6. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm text-slate-500">
            Hal mendasar mengenai alur kerja, keamanan transaksi, dan kebijakan platform.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Bagaimana sistem Escrow Makarya melindungi dana UMKM?",
              a: "Saat Anda menyetujui proposal mahasiswa, dana proyek otomatis dikunci di rekening bersama resmi Makarya. Dana TIDAK akan ditransfer ke mahasiswa sampai Anda memeriksa hasil kerja deliverable dan menekan tombol 'Setujui & Selesaikan'.",
            },
            {
              q: "Bagaimana jika hasil kerja mahasiswa tidak sesuai dengan kesepakatan?",
              a: "Anda berhak meminta revisi resmi melalui sistem. Jika mahasiswa tetap gagal memenuhi kesepakatan brief, Anda dapat mengajukan mediasi sengketa ke Administrator Makarya untuk pengembalian dana (refund) secara proporsional.",
            },
            {
              q: "Apakah seluruh mahasiswa yang terdaftar terverifikasi resmi?",
              a: "Ya. Setiap mahasiswa wajib melalui proses validasi identitas kampus (KYC) menggunakan alamat email institusi berdomain .ac.id, Nomor Induk Mahasiswa (NIM) aktif, dan Program Studi terkait.",
            },
            {
              q: "Apakah ada potongan biaya komisi bagi mahasiswa?",
              a: "0% Potongan Komisi. Makarya berkomitmen penuh memberdayakan talenta muda, sehingga 100% honor yang disepakati akan diterima utuh oleh mahasiswa tanpa biaya perantara.",
            },
            {
              q: "Berapa batas pagu anggaran untuk proyek di Makarya?",
              a: "Maksimal Rp 2.000.000 per proyek. Batasan ini ditetapkan untuk memastikan proyek tetap dalam ruang lingkup micro-freelancing yang adil dan terjangkau bagi pelaku UMKM.",
            },
          ].map((faq, idx) => {
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-200"
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-canvas/50 transition-colors"
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <span className="text-sm font-bold text-dark-900 flex items-center gap-2.5">
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-indigo shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-brand-indigo" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-muted leading-relaxed border-t border-border/50 bg-canvas/30 animate-in fade-in">
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. PRE-FOOTER DUAL CTA CARDS */}
      {/* 7. PRE-FOOTER DUAL ACTION BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UMKM Card */}
          <div className="bg-brand-indigo text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6 shadow-brand">
            <div className="space-y-3 relative z-10">
          <div className="bg-brand-indigo text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-8 shadow-brand">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider">
                Untuk Pelaku Usaha UMKM
                <Building2 className="w-3.5 h-3.5" />
                Untuk Pemilik Usaha / UMKM
              </span>
              <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Tingkatkan Citra Usaha Anda Tanpa Biaya Mahal Agency.
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                Tingkatkan Citra Bisnis Anda Tanpa Beban Biaya Agency.
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
                Dapatkan logo, kemasan produk, website responsif, atau video
                promosi dari mahasiswa kreatif dengan harga terjangkau dan
                jaminan dana aman 100%.
                Dapatkan logo profesional, kemasan produk menawan, website responsif, atau konten video reels dari talenta muda kreatif dengan jaminan perlindungan dana 100%.
              </p>
            </div>
            <div className="relative z-10 pt-2">
              <Link to="/login" className="inline-block w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-dark-900 border-0 shadow-lg justify-center"
                  className="w-full sm:w-auto font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-900 border-0 shadow-lg justify-center rounded-xl"
                >
                  <span>Pasang Kebutuhan Proyek</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mahasiswa Card */}
          <div className="bg-dark-900 text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6 border border-slate-800 shadow-sm">
            <div className="space-y-3 relative z-10">
          <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-8 border border-slate-800 shadow-sm">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider border border-white/10">
                <GraduationCap className="w-3.5 h-3.5" />
                Untuk Mahasiswa Bertalenta
              </span>
              <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Ubah Keterampilan Kampus Menjadi Penghasilan & Portofolio.
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                Ubah Kemampuan Kampus Menjadi Penghasilan & Portofolio Nyata.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Bantu UMKM lokal bertumbuh, dapatkan bayaran utuh tanpa potongan
                komisi, dan otomatis miliki portofolio profesional untuk melamar
                kerja.
                Bantu UMKM lokal berkembang, dapatkan penghasilan utuh tanpa potongan komisi, dan otomatis miliki portofolio terverifikasi untuk melamar karir profesional.
              </p>
            </div>
            <div className="relative z-10 pt-2">
              <Link to="/register" className="inline-block w-full sm:w-auto">
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full sm:w-auto font-bold text-xs sm:text-sm shadow-brand justify-center"
                  className="w-full sm:w-auto font-bold text-xs sm:text-sm shadow-brand justify-center rounded-xl"
                >
                  <span>Daftar Akun Mahasiswa</span>
                  <span>Daftar Sebagai Freelancer</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
