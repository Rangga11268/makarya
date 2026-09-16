/**
 * Helper utilitas untuk memuat dan mengelola Midtrans Snap JS SDK secara dinamis.
 */

const SNAP_SANDBOX_URL = "https://app.sandbox.midtrans.com/snap/snap.js";
const SNAP_PRODUCTION_URL = "https://app.midtrans.com/snap/snap.js";

let snapScriptPromise = null;

export function loadMidtransSnap(clientKey, isProduction = false) {
  if (window.snap) {
    return Promise.resolve(window.snap);
  }

  if (snapScriptPromise) {
    return snapScriptPromise;
  }

  snapScriptPromise = new Promise((resolve, reject) => {
    const scriptUrl = isProduction ? SNAP_PRODUCTION_URL : SNAP_SANDBOX_URL;
    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

    if (existingScript) {
      if (window.snap) {
        return resolve(window.snap);
      }
      existingScript.addEventListener("load", () => resolve(window.snap));
      existingScript.addEventListener("error", (err) => reject(err));
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.type = "text/javascript";
    if (clientKey) {
      script.setAttribute("data-client-key", clientKey);
    }
    script.async = true;

    script.onload = () => {
      if (window.snap) {
        resolve(window.snap);
      } else {
        reject(
          new Error(
            "Midtrans Snap SDK script loaded but window.snap is undefined",
          ),
        );
      }
    };

    script.onerror = (err) => {
      snapScriptPromise = null;
      reject(
        new Error(
          `Gagal memuat Midtrans Snap SDK: ${err?.message || "Network Error"}`,
        ),
      );
    };

    document.body.appendChild(script);
  });

  return snapScriptPromise;
}

/**
 * Membuka Popup Pembayaran Midtrans Snap
 * @param {string} snapToken Token transaksi Snap dari backend
 * @param {object} callbacks Callback { onSuccess, onPending, onError, onClose }
 * @param {string} clientKey Midtrans Client Key
 * @param {boolean} isProduction Status environment
 */
export async function payWithSnap(
  snapToken,
  callbacks = {},
  clientKey = "",
  isProduction = false,
) {
  try {
    const snap = await loadMidtransSnap(clientKey, isProduction);
    if (!snap || typeof snap.pay !== "function") {
      throw new Error("Midtrans Snap tidak tersedia.");
    }

    snap.pay(snapToken, {
      onSuccess: (result) => {
        if (callbacks.onSuccess) callbacks.onSuccess(result);
      },
      onPending: (result) => {
        if (callbacks.onPending) callbacks.onPending(result);
      },
      onError: (result) => {
        if (callbacks.onError) callbacks.onError(result);
      },
      onClose: () => {
        if (callbacks.onClose) callbacks.onClose();
      },
    });
  } catch (error) {
    console.error("Error triggering Midtrans Snap:", error);
    if (callbacks.onError) {
      callbacks.onError(error);
    } else {
      throw error;
    }
  }
}
