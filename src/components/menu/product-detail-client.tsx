"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { ProductVisual } from "@/components/shared/product-visual";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { CartAddon, Product } from "@/types";

type ProductDetailClientProps = {
  product: Product;
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<CartAddon[]>([]);

  const addons = product.addons ?? [];

  const addonsTotal = useMemo(
    () => selectedAddons.reduce((sum, addon) => sum + addon.price, 0),
    [selectedAddons]
  );

  const total = useMemo(
    () => (product.price + addonsTotal) * quantity,
    [addonsTotal, product.price, quantity]
  );

  const toggleAddon = (addon: CartAddon) => {
    setSelectedAddons((current) => {
      const exists = current.some((item) => item.id === addon.id);
      if (exists) {
        return current.filter((item) => item.id !== addon.id);
      }
      return [...current, addon];
    });
  };

  const handleAdd = () => {
    addItem(product, quantity, selectedAddons);
    toast.success("Producto agregado al carrito");
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <article className="overflow-hidden rounded-3xl border border-border bg-card/90">
        <ProductVisual
          name={product.name}
          imageUrl={product.image_url}
          className="aspect-square"
        />
      </article>

      <article className="space-y-5 rounded-3xl border border-border bg-card/90 p-6">
        <div>
          <h1 className="text-3xl font-black text-foreground">{product.name}</h1>
          <p className="mt-2 text-muted-foreground">{product.description}</p>
          {product.ingredients ? (
            <p className="mt-3 text-sm text-muted-foreground/80">
              Ingredientes: {product.ingredients}
            </p>
          ) : null}
          <p className="mt-4 text-2xl font-black text-accent">
            {formatCurrency(product.price)}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Cantidad
          </p>
          <div className="inline-flex items-center rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="p-2 text-foreground hover:bg-secondary"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-12 text-center text-sm font-semibold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((value) => value + 1)}
              className="p-2 text-foreground hover:bg-secondary"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Extras
          </p>
          {addons.length === 0 ? (
            <p className="text-sm text-muted-foreground/80">No hay extras para este producto.</p>
          ) : (
            <ul className="space-y-2">
              {addons.map((addon) => {
                const checked = selectedAddons.some((item) => item.id === addon.id);
                return (
                  <li
                    key={addon.id}
                    className="flex items-center justify-between rounded-xl border border-border px-3 py-2"
                  >
                    <label className="flex items-center gap-2 text-sm text-foreground/90">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleAddon({
                            id: addon.id,
                            name: addon.name,
                            price: addon.price,
                          })
                        }
                      />
                      {addon.name}
                    </label>
                    <span className="text-sm text-accent">
                      +{formatCurrency(addon.price)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">Total dinamico</p>
          <p className="text-2xl font-black text-accent">{formatCurrency(total)}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <ShoppingCart className="size-4" />
            Agregar al carrito
          </button>
          <Link
            href="/menu"
            className="rounded-xl border border-border px-4 py-2 font-semibold text-foreground/90"
          >
            Volver al menu
          </Link>
        </div>
      </article>
    </section>
  );
}
