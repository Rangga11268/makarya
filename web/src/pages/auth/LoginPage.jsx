import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { AuthArtwork } from "../../components/features/AuthArtwork";
import { GoogleVectorIcon } from "../../components/icons/ProfileVectorIcons";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  UserCheck,
  ArrowRight,
  GraduationCap,
  KeyRound,
  CheckCircle2,
  X,
} from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Forgot Password Modal States
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP & New Pass
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState(null);

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
      const msg =
        err.response?.data?.detail ||
        (err.message === "Network Error" || !err.response
          ? "Gagal terhubung ke backend (Network Error). Pastikan server backend aktif di port 8000."
          : "Email atau password salah.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const googleMock = {
        email: "darell.google@ubsi.ac.id",
        name: "Darell Rangga (Google)",
        role: "MHS",
      };
      const res = await authApi.googleAuth(googleMock);
      setAuth(res.data);
      addToast("Berhasil masuk melalui Akun Google!", "success");
      navigate("/dashboard");
    } catch (err) {
      addToast(
        err.response?.data?.detail || "Gagal masuk dengan Google",
        "danger",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError("Harap masukkan email Anda");
      return;
    }
    try {
      setForgotLoading(true);
      setForgotError(null);
      await authApi.forgotPassword({ email: forgotEmail.trim() });
      addToast("Kode OTP reset password telah dikirim ke email!", "success");
      setForgotStep(2);
    } catch (err) {
      setForgotError(
        err.response?.data?.detail || "Email tidak terdaftar di sistem",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotOtp.trim() || forgotOtp.trim().length !== 6) {
      setForgotError("Kode OTP harus terdiri dari 6 digit angka");
      return;
    }
    if (forgotNewPass.length < 8) {
      setForgotError("Password baru minimal 8 karakter");
      return;
    }
    try {
      setForgotLoading(true);
      setForgotError(null);
      await authApi.resetPassword({
        email: forgotEmail.trim(),
        otp_code: forgotOtp.trim(),
        new_password: forgotNewPass,
      });
      addToast(
        "Password berhasil diubah! Silakan masuk dengan password baru.",
        "success",
      );
      setForgotModalOpen(false);
      setEmail(forgotEmail.trim());
      setForgotStep(1);
      setForgotOtp("");
      setForgotNewPass("");
    } catch (err) {
      setForgotError(
        err.response?.data?.detail || "Kode OTP salah atau telah kedaluwarsa",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  const fillTestAccount = (testEmail, testPass = "password123") => {
    setEmail(testEmail);
    setPassword(testPass);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col justify-between">
      {/* 1. TOP CURVED HERO IMAGE & BRAND FRAME */}
      <div className="relative w-full bg-dark-900 text-white pt-10 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[36px] sm:rounded-b-[56px] border-b border-border shadow-md">
        {/* Background Ambient Glow & Visual */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <img
            src="/images/login_hero.jpg"
            alt="Makarya Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/40 via-dark-900/75 to-dark-900" />
        </div>

        <div className="max-w-xl mx-auto relative z-10 text-center space-y-3.5">
          <Link to="/" className="inline-block group">
            <img
              src="/logo.webp"
              alt="Logo Makarya"
              className="h-10 sm:h-12 w-auto object-contain mx-auto transition-transform group-hover:scale-105 brightness-0 invert"
            />
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-bold border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Platform Kolaborasi Kampus & UMKM Terverifikasi</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
            Masuk ke Akun Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
            Akses dashboard proyek, pantau proposal kerja, dan kelola saldo rekening bersama escrow aman.
          </p>
        </div>
      </div>

      {/* 2. ELEVATED BOTTOM SHEET FORM CARD (Overlapping Hero) */}
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-20 pb-12">
        {/* Form Card */}
        <Card className="p-6 sm:p-8 bg-surface rounded-3xl border border-border shadow-float space-y-5">
          {/* Quick Fill Test Accounts Bar (Flat & Minimalist inside card) */}
          <div className="space-y-2 pb-4 border-b border-border/70">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-brand-indigo" />
                Akses Uji Coba Cepat:
              </span>
              <span className="text-[11px] text-muted font-mono">
                Sandi: password123
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillTestAccount("darell@ubsi.ac.id")}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  email === "darell@ubsi.ac.id"
                    ? "bg-brand-indigo text-white border-brand-indigo shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="truncate">Mahasiswa</span>
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount("kopi.nusantara@gmail.com")}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  email === "kopi.nusantara@gmail.com"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="truncate">Klien UMKM</span>
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount("admin@makarya.id")}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                  email === "admin@makarya.id"
                    ? "bg-dark-900 text-white border-dark-900 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span className="truncate">Admin</span>
              </button>
            </div>
          </div>

          {/* Google OAuth Direct Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-surface hover:bg-slate-50 text-dark-900 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 shadow-2xs transition-all cursor-pointer"
          >
            <GoogleVectorIcon size={18} />
            <span>Masuk dengan Akun Google</span>
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-3 text-muted font-medium">
                Atau masuk dengan email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-xl animate-in fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-sans">
                Email Akun / Kampus
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Contoh: darell@ubsi.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/15 rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none transition-all font-sans"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider font-sans">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotStep(1);
                    setForgotError(null);
                    setForgotModalOpen(true);
                  }}
                  className="text-xs text-brand-indigo hover:underline font-semibold"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi akun Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 focus:bg-white border border-slate-200 focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/15 rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-muted hover:text-dark-900 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              variant="brand"
              size="lg"
              type="submit"
              loading={loading}
              className="w-full text-sm font-bold shadow-brand mt-2 justify-center"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border text-center text-xs text-muted font-sans">
            Belum memiliki akun Makarya?{" "}
            <Link
              to="/register"
              className="font-bold text-brand-indigo hover:underline"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </Card>

        {/* Security Trust Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted font-medium font-sans text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Garansi Rekening Bersama (Escrow) & Keamanan Data OWASP Top 10
          </span>
        </div>
      </div>

      {/* MODAL LUPA PASSWORD (FORGOT PASSWORD & RESET OTP) */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title={
          forgotStep === 1 ? "Lupa Kata Sandi" : "Verifikasi OTP & Sandi Baru"
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-muted">
            {forgotStep === 1
              ? "Masukkan email akun Anda. Kami akan mengirimkan 6 digit kode OTP verifikasi."
              : `Masukkan kode 6 digit OTP yang dikirim ke ${forgotEmail} dan kata sandi baru Anda.`}
          </p>

          {forgotError && (
            <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
              {forgotError}
            </div>
          )}

          {forgotStep === 1 ? (
            <form onSubmit={handleSendForgotOtp} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-dark-900">
                  Email Akun
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="nama@kampus.ac.id atau email UMKM"
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-canvas focus:outline-none focus:border-brand-indigo font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setForgotModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="brand"
                  size="md"
                  loading={forgotLoading}
                >
                  Kirim Kode OTP
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-dark-900">
                  Kode OTP (6 Digit)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={forgotOtp}
                  onChange={(e) =>
                    setForgotOtp(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Contoh: 123456"
                  className="w-full px-4 py-2.5 text-center tracking-widest text-lg font-mono font-bold border border-border rounded-xl bg-canvas focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-dark-900">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={forgotNewPass}
                  onChange={(e) => setForgotNewPass(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-canvas focus:outline-none focus:border-brand-indigo font-sans"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setForgotStep(1)}
                  className="text-xs text-brand-indigo hover:underline font-semibold"
                >
                  Ganti Email
                </button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setForgotModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="brand"
                    size="md"
                    loading={forgotLoading}
                  >
                    Simpan Sandi Baru
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
