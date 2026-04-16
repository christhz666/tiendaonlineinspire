import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminTab = "manage" | "import" | "affiliate";

interface ConfigStore {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      activeTab: "manage",
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "config-storage",
    }
  )
);
