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
  Wallet,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  Star,
  Building2,
  GraduationCap,
  Briefcase,
  Layers,
  FileCheck,
  Lock,
  Zap,
  Clock,
  Check,
  ChevronLeft,
  ExternalLink,
  Search,
} from "lucide-react";

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
  const [simulatedDeliverableStatus, setSimulatedDeliverableStatus] = useState("review"); // "review" | "approved" | "revision"

  // Interactive Testimonials Carousel State
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // Interactive FAQ State
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const resProj = await projectApi.getProjects();
        const pList = Array.isArray(resProj?.data?.data)
          ? resProj.data.data
          : Array.isArray(resProj?.data)
          ? resProj.data
          : [];
        setProjects(pList.slice(0, 4));
      } catch (err) {
        console.error("Failed loading projects:", err);
      } finally {
        setLoadingProjects(false);
      }

      try {
        const resTal = await talentApi.getTalents();
        const tList = Array.isArray(resTal?.data?.data)
          ? resTal.data.data
          : Array.isArray(resTal?.data)
          ? resTal.data
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
      tag: "LANGKAH 1",
      title: "Pasang Kebutuhan & Tentukan Formasi Tim",
      desc: "Unggah brief proyek digital Anda, pilih format pengerjaan Solo (1 Talenta) atau Tim Multidisiplin (UI/UX, Frontend, Backend) dengan pagu anggaran fleksibel.",
      badge: "Brief Cerdas & Multi-Role",
    },
    {
      id: "02",
      tag: "LANGKAH 2",
      title: "Review Portofolio Mahasiswa Terverifikasi",
      desc: "Terima proposal lengkap dari talenta kampus dengan reputasi terakreditasi, riwayat proyek terverifikasi, dan repository kode atau desain asli.",
      badge: "Verifikasi Kampus .ac.id",
    },
    {
      id: "03",
      tag: "LANGKAH 3",
      title: "Amankan Honor di Escrow & Mulai Kolaborasi",
      desc: "Dana honor proyek diamankan 100% dalam rekening penampungan resmi Makarya sebelum pengerjaan dimulai. Aman bagi UMKM dan menjamin kepastian bagi mahasiswa.",
      badge: "Garansi Escrow 100%",
    },
    {
      id: "04",
      tag: "LANGKAH 4",
      title: "Persetujuan Hasil Kerja & Pencairan Otomatis",
      desc: "Periksa deliverable milestone di Workroom interaktif. Berikan feedback revisi terstruktur atau setujui untuk mencairkan honor langsung ke rekening talenta.",
      badge: "Serah Terima & Payout Instan",
    },
  ];

  // Customer stories data
  const stories = [
    {
      quote:
        "“Makarya mempermudah kami mendapatkan website e-commerce dan desain kemasan kopi kelas profesional dengan anggaran UMKM. Tim mahasiswa yang kami rekrut sangat responsif dan sistem escrow memberikan rasa aman 100%.”",
      author: "Hendra Wijaya",
      role: "Owner, Kopi Kenangan Nusantara",
      metrics: [
        { label: "Peningkatan Penjualan", value: "3.5x" },
        { label: "Waktu Pengerjaan", value: "14 Hari" },
        { label: "Efisiensi Biaya", value: "65%" },
      ],
      tag: "F&B / Retail Brand",
    },
    {
      quote:
        "“Sebagai mahasiswa semester 6, Makarya memberi saya portofolio industri nyata dan penghasilan legal yang terlindungi. Kolaborasi dalam format tim multi-role terasa seperti bekerja di software house sesungguhnya.”",
      author: "Darell Radhitya",
      role: "Mahasiswa DKV & Frontend Developer, UI",
      metrics: [
        { label: "Proyek Selesai", value: "8 Proyek" },
        { label: "Rating Reputasi", value: "4.9/5.0" },
        { label: "Honor Diterima", value: "Rp 18Jt+" },
      ],
      tag: "Talenta Mahasiswa",
    },
    {
      quote:
        "“Proses rebranding batik kami berjalan mulus. Fitur revisi bertahap di Workroom membuat komunikasi dengan desainer sangat terarah tanpa ada miskomunikasi.”",
      author: "Siti Rahmawati",
      role: "Founder, Pesona Batik Pesisir",
      metrics: [
        { label: "Aset Digital Selesai", value: "24 Item" },
        { label: "Skor Kepuasan", value: "100%" },
        { label: "Revisi Tuntas", value: "2 Siklus" },
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
      a: "Tidak. UMKM membayar 100% sesuai nominal kesepakatan pagu proyek (0% potongan untuk klien UMKM). Platform Makarya menerapkan biaya pemeliharaan sistem hanya 5% yang dipotong secara transparan dari honor talenta saat pencairan sukses.",
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
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-brand-indigo/10 selection:text-brand-indigo overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & INTERACTIVE WORKFLOW CANVAS                             */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-20 lg:pt-14 lg:pb-28 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-brand-indigo/5 via-brand-cyan/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Announcement Pill */}
          <div className="flex justify-center mb-6">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm hover:border-brand-indigo/30 hover:shadow transition-all group"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700">
                Platform Kolaborasi Digital Terpercaya Mahasiswa & UMKM
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-brand-indigo group-hover:translate-x-0.5 transition-transform flex items-center">
                Jelajahi Proyek <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          </div>

          {/* Main Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Wujudkan Proyek Nyata,{" "}
              <span className="bg-gradient-to-r from-brand-indigo via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Kolaborasi Talenta Kampus
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Hubungkan pelaku usaha UMKM dengan mahasiswa bertalenta dalam
              proyek digital nyata, didukung sistem Rekening Escrow terjamin dan
              formasi tim multidisiplin.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  variant="brand"
                  onClick={() =>
                    navigate(user?.role === "UMKM" ? "/create-project" : "/projects")
                  }
                  className="w-full sm:w-auto font-bold px-7 py-3.5 shadow-lg shadow-brand-indigo/20 rounded-xl"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {user?.role === "UMKM"
                    ? "Buat Proyek Baru"
                    : "Cari Proyek Kolaborasi"}
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="brand"
                    onClick={() => navigate("/register?role=UMKM")}
                    className="w-full sm:w-auto font-bold px-7 py-3.5 shadow-lg shadow-brand-indigo/20 rounded-xl flex items-center justify-center"
                  >
                    <span>Mulai Pasang Proyek</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/register?role=MAHASISWA")}
                    className="w-full sm:w-auto font-semibold px-6 py-3.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    <GraduationCap className="w-4 h-4 mr-2 text-brand-indigo" />
                    Daftar Sebagai Mahasiswa
                  </Button>
                </>
              )}
            </div>

            {/* Trust Micro-Bullets */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Garansi Escrow 100% Aman
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                Pilihan Solo atau Tim Multi-Role
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-indigo" />
                Verifikasi Kampus .ac.id
              </span>
            </div>
          </div>

          {/* ================================================================= */}
          {/* INTERACTIVE WORKFLOW CANVAS CONTAINER (Axora Hero Mockup Style)   */}
          {/* ================================================================= */}
          <div className="relative mt-8 max-w-5xl mx-auto">
            {/* Ambient Shadow glow around canvas */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-60 pointer-events-none" />

            <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden">
              {/* Mockup Header Bar */}
              <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 ml-2 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    makarya.id / live-workroom-canvas
                  </span>
                </div>

                {/* Canvas Navigation Nodes */}
                <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-lg">
                  {[
                    { id: "brief", label: "1. Brief UMKM" },
                    { id: "team", label: "2. Formasi Tim" },
                    { id: "escrow", label: "3. Escrow Vault" },
                    { id: "workroom", label: "4. Deliverable" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveHeroNode(tab.id)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                        activeHeroNode === tab.id
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas Content Grid */}
              <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white to-slate-50/50">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left Column: Interactive Diagram Flow */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Workflow Kolaborasi Aktif
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Status: Berjalan Lancar
                      </span>
                    </div>

                    {/* Step 1: Brief Node */}
                    <div
                      onClick={() => setActiveHeroNode("brief")}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        activeHeroNode === "brief"
                          ? "bg-blue-50/70 border-blue-300 shadow-sm"
                          : "bg-white border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 font-bold text-xs">
                          01
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Pengembangan Website & Kemasan Kopi Kenangan
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Pagu Anggaran: Rp 2.500.000 | Kategori: UMKM Digital
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        Brief Disetujui
                      </span>
                    </div>

                    {/* Connecting Line */}
                    <div className="h-4 border-l-2 border-dashed border-slate-300 ml-7" />

                    {/* Step 2: Team Formation Node */}
                    <div
                      onClick={() => setActiveHeroNode("team")}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        activeHeroNode === "team"
                          ? "bg-indigo-50/70 border-indigo-300 shadow-sm ring-1 ring-indigo-200"
                          : "bg-white border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 font-bold text-xs">
                          02
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            Formasi Tim: 2 Mahasiswa Terpilih
                            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                              Proyek Tim
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Frontend Dev (Darell - UI) & UI/UX (Amanda - ITB)
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                        Tim Komplit
                      </span>
                    </div>

                    {/* Connecting Line */}
                    <div className="h-4 border-l-2 border-dashed border-slate-300 ml-7" />

                    {/* Step 3: Escrow Node */}
                    <div
                      onClick={() => setActiveHeroNode("escrow")}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        activeHeroNode === "escrow"
                          ? "bg-emerald-50/70 border-emerald-300 shadow-sm"
                          : "bg-white border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 font-bold text-xs">
                          03
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Escrow Vault Terenkripsi
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Dana Rp 2.500.000 diamankan di Rekening Bersama
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Diamankan
                      </span>
                    </div>

                    {/* Connecting Line */}
                    <div className="h-4 border-l-2 border-dashed border-slate-300 ml-7" />

                    {/* Step 4: Deliverable Node */}
                    <div
                      onClick={() => setActiveHeroNode("workroom")}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        activeHeroNode === "workroom"
                          ? "bg-cyan-50/70 border-cyan-300 shadow-sm"
                          : "bg-white border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-700 shrink-0 font-bold text-xs">
                          04
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            Milestone Deliverable Selesai
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Review hasil kerja, persetujuan 1-klik, dan pencairan honor
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
                        Siap Review
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Live Contextual Detail Inspector */}
                  <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200/90 shadow-sm">
                    {activeHeroNode === "brief" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-bold text-slate-900">
                            Detail Kebutuhan Proyek
                          </span>
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            ID #PRJ-8821
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed">
                          UMKM Kopi Kenangan Nusantara membutuhkan website landing page
                          modern beserta integrasi katalog menu online dan aset kemasan.
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg space-y-1 text-xs">
                          <div className="flex justify-between text-slate-600">
                            <span>Klien:</span>
                            <span className="font-semibold text-slate-900">
                              Hendra Wijaya (UMKM)
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Lokasi:</span>
                            <span className="font-semibold text-slate-900">
                              Bandung, Jawa Barat
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Batas Waktu:</span>
                            <span className="font-semibold text-slate-900">
                              14 Hari Kerja
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeHeroNode === "team" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-bold text-slate-900">
                            Formasi Slot Tim Aktif
                          </span>
                          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            2 Slot Terisi
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                Darell Radhitya
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Frontend Developer | UI (Smt 6)
                              </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-indigo-700">
                              Rp 1.500.000
                            </span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                Amanda Putri
                              </div>
                              <div className="text-[10px] text-slate-500">
                                UI/UX Designer | ITB (Smt 4)
                              </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-blue-700">
                              Rp 1.000.000
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeHeroNode === "escrow" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-bold text-slate-900">
                            Keamanan Escrow Invariant
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Terverifikasi Bank
                          </span>
                        </div>
                        <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Total Dana Disetor:</span>
                            <span className="font-bold text-slate-900 font-mono">
                              Rp 2.500.000
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Biaya Klien UMKM:</span>
                            <span className="font-bold text-emerald-700 font-mono">
                              Rp 0 (0% Bebas Biaya)
                            </span>
                          </div>
                          <div className="border-t border-emerald-200/60 pt-1.5 flex justify-between text-xs">
                            <span className="text-slate-600">Garansi Pengembalian:</span>
                            <span className="font-bold text-emerald-700">
                              100% Terlindungi
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 italic">
                          Dana aman di rekening penampungan dan tidak akan keluar tanpa persetujuan UMKM.
                        </p>
                      </div>
                    )}

                    {activeHeroNode === "workroom" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-bold text-slate-900">
                            Deliverable & Review
                          </span>
                          <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                            Milestone 1 Selesai
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1.5">
                          <div className="font-bold text-slate-900">
                            Tautan & Berkas Pengerjaan:
                          </div>
                          <div className="text-[11px] text-blue-600 underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> github.com/darell/kopi-kenangan-web
                          </div>
                          <div className="text-[11px] text-blue-600 underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" /> figma.com/file/branding-kopi-kenangan
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            className="flex-1 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Setujui & Cairkan
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CAMPUS PARTNER TICKER / LOGO RIBBON                                    */}
      {/* ========================================================================= */}
      <section className="py-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">
            Didukung Oleh Mahasiswa Berbakat Dari Berbagai Perguruan Tinggi Terkemuka
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600 text-xs sm:text-sm font-semibold">
            {campuses.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 hover:text-slate-900 transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-brand-indigo" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROOF ORBIT & ARCHITECTURE METRICS HUB                                 */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">
              EKOSISTEM DIGITAL MAKARYA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Platform Kolaborasi yang Memberi Hasil Nyata
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Infrastruktur terintegrasi yang menyatukan keamanan finansial,
              manajemen proyek kolaboratif, dan akurasi formasi tim kampus.
            </p>
          </div>

          {/* Interactive Orbit Center Visual */}
          <div className="relative max-w-3xl mx-auto mb-16 p-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="relative flex flex-col items-center justify-center text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-indigo to-blue-600 text-white flex items-center justify-center shadow-lg shadow-brand-indigo/30 mb-4 animate-bounce duration-1000">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Makarya Core Engine
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Sistem orkestrasi kontrak otomatis, pencairan escrow instan, dan kolaborasi talenta lintas kampus.
              </p>

              {/* Orbiting Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 w-full">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <Lock className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Escrow 100%</div>
                  <div className="text-[10px] text-slate-500">Rekening Terpisah</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Multi-Role Slot</div>
                  <div className="text-[10px] text-slate-500">Tim Terstruktur</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <GraduationCap className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Domain .ac.id</div>
                  <div className="text-[10px] text-slate-500">Verifikasi Resmi</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Workroom Live</div>
                  <div className="text-[10px] text-slate-500">Milestone Terukur</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Stat Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200/80 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                Rp 450Jt+
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Total Honor Diamankan
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200/80 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono">
                100%
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Garansi Keamanan Escrow
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200/80 text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-indigo font-mono">
                99.2%
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Penyelesaian Tepat Waktu
              </div>
            </div>
            <div className="p-6 bg-white rounded-xl border border-slate-200/80 text-center">
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
      {/* 4. INTERACTIVE "HOW IT WORKS" 4-STEP SHOWCASE (Axora Tabbed Style)        */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">
                CARA KERJA SEDERHANA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Dari Ide Hingga Hasil Kerja Tuntas
              </h2>
            </div>
            <p className="mt-3 md:mt-0 text-sm text-slate-500 max-w-md">
              Hanya 4 langkah mudah untuk merealisasikan proyek digital Anda bersama talenta mahasiswa terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Vertical Step Navigation List */}
            <div className="lg:col-span-5 space-y-3">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-800"
                        : "bg-white text-slate-800 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                          isActive
                            ? "bg-brand-indigo text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {step.tag}
                      </span>
                      <span
                        className={`text-xs font-mono font-bold ${
                          isActive ? "text-slate-400" : "text-slate-400"
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

            {/* Right Column: Dynamic Interactive Preview Pane */}
            <div className="lg:col-span-7 bg-[#0F172A] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl min-h-[420px] flex flex-col justify-between">
              {activeStep === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Langkah 1: Pengaturan Formasi Proyek
                    </span>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800">
                      Format Fleksibel
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Pilih Format Kolaborasi yang Sesuai Kebutuhan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                      <div className="text-sm font-bold text-white mb-1">
                        Proyek Solo (1 Talenta)
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Cocok untuk tugas spesifik seperti desain logo, foto produk, atau penulisan copywriting.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-600/60">
                      <div className="text-sm font-bold text-indigo-300 mb-1 flex items-center justify-between">
                        <span>Proyek Tim (Multi-Role)</span>
                        <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.2 rounded">
                          Populer
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Cocok untuk pembuatan aplikasi, website utuh, dan rebranding lengkap dengan tim terkoordinasi.
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-400">
                    💡 <span className="text-slate-200 font-semibold">Tips:</span> Anda dapat menentukan pagu anggaran terpisah untuk masing-masing peran (misal: UI/UX Rp 1Jt, Frontend Rp 1.5Jt).
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Langkah 2: Review Pelamar & Portofolio
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                      Terverifikasi Kampus
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Evaluasi Profil Akademik & Bukti Karya Asli
                  </h4>
                  <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white flex items-center justify-center font-bold">
                        DR
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          Darell Radhitya
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="text-xs text-slate-400">
                          Universitas Indonesia | Sistem Informasi (Semester 6)
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                        React.js
                      </span>
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                        Tailwind CSS
                      </span>
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                        Figma
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                        Rating: 4.9 (8 Selesai)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Langkah 3: Pengamanan Dana Escrow
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> 100% Terlindungi
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Dana Disimpan Aman Sebelum Pengerjaan Dimulai
                  </h4>
                  <div className="p-4 bg-emerald-950/30 border border-emerald-800/80 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Total Nominal Proyek:</span>
                      <span className="font-mono font-bold text-white">
                        Rp 2.500.000
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300">Status Rekening Bersama:</span>
                      <span className="font-bold text-emerald-400">
                        DIAMANKAN (Vault Mandiri)
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mahasiswa dapat bekerja dengan tenang mengetahui dana telah siap, sementara UMKM memiliki kendali penuh sebelum menyetujui hasil akhir.
                  </p>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Langkah 4: Serah Terima & Pencairan
                    </span>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800">
                      Pencairan Otomatis
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Persetujuan 1-Klik & Rating Dua Arah
                  </h4>
                  <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300">
                        Deliverable Akhir:
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        ✓ Siap Ditinjau
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
                        className="px-3 py-2 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
                      >
                        Minta Revisi
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step Navigation Dots Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeStep === idx
                          ? "w-8 bg-brand-indigo"
                          : "w-2 bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={activeStep === steps.length - 1}
                    onClick={() =>
                      setActiveStep((prev) =>
                        Math.min(steps.length - 1, prev + 1)
                      )
                    }
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
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
      {/* 5. HIGH-CONTRAST CORE FEATURES BENTO (Axora Dark Bento Style)             */}
      {/* ========================================================================= */}
      <section className="py-24 bg-[#090D16] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/80 uppercase tracking-wider">
              FITUR UNGGULAN
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-4">
              Dirancang untuk Kolaborasi Tanpa Hambatan
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Setiap komponen dibuat interaktif untuk memberikan transparansi dan kendali penuh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bento Card 1: Interactive Multi-Role Slot Selector */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#131B2E] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/60">
                    Multi-Role Architecture
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Formasi Tim Fleksibel Sesuai Kebutuhan
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Buka slot pengerjaan secara spesifik untuk spesialisasi UI/UX, Frontend, atau Backend dengan alokasi anggaran mandiri.
                </p>

                {/* Interactive Slot Toggle */}
                <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
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
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedSlotRole === role.id
                            ? "bg-indigo-600 text-white shadow"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
                    {selectedSlotRole === "uiux" && (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">Alokasi UI/UX</div>
                          <div className="text-[11px] text-slate-400">Figma Wireframe & Prototipe</div>
                        </div>
                        <span className="font-mono font-bold text-indigo-400">Rp 1.000.000</span>
                      </div>
                    )}
                    {selectedSlotRole === "frontend" && (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">Alokasi Frontend</div>
                          <div className="text-[11px] text-slate-400">React/Next.js Slicing & Responsive</div>
                        </div>
                        <span className="font-mono font-bold text-indigo-400">Rp 1.500.000</span>
                      </div>
                    )}
                    {selectedSlotRole === "backend" && (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">Alokasi Backend</div>
                          <div className="text-[11px] text-slate-400">REST API & Database Integration</div>
                        </div>
                        <span className="font-mono font-bold text-indigo-400">Rp 1.200.000</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Interactive Escrow Breakdown Slider */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#131B2E] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
                    Transparansi 100%
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Kalkulator Escrow Transparan
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Geser slider anggaran proyek untuk melihat kalkulasi pembagian dana secara transparan tanpa biaya tersembunyi.
                </p>

                {/* Interactive Slider & Breakdown */}
                <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">Anggaran Proyek:</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
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
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2 bg-slate-800/80 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Biaya UMKM:</span>
                      <span className="font-bold text-emerald-400">Rp 0 (0%)</span>
                    </div>
                    <div className="p-2 bg-slate-800/80 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Honor Bersih Talenta:</span>
                      <span className="font-bold text-white font-mono">
                        {formatCurrency(calcBudget * 0.95)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Interactive Workroom Deliverable Simulator */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#131B2E] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/60">
                    Smart Deliverable
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Workroom Milestone & Siklus Revisi
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Kelola serah terima hasil kerja secara bertahap dengan pelacakan revisi transparan dan proteksi auto-approval.
                </p>

                {/* Simulated Deliverable Interactive Box */}
                <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Status Deliverable Simulasi:
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        simulatedDeliverableStatus === "approved"
                          ? "bg-emerald-950 text-emerald-400"
                          : simulatedDeliverableStatus === "revision"
                          ? "bg-amber-950 text-amber-400"
                          : "bg-blue-950 text-blue-400"
                      }`}
                    >
                      {simulatedDeliverableStatus === "approved"
                        ? "✓ Honor Dicairkan"
                        : simulatedDeliverableStatus === "revision"
                        ? "Revisi Diajukan"
                        : "Menunggu Review"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSimulatedDeliverableStatus("approved")}
                      className="flex-1 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                    >
                      Klik Setujui
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulatedDeliverableStatus("revision")}
                      className="flex-1 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    >
                      Klik Minta Revisi
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Verified Identity & Digital Portfolio */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#131B2E] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/60">
                    Akreditasi Resmi
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Identitas Akademik & Portofolio Nyata
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Setiap talenta diverifikasi melalui NIM aktif dan email perguruan tinggi, terhubung langsung dengan repositori GitHub dan Figma asli.
                </p>

                <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verifikasi Domain Kampus .ac.id Valid</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Tautan Repositori GitHub & Figma Terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Rekam Jejak Penilaian Rating Dua Arah</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. LIVE EXPLORER (Projects & Talents Real Data Showcase)                   */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#FAFAFA] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">
                EXPLORE DIREKTORI LIVE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
                Peluang Kolaborasi Nyata Saat Ini
              </h2>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setExploreTab("projects")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  exploreTab === "projects"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Proyek UMKM Terbaru
              </button>
              <button
                type="button"
                onClick={() => setExploreTab("talents")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  exploreTab === "talents"
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Talenta Mahasiswa Unggulan
              </button>
            </div>
          </div>

          {/* Tab 1: Live Projects List */}
          {exploreTab === "projects" && (
            <div>
              {loadingProjects ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="h-48 bg-slate-200 animate-pulse rounded-2xl"
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
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                  Belum ada proyek terbuka saat ini.
                </div>
              )}

              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/projects")}
                  className="font-bold px-8 rounded-xl bg-white hover:bg-slate-50 border-slate-200"
                >
                  Jelajahi Semua Proyek <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Tab 2: Live Talents List */}
          {exploreTab === "talents" && (
            <div>
              {loadingTalents ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <div
                      key={n}
                      className="h-48 bg-slate-200 animate-pulse rounded-2xl"
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
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                  Belum ada profil talenta yang tersedia.
                </div>
              )}

              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/talents")}
                  className="font-bold px-8 rounded-xl bg-white hover:bg-slate-50 border-slate-200"
                >
                  Lihat Semua Talenta Mahasiswa <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TESTIMONIALS & CASE STUDIES (Axora Story Slider Style)                 */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">
              KISAH SUKSES KOLABORASI
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Dampak Nyata bagi Bisnis & Karier
            </h2>
          </div>

          <div className="relative p-6 sm:p-10 bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200/90 shadow-sm">
            <div className="space-y-6">
              <span className="inline-block text-[11px] font-bold text-brand-indigo bg-brand-indigo/10 px-3 py-1 rounded-full">
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

              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {stories[activeStoryIdx].author}
                  </div>
                  <div className="text-xs text-slate-500">
                    {stories[activeStoryIdx].role}
                  </div>
                </div>

                {/* Slider Indicators */}
                <div className="flex gap-2">
                  {stories.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStoryIdx(idx)}
                      className={`h-2 rounded-full transition-all ${
                        activeStoryIdx === idx
                          ? "w-8 bg-slate-900"
                          : "w-2 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE FAQ ACCORDION                                              */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#FAFAFA] border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">
              PERTANYAAN UMUM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Hal yang Sering Ditanyakan
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Pelajari selengkapnya tentang jaminan escrow, pembagian formasi tim, dan verifikasi kampus.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.q}
                    </span>
                    <span className="p-1 rounded-md bg-slate-100 text-slate-600 shrink-0">
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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
      {/* 9. BOTTOM CTA CONVERSION BANNER                                           */}
      {/* ========================================================================= */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-indigo/20 via-blue-600/20 to-cyan-500/20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Siap Memulai Kolaborasi Digital Hari Ini?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Pasang kebutuhan proyek UMKM Anda atau raih portofolio industri nyata dengan garansi keamanan transaksi escrow 100%.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="brand"
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto font-bold px-8 py-3.5 shadow-xl shadow-brand-indigo/30 rounded-xl"
            >
              Daftar Sekarang Gratis
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/projects")}
              className="w-full sm:w-auto font-semibold px-6 py-3.5 bg-slate-800/80 border-slate-700 text-white hover:bg-slate-800 rounded-xl"
            >
              Jelajahi Peluang Proyek
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
