import { create } from "zustand";

export const useDialogStore = create((set) => ({
  isOpen: false,
  title: "",
  message: "",
  type: "info", // 'success' | 'error' | 'warning' | 'info' | 'confirm' | 'danger'
  confirmText: "Oke",
  cancelText: "Batal",
  showCancel: false,
  onConfirm: null,
  onCancel: null,

  showAlert: ({
    title = "Pemberitahuan",
    message = "",
    type = "info",
    confirmText = "Mengerti",
    isDestructive = false,
    icon = null,
    onConfirm = null,
  }) => {
    set({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText: "",
      showCancel: false,
      isDestructive: Boolean(
        isDestructive || type === "danger" || type === "error",
      ),
      icon,
      onConfirm,
      onCancel: null,
    });
  },

  showConfirm: ({
    title = "Konfirmasi Tindakan",
    message = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
    type = "warning",
    confirmText = "Lanjutkan",
    cancelText = "Batal",
    isDestructive = false,
    icon = null,
    onConfirm = null,
    onCancel = null,
  }) => {
    set({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      showCancel: true,
      isDestructive: Boolean(
        isDestructive || type === "danger" || type === "error",
      ),
      icon,
      onConfirm,
      onCancel,
    });
  },

  closeDialog: () => {
    set({
      isOpen: false,
      title: "",
      message: "",
      type: "info",
      isDestructive: false,
      icon: null,
      onConfirm: null,
      onCancel: null,
    });
  },
}));

// Convenient helper hook / export
export const showAlert = (opts) => useDialogStore.getState().showAlert(opts);
export const showConfirm = (opts) =>
  useDialogStore.getState().showConfirm(opts);
