import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SystemUsabilityScaleModal } from "../features/SystemUsabilityScaleModal";
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  ArrowRight,
  Instagram,
  Linkedin,
  Twitter,
  Github,
  CheckCircle2,
} from "lucide-react";

export function Footer() {
  const [susModalOpen, setSusModalOpen] = useState(false);
  return (
    <footer className="relative bg-[#090D16] text-white border-t border-slate-800/80 font-sans overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        {/* Top Header Row: Brand Identity & Social Icons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-12 border-b border-slate-800/80 gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <Link to="/" className="flex items-center group select-none shrink-0">
              <img
                src="/logo.webp"
                alt="Makarya"
                className="h-8 sm:h-9 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform"
              />
            </Link>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Platform Kolaborasi Digital Mahasiswa Terverifikasi & Pelaku Usaha
              UMKM Indonesia.
            </span>
          </div>

          {/* Social Links Pills */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all hover:-translate-y-0.5"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4-Column Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-12 border-b border-slate-800/80 text-xs">
          {/* Column 1: Produk */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Produk & Layanan
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link
                  to="/projects"
                  className="hover:text-cyan-400 transition-all inline-block hover:translate-x-0.5"
                >
                  Jelajah Katalog Proyek
                </Link>
              </li>
              <li>
                <Link
                  to="/talents"
                  className="hover:text-cyan-400 transition-all inline-block hover:translate-x-0.5"
                >
                  Direktori Talenta Kampus
                </Link>
              </li>
              <li>
                <Link
                  to="/projects?category=PEMROGRAMAN"
                  className="hover:text-cyan-400 transition-all inline-block hover:translate-x-0.5"
                >
                  Formasi Tim Multi-Role
                </Link>
              </li>
              <li>
                <Link
                  to="/projects?category=DESIGN"
                  className="hover:text-cyan-400 transition-all inline-block hover:translate-x-0.5"
                >
                  Desain Grafis & UI/UX
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Solusi */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Solusi Kolaborasi
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link
                  to="/register?role=UMKM"
                  className="hover:text-cyan-400 transition-all inline-block hover:translate-x-0.5"
                >
                  Untuk Pelaku Usaha UMKM
                </Link>
              </li>
              <li>
                <Link
                  to="/register?role=MAHASISWA"
                  className="hover:text-cyan-400 transition-all inline-block hover:translate-x-0.5"
                >
                  Untuk Mahasiswa Kampus
                </Link>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-all inline-block hover:translate-x-0.5">
                  Program Kemitraan Kampus
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-all inline-block hover:translate-x-0.5">
                  Perlindungan Milestone Kerja
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Sumber Daya */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Pusat Panduan
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-all inline-block hover:translate-x-0.5">
                  Panduan Penulisan Brief
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-all inline-block hover:translate-x-0.5">
                  Standar Portofolio Digital
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-all inline-block hover:translate-x-0.5">
                  Kebijakan Rekening Bersama (Escrow)
                </span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setSusModalOpen(true)}
                  className="hover:text-cyan-400 cursor-pointer transition-all inline-flex items-center gap-1.5 text-left text-cyan-300 font-medium hover:translate-x-0.5"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Kuesioner Pengujian SUS (Skripsi)</span>
                </button>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-all inline-block hover:translate-x-0.5">
                  Mediasi Sengketa & Resolusi
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Perusahaan */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Perusahaan
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-all inline-block hover:translate-x-0.5">
                  Tentang Makarya Indonesia
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-all inline-block hover:translate-x-0.5">
                  Pusat Bantuan & Kontak
                </span>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-cyan-400 transition-all inline-block hover:translate-x-0.5"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-cyan-400 transition-all inline-block hover:translate-x-0.5"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Large Subtle Watermark Typography: "MAKARYA" */}
        <div className="w-full pt-10 pb-6 text-center select-none pointer-events-none overflow-hidden">
          <span className="text-[13vw] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.07] via-white/[0.03] to-transparent uppercase block">
            MAKARYA
          </span>
        </div>

        {/* Bottom Bar: Copyright & Security Badges */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Makarya Indonesia. Seluruh hak
            cipta dilindungi undang-undang.
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Sistem Operasional (Escrow & Workroom Live)
            </span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-cyan-400" /> Transaksi Terenkripsi
            </span>
          </div>
        </div>
      </div>

      {/* SUS Modal */}
      <SystemUsabilityScaleModal
        isOpen={susModalOpen}
        onClose={() => setSusModalOpen(false)}
      />
    </footer>
  );
}
