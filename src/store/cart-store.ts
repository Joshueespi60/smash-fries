"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clampInteger, clampNumber, sanitizeTextInput } from "@/lib/security";
import type { CartAddon, CartItem, Product } from "@/types";

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 20;
const MAX_PRODUCT_PRICE = 500;
const MAX_ADDON_PRICE = 100;
const MAX_CART_LINES = 60;
const MAX_DELIVERY_FEE = 200;

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

function sanitizeAddon(addon: CartAddon): CartAddon | null {
  const safeId = sanitizeTextInput(addon.id, {
    maxLength: 64,
    collapseWhitespace: false,
  });
  if (!safeId) {
    return null;
  }

  return {
    id: safeId,
    name: sanitizeTextInput(addon.name, { maxLength: 80 }) || "Extra",
    price: clampNumber(addon.price, 0, MAX_ADDON_PRICE, 0),
  };
}

function sanitizeAddons(addons: CartAddon[]): CartAddon[] {
  const unique = new Map<string, CartAddon>();

  addons.forEach((addon) => {
    const safeAddon = sanitizeAddon(addon);
    if (!safeAddon) {
      return;
    }
    unique.set(safeAddon.id, safeAddon);
  });

  return [...unique.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function sanitizeCartItem(item: CartItem): CartItem | null {
  const safeProductId = sanitizeTextInput(item.product_id, {
    maxLength: 64,
    collapseWhitespace: false,
  });
  if (!safeProductId) {
    return null;
  }

  const safeAddons = sanitizeAddons(Array.isArray(item.addons) ? item.addons : []);
  const safeSlug = sanitizeTextInput(item.slug, {
    maxLength: 120,
    collapseWhitespace: false,
  });
  const safeName = sanitizeTextInput(item.name, { maxLength: 100 });

  return {
    line_id: buildLineId(safeProductId, safeAddons),
    product_id: safeProductId,
    slug: safeSlug || "producto",
    name: safeName || "Producto",
    unit_price: clampNumber(item.unit_price, 0, MAX_PRODUCT_PRICE, 0),
    image_url: sanitizeTextInput(item.image_url ?? "", {
      maxLength: 300,
      collapseWhitespace: false,
      stripHtml: false,
    }) || null,
    quantity: clampInteger(item.quantity, MIN_QUANTITY, MAX_QUANTITY, MIN_QUANTITY),
    addons: safeAddons,
  };
}

function sanitizeStoredItems(items: CartItem[]): CartItem[] {
  const safeMap = new Map<string, CartItem>();

  items.slice(0, MAX_CART_LINES).forEach((item) => {
    const safeItem = sanitizeCartItem(item);
    if (!safeItem) {
      return;
    }

    const existing = safeMap.get(safeItem.line_id);
    if (existing) {
      existing.quantity = clampInteger(
        existing.quantity + safeItem.quantity,
        MIN_QUANTITY,
        MAX_QUANTITY,
        MIN_QUANTITY
      );
      return;
    }

    safeMap.set(safeItem.line_id, safeItem);
  });

  return [...safeMap.values()];
}

function computeTotals(items: CartItem[], deliveryFee: number) {
  const safeFee = clampNumber(deliveryFee, 0, MAX_DELIVERY_FEE, 0);
  const subtotal = items.reduce((sum, item) => {
    const safeQuantity = clampInteger(item.quantity, MIN_QUANTITY, MAX_QUANTITY, MIN_QUANTITY);
    const safePrice = clampNumber(item.unit_price, 0, MAX_PRODUCT_PRICE, 0);
    const addonsValue = item.addons.reduce(
      (acc, addon) => acc + clampNumber(addon.price, 0, MAX_ADDON_PRICE, 0),
      0
    );

    return sum + (safePrice + addonsValue) * safeQuantity;
  }, 0);

  return {
    subtotal,
    total: subtotal + safeFee,
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
        const safeQuantity = clampInteger(quantity, MIN_QUANTITY, MAX_QUANTITY, MIN_QUANTITY);
        const safeAddons = sanitizeAddons(addons);
        const safeProductId = sanitizeTextInput(product.id, {
          maxLength: 64,
          collapseWhitespace: false,
        });

        if (!safeProductId) {
          return;
        }

        const lineId = buildLineId(safeProductId, safeAddons);

        set((state) => {
          const currentItem = state.items.find((item) => item.line_id === lineId);
          const nextItems = currentItem
            ? state.items.map((item) =>
                item.line_id === lineId
                  ? {
                      ...item,
                      quantity: clampInteger(
                        item.quantity + safeQuantity,
                        MIN_QUANTITY,
                        MAX_QUANTITY,
                        MIN_QUANTITY
                      ),
                    }
                  : item
              )
            : [
                ...state.items.slice(0, Math.max(0, MAX_CART_LINES - 1)),
                {
                  line_id: lineId,
                  product_id: safeProductId,
                  slug:
                    sanitizeTextInput(product.slug, {
                      maxLength: 120,
                      collapseWhitespace: false,
                    }) || "producto",
                  name: sanitizeTextInput(product.name, { maxLength: 100 }) || "Producto",
                  unit_price: clampNumber(product.price, 0, MAX_PRODUCT_PRICE, 0),
                  image_url:
                    sanitizeTextInput(product.image_url ?? "", {
                      maxLength: 300,
                      collapseWhitespace: false,
                      stripHtml: false,
                    }) || null,
                  quantity: safeQuantity,
                  addons: safeAddons,
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
            item.line_id === lineId
              ? {
                  ...item,
                  quantity: clampInteger(
                    item.quantity + 1,
                    MIN_QUANTITY,
                    MAX_QUANTITY,
                    MIN_QUANTITY
                  ),
                }
              : item
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
          const nextItems = state.items.map((item) =>
            item.line_id === lineId
              ? {
                  ...item,
                  quantity: clampInteger(
                    item.quantity - 1,
                    MIN_QUANTITY,
                    MAX_QUANTITY,
                    MIN_QUANTITY
                  ),
                }
              : item
          );

          const totals = computeTotals(nextItems, state.deliveryFee);
          return {
            items: nextItems,
            ...totals,
          };
        });
      },

      clearCart: () => {
        const fee = clampNumber(get().deliveryFee, 0, MAX_DELIVERY_FEE, 0);
        set({
          items: [],
          subtotal: 0,
          total: fee,
        });
      },

      setDeliveryFee: (value) => {
        set((state) => {
          const deliveryFee = clampNumber(value, 0, MAX_DELIVERY_FEE, 0);
          if (state.deliveryFee === deliveryFee) {
            return state;
          }
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

        state.items = sanitizeStoredItems(Array.isArray(state.items) ? state.items : []);
        state.deliveryFee = clampNumber(state.deliveryFee, 0, MAX_DELIVERY_FEE, 0);
        const totals = computeTotals(state.items, state.deliveryFee);
        state.subtotal = totals.subtotal;
        state.total = totals.total;
      },
    }
  )
);
