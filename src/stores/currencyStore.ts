"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyInfo } from "@/lib/currency";
import { DEFAULT_CURRENCY, detectUserCurrency, formatLocalPrice } from "@/lib/currency";

interface CurrencyStore {
  currency: CurrencyInfo;
  detected: boolean;
  loading: boolean;

  // Actions
  detect: () => Promise<void>;
  setCurrency: (currency: CurrencyInfo) => void;
  format: (cents: number) => string;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currency: DEFAULT_CURRENCY,
      detected: false,
      loading: false,

      detect: async () => {
        set({ loading: true });
        try {
          if (get().detected) {
            // Ya sabemos la moneda por persistencia, pero OBLIGAMOS a actualizar el rate (+1 en tiempo real)
            const { syncLatestRates, CURRENCY_MAP } = await import("@/lib/currency");
            await syncLatestRates();
            const current = get().currency;
            
            // Buscamos la moneda persistida en el mapa actualizado para tomar su nuevo rate
            const updatedCurrency = Object.values(CURRENCY_MAP).find(c => c.code === current.code);
            if (updatedCurrency) {
              set({ currency: { ...updatedCurrency } });
            }
            return;
          }

          // Si es la primera vez, se detecta el país y descarga rates
          const currency = await detectUserCurrency();
          set({ currency, detected: true });
        } finally {
          set({ loading: false });
        }
      },

      setCurrency: (currency) => set({ currency, detected: true }),

      format: (cents: number) => formatLocalPrice(cents, get().currency),
    }),
    {
      name: "currency-storage",
      // Solo persistir la moneda elegida, no el estado de carga
      partialize: (state) => ({
        currency: state.currency,
        detected: state.detected,
      }),
    }
  )
);
