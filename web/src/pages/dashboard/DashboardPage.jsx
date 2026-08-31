import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { projectApi, proposalApi, walletApi } from "../../api";
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

  const loadData = async () => {
    try {
      setLoading(true);
      if (isUmkm) {
        const [wRes, pRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          projectApi.getMyProjects().catch(() => ({ data: [] })),
        ]);
        setWallet(wRes.data);
        setMyProjects(pRes.data || []);
      } else {
        const [wRes, propRes, projRes] = await Promise.all([
          walletApi
            .getMe()
            .catch(() => ({ data: { saldo_aktif: 0, saldo_escrow: 0 } })),
          proposalApi.getMyProposals().catch(() => ({ data: [] })),
          projectApi
            .browse({ status: "OPEN", limit: 4 })
            .catch(() => ({ data: [] })),
        ]);
        setWallet(wRes.data);
        setMyProposals(propRes.data || []);
        setOpenProjects(projRes.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.role]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 font-sans">
        <div className="h-10 w-64 bg-slate-200 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-surface rounded-2xl border border-border animate-pulse"
            />
          ))}
        </div>
        <div className="h-96 bg-surface rounded-3xl border border-border animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* ========================================================================= */}
      {/* TOP WELCOME BANNER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-surface border border-border rounded-3xl shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-dark-900 text-white tracking-wider">
              {isUmkm ? "Ruang Kerja Klien UMKM" : "Ruang Kerja Mahasiswa"}
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Akun Terverifikasi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-dark-900 tracking-tight">
            Selamat Datang, {user?.email?.split("@")[0]}
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            {isUmkm
              ? "Pantau proyek aktif Anda, tinjau lamaran masuk dari mahasiswa, dan kelola saldo escrow."
              : "Pantau pengerjaan proyek aktif Anda, cek status proposal, dan tarik honor kerja."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isUmkm ? (
            <Link to="/projects/new">
              <Button
                variant="brand"
                size="md"
                className="text-xs font-bold shadow-brand"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Pasang Proyek Baru
              </Button>
            </Link>
          ) : (
            <Link to="/projects">
              <Button
                variant="brand"
                size="md"
                className="text-xs font-bold shadow-brand"
              >
                <Compass className="w-4 h-4 mr-1.5" />
                Jelajah Proyek Terbuka
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4-METRICS STATS ROW */}
      {/* ========================================================================= */}
      {isUmkm ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-surface border-border rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
              Total Proyek Anda
            </span>
            <div className="text-2xl sm:text-3xl font-black text-dark-900 font-sans">
              {myProjects.length}
            </div>
            <span className="text-[11px] text-muted block">
              Dipasang di platform
            </span>
          </Card>

          <Card className="p-5 bg-surface border-border rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
              Sedang Dikerjakan
            </span>
            <div className="text-2xl sm:text-3xl font-black text-brand-indigo font-sans">
              {myProjects.filter((p) => p.status === "IN_PROGRESS").length}
            </div>
            <span className="text-[11px] text-muted block">
              Oleh talenta mahasiswa
            </span>
          </Card>

          <Card className="p-5 bg-surface border-border rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
              Dana Escrow Terkunci
            </span>
            <div className="text-2xl sm:text-3xl font-black text-dark-900 font-sans">
              {formatCurrency(wallet?.saldo_escrow || 0)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Dijamin Sistem
            </span>
          </Card>

          <Card className="p-5 bg-surface border-border rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
              Saldo Aktif Dompet
            </span>
            <div className="text-2xl sm:text-3xl font-black text-dark-900 font-sans">
              {formatCurrency(wallet?.saldo_aktif || 0)}
            </div>
            <Link
              to="/wallet"
              className="text-[11px] text-brand-indigo font-bold hover:underline flex items-center gap-0.5"
            >
              Isi Saldo <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-surface border-border rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
              Proyek Aktif
            </span>
            <div className="text-2xl sm:text-3xl font-black text-brand-indigo font-sans">
              {myProposals.filter((p) => p.status === "ACCEPTED").length}
            </div>
            <span className="text-[11px] text-muted block">
              Sedang Anda kerjakan
            </span>
          </Card>

          <Card className="p-5 bg-surface border-border rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
              Lamaran Terkirim
            </span>
            <div className="text-2xl sm:text-3xl font-black text-dark-900 font-sans">
              {myProposals.length}
            </div>
            <span className="text-[11px] text-muted block">
              Total penawaran diajukan
            </span>
          </Card>

          <Card className="p-5 bg-surface border-border rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
              Saldo Honor Anda
            </span>
            <div className="text-2xl sm:text-3xl font-black text-dark-900 font-sans">
              {formatCurrency(wallet?.saldo_aktif || 0)}
            </div>
            <Link
              to="/wallet"
              className="text-[11px] text-brand-indigo font-bold hover:underline flex items-center gap-0.5"
            >
              Tarik Saldo <ArrowRight className="w-3 h-3" />
            </Link>
          </Card>

          <Card className="p-5 bg-surface border-border rounded-2xl shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider block">
              Proyek Selesai
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-sans">
              {myProposals.filter((p) => p.status === "COMPLETED").length}
            </div>
            <span className="text-[11px] text-muted block">
              Portofolio terverifikasi
            </span>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN TWO-COLUMN DASHBOARD SECTIONS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: ACTIVE PROJECTS / PROPOSALS (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-5 bg-surface border-border rounded-3xl shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-dark-900">
                  {isUmkm
                    ? "Proyek Terdaftar Anda"
                    : "Status Penawaran & Pengerjaan Anda"}
                </h3>
                <p className="text-xs text-muted">
                  {isUmkm
                    ? "Kelola proses seleksi mahasiswa dan pengawasan pengerjaan deliverable."
                    : "Pantau kemajuan lamaran dan proyek yang sedang Anda kerjakan."}
                </p>
              </div>

              <Link to="/proposals">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-bold text-dark-900"
                >
                  Buka Papan Kerja →
                </Button>
              </Link>
            </div>

            {isUmkm ? (
              myProjects.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-canvas border border-border flex items-center justify-center text-muted mx-auto">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-dark-900">
                    Belum Ada Proyek yang Dipasang
                  </h4>
                  <p className="text-xs text-muted max-w-sm mx-auto">
                    Mulai dengan memasang brief kebutuhan usaha Anda untuk
                    menerima penawaran dari mahasiswa.
                  </p>
                  <Link to="/projects/new">
                    <Button
                      variant="brand"
                      size="sm"
                      className="text-xs font-bold shadow-brand mt-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" /> Pasang Proyek
                      Pertama
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myProjects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="p-4 bg-canvas border border-border/80 hover:border-dark-900/30 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-surface border border-border text-dark-900">
                            {project.kategori}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-border bg-surface text-dark-900">
                            {formatStatus(project.status)}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-dark-900">
                          {project.judul}
                        </h4>
                        <span className="text-xs text-muted block">
                          Batas Anggaran:{" "}
                          <b className="text-dark-900">
                            {formatCurrency(project.budget_max)}
                          </b>
                        </span>
                      </div>

                      <Link to="/proposals" className="shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto text-xs font-bold text-dark-900"
                        >
                          Kelola Pelamar →
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )
            ) : myProposals.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-canvas border border-border flex items-center justify-center text-muted mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-dark-900">
                  Belum Ada Lamaran Diajukan
                </h4>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Jelajahi katalog proyek UMKM yang terbuka dan kirimkan
                  proposal terbaik Anda.
                </p>
                <Link to="/projects">
                  <Button
                    variant="brand"
                    size="sm"
                    className="text-xs font-bold shadow-brand mt-1"
                  >
                    <Compass className="w-3.5 h-3.5 mr-1" /> Jelajah Proyek
                    Sekarang
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myProposals.slice(0, 5).map((prop) => (
                  <div
                    key={prop.id}
                    className="p-4 bg-canvas border border-border/80 hover:border-dark-900/30 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-border bg-surface text-dark-900">
                          {formatStatus(prop.status)}
                        </span>
                        <span className="text-[11px] text-muted">
                          Estimasi: {prop.estimasi_hari} Hari
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-dark-900">
                        {prop.project_judul ||
                          `Lamaran Proyek #${prop.project_id?.slice(0, 8)}`}
                      </h4>
                      <span className="text-xs text-muted block">
                        Harga Tawar Anda:{" "}
                        <b className="text-dark-900">
                          {formatCurrency(prop.harga_tawar)}
                        </b>
                      </span>
                    </div>

                    <Link to="/proposals" className="shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto text-xs font-bold text-dark-900"
                      >
                        Lihat Detail Pengerjaan →
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: QUICK SHORTCUTS & RECENT OPENINGS (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Wallet Summary Card */}
          <Card className="p-6 space-y-4 bg-surface border-border rounded-3xl shadow-xs">
            <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider border-b border-border pb-2 flex items-center justify-between">
              <span>Ringkasan Dompet</span>
              <WalletIcon className="w-4 h-4 text-muted" />
            </h3>

            <div className="space-y-2">
              <div className="p-3 bg-canvas rounded-xl border border-border flex items-center justify-between text-xs">
                <span className="text-muted">Saldo Aktif:</span>
                <span className="font-extrabold text-dark-900 font-sans">
                  {formatCurrency(wallet?.saldo_aktif || 0)}
                </span>
              </div>
              <div className="p-3 bg-canvas rounded-xl border border-border flex items-center justify-between text-xs">
                <span className="text-muted">Dana Escrow Tertahan:</span>
                <span className="font-extrabold text-dark-900 font-sans">
                  {formatCurrency(wallet?.saldo_escrow || 0)}
                </span>
              </div>
            </div>

            <Link to="/wallet" className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold border-border text-dark-900"
              >
                Kelola Transaksi Dompet →
              </Button>
            </Link>
          </Card>

          {/* Quick Info & Recommendation */}
          {!isUmkm && openProjects.length > 0 && (
            <Card className="p-6 space-y-4 bg-surface border-border rounded-3xl shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                  Peluang Proyek Terbaru
                </h3>
                <Link
                  to="/projects"
                  className="text-[11px] font-bold text-brand-indigo hover:underline"
                >
                  Semua
                </Link>
              </div>

              <div className="space-y-3">
                {openProjects.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-canvas rounded-xl border border-border space-y-1"
                  >
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-surface border border-border text-dark-900">
                      {p.kategori}
                    </span>
                    <h4 className="text-xs font-bold text-dark-900 line-clamp-1">
                      {p.judul}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-muted font-bold font-sans">
                        {formatCurrency(p.budget_max)}
                      </span>
                      <Link
                        to={`/projects/${p.id}`}
                        className="font-bold text-brand-indigo hover:underline"
                      >
                        Lamar →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {isUmkm && (
            <div className="p-5 rounded-3xl bg-dark-900 text-white space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Jaminan Kemitraan Aman</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dana pembayaran Anda disimpan aman di Escrow dan baru akan
                diteruskan ke mahasiswa setelah Anda menyetujui hasil
                deliverable.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
