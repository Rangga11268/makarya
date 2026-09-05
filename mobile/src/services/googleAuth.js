// Google OAuth Configuration & Service for Makarya Mobile
// Note: API Key / Client ID dapat diisi pada konstanta berikut saat didaftarkan di Google Cloud Console.

export const GOOGLE_CONFIG = {
  webClientId: "YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com",
  androidClientId: "YOUR_GOOGLE_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  iosClientId: "YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com",
};

/**
 * Service untuk memproses otentikasi Google OAuth.
 * Karena akun Google sudah terverifikasi dari penyedia,
 * pengguna langsung dapat mengakses aplikasi tanpa harus melewati OTP.
 */
export async function initiateGoogleSignIn({ role = "UMKM", preferredEmail = null } = {}) {
  // Simulasi response Google OAuth payload (siap diganti dengan GoogleSignin.signIn() native saat credentials terpasang)
  const simulatedGoogleUser = {
    email: preferredEmail || "pengguna.google@gmail.com",
    name: "Pengguna Google Makarya",
    photo_url: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    role: role || "UMKM",
  };

  return simulatedGoogleUser;
}
