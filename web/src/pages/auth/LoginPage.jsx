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
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  UserCheck, 
  ArrowRight,
  GraduationCap
} from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const res = await authApi.login({ email: email.trim(), password });
      setAuth(res.data);
      addToast(`Selamat datang kembali!`, "success");

      if (res.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Email atau password salah.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillTestAccount = (testEmail, testPass = "password123") => {
    setEmail(testEmail);
    setPassword(testPass);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch w-full max-w-5xl">
        
        {/* Left Column: Visual Artwork & Social Proof Banner */}
        <div className="lg:col-span-6 flex">
          <AuthArtwork
            headline="Kembangkan Karir Freelance Nyata Sejak Masa Kuliah."
            subtext="Makarya menghubungkan keahlian digital mahasiswa dengan ribuan UMKM yang siap membayar secara adil dan aman."
          />
        </div>

        {/* Right Column: Clean Form Container */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="text-left space-y-2">
            <Link to="/" className="inline-block">
              <img 
                src="/logoMakarya-noBGpng.png" 
                alt="Logo Makarya" 
                className="h-14 sm:h-16 w-auto object-contain mb-3"
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight font-sans">
              Masuk ke Akun Anda
            </h1>
            <p className="text-xs sm:text-sm text-muted font-sans font-normal">
              Akses dashboard proyek, proposal, dan dompet pencairan dana escrow
            </p>
          </div>

          {/* Quick Fill Test Accounts Chips */}
          <div className="p-3.5 bg-canvas border border-border rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-dark-900 flex items-center gap-1.5 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
                Pilih Akun Uji Coba Cepat:
              </span>
              <span className="text-[10px] text-muted">Password: password123</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => fillTestAccount("darell@ubsi.ac.id")}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-brand-indigo hover:text-white text-dark-900 text-xs font-semibold border border-border transition-all flex items-center gap-1"
              >
                <GraduationCap className="w-3 h-3 text-brand-indigo" />
                Mahasiswa (Darell)
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount("admin@makarya.id")}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-dark-900 hover:text-white text-dark-900 text-xs font-semibold border border-border transition-all flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-rose-600" />
                Admin Platform
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount("kopi.nusantara@gmail.com")}
                className="px-2.5 py-1 rounded-full bg-surface hover:bg-emerald-700 hover:text-white text-dark-900 text-xs font-semibold border border-border transition-all flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3 text-emerald-600" />
                Klien UMKM (Kopi)
              </button>
            </div>
          </div>

          <Card className="p-6 sm:p-7 shadow-xs">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-xl animate-in fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                  Email Akun / Kampus
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="nama@kampus.ac.id atau email UMKM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border text-center text-xs text-muted font-sans">
              Belum memiliki akun mahasiswa?{" "}
              <Link to="/register" className="font-bold text-brand-indigo hover:underline">
                Daftar Mahasiswa (.ac.id)
              </Link>
            </div>
          </Card>

          {/* Security Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted font-medium font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garansi Rekening Bersama (Escrow) & Keamanan Data OWASP Top 10</span>
          </div>
        </div>

      </div>
    </div>
  );
}