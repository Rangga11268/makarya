export const STATUS_LABELS = {
  // Project Status
  OPEN: "Terbuka",
  BIDDING: "Masa Penawaran",
  IN_PROGRESS: "Sedang Dikerjakan",
  REVIEW: "Dalam Peninjauan",
  DONE: "Selesai",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",

  // Proposal Status
  PENDING: "Menunggu Keputusan",
  ACCEPTED: "Disetujui",
  REJECTED: "Ditolak",
  WITHDRAWN: "Ditarik",

  // Submission Status
  SUBMITTED: "Hasil Diserahkan",
  REVISION_REQUESTED: "Permintaan Revisi",

  // Transaction / Ledger Types
  TOPUP: "Deposit Saldo",
  HOLD: "Escrow Dikunci",
  RELEASE: "Pencairan Escrow",
  WITHDRAW: "Tarik Dana",
  REFUND: "Pengembalian Dana",
};

export function formatStatus(status) {
  if (!status) return "-";
  return STATUS_LABELS[status] || status;
}