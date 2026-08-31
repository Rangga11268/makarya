import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border font-sans select-none ${className}`}
    >
      {/* Information text */}
      <div className="text-xs text-muted">
        Menampilkan{" "}
        <span className="font-bold text-dark-900">{startItem}</span> -{" "}
        <span className="font-bold text-dark-900">{endItem}</span> dari{" "}
        <span className="font-bold text-dark-900">{totalItems}</span> data
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center p-2 rounded-xl border border-border bg-surface text-dark-900 hover:bg-canvas disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-2 py-1 text-xs text-muted font-bold tracking-wider"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              type="button"
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={`min-w-[34px] h-[34px] text-xs font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                isActive
                  ? "bg-dark-900 text-white shadow-xs"
                  : "border border-border bg-surface text-dark-900 hover:bg-canvas"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="inline-flex items-center justify-center p-2 rounded-xl border border-border bg-surface text-dark-900 hover:bg-canvas disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs cursor-pointer"
          aria-label="Halaman Selanjutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}