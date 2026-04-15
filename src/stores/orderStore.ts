"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    phone: string;
  };
  status: "pending" | "paid" | "shipped";
}

interface OrderStore {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "date">) => Promise<void>;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      fetchOrders: async () => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false });

          if (error) throw error;
          if (data) set({ orders: data as Order[] });
        } catch (err) {
          console.error("Error fetching orders from Supabase:", err);
        }
      },

      addOrder: async (order) => {
        const newOrder: Order = {
          ...order,
          id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          date: new Date().toISOString(),
        };

        // Guardar en Supabase (Sync)
        try {
          const { error } = await supabase.from('orders').insert([newOrder]);
          if (error) console.warn("Could not sync order to Supabase:", error.message);
        } catch (err) {
          console.error("Supabase Sync Error:", err);
        }

        // Siempre guardar local para respuesta inmediata
        set((state) => ({ orders: [newOrder, ...state.orders] }));
      },

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "order-storage",
    }
  )
);
