import { create } from "zustand";

let toastTimer = null;

export const useToastStore = create((set) => ({
  toast: null,

  showToast: (message, type = "success") => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: { message, type, id: Date.now() } });
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
