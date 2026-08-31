import { create } from "zustand";

export const useToastStore = create((set) => ({
  toast: null,

  showToast: (message, type = "success") => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => {
      set({ toast: null });
    }, 3500);
  },

  hideToast: () => set({ toast: null }),
}));