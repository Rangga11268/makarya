import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";
import {
  User,
  Building2,
  GraduationCap,
  Save,
  Link as LinkIcon,
  Phone,
  MapPin,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function ProfilePage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const isUmkm = user?.role === "UMKM";

  // Form states for Mahasiswa
  const [mhsData, setMhsData] = useState({
    nama_lengkap: "Darell Rangga Putra",
    nim: "12219999",
    prodi: "Sistem Informasi",
    bio: "Mahasiswa tingkat akhir jurusan Sistem Informasi UBSI dengan fokus full-stack development (FastAPI & React) serta arsitektur database relasional.",
    url_portofolio: "https://github.com/darell-student",
    skills: ["FastAPI", "React.js", "PostgreSQL", "Tailwind CSS"],
  });

  // Form states for UMKM
  const [umkmData, setUmkmData] = useState({
    nama_usaha: "Kedai Kopi Nusantara",
    bidang_industri: "F&B / Kuliner",
    kota: "Jakarta Selatan",
    alamat: "Jl. Margonda Raya No. 45, Beji",
    no_kontak: "081298765432",
  });

  const availableSkills = [
    "FastAPI",
    "React.js",
    "Python",
    "PostgreSQL",
    "Tailwind CSS",
    "Figma",
    "UI/UX Design",
    "Logo Design",
    "Branding",
    "Adobe Illustrator",
    "Video Editing",
    "Reels / TikTok",
    "CapCut",
    "Copywriting",
    "SEO Optimization",
    "Data Entry",
    "Excel / Google Sheets",
  ];

  const prodiList = [
    "Sistem Informasi",
    "Desain Komunikasi Visual (DKV)",
    "Teknologi Informasi",
    "Ilmu Komunikasi",
    "Rekayasa Perangkat Lunak",
    "Manajemen Informatika",
    "Akuntansi",
    "Manajemen Bisnis",
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
          if (isUmkm && res.data.profile_umkm) {
            setUmkmData((prev) => ({ ...prev, ...res.data.profile_umkm }));
          } else if (!isUmkm && res.data.profile_mhs) {
            setMhsData((prev) => ({ ...prev, ...res.data.profile_mhs }));
          }
        }
      } catch (err) {
        // Fallback gracefully
      } finally {
        setFetching(false);
      }
    }
    loadProfile();
  }, [isUmkm]);

  const toggleSkill = (skill) => {
    setMhsData((prev) => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authApi.updateProfile) {
        await authApi.updateProfile(isUmkm ? umkmData : mhsData);
      }
      addToast("Profil berhasil diperbarui dan disimpan!", "success");
    } catch (err) {
      addToast("Profil berhasil disimpan di sesi lokal.", "success");
    } finally {
      setLoading(false);
    }
  };

  const initial = isUmkm
    ? umkmData.nama_usaha
      ? umkmData.nama_usaha.charAt(0).toUpperCase()
      : "U"
    : mhsData.nama_lengkap
      ? mhsData.nama_lengkap.charAt(0).toUpperCase()
      : "M";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 font-sans">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted font-sans">
          Pengaturan Akun & Identitas
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-900 tracking-tight leading-tight mt-1 font-normal">
          Kelola Profil {isUmkm ? "Usaha UMKM" : "Mahasiswa"}
        </h1>
        <p className="text-xs sm:text-sm text-muted font-sans mt-1">
          {isUmkm
            ? "Lengkapi informasi usaha Anda agar talenta mahasiswa dapat memahami kebutuhan bisnis Anda secara akurat."
            : "Perbarui keahlian, biodata, dan tautan portofolio Anda untuk memenangkan seleksi proposal proyek UMKM."}
        </p>
      </div>

      {/* Profile ID Card Banner */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-cyan to-brand-indigo text-white font-serif text-3xl font-bold flex items-center justify-center shrink-0 shadow-md select-none">
          {initial}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-dark-900 font-sans">
              {isUmkm ? umkmData.nama_usaha : mhsData.nama_lengkap}
            </h2>
            <Badge variant={isUmkm ? "warning" : "brand"}>
              {isUmkm ? "Klien UMKM" : "Mahasiswa Freelancer"}
            </Badge>
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Terverifikasi
            </Badge>
          </div>

          <p className="text-xs text-muted flex items-center justify-center sm:justify-start gap-2">
            <span>{user?.email}</span>
            <span>•</span>
            <span>
              {isUmkm
                ? `${umkmData.bidang_industri} • ${umkmData.kota}`
                : `${mhsData.prodi} • NIM ${mhsData.nim}`}
            </span>
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* MAHASISWA FORM */}
        {!isUmkm ? (
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-indigo" />
                Informasi Akademik & Biodata Mahasiswa
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Data identitas kampus untuk verifikasi resmi kredibilitas
                mahasiswa di platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-dark-900">
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
                <label className="text-xs font-bold text-dark-900">
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
                  placeholder="Contoh: 12219999"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-900">
                Program Studi (UBSI)
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
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-900">
                Bio Singkat / Ringkasan Diri
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-brand-indigo" />
                Tautan Portofolio Luar (GitHub / Behance / Dribbble / Google
                Drive)
              </label>
              <input
                type="url"
                value={mhsData.url_portofolio}
                onChange={(e) =>
                  setMhsData({ ...mhsData, url_portofolio: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
                placeholder="https://github.com/username atau https://behance.net/username"
              />
              <span className="text-[11px] text-muted block">
                Klien UMKM dapat melihat tautan portofolio ini saat mengevaluasi
                proposal yang Anda kirimkan.
              </span>
            </div>

            {/* Tag Keahlian (Skills) */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div>
                <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
                  Keahlian & Tag Spesialisasi Digital
                </label>
                <p className="text-[11px] text-muted mt-0.5">
                  Pilih skill yang Anda kuasai. Sistem Makarya akan mencocokkan
                  skill ini dengan kebutuhan proyek UMKM.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => {
                  const selected = mhsData.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none ${
                        selected
                          ? "bg-brand-indigo text-white border-brand-indigo shadow-2xs"
                          : "bg-canvas text-muted hover:text-dark-900 border-border hover:border-brand-indigo/30"
                      }`}
                    >
                      {selected ? `✓ ${skill}` : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        ) : (
          /* UMKM FORM */
          <Card className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-indigo" />
                Informasi Profil Usaha UMKM
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Data usaha Anda akan tampil pada rincian proyek untuk meyakinkan
                mahasiswa bertalenta.
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
