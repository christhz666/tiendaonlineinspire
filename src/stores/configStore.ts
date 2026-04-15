import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminTab = "manage" | "import" | "orders" | "permissions";

export interface RolePermissions {
  admin: AdminTab[];
  staff: AdminTab[];
  viewer: AdminTab[];
}

interface ConfigStore {
  permissions: RolePermissions;
  updatePermissions: (role: keyof RolePermissions, tabs: AdminTab[]) => void;
}

const defaultPermissions: RolePermissions = {
  admin: ["manage", "import", "orders", "permissions"],
  staff: ["manage", "orders"],
  viewer: ["manage"],
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      permissions: defaultPermissions,
      updatePermissions: (role, tabs) => 
        set((state) => ({
          permissions: {
            ...state.permissions,
            [role]: tabs,
          },
        })),
    }),
    {
      name: "config-storage",
    }
  )
);
