import { create } from "zustand";
import { notificationApi } from "../api";

function formatRelativeTime(dateString) {
  if (!dateString) return "Baru saja";
  try {
    const diff = Math.floor(
      (Date.now() - new Date(dateString).getTime()) / 1000,
    );
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
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    try {
      set({ loading: true });
      const res = await notificationApi.getMyNotifications({ limit: 30 });
      const raw = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
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

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },

  getRoleNotifications: () => {
    return get().notifications;
  },

  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === String(id) ? { ...n, isRead: true } : n,
      ),
    }));
    try {
      await notificationApi.markAsRead(id);
    } catch {
      // silent fallback
    }
  },

  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
    try {
      await notificationApi.markAllAsRead();
    } catch {
      // silent fallback
    }
  },
}));
