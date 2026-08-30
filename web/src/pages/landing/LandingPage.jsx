import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { CategoryCard } from "../../components/features/CategoryCard";
import { HowItWorksStep } from "../../components/features/HowItWorksStep";
import { ProjectCard } from "../../components/features/ProjectCard";
import { TalentCard } from "../../components/features/TalentCard";
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Users, 
  Building2, 
  GraduationCap, 
  Lock, 
  PlusCircle,
  ArrowUpRight
} from "lucide-react";

export function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [latestProjects, setLatestProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    async function loadPublicData() {
      try {
        setLoading(true);
        const res = await projectApi.browse({ limit: 6 });
        setLatestProjects(res.data);
      } catch (err) {
        setLatestProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadPublicData();
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
      avatarUrl: "/images/talent-darell.webp"
    },
    { 
      name: "Adelia Putri", 
      prodi: "DKV • UBSI", 
      rating: 4.9, 
      totalJobs: 11, 
      skills: ["Figma", "Branding", "Logo Design", "Illustrator"],
      avatarUrl: "/images/talent-adelia.webp"
    },
    { 
      name: "Bima Arya", 
      prodi: "Teknologi Informasi • UBSI", 
      rating: 5.0, 
      totalJobs: 6, 
      skills: ["Landing Page", "Next.js", "WordPress", "SEO"],
      avatarUrl: "/images/talent-bima.webp"
    },
    { 
      name: "Siti Rahma", 
      prodi: "Ilmu Komunikasi • UBSI", 
      rating: 4.8, 
      totalJobs: 9, 
      skills: ["Copywriting", "Social Media", "Content Plan"],
      avatarUrl: "/images/talent-siti.webp"
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="bg-dark-900 text-white pt-12 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-indigo/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-8 text-center sm:text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-brand-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            Platform Micro-freelancing Mahasiswa & UMKM Terpercaya
          </div>

          <div className="max-w-4xl space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.1] text-white font-normal">
              Wujudkan Ambisi Digital UMKM Bersama Talenta Mahasiswa.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed font-normal">
              Hubungkan kebutuhan desain logo, website, konten video promosi, dan administrasi UMKM lokal dengan ribuan mahasiswa bertalenta. Aman, terjangkau, dan honor dilindungi 100% via sistem Escrow Holding.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl bg-surface p-2 rounded-full border border-border shadow-float flex items-center gap-2">
              <div className="flex items-center gap-2 pl-4 flex-1">
                <Search className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Cari proyek desain logo, website, video reels, copy post..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full text-xs sm:text-sm text-dark-900 bg-transparent placeholder:text-muted/60 focus:outline-none font-sans"
                />
              </div>
              <Button variant="gradient" size="md" type="submit" className="shrink-0 text-xs sm:text-sm font-bold">
                Cari Proyek
              </Button>
            </form>

            <Link to={isAuthenticated ? (user?.role === "UMKM" ? "/projects/new" : "/projects") : "/login"}>
              <Button
                variant="brand"
                size="lg"
                className="w-full sm:w-auto text-xs sm:text-sm font-bold shadow-brand shrink-0"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Pasang Proyek UMKM
              </Button>
            </Link>
          </div>

          {/* Key Trust Stats Bar */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-left">
            <div>
              <span className="text-slate-400 block font-normal">Jaminan Pembayaran</span>
              <span className="text-base sm:text-lg font-bold font-sans text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 100% Escrow Holding
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">Afiliasi Kampus</span>
              <span className="text-base sm:text-lg font-bold font-sans text-brand-cyan flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Terverifikasi .ac.id
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">Batas Anggaran Wajar</span>
              <span className="text-base sm:text-lg font-bold font-sans text-white">
                Maksimal Rp 2.000.000
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">Tingkat Kepuasan</span>
              <span className="text-base sm:text-lg font-bold font-sans text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 98.2% Sukses
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. MOST DEMANDING CATEGORIES (3-Column Layout Matching Dribbble Reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Editorial Headline & Context (3 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-surface p-7 sm:p-8 rounded-3xl border border-border shadow-xs">
            <div className="space-y-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-indigo-light text-brand-indigo text-[11px] font-bold tracking-wider uppercase border border-brand-indigo/15">
                Katalog Keahlian
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-dark-900 tracking-tight leading-snug">
                Kategori Proyek Paling Diminati.
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans font-normal">
                Pilih bidang spesialisasi yang paling banyak dibutuhkan pelaku UMKM untuk meningkatkan daya saing bisnis dan omset penjualan mereka.
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Link to="/projects">
                <Button variant="brand" size="md" className="w-full sm:w-auto text-xs font-bold shadow-brand">
                  <span>Jelajah Semua Kategori</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Middle Column: Featured Student Photography Card (3 cols) */}
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
              <h4 className="text-base font-bold font-sans">Ribuan Mahasiswa Siap Membantu Usaha Anda</h4>
              <p className="text-[11px] text-slate-300 font-normal">Karya profesional, harga bersahabat, terverifikasi resmi.</p>
            </div>
          </div>

          {/* Right Column: 2x3 Category Cards Grid (5 cols) */}
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

      {/* 3. HOW IT WORKS (Enhanced 3-Card Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-canvas border border-border rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <SectionHeader
            centered
            badgeText="Alur Pengerjaan Terpercaya"
            title="Bagaimana Makarya Melindungi Mahasiswa & UMKM?"
            subtitle="Sistem micro-freelancing aman, transparan, dan terukur mulai dari pembuatan brief hingga honor cair ke rekening."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <HowItWorksStep
              stepNumber={1}
              iconName="escrow"
              isHighlight={true}
              title="1. Pasang Brief & Kunci Escrow"
              description="Klien UMKM memasang rincian proyek. Saat proposal disepakati, dana otomatis dikunci aman di rekening penampung resmi Makarya."
            />
            <HowItWorksStep
              stepNumber={2}
              iconName="work"
              title="2. Mahasiswa Mengerjakan Karya"
              description="Mahasiswa kampus bertalenta mengerjakan pesanan sesuai kesepakatan deliverable, standar mutu, dan batas tenggat waktu."
            />
            <HowItWorksStep
              stepNumber={3}
              iconName="complete"
              title="3. Review Hasil & Dana Cair"
              description="Setelah klien memeriksa dan menyetujui hasil deliverable, dana escrow otomatis diteruskan langsung ke saldo aktif mahasiswa."
            />
          </div>
        </div>
      </section>

      {/* 4. LATEST LIVE PROJECTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Peluang Terbuka"
          title="Proyek UMKM Siap Dikerjakan"
          subtitle="Jelajahi berbagai proyek nyata dari pelaku UMKM lokal yang siap dikerjakan oleh mahasiswa."
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
            {latestProjects.slice(0, 6).map((project) => (
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
              avatarUrl={talent.avatarUrl}
            />
          ))}
        </div>
      </section>

      {/* 6. PRE-FOOTER CTA CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* UMKM Card */}
          <div className="bg-brand-indigo text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6 shadow-brand">
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">Untuk Pelaku Usaha UMKM</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal">Punya Kebutuhan Digital untuk Usaha Anda?</h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Dapatkan logo, kemasan, website, atau video promosi berkualitas tinggi dari mahasiswa kreatif dengan harga terjangkau dan garansi keamanan dana.
              </p>
            </div>
            <div className="relative z-10">
              <Link to="/login">
                <Button variant="gradient" size="lg" className="font-bold text-xs sm:text-sm">
                  <span>Pasang Kebutuhan Proyek</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mahasiswa Card */}
          <div className="bg-dark-900 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6 border border-border">
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">Untuk Mahasiswa Kreatif</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal">Ingin Menghasilkan dari Keahlian Kampus?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Bangun portofolio profesional nyata, bantu UMKM berkembang, dan dapatkan penghasilan tambahan yang aman terjamin via rekening bersama.
              </p>
            </div>
            <div className="relative z-10">
              <Link to="/register">
                <Button variant="brand" size="lg" className="font-bold text-xs sm:text-sm shadow-brand">
                  <span>Daftar sebagai Mahasiswa</span>
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
