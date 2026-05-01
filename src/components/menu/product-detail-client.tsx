"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { ProductVisual } from "@/components/shared/product-visual";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { CartAddon, Product } from "@/types";

type ProductDetailClientProps = {
  product: Product;
  relatedProducts?: Product[];
};

export function ProductDetailClient({
  product,
  relatedProducts = [],
}: ProductDetailClientProps) {
  const router = useRouter();
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
    if (!product.is_available) {
      toast.error("Este producto no está disponible ahora");
      return;
    }

    const extrasCountText =
      selectedAddons.length === 1
        ? "1 extra"
        : `${selectedAddons.length} extras`;

    addItem(product, quantity, selectedAddons);
    toast.success("Producto agregado al carrito", {
      description:
        selectedAddons.length > 0
          ? `${quantity} x ${product.name} con ${extrasCountText} añadido correctamente a tu pedido`
          : `${quantity} x ${product.name} añadido correctamente a tu pedido`,
      action: {
        label: "Ver carrito",
        onClick: () => router.push("/carrito"),
      },
      cancel: {
        label: "Seguir comprando",
        onClick: () => undefined,
      },
      duration: 5000,
    });
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
        <article className="self-start overflow-hidden rounded-3xl border border-border bg-card/90">
          <ProductVisual
            name={product.name}
            imageUrl={product.image_url}
            className="w-full aspect-[4/3] sm:aspect-square"
          />
        </article>

        <article className="space-y-5 rounded-3xl border border-border bg-card/90 p-6 md:p-7">
          <div>
            <h1 className="text-3xl font-black text-foreground">{product.name}</h1>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground/90">
              Tiempo estimado: 10–15 min
            </p>
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
                disabled={quantity === 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="p-2 text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-45"
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
              Personaliza tu pedido
            </p>
            {addons.length === 0 ? (
              <p className="text-sm text-muted-foreground/80">
                No hay extras para este producto.
              </p>
            ) : (
              <ul className="space-y-2">
                {addons.map((addon) => {
                  const checked = selectedAddons.some((item) => item.id === addon.id);
                  return (
                    <li key={addon.id}>
                      <button
                        type="button"
                        onClick={() =>
                          toggleAddon({
                            id: addon.id,
                            name: addon.name,
                            price: addon.price,
                          })
                        }
                        aria-pressed={checked}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          checked
                            ? "border-primary/60 bg-primary/10"
                            : "border-border hover:bg-secondary/60"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-sm text-foreground/90">
                          <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            tabIndex={-1}
                            className="pointer-events-none"
                          />
                          {addon.name}
                        </span>
                        <span className="text-sm text-accent">
                          +{formatCurrency(addon.price)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-muted/50 p-5">
            <div className="flex items-end justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-black text-accent">{formatCurrency(total)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 sm:w-auto"
            >
              <ShoppingCart className="size-4" />
              Agregar al carrito
            </button>
            <Link
              href="/menu"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border px-5 text-center text-sm font-semibold text-foreground/90 transition hover:bg-secondary sm:w-auto"
            >
              Volver al menú
            </Link>
          </div>
        </article>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="space-y-4 pt-2">
          <h2 className="text-2xl font-black text-foreground">También te puede gustar</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/producto/${item.slug}`}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card/90 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ProductVisual
                  name={item.name}
                  imageUrl={item.image_url}
                  className="aspect-[16/10] w-full"
                />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-base font-bold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground/90">{item.description}</p>
                  <p className="mt-auto text-base font-black text-accent">
                    {formatCurrency(item.price)}
                  </p>
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary transition group-hover:text-primary/80">
                    Ver producto
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
