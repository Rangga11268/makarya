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
      nama: tokenData.nama || null,
      url_foto: tokenData.url_foto || null,
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

  fetchProfile: async () => {
    const token = get().accessToken || localStorage.getItem("makarya_token");
    if (!token) return null;
    try {
      const { authApi } = await import("../api");
      const res = await authApi.getMe();
      if (res?.data) {
        const currentUser = get().user || {};
        const updatedUser = {
          ...currentUser,
          ...res.data,
          url_foto: res.data.url_foto || currentUser.url_foto,
          nama:
            res.data.nama_lengkap ||
            res.data.nama_usaha ||
            currentUser.nama ||
            currentUser.email?.split("@")[0],
        };
        localStorage.setItem("makarya_user", JSON.stringify(updatedUser));
        set({ user: updatedUser });
        return updatedUser;
      }
    } catch (_) {}
    return null;
  },

  updateToken: (newToken) => {
    localStorage.setItem("makarya_token", newToken);
    set({ accessToken: newToken });
  },

  updateUser: (updatedData) => {
    const currentUser = get().user || {};
    const newUser = { ...currentUser, ...updatedData };
    localStorage.setItem("makarya_user", JSON.stringify(newUser));
    set({ user: newUser });
    return newUser;
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
