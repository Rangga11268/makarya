import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api";
import { Modal } from "../../components/ui/Modal";
import { GoogleVectorIcon } from "../../components/icons/ProfileVectorIcons";
import { initiateGoogleWebSignIn } from "../../services/googleAuth";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Forgot Password Modal States
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
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
      setError(null);

      const googleUser = await initiateGoogleWebSignIn({ role: "UMKM" });

      const isCampusEmail =
        googleUser.email.endsWith(".ac.id") ||
        googleUser.email.endsWith(".edu");
      const targetRole = isCampusEmail ? "MHS" : "UMKM";

      const res = await authApi.googleAuth({
        email: googleUser.email,
        name: googleUser.name,
        photo_url: googleUser.photo_url,
        role: targetRole,
        google_id: googleUser.google_id,
      });

      setAuth(res.data);
      addToast("Berhasil masuk melalui Akun Google!", "success");

      if (res.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.message && err.message.includes("dibatalkan")) {
        return;
      }
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Gagal masuk dengan Google";
      setError(msg);
      addToast(msg, "danger");
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
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] flex flex-col lg:flex-row font-sans overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDE: BRAND SHOWCASE & SPECTRUM HERO CANVAS (Desktop Only)        */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-slate-900 via-[#0B0F17] to-slate-950 text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Vertical Spectrum Pillars */}
        <div className="absolute -left-6 bottom-16 top-24 w-14 flex items-end gap-1.5 opacity-80 pointer-events-none z-0 animate-float-slow">
          <div className="w-1/4 h-2/5 bg-gradient-to-t from-cyan-600 to-transparent rounded-t-lg" />
          <div className="w-1/4 h-3/5 bg-gradient-to-t from-cyan-500 via-emerald-400 to-transparent rounded-t-lg" />
          <div className="w-1/4 h-5/6 bg-gradient-to-t from-cyan-400 via-amber-300 to-transparent rounded-t-lg" />
          <div className="w-1/4 h-full bg-gradient-to-t from-blue-600 to-transparent rounded-t-lg" />
        </div>

        {/* Top Brand Identity */}
        <div className="relative z-10 space-y-3">
          <Link to="/" className="inline-flex items-center gap-3 group select-none">
            <img
              src="/logo-icon.svg"
              alt="Makarya Logo"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-2xl font-black tracking-tight text-white">
              Makarya
            </span>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-md pt-3">
            Kolaborasi Nyata dengan{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Proteksi Escrow Penuh.
            </span>
          </h2>

          <p className="text-xs xl:text-sm text-slate-300 leading-relaxed max-w-sm">
            Akses ribuan proyek digital terverifikasi dari pelaku usaha UMKM dan wujudkan formasi tim multidisiplin kampus.
          </p>
        </div>

        {/* Center Live Showcase Card */}
        <div className="relative z-10 my-8 space-y-3 max-w-md">
          <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  DR
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    Darell Radhitya
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Frontend Dev | Universitas Indonesia
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                Honor Terverifikasi
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed italic">
              "Pengerjaan proyek website e-commerce kopi selesai tepat waktu. Pembayaran diamankan di escrow dan cair otomatis saat klien puas."
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Escrow 100% Aman</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                <GraduationCap className="w-3 h-3 text-cyan-400" />
                <span>Akun .ac.id Valid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guarantee Badges */}
        <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Makarya Indonesia</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Jaminan Transaksi Aman
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT SIDE: HIGH-CONTRAST CLEAN AUTH FORM CONTAINER                    */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Only Brand Header */}
          <div className="lg:hidden flex items-center justify-between pb-2">
            <Link to="/" className="inline-flex items-center gap-2 group select-none">
              <img
                src="/logo-icon.svg"
                alt="Makarya Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-black tracking-tight text-slate-900">
                Makarya
              </span>
            </Link>
          </div>

          {/* Header Title */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Selamat Datang Kembali
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Akses dashboard proyek, proposal, dan dompet pencairan dana escrow Anda.
            </p>
          </div>

          {/* Quick Fill Test Accounts Chips */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                Akun Uji Coba Cepat:
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Pass: password123
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => fillTestAccount("darell@ubsi.ac.id")}
                className="px-2.5 py-1.5 min-h-[36px] rounded-lg bg-white hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-600" />
                Mahasiswa (Darell)
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount("admin@makarya.id")}
                className="px-2.5 py-1.5 min-h-[36px] rounded-lg bg-white hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount("kopi.nusantara@gmail.com")}
                className="px-2.5 py-1.5 min-h-[36px] rounded-lg bg-white hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                UMKM (Kopi)
              </button>
            </div>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full min-h-[44px] py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            <GoogleVectorIcon className="w-4 h-4" />
            <span>Masuk Cepat dengan Akun Google</span>
          </button>

          {/* Clean Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-[#F8FAFC] px-3 text-xs text-slate-400 font-medium absolute">
              atau dengan email terdaftar
            </span>
          </div>

          {/* Form Error Banner */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-fade-in-fast">
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@kampus.ac.id atau email usaha"
                  className="w-full min-h-[44px] pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 hover:underline py-1"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Tampilkan kata sandi"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] py-3.5 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Memverifikasi..." : "Masuk ke Akun"}</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </form>

          {/* Footer Navigation Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Belum memiliki akun Makarya?{" "}
              <Link
                to="/register"
                className="font-bold text-cyan-700 hover:text-cyan-800 hover:underline p-1 inline-block"
              >
                Daftar Sekarang Gratis
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <Modal
          isOpen={forgotModalOpen}
          onClose={() => {
            setForgotModalOpen(false);
            setForgotStep(1);
            setForgotError(null);
          }}
          title="Reset Kata Sandi"
        >
          <div className="space-y-4 p-1">
            {forgotError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {forgotError}
              </div>
            )}

            {forgotStep === 1 && (
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Masukkan email akun Anda. Kami akan mengirimkan 6 digit kode OTP verifikasi untuk mengubah kata sandi Anda.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Akun
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full min-h-[44px] py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  {forgotLoading ? "Mengirim OTP..." : "Kirim Kode OTP"}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kode OTP telah dikirim ke <b>{forgotEmail}</b>. Masukkan kode 6 digit dan kata sandi baru Anda.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode OTP (6 Digit)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="Contoh: 123456"
                    className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-center font-mono text-sm tracking-widest text-slate-900 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password Baru (Min. 8 Karakter)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={forgotNewPass}
                    onChange={(e) => setForgotNewPass(e.target.value)}
                    placeholder="Password baru..."
                    className="w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full min-h-[44px] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  {forgotLoading ? "Menyimpan..." : "Simpan Password Baru"}
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
