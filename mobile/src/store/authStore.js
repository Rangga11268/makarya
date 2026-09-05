import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../api";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  relogin: async () => {
    try {
      const userStr = await AsyncStorage.getItem("makarya_user");
      let email = "darell@ubsi.ac.id";
      if (userStr) {
        try {
          const parsed = JSON.parse(userStr);
          if (parsed?.email) email = parsed.email;
        } catch (_) {}
      }
      const res = await authApi.login({ email, password: "password123" });
      const { access_token, role, user_id, is_verified } = res.data;

      let userData = {
        id: user_id,
        email,
        role: role ? role.toUpperCase() : "MAHASISWA",
        is_verified: !!is_verified,
      };

      await AsyncStorage.setItem("makarya_access_token", access_token);
      await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));

      try {
        const meRes = await authApi.getMe();
        userData = { ...userData, ...meRes.data };
        await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));
      } catch (_) {}

      set({ token: access_token, user: userData, isAuthenticated: true });
      return access_token;
    } catch (e) {
      console.warn("relogin failed:", e.message);
      return null;
    }
  },

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
            // Refresh/relogin if token expired
            await get().relogin();
          }
        }
      } else {
        // Auto-authenticate Darell in local dev if no session exists yet
        await get().relogin();
      }
    } catch (e) {
      set({ token: null, user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    const { access_token, role, user_id, is_verified } = res.data;

    let userData = {
      id: user_id,
      email,
      role: role ? role.toUpperCase() : "MAHASISWA",
      is_verified: !!is_verified,
    };

    await AsyncStorage.setItem("makarya_access_token", access_token);
    await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));

    set({ token: access_token, user: userData, isAuthenticated: true });

    // Fetch full profile info (name, university/business)
    try {
      const meRes = await authApi.getMe();
      userData = { ...userData, ...meRes.data };
      await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));
      set({ user: userData });
    } catch (_) {}

    return userData;
  },

  registerUmkm: async (data) => {
    const res = await authApi.registerUmkm(data);
    const { access_token, role, user_id } = res.data;

    const userData = {
      id: user_id,
      email: data.email,
      role: "UMKM",
      nama_usaha: data.nama_usaha,
    };

    await AsyncStorage.setItem("makarya_access_token", access_token);
    await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));

    set({ token: access_token, user: userData, isAuthenticated: true });
    return userData;
  },

  logout: async () => {
    await AsyncStorage.removeItem("makarya_access_token");
    await AsyncStorage.removeItem("makarya_user");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
