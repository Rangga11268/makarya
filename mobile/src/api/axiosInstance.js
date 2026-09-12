import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Otomatis deteksi IP lokal jika menggunakan Expo Go di HP fisik, fallback ke 10.0.2.2 / localhost
const getBaseUrl = () => {
  // Jika dibuka di browser web (Expo Web di Chrome / Microsoft Edge)
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && window.location?.hostname) {
      return `http://${window.location.hostname}:8000/v1`;
    }
    return "http://localhost:8000/v1";
  }

  // Deteksi IP host otomatis dari Expo Go (HP fisik di jaringan Wi-Fi lokal)
  const debuggerHost =
    Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(":")[0];
    if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
      return `http://${ip}:8000/v1`;
    }
  }

  // Fallback Android Emulator (10.0.2.2) atau iOS Simulator / localhost
  return Platform.OS === "android"
    ? "http://10.0.2.2:8000/v1"
    : "http://localhost:8000/v1";
};

const DEFAULT_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("makarya_access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Gagal membaca token:", e);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem(
          "makarya_refresh_token",
        );
        if (refreshToken) {
          const res = await axios.post(
            `${DEFAULT_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken },
            { timeout: 10000 },
          );
          const newAccessToken = res.data?.access_token;
          if (newAccessToken) {
            await AsyncStorage.setItem("makarya_access_token", newAccessToken);
            try {
              const { useAuthStore } = require("../store/authStore");
              useAuthStore.getState().updateToken(newAccessToken);
            } catch (_) {}
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshErr) {
        // Refresh token truly invalid/expired, proceed to safe session cleanup
        try {
          await AsyncStorage.removeItem("makarya_access_token");
          await AsyncStorage.removeItem("makarya_refresh_token");
          await AsyncStorage.removeItem("makarya_user");
          const { useAuthStore } = require("../store/authStore");
          useAuthStore.getState().logout(true);
        } catch (_) {}
      }
    }
    return Promise.reject(error);
  },
);

export default api;
