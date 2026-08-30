import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { 
  ShieldCheck, 
  Send, 
  GraduationCap, 
  Building2, 
  Lock, 
  ArrowUpRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export function Footer() {
  const { isAuthenticated, user } = useAuthStore();
  const { addToast } = useToastStore();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    addToast("Terima kasih! Notifikasi proyek baru telah diaktifkan.", "success");
    setNewsletterEmail("");
  };

  return (
    <footer className="relative bg-surface border-t border-border mt-20 overflow-hidden font-sans">
      
      {/* Large faint background watermark */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4 select-none pointer-events-none opacity-[0.03] text-dark-900 font-serif font-black text-8xl sm:text-[180px] tracking-tight whitespace-nowrap z-0">
        Makarya Platform
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-14 pb-10">
        
        {/* Top Pre-Footer Banner for Non-Logged In or Dashboard CTA */}
        {!isAuthenticated && (
          <div className="mb-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-dark-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-float relative overflow-hidden border border-slate-800">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-cyan text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Mulai Karir Freelance Anda
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
                Dapatkan Proyek yang Cocok Hanya dalam Hitungan Menit.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Daftar dengan email kampus Anda dan segera ajukan penawaran proposal ke berbagai UMKM lokal.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/register"
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-cyan to-brand-indigo hover:opacity-95 text-white transition-all shadow-brand inline-flex items-center gap-2"
              >
                <span>Daftar Mahasiswa</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 5-Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-border">
          
          {/* Col 1: Brand Info (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src="/logoMakarya-noBGpng.png" 
                alt="Logo Makarya" 
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-sm">
              Platform micro-freelancing terkurasi yang menjembatani talenta mahasiswa bertalenta dengan kebutuhan digital UMKM secara amanah melalui sistem <b>Escrow Holding</b>.
            </p>
            <div className="pt-2 flex flex-col gap-1.5 text-xs text-dark-900 font-medium">
              <span className="flex items-center gap-2 text-slate-700">
                <GraduationCap className="w-4 h-4 text-brand-indigo shrink-0" />
                Universitas Bina Sarana Informatika • UBSI Kaliabang
              </span>
              <span className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Sistem Terverifikasi Akademik & Finansial
              </span>
            </div>
          </div>

          {/* Col 2: Kategori Layanan (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              Kategori Proyek
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link to="/projects?category=DESIGN" className="hover:text-brand-indigo transition-colors flex items-center justify-between">
                  <span>Desain & Branding</span>
                </Link>
              </li>
              <li>
                <Link to="/projects?category=UIUX" className="hover:text-brand-indigo transition-colors flex items-center justify-between">
                  <span>UI/UX Design</span>
                </Link>
              </li>
              <li>
                <Link to="/projects?category=PEMROGRAMAN" className="hover:text-brand-indigo transition-colors flex items-center justify-between">
                  <span>Web & Mobile App</span>
                </Link>
              </li>
              <li>
                <Link to="/projects?category=VIDEO" className="hover:text-brand-indigo transition-colors flex items-center justify-between">
                  <span>Video & Reels</span>
                </Link>
              </li>
              <li>
                <Link to="/projects?category=COPYWRITING" className="hover:text-brand-indigo transition-colors flex items-center justify-between">
                  <span>Copywriting SEO</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigasi Platform (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              Platform & Fitur
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link to="/projects" className="hover:text-brand-indigo transition-colors">
                  Jelajah Semua Proyek
                </Link>
              </li>
              <li>
                <Link to="/proposals" className="hover:text-brand-indigo transition-colors">
                  Proposal & Penawaran
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-brand-indigo transition-colors">
                  Portofolio Terverifikasi
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="hover:text-brand-indigo transition-colors">
                  Dompet & Pencairan Dana
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-indigo transition-colors">
                  Portal Masuk Akun
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Keamanan & Bantuan (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              Pusat Dukungan
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <span className="hover:text-brand-indigo cursor-pointer transition-colors">
                  Panduan Mahasiswa
                </span>
              </li>
              <li>
                <span className="hover:text-brand-indigo cursor-pointer transition-colors">
                  Panduan Klien UMKM
                </span>
              </li>
              <li>
                <span className="hover:text-brand-indigo cursor-pointer transition-colors">
                  Mediasi Sengketa
                </span>
              </li>
              <li>
                <span className="hover:text-brand-indigo cursor-pointer transition-colors">
                  Syarat & Ketentuan
                </span>
              </li>
              <li>
                <span className="hover:text-brand-indigo cursor-pointer transition-colors">
                  Kebijakan Privasi
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter & Info Proyek (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              Info Proyek Baru
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Dapatkan notifikasi proyek UMKM terbaru langsung ke email Anda.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Email kampus Anda..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-canvas border border-border rounded-xl text-dark-900 placeholder:text-muted/60 focus:outline-none focus:border-brand-indigo"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-dark-900 hover:bg-brand-indigo text-white transition-all inline-flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Berlangganan</span>
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            &copy; {new Date().getFullYear()} <b>Makarya Platform</b>. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Skripsi S1 Sistem Informasi</span>
            <span>•</span>
            <span>Darell Rangga Putra (12219999)</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
              <Lock className="w-3 h-3" /> Escrow Terenkripsi
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}