import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { Product, CartItem } from "@/lib/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTaxAmount: () => number;
  getShippingCost: () => number;
  getGrandTotal: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.variantId === item.variantId
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return {
            items: [
              ...state.items,
              { ...item, id: crypto.randomUUID() },
            ],
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      openCart: () => {
        set({ isOpen: true });
      },
      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getTaxAmount: () => {
        // ITBIS 18%
        return Math.round(get().getTotalPrice() * 0.18);
      },

      getShippingCost: () => {
        // Default shipping config
        const subtotal = get().getTotalPrice();
        if (subtotal === 0) return 0;
        // Free shipping if > 5000 units (e.g. 50 USD if base is cents)
        // Adjust logic as needed. For now, let's keep it simple.
        return 0; // Free for now as requested elsewhere, or set to a flat rate
      },

      getGrandTotal: () => {
        return get().getTotalPrice() + get().getTaxAmount() + get().getShippingCost();
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export { useCartStore };
export const useCartItems = () => useCartStore(useShallow((state) => state.items));
export const useCartTotal = () => {
  const store = useCartStore();
  return {
    items: store.getTotalItems(),
    subtotal: store.getTotalPrice(),
    tax: store.getTaxAmount(),
    shipping: store.getShippingCost(),
    total: store.getGrandTotal()
  };
};
export const useCartOpen = () => useCartStore((state) => state.isOpen);