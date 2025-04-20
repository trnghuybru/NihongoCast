import { create } from "zustand";
import { logout as apiLogout } from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }), // ✅ Đây là cái bạn đang thiếu
  logout: () => {
    apiLogout();
    set({ user: null });
  },
}));

export default useAuthStore;
