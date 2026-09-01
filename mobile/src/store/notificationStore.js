import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  notifications: [
    {
      id: "1",
      title: "Proposal Diterima!",
      message:
        "Klien UMKM Kopi Nusantara telah menerima tawaran Anda. Dana escrow Rp 500.000 telah dikunci aman.",
      type: "SUCCESS",
      time: "10 menit yang lalu",
      isRead: false,
      role: "MHS",
    },
    {
      id: "2",
      title: "Pencairan Honor Berhasil",
      message:
        "Honor pengerjaan proyek 'Redesign Landing Page' sebesar Rp 850.000 telah masuk ke saldo aktif dompet Anda.",
      type: "PAYMENT",
      time: "2 jam yang lalu",
      isRead: false,
      role: "MHS",
    },
    {
      id: "3",
      title: "Proyek Baru Tersedia",
      message:
        "UMKM Batik Trusmi menerbitkan proyek baru: 'Desain Katalog Digital'. Segera ajukan penawaran terbaikmu!",
      type: "INFO",
      time: "5 jam yang lalu",
      isRead: true,
      role: "MHS",
    },
    {
      id: "4",
      title: "Proposal Baru Masuk!",
      message:
        "Mahasiswa Darell Rangga Putra mengajukan proposal pada proyek 'Desain Kemasan Botol Kopi & Logo'.",
      type: "PROPOSAL",
      time: "15 menit yang lalu",
      isRead: false,
      role: "UMKM",
    },
    {
      id: "5",
      title: "Hasil Pengerjaan Diunggah",
      message:
        "Mahasiswa telah mengirimkan file final deliverable untuk di-review dan disetujui.",
      type: "SUBMISSION",
      time: "1 jam yang lalu",
      isRead: false,
      role: "UMKM",
    },
  ],

  getUnreadCount: (role) => {
    const isMhs =
      role === "MHS" || role === "MAHASISWA" || role?.includes?.(".ac.id");
    const targetRole = isMhs ? "MHS" : "UMKM";
    return get().notifications.filter((n) => n.role === targetRole && !n.isRead)
      .length;
  },

  getRoleNotifications: (role) => {
    const isMhs =
      role === "MHS" || role === "MAHASISWA" || role?.includes?.(".ac.id");
    const targetRole = isMhs ? "MHS" : "UMKM";
    return get().notifications.filter((n) => n.role === targetRole);
  },

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      ),
    })),

  markAllAsRead: (role) => {
    const isMhs =
      role === "MHS" || role === "MAHASISWA" || role?.includes?.(".ac.id");
    const targetRole = isMhs ? "MHS" : "UMKM";
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.role === targetRole ? { ...n, isRead: true } : n,
      ),
    }));
  },
}));
