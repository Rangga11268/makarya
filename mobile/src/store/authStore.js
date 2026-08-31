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
    const { access_token, role, user_id } = res.data;

    const userData = {
      id: user_id,
      email,
      role: role ? role.toUpperCase() : "UMKM",
    };

    await AsyncStorage.setItem("makarya_access_token", access_token);
    await AsyncStorage.setItem("makarya_user", JSON.stringify(userData));

    set({ token: access_token, user: userData, isAuthenticated: true });
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