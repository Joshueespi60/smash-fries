"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartAddon, CartItem, Product } from "@/types";

type CartStore = {
  items: CartItem[];
  deliveryFee: number;
  subtotal: number;
  total: number;
  addItem: (product: Product, quantity: number, addons?: CartAddon[]) => void;
  removeItem: (lineId: string) => void;
  increaseQuantity: (lineId: string) => void;
  decreaseQuantity: (lineId: string) => void;
  clearCart: () => void;
  setDeliveryFee: (value: number) => void;
};

function buildLineId(productId: string, addons: CartAddon[]): string {
  const addonKey = addons
    .map((addon) => addon.id)
    .sort()
    .join("-");
  return `${productId}-${addonKey || "base"}`;
}

function computeTotals(items: CartItem[], deliveryFee: number) {
  const subtotal = items.reduce((sum, item) => {
    const addonsValue = item.addons.reduce((acc, addon) => acc + addon.price, 0);
    return sum + (item.unit_price + addonsValue) * item.quantity;
  }, 0);

  return {
    subtotal,
    total: subtotal + deliveryFee,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryFee: 0,
      subtotal: 0,
      total: 0,

      addItem: (product, quantity, addons = []) => {
        const safeQuantity = Math.max(quantity, 1);
        const lineId = buildLineId(product.id, addons);

        set((state) => {
          const currentItem = state.items.find((item) => item.line_id === lineId);
          const nextItems = currentItem
            ? state.items.map((item) =>
                item.line_id === lineId
                  ? { ...item, quantity: item.quantity + safeQuantity }
                  : item
              )
            : [
                ...state.items,
                {
                  line_id: lineId,
                  product_id: product.id,
                  slug: product.slug,
                  name: product.name,
                  unit_price: product.price,
                  image_url: product.image_url,
                  quantity: safeQuantity,
                  addons,
                },
              ];

          const totals = computeTotals(nextItems, state.deliveryFee);
          return {
            items: nextItems,
            ...totals,
          };
        });
      },

      removeItem: (lineId) => {
        set((state) => {
          const nextItems = state.items.filter((item) => item.line_id !== lineId);
          const totals = computeTotals(nextItems, state.deliveryFee);
          return {
            items: nextItems,
            ...totals,
          };
        });
      },

      increaseQuantity: (lineId) => {
        set((state) => {
          const nextItems = state.items.map((item) =>
            item.line_id === lineId ? { ...item, quantity: item.quantity + 1 } : item
          );
          const totals = computeTotals(nextItems, state.deliveryFee);
          return {
            items: nextItems,
            ...totals,
          };
        });
      },

      decreaseQuantity: (lineId) => {
        set((state) => {
          const nextItems = state.items
            .map((item) =>
              item.line_id === lineId
                ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                : item
            )
            .filter((item) => item.quantity > 0);

          const totals = computeTotals(nextItems, state.deliveryFee);
          return {
            items: nextItems,
            ...totals,
          };
        });
      },

      clearCart: () => {
        const fee = get().deliveryFee;
        set({
          items: [],
          subtotal: 0,
          total: fee,
        });
      },

      setDeliveryFee: (value) => {
        set((state) => {
          const deliveryFee = Math.max(value, 0);
          const totals = computeTotals(state.items, deliveryFee);
          return {
            deliveryFee,
            ...totals,
          };
        });
      },
    }),
    {
      name: "smash-fries-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        deliveryFee: state.deliveryFee,
        subtotal: state.subtotal,
        total: state.total,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        const totals = computeTotals(state.items, state.deliveryFee);
        state.subtotal = totals.subtotal;
        state.total = totals.total;
      },
    }
  )
);
