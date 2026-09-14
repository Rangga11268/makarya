import { create } from "zustand";

let toastTimer = null;

export function formatToastMessage(message) {
  if (message === null || message === undefined) return "";
  if (typeof message === "string") return message;

  // Handle array of Pydantic validation errors: [{ msg, loc, type, ... }, ...]
  if (Array.isArray(message)) {
    return message
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const field = Array.isArray(item.loc)
            ? item.loc.filter((l) => l !== "body").join(" ")
            : "";
          if (item.msg) {
            return field ? `${field}: ${item.msg}` : item.msg;
          }
          if (item.message) return item.message;
          if (item.detail) return formatToastMessage(item.detail);
        }
        return String(item);
      })
      .filter(Boolean)
      .join(". ");
  }

  // Handle object errors
  if (typeof message === "object") {
    if (message.detail) return formatToastMessage(message.detail);
    if (message.msg) return String(message.msg);
    if (message.message) return String(message.message);
    if (message.error) return String(message.error);
    try {
      return JSON.stringify(message);
    } catch (_) {
      return "Terjadi kesalahan pada sistem";
    }
  }

  return String(message);
}

export const useToastStore = create((set) => ({
  toast: null,

  showToast: (message, type = "success") => {
    if (toastTimer) clearTimeout(toastTimer);
    const cleanMessage = formatToastMessage(message);
    set({ toast: { message: cleanMessage, type, id: Date.now() } });
    toastTimer = setTimeout(() => {
      set({ toast: null });
      toastTimer = null;
    }, 3800);
  },

  hideToast: () => {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    set({ toast: null });
  },
}));
