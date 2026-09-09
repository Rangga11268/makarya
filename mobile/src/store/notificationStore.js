import { create } from "zustand";
import { notificationApi } from "../api";

function formatRelativeTime(dateString) {
  if (!dateString) return "Baru saja";
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 172800) return "Kemarin";
    return `${Math.floor(diff / 86400)} hari lalu`;
  } catch {
    return "Baru saja";
  }
}

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
  notifications: [],
  loading: false,

  getUnreadCount: (role) => {
    const isMhs =
      role === "MHS" || role === "MAHASISWA" || role?.includes?.(".ac.id");
    const targetRole = isMhs ? "MHS" : "UMKM";
    return get().notifications.filter((n) => n.role === targetRole && !n.isRead)
      .length;
  fetchNotifications: async () => {
    try {
      set({ loading: true });
      const res = await notificationApi.getMyNotifications({ limit: 30 });
      const raw = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const normalized = raw.map((n) => ({
        id: String(n.id),
        title: n.judul || n.title || "Pemberitahuan Sistem",
        message: n.pesan || n.message || "",
        type: n.tipe || n.type || "INFO",
        time: formatRelativeTime(n.created_at),
        isRead: Boolean(n.is_read ?? n.isRead),
        url: n.url_referensi,
        createdAt: n.created_at,
      }));
      set({ notifications: normalized, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getRoleNotifications: (role) => {
    const isMhs =
      role === "MHS" || role === "MAHASISWA" || role?.includes?.(".ac.id");
    const targetRole = isMhs ? "MHS" : "UMKM";
    return get().notifications.filter((n) => n.role === targetRole);
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },

  markAsRead: (id) =>
  getRoleNotifications: () => {
    return get().notifications;
  },

  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
        n.id === String(id) ? { ...n, isRead: true } : n,
      ),
    })),
    }));
    try {
      await notificationApi.markAsRead(id);
    } catch {
      // silent fallback
    }
  },

  markAllAsRead: (role) => {
    const isMhs =
      role === "MHS" || role === "MAHASISWA" || role?.includes?.(".ac.id");
    const targetRole = isMhs ? "MHS" : "UMKM";
  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.role === targetRole ? { ...n, isRead: true } : n,
      ),
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
    try {
      await notificationApi.markAllAsRead();
    } catch {
      // silent fallback
    }
  },
}));
