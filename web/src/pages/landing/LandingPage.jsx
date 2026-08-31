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
  ArrowUpRight,
  TrendingUp,
  Award,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

export function LandingPage() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [latestProjects, setLatestProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

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
    { code: "DESIGN", title: "Desain Grafis & Kemasan", count: 2 },
    { code: "UIUX", title: "UI/UX & Desain Aplikasi", count: 2 },
    { code: "PEMROGRAMAN", title: "Website & Pemrograman", count: 2 },
    { code: "VIDEO", title: "Video Reels & Promosi", count: 2 },
    { code: "COPYWRITING", title: "Copywriting & Artikel SEO", count: 2 },
    { code: "ADMIN_DATA", title: "Admin & Pengolahan Data", count: 2 },
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
            Platform Micro-freelancing Mahasiswa & Solusi Digital UMKM
          </div>

          <div className="max-w-4xl space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.1] text-white font-normal">
              Solusi Digital UMKM dari Mahasiswa Berbakat, Aman dengan Rekening
              Bersama.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-sans max-w-2xl leading-relaxed font-normal">
              Dapatkan desain logo, kemasan produk, website landing page, dan
              konten video promosi berkualitas tanpa tarif mahal agency. Dana
              Anda aman terkunci di sistem Escrow hingga pekerjaan selesai dan
              Anda setujui.
            </p>
          </div>

          {/* Search Bar & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-2xl bg-surface p-2 rounded-full border border-border shadow-float flex items-center gap-2"
            >
              <div className="flex items-center gap-2 pl-4 flex-1">
                <Search className="w-4 h-4 text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Cari kebutuhan: desain logo, website toko, video reels, artikel..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full text-xs sm:text-sm text-dark-900 bg-transparent placeholder:text-muted/60 focus:outline-none font-sans"
                />
              </div>
              <Button
                variant="gradient"
                size="md"
                type="submit"
                className="shrink-0 text-xs sm:text-sm font-bold rounded-full"
              >
                Cari Proyek
              </Button>
            </form>

            <Link
              to={
                isAuthenticated
                  ? user?.role === "UMKM"
                    ? "/projects/new"
                    : "/projects"
                  : "/login"
              }
            >
              <Button
                variant="brand"
                size="lg"
                className="w-full sm:w-auto text-xs sm:text-sm font-bold shadow-brand shrink-0 rounded-full"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Pasang Proyek UMKM
              </Button>
            </Link>
          </div>

          {/* Key Trust Stats Bar */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-left">
            <div>
              <span className="text-slate-400 block font-normal">
                Jaminan Keamanan
              </span>
              <span className="text-base sm:text-lg font-bold font-sans text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 100% Proteksi Escrow
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">
                Identitas Terverifikasi
              </span>
              <span className="text-base sm:text-lg font-bold font-sans text-brand-cyan flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Email Kampus .ac.id
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">
                Pagu Anggaran Wajar
              </span>
              <span className="text-base sm:text-lg font-bold font-sans text-white">
                Maksimal Rp 2 Juta
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">
                Komisi Mahasiswa
              </span>
              <span className="text-base sm:text-lg font-bold font-sans text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 0% Potongan Honor
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MOST DEMANDING CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Editorial Headline */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-surface p-7 sm:p-8 rounded-3xl border border-border shadow-xs">
            <div className="space-y-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-indigo-light text-brand-indigo text-[11px] font-bold tracking-wider uppercase border border-brand-indigo/15">
                Katalog Keahlian
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-dark-900 tracking-tight leading-snug">
                Kategori Layanan Paling Dibutuhkan UMKM.
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans font-normal">
                Pilih spesialisasi yang tepat untuk memperkuat citra merek,
                menjangkau lebih banyak pelanggan, dan mendongkrak omset usaha
                Anda.
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Link to="/projects">
                <Button
                  variant="brand"
                  size="md"
                  className="w-full sm:w-auto text-xs font-bold shadow-brand rounded-full"
                >
                  <span>Jelajah Semua Kategori</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Middle Column: Featured Student Photography Card */}
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
              <h4 className="text-base font-bold font-sans">
                Ribuan Mahasiswa Siap Membantu Usaha Anda
              </h4>
              <p className="text-[11px] text-slate-300 font-normal">
                Karya profesional, harga bersahabat, terverifikasi resmi.
              </p>
            </div>
          </div>

          {/* Right Column: Category Cards Grid */}
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
            badgeText="Alur Transaksi Tanpa Cemas"
            title="Bagaimana Makarya Melindungi UMKM & Mahasiswa?"
            subtitle="Sistem rekening bersama otomatis menjamin keamanan dana klien dan kepastian pembayaran honor bagi mahasiswa."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <HowItWorksStep
              stepNumber={1}
              iconName="escrow"
              isHighlight={true}
              title="1. Pasang Brief & Kunci Dana"
              description="Klien UMKM menentukan kebutuhan dan anggaran. Saat proposal mahasiswa disetujui, dana otomatis diamankan di rekening penampung resmi Makarya."
            />
            <HowItWorksStep
              stepNumber={2}
              iconName="work"
              title="2. Mahasiswa Mengerjakan Karya"
              description="Mahasiswa mengerjakan pesanan dengan tenang karena honor sudah terjamin di awal, sesuai batas waktu dan instruksi brief."
            />
            <HowItWorksStep
              stepNumber={3}
              iconName="complete"
              title="3. Periksa Hasil & Cairkan Honor"
              description="Klien menerima dan memeriksa berkas pengerjaan. Setelah disetujui, dana langsung dicairkan utuh ke dompet saldo mahasiswa."
            />
          </div>
        </div>
      </section>

      {/* 4. LATEST LIVE PROJECTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="Peluang Terbaru"
          title="Proyek UMKM Siap Dikerjakan"
          subtitle="Tinjau kebutuhan digital terbaru dari pemilik usaha lokal dan ajukan penawaran terbaik Anda."
          action={
            <Link to="/projects">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold rounded-full"
              >
                Lihat Semua Proyek
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          }
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 bg-surface rounded-card border border-border animate-pulse"
              />
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
          badgeText="Talenta Kampus Teruji"
          title="Mahasiswa Berprestasi & Terverifikasi"
          subtitle="Profil talenta muda dengan rekam jejak deliverable memuaskan dan portofolio karya nyata."
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

      {/* 6. PERTANYAAN UMUM (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <SectionHeader
          centered
          badgeText="Pusat Informasi & Bantuan"
          title="Pertanyaan yang Sering Diajukan"
          subtitle="Pelajari bagaimana sistem rekening bersama (Escrow) dan standar mutu Makarya melindungi Anda."
        />

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
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-canvas/50 transition-colors"
                >
                  <span className="text-sm font-bold text-dark-900 flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-indigo shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-brand-indigo" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-muted leading-relaxed border-t border-border/50 bg-canvas/30 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. PRE-FOOTER DUAL CTA CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UMKM Card */}
          <div className="bg-brand-indigo text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6 shadow-brand">
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
                Untuk Pelaku Usaha UMKM
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal">
                Tingkatkan Citra Usaha Anda Tanpa Biaya Mahal Agency.
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                Dapatkan logo, kemasan produk, website responsif, atau video
                promosi dari mahasiswa kreatif dengan harga terjangkau dan
                jaminan dana aman 100%.
              </p>
            </div>
            <div className="relative z-10">
              <Link to="/login">
                <Button
                  variant="gradient"
                  size="lg"
                  className="font-bold text-xs sm:text-sm rounded-full"
                >
                  <span>Pasang Kebutuhan Proyek</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mahasiswa Card */}
          <div className="bg-dark-900 text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between space-y-6 border border-border">
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
                Untuk Mahasiswa Bertalenta
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-normal">
                Ubah Keterampilan Kampus Menjadi Penghasilan & Portofolio.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Bantu UMKM lokal bertumbuh, dapatkan bayaran utuh tanpa potongan
                komisi, dan otomatis miliki portofolio profesional untuk melamar
                kerja.
              </p>
            </div>
            <div className="relative z-10">
              <Link to="/register">
                <Button
                  variant="brand"
                  size="lg"
                  className="font-bold text-xs sm:text-sm shadow-brand rounded-full"
                >
                  <span>Daftar Akun Mahasiswa</span>
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
