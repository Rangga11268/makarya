import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import {
  ProdiVectorIcon,
  CampusVectorIcon,
  AcademicStatusVectorIcon,
  GithubVectorIcon,
  FigmaVectorIcon,
  GlobeVectorIcon,
  LinkedinVectorIcon,
} from "../../components/icons/ProfileVectorIcons";
import {
  User,
  Building2,
  GraduationCap,
  Save,
  Link as LinkIcon,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Check,
  Plus,
  X,
  Star,
} from "lucide-react";

export function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const isUmkm = user?.role === "UMKM";

  // Form states for Mahasiswa
  const [mhsData, setMhsData] = useState({
    nama_lengkap: "Darell Rangga Putra",
    nim: "12210001",
    prodi: "Sistem Informasi",
    semester: 6,
    bio: "Mahasiswa aktif berfokus pada pengembangan produk digital & desain UI/UX solutif untuk UMKM.",
    github_url: "https://github.com/darell-rangga",
    figma_url: "https://figma.com/@darell_makarya",
    website_url: "https://darell.design",
    linkedin_url: "https://linkedin.com/in/darell-rangga",
    skills: [
      "UI/UX Design",
      "Figma",
      "React Native",
      "FastAPI",
      "Tailwind CSS",
    ],
    nama_bank: "Bank Central Asia (BCA)",
    nomor_rekening: "8270-3491-8821",
    nama_pemilik_rekening: "Darell Rangga Putra",
  });

  // Form states for UMKM
  const [umkmData, setUmkmData] = useState({
    nama_usaha: "Kedai Kopi Nusantara",
    bidang_industri: "F&B / Kuliner",
    kota: "Jakarta Selatan",
    alamat: "Jl. Margonda Raya No. 45, Beji",
    no_kontak: "081298765432",
    nama_bank: "Bank Central Asia (BCA)",
    nomor_rekening: "8270-3491-8821",
    nama_pemilik_rekening: "Kedai Kopi Nusantara",
  });

  const [newSkillInput, setNewSkillInput] = useState("");

  const prodiList = [
    "Sistem Informasi",
    "Desain Komunikasi Visual (DKV)",
    "Teknologi Informasi",
    "Informatika",
    "Rekayasa Perangkat Lunak",
    "Ilmu Komunikasi",
    "Manajemen Bisnis",
    "Akuntansi",
  ];

  const industriList = [
    "F&B / Kuliner",
    "Fashion & Tekstil",
    "Ritel & Toko Kelontong",
    "Jasa Kreatif & Percetakan",
    "Kecantikan & Skincare",
    "Otomotif & Bengkel",
    "Teknologi & Digital",
    "Agribisnis & Peternakan",
  ];

  useEffect(() => {
    async function loadProfile() {
      try {
        setFetching(true);
        const res = await authApi.getMe();
        if (res.data) {
          const d = res.data;
          if (isUmkm) {
            setUmkmData({
              nama_usaha: d.nama_usaha || "Kedai Kopi Nusantara",
              bidang_industri: d.bidang_industri || "F&B / Kuliner",
              kota: d.kota || "Jakarta Selatan",
              alamat: d.alamat || "",
              no_kontak: d.no_kontak || "081298765432",
              nama_bank: d.nama_bank || "Bank Central Asia (BCA)",
              nomor_rekening: d.nomor_rekening || "8270-3491-8821",
              nama_pemilik_rekening:
                d.nama_pemilik_rekening ||
                d.nama_usaha ||
                "Kedai Kopi Nusantara",
            });
          } else {
            setMhsData({
              nama_lengkap: d.nama_lengkap || "Darell Rangga Putra",
              nim: d.nim || "12210001",
              prodi: d.prodi || "Sistem Informasi",
              semester: d.semester || 6,
              bio:
                d.bio ||
                "Mahasiswa aktif berfokus pada pengembangan produk digital & desain UI/UX solutif untuk UMKM.",
              github_url: d.github_url || "",
              figma_url: d.figma_url || "",
              website_url: d.website_url || "",
              linkedin_url: d.linkedin_url || "",
              skills:
                Array.isArray(d.skills) && d.skills.length > 0
                  ? d.skills
                  : ["UI/UX Design", "Figma", "React Native", "FastAPI"],
              nama_bank: d.nama_bank || "Bank Central Asia (BCA)",
              nomor_rekening: d.nomor_rekening || "8270-3491-8821",
              nama_pemilik_rekening:
                d.nama_pemilik_rekening ||
                d.nama_lengkap ||
                "Darell Rangga Putra",
            });
          }
          if (updateUser) {
            updateUser(d);
          }
        }
      } catch (err) {
        // Fallback to initial state
      } finally {
        setFetching(false);
      }
    }
    loadProfile();
  }, [isUmkm]);

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const clean = newSkillInput.trim();
    if (!clean) return;
    if (mhsData.skills.includes(clean)) {
      addToast("Keahlian sudah ada dalam daftar", "info");
      return;
    }
    setMhsData((prev) => ({ ...prev, skills: [...prev.skills, clean] }));
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skill) => {
    setMhsData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = isUmkm
        ? {
            nama_usaha: umkmData.nama_usaha.trim(),
            bidang_industri: umkmData.bidang_industri.trim(),
            kota: umkmData.kota.trim(),
            alamat: umkmData.alamat.trim(),
            no_kontak: umkmData.no_kontak.trim(),
            nama_bank: umkmData.nama_bank.trim(),
            nomor_rekening: umkmData.nomor_rekening.trim(),
            nama_pemilik_rekening: umkmData.nama_pemilik_rekening.trim(),
          }
        : {
            nama_lengkap: mhsData.nama_lengkap.trim(),
            nim: mhsData.nim.trim(),
            prodi: mhsData.prodi.trim(),
            semester: parseInt(mhsData.semester, 10) || 6,
            bio: mhsData.bio.trim(),
            github_url: mhsData.github_url.trim(),
            figma_url: mhsData.figma_url.trim(),
            website_url: mhsData.website_url.trim(),
            linkedin_url: mhsData.linkedin_url.trim(),
            skills: mhsData.skills,
            nama_bank: mhsData.nama_bank.trim(),
            nomor_rekening: mhsData.nomor_rekening.trim(),
            nama_pemilik_rekening: mhsData.nama_pemilik_rekening.trim(),
          };

      const res = await authApi.updateProfile(payload);
      if (res?.data && updateUser) {
        updateUser(res.data);
      }
      addToast("Profil dan rekening pencairan berhasil disimpan!", "success");
    } catch (err) {
      addToast(
        err.response?.data?.detail || "Gagal menyimpan perubahan profil.",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenExternal = (rawUrl) => {
    if (!rawUrl || !rawUrl.trim()) {
      addToast("Tautan belum diisi. Masukkan URL terlebih dahulu.", "info");
      return;
    }
    let url = rawUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const initial = isUmkm
    ? umkmData.nama_usaha
      ? umkmData.nama_usaha.charAt(0).toUpperCase()
      : "U"
    : mhsData.nama_lengkap
      ? mhsData.nama_lengkap.charAt(0).toUpperCase()
      : "D";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
          Pengaturan Akun & Identitas
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-1 font-normal">
          Kelola Profil {isUmkm ? "Usaha UMKM" : "Talenta Mahasiswa"}
        </h1>
        <p className="text-xs sm:text-sm text-muted font-sans mt-1">
          {isUmkm
            ? user?.profil_subtitle ||
              "Lengkapi informasi usaha dan rekening pencairan Anda agar talenta mahasiswa dapat berkolaborasi secara aman."
            : user?.profil_subtitle ||
              "Profil talenta muda dengan rekam jejak deliverable memuaskan"}
        </p>
      </div>

      {/* Profile ID Card Banner */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div
          className={`w-20 h-20 rounded-full ${isUmkm ? "bg-brand-cyan text-slate-900" : "bg-brand-indigo text-white"} font-serif text-3xl font-bold flex items-center justify-center shrink-0 shadow-xs select-none`}
        >
          {initial}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-dark-900 font-sans">
              {isUmkm ? umkmData.nama_usaha : mhsData.nama_lengkap}
            </h2>
            <Badge variant={isUmkm ? "warning" : "brand"}>
              {isUmkm
                ? user?.status_badge || "Klien UMKM Terverifikasi"
                : user?.status_badge || "Mahasiswa Berprestasi & Terverifikasi"}
            </Badge>
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Terverifikasi Resmi
            </Badge>
          </div>

          <p className="text-xs text-muted flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>{user?.email}</span>
            <span>•</span>
            <span>
              {isUmkm
                ? `${umkmData.bidang_industri} • ${umkmData.kota}`
                : `${mhsData.prodi} • NIM ${mhsData.nim} • Semester ${mhsData.semester}`}
            </span>
          </p>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold text-lg sm:text-2xl font-serif">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-500" />
            <span>
              {user?.rating_avg != null
                ? Number(user.rating_avg).toFixed(1)
                : "-"}
            </span>
          </div>
          <span className="text-[11px] sm:text-xs text-muted font-sans mt-0.5 sm:mt-1 font-medium">
            Reputasi Skor{" "}
            {user?.total_ulasan > 0 ? `(${user.total_ulasan})` : ""}
          </span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-lg sm:text-2xl font-bold text-dark-900 font-serif">
            {!isUmkm
              ? (user?.total_proyek_selesai ?? 0)
              : (user?.total_proyek_diterbitkan ?? 0)}
          </span>
          <span className="text-[11px] sm:text-xs text-muted font-sans mt-0.5 sm:mt-1 font-medium">
            {!isUmkm ? "Proyek Tuntas" : "Proyek Diterbitkan"}
          </span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-lg sm:text-2xl font-bold text-emerald-600 font-serif">
            {user?.escrow_success_rate || "-"}
          </span>
          <span className="text-[11px] sm:text-xs text-muted font-sans mt-0.5 sm:mt-1 font-medium">
            Sukses Escrow
          </span>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* MAHASISWA FORM */}
        {!isUmkm ? (
          <>
            {/* 1. Kredensial Akademik & Biodata (Using authentic SVG vector icons) */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-border pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
                    <CampusVectorIcon size={20} className="text-brand-indigo" />
                    Kredensial Akademik & Biodata Mahasiswa
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Data identitas kampus untuk verifikasi resmi kredibilitas
                    mahasiswa di platform.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kampus Terakreditasi
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-indigo" />
                    Nama Lengkap Sesuai KTM
                  </label>
                  <input
                    type="text"
                    required
                    value={mhsData.nama_lengkap}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, nama_lengkap: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                    placeholder="Masukkan nama lengkap..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                    <AcademicStatusVectorIcon
                      size={16}
                      className="text-amber-500"
                    />
                    Nomor Induk Mahasiswa (NIM)
                  </label>
                  <input
                    type="text"
                    required
                    value={mhsData.nim}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, nim: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
                    placeholder="Contoh: 12210001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                    <ProdiVectorIcon size={16} className="text-sky-500" />
                    Program Studi & Jenjang
                  </label>
                  <select
                    value={mhsData.prodi}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, prodi: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo cursor-pointer"
                  >
                    {prodiList.map((p, idx) => (
                      <option key={idx} value={p}>
                        {p} (S1)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Semester Aktif
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    value={mhsData.semester}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, semester: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
                    placeholder="6"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-900">
                  Bio Singkat / Ringkasan Profesional
                </label>
                <textarea
                  rows={3}
                  value={mhsData.bio}
                  onChange={(e) =>
                    setMhsData({ ...mhsData, bio: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo leading-relaxed"
                  placeholder="Ceritakan keahlian utama, pengalaman project, atau minat pengerjaan Anda..."
                />
              </div>

              {/* Tag Keahlian (Skills) */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
                      Keahlian & Tag Spesialisasi Digital
                    </label>
                    <p className="text-[11px] text-muted mt-0.5">
                      Keahlian yang Anda kuasai untuk mencocokkan dengan proyek
                      UMKM.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      placeholder="Tambah skill..."
                      className="px-3 py-1 text-xs rounded-lg border border-border bg-canvas focus:outline-none focus:border-brand-indigo"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="p-1 px-2.5 rounded-lg bg-brand-indigo text-white text-xs font-bold hover:bg-brand-indigo-dark transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Tambah
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {mhsData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-brand-indigo hover:text-rose-600 font-bold ml-1 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* 2. Tautan Portofolio & Repositori Resmi (Vector SVG Icons) */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
                  <GlobeVectorIcon size={18} className="text-sky-500" />
                  Tautan Portofolio & Repositori Karya
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Tautan langsung ke portofolio online Anda yang dapat dibuka
                  oleh klien UMKM saat mengevaluasi proposal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* GitHub */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                      <GithubVectorIcon size={16} className="text-slate-800" />
                      Profil GitHub
                    </label>
                    {mhsData.github_url ? (
                      <button
                        type="button"
                        onClick={() => handleOpenExternal(mhsData.github_url)}
                        className="text-[11px] text-brand-indigo hover:underline flex items-center gap-0.5"
                      >
                        Buka Tautan <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : null}
                  </div>
                  <input
                    type="url"
                    value={mhsData.github_url}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, github_url: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
                    placeholder="https://github.com/username"
                  />
                </div>

                {/* Figma */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                      <FigmaVectorIcon size={16} />
                      Portofolio Desain Figma
                    </label>
                    {mhsData.figma_url ? (
                      <button
                        type="button"
                        onClick={() => handleOpenExternal(mhsData.figma_url)}
                        className="text-[11px] text-brand-indigo hover:underline flex items-center gap-0.5"
                      >
                        Buka Tautan <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : null}
                  </div>
                  <input
                    type="url"
                    value={mhsData.figma_url}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, figma_url: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
                    placeholder="https://figma.com/@username"
                  />
                </div>

                {/* Website Portfolio */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                      <GlobeVectorIcon size={16} className="text-sky-500" />
                      Website Portofolio Pribadi
                    </label>
                    {mhsData.website_url ? (
                      <button
                        type="button"
                        onClick={() => handleOpenExternal(mhsData.website_url)}
                        className="text-[11px] text-brand-indigo hover:underline flex items-center gap-0.5"
                      >
                        Buka Tautan <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : null}
                  </div>
                  <input
                    type="url"
                    value={mhsData.website_url}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, website_url: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
                    placeholder="https://portofolio-anda.com"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                      <LinkedinVectorIcon
                        size={16}
                        className="text-[#0A66C2]"
                      />
                      Profil LinkedIn
                    </label>
                    {mhsData.linkedin_url ? (
                      <button
                        type="button"
                        onClick={() => handleOpenExternal(mhsData.linkedin_url)}
                        className="text-[11px] text-brand-indigo hover:underline flex items-center gap-0.5"
                      >
                        Buka Tautan <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : null}
                  </div>
                  <input
                    type="url"
                    value={mhsData.linkedin_url}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, linkedin_url: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </Card>

            {/* 3. Rekening Pencairan Honor Bank */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-border pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-indigo" />
                    Rekening Pencairan Honor Terdaftar
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Saldo hasil penyelesaian proyek escrow akan dicairkan ke
                    rekening bank ini.
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                  <Check className="w-3 h-3" /> Rekening Terverifikasi
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    required
                    value={mhsData.nama_bank}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, nama_bank: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                    placeholder="Contoh: Bank Central Asia (BCA)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    required
                    value={mhsData.nomor_rekening}
                    onChange={(e) =>
                      setMhsData({ ...mhsData, nomor_rekening: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono font-bold"
                    placeholder="8270-3491-8821"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    required
                    value={mhsData.nama_pemilik_rekening}
                    onChange={(e) =>
                      setMhsData({
                        ...mhsData,
                        nama_pemilik_rekening: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                    placeholder="Contoh: Darell Rangga Putra"
                  />
                </div>
              </div>
            </Card>
          </>
        ) : (
          /* UMKM FORM */
          <>
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-indigo" />
                  Informasi Profil Usaha UMKM
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Data usaha Anda akan tampil pada rincian proyek untuk
                  meyakinkan mahasiswa bertalenta.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Nama Usaha / Toko / Merek
                  </label>
                  <input
                    type="text"
                    required
                    value={umkmData.nama_usaha}
                    onChange={(e) =>
                      setUmkmData({ ...umkmData, nama_usaha: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                    placeholder="Contoh: Kopi Nusantara Jaya"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Bidang Industri Usaha
                  </label>
                  <select
                    value={umkmData.bidang_industri}
                    onChange={(e) =>
                      setUmkmData({
                        ...umkmData,
                        bidang_industri: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo cursor-pointer"
                  >
                    {industriList.map((ind, idx) => (
                      <option key={idx} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-indigo" />
                    Kota / Wilayah Operasional
                  </label>
                  <input
                    type="text"
                    required
                    value={umkmData.kota}
                    onChange={(e) =>
                      setUmkmData({ ...umkmData, kota: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                    placeholder="Contoh: Jakarta Selatan, Bekasi, Depok"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-indigo" />
                    Nomor Kontak WhatsApp Usaha
                  </label>
                  <input
                    type="tel"
                    required
                    value={umkmData.no_kontak}
                    onChange={(e) =>
                      setUmkmData({ ...umkmData, no_kontak: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
                    placeholder="0812xxxxxxxx"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-900">
                  Alamat Lengkap Usaha
                </label>
                <textarea
                  rows={3}
                  value={umkmData.alamat}
                  onChange={(e) =>
                    setUmkmData({ ...umkmData, alamat: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo leading-relaxed"
                  placeholder="Alamat jalan, nomor ruko/outlet, kecamatan, dan provinsi..."
                />
              </div>
            </Card>

            {/* Rekening Pengembalian / Pencairan Dana UMKM */}
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-border pb-4">
                <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-indigo" />
                  Rekening Bank Pengembalian / Pencairan Saldo
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Digunakan jika ada refund proyek atau penarikan saldo aktif
                  usaha Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Nama Bank
                  </label>
                  <input
                    type="text"
                    required
                    value={umkmData.nama_bank}
                    onChange={(e) =>
                      setUmkmData({ ...umkmData, nama_bank: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                    placeholder="Contoh: Bank Central Asia (BCA)"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    required
                    value={umkmData.nomor_rekening}
                    onChange={(e) =>
                      setUmkmData({
                        ...umkmData,
                        nomor_rekening: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono font-bold"
                    placeholder="8270-3491-8821"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-dark-900">
                    Nama Pemilik Rekening
                  </label>
                  <input
                    type="text"
                    required
                    value={umkmData.nama_pemilik_rekening}
                    onChange={(e) =>
                      setUmkmData({
                        ...umkmData,
                        nama_pemilik_rekening: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                    placeholder="Contoh: Kedai Kopi Nusantara"
                  />
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="brand"
            size="lg"
            disabled={loading}
            className="text-xs sm:text-sm font-bold shadow-brand"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {loading ? "Menyimpan Perubahan..." : "Simpan Perubahan Profil"}
          </Button>
        </div>
      </form>
    </div>
  );
}
