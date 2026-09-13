import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatDate, isExpired } from "../../../utils/formatDate";
import { formatStatus } from "../../../utils/formatStatus";
import { Button } from "../../../components/ui/Button";
import {
  Search,
  Plus,
  ArrowRight,
  Briefcase,
  Users,
  Clock,
  Building2,
} from "lucide-react";

export function WorkspaceHubGrid({
  isUmkm,
  projects = [],
  proposals = [],
  mhsSubmissions = {},
  loading = false,
  searchQuery = "",
  setSearchQuery,
  activeFilter = "ALL",
  setActiveFilter,
  onSelectProject,
  onSelectProposal,
}) {
  // Filter for UMKM projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kategori?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchFilter =
        activeFilter === "ALL" ||
        (activeFilter === "IN_PROGRESS" && p.status === "IN_PROGRESS") ||
        (activeFilter === "COMPLETED" &&
          (p.status === "DONE" || p.status === "COMPLETED")) ||
        (activeFilter === "OPEN" &&
          (p.status === "OPEN" || p.status === "BIDDING"));

      return matchSearch && matchFilter;
    });
  }, [projects, searchQuery, activeFilter]);

  // Filter for Mahasiswa proposals
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const matchSearch =
        (p.cover_letter &&
          p.cover_letter.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.project_judul &&
          p.project_judul.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.project_kategori &&
          p.project_kategori.toLowerCase().includes(searchQuery.toLowerCase()));

      const sub = mhsSubmissions[p.project_id];
      const isApproved = sub?.status === "APPROVED" || p.status === "COMPLETED";

      let matchFilter = true;
      if (activeFilter === "PENDING") {
        matchFilter = p.status === "PENDING";
      } else if (activeFilter === "IN_PROGRESS") {
        matchFilter = p.status === "ACCEPTED" && !isApproved;
      } else if (activeFilter === "COMPLETED") {
        matchFilter =
          isApproved || p.status === "WITHDRAWN" || p.status === "REJECTED";
      }

      return matchSearch && matchFilter;
    });
  }, [proposals, mhsSubmissions, searchQuery, activeFilter]);

  // Counts
  const counts = useMemo(() => {
    if (isUmkm) {
      return {
        all: projects.length,
        inProgress: projects.filter((p) => p.status === "IN_PROGRESS").length,
        open: projects.filter(
          (p) => p.status === "OPEN" || p.status === "BIDDING",
        ).length,
        completed: projects.filter(
          (p) => p.status === "DONE" || p.status === "COMPLETED",
        ).length,
      };
    } else {
      return {
        all: proposals.length,
        inProgress: proposals.filter(
          (p) =>
            p.status === "ACCEPTED" &&
            mhsSubmissions[p.project_id]?.status !== "APPROVED",
        ).length,
        pending: proposals.filter((p) => p.status === "PENDING").length,
        completed: proposals.filter(
          (p) =>
            p.status === "COMPLETED" ||
            mhsSubmissions[p.project_id]?.status === "APPROVED",
        ).length,
      };
    }
  }, [isUmkm, projects, proposals, mhsSubmissions]);

  const tabs = isUmkm
    ? [
        { key: "ALL", label: "Semua Proyek", count: counts.all },
        {
          key: "IN_PROGRESS",
          label: "Sedang Berjalan",
          count: counts.inProgress,
        },
        { key: "OPEN", label: "Seleksi Pelamar", count: counts.open },
        { key: "COMPLETED", label: "Selesai", count: counts.completed },
      ]
    : [
        { key: "ALL", label: "Semua Lamaran", count: counts.all },
        {
          key: "IN_PROGRESS",
          label: "Sedang Dikerjakan",
          count: counts.inProgress,
        },
        { key: "PENDING", label: "Menunggu Seleksi", count: counts.pending },
        { key: "COMPLETED", label: "Selesai", count: counts.completed },
      ];

  const items = isUmkm ? filteredProjects : filteredProposals;

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="bg-surface rounded-3xl border border-border p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isUmkm
                ? "Cari nama proyek atau kategori..."
                : "Cari lamaran, proyek, atau keahlian..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-canvas border border-border rounded-2xl text-dark-900 placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand-indigo font-sans transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`py-1.5 px-3.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
                activeFilter === tab.key
                  ? "bg-dark-900 text-white shadow-xs"
                  : "bg-canvas text-muted hover:text-dark-900 border border-border"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeFilter === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-surface text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}

          {isUmkm && (
            <Link to="/post-project" className="ml-auto md:ml-2">
              <Button
                variant="primary"
                size="sm"
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pasang Proyek</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Grid of Projects */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-surface rounded-3xl border border-border p-6 space-y-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="h-4 bg-slate-200 rounded-md w-20" />
                <div className="h-4 bg-slate-200 rounded-full w-16" />
              </div>
              <div className="h-6 bg-slate-200 rounded-md w-3/4" />
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-8 bg-slate-200 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-surface rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-canvas border border-border flex items-center justify-center text-muted mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-dark-900">
            {isUmkm
              ? "Tidak Ada Proyek yang Sesuai"
              : "Belum Ada Lamaran Proyek"}
          </h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            {isUmkm
              ? "Coba ubah kata kunci pencarian atau tab filter untuk melihat proyek lain."
              : "Jelajahi tawaran proyek terbuka dan ajukan proposal terbaik Anda untuk memulai kolaborasi."}
          </p>
          {isUmkm ? (
            <Link to="/post-project" className="inline-block mt-2">
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                Pasang Proyek Baru
              </Button>
            </Link>
          ) : (
            <Link to="/explore" className="inline-block mt-2">
              <Button variant="primary" size="sm">
                <Search className="w-4 h-4 mr-1.5" />
                Jelajahi Proyek
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isUmkm
            ? filteredProjects.map((proj) => (
                <UmkmProjectGridCard
                  key={proj.id}
                  project={proj}
                  onOpen={() => onSelectProject(proj)}
                />
              ))
            : filteredProposals.map((prop) => (
                <MhsProposalGridCard
                  key={prop.id}
                  proposal={prop}
                  submission={mhsSubmissions[prop.project_id]}
                  onOpen={() => onSelectProposal(prop)}
                />
              ))}
        </div>
      )}
    </div>
  );
}

// Card for UMKM Project in the Catalog Grid
function UmkmProjectGridCard({ project, onOpen }) {
  const isDone = project.status === "DONE" || project.status === "COMPLETED";
  const overdue =
    project.status === "IN_PROGRESS" && isExpired(project.deadline);
  const isInProgress = project.status === "IN_PROGRESS";

  return (
    <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 shadow-xs hover:border-dark-900/30 hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="space-y-3.5">
        {/* Card Header: Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted bg-canvas px-2.5 py-1 rounded-lg border border-border truncate">
            {project.kategori || "UMKM Digital"}
          </span>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
              isDone
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : overdue
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : isInProgress
                    ? "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20"
                    : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {isDone
              ? "Selesai"
              : overdue
                ? "Lewat Tenggat"
                : formatStatus(project.status)}
          </span>
        </div>

        {/* Project Title */}
        <div>
          <h3 className="text-base font-bold text-dark-900 line-clamp-2 leading-snug group-hover:text-brand-indigo transition-colors">
            {project.judul}
          </h3>
          <p className="text-[11px] text-muted mt-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-muted" />
            <span>Dibuat {formatDate(project.created_at)}</span>
          </p>
        </div>

        {/* Partner / Applicant Status Block */}
        <div className="p-3 bg-canvas rounded-2xl border border-border space-y-1.5">
          {project.accepted_mhs_nama ? (
            <div className="flex items-center gap-2.5">
              {project.accepted_mhs_foto ? (
                <img
                  src={project.accepted_mhs_foto}
                  alt={project.accepted_mhs_nama}
                  className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-brand-indigo/10 text-brand-indigo font-bold text-xs flex items-center justify-center shrink-0">
                  {project.accepted_mhs_nama.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-muted uppercase block leading-none">
                  Mahasiswa Pelaksana
                </span>
                <span className="text-xs font-bold text-dark-900 truncate block">
                  {project.accepted_mhs_nama}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-muted shrink-0">
                <Users className="w-3.5 h-3.5 text-brand-indigo" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted uppercase block leading-none">
                  Status Pelamar
                </span>
                <span className="text-xs font-bold text-dark-900">
                  {project.total_pelamar && project.total_pelamar > 0
                    ? `${project.total_pelamar} Proposal Masuk`
                    : "Menunggu Pelamar Pertama"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Budget & Deadline metrics */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className="text-[10px] font-bold text-muted uppercase block">
              Pagu Escrow
            </span>
            <span className="text-xs sm:text-sm font-black text-dark-900">
              {formatCurrency(project.budget_max)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted uppercase block">
              Tenggat Waktu
            </span>
            <span className="text-xs sm:text-sm font-semibold text-dark-900 truncate block">
              {formatDate(project.deadline)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button to open Dedicated Workspace */}
      <div className="pt-4 mt-4 border-t border-border">
        <Button
          onClick={onOpen}
          variant="outline"
          className="w-full py-2.5 rounded-2xl text-xs font-bold text-dark-900 border-border hover:bg-dark-900 hover:text-white hover:border-dark-900 transition-all flex items-center justify-between gap-2 shadow-2xs group-hover:border-dark-900"
        >
          {project.status === "OPEN" || project.status === "BIDDING" ? (
            <span className="flex items-center gap-1.5 text-brand-indigo group-hover:text-white">
              <Users className="w-3.5 h-3.5" />
              <span>Seleksi Pelamar ({project.total_pelamar || 0})</span>
            </span>
          ) : isInProgress ? (
            <span className="flex items-center gap-1.5 text-emerald-700 group-hover:text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Masuk Ruang Kerja</span>
            </span>
          ) : isDone ? (
            <span className="flex items-center gap-1.5 text-slate-700 group-hover:text-white">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Arsip & Faktur Escrow</span>
            </span>
          ) : (
            <span>Buka Detail Proyek</span>
          )}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}

// Card for Mahasiswa Proposal in the Catalog Grid
function MhsProposalGridCard({ proposal, submission, onOpen }) {
  const isAccepted = proposal.status === "ACCEPTED";
  const isDone =
    submission?.status === "APPROVED" || proposal.status === "COMPLETED";
  const overdue =
    isAccepted && isExpired(proposal.project_deadline || proposal.deadline);

  return (
    <div className="bg-surface rounded-3xl border border-border p-5 sm:p-6 shadow-xs hover:border-dark-900/30 hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="space-y-3.5">
        {/* Card Header: Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted bg-canvas px-2.5 py-1 rounded-lg border border-border truncate">
            {proposal.project_kategori || "Proyek Kolaborasi"}
          </span>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
              isDone
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : overdue
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : isAccepted
                    ? "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20"
                    : proposal.status === "REJECTED"
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {isDone
              ? "Selesai"
              : overdue
                ? "Lewat Tenggat"
                : isAccepted
                  ? "Dikerjakan"
                  : proposal.status === "REJECTED"
                    ? "Ditolak"
                    : "Menunggu Seleksi"}
          </span>
        </div>

        {/* Project Title */}
        <div>
          <h3 className="text-base font-bold text-dark-900 line-clamp-2 leading-snug group-hover:text-brand-indigo transition-colors">
            {proposal.project_judul || "Proyek UMKM"}
          </h3>
          <p className="text-[11px] text-muted mt-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-muted" />
            <span>Diajukan {formatDate(proposal.created_at)}</span>
          </p>
        </div>

        {/* Client UMKM Info */}
        <div className="p-3 bg-canvas rounded-2xl border border-border flex items-center gap-2.5">
          {proposal.project_umkm_foto || proposal.umkm_foto ? (
            <img
              src={proposal.project_umkm_foto || proposal.umkm_foto}
              alt="UMKM"
              className="w-7 h-7 rounded-full object-cover border border-border shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-dark-900 shrink-0">
              <Building2 className="w-3.5 h-3.5 text-brand-indigo" />
            </div>
          )}
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-muted uppercase block leading-none">
              Klien UMKM
            </span>
            <span className="text-xs font-bold text-dark-900 truncate block">
              {proposal.project_umkm_nama || proposal.umkm_nama || "Klien UMKM"}
            </span>
          </div>
        </div>

        {/* Tawaran Harga & Estimasi */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <span className="text-[10px] font-bold text-muted uppercase block">
              Nilai Penawaran
            </span>
            <span className="text-xs sm:text-sm font-black text-dark-900">
              {formatCurrency(proposal.harga_tawar)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-muted uppercase block">
              Estimasi Kerja
            </span>
            <span className="text-xs sm:text-sm font-semibold text-dark-900 truncate block">
              {proposal.estimasi_hari || 5} Hari Kerja
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button to open Dedicated Workspace */}
      <div className="pt-4 mt-4 border-t border-border">
        <Button
          onClick={onOpen}
          variant="outline"
          className="w-full py-2.5 rounded-2xl text-xs font-bold text-dark-900 border-border hover:bg-dark-900 hover:text-white hover:border-dark-900 transition-all flex items-center justify-between gap-2 shadow-2xs group-hover:border-dark-900"
        >
          {isAccepted ? (
            <span className="flex items-center gap-1.5 text-emerald-700 group-hover:text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Masuk Ruang Kerja</span>
            </span>
          ) : isDone ? (
            <span className="flex items-center gap-1.5 text-slate-700 group-hover:text-white">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Arsip & Portofolio</span>
            </span>
          ) : proposal.status === "PENDING" ? (
            <span className="flex items-center gap-1.5 text-amber-800 group-hover:text-white">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Lihat Status Lamaran</span>
            </span>
          ) : (
            <span>Rincian Lamaran</span>
          )}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}
