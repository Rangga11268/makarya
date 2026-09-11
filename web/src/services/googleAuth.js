// Google OAuth 2.0 Service for Makarya Web (Google Identity Services)
export const GOOGLE_CONFIG = {
  clientId:
    import.meta.env?.VITE_GOOGLE_CLIENT_ID ||
    "140631565393-i99hoe6paaujpmi6gieht7eet2tsautv.apps.googleusercontent.com",
};

/**
 * Memastikan script Google Identity Services (GIS) terpasang di window
 */
function ensureGsiScriptLoaded() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve(window.google);
      return;
    }

    // Cek jika script sudah ada di DOM tapi belum selesai load
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google));
      existingScript.addEventListener("error", () =>
        reject(new Error("Gagal memuat Google Identity Services SDK")),
      );
      return;
    }

    // Buat script tag baru jika belum ada
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () =>
      reject(new Error("Gagal memuat Google Identity Services SDK"));
    document.head.appendChild(script);
  });
}

/**
 * Membuka jendela dialog resmi Google Account Chooser secara interaktif.
 * Menggunakan token client Google OAuth 2.0 (GIS) untuk web SPA.
 *
 * @param {Object} options
 * @param {string} [options.role="UMKM"] - Role yang ditargetkan (UMKM / MHS)
 * @returns {Promise<{email: string, name: string, photo_url: string, google_id: string, role: string}>}
 */
export async function initiateGoogleWebSignIn({ role = "UMKM" } = {}) {
  await ensureGsiScriptLoaded();

  if (!window.google?.accounts?.oauth2) {
    throw new Error(
      "Layanan Google Sign-In tidak dapat diinisialisasi pada browser Anda.",
    );
  }

  return new Promise((resolve, reject) => {
    try {
      let isHandled = false;

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.clientId,
        scope: "openid email profile",
        prompt: "select_account",
        callback: async (tokenResponse) => {
          if (isHandled) return;
          isHandled = true;

          if (tokenResponse.error) {
            if (
              tokenResponse.error === "popup_closed_by_user" ||
              tokenResponse.error === "access_denied"
            ) {
              reject(
                new Error("Proses login Google dibatalkan oleh pengguna."),
              );
              return;
            }
            if (tokenResponse.error === "origin_mismatch") {
              reject(
                new Error(
                  `Origin (${window.location.origin}) belum terdaftar pada Authorized JavaScript origins di Google Cloud Console.`,
                ),
              );
              return;
            }
            reject(
              new Error(
                tokenResponse.error_description ||
                  `Otentikasi Google gagal: ${tokenResponse.error}`,
              ),
            );
            return;
          }

          const accessToken = tokenResponse.access_token;
          if (!accessToken) {
            reject(new Error("Tidak menerima Access Token dari Google."));
            return;
          }

          try {
            // Ambil data profil terverifikasi langsung dari Google UserInfo endpoint
            const userInfoRes = await fetch(
              "https://www.googleapis.com/oauth2/v3/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (!userInfoRes.ok) {
              reject(
                new Error("Gagal mengambil data profil pengguna dari Google."),
              );
              return;
            }

            const userInfo = await userInfoRes.json();

            if (!userInfo.email) {
              reject(
                new Error(
                  "Email tidak ditemukan pada akun Google yang dipilih.",
                ),
              );
              return;
            }

            resolve({
              email: userInfo.email,
              name:
                userInfo.name ||
                userInfo.given_name ||
                userInfo.email.split("@")[0],
              photo_url:
                userInfo.picture ||
                "https://lh3.googleusercontent.com/a/default-user=s96-c",
              google_id: userInfo.sub,
              role: role || "UMKM",
            });
          } catch (fetchErr) {
            reject(
              new Error(
                fetchErr.message ||
                  "Gagal menghubungi server Google untuk mengambil profil.",
              ),
            );
          }
        },
        error_callback: (err) => {
          if (isHandled) return;
          isHandled = true;
          if (err.type === "popup_closed") {
            reject(new Error("Proses login Google dibatalkan oleh pengguna."));
            return;
          }
          reject(new Error(err.message || "Dialog Google Sign-In ditutup."));
        },
      });

      // Minta access token ke Google (membuka popup interaktif)
      tokenClient.requestAccessToken();
    } catch (err) {
      reject(err);
    }
  });
}
