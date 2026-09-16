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
  GraduationCap,
  X,
  Camera,
} from "lucide-react";

function getCategoryVisual(category) {
  const c = (category || "").toUpperCase();
  if (c.includes("UI") || c.includes("UX")) {
    return {
      icon: CategoryUiUxSvg,
      bg: "bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]",
      pillBg: "bg-sky-50 text-sky-700 border-sky-200/80",
      name: "UI/UX & Prototipe",
      tag: "UI/UX",
    };
  }
  if (c.includes("DESAIN") || c.includes("DESIGN") || c.includes("BRAND")) {
    return {
      icon: CategoryDesignSvg,
      bg: "bg-[#FCE7F3] text-[#DB2777] border-[#FBCFE8]",
      pillBg: "bg-pink-50 text-pink-700 border-pink-200/80",
      name: "Desain Grafis",
      tag: "Visual Design",
    };
  }
  if (c.includes("WEB") || c.includes("PEMROGRAMAN") || c.includes("CODE")) {
    return {
      icon: CategoryCodeSvg,
      bg: "bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]",
      pillBg: "bg-purple-50 text-purple-700 border-purple-200/80",
      name: "Web & Koding",
      tag: "Development",
    };
  }
  if (c.includes("VIDEO") || c.includes("ANIMASI")) {
    return {
      icon: CategoryVideoSvg,
      bg: "bg-[#FFE4E6] text-[#E11D48] border-[#FECDD3]",
      pillBg: "bg-rose-50 text-rose-700 border-rose-200/80",
      name: "Video & Animasi",
      tag: "Motion & Media",
    };
  }
  if (c.includes("COPY") || c.includes("TULIS") || c.includes("KONTEN")) {
    return {
      icon: CategoryCopySvg,
      bg: "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]",
      pillBg: "bg-amber-50 text-amber-700 border-amber-200/80",
      name: "Copywriting & SEO",
      tag: "Content & Copy",
    };
  }
  return {
    icon: CategoryDataSvg,
    bg: "bg-[#ECFCCB] text-[#4D7C0F] border-[#D9F99D]",
    pillBg: "bg-lime-50 text-lime-700 border-lime-200/80",
    name: "Administrasi & Data",
    tag: "Data & Admin",
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

  // =========================================================================
  // DYNAMIC ACCOUNT SETUP RECOMMENDATIONS (Based on real user profile state)
  // =========================================================================
  const setupRecommendations = [];

  if (isUmkm) {
    if (!user?.url_foto) {
      setupRecommendations.push({
        id: "photo",
        title: "Unggah Logo Usaha",
        desc: "Tingkatkan kredibilitas di mata mahasiswa pelamar.",
        link: "/profile",
        cta: "Unggah Logo",
        icon: Camera,
      });
    }
    if (!user?.bidang_industri || !user?.kota || !user?.no_kontak) {
      setupRecommendations.push({
        id: "profile",
        title: "Lengkapi Profil Usaha",
        desc: "Tambahkan bidang industri, kota & WhatsApp aktif.",
        link: "/profile",
        cta: "Lengkapi Data",
        icon: User,
      });
    }
    if (!user?.nomor_rekening || !user?.nama_bank) {
      setupRecommendations.push({
        id: "bank",
        title: "Atur Rekening Pencairan",
        desc: "Penting untuk transaksi & penarikan saldo dompet.",
        link: "/profile",
        cta: "Atur Rekening",
        icon: WalletIcon,
      });
    }
    if (myProjects.length === 0) {
      setupRecommendations.push({
        id: "first_project",
        title: "Pasang Proyek Pertama",
        desc: "Buka proyek kolaborasi ke talenta kampus terkurasi.",
        link: "/projects/new",
        cta: "Pasang Proyek",
        icon: PlusCircle,
      });
    }
  } else {
    // Mahasiswa
    if (!user?.url_foto) {
      setupRecommendations.push({
        id: "photo",
        title: "Unggah Foto Profil",
        desc: "Profil berfoto mendapat lebih banyak perhatian mitra UMKM.",
        link: "/profile",
        cta: "Unggah Foto",
        icon: Camera,
      });
    }
    const hasPortfolio =
      user?.github_url ||
      user?.figma_url ||
      user?.website_url ||
      user?.linkedin_url;
    const hasSkills = Array.isArray(user?.skills) && user.skills.length > 0;
    if (!hasSkills || !hasPortfolio) {
      setupRecommendations.push({
        id: "skills_portfolio",
        title: "Keahlian & Portofolio",
        desc: "Tambahkan keahlian utama & link Figma/GitHub Anda.",
        link: "/profile",
        cta: "Isi Portofolio",
        icon: Award,
      });
    }
    if (!user?.nomor_rekening || !user?.nama_bank) {
      setupRecommendations.push({
        id: "bank",
        title: "Rekening Bank Pencairan",
        desc: "Diperlukan untuk pencairan honor garansi escrow.",
        link: "/profile",
        cta: "Atur Rekening",
        icon: WalletIcon,
      });
    }
    if (myProposals.length === 0) {
      setupRecommendations.push({
        id: "first_proposal",
        title: "Kirim Proposal Pertama",
        desc: "Jelajahi proyek terbuka yang sesuai keahlian Anda.",
        link: "/projects",
        cta: "Cari Proyek",
        icon: Compass,
      });
    }
  }

  const primaryPending =
    setupRecommendations.length > 0 ? setupRecommendations[0] : null;
  const PendingIcon = primaryPending?.icon || User;

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
        {/* Card A: Welcome & Mission Canvas (Left ~65%) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#F8F9FA] border border-slate-200/70 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
        <div className="lg:col-span-7 xl:col-span-8 bg-[#F8FAFC] border border-slate-200/80 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Selamat Datang, {userDisplayName}!
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
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
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <span>Pasang Proyek Baru</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <Link to="/talents">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
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
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0B1528] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Jelajahi Katalog Proyek</span>
                  </button>
                </Link>
                <Link to="/portfolio">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-brand-indigo" />
                    <Award className="w-3.5 h-3.5 text-brand-cyan" />
                    <span>Portofolio Karya Saya</span>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Card B: Account Setup & Recommendations Widget (Right ~35% - Kuubiik 3D Stacked Deck) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#FEE066] border border-[#F5D040] rounded-[28px] sm:rounded-[32px] p-6 flex flex-col justify-between gap-4 shadow-2xs relative overflow-hidden">
          {/* Subtle Organic Wave Aura in Background */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-amber-300/60 to-yellow-400/40 rounded-full blur-2xl pointer-events-none" />
          <svg
            className="absolute top-0 right-0 w-36 h-36 text-amber-300/40 pointer-events-none"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M0 0 C50 20 80 50 100 100 L100 0 Z" />
          </svg>
        {/* Card B: Account Setup & Status Widget (Right ~35% - Makarya Brand Dark Card with 3D Stack) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#0F172A] border border-slate-800 rounded-[28px] sm:rounded-[32px] p-6 flex flex-col justify-between gap-4 shadow-md relative overflow-hidden text-white">
          {/* Subtle Makarya Cyan Glow Aura */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight">
                {isUmkm ? "Kelengkapan Akun Anda" : "Kelengkapan Profil"}
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                {setupRecommendations.length > 0
                  ? isUmkm
                    ? "Kelengkapan Akun Anda"
                    : "Kelengkapan Profil"
                  : "Akun Siap Berkolaborasi"}
              </h2>
              <p className="text-xs text-slate-800/80 mt-1 max-w-[220px] leading-snug font-medium">
                3 saran untuk memaksimalkan profil & kolaborasi Makarya.
              <p className="text-xs text-slate-400 mt-1 max-w-[230px] leading-snug font-medium">
                {setupRecommendations.length > 0
                  ? `${setupRecommendations.length} saran untuk mengoptimalkan akun Makarya Anda.`
                  : "Profil dan akun Anda sudah 100% lengkap dan terverifikasi."}
              </p>
            </div>
            <button
              type="button"
              className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 font-bold flex items-center justify-center text-xs shadow-2xs shrink-0 transition-all cursor-pointer"
              aria-label="Tutup rekomendasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {setupRecommendations.length > 0 ? (
              <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                {setupRecommendations.length}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold shrink-0">
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>100% Siap</span>
              </span>
            )}
          </div>

          {/* 3D Stacked Overlapping Mini-Cards */}
          <div className="relative pt-4 pb-1">
            {/* Card 1: Background Layer (Emerald Green) */}
            <div className="w-[88%] mx-auto bg-[#22C55E] text-white rounded-2xl px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs -mb-5 relative z-10 select-none">
            <div className="w-[88%] mx-auto bg-[#10B981] text-white rounded-2xl px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs -mb-5 relative z-10 select-none">
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Rekening Escrow Siap</span>
                <span className="truncate">Garansi Escrow 100% Aktif</span>
              </div>
              <Check className="w-3.5 h-3.5 shrink-0" />
            </div>

            {/* Card 2: Middle Layer (Royal Indigo/Purple) */}
            <div className="w-[94%] mx-auto bg-[#6366F1] text-white rounded-2xl px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-xs -mb-5 relative z-20 select-none">
            {/* Card 2: Middle Layer (Makarya Brand Cyan) */}
            <div className="w-[94%] mx-auto bg-[#38BDF8] text-slate-950 rounded-2xl px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-xs -mb-5 relative z-20 select-none">
              <div className="flex items-center gap-2 truncate">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Formasi Tim Multi-Role</span>
                <span className="truncate">Kolaborasi Talenta & UMKM</span>
              </div>
              <span className="text-[9px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
              <span className="text-[9px] bg-slate-950/15 px-2 py-0.5 rounded-full font-bold">
                Aktif
              </span>
            </div>

            {/* Card 3: Foreground Main Active Card (White Elevation) */}
            <div className="w-full bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-white flex items-center justify-between gap-3 relative z-30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-5 h-5" />
            {primaryPending ? (
              <div className="w-full bg-white text-slate-900 rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-white flex items-center justify-between gap-3 relative z-30">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <PendingIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">
                      {primaryPending.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {primaryPending.desc}
                    </p>
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-slate-900 truncate">
                    {isUmkm ? "Lengkapi Profil Usaha" : "Lengkapi Portofolio"}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {isUmkm
                      ? "Tambahkan logo & deskripsi bisnis"
                      : "Unggah karya & keahlian utama"}
                  </p>

                <Link to={primaryPending.link} className="shrink-0">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    {primaryPending.cta}
                  </button>
                </Link>
              </div>
            ) : (
              <div className="w-full bg-white text-slate-900 rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-white flex items-center justify-between gap-3 relative z-30">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">
                      Profil 100% Lengkap
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {isUmkm
                        ? "Siap pasang proyek & pilih talenta."
                        : "Siap kirim proposal & mulai bekerja."}
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/profile" className="shrink-0">
                <button
                  type="button"
                  className="px-4 py-2 rounded-full bg-[#0B1528] hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                <Link
                  to={isUmkm ? "/projects/new" : "/projects"}
                  className="shrink-0"
                >
                  Perbarui
                </button>
              </Link>
            </div>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    {isUmkm ? "Pasang Proyek" : "Cari Proyek"}
                  </button>
                </Link>
              </div>
            )}
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
            <span className="inline-block px-3 py-1 rounded-full bg-[#FEE066] text-slate-950 text-[10px] font-extrabold tracking-wider uppercase">
              {isUmkm ? "Jobs" : "Katalog Proyek"}
            <span className="inline-block px-3 py-1 rounded-full bg-sky-50 text-sky-900 text-[10px] font-extrabold tracking-wider uppercase border border-sky-200/80">
              {isUmkm ? "Pekerjaan" : "Katalog Proyek"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isUmkm
                ? "Jobs you posted on Makarya"
                ? "Proyek yang Anda Kelola di Makarya"
                : "Peluang Proyek Terkurasi"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={isUmkm ? "/proposals" : "/projects"}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 hidden sm:inline-flex items-center gap-1 mr-2"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Carousel Navigation Buttons */}
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Geser ke kiri"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all shadow-2xs cursor-pointer active:scale-95"
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
            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory"
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
                  className="w-[280px] sm:w-[310px] bg-white border border-slate-100 rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:border-slate-200/90 transition-all flex flex-col justify-between gap-4 shrink-0 snap-start select-none group"
                >
                  {/* Card Top Row: Icon Squircle + Status Pill + 3-dots */}
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-11 h-11 rounded-2xl ${visual.bg} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      <SvgIcon size={26} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 rounded-full">
                        {formatStatus(project.status)}
                      </span>
                      <button
                        type="button"
                        className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                        title="Opsi Proyek"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Middle: Title & Scope Description */}
                  <div className="space-y-1">
                    <Link
                      to={isUmkm ? `/proposals` : `/projects/${project.id}`}
                      className="text-sm font-extrabold text-slate-900 group-hover:text-brand-indigo transition-colors line-clamp-1 leading-snug block"
                    >
                      {project.judul}
                    </Link>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {project.deskripsi_raw ||
                        "Proyek kolaborasi terstruktur dengan garansi perlindungan honor rekening bersama 100%."}
                    </p>
                  </div>

                  {/* Card Bottom: Tags & Budget/CTA */}
                  <div className="pt-3 border-t border-slate-100/90 space-y-3">
                    {/* Tags Pills (Kuubiik Style: SaaS, Web app, UI) */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
                        {visual.tag}
                      </span>
                      {isTeam ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                          Tim Multi-Role
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100">
                          Individu
                        </span>
                      )}
                      {project.deadline && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-400">
                          {daysRemaining(project.deadline)} Hari
                        </span>
                      )}
                    </div>

                    {/* Honor Escrow & Action Button */}
                    <div className="flex items-center justify-between gap-2 pt-0.5">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Batas Honor Escrow
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {formatCurrency(project.budget_max)}
                        </span>
                      </div>

                      <Link
                        to={isUmkm ? `/proposals` : `/projects/${project.id}`}
                      >
                        <button
                          type="button"
                          className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                        >
                          {isUmkm ? "Kelola" : "Lamar"}
                        </button>
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
