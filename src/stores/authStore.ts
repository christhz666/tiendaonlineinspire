"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";

interface AuthUser {
  id: string;
  username: string;
  role: "admin";
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

let initPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  initialize: async () => {
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          set({ user: null, isAuthenticated: false, loading: false });
          return;
        }

        const { data: adminRow } = await supabase
          .from("admin_users")
          .select("id, username")
          .eq("id", authUser.id)
          .maybeSingle();

        if (!adminRow) {
          set({ user: null, isAuthenticated: false, loading: false });
          return;
        }

        set({
          user: {
            id: authUser.id,
            username: adminRow.username,
            role: "admin",
          },
          isAuthenticated: true,
          loading: false,
        });
      } catch (err) {
        console.error("[authStore] init error:", err);
        set({ user: null, isAuthenticated: false, loading: false });
      } finally {
        initPromise = null;
      }
    })();

    return initPromise;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
  },
}));

// Auto-initialize on the client + listen for auth changes
if (typeof window !== "undefined") {
  useAuthStore.getState().initialize();

  supabase.auth.onAuthStateChange(() => {
    useAuthStore.getState().initialize();
  });
}
