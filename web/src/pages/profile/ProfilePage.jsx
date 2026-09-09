import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { MahasiswaProfileForm } from "./components/MahasiswaProfileForm";
import { UmkmProfileForm } from "./components/UmkmProfileForm";
import { Save, CheckCircle2, Star, Camera, Loader2 } from "lucide-react";

export function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Harap pilih file gambar (JPG/PNG/WebP)", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast("Ukuran gambar maksimal 5MB", "error");
      return;
    }

    try {
      setUploadingPhoto(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Data = event.target.result;
          const res = await authApi.updateProfile({ photo_url: base64Data });
          if (res?.data) {
            updateUser(res.data);
            addToast("Foto profil berhasil diperbarui!", "success");
          }
        } catch (err) {
          console.error("Gagal mengunggah foto profil:", err);
          addToast("Gagal memperbarui foto profil. Coba lagi.", "error");
        } finally {
          setUploadingPhoto(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingPhoto(false);
      addToast("Gagal membaca file gambar.", "error");
    }
  };

  const isUmkm = user?.role === "UMKM";

  // Form states for Mahasiswa
  const [mhsData, setMhsData] = useState({
    nama_lengkap: user?.nama_lengkap || user?.nama || "",
    nim: user?.nim || "",
    prodi: user?.prodi || "",
    semester: user?.semester || "",
    bio: user?.bio || "",
    github_url: user?.github_url || "",
    figma_url: user?.figma_url || "",
    website_url: user?.website_url || "",
    linkedin_url: user?.linkedin_url || "",
    skills: Array.isArray(user?.skills) ? user.skills : [],
    nama_bank: user?.nama_bank || "",
    nomor_rekening: user?.nomor_rekening || "",
    nama_pemilik_rekening:
      user?.nama_pemilik_rekening || user?.nama_lengkap || user?.nama || "",
  });

  // Form states for UMKM
  const [umkmData, setUmkmData] = useState({
    nama_usaha: user?.nama_usaha || user?.nama || "",
    bidang_industri: user?.bidang_industri || "",
    kota: user?.kota || "",
    alamat: user?.alamat || "",
    no_kontak: user?.no_kontak || "",
    nama_bank: user?.nama_bank || "",
    nomor_rekening: user?.nomor_rekening || "",
    nama_pemilik_rekening:
      user?.nama_pemilik_rekening || user?.nama_usaha || user?.nama || "",
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
              nama_usaha: d.nama_usaha || "",
              bidang_industri: d.bidang_industri || "",
              kota: d.kota || "",
              alamat: d.alamat || "",
              no_kontak: d.no_kontak || "",
              nama_bank: d.nama_bank || "",
              nomor_rekening: d.nomor_rekening || "",
              nama_pemilik_rekening:
                d.nama_pemilik_rekening || d.nama_usaha || "",
            });
          } else {
            setMhsData({
              nama_lengkap: d.nama_lengkap || "",
              nim: d.nim || "",
              prodi: d.prodi || "",
              semester: d.semester || "",
              bio: d.bio || "",
              github_url: d.github_url || "",
              figma_url: d.figma_url || "",
              website_url: d.website_url || "",
              linkedin_url: d.linkedin_url || "",
              skills: Array.isArray(d.skills) ? d.skills : [],
              nama_bank: d.nama_bank || "",
              nomor_rekening: d.nomor_rekening || "",
              nama_pemilik_rekening:
                d.nama_pemilik_rekening || d.nama_lengkap || "",
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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-900 tracking-tight leading-tight mt-1">
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
          className="relative group cursor-pointer shrink-0"
          onClick={() => fileInputRef.current?.click()}
          title="Klik untuk mengubah foto profil"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {user?.url_foto ? (
            <img
              src={user.url_foto}
              alt="Foto Profil"
              className="w-20 h-20 rounded-full object-cover shadow-xs border-2 border-slate-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-dark-900 text-white text-3xl font-bold flex items-center justify-center shadow-xs select-none">
              {initial}
            </div>
          )}

          {/* Hover overlay with camera icon */}
          <div className="absolute inset-0 bg-black/45 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-0.5">Ubah</span>
          </div>

          {/* Uploading spinner */}
          {uploadingPhoto && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
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
        {!isUmkm ? (
          <MahasiswaProfileForm
            mhsData={mhsData}
            setMhsData={setMhsData}
            prodiList={prodiList}
            newSkillInput={newSkillInput}
            setNewSkillInput={setNewSkillInput}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
            handleOpenExternal={handleOpenExternal}
          />
        ) : (
          <UmkmProfileForm
            umkmData={umkmData}
            setUmkmData={setUmkmData}
            industriList={industriList}
          />
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
