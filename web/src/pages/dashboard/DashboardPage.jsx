import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi, proposalApi, walletApi, talentApi } from "../../api";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, daysRemaining } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import { ProjectBriefVectorIcon } from "../../components/icons/ProjectVectorIcon";
import {
  CategoryDesignSvg,
  CategoryUiUxSvg,
  CategoryCodeSvg,
  CategoryVideoSvg,
  CategoryCopySvg,
  CategoryDataSvg,
} from "../../components/ui/CategorySvgIcons";
import {
  Wallet as WalletIcon,
  PlusCircle,
  ArrowRight,
  Compass,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Users,
  FolderKanban,
  Star,
  BadgeCheck,
  Sparkles,
  Layers,
  Award,
  Filter,
  Check,
  User,
  Zap,
} from "lucide-react";

function getCategoryVisual(category) {
  const c = (category || "").toUpperCase();
  if (c.includes("UI") || c.includes("UX")) {
    return {
      icon: CategoryUiUxSvg,
      bg: "bg-sky-50 text-sky-600 border-sky-100",
      pillBg: "bg-sky-50 text-sky-700 border-sky-200/80",
      name: "UI/UX & Prototipe",
    };
  }
  if (c.includes("DESAIN") || c.includes("DESIGN") || c.includes("BRAND")) {
    return {
      icon: CategoryDesignSvg,
      bg: "bg-indigo-50 text-indigo-600 border-indigo-100",
      pillBg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      name: "Desain Grafis",
    };
  }
  if (c.includes("WEB") || c.includes("PEMROGRAMAN") || c.includes("CODE")) {
    return {
      icon: CategoryCodeSvg,
      bg: "bg-blue-50 text-blue-600 border-blue-100",
      pillBg: "bg-blue-50 text-blue-700 border-blue-200/80",
      name: "Web & Koding",
    };
  }
  if (c.includes("VIDEO") || c.includes("ANIMASI")) {
    return {
      icon: CategoryVideoSvg,
      bg: "bg-rose-50 text-rose-600 border-rose-100",
      pillBg: "bg-rose-50 text-rose-700 border-rose-200/80",
      name: "Video & Animasi",
    };
  }
  if (c.includes("COPY") || c.includes("TULIS") || c.includes("KONTEN")) {
    return {
      icon: CategoryCopySvg,
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      name: "Copywriting & SEO",
    };
  }
  return {
    icon: CategoryDataSvg,
    bg: "bg-amber-50 text-amber-600 border-amber-100",
    pillBg: "bg-amber-50 text-amber-700 border-amber-200/80",
    name: "Administrasi & Data",
  };
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isUmkm = user?.role === "UMKM";

  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [openProjects, setOpenProjects] = useState([]);
  const [recommendedTalents, setRecommendedTalents] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const carouselRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      if (isUmkm) {
        const [wRes, pRes, tRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          projectApi.getMyProjects().catch(() => ({ data: [] })),
          talentApi.getTalents({ limit: 4 }).catch(() => ({ data: [] })),
        ]);
        setWallet(wRes.data);
        setMyProjects(
          Array.isArray(pRes.data) ? pRes.data : pRes.data?.items || [],
        );
        setRecommendedTalents(
          Array.isArray(tRes.data) ? tRes.data : tRes.data?.items || [],
        );
      } else {
        const [wRes, propRes, projRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          proposalApi.getMyProposals().catch(() => ({ data: [] })),
          projectApi
            .browse({ status: "OPEN", limit: 8 })
            .catch(() => ({ data: [] })),
        ]);
        setWallet(wRes.data);
        setMyProposals(
          Array.isArray(propRes.data)
            ? propRes.data
            : propRes.data?.items || [],
        );
        setOpenProjects(
          Array.isArray(projRes.data)
            ? projRes.data
            : projRes.data?.items || [],
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.role]);

  // Active job in progress for Mahasiswa
  const activeJob = !isUmkm
    ? myProposals.find((p) => p.status === "ACCEPTED")
    : null;

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/projects");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
        <div className="h-16 bg-slate-200/70 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-80 bg-slate-200/60 rounded-3xl animate-pulse" />
          <div className="lg:col-span-4 h-80 bg-slate-200/60 rounded-3xl animate-pulse" />
        </div>
        <div className="h-64 bg-slate-200/50 rounded-3xl animate-pulse" />
      </div>
    );
  }

  const userDisplayName =
    user?.nama ||
    user?.nama_lengkap ||
    user?.nama_usaha ||
    (user?.email ? user.email.split("@")[0] : "Rekan");

  // Filtered showcase list
  const showcaseProjects = isUmkm ? myProjects : openProjects;
  const filteredShowcase = showcaseProjects.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.deskripsi_raw?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === "ALL" ||
      (p.kategori || "").toUpperCase().includes(selectedCategory);
    return matchSearch && matchCat;
  });

  // Metrik Ringkas Real-time Dashboard
  const metrics = isUmkm
    ? [
        {
          label: "Proyek Sedang Berjalan",
          value: myProjects.filter((p) => p.status === "IN_PROGRESS").length,
          subtext: "Dikerjakan mahasiswa aktif",
          icon: ProjectBriefVectorIcon,
          colorText: "text-blue-600",
          colorBg: "bg-blue-50 border-blue-200/80",
          link: "/proposals",
        },
        {
          label: "Menunggu Pelamar",
          value: myProjects.filter(
            (p) => p.status === "OPEN" || p.status === "BIDDING",
          ).length,
          subtext: "Proyek terbuka di katalog",
          icon: Users,
          colorText: "text-indigo-600",
          colorBg: "bg-indigo-50 border-indigo-200/80",
          link: "/proposals",
        },
        {
          label: "Dana Escrow Terkunci",
          value: formatCurrency(wallet?.saldo_escrow || 0),
          subtext: "100% aman di penampungan",
          icon: ShieldCheck,
          colorText: "text-emerald-700",
          colorBg: "bg-emerald-50 border-emerald-200/80",
          link: "/wallet",
        },
        {
          label: "Proyek Selesai & Lunas",
          value: myProjects.filter((p) => p.status === "DONE").length,
          subtext: "Hasil disetujui & tuntas",
          icon: CheckCircle2,
          colorText: "text-purple-600",
          colorBg: "bg-purple-50 border-purple-200/80",
          link: "/proposals",
        },
      ]
    : [
        {
          label: "Kontrak Tugas Aktif",
          value: myProposals.filter((p) => p.status === "ACCEPTED").length,
          subtext: "Deliverable sedang diproses",
          icon: ProjectBriefVectorIcon,
          colorText: "text-blue-600",
          colorBg: "bg-blue-50 border-blue-200/80",
          link: "/proposals",
        },
        {
          label: "Proposal Terkirim",
          value: myProposals.filter((p) => p.status === "PENDING").length,
          subtext: "Menunggu tinjauan klien",
          icon: Clock,
          colorText: "text-amber-600",
          colorBg: "bg-amber-50 border-amber-200/80",
          link: "/proposals",
        },
        {
          label: "Saldo Dompet Aktif",
          value: formatCurrency(wallet?.saldo_aktif || 0),
          subtext: "Bebas ditarik ke rekening bank",
          icon: WalletIcon,
          colorText: "text-emerald-700",
          colorBg: "bg-emerald-50 border-emerald-200/80",
          link: "/wallet",
        },
        {
          label: "Honor Escrow Berjalan",
          value: formatCurrency(wallet?.saldo_escrow || 0),
          subtext: "Cair otomatis setelah approval",
          icon: ShieldCheck,
          colorText: "text-indigo-600",
          colorBg: "bg-indigo-50 border-indigo-200/80",
          link: "/wallet",
        },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7 font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP SEARCH & CONTROL BAR (Inspired by Kuubiik Header)                 */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar with Embedded Filters */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 w-full flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-900/5 transition-all"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isUmkm
                ? "Cari nama proyek atau pelamar Anda..."
                : "Cari proyek, keahlian Figma, React, Copywriting..."
            }
            className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />

          {/* Quick Category Filter Selector */}
          <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-200 pl-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-slate-600 focus:outline-hidden cursor-pointer pr-1"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="UIUX">UI/UX & Desain</option>
              <option value="PEMROGRAMAN">Web & Koding</option>
              <option value="VIDEO">Video Editing</option>
              <option value="COPYWRITING">Copywriting</option>
              <option value="ADMIN_DATA">Olah Data</option>
            </select>
          </div>
        </form>

        {/* Right Quick Action Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end shrink-0">
          {isUmkm ? (
            <Link to="/projects/new" className="w-full md:w-auto">
              <button
                type="button"
                className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Pasang Proyek</span>
              </button>
            </Link>
          ) : (
            <Link to="/projects" className="w-full md:w-auto">
              <button
                type="button"
                className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Cari Proyek</span>
              </button>
            </Link>
          )}

          {/* User Quick Avatar Badge */}
          <Link
            to="/profile"
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shrink-0 select-none"
            title="Kelola Profil Anda"
          >
            {user?.url_foto ? (
              <img
                src={user.url_foto}
                alt={userDisplayName}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                {userDisplayName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[100px] truncate">
              {userDisplayName}
            </span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO ROW: TWO BALANCED CARDS (Welcome Banner + Setup Widget)           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card A: Welcome & Mission Canvas (Left ~62%) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-slate-100/70 border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-2xs">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-bold text-slate-700 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
              <span>
                {isUmkm ? "Ruang Kolaborasi UMKM" : "Pusat Karier Mahasiswa"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Selamat Datang, {userDisplayName}!
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              {isUmkm
                ? "Platform kolaborasi digital terkurasi untuk UMKM & talenta kampus. Pasang kebutuhan proyek digital, tinjau portofolio mahasiswa, dan amankan pembayaran dengan garansi rekening bersama (escrow) 100%."
                : "Pusat kerja & portofolio digital terverifikasi. Jelajahi peluang proyek riil dari mitra UMKM, kirim penawaran proposal, dan selesaikan deliverable untuk membangun reputasi profesional Anda."}
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {isUmkm ? (
              <>
                <Link to="/projects/new">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>Pasang Proyek Baru</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <Link to="/talents">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-600" />
                    <span>Cari Talenta Kampus</span>
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/projects">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Jelajahi Katalog Proyek</span>
                  </button>
                </Link>
                <Link to="/portfolio">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-brand-indigo" />
                    <span>Portofolio Karya Saya</span>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Card B: Account Setup & Recommendations Widget (Right ~38% - Kuubiik Amber Deck) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-gradient-to-br from-amber-200/70 via-amber-100/80 to-yellow-200/60 border border-amber-300/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xs relative overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-950 tracking-tight">
                Kelengkapan Akun Anda
              </h2>
              <p className="text-xs text-amber-900/80 mt-0.5 leading-snug">
                3 rekomendasi untuk memaksimalkan kolaborasi Anda di Makarya.
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/70 border border-amber-300 flex items-center justify-center text-amber-900 text-xs font-bold shrink-0">
              3
            </div>
          </div>

          {/* Layered Interactive Card Deck */}
          <div className="space-y-2 pt-1">
            {/* Layer 1: Top mini badge */}
            <div className="mx-3 p-2 bg-emerald-500 text-white rounded-xl shadow-xs flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Rekening Escrow Siap</span>
              </span>
              <Check className="w-3.5 h-3.5 shrink-0" />
            </div>

            {/* Layer 2: Middle mini badge */}
            <div className="mx-1.5 p-2 bg-indigo-500 text-white rounded-xl shadow-xs flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5 truncate">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>Formasi Tim Multi-Role</span>
              </span>
              <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">
                Aktif
              </span>
            </div>

            {/* Layer 3: Foreground Main Setup Card */}
            <div className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {isUmkm ? "Lengkapi Profil Usaha" : "Lengkapi Portofolio"}
                  </h4>
                  <p className="text-[10.5px] text-slate-500 truncate">
                    {isUmkm
                      ? "Tambahkan deskripsi & logo usaha"
                      : "Unggah karya & tautan GitHub/Figma"}
                  </p>
                </div>
              </div>

              <Link to="/profile" className="shrink-0">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                >
                  Perbarui
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SHOWCASE SECTION: JOBS / PROJECTS CAROUSEL (Kuubiik Style Cards)       */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        {/* Section Header with Pill & Navigation Arrows */}
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-extrabold tracking-wide uppercase border border-amber-200/80">
              {isUmkm ? "Pekerjaan" : "Katalog Proyek"}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isUmkm
                ? "Proyek yang Anda Kelola di Makarya"
                : "Peluang Proyek Terkurasi untuk Anda"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={isUmkm ? "/proposals" : "/projects"}
              className="text-xs font-bold text-brand-indigo hover:text-brand-indigo-dark hidden sm:inline-flex items-center gap-1 mr-2"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Carousel Navigation Buttons */}
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Geser ke kanan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Container */}
        {filteredShowcase.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              {isUmkm
                ? "Belum Ada Proyek yang Sesuai"
                : "Belum Ada Proyek Terbuka Saat Ini"}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isUmkm
                ? "Pasang proyek baru Anda untuk mulai menerima lamaran mahasiswa."
                : "Pantau terus katalog proyek dari mitra UMKM terverifikasi."}
            </p>
            {isUmkm && (
              <Link to="/projects/new" className="inline-block pt-1">
                <Button variant="brand" size="sm" className="font-bold">
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  <span>Pasang Proyek Sekarang</span>
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x snap-mandatory"
          >
            {filteredShowcase.map((project) => {
              const visual = getCategoryVisual(project.kategori);
              const SvgIcon = visual.icon;
              const isTeam =
                project.tipe_kolaborasi === "TIM" ||
                (Array.isArray(project.slots) && project.slots.length > 1);

              return (
                <div
                  key={project.id}
                  className="w-[290px] sm:w-[320px] bg-white border border-slate-200/90 rounded-3xl p-5 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 shrink-0 snap-start group select-none"
                >
                  {/* Card Top Row: Icon Squircle + Status Pill + Action */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <SvgIcon size={32} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {formatStatus(project.status)}
                      </span>
                      {isTeam && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Tim</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Middle: Title & Scope Description */}
                  <div className="space-y-1.5">
                    <Link
                      to={
                        isUmkm
                          ? `/proposals`
                          : `/projects/${project.id}`
                      }
                      className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-indigo transition-colors line-clamp-2 leading-snug block"
                    >
                      {project.judul}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {project.deskripsi_raw ||
                        "Proyek kolaborasi terstruktur dengan garansi perlindungan honor rekening bersama 100%."}
                    </p>
                  </div>

                  {/* Card Bottom: Tags & Budget/CTA */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {/* Tags Pills (Kuubiik Style) */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {visual.name}
                      </span>
                      {project.deadline && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-200/60">
                          {daysRemaining(project.deadline)} Hari Lagi
                        </span>
                      )}
                    </div>

                    {/* Honor Escrow & Action Button */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Batas Honor Escrow
                        </span>
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          {formatCurrency(project.budget_max)}
                        </span>
                      </div>

                      <Link
                        to={
                          isUmkm
                            ? `/proposals`
                            : `/projects/${project.id}`
                        }
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[11px] font-bold rounded-xl border-slate-200 text-slate-800 hover:bg-slate-900 hover:text-white"
                        >
                          {isUmkm ? "Kelola" : "Lamar"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. ACTIVE CONTRACT WORKROOM BANNER (If Mahasiswa has an ongoing project)  */}
      {/* ========================================================================= */}
      {!isUmkm && activeJob && (
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold">
              <Clock className="w-3 h-3" />
              <span>Proyek Sedang Dikerjakan</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {activeJob.project_judul || "Proyek Kolaborasi Aktif"}
            </h3>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Escrow: {formatCurrency(activeJob.harga_tawar)}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                {activeJob.estimasi_hari} Hari Kerja
              </span>
            </div>
          </div>

          <Link to={`/proposals/${activeJob.project_id}`} className="shrink-0">
            <Button
              variant="brand"
              size="sm"
              className="text-xs font-bold shadow-sm"
            >
              <span>Buka Ruang Kerja & Obrolan</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. METRICS & ESCROW OVERVIEW GRID                                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link
              key={idx}
              to={m.link}
              className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                  {m.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border ${m.colorBg}`}
                >
                  <Icon className={`w-4 h-4 ${m.colorText}`} />
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight tabular-nums">
                  {m.value}
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block truncate">
                  {m.subtext}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 6. SECONDARY INSIGHTS & RECOMMENDED TALENTS FOR UMKM                     */}
      {/* ========================================================================= */}
      {isUmkm && recommendedTalents.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-brand-indigo" />
                <span>Rekomendasi Talenta Mahasiswa Kampus</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mahasiswa terverifikasi dengan portofolio dan reputasi tinggi.
              </p>
            </div>
            <Link
              to="/talents"
              className="text-xs font-bold text-brand-indigo hover:text-brand-indigo-dark flex items-center gap-1"
            >
              <span>Lihat Direktori</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {recommendedTalents.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {t.url_foto ? (
                    <img
                      src={t.url_foto}
                      alt={t.nama_lengkap}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {(t.nama_lengkap || "M").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {t.nama_lengkap}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                      <span>{t.prodi || "Mahasiswa"}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-slate-700">
                        {t.rating_avg || 5.0}
                      </span>
                    </div>
                  </div>
                </div>

                <Link to="/talents" className="block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full py-1 rounded-xl text-[11px] font-bold border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white"
                  >
                    Lihat Profil
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
