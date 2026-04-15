import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  role: "admin" | "staff" | "viewer";
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (password: string) => {
        // Mapeo simple de contraseñas a roles
        if (password === "@Cristopher7.0930") {
          set({ isAuthenticated: true, user: { id: "admin", role: "admin" } });
          return true;
        }
        if (password === "staff123") {
          set({ isAuthenticated: true, user: { id: "staff", role: "staff" } });
          return true;
        }
        if (password === "viewer123") {
          set({ isAuthenticated: true, user: { id: "viewer", role: "viewer" } });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
