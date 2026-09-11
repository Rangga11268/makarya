// Google OAuth Configuration & Service for Makarya Mobile
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";

// Pastikan sesi browser tertutup saat redirect kembali ke aplikasi
WebBrowser.maybeCompleteAuthSession();

export const GOOGLE_CONFIG = {
  // Client ID untuk Web / Expo AuthSession
  webClientId:
    "140631565393-r5718g9pdbi2dfdo6uoubd3uuge4dfph.apps.googleusercontent.com",
  // Client ID Android dari Google Cloud Console
  androidClientId:
    "140631565393-pi8ebi88nidd7idlp6q1e17jchn56j32.apps.googleusercontent.com",
  // Client ID iOS dari Google Cloud Console
  iosClientId: "YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com",
};

/**
 * Mengambil Client ID yang sesuai dengan platform saat ini
 */
export function getGoogleClientId() {
  // Untuk browser / expo-auth-session flow, Google mewajibkan Web Client ID
  if (
    GOOGLE_CONFIG.webClientId &&
    !GOOGLE_CONFIG.webClientId.startsWith("YOUR_")
  ) {
    return GOOGLE_CONFIG.webClientId;
  }
  if (
    Platform.OS === "android" &&
    GOOGLE_CONFIG.androidClientId &&
    !GOOGLE_CONFIG.androidClientId.startsWith("YOUR_")
  ) {
    return GOOGLE_CONFIG.androidClientId;
  }
  if (
    Platform.OS === "ios" &&
    GOOGLE_CONFIG.iosClientId &&
    !GOOGLE_CONFIG.iosClientId.startsWith("YOUR_")
  ) {
    return GOOGLE_CONFIG.iosClientId;
  }
  return "140631565393-r5718g9pdbi2dfdo6uoubd3uuge4dfph.apps.googleusercontent.com";
}

/**
 * Ekstraksi parameter token dari URL hasil redirect OAuth (hash / query param)
 */
function extractUrlParams(url) {
  if (!url) return {};
  const params = {};
  const regex = /[?&#]([^=#]+)=([^&#]*)/g;
  let match;
  while ((match = regex.exec(url)) !== null) {
    params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }
  return params;
}

/**
 * Service untuk memproses otentikasi Google OAuth nyata secara interaktif.
 * Membuka browser / Chrome Custom Tabs resmi Google agar pengguna dapat
 * memilih akun Google miliknya sendiri.
 *
 * Setelah akun dipilih dan diotorisasi oleh pengguna:
 * 1. Menerima access token dari Google OAuth 2.0 endpoint.
 * 2. Mengambil informasi profil asli pengguna dari Google UserInfo API (email, nama, foto).
 * 3. Mengembalikan payload akun yang siap diproses backend.
 * Akun Google langsung berstatus terverifikasi (is_verified = true) tanpa perlu kode OTP.
 */
export async function initiateGoogleSignIn({ role = "UMKM" } = {}) {
  const clientId = getGoogleClientId();
  const googleRedirectUri = "https://auth.expo.io/@anonymous/makarya-mobile";

  let browserStartUrl = "";
  let browserReturnUrl = "";

  if (Platform.OS === "web") {
    browserReturnUrl =
      typeof window !== "undefined" && window.location
        ? window.location.origin
        : "http://localhost:8081";
    browserStartUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(browserReturnUrl)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent("openid profile email")}&` +
      `prompt=select_account`;
  } else {
    // Di Expo Go, auth.expo.io mewajibkan rute /start untuk menyimpan cookie sesi returnUrl
    const appReturnUrl = AuthSession.getDefaultReturnUrl();
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(googleRedirectUri)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent("openid profile email")}&` +
      `prompt=select_account`;

    browserReturnUrl = appReturnUrl;
    browserStartUrl =
      `https://auth.expo.io/@anonymous/makarya-mobile/start?` +
      `authUrl=${encodeURIComponent(googleAuthUrl)}&` +
      `returnUrl=${encodeURIComponent(appReturnUrl)}`;
  }

  if (__DEV__) {
    console.log("[GoogleOAuth] Client ID:", clientId);
    console.log("[GoogleOAuth] Start URL:", browserStartUrl);
    console.log("[GoogleOAuth] Return URL:", browserReturnUrl);
  }

  // Buka jendela otorisasi interaktif di in-app browser
  const result = await WebBrowser.openAuthSessionAsync(
    browserStartUrl,
    browserReturnUrl,
  );

  if (result.type === "cancel" || result.type === "dismiss") {
    throw new Error("Proses login Google dibatalkan oleh pengguna.");
  }

  if (result.type !== "success" || !result.url) {
    throw new Error("Gagal menyelesaikan otentikasi Google.");
  }

  const params = extractUrlParams(result.url);

  if (
    params.errorCode === "login-declined" ||
    params.error === "access_denied"
  ) {
    throw new Error("Proses login Google dibatalkan oleh pengguna.");
  }

  if (params.error) {
    if (params.error === "redirect_uri_mismatch") {
      throw new Error(
        `Redirect URI (${googleRedirectUri}) belum didaftarkan di Google Cloud Console.`,
      );
    }
    throw new Error(
      params.error_description ||
        params.error ||
        "Otentikasi Google ditolak oleh penyedia layanan.",
    );
  }

  const accessToken = params.access_token;
  if (!accessToken) {
    throw new Error(
      "Access token Google tidak ditemukan pada respons redirect.",
    );
  }

  // Ambil profil asli pengguna langsung dari Google UserInfo API
  const userInfoRes = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!userInfoRes.ok) {
    throw new Error("Gagal mengambil data profil pengguna dari Google.");
  }

  const userInfo = await userInfoRes.json();

  if (!userInfo.email) {
    throw new Error("Email tidak ditemukan pada akun Google yang dipilih.");
  }

  return {
    email: userInfo.email,
    name: userInfo.name || userInfo.given_name || userInfo.email.split("@")[0],
    photo_url:
      userInfo.picture ||
      "https://lh3.googleusercontent.com/a/default-user=s96-c",
    google_id: userInfo.sub,
    role: role || "UMKM",
  };
}
