import React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  ArrowRight,
  Instagram,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#090D16] text-white border-t border-slate-800/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        {/* Top Row: Brand & Tagline + Social Links (Axora Style) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-10 border-b border-slate-800 gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                M
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Makarya
              </span>
            </Link>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-xs sm:text-sm text-slate-400">
              Platform Kolaborasi Digital Terpercaya Mahasiswa & UMKM.
            </span>
          </div>

          {/* Social Icon Pills */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 4-Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-slate-800/80 text-xs">
          {/* Col 1: Produk */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Produk
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link
                  to="/projects"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Jelajah Katalog Proyek
                </Link>
              </li>
              <li>
                <Link
                  to="/talents"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Direktori Talenta Kampus
                </Link>
              </li>
              <li>
                <Link
                  to="/projects?category=PEMROGRAMAN"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Formasi Tim Multi-Role
                </Link>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">
                  Sistem Escrow Holding
                </span>
              </li>
            </ul>
          </div>

          {/* Col 2: Solusi */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Solusi
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link
                  to="/register?role=UMKM"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Untuk Pelaku Usaha UMKM
                </Link>
              </li>
              <li>
                <Link
                  to="/register?role=MAHASISWA"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Untuk Mahasiswa Kampus
                </Link>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">
                  Program Kemitraan Kampus
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">
                  Perlindungan Milestone
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Sumber Daya */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Sumber Daya
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">
                  Panduan Penulisan Brief
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">
                  Standar Portofolio Digital
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">
                  Kebijakan Rekening Bersama
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">
                  Mediasi Sengketa & Resolusi
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Perusahaan */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Perusahaan
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">
                  Tentang Makarya Indonesia
                </span>
              </li>
              <li>
                <span className="hover:text-cyan-400 cursor-pointer transition-colors">
                  Pusat Bantuan & Kontak
                </span>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Security Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Makarya Indonesia. Seluruh hak
            cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Operasional (Escrow & Workroom Live)
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <Lock className="w-3 h-3 text-cyan-400" /> Transaksi Terenkripsi
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
