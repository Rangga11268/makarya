import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { AuthArtwork } from "../../components/features/AuthArtwork";
import { GoogleVectorIcon } from "../../components/icons/ProfileVectorIcons";
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
} from "lucide-react";

export function RegisterPage() {
  const [role, setRole] = useState("MHS"); // 'MHS' | 'UMKM'

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
      const googleMock = {
        email:
          role === "MHS"
            ? "mahasiswa.google@ubsi.ac.id"
            : "umkm.google@gmail.com",
        name: role === "MHS" ? "Mahasiswa Google" : "UMKM Google Store",
        role: role,
      };
      const res = await authApi.googleAuth(googleMock);
      setAuth(res.data);
      addToast("Pendaftaran Google berhasil tanpa verifikasi OTP!", "success");
      navigate("/dashboard");
    } catch (err) {
      addToast(
        err.response?.data?.detail || "Gagal mendaftar dengan Google",
        "danger",
      );
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
            headline={
              isOtpStep
                ? "Satu Langkah Lagi Menuju Dunia Proyek Nyata."
                : "Daftar Sekali, Bangun Portofolio & Reputasi Nyata."
            }
            subtext={
              isOtpStep
                ? "Verifikasi identitas Anda untuk menjamin rasa aman dan transaksi escrow terpercaya antar mahasiswa dan UMKM."
                : "Setiap proyek yang Anda selesaikan otomatis tercatat dalam portofolio digital terverifikasi dan siap dibagikan ke calon klien."
            }
          />
        </div>

        {/* Right Column: Register or OTP Form */}
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
              {isOtpStep
                ? "Verifikasi Kode OTP"
                : role === "MHS"
                  ? "Daftar Akun Mahasiswa"
                  : "Daftar Akun Klien UMKM"}
            </h1>
            <p className="text-xs sm:text-sm text-muted font-sans font-normal">
              {isOtpStep
                ? `Masukkan 6 digit kode OTP yang kami kirimkan ke ${registeredEmail}`
                : role === "MHS"
                  ? "Gunakan email kampus resmi (.ac.id) untuk verifikasi talenta mahasiswa"
                  : "Akses ratusan talenta mahasiswa terverifikasi untuk proyek bisnis Anda"}
            </p>
          </div>

          <Card className="p-6 sm:p-7 shadow-xs">
            {isOtpStep ? (
              /* OTP VERIFICATION VIEW */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {error && (
                  <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-xl animate-in fade-in">
                    {error}
                  </div>
                )}

                <div className="p-4 bg-brand-indigo/5 border border-brand-indigo/15 rounded-2xl text-center space-y-1">
                  <KeyRound className="w-6 h-6 text-brand-indigo mx-auto mb-1" />
                  <p className="text-xs font-semibold text-dark-900">
                    Kode Verifikasi Terkirim
                  </p>
                  <p className="text-[11px] text-muted">
                    Periksa kotak masuk atau spam email{" "}
                    <strong>{registeredEmail}</strong>
                  </p>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans text-center">
                    Masukkan 6 Digit OTP
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="123456"
                    className="w-full text-center tracking-[0.6em] text-2xl font-mono font-bold py-3 px-4 bg-surface border-2 border-brand-indigo/30 rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition-all"
                  />
                </div>

                <Button
                  variant="brand"
                  size="lg"
                  type="submit"
                  loading={otpLoading}
                  className="w-full text-sm font-bold shadow-brand"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>Verifikasi & Aktifkan Akun</span>
                </Button>

                <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpStep(false);
                      setError(null);
                    }}
                    className="text-muted hover:text-dark-900 font-semibold"
                  >
                    ← Ubah Data Pendaftaran
                  </button>

                  <button
                    type="button"
                    disabled={!canResend}
                    onClick={handleResendOtp}
                    className={`font-semibold flex items-center gap-1 ${
                      canResend
                        ? "text-brand-indigo hover:underline cursor-pointer"
                        : "text-muted cursor-not-allowed"
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {canResend
                      ? "Kirim Ulang OTP"
                      : `Kirim ulang dalam (${otpTimer}s)`}
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTRATION FORM VIEW */
              <>
                {/* Role Switcher */}
                <div className="flex p-1 bg-canvas border border-border rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => setRole("MHS")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      role === "MHS"
                        ? "bg-brand-indigo text-white shadow-2xs"
                        : "text-muted hover:text-dark-900"
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    Mahasiswa (.ac.id)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("UMKM")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      role === "UMKM"
                        ? "bg-brand-indigo text-white shadow-2xs"
                        : "text-muted hover:text-dark-900"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Klien UMKM
                  </button>
                </div>

                {/* Google Sign-up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl border border-border bg-surface hover:bg-canvas text-dark-900 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 shadow-2xs transition-all cursor-pointer mb-4"
                >
                  <GoogleVectorIcon size={18} />
                  <span>Daftar Cepat dengan Google (Bypass OTP)</span>
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-surface px-2 text-muted font-semibold">
                      Atau isi data manual
                    </span>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <div className="p-3 text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 rounded-xl animate-in fade-in">
                      {error}
                    </div>
                  )}

                  {role === "MHS" ? (
                    <>
                      <div className="space-y-1.5 text-left">
                        <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                          Nama Lengkap Sesuai KTM
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Darell Rangga Putra"
                            value={mhsForm.nama_lengkap}
                            onChange={(e) =>
                              setMhsForm({
                                ...mhsForm,
                                nama_lengkap: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                          Email Kampus Resmi (.ac.id)
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            placeholder="nama@kampus.ac.id"
                            value={mhsForm.email}
                            onChange={(e) =>
                              setMhsForm({ ...mhsForm, email: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo font-sans"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5 text-left">
                          <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                            NIM
                          </label>
                          <input
                            type="text"
                            placeholder="Cth: 12210001"
                            value={mhsForm.nim}
                            onChange={(e) =>
                              setMhsForm({ ...mhsForm, nim: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo font-sans"
                          />
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                            Program Studi
                          </label>
                          <select
                            value={mhsForm.prodi_id}
                            onChange={(e) =>
                              setMhsForm({
                                ...mhsForm,
                                prodi_id: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo font-sans cursor-pointer"
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
                      <div className="space-y-1.5 text-left">
                        <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                          Nama Usaha / Toko / Merek
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Kopi Senja Nusantara"
                            value={umkmForm.nama_usaha}
                            onChange={(e) =>
                              setUmkmForm({
                                ...umkmForm,
                                nama_usaha: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                          Email Bisnis / Pribadi
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            placeholder="kontak@bisnisanda.com"
                            value={umkmForm.email}
                            onChange={(e) =>
                              setUmkmForm({
                                ...umkmForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
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
                          className="w-full px-3 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo font-sans cursor-pointer"
                        >
                          {industriOptions.map((ind, idx) => (
                            <option key={idx} value={ind}>
                              {ind}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-semibold text-dark-900 uppercase tracking-wider font-sans">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        placeholder="Minimal 8 karakter"
                        value={
                          role === "MHS" ? mhsForm.password : umkmForm.password
                        }
                        onChange={(e) =>
                          role === "MHS"
                            ? setMhsForm({
                                ...mhsForm,
                                password: e.target.value,
                              })
                            : setUmkmForm({
                                ...umkmForm,
                                password: e.target.value,
                              })
                        }
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-surface border border-border rounded-xl text-dark-900 focus:outline-none focus:border-brand-indigo font-sans"
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
                    <span>Lanjutkan & Verifikasi OTP</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </form>
              </>
            )}

            <div className="mt-6 pt-5 border-t border-border text-center text-xs text-muted font-sans">
              Sudah memiliki akun?{" "}
              <Link
                to="/login"
                className="font-bold text-brand-indigo hover:underline"
              >
                Masuk ke Akun Anda
              </Link>
            </div>
          </Card>

          {/* Security Trust Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted font-medium font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Verifikasi Kampus Resmi • Enkripsi Standar OWASP • Keamanan Escrow
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
