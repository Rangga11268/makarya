import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  initializeAuth: async () => {
    try {
      set({ loading: true });
      const token = await AsyncStorage.getItem("makarya_access_token");
      const userStr = await AsyncStorage.getItem("makarya_user");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ token, user, isAuthenticated: true });

        // Fetch latest profile in background
        try {
          const meRes = await authApi.getMe();
          const updatedUser = { ...user, ...meRes.data };
          await AsyncStorage.setItem(
            "makarya_user",
            JSON.stringify(updatedUser),
          );
          set({ user: updatedUser });
        } catch (err) {
          if (err.response?.status === 401) {
            await get().logout(true);
          }
        }
      } else {
        set({ token: null, user: null, isAuthenticated: false });
      }
    } catch (e) {
      set({ token: null, user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    const { access_token, refresh_token, role, user_id, is_verified } = res.data;

    let userData = {
      id: user_id,
      email,
      role: role ? role.toUpperCase() : "MAHASISWA",
      is_verified: !!is_verified,
    };

    await AsyncStorage.setItem("makarya_access_token", access_token);
    if (refresh_token) {
      await AsyncStorage.setItem("makarya_refresh_token", refresh_token);
    }
    await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));

    set({ token: access_token, user: userData, isAuthenticated: true });

    // Fetch full profile info
    try {
      const meRes = await authApi.getMe();
      userData = { ...userData, ...meRes.data };
      await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));
      set({ user: userData });
    } catch (_) {}

    return userData;
  },

  // Register UMKM (tanpa auto-authenticate agar masuk ke alur verifikasi OTP)
  registerUmkm: async (data) => {
    const res = await authApi.registerUmkm(data);
    return {
      user_id: res.data.user_id,
      email: data.email,
      role: "UMKM",
      is_verified: false,
    };
  },

  // Register Mahasiswa (tanpa auto-authenticate agar masuk ke alur verifikasi OTP)
  registerMhs: async (data) => {
    const res = await authApi.registerMhs(data);
    return {
      user_id: res.data.user_id,
      email: data.email,
      role: "MAHASISWA",
      is_verified: false,
    };
  },

  // Verifikasi kode OTP setelah registrasi
  verifyOtp: async (email, otp_code) => {
    const res = await authApi.verifyOtp({ email, otp_code });
    const { access_token, refresh_token, role, user_id, is_verified } = res.data;

    let userData = {
      id: user_id,
      email,
      role: role ? role.toUpperCase() : "UMKM",
      is_verified: !!is_verified,
    };

    await AsyncStorage.setItem("makarya_access_token", access_token);
    if (refresh_token) {
      await AsyncStorage.setItem("makarya_refresh_token", refresh_token);
    }
    await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));

    set({ token: access_token, user: userData, isAuthenticated: true });

    try {
      const meRes = await authApi.getMe();
      userData = { ...userData, ...meRes.data };
      await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));
      set({ user: userData });
    } catch (_) {}

    return userData;
  },

  resendOtp: async (email) => {
    const res = await authApi.resendOtp({ email });
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await authApi.forgotPassword({ email });
    return res.data;
  },

  resetPassword: async (email, otp_code, new_password) => {
    const res = await authApi.resetPassword({ email, otp_code, new_password });
    return res.data;
  },

  // Google OAuth (Bypass OTP verification karena akun Google sudah terverifikasi)
  loginWithGoogle: async ({ email, name, photo_url, role = "UMKM" }) => {
    const res = await authApi.googleAuth({
      email,
      name,
      photo_url,
      role: role ? role.toUpperCase() : "UMKM",
    });

    const { access_token, refresh_token, user_id, is_verified } = res.data;

    let userData = {
      id: user_id,
      email,
      role: role ? role.toUpperCase() : "UMKM",
      is_verified: !!is_verified,
    };

    await AsyncStorage.setItem("makarya_access_token", access_token);
    if (refresh_token) {
      await AsyncStorage.setItem("makarya_refresh_token", refresh_token);
    }
    await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));

    set({ token: access_token, user: userData, isAuthenticated: true });

    try {
      const meRes = await authApi.getMe();
      userData = { ...userData, ...meRes.data };
      await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));
      set({ user: userData });
    } catch (_) {}

    return userData;
  },

  logout: async (silent = false) => {
    try {
      await AsyncStorage.removeItem("makarya_access_token");
      await AsyncStorage.removeItem("makarya_refresh_token");
      await AsyncStorage.removeItem("makarya_user");
    } catch (_) {}
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
