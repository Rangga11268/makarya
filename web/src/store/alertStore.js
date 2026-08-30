import { create } from "zustand";

export const useAlertStore = create((set) => ({
  isOpen: false,
  type: "info", // "success" | "error" | "warning" | "info" | "confirm"
  title: "",
  message: "",
  confirmText: "Mengerti",
  cancelText: "Batal",
  showCancel: false,
  isDestructive: false,
  onConfirm: null,
  onCancel: null,

  showAlert: ({
    title,
    message,
    type = "info",
    confirmText = "Mengerti",
    cancelText = "Batal",
    showCancel = false,
    isDestructive = false,
    onConfirm = null,
    onCancel = null,
  }) =>
    set({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      showCancel: showCancel || type === "confirm",
      isDestructive,
      onConfirm,
      onCancel,
    }),

  showSuccess: (title, message, onConfirm) =>
    set({
      isOpen: true,
      type: "success",
      title,
      message: message || "",
      confirmText: "Mengerti",
      showCancel: false,
      onConfirm,
    }),

  showError: (title, message, onConfirm) =>
    set({
      isOpen: true,
      type: "error",
      title,
      message: message || "",
      confirmText: "Tutup",
      showCancel: false,
      onConfirm,
    }),

  showWarning: (title, message, onConfirm) =>
    set({
      isOpen: true,
      type: "warning",
      title,
      message: message || "",
      confirmText: "Lanjutkan",
      showCancel: false,
      onConfirm,
    }),

  showInfo: (title, message, onConfirm) =>
    set({
      isOpen: true,
      type: "info",
      title,
      message: message || "",
      confirmText: "Oke",
      showCancel: false,
      onConfirm,
    }),

  showConfirm: (title, message, onConfirm, onCancel, isDestructive = false) =>
    set({
      isOpen: true,
      type: "confirm",
      title,
      message: message || "",
      confirmText: isDestructive ? "Ya, Lanjutkan" : "Konfirmasi",
      cancelText: "Batal",
      showCancel: true,
      isDestructive,
      onConfirm,
      onCancel,
    }),

  hideAlert: () => set({ isOpen: false }),
}));