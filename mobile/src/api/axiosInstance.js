import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// 10.0.2.2 untuk Android Emulator, localhost untuk iOS/Web
const DEFAULT_BASE_URL = Platform.OS === "android" 
  ? "http://10.0.2.2:8000/v1" 
  : "http://localhost:8000/v1";

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
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("makarya_access_token");
      await AsyncStorage.removeItem("makarya_user");
    }
    return Promise.reject(error);
  }
);

export default api;