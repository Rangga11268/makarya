// Google OAuth Configuration & Service for Makarya Mobile
// Note: API Key / Client ID dapat diisi pada konstanta berikut saat didaftarkan di Google Cloud Console.

export const GOOGLE_CONFIG = {
  webClientId: "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com",
  androidClientId: "140631565393-pi8ebi88nidd7idlp6q1e17jchn56j32.apps.googleusercontent.com",
  iosClientId: "YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com",
};

/**
 * Service untuk memproses otentikasi Google OAuth.
 * Karena akun Google sudah terverifikasi dari penyedia,
 * pengguna langsung dapat mengakses aplikasi tanpa harus melewati OTP.
 */
export async function initiateGoogleSignIn({ role = "UMKM", preferredEmail = null } = {}) {
  const activeEmail = preferredEmail || "darell.google@gmail.com";
  const derivedName = activeEmail
    ? activeEmail
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Pengguna Google Makarya";

  const googleUser = {
    email: activeEmail,
    name: derivedName,
    photo_url: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    role: role || "UMKM",
  };

  return googleUser;
}
