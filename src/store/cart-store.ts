import { create } from "zustand";
import type { CartItem, Product, ProductExtra } from "@/types";

type AddItemInput = {
  product: Product;
  quantity?: number;
  selectedExtras?: ProductExtra[];
};

type CartStore = {
  items: CartItem[];
  addItem: (input: AddItemInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
};

function buildLineId(productId: string, selectedExtras: ProductExtra[]): string {
  const extrasKey = selectedExtras
    .map((extra) => extra.id)
    .sort()
    .join("-");
  return `${productId}::${extrasKey || "base"}`;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: ({ product, quantity = 1, selectedExtras = [] }) => {
    const lineId = buildLineId(product.id, selectedExtras);

    set((state) => {
      const existing = state.items.find((item) => item.lineId === lineId);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        lineId,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.imageUrl,
        basePrice: product.price,
        quantity,
        selectedExtras,
      };

      return { items: [...state.items, newItem] };
    });
  },
  removeItem: (lineId) =>
    set((state) => ({
      items: state.items.filter((item) => item.lineId !== lineId),
    })),
  updateQuantity: (lineId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.lineId !== lineId),
        };
      }

      return {
        items: state.items.map((item) =>
          item.lineId === lineId ? { ...item, quantity } : item
        ),
      };
    }),
  clearCart: () => set({ items: [] }),
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
}));
