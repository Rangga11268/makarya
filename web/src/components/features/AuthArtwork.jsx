import React from "react";
import { StarRating } from "../ui/StarRating";
import { 
  ShieldCheck, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Briefcase, 
  ArrowUpRight,
  Award
} from "lucide-react";

export function AuthArtwork({ 
  headline = "Wujudkan Pengalaman Kerja Nyata Sebelum Lulus Kuliah.",
  subtext = "Gabung bersama ribuan mahasiswa bertalenta yang telah menghasilkan karya dan honor terjamin dari UMKM lokal."
}) {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-dark-900 text-white p-10 xl:p-14 rounded-3xl relative overflow-hidden border border-slate-800 shadow-2xl h-full min-h-[640px]">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-brand-indigo/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-brand-cyan">
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Platform Micro-freelancing Kampus #1</span>
        </div>

        <h2 className="text-3xl xl:text-4xl font-serif text-white tracking-tight leading-tight max-w-md">
          {headline}
        </h2>
        <p className="text-xs xl:text-sm text-slate-300 font-sans max-w-sm leading-relaxed">
          {subtext}
        </p>
      </div>

      {/* Center Interactive Floating Testimonial Vector Card */}
      <div className="relative z-10 my-8 space-y-4">
        <div className="bg-slate-800/80 backdrop-blur-md p-5 rounded-2xl border border-slate-700/80 shadow-xl space-y-3 max-w-md animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-cyan to-brand-indigo text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs">
                D
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white font-sans">Darell Rangga Putra</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 font-sans">Sistem Informasi • Talenta Terverifikasi</p>
              </div>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              Honor Cair
            </div>
          </div>

          <p className="text-xs text-slate-200 font-sans leading-relaxed italic">
            "Proyek pembuatan landing page UMKM selesai dalam 4 hari. Saldo escrow langsung cair otomatis ke rekening tanpa khawatir pembayaran macet."
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-[11px]">
            <StarRating rating={5.0} size="xs" />
            <span className="text-brand-cyan font-semibold">8 Proyek Terverifikasi</span>
          </div>
        </div>

        {/* 3 Key Trust Badges */}
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-white block">Escrow 100%</span>
              <span className="text-[10px] text-slate-400 block">Dana Terkunci Aman</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-lg bg-brand-indigo-light/20 text-brand-cyan flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold text-white block">Domain .ac.id</span>
              <span className="text-[10px] text-slate-400 block">Verifikasi Mahasiswa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="relative z-10 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>© {new Date().getFullYear()} Makarya Platform</span>
        <span className="flex items-center gap-1 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Financial Grade Escrow
        </span>
      </div>
    </div>
  );
}