import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projectApi } from "../../../api";
import { formatCurrency } from "../../../utils/formatCurrency";
import { Button } from "../../../components/ui/Button";
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Compass,
  Plus,
} from "lucide-react";
import { ProjectBriefVectorIcon } from "../../../components/icons/ProjectVectorIcon";

const FALLBACK_PROJECTS = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    judul: "Redesign Landing Page & Reservasi Meja Resto Kopi",
    deskripsi_raw:
      "Kami mencari mahasiswa desainer web & frontend untuk merombak tampilan landing page dan sistem reservasi meja digital agar lebih modern dan mobile friendly.",
    kategori: "PEMROGRAMAN",
    budget_max: 1500000,
    tipe_kolaborasi: "TIM",
    slots: [
      {
        id: "slot-1",
        nama_peran: "UI/UX Designer",
        alokasi_budget: 650000,
        status: "OPEN",
      },
      {
        id: "slot-2",
        nama_peran: "Frontend Developer",
        alokasi_budget: 850000,
        status: "OPEN",
      },
    ],
    umkm_nama: "Kopi Kenangan Nusantara",
    umkm_profile: {
      kota: "Jakarta Selatan",
      nama_usaha: "Kopi Kenangan Nusantara",
    },
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    judul: "Desain UI/UX Mobile App Kasir & Manajemen Stok UMKM",
    deskripsi_raw:
      "Dibutuhkan desain UI/UX untuk aplikasi kasir Android UMKM dengan alur transaksi cepat dan laporan inventaris harian.",
    kategori: "UIUX",
    budget_max: 1200000,
    tipe_kolaborasi: "INDIVIDU",
    umkm_nama: "Toko Sembako Berkah",
    umkm_profile: { kota: "Bandung", nama_usaha: "Toko Sembako Berkah" },
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    judul: "Branding Visual, Logo & Kemasan Produk Sambal Kemasan",
    deskripsi_raw:
      "Revitalisasi logo kemasan botol sambal dan pembuatan panduan warna brand untuk produk sambal tradisional rumahan.",
    kategori: "DESIGN",
    budget_max: 850000,
    tipe_kolaborasi: "INDIVIDU",
    umkm_nama: "Dapur Pedas Bu Ani",
    umkm_profile: { kota: "Surabaya", nama_usaha: "Dapur Pedas Bu Ani" },
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    judul: "Konten Video Reels & TikTok Promosi Produk Kerajinan Bambu",
    deskripsi_raw:
      "Produksi konten video kreatif berdurasi pendek untuk reels dan TikTok mempromosikan produk kerajinan bambu lokal.",
    kategori: "VIDEO",
    budget_max: 950000,
    tipe_kolaborasi: "INDIVIDU",
    umkm_nama: "Bambu Kriya Jogja",
    umkm_profile: { kota: "Yogyakarta", nama_usaha: "Bambu Kriya Jogja" },
  },
];

const getCategoryLabel = (cat) => {
  switch (cat) {
    case "DESIGN":
      return "Desain Grafis";
    case "UIUX":
      return "UI/UX Design";
    case "PEMROGRAMAN":
      return "Web & Coding";
    case "VIDEO":
      return "Video & Reels";
    case "COPYWRITING":
      return "Copywriting";
    case "ADMIN_DATA":
      return "Admin & Data";
    default:
      return cat || "Proyek Digital";
  }
};

export function WorkspaceEmptyRecommendations({ isUmkm = false }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await projectApi.getAll({ limit: 6, status: "OPEN" });
        const items = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.items)
            ? res.data.items
            : [];
        if (isMounted) {
          if (items.length > 0) {
            setProjects(items);
          } else {
            setProjects(FALLBACK_PROJECTS);
          }
        }
      } catch (e) {
        if (isMounted) {
          setProjects(FALLBACK_PROJECTS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecommendations();
    return () => {
      isMounted = false;
    };
  }, []);

  // State jika yang login adalah UMKM baru (belum ada proyek yang di-post)
  if (isUmkm) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-8 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-center text-brand-indigo mx-auto">
          <ProjectBriefVectorIcon
            size={28}
            className="w-7 h-7 text-brand-indigo"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-dark-900">
            Mulai Kolaborasi Pertama Bisnis Anda
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
            Ruang Kerja ini akan otomatis melacak milestone pengerjaan, berkas
            deliverable, dan percakapan langsung begitu Anda menyetujui proposal
            mahasiswa.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/projects/new" className="inline-block">
            <Button
              variant="primary"
              size="sm"
              className="gap-1.5 px-4 py-2 rounded-xl shadow-xs text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pasang Proyek Baru Sekarang</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Activation Hero Banner (Clean, elevated surface) */}
      <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  Ruang Kerja Baru
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[11px] text-muted">Mahasiswa</span>
              </div>
              <h2 className="text-lg font-bold text-dark-900 mt-0.5">
                Belum Ada Kontrak atau Lamaran Aktif
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl leading-relaxed">
                Ruang ini akan melacak jadwal kerja, kanban progres, dan
                pencairan honor 100% Escrow setelah lamaran Anda disetujui klien
                UMKM. Mulai langkah Anda dengan melamar salah satu peluang di
                bawah!
              </p>
            </div>
          </div>
          <div className="sm:self-center shrink-0">
            <Link to="/projects">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-xs font-bold rounded-2xl border-border hover:bg-dark-900 hover:text-white transition-all gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Buka Katalog Lengkap</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Recommendation Section Heading */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div>
          <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
            <span>Rekomendasi Proyek Terpilih</span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3" />
              <span>100% Escrow Aman</span>
            </span>
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Peluang kolaborasi terbuka yang dapat Anda lamar sekarang
          </p>
        </div>
      </div>

      {/* 3. Responsive Grid Container - Fits all screens, NO horizontal slider */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-surface rounded-3xl border border-border p-5 space-y-4 animate-pulse"
            >
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-5 bg-slate-200 rounded w-4/5" />
              <div className="h-10 bg-slate-100 rounded-2xl" />
              <div className="h-8 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.slice(0, 3).map((item) => {
            const isTeam =
              item.tipe_kolaborasi === "TIM" ||
              (Array.isArray(item.slots) && item.slots.length > 1);
            const clientName =
              item.umkm_nama ||
              item.umkm_profile?.nama_usaha ||
              item.client_name ||
              "Mitra UMKM";
            const clientCity = item.umkm_profile?.kota || "Indonesia";
            const clientPhoto =
              item.umkm_profile?.url_foto_usaha ||
              item.umkm_profile?.url_foto ||
              item.url_foto;

            return (
              <div
                key={item.id}
                className="w-full bg-surface rounded-3xl border border-border p-5 shadow-xs hover:border-dark-900/30 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Category & Collab Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-indigo bg-brand-indigo/10 px-2.5 py-1 rounded-lg">
                      {getCategoryLabel(item.kategori)}
                    </span>
                    {isTeam ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                        <Users className="w-3 h-3" />
                        <span>Tim</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-muted">
                        Individu
                      </span>
                    )}
                  </div>

                  {/* Project Title */}
                  <Link to={`/projects/${item.id}`} className="block">
                    <h4 className="text-sm font-bold text-dark-900 line-clamp-2 leading-snug group-hover:text-brand-indigo transition-colors min-h-[38px]">
                      {item.judul}
                    </h4>
                  </Link>

                  {/* Client Info */}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-canvas border border-border">
                    {clientPhoto ? (
                      <img
                        src={clientPhoto}
                        alt={clientName}
                        className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-dark-900 truncate">
                        {clientName}
                      </p>
                      <p className="text-[10px] text-muted truncate">
                        {clientCity}
                      </p>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-muted uppercase block">
                      Pagu Honor
                    </span>
                    <span className="text-sm sm:text-base font-black text-dark-900 tabular-nums">
                      {formatCurrency(item.budget_max)}
                    </span>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-3 border-t border-border">
                  <Link to={`/projects/${item.id}`} className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full py-2 rounded-xl text-xs font-bold text-dark-900 border-border bg-canvas group-hover:bg-dark-900 group-hover:text-white group-hover:border-dark-900 hover:bg-dark-900 hover:text-white hover:border-dark-900 transition-all flex items-center justify-between"
                    >
                      <span>Lihat & Ajukan Lamaran</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Bottom Explorer Link */}
      <div className="text-center pt-2">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-indigo hover:text-brand-indigo/80 bg-brand-indigo/5 hover:bg-brand-indigo/10 px-4 py-2 rounded-2xl transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Jelajahi Semua Proyek Terbuka di Katalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
