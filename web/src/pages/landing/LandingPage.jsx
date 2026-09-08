import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi, talentApi } from "../../api";
import { Button } from "../../components/ui/Button";
import { CategoryCard } from "../../components/features/CategoryCard";
import { ProjectCard } from "../../components/features/ProjectCard";
import { TalentCard } from "../../components/features/TalentCard";
import {
  Search,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Briefcase,
  GraduationCap,
  Building2,
  Lock,
  Star,
  Layers,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

// Premium Line-Art Icons (Fiverr Screenshot 1 & 2 Standard, Monochrome, Stroke 1.5px)
function IconProgramming() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-slate-900"
    >
      <rect width="20" height="13" x="2" y="3" rx="2" />
      <path d="M7 21h10M12 16v5M8 9.5l-2 2 2 2M16 9.5l2 2-2 2M13 8.5l-2 6" />
    </svg>
  );
}

function IconGraphics() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-slate-900"
    >
      <rect width="18" height="18" x="3" y="3" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function IconUIUX() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-slate-900"
    >
      <rect width="14" height="20" x="5" y="2" rx="2.5" />
      <path d="M9 6h6M8 11h8M9 15h3" />
      <circle cx="12" cy="18.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-slate-900"
    >
      <rect width="20" height="15" x="2" y="5" rx="2" />
      <polygon points="10 9 15 12.5 10 16 10 9" />
      <path d="M6 5v3M18 5v3M6 16v4M18 16v4" />
    </svg>
  );
}

function IconWriting() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-slate-900"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconData() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-slate-900"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </svg>
  );
}

function IconMarketing() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-slate-900"
    >
      <path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14M2 19h20M9 9l3-3 3 3M12 6v8" />
    </svg>
  );
}

function IconPhoto() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-slate-900"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconConsulting() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 text-slate-900"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

// 4 Pillars Trust Line-Art Icons (Screenshot 2: Fiverr "Make it all happen with freelancers")
function IconFiverrGrid() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9 text-slate-900"
    >
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="14" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="14" width="6.5" height="6.5" rx="1.5" />
      <path d="M17.5 14v6.5M14 17.5h6.5" />
      <rect x="4" y="24" width="6.5" height="2" rx="0.5" />
      <path d="M25 14v6.5M21.5 17.5h6.5" />
    </svg>
  );
}

function IconFiverrCheckLoop() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9 text-slate-900"
    >
      <path d="M16 5a11 11 0 1 1-10.5 14.5" />
      <path d="M5.5 13.5l.5 6 6-.5" />
      <circle cx="16" cy="16" r="6.5" />
      <path d="M13.5 16l2 2 3.5-3.5" />
    </svg>
  );
}

function IconFiverrLightning() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9 text-slate-900"
    >
      <rect x="4" y="4" width="24" height="24" rx="3.5" />
      <path d="M17 8.5l-6.5 8.5h5.5l-2 6.5 8.5-9.5h-5.5l3-5.5z" />
    </svg>
  );
}

function IconFiverrEscrowPay() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-9 h-9 text-slate-900"
    >
      <rect x="4" y="5" width="24" height="18" rx="3" />
      <path d="M4 19l-1 4 4.5-1.5" />
      <path d="M12.5 13.5a3.5 3.5 0 0 0 7 0" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="20" cy="10" r="1" fill="currentColor" />
      <path d="M16 27v3M13 29h6" />
    </svg>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [latestProjects, setLatestProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTalents, setLoadingTalents] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [openFaq, setOpenFaq] = useState(0);
  const [talents, setTalents] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadPublicData() {
      // Timeout guard 2.5 detik agar UI tidak pernah loading abadi
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2500),
      );

      try {
        setLoading(true);
        const fetchProj = projectApi.browse({ limit: 6, status: "OPEN" });
        const res = await Promise.race([fetchProj, timeoutPromise]);
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        if (isMounted) setLatestProjects(list);
      } catch (err) {
        if (isMounted) setLatestProjects([]);
      } finally {
        if (isMounted) setLoading(false);
      }

      try {
        setLoadingTalents(true);
        const fetchTalents = talentApi.getTalents({ limit: 4 });
        const tRes = await Promise.race([fetchTalents, timeoutPromise]);
        const tList = Array.isArray(tRes?.data)
          ? tRes.data
          : Array.isArray(tRes)
            ? tRes
            : [];
        if (isMounted) setTalents(tList);
      } catch (tErr) {
        if (isMounted) setTalents([]);
      } finally {
        if (isMounted) setLoadingTalents(false);
      }
    }

    loadPublicData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/projects?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate("/projects");
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/projects?keyword=${encodeURIComponent(tag)}`);
  };

  // 9 Kategori Icon Line-Art Minimalis ala Screenshot 1 Fiverr
  const quickCategories = [
    {
      title: "Website & Pemrograman",
      icon: <IconProgramming />,
      query: "Website",
    },
    { title: "Desain Grafis & Logo", icon: <IconGraphics />, query: "Desain" },
    { title: "UI/UX & Desain Aplikasi", icon: <IconUIUX />, query: "UI/UX" },
    { title: "Video Reels & Promosi", icon: <IconVideo />, query: "Video" },
    {
      title: "Copywriting & Artikel",
      icon: <IconWriting />,
      query: "Copywriting",
    },
    { title: "Admin & Data Excel", icon: <IconData />, query: "Data" },
    { title: "Pemasaran Digital", icon: <IconMarketing />, query: "Marketing" },
    { title: "Foto & Katalog Produk", icon: <IconPhoto />, query: "Katalog" },
    {
      title: "Konsultasi Usaha",
      icon: <IconConsulting />,
      query: "Konsultasi",
    },
  ];

  // 6 Kategori Showcase dengan Gambar Produk Real (Anti-Slop)
  const visualCategories = [
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

  const heroTags = [
    "Website Development",
    "Desain Grafis & Logo",
    "Video TikTok & Reels",
    "UI/UX Mobile Apps",
    "Katalog Produk UMKM",
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
    <div className="space-y-16 sm:space-y-24 pb-20 font-sans text-slate-900 bg-white">
      {/* 1. HERO SECTION - Simple, Bold, Cinematic (Persis Screenshot 3 Fiverr) */}
      <section className="relative bg-[#0b1324] text-white pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-slate-800/40 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-10 w-[500px] h-[400px] bg-brand-indigo/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-7">
          {/* Headline Sederhana & Kuat ala Fiverr */}
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
              Serahkan kebutuhan digital bisnismu pada mahasiswa bertalenta.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal">
              Dari desain logo, kemasan, website, video reels hingga data,
              temukan mahasiswa terverifikasi kampus dengan transaksi aman
              Rekening Bersama.
            </p>
          </div>

          {/* Search Bar Rapi & Kotak Submit Gelap (Persis Screenshot 3 Fiverr) */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-1.5 flex items-center gap-2 border border-slate-200"
          >
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Apa layanan yang sedang Anda butuhkan hari ini?"
              className="w-full px-4 py-3 bg-transparent border-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:ring-0 font-normal"
            />
            <button
              type="submit"
              className="w-12 h-12 rounded-lg bg-[#222325] hover:bg-black text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              title="Cari Layanan"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Filter Tag Pills dengan tanda Panah (Persis Screenshot 3 Fiverr) */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
            {heroTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-slate-200 hover:text-white transition-colors cursor-pointer text-xs font-medium backdrop-blur-xs"
              >
                <span>{tag}</span>
                <span className="text-slate-400 font-sans">→</span>
              </button>
            ))}
          </div>

          {/* Trusted By Bar Monokrom (Persis Bar Meta Google Netflix di Fiverr) */}
          <div className="pt-10 border-t border-slate-800/80 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-400">
              Dipercaya talenta dari:
            </span>
            <span className="font-bold tracking-wider text-slate-300">
              UNIVERSITAS INDONESIA
            </span>
            <span className="font-bold tracking-wider text-slate-300">ITB</span>
            <span className="font-bold tracking-wider text-slate-300">
              UNIVERSITAS GADJAH MADA
            </span>
            <span className="font-bold tracking-wider text-slate-300">
              UNDIP
            </span>
            <span className="font-bold tracking-wider text-slate-300">
              UNAIR
            </span>
            <span className="font-bold tracking-wider text-slate-300">
              ITS SURABAYA
            </span>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TILES DENGAN IKON LINE-ART FIVERR (Persis Screenshot 1 Fiverr) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
          {quickCategories.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTagClick(cat.query)}
              className="bg-white border border-slate-200/90 hover:border-slate-400 rounded-2xl p-4 flex flex-col justify-between items-start text-left gap-6 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="p-1 text-slate-900 group-hover:scale-105 transition-transform duration-200">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-brand-indigo transition-colors line-clamp-2">
                {cat.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FOUR PILLARS TRUST GRID (Persis Screenshot 2 Fiverr: "Make it all happen with freelancers") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="border-b border-slate-200 pb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-10">
            Semua kebutuhan usaha tuntas bersama mahasiswa bertalenta
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pillar 1 */}
            <div className="space-y-4">
              <IconFiverrGrid />
              <p className="text-sm font-medium text-slate-700 leading-snug">
                Akses ratusan talenta terverifikasi kampus dari berbagai program
                studi unggulan.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="space-y-4">
              <IconFiverrCheckLoop />
              <p className="text-sm font-medium text-slate-700 leading-snug">
                Alur kerja praktis: buat brief kebutuhan, tinjau proposal, dan
                pilih yang paling cocok.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="space-y-4">
              <IconFiverrLightning />
              <p className="text-sm font-medium text-slate-700 leading-snug">
                Pengerjaan cepat dan berkualitas tinggi, tetap terjangkau dan
                tepat waktu.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="space-y-4">
              <IconFiverrEscrowPay />
              <p className="text-sm font-medium text-slate-700 leading-snug">
                Bayar hanya saat Anda 100% puas: dana aman di rekening bersama
                Makarya.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VISUAL CATEGORIES SHOWCASE DENGAN FOTO PRODUK REAL (Dribbble & Fiverr Standards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-indigo mb-2">
              <Layers className="w-4 h-4" />
              Katalog Layanan Digital
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Eksplorasi Karya & Jasa Terpopuler
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Pratinjau portofolio riil mahasiswa yang siap mengerjakan
              kebutuhan bisnis Anda.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visualCategories.map((cat) => (
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

      {/* 5. SHOWCASE PROYEK TERBUKA & DIREKTORI TALENTA (Langsung Muat Data, Anti-Loading Hang) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-10 border border-slate-200/80 space-y-8">
          {/* Header with Switcher Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Peluang Nyata & Talenta Terpilih
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Jelajahi pekerjaan aktif dari UMKM atau rekrut langsung
                mahasiswa berprestasi.
              </p>
            </div>

            {/* Pill Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-white border border-slate-200 shadow-xs self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "projects"
                    ? "bg-[#222325] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Proyek Terbuka ({latestProjects.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("talents")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "talents"
                    ? "bg-[#222325] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Direktori Talenta ({talents.length})</span>
              </button>
            </div>
          </div>

          {/* Tab Content: Projects */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-56 bg-white border border-slate-200 rounded-2xl animate-pulse"
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
                <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-300">
                  <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">
                    Belum ada proyek terbuka saat ini
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Jadilah yang pertama memasang kebutuhan pekerjaan digital.
                  </p>
                  <Link to="/login" className="inline-block mt-4">
                    <Button variant="brand" size="sm">
                      Pasang Proyek Pertama
                    </Button>
                  </Link>
                </div>
              )}

              <div className="text-center pt-2">
                <Link to="/projects">
                  <Button
                    variant="outline"
                    size="md"
                    className="font-bold border-slate-300 hover:border-slate-400"
                  >
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
                      className="h-64 bg-white border border-slate-200 rounded-2xl animate-pulse"
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
                <div className="text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-300">
                  <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-800">
                    Mahasiswa sedang mempersiapkan portofolio
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Daftarkan dirimu sebagai talenta terverifikasi kampus
                    sekarang.
                  </p>
                  <Link to="/register" className="inline-block mt-4">
                    <Button variant="brand" size="sm">
                      Daftar Jadi Freelancer
                    </Button>
                  </Link>
                </div>
              )}

              <div className="text-center pt-2">
                <Link to="/talents">
                  <Button
                    variant="outline"
                    size="md"
                    className="font-bold border-slate-300 hover:border-slate-400"
                  >
                    <span>Jelajahi Seluruh Direktori Talenta</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. ESCROW GUARANTEE SECTION (Editorial Split-Layout with Live Mockup Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Garansi Keamanan Rekening Bersama (Escrow)
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
                Transaksi aman tanpa rasa cemas, dari awal brief sampai hasil
                akhir disetujui.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
                Makarya memastikan setiap rupiah dana pelaku usaha aman di
                rekening perantara resmi, dan setiap jerih payah karya mahasiswa
                terbayar 100% tepat waktu tanpa potongan komisi.
              </p>

              {/* 3 Value Points with Minimalist Monochrome Line-Art */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-900 mt-0.5 shadow-xs">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Dana Terkunci Aman di Awal
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      UMKM menyetor dana ke escrow sebelum proyek dimulai.
                      Mahasiswa tenang karena imbalan sudah terjamin dan tidak
                      bisa dibatalkan sepihak.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-900 mt-0.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Pemeriksaan Hasil & Hak Revisi
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      Periksa berkas deliverable langsung di ruang kerja
                      digital. Anda berhak meminta revisi sebelum menyetujui
                      pelepasan dana.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-900 mt-0.5 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Jaminan Integritas Mahasiswa Kampus
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      Setiap mahasiswa terikat data identitas resmi
                      (.ac.id/KTM). Jika terjadi wanprestasi, dana otomatis
                      dikembalikan utuh ke UMKM.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-lg space-y-5 relative">
                {/* Mock Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Kontrak Escrow #MKY-8821
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Dana Terlindungi 100%
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Pengerjaan
                  </span>
                </div>

                {/* Contract Subject */}
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400 font-medium">
                    Kebutuhan Proyek:
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Redesign Kemasan & Label Botol Kopi
                  </div>
                  <div className="text-xs text-slate-500">
                    Klien: Aura Coffee Roasters • Mahasiswa: Darell (DKV)
                  </div>
                </div>

                {/* Escrow Value Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-medium">
                      Nominal Diamankan:
                    </span>
                    <span className="text-xl font-extrabold text-slate-900">
                      Rp 450.000
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                    ✓ Rekening Bersama
                  </span>
                </div>

                {/* Live Timeline Steps */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>1. UMKM Setor Dana Kontrak</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    <span>2. Mahasiswa Unggah File Final</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-brand-indigo font-bold">
                    <span className="w-5 h-5 rounded-full bg-brand-indigo text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>3. UMKM Periksa & Setujui Rilis Dana</span>
                  </div>
                </div>

                {/* Mock Action Button */}
                <div className="pt-2">
                  <div className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm">
                    <span>Setujui & Selesaikan Proyek</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Dana baru berpindah ke dompet mahasiswa setelah tombol ini
                    diklik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-sm text-slate-500">
            Hal mendasar mengenai alur kerja, keamanan transaksi, dan
            perlindungan pengguna.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-indigo shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-brand-indigo" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. PRE-FOOTER DUAL ACTION BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UMKM Card */}
          <div className="bg-brand-indigo text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-8 shadow-brand">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                Untuk Pemilik Usaha / UMKM
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Tingkatkan Citra Bisnis Anda Tanpa Beban Biaya Agency.
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
                Dapatkan logo profesional, kemasan produk menawan, website
                responsif, atau konten video reels dari talenta muda kreatif
                dengan jaminan perlindungan dana 100%.
              </p>
            </div>
            <div className="relative z-10 pt-2">
              <Link to="/login" className="inline-block w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-900 border-0 shadow-lg justify-center rounded-xl"
                >
                  <span>Pasang Kebutuhan Proyek</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mahasiswa Card */}
          <div className="bg-[#0b1324] text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-8 border border-slate-800 shadow-sm">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold uppercase tracking-wider border border-white/10">
                <GraduationCap className="w-3.5 h-3.5" />
                Untuk Mahasiswa Bertalenta
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Ubah Kemampuan Kampus Menjadi Penghasilan & Portofolio Nyata.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Bantu UMKM lokal berkembang, dapatkan penghasilan utuh tanpa
                potongan komisi, dan otomatis miliki portofolio terverifikasi
                untuk melamar karir profesional.
              </p>
            </div>
            <div className="relative z-10 pt-2">
              <Link to="/register" className="inline-block w-full sm:w-auto">
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full sm:w-auto font-bold text-xs sm:text-sm shadow-brand justify-center rounded-xl"
                >
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
