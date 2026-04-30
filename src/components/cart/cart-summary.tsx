"use client";

import Link from "next/link";
import { useMemo } from "react";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export function CartSummary() {
  const { items, clearCart, removeItem, updateQuantity } = useCartStore(
    (state) => ({
      items: state.items,
      clearCart: state.clearCart,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
    })
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const extrasTotal = item.selectedExtras.reduce(
          (extraSum, extra) => extraSum + extra.price,
          0
        );
        return sum + (item.basePrice + extrasTotal) * item.quantity;
      }, 0),
    [items]
  );

  const whatsappUrl = useMemo(
    () => buildWhatsAppOrderUrl({ items }),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <p className="text-sm text-zinc-300">
          Tu carrito está vacío. Agrega productos desde el menú para empezar.
        </p>
        <Link
          href="/menu"
          className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          Ver menú
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.lineId}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-amber-300">
                {formatCurrency(item.basePrice * item.quantity)}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                className="rounded-md border border-zinc-700 px-3 py-1 text-sm"
              >
                -
              </button>
              <span className="min-w-10 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                className="rounded-md border border-zinc-700 px-3 py-1 text-sm"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.lineId)}
                className="ml-auto rounded-md border border-red-700 px-3 py-1 text-sm text-red-300"
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <p className="text-sm text-zinc-300">Subtotal</p>
        <p className="text-2xl font-bold text-amber-300">
          {formatCurrency(subtotal)}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Enviar por WhatsApp
          </a>
          <button
            type="button"
            onClick={clearCart}
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200"
          >
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  );
}
