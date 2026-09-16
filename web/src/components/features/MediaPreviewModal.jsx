import React from "react";
import {
  X,
  ExternalLink,
  FileText,
  Palette,
  FileCode,
  Globe,
  FolderArchive,
  Download,
  Eye,
  Maximize2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export function MediaPreviewModal({ isOpen, onClose, url, title, roleName }) {
  if (!isOpen || !url) return null;

  const lowerUrl = url.toLowerCase();
  const isImage = /\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i.test(lowerUrl);
  const isPdf = /\.pdf($|\?)/i.test(lowerUrl) || lowerUrl.includes("/pdf");
  const isVideo = /\.(mp4|webm|ogg)($|\?)/i.test(lowerUrl);
  const isFigma = lowerUrl.includes("figma.com");
  const isGithub = lowerUrl.includes("github.com") || lowerUrl.includes("gitlab.com");
  const isDrive = lowerUrl.includes("drive.google.com") || lowerUrl.includes("dropbox.com");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-4xl rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-dark-900 truncate">
                {title || "Pratinjau Deliverable Hasil Kerja"}
              </h3>
              {roleName && (
                <span className="text-[11px] font-semibold text-brand-indigo block">
                  Peran: {roleName}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-white hover:bg-slate-100 text-xs font-semibold text-dark-900 shadow-2xs transition-colors"
            >
              <span>Buka di Tab Baru</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-dark-900 rounded-lg hover:bg-slate-200/60 transition-colors"
              aria-label="Tutup pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content Body */}
        <div className="p-6 bg-slate-900/5 flex-1 overflow-auto flex items-center justify-center min-h-[360px]">
          {isImage ? (
            <div className="max-w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
              <img
                src={url}
                alt={title || "Deliverable"}
                className="max-w-full max-h-[65vh] object-contain rounded-xl"
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={url}
              title="PDF Deliverable Preview"
              className="w-full h-[65vh] rounded-2xl border border-slate-200 bg-white"
            />
          ) : isVideo ? (
            <video
              src={url}
              controls
              autoPlay
              className="max-w-full max-h-[65vh] rounded-2xl shadow-lg"
            />
          ) : isFigma ? (
            <div className="w-full text-center space-y-4 p-8 bg-surface rounded-2xl border border-border shadow-xs max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mx-auto shadow-xs">
                <Palette className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-dark-900">Kanvas Desain Figma</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Kanvas desain Figma dilindungi oleh sistem otentikasi browser. Buka tautan untuk langsung memeriksa wireframe, UI components, dan prototype interaktif.
                </p>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Buka Kanvas Figma</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : isGithub ? (
            <div className="w-full text-center space-y-4 p-8 bg-surface rounded-2xl border border-border shadow-xs max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 flex items-center justify-center mx-auto shadow-xs">
                <FileCode className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-dark-900">Repositori Kode Sumber</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Repositori kode program, struktur branch, dan dokumentasi README siap diinspeksi.
                </p>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Buka Repositori GitHub</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : isDrive ? (
            <div className="w-full text-center space-y-4 p-8 bg-surface rounded-2xl border border-border shadow-xs max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                <FolderArchive className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-dark-900">Cloud Storage Berkas Master</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Folder arsip berkas resolusi tinggi, asset grafis, dan dokumentasi pengerjaan proyek.
                </p>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Akses Google Drive</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="w-full text-center space-y-4 p-8 bg-surface rounded-2xl border border-border shadow-xs max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <Globe className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-dark-900">Live Demo & Tautan Eksternal</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Aplikasi web atau demo interaktif yang dapat dicoba secara langsung.
                </p>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <span>Buka Live Demo</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-border flex items-center justify-between text-xs text-muted">
          <span className="font-mono truncate max-w-md">{url}</span>
          <Button variant="secondary" size="sm" onClick={onClose} className="text-xs font-semibold">
            Tutup
          </Button>
        </div>

      </div>
    </div>
  );
}
