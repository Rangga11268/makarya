import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api";
import { GoogleVectorIcon } from "../../components/icons/ProfileVectorIcons";
import { initiateGoogleWebSignIn } from "../../services/googleAuth";
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  RotateCcw,
  KeyRound,
  MapPin,
  Phone,
  BookOpen,
} from "lucide-react";

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "UMKM" ? "UMKM" : "MHS";
  const [role, setRole] = useState(initialRole); // 'MHS' | 'UMKM'

  // Form states for Mahasiswa
  const [mhsForm, setMhsForm] = useState({
    nama_lengkap: "",
    email: "",
    password: "",
    nim: "",
    prodi_id: 1,
  });

  // Form states for UMKM
  const [umkmForm, setUmkmForm] = useState({
    nama_usaha: "",
    bidang_industri: "F&B / Kuliner",
    email: "",
    password: "",
    alamat: "Jakarta",
    kota: "Jakarta Selatan",
    no_kontak: "081298765432",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // OTP Verification Step States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

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

  const industriOptions = [
    "F&B / Kuliner",
    "Fashion & Tekstil",
    "Ritel & Toko Kelontong",
    "Jasa Kreatif & Percetakan",
    "Kecantikan & Skincare",
    "Otomotif & Bengkel",
    "Teknologi & Digital",
    "Agribisnis & Peternakan",
  ];

  // OTP countdown timer
  useEffect(() => {
    let interval;
    if (isOtpStep && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, otpTimer]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const emailToRegister = (role === "MHS" ? mhsForm.email : umkmForm.email)
      .trim()
      .toLowerCase();
    const pass = role === "MHS" ? mhsForm.password : umkmForm.password;

    if (role === "MHS") {
      if (
        !emailToRegister.endsWith(".ac.id") &&
        !emailToRegister.endsWith(".edu")
      ) {
        setError(
          "Pendaftaran mahasiswa wajib menggunakan email kampus resmi (akhiran .ac.id atau .edu)",
        );
        return;
      }
    }

    if (pass.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    try {
      setLoading(true);
      if (role === "MHS") {
        await authApi.registerMhs({
          nama_lengkap: mhsForm.nama_lengkap.trim(),
          email: emailToRegister,
          password: pass,
          nim: mhsForm.nim.trim() || null,
          prodi_id: parseInt(mhsForm.prodi_id, 10),
        });
      } else {
        await authApi.registerUmkm({
          nama_usaha: umkmForm.nama_usaha.trim(),
          bidang_industri: umkmForm.bidang_industri,
          email: emailToRegister,
          password: pass,
          alamat: umkmForm.alamat,
          kota: umkmForm.kota,
          no_kontak: umkmForm.no_kontak,
        });
      }

      setRegisteredEmail(emailToRegister);
      setIsOtpStep(true);
      setOtpTimer(60);
      setCanResend(false);
      addToast(
        "Pendaftaran berhasil! Silakan masukkan kode OTP yang dikirimkan.",
        "success",
      );
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal melakukan registrasi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError("Kode OTP harus berupa 6 digit angka");
      return;
    }

    try {
      setOtpLoading(true);
      setError(null);
      const res = await authApi.verifyOtp({
        email: registeredEmail,
        otp_code: otpCode.trim(),
      });
      setAuth(res.data);
      addToast(
        "Akun berhasil diverifikasi! Selamat datang di Makarya.",
        "success",
      );
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Kode OTP tidak valid atau kedaluwarsa",
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    try {
      setCanResend(false);
      setOtpTimer(60);
      await authApi.resendOtp({ email: registeredEmail });
      addToast("Kode OTP baru telah dikirimkan ke email.", "info");
    } catch (err) {
      addToast(
        err.response?.data?.detail || "Gagal mengirim ulang OTP",
        "danger",
      );
      setCanResend(true);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError(null);

      const googleUser = await initiateGoogleWebSignIn({ role });

      const isCampusEmail =
        googleUser.email.endsWith(".ac.id") ||
        googleUser.email.endsWith(".edu");

      if (role === "MHS" && !isCampusEmail) {
        const errMsg = `Pendaftaran Mahasiswa wajib menggunakan email kampus resmi (.ac.id atau .edu). Akun Google yang Anda pilih (${googleUser.email}) bukan email kampus.`;
        setError(errMsg);
        addToast(errMsg, "danger");
        return;
      }

      const res = await authApi.googleAuth({
        email: googleUser.email,
        name: googleUser.name,
        photo_url: googleUser.photo_url,
        role: role,
        google_id: googleUser.google_id,
      });

      setAuth(res.data);
      addToast("Pendaftaran Google berhasil!", "success");
      navigate("/dashboard");
    } catch (err) {
      if (err.message && err.message.includes("dibatalkan")) {
        return;
      }
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Gagal mendaftar dengan Google";
      setError(msg);
      addToast(msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F8FAFC] flex flex-col lg:flex-row font-sans">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDE: BRAND SHOWCASE & SPECTRUM HERO CANVAS (Axora Style)         */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-slate-900 via-[#0B0F17] to-slate-950 text-white p-10 xl:p-14 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Vertical Spectrum Pillars */}
        <div className="absolute -left-6 bottom-16 top-24 w-14 flex items-end gap-1.5 opacity-80 pointer-events-none z-0 animate-float-slow">
          <div className="w-1/4 h-2/5 bg-gradient-to-t from-cyan-600 to-transparent rounded-t-lg" />
          <div className="w-1/4 h-3/5 bg-gradient-to-t from-cyan-500 via-emerald-400 to-transparent rounded-t-lg" />
          <div className="w-1/4 h-5/6 bg-gradient-to-t from-cyan-400 via-amber-300 to-transparent rounded-t-lg" />
          <div className="w-1/4 h-full bg-gradient-to-t from-blue-600 to-transparent rounded-t-lg" />
        </div>

        {/* Top Brand Identity */}
        <div className="relative z-10 space-y-4">
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

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Pendaftaran Akun Terverifikasi</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-md pt-2">
            Mulai Karir & Proyek Digital Bersama{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Ekosistem Makarya.
            </span>
          </h2>

          <p className="text-xs xl:text-sm text-slate-300 leading-relaxed max-w-sm">
            Bangun portofolio industri terakreditasi untuk mahasiswa dan dapatkan hasil kerja profesional dengan biaya terjangkau untuk UMKM.
          </p>
        </div>

        {/* Center Live Proof Card */}
        <div className="relative z-10 my-8 space-y-3 max-w-md">
          <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
              <span className="text-xs font-bold text-white">
                Keunggulan Ekosistem
              </span>
              <span className="text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                Terintegrasi
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><b>100% Escrow Protection:</b> Pembayaran aman disimpan di rekening penampungan resmi.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><b>Formasi Tim Multi-Role:</b> Kolaborasi antar keahlian UI/UX, Frontend, dan Backend.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><b>Akreditasi Kampus .ac.id:</b> Reputasi dan portofolio diverifikasi langsung oleh perguruan tinggi.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guarantee Badges */}
        <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Makarya Indonesia</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Verifikasi Aman 100%
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT SIDE: CLEAN REGISTRATION / OTP FORM CONTAINER                     */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-lg space-y-6">
          {/* Header Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-cyan-600" />
              <span>{isOtpStep ? "Verifikasi Email" : "Buat Akun Baru"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {isOtpStep
                ? "Masukkan Kode OTP"
                : role === "MHS"
                  ? "Daftar Talenta Mahasiswa"
                  : "Daftar Pelaku Usaha UMKM"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isOtpStep
                ? `Kode 6 digit telah dikirimkan ke ${registeredEmail}`
                : role === "MHS"
                  ? "Gunakan email kampus resmi (.ac.id) untuk meraih portofolio industri dan honor terlindungi."
                  : "Pasang kebutuhan proyek digital dan temukan mahasiswa berbakat dari berbagai kampus."}
            </p>
          </div>

          {/* Form Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-fade-in-fast">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isOtpStep ? (
            <div className="space-y-5">
              {/* Role Toggle Switcher Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setRole("MHS");
                    setError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    role === "MHS"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-cyan-600" />
                  <span>Mahasiswa Kampus</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("UMKM");
                    setError(null);
                  }}
                  className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                    role === "UMKM"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Klien UMKM</span>
                </button>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                <GoogleVectorIcon className="w-4 h-4" />
                <span>Daftar Cepat dengan Akun Google</span>
              </button>

              {/* Clean Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-[#F8FAFC] px-3 text-xs text-slate-400 font-medium absolute">
                  atau isi formulir pendaftaran
                </span>
              </div>

              {/* Main Registration Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                {role === "MHS" ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={mhsForm.nama_lengkap}
                          onChange={(e) =>
                            setMhsForm({ ...mhsForm, nama_lengkap: e.target.value })
                          }
                          placeholder="Nama lengkap sesuai KTM..."
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Kampus (.ac.id / .edu)
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={mhsForm.email}
                          onChange={(e) =>
                            setMhsForm({ ...mhsForm, email: e.target.value })
                          }
                          placeholder="contoh: darell@ui.ac.id"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          NIM Mahasiswa
                        </label>
                        <input
                          type="text"
                          value={mhsForm.nim}
                          onChange={(e) =>
                            setMhsForm({ ...mhsForm, nim: e.target.value })
                          }
                          placeholder="NIM aktif..."
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 shadow-2xs transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Program Studi
                        </label>
                        <select
                          value={mhsForm.prodi_id}
                          onChange={(e) =>
                            setMhsForm({ ...mhsForm, prodi_id: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-cyan-500 shadow-2xs transition-all"
                        >
                          {prodiOptions.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nama Usaha / Brand UMKM
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={umkmForm.nama_usaha}
                          onChange={(e) =>
                            setUmkmForm({ ...umkmForm, nama_usaha: e.target.value })
                          }
                          placeholder="Contoh: Kopi Kenangan Nusantara"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Akun Bisnis
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={umkmForm.email}
                          onChange={(e) =>
                            setUmkmForm({ ...umkmForm, email: e.target.value })
                          }
                          placeholder="nama@usaha.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Bidang Industri
                        </label>
                        <select
                          value={umkmForm.bidang_industri}
                          onChange={(e) =>
                            setUmkmForm({
                              ...umkmForm,
                              bidang_industri: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-cyan-500 shadow-2xs transition-all"
                        >
                          {industriOptions.map((ind, i) => (
                            <option key={i} value={ind}>
                              {ind}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Kota Lokasi
                        </label>
                        <input
                          type="text"
                          required
                          value={umkmForm.kota}
                          onChange={(e) =>
                            setUmkmForm({ ...umkmForm, kota: e.target.value })
                          }
                          placeholder="Jakarta Selatan"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 shadow-2xs transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kata Sandi (Min. 8 Karakter)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={role === "MHS" ? mhsForm.password : umkmForm.password}
                      onChange={(e) => {
                        if (role === "MHS") {
                          setMhsForm({ ...mhsForm, password: e.target.value });
                        } else {
                          setUmkmForm({ ...umkmForm, password: e.target.value });
                        }
                      }}
                      placeholder="Masukkan kata sandi aman..."
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
                  className="w-full py-3.5 px-6 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                >
                  <span>{loading ? "Mendaftarkan..." : "Daftar Akun Sekarang"}</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </button>
              </form>
            </div>
          ) : (
            /* OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in-fast">
              <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-2xl text-xs text-cyan-900 leading-relaxed">
                Kami telah mengirimkan 6 digit kode verifikasi ke alamat email <b>{registeredEmail}</b>. Harap periksa folder kotak masuk atau spam.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                  Masukkan 6 Digit Kode OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Contoh: 123456"
                  className="w-full py-3 text-center font-mono text-lg font-bold tracking-widest bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-2xs"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
              >
                <span>{otpLoading ? "Memverifikasi..." : "Verifikasi & Aktifkan Akun"}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {canResend
                    ? "Kirim Ulang Kode OTP"
                    : `Kirim ulang OTP dalam ${otpTimer} detik`}
                </button>
              </div>
            </form>
          )}

          {/* Footer Navigation Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Sudah memiliki akun Makarya?{" "}
              <Link
                to="/login"
                className="font-bold text-cyan-700 hover:text-cyan-800 hover:underline"
              >
                Masuk di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
