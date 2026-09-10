import React from "react";
import { Card } from "../../../components/ui/Card";
import {
  CampusVectorIcon,
  AcademicStatusVectorIcon,
  ProdiVectorIcon,
  GithubVectorIcon,
  FigmaVectorIcon,
  GlobeVectorIcon,
  LinkedinVectorIcon,
} from "../../../components/icons/ProfileVectorIcons";
import {
  User,
  GraduationCap,
  Layers,
  CheckCircle2,
  Check,
  Plus,
  X,
  ExternalLink,
  CreditCard,
} from "lucide-react";

export function MahasiswaProfileForm({
  mhsData,
  setMhsData,
  prodiList,
  newSkillInput,
  setNewSkillInput,
  handleAddSkill,
  handleRemoveSkill,
  handleOpenExternal,
}) {
  return (
    <>
      {/* 1. Kredensial Akademik & Biodata (Using authentic SVG vector icons) */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
              <CampusVectorIcon size={20} className="text-brand-indigo" />
              Kredensial Akademik & Biodata Mahasiswa
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Data identitas kampus untuk verifikasi resmi kredibilitas
              mahasiswa di platform.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Kampus Terakreditasi
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-indigo" />
              Nama Lengkap Sesuai KTM
            </label>
            <input
              type="text"
              required
              value={mhsData.nama_lengkap}
              onChange={(e) =>
                setMhsData({ ...mhsData, nama_lengkap: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
              placeholder="Masukkan nama lengkap..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
              <AcademicStatusVectorIcon size={16} className="text-amber-500" />
              Nomor Induk Mahasiswa (NIM)
            </label>
            <input
              type="text"
              required
              value={mhsData.nim}
              onChange={(e) => setMhsData({ ...mhsData, nim: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
              placeholder="Contoh: 12210001"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
              <ProdiVectorIcon size={16} className="text-sky-500" />
              Program Studi & Jenjang
            </label>
            <select
              value={mhsData.prodi}
              onChange={(e) =>
                setMhsData({ ...mhsData, prodi: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo cursor-pointer"
            >
              {prodiList.map((p, idx) => (
                <option key={idx} value={p}>
                  {p} (S1)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900">
              Semester Aktif
            </label>
            <input
              type="number"
              min={1}
              max={14}
              value={mhsData.semester}
              onChange={(e) =>
                setMhsData({ ...mhsData, semester: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
              placeholder="6"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-dark-900">
            Bio Singkat / Ringkasan Profesional
          </label>
          <textarea
            rows={3}
            value={mhsData.bio}
            onChange={(e) => setMhsData({ ...mhsData, bio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo leading-relaxed"
            placeholder="Ceritakan keahlian utama, pengalaman project, atau minat pengerjaan Anda..."
          />
        </div>

        {/* Tag Keahlian (Skills) */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-brand-indigo" />
                Keahlian & Tag Spesialisasi Digital
              </label>
              <p className="text-[11px] text-muted mt-0.5">
                Keahlian yang Anda kuasai untuk mencocokkan dengan proyek UMKM.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Tambah skill..."
                className="px-3 py-1 text-xs rounded-lg border border-border bg-canvas focus:outline-none focus:border-brand-indigo"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="p-1 px-2.5 rounded-lg bg-brand-indigo text-white text-xs font-bold hover:bg-brand-indigo-dark transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {mhsData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-brand-indigo hover:text-rose-600 font-bold ml-1 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* 2. Tautan Portofolio & Repositori Resmi (Vector SVG Icons) */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4">
          <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
            <GlobeVectorIcon size={18} className="text-sky-500" />
            Tautan Portofolio & Repositori Karya
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Tautan langsung ke portofolio online Anda yang dapat dibuka oleh
            klien UMKM saat mengevaluasi proposal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* GitHub */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                <GithubVectorIcon size={16} className="text-slate-800" />
                Profil GitHub
              </label>
              {mhsData.github_url ? (
                <button
                  type="button"
                  onClick={() => handleOpenExternal(mhsData.github_url)}
                  className="text-[11px] text-brand-indigo hover:underline flex items-center gap-0.5"
                >
                  Buka Tautan <ExternalLink className="w-3 h-3" />
                </button>
              ) : null}
            </div>
            <input
              type="url"
              value={mhsData.github_url}
              onChange={(e) =>
                setMhsData({ ...mhsData, github_url: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
              placeholder="https://github.com/username"
            />
          </div>

          {/* Figma */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                <FigmaVectorIcon size={16} />
                Portofolio Desain Figma
              </label>
              {mhsData.figma_url ? (
                <button
                  type="button"
                  onClick={() => handleOpenExternal(mhsData.figma_url)}
                  className="text-[11px] text-brand-indigo hover:underline flex items-center gap-0.5"
                >
                  Buka Tautan <ExternalLink className="w-3 h-3" />
                </button>
              ) : null}
            </div>
            <input
              type="url"
              value={mhsData.figma_url}
              onChange={(e) =>
                setMhsData({ ...mhsData, figma_url: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
              placeholder="https://figma.com/@username"
            />
          </div>

          {/* Website Portfolio */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                <GlobeVectorIcon size={16} className="text-sky-500" />
                Website Portofolio Pribadi
              </label>
              {mhsData.website_url ? (
                <button
                  type="button"
                  onClick={() => handleOpenExternal(mhsData.website_url)}
                  className="text-[11px] text-brand-indigo hover:underline flex items-center gap-0.5"
                >
                  Buka Tautan <ExternalLink className="w-3 h-3" />
                </button>
              ) : null}
            </div>
            <input
              type="url"
              value={mhsData.website_url}
              onChange={(e) =>
                setMhsData({ ...mhsData, website_url: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
              placeholder="https://portofolio-anda.com"
            />
          </div>

          {/* LinkedIn */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                <LinkedinVectorIcon size={16} className="text-[#0A66C2]" />
                Profil LinkedIn
              </label>
              {mhsData.linkedin_url ? (
                <button
                  type="button"
                  onClick={() => handleOpenExternal(mhsData.linkedin_url)}
                  className="text-[11px] text-brand-indigo hover:underline flex items-center gap-0.5"
                >
                  Buka Tautan <ExternalLink className="w-3 h-3" />
                </button>
              ) : null}
            </div>
            <input
              type="url"
              value={mhsData.linkedin_url}
              onChange={(e) =>
                setMhsData({ ...mhsData, linkedin_url: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>
      </Card>

      {/* 3. Rekening Pencairan Honor Bank */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="border-b border-border pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-dark-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-indigo" />
              Rekening Pencairan Honor Terdaftar
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Saldo hasil penyelesaian proyek escrow akan dicairkan ke rekening
              bank ini.
            </p>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
            <Check className="w-3 h-3" /> Rekening Terverifikasi
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900">Nama Bank</label>
            <input
              type="text"
              required
              value={mhsData.nama_bank}
              onChange={(e) =>
                setMhsData({ ...mhsData, nama_bank: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
              placeholder="Contoh: Bank Central Asia (BCA)"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900">
              Nomor Rekening
            </label>
            <input
              type="text"
              required
              value={mhsData.nomor_rekening}
              onChange={(e) =>
                setMhsData({ ...mhsData, nomor_rekening: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo font-mono font-bold"
              placeholder="Contoh: 1234567890"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-dark-900">
              Nama Pemilik Rekening
            </label>
            <input
              type="text"
              required
              value={mhsData.nama_pemilik_rekening}
              onChange={(e) =>
                setMhsData({
                  ...mhsData,
                  nama_pemilik_rekening: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-canvas text-xs sm:text-sm font-sans focus:outline-none focus:border-brand-indigo"
              placeholder="Contoh: Nama sesuai buku tabungan"
            />
          </div>
        </div>
      </Card>
    </>
  );
}
