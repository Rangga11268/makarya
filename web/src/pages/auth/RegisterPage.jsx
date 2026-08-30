import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthArtwork } from "../../components/features/AuthArtwork";
import { 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    password: "",
    nim: "",
    prodi_id: 1,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const prodiOptions = [
    { id: 1, name: "Sistem Informasi" },
    { id: 2, name: "Teknologi Informasi" },
    { id: 3, name: "Informatika" },
    { id: 4, name: "Rekayasa Perangkat Lunak" },
    { id: 5, name: "Manajemen" },
    { id: 6, name: "Akuntansi" },
    { id: 7, name: "Ilmu Komunikasi" },
    { id: 8, name: "Desain Komunikasi Visual" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const emailClean = formData.email.trim().toLowerCase();
    if (!emailClean.endsWith(".ac.id") && !emailClean.endsWith(".edu")) {
      setError("Pendaftaran mahasiswa wajib menggunakan email kampus resmi (akhiran .ac.id atau .edu)");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.registerMhs({
        nama_lengkap: formData.nama_lengkap.trim(),
        email: emailClean,
        password: formData.password,
        nim: formData.nim.trim() || null,
        prodi_id: parseInt(formData.prodi_id, 10),
      });

      setAuth(res.data);
      addToast("Pendaftaran mahasiswa berhasil!", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal melakukan registrasi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch w-full max-w-5xl">
        
        {/* Left Column: Visual Artwork Banner */}
        <div className="lg:col-span-6 flex">
          <AuthArtwork
            headline="Daftar Sekali, Bangun Portofolio & Reputasi Nyata."
            subtext="Setiap proyek yang Anda selesaikan otomatis tercatat dalam portofolio digital terverifikasi dan siap dibagikan ke calon perekrut."
          />
        </div>

        {/* Right Column: Register Form */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="text-left space-y-2">
            <Link to="/" className="inline-block">
              <img 
                src="/logo.webp" 
                alt="Logo Makarya" 
                className="h-14 sm:h-16 w-auto object-contain mb-3"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight font-sans">
              Daftar Akun Mahasiswa
            </h1>
            <p className="text-xs sm:text-sm text-muted font-sans font-normal">
              Gunakan email kampus untuk verifikasi identitas mahasiswa aktif
            </p>
          </div>

          <Card className="p-6 sm:p-7 shadow-xs">
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-xl animate-in fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                  Nama Lengkap Mahasiswa
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="nama_lengkap"
                    placeholder="Contoh: Darell Rangga Putra"
                    value={formData.nama_lengkap}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                  Email Institusi Kampus (.ac.id)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="contoh: 12210001@ubsi.ac.id"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all font-sans"
                  />
                </div>
                <p className="text-[11px] text-muted">Domain wajib berakhiran <code className="font-bold text-dark-900">.ac.id</code> atau <code className="font-bold text-dark-900">.edu</code></p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                    NIM Mahasiswa
                  </label>
                  <input
                    name="nim"
                    placeholder="Contoh: 12210001"
                    value={formData.nim}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                    Program Studi
                  </label>
                  <select
                    name="prodi_id"
                    value={formData.prodi_id}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all font-sans"
                  >
                    {prodiOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                  Password Akun
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Minimal 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-muted hover:text-dark-900 absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                variant="brand"
                size="lg"
                type="submit"
                loading={loading}
                className="w-full text-sm font-bold shadow-brand mt-2"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border text-center text-xs text-muted font-sans">
              Sudah memiliki akun?{" "}
              <Link to="/login" className="font-bold text-brand-indigo hover:underline">
                Masuk di sini
              </Link>
            </div>
          </Card>

          <div className="flex items-center justify-center gap-2 text-xs text-muted font-medium font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verifikasi Kampus Resmi & Proteksi Escrow Terintegrasi</span>
          </div>
        </div>

      </div>
    </div>
  );
}