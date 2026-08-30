import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("makarya_user")) || null,
  accessToken: localStorage.getItem("makarya_token") || null,
  refreshToken: localStorage.getItem("makarya_refresh_token") || null,
  isAuthenticated: !!localStorage.getItem("makarya_token"),

  setAuth: (tokenData) => {
    const user = {
      id: tokenData.user_id,
      email: tokenData.email,
      role: tokenData.role,
      is_verified: tokenData.is_verified,
    };
    localStorage.setItem("makarya_token", tokenData.access_token);
    if (tokenData.refresh_token) {
      localStorage.setItem("makarya_refresh_token", tokenData.refresh_token);
    }
    localStorage.setItem("makarya_user", JSON.stringify(user));

    set({
      user,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || get().refreshToken,
      isAuthenticated: true,
    });
  },

  updateToken: (newToken) => {
    localStorage.setItem("makarya_token", newToken);
    set({ accessToken: newToken });
  },

  logout: () => {
    localStorage.removeItem("makarya_token");
    localStorage.removeItem("makarya_refresh_token");
    localStorage.removeItem("makarya_user");
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));
