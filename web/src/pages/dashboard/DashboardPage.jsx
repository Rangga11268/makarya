import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi, proposalApi, walletApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { CategoryCard } from "../../components/features/CategoryCard";
import { HowItWorksStep } from "../../components/features/HowItWorksStep";
import { ProjectCard } from "../../components/features/ProjectCard";
import { TalentCard } from "../../components/features/TalentCard";
import { formatCurrency } from "../../utils/formatCurrency";
import { 
  Wallet as WalletIcon, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Clock, 
  Search,
  CheckCircle2,
  Users,
  PlusCircle,
  GraduationCap
} from "lucide-react";

export function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [myProposals, setMyProposals] = useState([]);
  const [latestProjects, setLatestProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [walletRes, proposalsRes, projectsRes] = await Promise.all([
        walletApi.getMe().catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
        proposalApi.getMyProposals().catch(() => ({ data: [] })),
        projectApi.browse({ limit: 6 }).catch(() => ({ data: [] })),
      ]);

      setWallet(walletRes.data);
      setMyProposals(proposalsRes.data);
      setLatestProjects(projectsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/projects?keyword=${encodeURIComponent(searchKeyword)}`);
  };

  const categories = [
    { code: "DESIGN", title: "Desain Grafis & Logo", count: 2 },
    { code: "UIUX", title: "UI/UX Design", count: 2 },
    { code: "PEMROGRAMAN", title: "Web & Coding", count: 2 },
    { code: "VIDEO", title: "Video & Animasi", count: 2 },
    { code: "COPYWRITING", title: "Copywriting & SEO", count: 2 },
    { code: "ADMIN_DATA", title: "Admin & Data Entry", count: 2 },
  ];

  const featuredTalents = [
    { 
      name: "Darell Rangga Putra", 
      prodi: "Sistem Informasi • UBSI", 
      rating: 5.0, 
      totalJobs: 8, 
      skills: ["FastAPI", "React.js", "PostgreSQL", "Tailwind"],
      
    },
    { 
      name: "Adelia Putri", 
      prodi: "DKV • UBSI", 
      rating: 4.9, 
      totalJobs: 11, 
      skills: ["Figma", "Branding", "Logo Design", "Illustrator"],
      
    },
    { 
      name: "Bima Arya", 
      prodi: "Teknologi Informasi • UBSI", 
      rating: 5.0, 
      totalJobs: 6, 
      skills: ["Landing Page", "Next.js", "WordPress", "SEO"],
      
    },
    { 
      name: "Siti Rahmawati", 
      prodi: "Ilmu Komunikasi • UBSI", 
      rating: 4.8, 
      totalJobs: 9, 
      skills: ["Copywriting", "Social Media", "Content Plan"],
      
    },
  ];

  const isUmkm = user?.role === "UMKM";

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="bg-dark-900 text-white pt-10 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-indigo/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-brand-cyan">
              <Sparkles className="w-3.5 h-3.5" />
              {isUmkm ? "Portal Klien UMKM • Pasang & Kelola Proyek" : "Platform Micro-freelancing Mahasiswa Terpercaya"}
            </div>

            {isUmkm && (
              <Link to="/projects/new">
                <Button
                  variant="gradient"
                  size="sm"
                  className="text-xs font-bold shadow-brand"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  + Pasang Proyek UMKM Baru
                </Button>
              </Link>
            )}
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.1] text-white font-normal">
              {isUmkm 
                ? "Dapatkan Talenta Mahasiswa Terbaik untuk Kebutuhan Usaha Anda." 
                : "Wujudkan Ambisi Digital UMKM Bersama Talenta Mahasiswa."}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed font-normal">
              {isUmkm
                ? "Pasang kebutuhan desain logo, kemasan, website, atau konten media sosial. Mahasiswa bertalenta dari berbagai kampus siap mengajukan proposal dengan harga terjangkau."
                : "Hubungkan kebutuhan desain, website, dan konten UMKM lokal dengan ribuan mahasiswa bertalenta. Aman, cepat, dan honor dilindungi 100% via sistem Escrow Holding."}
            </p>
          </div>

          {/* Search Bar or Action Box */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl bg-surface p-2 rounded-full border border-border shadow-float flex items-center gap-2">
              <div className="flex items-center gap-2 pl-4 flex-1">
                <Search className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Cari proyek desain logo, web landing page, copy post..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full text-xs sm:text-sm text-dark-900 bg-transparent placeholder:text-muted/60 focus:outline-none font-sans"
                />
              </div>
              <Button variant="gradient" size="md" type="submit" className="shrink-0 text-xs sm:text-sm font-bold">
                Cari Proyek
              </Button>
            </form>

            {isUmkm && (
              <Link to="/projects/new">
                <Button
                  variant="brand"
                  size="lg"
                  className="w-full sm:w-auto text-xs sm:text-sm font-bold shadow-brand shrink-0"
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Buat Proyek
                </Button>
              </Link>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-normal">Total Saldo Dompet</span>
              <span className="text-base sm:text-lg font-bold font-sans text-brand-cyan">
                {formatCurrency(wallet?.saldo_aktif || 0)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">
                {isUmkm ? "Total Proyek Anda" : "Proyek Aktif Berjalan"}
              </span>
              <span className="text-base sm:text-lg font-bold font-sans text-white">
                {isUmkm ? `${latestProjects.length} Proyek` : `${myProposals.filter(p => p.status === "ACCEPTED").length} Proyek`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">Jaminan Keamanan</span>
              <span className="text-base sm:text-lg font-bold font-sans text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Escrow 100%
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">Status Akun</span>
              <span className="text-base sm:text-lg font-bold font-sans text-white flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-brand-cyan" /> {isUmkm ? "Klien Terverifikasi" : "Mahasiswa Aktif"}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MOST DEMANDING CATEGORIES (3-Column Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-surface p-7 sm:p-8 rounded-3xl border border-border shadow-xs">
            <div className="space-y-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-indigo-light text-brand-indigo text-[11px] font-bold tracking-wider uppercase border border-brand-indigo/15">
                Katalog Keahlian
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-dark-900 tracking-tight leading-snug">
                Kategori Proyek Paling Diminati.
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans font-normal">
                Pilih bidang spesialisasi yang paling banyak dibutuhkan pelaku UMKM untuk meningkatkan performa bisnis digital mereka.
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Link to="/projects">
                <Button variant="brand" size="md" className="w-full sm:w-auto text-xs font-bold shadow-brand">
                  <span>Lihat Semua Kategori</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3 relative rounded-3xl overflow-hidden min-h-[300px] border border-border shadow-xs group">
            <img
              src="/images/student-workspace.webp"
              alt="Mahasiswa Berkarya"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent flex flex-col justify-end p-6 text-white space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white w-fit border border-white/20">
                <GraduationCap className="w-3.5 h-3.5 text-brand-cyan" />
                Talenta Kampus Aktif
              </div>
              <h4 className="text-base font-bold font-sans">Ribuan Mahasiswa Siap Mengerjakan Proyek Anda</h4>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.code}
                code={cat.code}
                title={cat.title}
                projectCount={cat.count}
                onClick={() => navigate(`/projects?category=${cat.code}`)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-canvas border border-border rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <SectionHeader
            centered
            badgeText="Alur Pengerjaan"
            title={isUmkm ? "Bagaimana Klien UMKM Memasang Proyek?" : "Bagaimana Makarya Bekerja?"}
            subtitle={isUmkm 
              ? "Pasang proyek dalam 3 langkah mudah dengan perlindungan dana escrow." 
              : "Sistem micro-freelancing aman dan terstruktur mulai dari pendaftaran hingga honor cair."}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <HowItWorksStep
              stepNumber={1}
              iconName="escrow"
              isHighlight={true}
              title={isUmkm ? "1. Pasang Brief & Kunci Escrow" : "1. Daftar Akun Mahasiswa"}
              description={isUmkm 
                ? "Tentukan judul, kategori keahlian, dan maksimal budget wajar. Dana terkunci aman di escrow saat proposal diterima." 
                : "Gunakan email resmi institusi kampus (.ac.id) untuk verifikasi instan identitas mahasiswa."}
            />
            <HowItWorksStep
              stepNumber={2}
              iconName="work"
              title={isUmkm ? "2. Pilih Proposal Mahasiswa" : "2. Lamar & Ajukan Proposal"}
              description={isUmkm 
                ? "Tinjau proposal yang masuk dari mahasiswa bertalenta, periksa portofolio mereka, dan setujui penawaran terbaik." 
                : "Pilih proyek UMKM sesuai keahlian, tentukan harga tawar wajar dan estimasi hari pengerjaan."}
            />
            <HowItWorksStep
              stepNumber={3}
              iconName="complete"
              title={isUmkm ? "3. Review Hasil & Lepas Dana" : "3. Serahkan Hasil & Terima Honor"}
              description={isUmkm 
                ? "Periksa deliverable karya yang diserahkan. Setelah puas, klik setujui agar dana escrow diteruskan ke mahasiswa." 
                : "Unggah tautan deliverable. Setelah disetujui klien, dana escrow langsung cair ke saldo aktif Anda."}
            />
          </div>
        </div>
      </section>

      {/* 4. LATEST LIVE PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Peluang Baru"
          title="Proyek UMKM Terbuka Siap Dikerjakan"
          subtitle="Lamar sekarang sebelum kuota pelamar terpenuhi oleh mahasiswa lain."
          action={
            <Link to="/projects">
              <Button variant="primary" size="sm">Jelajah Semua Proyek</Button>
            </Link>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-surface rounded-card border border-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {latestProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* 5. TALENT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Komunitas Mahasiswa"
          title="Talenta Mahasiswa Unggulan"
          subtitle="Mahasiswa aktif dengan rekam jejak kerja berkualitas tinggi dan ulasan kepuasan prima dari UMKM."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTalents.map((talent, idx) => (
            <TalentCard
              key={idx}
              name={talent.name}
              prodi={talent.prodi}
              rating={talent.rating}
              totalJobs={talent.totalJobs}
              skills={talent.skills}
              
            />
          ))}
        </div>
      </section>

    </div>
  );
}
