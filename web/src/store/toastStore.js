import { create } from "zustand";

const FIELD_MAP = {
  email: "Alamat Email",
  password: "Kata Sandi",
  password_hash: "Kata Sandi",
  nama_lengkap: "Nama Lengkap",
  nama_usaha: "Nama Usaha",
  no_telepon: "Nomor Telepon",
  phone: "Nomor Telepon",
  nim: "NIM",
  prodi: "Program Studi",
  semester: "Semester",
  judul: "Judul Proyek",
  deskripsi: "Deskripsi",
  anggaran: "Anggaran",
  alokasi_budget: "Alokasi Anggaran",
  nominal: "Nominal Saldo",
  deadline: "Tenggat Waktu",
  deadline_days: "Durasi Pengerjaan",
  attachment_url: "Tautan Lampiran",
  attachment_type: "Tipe Lampiran",
  message: "Pesan",
  catatan: "Catatan",
  review: "Ulasan",
  rating: "Penilaian Rating",
};

function cleanRawMessage(rawText, rawField = "") {
  if (!rawText || typeof rawText !== "string") return "";
  let text = rawText.trim();
  const fieldName =
    FIELD_MAP[rawField.toLowerCase()] ||
    (rawField ? rawField.charAt(0).toUpperCase() + rawField.slice(1) : "");

  // 1. Email validation errors
  if (
    /value is not a valid email address/i.test(text) ||
    /cannot have two periods/i.test(text) ||
    /not a valid email/i.test(text) ||
    (text.toLowerCase().startsWith("email:") && /valid email/i.test(text))
  ) {
    return "Format email tidak valid. Pastikan penulisan email sudah benar (contoh: nama@domain.com).";
  }

  // 2. Missing / required fields
  if (/field required/i.test(text) || /missing/i.test(text)) {
    return fieldName
      ? `${fieldName} wajib diisi.`
      : "Mohon lengkapi formulir yang masih kosong.";
  }

  // 3. String length errors
  const minMatch = text.match(/at least (\d+) characters?/i);
  if (minMatch) {
    return fieldName
      ? `${fieldName} harus minimal ${minMatch[1]} karakter.`
      : `Isian harus minimal ${minMatch[1]} karakter.`;
  }
  const maxMatch =
    text.match(/at most (\d+) characters?/i) || text.match(/string_too_long/i);
  if (maxMatch) {
    return fieldName
      ? `${fieldName} melebihi batas maksimal karakter.`
      : "Isian melebihi batas maksimal karakter.";
  }

  // 4. Number / Integer errors
  if (
    /valid integer/i.test(text) ||
    /valid number/i.test(text) ||
    /valid float/i.test(text)
  ) {
    return fieldName
      ? `${fieldName} harus berupa angka valid.`
      : "Isian harus berupa angka yang valid.";
  }

  // 5. Network errors
  if (/network error/i.test(text) || /err_network/i.test(text)) {
    return "Koneksi ke server terputus. Pastikan koneksi internet Anda aktif.";
  }
  if (/timeout/i.test(text)) {
    return "Waktu permintaan habis. Silakan coba beberapa saat lagi.";
  }

  // 6. Strip technical error codes
  if (text.includes("value_error.") || text.includes("type_error.")) {
    return "Format data yang dimasukkan tidak valid.";
  }
  text = text.replace(/^Value error,\s*/i, "");

  return fieldName && !text.toLowerCase().includes(fieldName.toLowerCase())
    ? `${fieldName}: ${text}`
    : text;
}

export function formatToastMessage(message) {
  if (message === null || message === undefined) return "";
  if (typeof message === "string") return cleanRawMessage(message);

  // Handle array of Pydantic validation errors: [{ msg, loc, type, ... }, ...]
  if (Array.isArray(message)) {
    const formatted = message
      .map((item) => {
        if (typeof item === "string") return cleanRawMessage(item);
        if (item && typeof item === "object") {
          const field = Array.isArray(item.loc)
            ? item.loc.filter((l) => l !== "body").join(" ")
            : "";
          if (item.msg) {
            return cleanRawMessage(item.msg, field);
          }
          if (item.message) return cleanRawMessage(item.message, field);
          if (item.detail) return formatToastMessage(item.detail);
        }
        return cleanRawMessage(String(item));
      })
      .filter(Boolean);

    // Remove duplicates and join cleanly
    return (
      Array.from(new Set(formatted))
        .map((s) => s.replace(/\.+$/, ""))
        .join(". ") + "."
    );
  }

  // Handle object errors
  if (typeof message === "object") {
    if (message.detail) return formatToastMessage(message.detail);
    if (message.msg) return cleanRawMessage(message.msg);
    if (message.message) return cleanRawMessage(message.message);
    if (message.error) return cleanRawMessage(message.error);
    try {
      return JSON.stringify(message);
    } catch (_) {
      return "Terjadi kesalahan pada sistem. Silakan coba kembali.";
    }
  }

  return cleanRawMessage(String(message));
}

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = "success", duration = 3500) => {
    const id = Date.now().toString();
    const cleanMessage = formatToastMessage(message);
    set((state) => ({
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
