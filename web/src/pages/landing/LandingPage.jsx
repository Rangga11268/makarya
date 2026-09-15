import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi, talentApi } from "../../api";
import { Button } from "../../components/ui/Button";
import { ProjectCard } from "../../components/features/ProjectCard";
import { TalentCard } from "../../components/features/TalentCard";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  ChevronRight,
  Plus,
  Minus,
  GraduationCap,
  Briefcase,
  Layers,
  FileCheck,
  Lock,
  Clock,
  Check,
  ChevronLeft,
  ExternalLink,
  Search,
  FileText,
  X,
  Sparkles,
  Activity,
  Star,
  ArrowUpRight,
} from "lucide-react";
import {
  CategoryDesignSvg,
  CategoryUiUxSvg,
  CategoryCodeSvg,
  CategoryVideoSvg,
  CategoryCopySvg,
  CategoryDataSvg,
} from "../../components/ui/CategorySvgIcons";

export function LandingPage() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Data fetching for explore section
  const [projects, setProjects] = useState([]);
  const [talents, setTalents] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTalents, setLoadingTalents] = useState(true);
  const [exploreTab, setExploreTab] = useState("projects"); // "projects" | "talents"

  // Interactive Hero Canvas State
  const [activeHeroNode, setActiveHeroNode] = useState("team"); // "brief" | "team" | "escrow" | "workroom"

  // Interactive How-It-Works State
  const [activeStep, setActiveStep] = useState(0);

  // Interactive Bento Widgets State
  const [selectedSlotRole, setSelectedSlotRole] = useState("frontend"); // "uiux" | "frontend" | "backend"
  const [calcBudget, setCalcBudget] = useState(2500000);
  const [simulatedDeliverableStatus, setSimulatedDeliverableStatus] =
    useState("review"); // "review" | "approved" | "revision"

  // Interactive Testimonials Carousel State
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // Interactive FAQ State
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // Floating Brief Toast State
  const [showFloatingToast, setShowFloatingToast] = useState(true);

  // Freelancer Services Category Filter
  const [selectedServiceCategory, setSelectedServiceCategory] = useState("ALL");

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingProjects(true);
        const resProj = await projectApi.browse({ status: "OPEN" });
        const pList = Array.isArray(resProj?.data?.data)
          ? resProj.data.data
          : Array.isArray(resProj?.data)
            ? resProj.data
            : Array.isArray(resProj)
              ? resProj
              : [];
        setProjects(pList.slice(0, 4));
      } catch (err) {
        console.error("Failed loading projects:", err);
      } finally {
        setLoadingProjects(false);
      }

      try {
        setLoadingTalents(true);
        const resTal = await talentApi.getTalents();
        const tList = Array.isArray(resTal?.data?.data)
          ? resTal.data.data
          : Array.isArray(resTal?.data)
            ? resTal.data
            : Array.isArray(resTal)
              ? resTal
              : [];
        setTalents(tList.slice(0, 4));
      } catch (err) {
        console.error("Failed loading talents:", err);
      } finally {
        setLoadingTalents(false);
      }
    }
    loadData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // 4 Steps data for "How It Works"
  const steps = [
    {
      id: "01",
      tag: "Langkah 1",
      title: "Pasang Kebutuhan & Tentukan Formasi Tim",
      desc: "Unggah brief proyek digital Anda, tentukan format pengerjaan Solo (1 Talenta) atau Tim Multidisiplin (UI/UX, Frontend, Backend) dengan pagu anggaran terstruktur.",
      badge: "Brief Proyek & Multi-Role",
    },
    {
      id: "02",
      tag: "Langkah 2",
      title: "Review Portofolio Mahasiswa Terverifikasi",
      desc: "Terima proposal lengkap dari talenta kampus dengan reputasi terakreditasi, riwayat proyek terverifikasi, serta repositori kode dan desain asli.",
      badge: "Verifikasi Mahasiswa .ac.id",
    },
    {
      id: "03",
      tag: "Langkah 3",
      title: "Amankan Honor di Escrow & Mulai Kolaborasi",
      desc: "Dana honor proyek diamankan 100% dalam sistem Rekening Bersama resmi Makarya sebelum pengerjaan dimulai demi rasa aman kedua belah pihak.",
      badge: "Proteksi Escrow 100%",
    },
    {
      id: "04",
      tag: "Langkah 4",
      title: "Persetujuan Hasil Kerja & Pencairan Otomatis",
      desc: "Tinjau deliverable milestone di Workroom interaktif. Berikan catatan revisi terarah atau setujui untuk mencairkan honor langsung ke talenta.",
      badge: "Serah Terima & Pencairan",
    },
  ];

  // Customer stories data
  const stories = [
    {
      quote:
        "“Makarya mempermudah kami mendapatkan website e-commerce dan desain kemasan produk kopi kelas profesional dengan anggaran UMKM yang efisien. Mahasiswa yang kami rekrut sangat responsif dan sistem escrow memberikan kepastian keamanan penuh.”",
      author: "Hendra Wijaya",
      role: "Pemilik Usaha, Kopi Kenangan Nusantara",
      metrics: [
        { label: "Peningkatan Penjualan", value: "3.5x" },
        { label: "Waktu Pengerjaan", value: "14 Hari" },
        { label: "Efisiensi Biaya", value: "65%" },
      ],
      tag: "F&B & Retail UMKM",
    },
    {
      quote:
        "“Sebagai mahasiswa tingkat akhir, Makarya memberikan saya portofolio industri nyata dan penghasilan legal yang terjamin. Kolaborasi dalam format tim multi-role terasa seperti bekerja di software house profesional.”",
      author: "Darell Radhitya",
      role: "Mahasiswa & Frontend Developer, Universitas Indonesia",
      metrics: [
        { label: "Proyek Selesai", value: "8 Proyek" },
        { label: "Rating Reputasi", value: "4.9/5.0" },
        { label: "Honor Diterima", value: "Rp 18Jt+" },
      ],
      tag: "Talenta Mahasiswa",
    },
    {
      quote:
        "“Proses rebranding identitas batik kami berjalan teratur. Fitur revisi bertahap di Workroom membuat komunikasi dengan talenta desainer sangat jelas dan minim miskomunikasi.”",
      author: "Siti Rahmawati",
      role: "Pendiri Usaha, Pesona Batik Pesisir",
      metrics: [
        { label: "Aset Digital Selesai", value: "24 Item" },
        { label: "Skor Kepuasan", value: "100%" },
        { label: "Siklus Revisi", value: "2 Tahap" },
      ],
      tag: "Fashion & Kriya UMKM",
    },
  ];

  // FAQ Items data
  const faqs = [
    {
      q: "Bagaimana cara kerja sistem Rekening Bersama (Escrow) di Makarya?",
      a: "Setelah UMKM menyetujui proposal mahasiswa, UMKM menyetorkan dana sesuai kesepakatan ke rekening escrow resmi Makarya. Dana ini ditahan secara aman dan baru akan dicairkan ke rekening bank mahasiswa setelah UMKM meninjau serta menyetujui hasil deliverable pekerjaan.",
    },
    {
      q: "Apakah UMKM dikenakan biaya potongan transaksi tambahan?",
      a: "Tidak. UMKM membayar 100% sesuai nominal kesepakatan pagu proyek tanpa potongan tambahan untuk pihak UMKM. Platform Makarya menerapkan biaya pemeliharaan sistem hanya 5% yang dipotong secara transparan dari honor talenta saat pencairan berhasil.",
    },
    {
      q: "Bagaimana jika proyek membutuhkan tim dengan banyak keahlian (Multi-Role)?",
      a: "Makarya memiliki fitur Proyek Tim di mana satu proyek UMKM dapat membuka beberapa slot peran sekaligus (misal: UI/UX Designer, Frontend Developer, Backend Developer). Setiap mahasiswa mengajukan lamaran ke slot spesifik dan mendapatkan kontrak serta honor terpisah.",
    },
    {
      q: "Siapa saja mahasiswa yang dapat mendaftar sebagai talenta?",
      a: "Seluruh mahasiswa aktif dari perguruan tinggi terakreditasi di Indonesia dengan email institusi (.ac.id) atau kartu identitas mahasiswa yang sah. Setiap akun melalui proses kurasi profil akademik dan portofolio.",
    },
    {
      q: "Apa yang terjadi jika hasil pekerjaan tidak sesuai atau ada kendala?",
      a: "UMKM berhak mengajukan revisi berbobot langsung melalui Workroom. Jika terjadi kebuntuan yang tidak dapat diselesaikan secara bilateral, kedua belah pihak dapat mengajukan eskalasi sengketa (dispute) ke Admin Makarya untuk mediasi dan klaim escrow yang adil.",
    },
  ];

  // Comprehensive Freelancer Services & Categories Data
  const freelancerServices = [
    {
      code: "PEMROGRAMAN",
      title: "Website & Pemrograman",
      badge: "Paling Diminati",
      tagline: "Landing page modern, e-commerce, & aplikasi web responsif",
      svgIcon: CategoryCodeSvg,
      startPrice: "Rp 450.000",
      estimatedDays: "3 - 7 Hari",
      rating: "4.95",
      completedCount: "410+ Proyek",
      deliverables: [
        "Landing Page Bisnis Modern & Super Cepat",
        "Toko Online / E-Commerce Payment Gateway",
        "Dashboard Admin & Sistem Kasir (POS)",
        "Integrasi REST API Laravel / React / Vue",
      ],
      popularSkills: ["React", "Vue", "Laravel", "Tailwind CSS", "Next.js"],
      categoryParam: "PEMROGRAMAN",
    },
    {
      code: "DESAIN",
      title: "Desain Grafis & Brand Identity",
      badge: "Terpopuler",
      tagline: "Logo visual berkarakter, kemasan produk, & materi promosi",
      svgIcon: CategoryDesignSvg,
      startPrice: "Rp 150.000",
      estimatedDays: "2 - 4 Hari",
      rating: "4.90",
      completedCount: "320+ Proyek",
      deliverables: [
        "Master Logo Vector (.SVG, .AI, .PNG Transparan)",
        "Buku Panduan Warna & Tipografi Brand",
        "Banner Iklan & Feed Medsos Penjualan",
        "Desain Label & Kemasan Produk (Packaging)",
      ],
      popularSkills: ["Adobe Illustrator", "Photoshop", "Brand Book", "Canva Pro"],
      categoryParam: "DESAIN",
    },
    {
      code: "UIUX",
      title: "UI/UX & Desain Prototipe Figma",
      badge: "Kualitas Industri",
      tagline: "Wireframing interaktif & antarmuka aplikasi siap koding",
      svgIcon: CategoryUiUxSvg,
      startPrice: "Rp 350.000",
      estimatedDays: "3 - 5 Hari",
      rating: "4.92",
      completedCount: "215+ Proyek",
      deliverables: [
        "Design System & Komponen Auto-Layout",
        "Prototipe Interaktif Siap Demo Investor",
        "Riset User Journey & Alur Navigasi Aplikasi",
        "Export Aset Visual Siap Handoff Developer",
      ],
      popularSkills: ["Figma", "Auto-Layout", "Mobile UI", "Web UX Flow"],
      categoryParam: "UIUX",
    },
    {
      code: "VIDEO",
      title: "Video Editing & Motion Graphics",
      badge: "Viral & Engagement",
      tagline: "Video reels promosi, animasi logo, & short-form video ads",
      svgIcon: CategoryVideoSvg,
      startPrice: "Rp 200.000",
      estimatedDays: "1 - 3 Hari",
      rating: "4.88",
      completedCount: "180+ Proyek",
      deliverables: [
        "Reels Instagram & TikTok Ads Berkonversi",
        "Video Company Profile & Showreel Produk UMKM",
        "Animasi Logo Intro / Outro Motion Graphics",
        "Color Grading Sinematik, Sound FX & Subtitle",
      ],
      popularSkills: ["Premiere Pro", "After Effects", "CapCut Pro", "Motion Design"],
      categoryParam: "VIDEO",
    },
    {
      code: "COPYWRITING",
      title: "Copywriting & Artikel SEO",
      badge: "Konversi Tinggi",
      tagline: "Naskah jualan persuasif & artikel ramah mesin pencari",
      svgIcon: CategoryCopySvg,
      startPrice: "Rp 100.000",
      estimatedDays: "1 - 2 Hari",
      rating: "4.91",
      completedCount: "260+ Proyek",
      deliverables: [
        "Sales Letter & Headline Landing Page Penjualan",
        "Artikel Blog Teroptimasi Riset Kata Kunci SEO",
        "Naskah Script Video Iklan & Voiceover UMKM",
        "Company Profile & Copy Katalog Brosur Usaha",
      ],
      popularSkills: ["SEO Content", "Direct Response", "Social Copy", "Storytelling"],
      categoryParam: "COPYWRITING",
    },
    {
      code: "ADMIN_DATA",
      title: "Administrasi Bisnis & Olah Data",
      badge: "Akurat & Cepat",
      tagline: "Rekap keuangan rapi, spreadsheet otomatis, & data entry",
      svgIcon: CategoryDataSvg,
      startPrice: "Rp 150.000",
      estimatedDays: "2 - 3 Hari",
      rating: "4.90",
      completedCount: "140+ Proyek",
      deliverables: [
        "Rekapitulasi Laporan Keuangan & Laba Rugi",
        "Dashboard Visualisasi Data Excel / Google Sheets",
        "Entri Data Katalog Produk Masal Marketplace",
        "Riset Analisa Kompetitor & Database Pelanggan",
      ],
      popularSkills: ["Excel Expert", "Google Sheets", "Data Entry", "Automasi Rumus"],
      categoryParam: "ADMIN_DATA",
    },
  ];

  // Campus partners list
  const campuses = [
    "Universitas Indonesia",
    "Institut Teknologi Bandung",
    "Universitas Gadjah Mada",
    "Institut Teknologi Sepuluh Nopember",
    "Telkom University",
    "BINUS University",
    "Universitas Brawijaya",
    "Universitas Airlangga",
    "Universitas Diponegoro",
    "Universitas Sebelas Maret",
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-cyan-500/20 selection:text-cyan-900 overflow-x-hidden relative">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & FULL-FIDELITY INTERACTIVE SAAS WORKROOM CANVAS          */}
      {/* ========================================================================= */}
      <section className="relative pt-0 pb-20 lg:pb-28">
        {/* Full-Width Soft Cyan Announcement Strip (Axora Top Bar Style) */}
        <div className="w-full bg-[#E0F7FA] border-b border-cyan-200/70 py-2.5 px-4 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-cyan-950 hover:text-cyan-800 transition-colors group"
          >
            <span className="font-bold">Kolaborasi Multi-Role Terkurasi:</span>
            <span>
              Wujudkan proyek digital UMKM bersama talenta kampus terbaik.
            </span>
            <span className="font-bold inline-flex items-center ml-1 text-cyan-800 group-hover:translate-x-0.5 transition-transform">
              Jelajahi Proyek <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </Link>
        </div>

        {/* Ambient Top Background Radial Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-cyan-200/40 via-blue-100/30 to-transparent blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        {/* Hero Headline & CTA Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-cyan-200 text-cyan-900 text-xs font-semibold mb-6 shadow-sm hover:border-cyan-300 transition-colors cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
            <span>Platform Kolaborasi Digital Mahasiswa & UMKM</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] max-w-4xl mx-auto">
            Ubah ide digital menjadi{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              proyek terkurasi.
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Makarya menghubungkan pelaku usaha UMKM dengan mahasiswa bertalenta
            melalui sistem Rekening Bersama (Escrow) 100% aman dan formasi tim
            terkoordinasi.
          </p>

          {/* Clean Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    user?.role === "UMKM" ? "/create-project" : "/projects",
                  )
                }
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>
                  {user?.role === "UMKM"
                    ? "Buat Proyek Baru"
                    : "Cari Proyek Kolaborasi"}
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/register?role=UMKM")}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Mulai Pasang Proyek</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register?role=MAHASISWA")}
                  className="px-6 py-3 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                  Daftar Sebagai Mahasiswa
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE WORKFLOW CANVAS FLANKED BY VISIBLE SPECTRUM GRADIENT PILLARS  */}
        {/* ========================================================================= */}
        <div className="relative mt-14 max-w-6xl mx-auto px-4 sm:px-6">
          {/* Left Flank Vertical Spectrum Pillars (Axora Signature Backdrop) */}
          <div className="hidden sm:flex absolute -left-6 md:-left-12 bottom-6 top-12 w-12 md:w-20 items-end gap-1.5 opacity-90 pointer-events-none z-0 animate-float-slow">
            <div className="w-1/4 h-2/5 bg-gradient-to-t from-cyan-600 via-teal-500 to-transparent rounded-t-lg transition-all duration-700" />
            <div className="w-1/4 h-3/5 bg-gradient-to-t from-cyan-500 via-emerald-400 to-transparent rounded-t-lg transition-all duration-700" />
            <div className="w-1/4 h-5/6 bg-gradient-to-t from-cyan-400 via-amber-300 to-transparent rounded-t-lg transition-all duration-700" />
            <div className="w-1/4 h-full bg-gradient-to-t from-blue-600 via-cyan-400 to-transparent rounded-t-lg transition-all duration-700" />
          </div>

          {/* Right Flank Vertical Spectrum Pillars (Axora Signature Backdrop) */}
          <div className="hidden sm:flex absolute -right-6 md:-right-12 bottom-6 top-12 w-12 md:w-20 items-end justify-end gap-1.5 opacity-90 pointer-events-none z-0 animate-float-slow">
            <div className="w-1/4 h-full bg-gradient-to-t from-blue-600 via-cyan-400 to-transparent rounded-t-lg transition-all duration-700" />
            <div className="w-1/4 h-5/6 bg-gradient-to-t from-cyan-400 via-amber-300 to-transparent rounded-t-lg transition-all duration-700" />
            <div className="w-1/4 h-3/5 bg-gradient-to-t from-cyan-500 via-emerald-400 to-transparent rounded-t-lg transition-all duration-700" />
            <div className="w-1/4 h-2/5 bg-gradient-to-t from-cyan-600 via-teal-500 to-transparent rounded-t-lg transition-all duration-700" />
          </div>

          {/* Main Full-Fidelity SaaS Workroom Application Mockup Card */}
          <div className="relative z-10 bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden transition-all duration-300">
            {/* Top SaaS Header Bar inside App */}
            <div className="px-4 py-2.5 bg-slate-50/95 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                {/* Traffic lights */}
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                </div>

                {/* Logo & Search Bar */}
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <div className="w-5 h-5 rounded bg-cyan-600 text-white flex items-center justify-center text-[10px] font-extrabold">
                    M
                  </div>
                  <span>Makarya Workroom</span>
                </div>

                <div className="hidden md:flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-400 text-[11px]">
                  <Search className="w-3 h-3" />
                  <span>Cari modul alur kerja...</span>
                  <span className="font-mono text-[9px] bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                    ⌘K
                  </span>
                </div>
              </div>

              {/* Breadcrumb & Collaborator Avatars */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
                  Proyek / Kopi Kenangan Nusantara
                </span>
                <div className="flex -space-x-1.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    DR
                  </span>
                  <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    AP
                  </span>
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    HW
                  </span>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-[11px] font-bold transition-colors"
                >
                  Bagikan
                </button>
              </div>
            </div>

            {/* 3-Column SaaS Application Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
              {/* Column 1: Left Workspace Sidebar */}
              <div className="hidden md:block md:col-span-3 lg:col-span-2 border-r border-slate-200/80 bg-slate-50/50 p-3 text-xs space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    WORKSPACE
                  </div>
                  <div className="space-y-1 font-medium">
                    <button
                      type="button"
                      onClick={() => setActiveHeroNode("brief")}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                        activeHeroNode === "brief"
                          ? "bg-cyan-50 text-cyan-950 font-bold border-l-2 border-cyan-600 translate-x-0.5"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5 text-cyan-600" />
                      <span>1. Brief Proyek</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroNode("team")}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                        activeHeroNode === "team"
                          ? "bg-cyan-50 text-cyan-950 font-bold border-l-2 border-cyan-600 translate-x-0.5"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>2. Formasi Tim</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroNode("escrow")}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                        activeHeroNode === "escrow"
                          ? "bg-cyan-50 text-cyan-950 font-bold border-l-2 border-cyan-600 translate-x-0.5"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>3. Escrow Vault</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHeroNode("workroom")}
                      className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                        activeHeroNode === "workroom"
                          ? "bg-cyan-50 text-cyan-950 font-bold border-l-2 border-cyan-600 translate-x-0.5"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>4. Deliverables</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    PROYEK AKTIF
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] shadow-2xs">
                    <div className="font-bold text-slate-800">
                      Kopi Kenangan
                    </div>
                    <div className="text-slate-500 font-mono text-[10px] mt-0.5">
                      Rp 2.500.000
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Center Visual Workflow Canvas Nodes */}
              <div className="col-span-1 md:col-span-6 lg:col-span-6 p-4 sm:p-6 bg-slate-50/50 flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    STATUS ALUR KERJA
                  </span>
                  <span className="text-[10px] font-bold bg-cyan-100 text-cyan-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-cyan-700" /> 3 dari 4 Tahap
                    Tuntas
                  </span>
                </div>

                {/* Visual Node 1: Brief Masuk */}
                <div
                  onClick={() => setActiveHeroNode("brief")}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    activeHeroNode === "brief"
                      ? "bg-white border-cyan-500 shadow-md ring-1 ring-cyan-200 scale-[1.01]"
                      : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Kebutuhan Proyek Diterima
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Pagu Anggaran Rp 2.500.000 | Klien: Hendra Wijaya
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    Terverifikasi
                  </span>
                </div>

                {/* Connecting Track */}
                <div className="h-3 border-l-2 border-dashed border-slate-300 ml-6" />

                {/* Visual Node 2: Formasi Tim */}
                <div
                  onClick={() => setActiveHeroNode("team")}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    activeHeroNode === "team"
                      ? "bg-white border-cyan-500 shadow-md ring-1 ring-cyan-200 scale-[1.01]"
                      : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Formasi Tim Multi-Role Terbentuk
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Frontend (Darell - UI) & UI/UX (Amanda - ITB)
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                    Tim Terisi
                  </span>
                </div>

                {/* Connecting Track */}
                <div className="h-3 border-l-2 border-dashed border-slate-300 ml-6" />

                {/* Visual Node 3: Escrow Vault */}
                <div
                  onClick={() => setActiveHeroNode("escrow")}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    activeHeroNode === "escrow"
                      ? "bg-white border-cyan-500 shadow-md ring-1 ring-cyan-200 scale-[1.01]"
                      : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Dana Diamankan di Escrow
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Garansi 100% Saldo Terkunci di Rekening Penampungan
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" /> Diamankan
                  </span>
                </div>

                {/* Connecting Track */}
                <div className="h-3 border-l-2 border-dashed border-slate-300 ml-6" />

                {/* Visual Node 4: Milestone Deliverable */}
                <div
                  onClick={() => setActiveHeroNode("workroom")}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    activeHeroNode === "workroom"
                      ? "bg-white border-cyan-500 shadow-md ring-1 ring-cyan-200 scale-[1.01]"
                      : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Serah Terima & Pencairan Honor
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Persetujuan 1-klik untuk pencairan dana otomatis
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded">
                    Siap Review
                  </span>
                </div>
              </div>

              {/* Column 3: Right Inspector Panel with smooth animated transition */}
              <div className="col-span-1 md:col-span-3 lg:col-span-4 border-t md:border-t-0 md:border-l border-slate-200/80 p-4 sm:p-5 bg-white flex flex-col justify-between text-xs">
                <div key={activeHeroNode} className="animate-fade-in-fast">
                  {activeHeroNode === "brief" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">
                          Detail Kebutuhan Proyek
                        </span>
                        <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                          Aktif
                        </span>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          NAMA PROYEK
                        </div>
                        <div className="font-semibold text-slate-800 mt-0.5">
                          Website & Branding Kopi Kenangan Nusantara
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          DESKRIPSI BRIEF
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                          Pengembangan landing page responsif terintegrasi
                          katalog produk kopi dan desain kemasan label botol
                          modern.
                        </p>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 text-[11px] border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Klien UMKM:</span>
                          <span className="font-semibold text-slate-900">
                            Hendra Wijaya
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pagu Maksimal:</span>
                          <span className="font-mono font-bold text-slate-900">
                            Rp 2.500.000
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHeroNode === "team" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">
                          Formasi Slot Tim (2/2 Terisi)
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          Komplit
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">
                              Darell Radhitya
                            </span>
                            <span className="font-mono text-[11px] font-bold text-blue-700">
                              Rp 1.500.000
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Frontend Dev | UI (Semester 6)
                          </div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">
                              Amanda Putri
                            </span>
                            <span className="font-mono text-[11px] font-bold text-indigo-700">
                              Rp 1.000.000
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            UI/UX Designer | ITB (Semester 4)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHeroNode === "escrow" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">
                          Status Escrow Invariant
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          100% Aman
                        </span>
                      </div>
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-600">Total Pagu:</span>
                          <span className="font-mono font-bold text-slate-900">
                            Rp 2.500.000
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-600">
                            Biaya Klien UMKM:
                          </span>
                          <span className="font-mono font-bold text-emerald-700">
                            Rp 0 (0%)
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">
                        Dana tersimpan aman dan hanya dicairkan setelah UMKM
                        menyetujui hasil deliverable.
                      </p>
                    </div>
                  )}

                  {activeHeroNode === "workroom" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900">
                          Deliverable Siap Review
                        </span>
                        <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                          Milestone 1
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                          <span className="font-medium text-slate-700">
                            github.com/darell/kopi-kenangan
                          </span>
                          <ExternalLink className="w-3 h-3 text-cyan-600" />
                        </div>
                        <div className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                          <span className="font-medium text-slate-700">
                            figma.com/@amanda/kopi-ui
                          </span>
                          <ExternalLink className="w-3 h-3 text-cyan-600" />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow transition-colors"
                      >
                        Setujui & Cairkan Honor
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CAMPUS PARTNER INFINITE MARQUEE TICKER                                 */}
      {/* ========================================================================= */}
      <section className="py-8 bg-white border-y border-slate-200/80 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
          <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Didukung Oleh Mahasiswa Berbakat Dari Berbagai Perguruan Tinggi
          </p>
        </div>

        {/* Gradient edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Infinite scrolling ticker track */}
        <div className="flex animate-marquee gap-8 sm:gap-12 items-center text-slate-600 text-xs sm:text-sm font-semibold">
          {[...campuses, ...campuses].map((c, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 hover:text-slate-900 transition-colors shrink-0 px-2 cursor-default"
            >
              <GraduationCap className="w-4 h-4 text-cyan-600" />
              <span>{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROOF & ARCHITECTURE METRICS HUB                                       */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 uppercase tracking-wider">
              EKOSISTEM DIGITAL MAKARYA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Platform Kolaborasi dengan Hasil Terukur
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Infrastruktur terintegrasi yang menyatukan kepastian pembayaran,
              manajemen proyek kolaboratif, dan verifikasi kampus.
            </p>
          </div>

          {/* Core Engine Visual Card */}
          <div className="relative max-w-3xl mx-auto mb-14 p-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="relative flex flex-col items-center justify-center text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-600/20 mb-4 animate-float-slow">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Makarya Collaboration Engine
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Sistem kontrak otomatis, pengamanan escrow, dan alur kerja tim
                multidisiplin.
              </p>

              {/* Orbiting Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 w-full">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center hover:border-slate-300 transition-colors">
                  <Lock className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">
                    Escrow 100%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Rekening Terpisah
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center hover:border-slate-300 transition-colors">
                  <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">
                    Multi-Role Slot
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Tim Terstruktur
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center hover:border-slate-300 transition-colors">
                  <GraduationCap className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">
                    Domain .ac.id
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Verifikasi Kampus
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center hover:border-slate-300 transition-colors">
                  <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">
                    Workroom Live
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Milestone Terukur
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Stat Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200/80 text-center shadow-2xs hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                Rp 450Jt+
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Total Honor Diamankan
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200/80 text-center shadow-2xs hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">
                100%
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Garansi Keamanan Escrow
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200/80 text-center shadow-2xs hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-600 font-mono">
                99.2%
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Penyelesaian Tepat Waktu
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200/80 text-center shadow-2xs hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono">
                1.800+
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Mahasiswa Terverifikasi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE "HOW IT WORKS" 4-STEP SHOWCASE (Clean Light Aesthetic)    */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 uppercase tracking-wider">
                CARA KERJA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Dari Ide Hingga Hasil Kerja Tuntas
              </h2>
            </div>
            <p className="mt-3 md:mt-0 text-sm text-slate-500 max-w-md">
              Empat langkah transparan untuk merealisasikan proyek digital Anda
              bersama talenta mahasiswa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Vertical Step Navigation List */}
            <div className="lg:col-span-5 space-y-3">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-800 scale-[1.01]"
                        : "bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                          isActive
                            ? "bg-cyan-500 text-slate-950"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {step.tag}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold ${
                          isActive ? "text-cyan-300" : "text-slate-400"
                        }`}
                      >
                        {step.badge}
                      </span>
                    </div>
                    <h3
                      className={`text-base font-bold ${
                        isActive ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-xs mt-2 leading-relaxed ${
                        isActive ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Clean Light Interactive Preview Pane with smooth transition */}
            <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[420px] flex flex-col justify-between">
              <div key={activeStep} className="animate-fade-in-fast">
                {activeStep === 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Langkah 1: Pengaturan Formasi Proyek
                      </span>
                      <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-1 rounded">
                        Format Fleksibel
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Pilih Format Kolaborasi yang Sesuai Kebutuhan
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
                        <div className="text-sm font-bold text-slate-900 mb-1">
                          Proyek Solo (1 Talenta)
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Cocok untuk kebutuhan spesifik seperti desain logo,
                          foto produk, atau perbaikan satu fitur.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 shadow-2xs">
                        <div className="text-sm font-bold text-cyan-950 mb-1 flex items-center justify-between">
                          <span>Proyek Tim (Multi-Role)</span>
                          <span className="text-[10px] bg-cyan-600 text-white font-bold px-1.5 py-0.2 rounded">
                            Populer
                          </span>
                        </div>
                        <p className="text-xs text-cyan-900 leading-relaxed">
                          Cocok untuk pembuatan aplikasi, website utuh, dan
                          rebranding lengkap dengan tim lintas disiplin.
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                      <span className="text-slate-900 font-bold">Catatan:</span>{" "}
                      Setiap peran dalam formasi tim memiliki pagu anggaran dan
                      kontrak tersendiri (misal: UI/UX Rp 1Jt, Frontend Rp
                      1.5Jt).
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Langkah 2: Review Pelamar & Portofolio
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">
                        Terverifikasi Kampus
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Evaluasi Profil Akademik & Bukti Karya Asli
                    </h4>
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold">
                          DR
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            Darell Radhitya
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <div className="text-xs text-slate-500">
                            Universitas Indonesia | Sistem Informasi (Semester
                            6)
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          React.js
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          Tailwind CSS
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                          Figma
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                          Rating: 4.9 (8 Selesai)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Langkah 3: Pengamanan Dana Escrow
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />{" "}
                        100% Terlindungi
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Dana Disimpan Aman Sebelum Pengerjaan Dimulai
                    </h4>
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">
                          Total Nominal Proyek:
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          Rp 2.500.000
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-600">
                          Status Rekening Bersama:
                        </span>
                        <span className="font-bold text-emerald-700">
                          DIAMANKAN (Vault Mandiri)
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Mahasiswa dapat bekerja dengan tenang mengetahui dana
                      telah siap, sementara UMKM memiliki kendali penuh sebelum
                      menyetujui hasil akhir.
                    </p>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Langkah 4: Serah Terima & Pencairan
                      </span>
                      <span className="text-xs font-bold text-cyan-800 bg-cyan-100 px-2.5 py-1 rounded">
                        Pencairan Otomatis
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Persetujuan 1-Klik & Transparansi Hasil
                    </h4>
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">
                          Deliverable Akhir:
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          Siap Ditinjau
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex-1 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        >
                          Setujui & Cairkan Honor
                        </button>
                        <button
                          type="button"
                          className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
                        >
                          Minta Revisi
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Navigation Dots Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeStep === idx
                          ? "w-8 bg-cyan-600"
                          : "w-2 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={activeStep === 0}
                    onClick={() =>
                      setActiveStep((prev) => Math.max(0, prev - 1))
                    }
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 shadow-2xs transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={activeStep === steps.length - 1}
                    onClick={() =>
                      setActiveStep((prev) =>
                        Math.min(steps.length - 1, prev + 1),
                      )
                    }
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 shadow-2xs transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CLEAN BRAND CORE FEATURES BENTO (Light Makarya Aesthetic)               */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#F8FAFC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 uppercase tracking-wider">
              FITUR UNGGULAN
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
              Dirancang untuk Kolaborasi Tanpa Hambatan
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Setiap komponen dibuat interaktif untuk memberikan transparansi,
              akurasi peran, dan keamanan finansial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bento Card 1: Interactive Multi-Role Slot Selector */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Multi-Role Architecture
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Formasi Tim Fleksibel Sesuai Kebutuhan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Buka slot pengerjaan secara spesifik untuk spesialisasi UI/UX,
                  Frontend, atau Backend dengan alokasi anggaran mandiri.
                </p>

                {/* Interactive Slot Toggle */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex gap-2">
                    {[
                      { id: "uiux", label: "UI/UX Designer" },
                      { id: "frontend", label: "Frontend Dev" },
                      { id: "backend", label: "Backend Dev" },
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedSlotRole(role.id)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                          selectedSlotRole === role.id
                            ? "bg-slate-900 text-white shadow-sm"
                            : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>

                  <div
                    className="p-3 rounded-lg bg-white border border-slate-200 text-xs animate-fade-in-fast"
                    key={selectedSlotRole}
                  >
                    {selectedSlotRole === "uiux" && (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">
                            Alokasi UI/UX
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Figma Wireframe & Prototipe Interaktif
                          </div>
                        </div>
                        <span className="font-mono font-bold text-cyan-700">
                          Rp 1.000.000
                        </span>
                      </div>
                    )}
                    {selectedSlotRole === "frontend" && (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">
                            Alokasi Frontend
                          </div>
                          <div className="text-[11px] text-slate-500">
                            React Slicing & Integrasi Responsif
                          </div>
                        </div>
                        <span className="font-mono font-bold text-cyan-700">
                          Rp 1.500.000
                        </span>
                      </div>
                    )}
                    {selectedSlotRole === "backend" && (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-900">
                            Alokasi Backend
                          </div>
                          <div className="text-[11px] text-slate-500">
                            REST API & Integrasi Basis Data
                          </div>
                        </div>
                        <span className="font-mono font-bold text-cyan-700">
                          Rp 1.200.000
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Interactive Escrow Breakdown Slider */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Transparansi 100%
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Kalkulator Escrow Transparan
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Geser slider anggaran proyek untuk melihat kalkulasi pembagian
                  dana secara transparan tanpa biaya tersembunyi.
                </p>

                {/* Interactive Slider & Breakdown */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">
                      Anggaran Proyek:
                    </span>
                    <span className="text-sm font-bold text-emerald-700 font-mono">
                      {formatCurrency(calcBudget)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="10000000"
                    step="500000"
                    value={calcBudget}
                    onChange={(e) => setCalcBudget(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">
                        Biaya Klien UMKM:
                      </span>
                      <span className="font-bold text-emerald-700">
                        Rp 0 (0%)
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">
                        Honor Bersih Talenta:
                      </span>
                      <span className="font-bold text-slate-900 font-mono">
                        {formatCurrency(calcBudget * 0.95)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Interactive Workroom Deliverable Simulator */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              {/* Subtle Corner Spectrum Accent */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-tl from-cyan-400/20 via-blue-400/10 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    Visual Pipeline Builder
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Workroom Milestone & Siklus Deliverable
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Kelola serah terima bertahap dengan pelacakan revisi
                  transparan dan proteksi auto-approval.
                </p>

                {/* Simulated Interactive Pipeline Tree */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-800">
                        Pipeline Pengerjaan Aktif
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      Milestone 1 / 2 Selesai
                    </span>
                  </div>

                  {/* Visual Node Links */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                      <div className="flex-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex justify-between items-center">
                        <span className="text-slate-800 font-medium">
                          1. Figma UI Prototype
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold">
                          Disetujui
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-[10px] border border-cyan-200">
                        <Clock className="w-3.5 h-3.5 text-cyan-700" />
                      </div>
                      <div className="flex-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex justify-between items-center">
                        <span className="text-slate-800 font-medium">
                          2. React Slicing & Integrasi API
                        </span>
                        <span className="text-[10px] text-cyan-700 font-bold">
                          {simulatedDeliverableStatus === "approved"
                            ? "Selesai & Dicairkan"
                            : simulatedDeliverableStatus === "revision"
                              ? "Revisi Diminta"
                              : "Siap Review"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Action Triggers */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSimulatedDeliverableStatus("approved")}
                      className="flex-1 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-2xs active:scale-[0.98]"
                    >
                      Setujui & Cairkan Honor
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedDeliverableStatus("revision")}
                      className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 rounded-lg transition-colors border border-slate-200 active:scale-[0.98]"
                    >
                      Minta Revisi
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Verified Identity & Multi-Agent Network */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              {/* Corner Spectrum Accent */}
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-gradient-to-tl from-amber-400/20 via-cyan-400/10 to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Jaringan Kampus Resmi
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Identitas Akademik & Portofolio Nyata
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Setiap talenta diverifikasi melalui NIM aktif dan email
                  perguruan tinggi, terhubung langsung dengan repositori kode
                  dan karya desain asli.
                </p>

                {/* Verified Talent Identity Card Preview */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        AR
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                          Arya Nugraha
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          NIM 13521088 | IF ITB
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Terakreditasi
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-white border border-slate-200 flex items-center gap-1.5 text-slate-700">
                      <ExternalLink className="w-3 h-3 text-cyan-600" />
                      <span className="truncate">github.com/aryanugraha</span>
                    </div>
                    <div className="p-2 rounded bg-white border border-slate-200 flex items-center gap-1.5 text-slate-700">
                      <ExternalLink className="w-3 h-3 text-amber-600" />
                      <span className="truncate">figma.com/@aryanugraha</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMPREHENSIVE FREELANCER SERVICES & CATEGORY EXPLORER                  */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#F8FAFC] border-t border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200 uppercase tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                KATALOG JASA & KEAHLIAN MAHASISWA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 leading-tight">
                Temukan Jasa Digital Berkualitas untuk Kebutuhan Bisnis Anda
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                Dikerjakan langsung oleh mahasiswa bertalenta dengan standar industri, estimasi waktu transparan, dan garansi keamanan rekening bersama (Escrow).
              </p>
            </div>

            {/* Category Quick Filter Pills (Apple Style) */}
            <div className="flex flex-wrap gap-1.5 bg-slate-200/70 p-1.5 rounded-full border border-slate-300/80 self-start md:self-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedServiceCategory("ALL")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer select-none ${
                  selectedServiceCategory === "ALL"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
                }`}
              >
                Semua Jasa
              </button>
              {freelancerServices.map((svc) => (
                <button
                  key={svc.code}
                  type="button"
                  onClick={() => setSelectedServiceCategory(svc.code)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer select-none ${
                    selectedServiceCategory === svc.code
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
                  }`}
                >
                  {svc.title.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 6 Services Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancerServices
              .filter(
                (s) =>
                  selectedServiceCategory === "ALL" ||
                  selectedServiceCategory === s.code,
              )
              .map((service) => {
                const SvgIcon = service.svgIcon;
                return (
                  <div
                    key={service.code}
                    className="group bg-white rounded-3xl border border-slate-200/90 hover:border-cyan-300 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative"
                  >
                    <div>
                      {/* Top Header Card: SVG Icon & Badge */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                          <SvgIcon size={46} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-full shadow-2xs">
                          {service.badge}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {service.tagline}
                      </p>

                      {/* Pricing & Duration Bar */}
                      <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Mulai dari:</span>
                          <span className="font-extrabold text-slate-900 text-sm font-mono">
                            {service.startPrice}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-medium">Estimasi:</span>
                          <span className="font-bold text-slate-700 font-mono">
                            {service.estimatedDays}
                          </span>
                        </div>
                      </div>

                      {/* Deliverables Checklist */}
                      <div className="mt-5 space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Output Deliverable:
                        </span>
                        {service.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Popular Skills Pills */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {service.popularSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Apple Style CTA Button */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-900">{service.rating}</span>
                        <span className="text-slate-400">({service.completedCount})</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/projects?category=${service.categoryParam}`)}
                        className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm hover:shadow flex items-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <span>Cari Jasa Ini</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Bottom Banner Notice */}
          <div className="mt-12 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-600/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Butuh Kombinasi Beberapa Jasa Sekaligus?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gunakan fitur <b>Proyek Tim</b> untuk merekrut desainer, programmer, dan copywriter dalam satu alur terkoordinasi.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register?role=UMKM")}
              className="shrink-0 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Pasang Kebutuhan Proyek</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. LIVE EXPLORER (Projects & Talents Real Data Showcase)                   */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 uppercase tracking-wider">
                DIREKTORI TERBUKA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                Peluang Kolaborasi Nyata Saat Ini
              </h2>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setExploreTab("projects")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  exploreTab === "projects"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Proyek UMKM Terbaru
              </button>
              <button
                type="button"
                onClick={() => setExploreTab("talents")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  exploreTab === "talents"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Talenta Mahasiswa Unggulan
              </button>
            </div>
          </div>

          {/* Tab 1: Live Projects List */}
          {exploreTab === "projects" && (
            <div className="animate-fade-in-fast">
              {loadingProjects ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="h-48 bg-slate-100 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((proj) => (
                    <ProjectCard key={proj.id} project={proj} />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                  Belum ada proyek terbuka saat ini.
                </div>
              )}

              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/projects")}
                  className="font-bold px-8 rounded-xl bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:-translate-y-0.5 transition-all"
                >
                  Jelajahi Semua Proyek <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Tab 2: Live Talents List */}
          {exploreTab === "talents" && (
            <div className="animate-fade-in-fast">
              {loadingTalents ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="h-48 bg-slate-100 animate-pulse rounded-2xl"
                    />
                  ))}
                </div>
              ) : talents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {talents.map((tal) => (
                    <TalentCard key={tal.id} talent={tal} />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-sm">
                  Belum ada profil talenta yang tersedia.
                </div>
              )}

              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/talents")}
                  className="font-bold px-8 rounded-xl bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:-translate-y-0.5 transition-all"
                >
                  Lihat Semua Talenta Mahasiswa{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TESTIMONIALS & CASE STUDIES (Axora Signature Spectrum Card Style)      */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-200/80 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 uppercase tracking-wider">
              KISAH SUKSES KOLABORASI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Dampak Nyata bagi Bisnis & Karier
            </h2>
          </div>

          {/* Testimonial Card with Axora Left-Border Spectrum Ribbon */}
          <div className="relative flex rounded-3xl border border-slate-200/90 shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Left Spectrum Vertical Accent Ribbon */}
            <div className="w-3 sm:w-4 bg-gradient-to-b from-cyan-400 via-emerald-400 to-blue-600 shrink-0 self-stretch" />

            <div className="flex-1 p-6 sm:p-10 bg-gradient-to-b from-slate-50/50 to-white">
              <div
                className="space-y-6 animate-fade-in-fast"
                key={activeStoryIdx}
              >
                <span className="inline-block text-[11px] font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
                  {stories[activeStoryIdx].tag}
                </span>

                <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed italic">
                  {stories[activeStoryIdx].quote}
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80">
                  {stories[activeStoryIdx].metrics.map((m, mIdx) => (
                    <div key={mIdx}>
                      <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                        {m.value}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {stories[activeStoryIdx].author}
                    </div>
                    <div className="text-xs text-slate-500">
                      {stories[activeStoryIdx].role}
                    </div>
                  </div>

                  {/* Slider Indicators */}
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      {stories.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`Slide ${idx + 1}`}
                          onClick={() => setActiveStoryIdx(idx)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            activeStoryIdx === idx
                              ? "w-8 bg-slate-900"
                              : "w-2 bg-slate-300 hover:bg-slate-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE FAQ ACCORDION                                              */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 uppercase tracking-wider">
              PERTANYAAN UMUM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Hal yang Sering Ditanyakan
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Pelajari selengkapnya tentang jaminan escrow, pembagian formasi
              tim, dan verifikasi kampus.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.q}
                    </span>
                    <span className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0 transition-transform duration-200">
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white animate-fade-in-fast">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. BOTTOM CTA CONVERSION BANNER (Exact Axora Layout from Reference)        */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white border-t border-slate-200/80 text-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Side */}
            <div className="lg:col-span-7 space-y-6">
              {/* CTA Section Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span className="uppercase tracking-wider">MULAI SEKARANG</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Dapatkan Proyek yang Cocok{" "}
                <span className="text-cyan-600">
                  Hanya dalam Hitungan Menit.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Daftar dengan email kampus Anda dan segera ajukan penawaran
                proposal ke berbagai UMKM lokal, atau pasang kebutuhan proyek
                Anda dengan proteksi escrow 100%.
              </p>

              {/* Dual Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      isAuthenticated
                        ? user?.role === "UMKM"
                          ? "/create-project"
                          : "/projects"
                        : "/register?role=UMKM",
                    )
                  }
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  {isAuthenticated ? "Buka Dashboard" : "Mulai Pasang Proyek"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-full border border-slate-300 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Jelajahi Proyek
                </button>
              </div>
            </div>

            {/* Right Side: Horizontal Stacked Fade Spectrum Gradient Bars (Axora Signature) */}
            <div className="lg:col-span-5 relative w-full h-[280px] sm:h-[320px] flex flex-col justify-center gap-2.5 overflow-hidden rounded-2xl p-4">
              {/* Stacked Horizontal Gradient Strips */}
              <div className="w-full h-8 bg-gradient-to-r from-transparent via-cyan-100/60 to-cyan-400/80 rounded-full blur-[1px] animate-pulse-glow" />
              <div className="w-5/6 ml-auto h-9 bg-gradient-to-r from-transparent via-amber-200/50 to-amber-400/80 rounded-full blur-[1px]" />
              <div className="w-full h-10 bg-gradient-to-r from-transparent via-teal-200/60 via-cyan-300/80 to-blue-500/80 rounded-full blur-[1px]" />
              <div className="w-4/5 ml-auto h-9 bg-gradient-to-r from-transparent via-cyan-200/70 to-teal-400/80 rounded-full blur-[1px]" />
              <div className="w-full h-8 bg-gradient-to-r from-transparent via-blue-200/50 via-cyan-300/70 to-cyan-500/80 rounded-full blur-[1px] animate-pulse-glow" />
              <div className="w-3/4 ml-auto h-7 bg-gradient-to-r from-transparent via-amber-200/40 to-amber-400/70 rounded-full blur-[1px]" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FLOATING BOTTOM QUICK-ACTION TOAST (Axora Floating Widget Style)      */}
      {/* ========================================================================= */}
      {showFloatingToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 animate-fade-in-fast">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 border border-cyan-200">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-xs min-w-0">
              <div className="font-bold text-slate-900 truncate">
                Mulai Buat Brief Proyek Digital
              </div>
              <div className="text-slate-500 truncate text-[11px]">
                Ceritakan kebutuhan Anda & temukan talenta kampus yang tepat.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? user?.role === "UMKM"
                      ? "/create-project"
                      : "/projects"
                    : "/register?role=UMKM",
                )
              }
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Mulai Sekarang
            </button>
            <button
              type="button"
              onClick={() => setShowFloatingToast(false)}
              aria-label="Tutup"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
