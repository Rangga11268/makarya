import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi, proposalApi, walletApi, talentApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, daysRemaining } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";
import {
  Briefcase,
  Wallet as WalletIcon,
  PlusCircle,
  ArrowRight,
  Compass,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  Layers,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  FileText,
  AlertCircle,
  GraduationCap,
  Sparkles,
  Award,
  Users,
  FolderKanban,
  Star,
} from "lucide-react";

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
            .browse({ status: "OPEN", limit: 6 })
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
        <div className="h-24 bg-slate-200/70 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 bg-slate-200/60 rounded-3xl animate-pulse" />
          <div className="lg:col-span-4 h-96 bg-slate-200/60 rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const userDisplayName =
    user?.nama_lengkap ||
    user?.nama_usaha ||
    (user?.email ? user.email.split("@")[0] : "Rekan");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7 font-sans">
      {/* ========================================================================= */}
      {/* 1. FREELANCE WORKSPACE WELCOME HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
        <div className="flex items-center gap-4">
          <Link to="/profile" className="shrink-0 group">
            {user?.url_foto ? (
              <img
                src={user.url_foto}
                alt="Avatar"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-xs border border-slate-200 group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900 text-white text-base sm:text-lg font-bold flex items-center justify-center shadow-xs select-none group-hover:scale-105 transition-transform">
                {userDisplayName.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {isUmkm ? "Portal Klien UMKM" : "Portal Talenta Mahasiswa"}
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Terverifikasi Kampus
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Halo, {userDisplayName} 👋
            </h1>
            <p className="text-xs text-slate-500 line-clamp-1">
              {isUmkm
                ? "Kelola proses rekrutmen mahasiswa dan pantau penyelesaian deliverable usaha Anda."
                : "Temukan peluang proyek UMKM yang sesuai dengan keahlian dan kembangkan portofolio Anda."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {isUmkm ? (
            <Link to="/projects/new">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Pasang Proyek Baru</span>
              </button>
            </Link>
          ) : (
            <Link to="/projects">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Cari Proyek Tersedia</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ACTIVE CONTRACT WORKROOM BANNER (If Mahasiswa has an ongoing project) */}
      {/* ========================================================================= */}
      {!isUmkm && activeJob && (
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
              <Clock className="w-3 h-3" />
              <span>Proyek Sedang Dikerjakan</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {activeJob.project_judul || "Proyek Kolaborasi Aktif"}
            </h2>
            <p className="text-xs text-slate-300">
              Imbalan Escrow:{" "}
              <span className="font-bold text-emerald-300">
                {formatCurrency(activeJob.harga_tawar)}
              </span>{" "}
              • Estimasi: {activeJob.estimasi_hari} Hari
            </p>
          </div>

          <Link to={`/proposals/${activeJob.project_id}`} className="shrink-0">
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-sm transition-all cursor-pointer">
              <span>Buka Ruang Kerja & Obrolan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE TWO-COLUMN GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================== */}
        {/* LEFT COLUMN: OPPORTUNITIES FEED / HIRING PIPELINE (8 COLS) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {!isUmkm ? (
            /* --- MAHASISWA: MARKETPLACE JOB FEED --- */
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-indigo" />
                    <span>Peluang Proyek Terbaru untuk Anda</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Proyek terbuka dari mitra UMKM terverifikasi dengan jaminan
                    saldo escrow.
                  </p>
                </div>

                <Link
                  to="/projects"
                  className="text-xs font-bold text-brand-indigo hover:text-brand-indigo-dark flex items-center gap-1 shrink-0"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {openProjects.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Belum Ada Proyek Terbuka
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Proyek baru dari UMKM akan segera muncul di sini. Pantau
                    terus katalog proyek.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {openProjects.map((p) => {
                    const isTeam =
                      p.tipe_kolaborasi === "TIM" ||
                      (Array.isArray(p.slots) && p.slots.length > 1);
                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xs bg-slate-50/40 transition-all flex flex-col justify-between gap-3 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                              {p.kategori}
                            </span>
                            {isTeam ? (
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                                <Users className="w-3 h-3" /> Tim
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-500">
                                Individu
                              </span>
                            )}
                          </div>

                          <Link
                            to={`/projects/${p.id}`}
                            className="text-sm font-bold text-slate-900 group-hover:text-brand-indigo transition-colors line-clamp-2 block"
                          >
                            {p.judul}
                          </Link>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {p.deskripsi_raw ||
                              "Peluang proyek kolaborasi UMKM dengan ruang lingkup pengerjaan yang terstruktur."}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              Batas Honor
                            </span>
                            <span className="text-xs font-bold text-emerald-700">
                              {formatCurrency(p.budget_max)}
                            </span>
                          </div>

                          <Link to={`/projects/${p.id}`}>
                            <button className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-800 text-[11px] font-bold transition-colors cursor-pointer">
                              Lamar Proyek
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* --- UMKM: CLIENT HIRING & PROJECTS PIPELINE --- */
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-emerald-600" />
                    <span>Daftar Proyek & Pelamar Masuk</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pantau pengajuan lamaran mahasiswa dan status pengerjaan
                    tugas Anda.
                  </p>
                </div>

                <Link
                  to="/proposals"
                  className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1 shrink-0"
                >
                  <span>Papan Kerja Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {myProjects.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Belum Ada Proyek yang Dipasang
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Pasang kebutuhan desain, website, atau konten media sosial
                    Anda untuk menerima tawaran dari mahasiswa.
                  </p>
                  <Link to="/projects/new">
                    <button className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all mt-2 cursor-pointer inline-flex items-center gap-1.5">
                      <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pasang Proyek Pertama Anda</span>
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myProjects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                            {project.kategori}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {formatStatus(project.status)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {project.judul}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Alokasi Honor:{" "}
                          <span className="font-bold text-slate-800">
                            {formatCurrency(project.budget_max)}
                          </span>
                        </p>
                      </div>

                      <div className="pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex items-center justify-end shrink-0">
                        <Link to="/proposals">
                          <button className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer">
                            Kelola Pelamar →
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TALENT SPOTLIGHT (Shown for UMKM to discover students) */}
          {isUmkm && recommendedTalents.length > 0 && (
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-brand-indigo" />
                    <span>Rekomendasi Talenta Mahasiswa</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mahasiswa terverifikasi dengan ulasan dan reputasi tinggi.
                  </p>
                </div>
                <Link
                  to="/talents"
                  className="text-xs font-bold text-brand-indigo hover:text-brand-indigo-dark flex items-center gap-1"
                >
                  <span>Lihat Direktori</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {recommendedTalents.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/40 flex items-center justify-between gap-3"
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
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {t.nama_lengkap}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {t.prodi || "Mahasiswa"} • Smt {t.semester || 4}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] font-bold text-slate-700">
                            {t.rating_avg || 5.0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link to="/talents">
                      <button className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-700 text-[10px] font-bold transition-colors cursor-pointer shrink-0">
                        Profil
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: WALLET ESCROW & QUICK ACTION TILES (4 COLS) */}
        {/* ===================================================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Dompet & Escrow Honor */}
          <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <WalletIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Dompet & Escrow
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Rekening Transaksi Aman
                  </span>
                </div>
              </div>

              <Link
                to="/wallet"
                className="text-[11px] font-bold text-emerald-700 hover:underline"
              >
                Detail →
              </Link>
            </div>

            <div className="p-3.5 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Saldo Aktif</span>
                <span className="text-sm font-bold text-slate-900 tabular-nums">
                  Rp {formatCurrency(wallet?.saldo_aktif || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-xs text-slate-500">
                  Saldo Terproteksi Escrow
                </span>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  Rp {formatCurrency(wallet?.saldo_escrow || 0)}
                </span>
              </div>
            </div>

            <Link to="/wallet" className="block">
              <button className="w-full py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer">
                {isUmkm ? "Isi Saldo / Top Up" : "Pencairan Honor Bank"}
              </button>
            </Link>
          </div>

          {/* Card 2: Portofolio or Quick Hiring Actions */}
          {!isUmkm ? (
            <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Portofolio Karya Anda
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Daya Tarik untuk Klien UMKM
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Tampilkan hasil tugas kuliah, desain, atau aplikasi yang pernah
                Anda buat untuk memperbesar peluang diterima lamaran.
              </p>

              <Link to="/portfolio" className="block">
                <button className="w-full py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
                  Kelola Portofolio Karya
                </button>
              </Link>
            </div>
          ) : (
            <div className="p-5 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Garansi 100% Escrow
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Aman Bagi Pemilik Usaha
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Dana pembayaran ditahan di rekening penampungan Makarya dan
                hanya diteruskan ke mahasiswa setelah Anda menyetujui hasil
                deliverable.
              </p>

              <Link to="/talents" className="block">
                <button className="w-full py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer">
                  Cari Mahasiswa Sesuai Kategori
                </button>
              </Link>
            </div>
          )}

          {/* Card 3: Quick Guidelines & Escrow Rules */}
          <div className="p-4 bg-slate-50/60 border border-slate-200/60 rounded-2xl space-y-2 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 block">
              💡 Ketentuan Kolaborasi Kampus:
            </span>
            <ul className="space-y-1 list-disc list-inside">
              <li>Maksimal 2 kali revisi minor per deliverable.</li>
              <li>Batas honor proyek maksimal Rp 2.000.000.</li>
              <li>Komunikasi wajib dilakukan di ruang kerja resmi.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
