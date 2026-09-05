import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Otomatis deteksi IP lokal jika menggunakan Expo Go di HP fisik, fallback ke 10.0.2.2 / localhost
const getBaseUrl = () => {
  const debuggerHost =
    Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (debuggerHost) {
    const ip = debuggerHost.split(":")[0];
    if (ip && ip !== "localhost" && ip !== "127.0.0.1") {
      return `http://${ip}:8000/v1`;
    }
  }
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

let isRetrying = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRetrying
    ) {
      originalRequest._retry = true;
      isRetrying = true;
      try {
        const { useAuthStore } = require("../store/authStore");
        const newToken = await useAuthStore.getState().relogin();
        isRetrying = false;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (_) {
        isRetrying = false;
      }
      await AsyncStorage.removeItem("makarya_access_token");
      await AsyncStorage.removeItem("makarya_user");
    }
    return Promise.reject(error);
  },
);

export default api;
