import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
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
        "danger"
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
        err.response?.data?.detail || "Email tidak terdaftar di sistem"
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
        "success"
      );
      setForgotModalOpen(false);
      setEmail(forgotEmail.trim());
      setForgotStep(1);
      setForgotOtp("");
      setForgotNewPass("");
    } catch (err) {
      setForgotError(
        err.response?.data?.detail || "Kode OTP salah atau telah kedaluwarsa"
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
                src="/logo.webp"
                alt="Logo Makarya"
                className="h-14 sm:h-16 w-auto object-contain mb-3"
              />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif text-dark-900 tracking-tight font-normal">
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
              <span className="text-[10px] text-muted">
                Password: password123
              </span>
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
            {/* Google OAuth Direct Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-canvas text-dark-900 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 shadow-2xs transition-all cursor-pointer mb-4"
            >
              <GoogleVectorIcon size={18} />
              <span>Masuk dengan Google (Tanpa Verifikasi OTP)</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-muted font-semibold">
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
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
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
                className="w-full text-sm font-bold shadow-brand mt-2"
              >
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border text-center text-xs text-muted font-sans">
              Belum memiliki akun mahasiswa?{" "}
              <Link
                to="/register"
                className="font-bold text-brand-indigo hover:underline"
              >
                Daftar Mahasiswa (.ac.id)
              </Link>
            </div>
          </Card>

          {/* Security Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted font-medium font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Garansi Rekening Bersama (Escrow) & Keamanan Data OWASP Top 10
            </span>
          </div>
        </div>
      </div>

      {/* MODAL LUPA PASSWORD (FORGOT PASSWORD & RESET OTP) */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title={forgotStep === 1 ? "Lupa Kata Sandi" : "Verifikasi OTP & Sandi Baru"}
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
                <label className="text-xs font-bold text-dark-900">Email Akun</label>
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
                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
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
