import { create } from "zustand";

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
  toasts: [],

  addToast: (message, type = "success", duration = 3500) => {
    const id = Date.now().toString();
    const cleanMessage = formatToastMessage(message);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
      toasts: [...state.toasts, { id, message: cleanMessage, type }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
