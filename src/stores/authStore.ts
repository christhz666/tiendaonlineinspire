import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  role: "admin";
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  login: (password: string) => boolean;
  logout: () => void;
}

// Simple hash function for demo (use bcrypt in production)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (password: string) => {
        const inputHash = simpleHash(password);

        // Admin password from env or fallback (for development only)
        const adminHash = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH
          ? process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH
          : simpleHash("@Cristopher7.0930"); // Fallback for dev, remove in prod

        if (inputHash === adminHash) {
          set({ isAuthenticated: true, user: { id: "admin", role: "admin" } });
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
